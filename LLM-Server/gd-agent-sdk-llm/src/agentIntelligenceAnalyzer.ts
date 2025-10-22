/**
 * Agent Intelligence Analyzer with MCP Tool Integration
 * Manual orchestration approach with explicit control over workflow
 */
import { run } from "@openai/agents";
import { ConversationStateTools } from './utils/mcpClient.js';
import { SentimentAnalyzer } from './utils/sentimentAnalyzer.js';
import { BaseAgentIntelligenceAnalyzer, AgentMetrics, TeamSummary } from './baseAgentIntelligenceAnalyzer.js';

export class AgentIntelligenceAnalyzer extends BaseAgentIntelligenceAnalyzer {
  private conversationTools: ConversationStateTools;

  constructor() {
    super(
      'Agent Intelligence Analyzer',
      `
        You are a part of the customer care and support department in a website & domain hosting company. 
        Customers can use the chat or call service to talk to support agents also called guides to raise their concerns 
        and get the queries resolved. These transcripts and conversation related details are stored for later use. 
        You will be provided the transcripts and related metadata, you need to generate insights into customer and agent interaction. 
        The theme of analysis is agent intelligence - that supports customer and guide sentiment to flag fraud, threat, abuse and escalation needs, 
        along with other metrics like the customer or agent wait times.
      `
    );
    this.conversationTools = new ConversationStateTools(this.mcpClient);
  }

  protected getEnhancedInstructions(tools: any[]): string {
    return `
      You are a part of the customer care and support department in a website & domain hosting company. 
      Customers can use the chat or call service to talk to support agents also called guides to raise their concerns 
      and get the queries resolved. These transcripts and conversation related details are stored for later use. 
      You will be provided the transcripts and related metadata, you need to generate insights into customer and agent interaction. 
      The theme of analysis is agent intelligence - that supports customer and guide sentiment to flag fraud, threat, abuse and escalation needs, 
      along with other metrics like the customer or agent wait times.
      
      You have access to the following tools from the MCP Server:
      ${tools.map(tool => `- ${tool.function.name}: ${tool.function.description}`).join('\n      ')}
      
      Use these tools autonomously to complete your analysis tasks.
    `;
  }

  async generateTeamFullDaySummary(params: {
    contactCenterId: string;
    startDate: string;
    endDate: string;
  }): Promise<TeamSummary> {
    try {
      // Step 1: Search for conversations in the date range
      console.log('🔍 Searching for conversations in date range...');
      const searchResponse = await this.conversationTools.searchConversations({
        contactCenterId: params.contactCenterId,
        startDate: params.startDate,
        endDate: params.endDate,
        limit: 100
      });

      if (searchResponse.status !== 'success') {
        throw new Error(`Search failed: ${searchResponse.error || searchResponse.message}`);
      }

      const conversations = searchResponse.data || [];
      console.log(`📊 Found ${conversations.length} conversations`);

      if (conversations.length === 0) {
        return {
          totalAgents: 0,
          activeAgents: 0,
          totalConversations: 0,
          averageSentiment: 0,
          topPerformers: [],
          needsAttention: [],
          summary: 'No conversations found for the specified date range.'
        };
      }

      // Step 2: Extract UCIDs and get detailed conversation data
      const ucids = conversations.map((conv: any) => conv.conversationInfo?.ucid).filter(Boolean);
      console.log(`🔗 Processing ${ucids.length} unique conversations...`);

      const agentMetricsMap = new Map<string, AgentMetrics>();
      const allTranscripts: any[] = [];

      // Process each UCID to get detailed conversation data and transcripts
      for (const ucid of ucids) {
        try {
          // Get contact details with conversations
          const contactResponse = await this.conversationTools.getContactDetails({
            ucid,
            includeConversations: true
          });

          if (contactResponse.status === 'success' && contactResponse.data) {
            const conversationData = contactResponse.data[0]?.conversationInfo;
            if (conversationData?.conversations) {
              // Process each conversation to extract agent metrics
              for (const conv of conversationData.conversations) {
                if (conv.agentId && conv.agentId !== 'CUSTOM_BOT') {
                  const agentId = conv.agentId;
                  if (!agentMetricsMap.has(agentId)) {
                    agentMetricsMap.set(agentId, {
                      agentId,
                      agentName: conv.agentDisplayName || agentId,
                      isActive: conv.state === 'ACTIVE',
                      conversationCount: 0,
                      sentimentScore: 0,
                      averageResponseTime: 0,
                      totalDuration: 0,
                      customerSatisfaction: 0,
                      escalationRate: 0,
                      resolutionRate: 0
                    });
                  }

                  const metrics = agentMetricsMap.get(agentId)!;
                  metrics.conversationCount++;
                  metrics.totalDuration += parseInt(conv.durationSeconds) || 0;
                }
              }
            }
          }

          // Get transcripts for sentiment analysis
          const transcriptResponse = await this.conversationTools.getTranscripts({ ucid });
          if (transcriptResponse.status === 'success' && transcriptResponse.data?.transcripts) {
            allTranscripts.push({
              ucid,
              transcripts: transcriptResponse.data.transcripts
            });
          }

        } catch (error) {
          console.warn(`⚠️ Error processing UCID ${ucid}:`, error);
        }
      }

      // Step 3: Analyze transcripts for sentiment and other metrics
      console.log('🧠 Analyzing transcripts for sentiment and metrics...');
      const agentMetrics = Array.from(agentMetricsMap.values());

        // Calculate sentiment scores and other metrics using improved sentiment analysis
        for (const agent of agentMetrics) {
          const agentTranscripts = allTranscripts.filter(t => 
            t.transcripts.some((msg: any) => 
              msg.participantRole === 'AGENT' && 
              msg.participantName === agent.agentName
            )
          );

          // Use improved sentiment analysis
          const performanceAnalysis = SentimentAnalyzer.analyzeAgentPerformance(agentTranscripts);
          
          agent.sentimentScore = Math.max(0, Math.min(1, (performanceAnalysis.overallSentiment.score + 1) / 2));
          agent.customerSatisfaction = performanceAnalysis.customerSatisfaction;
          agent.escalationRate = performanceAnalysis.escalationIndicators;
          agent.resolutionRate = performanceAnalysis.resolutionIndicators;
          agent.averageResponseTime = this.calculateAverageResponseTime(agentTranscripts);
        }

      // Step 4: Generate summary using LLM
      console.log('📝 Generating team summary...');
      const summaryPrompt = this.createTeamSummaryPrompt(agentMetrics, allTranscripts);
      const result = await run(this.agent, summaryPrompt);

      return {
        totalAgents: agentMetrics.length,
        activeAgents: agentMetrics.filter(a => a.isActive).length,
        totalConversations: conversations.length,
        averageSentiment: agentMetrics.reduce((sum, a) => sum + a.sentimentScore, 0) / agentMetrics.length,
        topPerformers: agentMetrics
          .sort((a, b) => b.sentimentScore - a.sentimentScore)
          .slice(0, 3),
        needsAttention: agentMetrics
          .filter(a => a.sentimentScore < 0.3 || a.escalationRate > 0.5)
          .sort((a, b) => a.sentimentScore - b.sentimentScore),
        summary: result.finalOutput || 'Analysis completed successfully.'
      };

    } catch (error) {
      console.error('❌ Error generating team summary:', error);
      throw error;
    }
  }


}
