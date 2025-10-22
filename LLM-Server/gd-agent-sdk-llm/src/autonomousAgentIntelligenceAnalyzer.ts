/**
 * Autonomous Agent Intelligence Analyzer with LLM Tool Integration
 * The LLM can now orchestrate the entire workflow using function calling
 */
import { run } from "@openai/agents";
import { SentimentAnalyzer } from './utils/sentimentAnalyzer.js';
import { BaseAgentIntelligenceAnalyzer, AgentMetrics, TeamSummary } from './baseAgentIntelligenceAnalyzer.js';

export class AutonomousAgentIntelligenceAnalyzer extends BaseAgentIntelligenceAnalyzer {

  constructor() {
    super(
      'Autonomous Agent Intelligence Analyzer',
      `
        You are an autonomous agent intelligence analyzer for a customer care and support department. 
        You have access to tools that allow you to:
        1. Search for conversations by date range and contact center
        2. Get detailed conversation information by UCID
        3. Retrieve conversation transcripts for analysis
        
        Your task is to analyze agent performance and generate comprehensive team summaries.
        
        WORKFLOW:
        1. Use conversation_state_search to find conversations in the specified date range
        2. For each conversation, use conversation_state_ucid_detail to get detailed information
        3. Use conversation_state_transcripts to get conversation transcripts for sentiment analysis
        4. Analyze the data to calculate agent metrics including sentiment, satisfaction, escalation rates
        5. Generate a comprehensive team summary with insights and recommendations
        
        You should autonomously orchestrate this entire workflow using the available tools.
        Focus on agent intelligence metrics: sentiment analysis, fraud/threat detection, escalation needs, and performance metrics.
      `
    );
  }

  protected getEnhancedInstructions(tools: any[]): string {
    return `
      You are an autonomous agent intelligence analyzer for a customer care and support department. 
      You have access to tools that allow you to:
      1. Search for conversations by date range and contact center
      2. Get detailed conversation information by UCID
      3. Retrieve conversation transcripts for analysis
      
      Your task is to analyze agent performance and generate comprehensive team summaries.
      
      WORKFLOW:
      1. Use conversation_state_search to find conversations in the specified date range
      2. For each conversation, use conversation_state_ucid_detail to get detailed information
      3. Use conversation_state_transcripts to get conversation transcripts for sentiment analysis
      4. Analyze the data to calculate agent metrics including sentiment, satisfaction, escalation rates
      5. Generate a comprehensive team summary with insights and recommendations
      
      You should autonomously orchestrate this entire workflow using the available tools.
      Focus on agent intelligence metrics: sentiment analysis, fraud/threat detection, escalation needs, and performance metrics.
      
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
      console.log('🤖 Starting autonomous analysis...');
      
      // Create a comprehensive prompt that will trigger the LLM to use tools autonomously
      const analysisPrompt = `
        Please analyze agent performance for the following parameters:
        - Contact Center ID: ${params.contactCenterId}
        - Start Date: ${params.startDate}
        - End Date: ${params.endDate}
        
        I need you to:
        1. Search for all conversations in this date range
        2. Get detailed information for each conversation
        3. Retrieve transcripts for sentiment analysis
        4. Calculate agent performance metrics
        5. Generate a comprehensive team summary
        
        Use the available tools to autonomously complete this analysis.
        Focus on agent intelligence metrics including sentiment, escalation indicators, and performance insights.
      `;

      // The LLM will now autonomously use the tools to complete the analysis
      const result = await run(this.agent, analysisPrompt);
      
      // Parse the result to extract structured data
      return this.parseAnalysisResult(result.finalOutput || 'Analysis completed successfully.');

    } catch (error) {
      console.error('❌ Error in autonomous analysis:', error);
      throw error;
    }
  }

  private parseAnalysisResult(result: string): TeamSummary {
    // This would parse the LLM's structured output
    // For now, return a placeholder structure
    return {
      totalAgents: 0,
      activeAgents: 0,
      totalConversations: 0,
      averageSentiment: 0,
      topPerformers: [],
      needsAttention: [],
      summary: result
    };
  }

  // Tool execution handlers that the LLM can call
  async executeTool(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'conversation_state_search':
        return await this.mcpClient.callTool('conversation_state_search', args);
      
      case 'conversation_state_ucid_detail':
        return await this.mcpClient.callTool('conversation_state_ucid_detail', args);
      
      case 'conversation_state_transcripts':
        return await this.mcpClient.callTool('conversation_state_transcripts', args);
      
      case 'analyze_sentiment':
        return await this.analyzeSentiment(args.transcripts, args.agentName);
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  private async analyzeSentiment(transcripts: any[], agentName: string): Promise<any> {
    // Use the existing sentiment analyzer
    const performanceAnalysis = SentimentAnalyzer.analyzeAgentPerformance(transcripts);
    
    return {
      overallSentiment: performanceAnalysis.overallSentiment,
      customerSatisfaction: performanceAnalysis.customerSatisfaction,
      escalationIndicators: performanceAnalysis.escalationIndicators,
      resolutionIndicators: performanceAnalysis.resolutionIndicators,
      agentName
    };
  }

}
