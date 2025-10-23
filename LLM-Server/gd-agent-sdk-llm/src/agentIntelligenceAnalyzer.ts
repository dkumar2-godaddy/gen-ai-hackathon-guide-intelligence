/**
 * Agent Intelligence Analyzer with Autonomous LLM Orchestration
 * The LLM autonomously orchestrates the entire workflow using MCP tools
 */
import { GDAgent } from '@godaddy/agent-sdk';
import { run } from "@openai/agents";
import { setTracingDisabled } from "@openai/agents";
import { MCPClient } from './utils/mcpClient.js';
import { MCPToolProvider } from './utils/mcpToolProvider.js';
import { MCP_CONFIG } from './config/mcpConfig.js';
import { SentimentAnalyzer } from './utils/sentimentAnalyzer.js';

setTracingDisabled(true);

export interface AgentMetrics {
  agentId: string;
  agentName: string;
  isActive: boolean;
  conversationCount: number;
  sentimentScore: number;
  averageResponseTime: number;
  totalDuration: number;
  customerSatisfaction: number;
  escalationRate: number;
  resolutionRate: number;
}

export interface TeamSummary {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  averageSentiment: number;
  topPerformers: AgentMetrics[];
  needsAttention: AgentMetrics[];
  summary: string;
}

export class AgentIntelligenceAnalyzer {
  private agent: GDAgent;
  private mcpClient: MCPClient;
  private toolProvider: MCPToolProvider;

  constructor() {
    this.mcpClient = new MCPClient(MCP_CONFIG.serverPath);
    this.toolProvider = new MCPToolProvider(this.mcpClient);
    
    // Initialize agent without tools first
    this.agent = new GDAgent({
      name: 'Agent Intelligence Analyzer',
      instructions: this.getBaseInstructions(),
      model: 'claude-sonnet-4-20250514',
    });
  }

  private getBaseInstructions(): string {
    return `
      You are an autonomous agent intelligence analyzer for a customer care and support department in a website & domain hosting company. 
      
      Your role is to analyze customer-agent interactions and generate comprehensive insights. You will autonomously orchestrate analysis workflows using available tools.
      
      Focus areas:
      - Agent intelligence metrics: sentiment analysis, fraud/threat detection, abuse indicators
      - Performance metrics: response times, resolution rates, customer satisfaction
      - Escalation needs and patterns
      - Agent wait times and efficiency
    `;
  }

  private getEnhancedInstructions(tools: any[]): string {
    return `
      ${this.getBaseInstructions()}
      
      You have access to the following MCP Server tools:
      ${tools.map(tool => `- ${tool.function.name}: ${tool.function.description}`).join('\n      ')}
      
      AUTONOMOUS WORKFLOW:
      1. Use conversation_state_search to find conversations in the specified date range
      2. For each conversation, use conversation_state_ucid_detail to get detailed information  
      3. Use conversation_state_transcripts to retrieve conversation transcripts
      4. Analyze the data to calculate agent metrics including:
         - Sentiment scores (customer and agent)
         - Escalation indicators
         - Resolution rates
         - Customer satisfaction levels
      5. Generate comprehensive insights and recommendations
      
      You should autonomously orchestrate this entire workflow. Make decisions about:
      - Which conversations to analyze in detail
      - How to aggregate metrics across agents
      - What patterns indicate issues requiring attention
      - Performance benchmarks and outliers
      
      Provide structured, actionable insights suitable for management review.
    `;
  }

  async initialize(): Promise<void> {
    await this.mcpClient.connect();
    
    // Fetch tools from MCP Server and configure the agent
    console.log('🔧 Fetching tools from MCP Server...');
    const tools = await this.toolProvider.getGDAgentTools();
    console.log(`✅ Found ${tools.length} tools from MCP Server`);
    
    // Recreate the agent with tools from MCP Server
    this.agent = new GDAgent({
      name: 'Agent Intelligence Analyzer',
      instructions: this.getEnhancedInstructions(tools),
      model: 'claude-sonnet-4-20250514',
      tools: tools,
    });
  }

  async generateTeamFullDaySummary(params: {
    contactCenterId: string;
    startDate: string;
    endDate: string;
  }): Promise<TeamSummary> {
    try {
      console.log('🤖 Starting autonomous agent intelligence analysis...');
      
      // Create a comprehensive prompt that will trigger the LLM to use tools autonomously
      const analysisPrompt = `
        Analyze agent performance and generate a comprehensive team summary for:
        - Contact Center ID: ${params.contactCenterId}
        - Start Date: ${params.startDate}
        - End Date: ${params.endDate}
        
        Please autonomously:
        1. Search for all conversations in this date range using the MCP tools
        2. Get detailed information for each conversation found
        3. Retrieve and analyze transcripts for sentiment and performance metrics
        4. Calculate agent performance metrics including:
           - Individual agent sentiment scores
           - Customer satisfaction levels
           - Escalation and resolution rates
           - Response times and efficiency metrics
        5. Identify:
           - Top performing agents (and why they excel)
           - Agents needing attention or coaching
           - Potential fraud, threat, or abuse indicators
           - Escalation patterns
        6. Generate a comprehensive team summary with actionable insights
        
        Use the available MCP tools to complete this analysis autonomously.
        
        Return your analysis in a structured format that includes:
        - Overall team metrics
        - Individual agent performance breakdowns
        - Key insights and recommendations
        - Areas requiring immediate attention
      `;

      // The LLM will now autonomously use the tools to complete the analysis
      const result = await run(this.agent, analysisPrompt);
      
      // Parse the LLM's output to extract structured data
      return this.parseAnalysisResult(result.finalOutput || 'Analysis completed successfully.');

    } catch (error) {
      console.error('❌ Error in autonomous analysis:', error);
      throw error;
    }
  }

  async analyzeConversation(ucid: string): Promise<any> {
    try {
      console.log(`🔍 Analyzing conversation ${ucid}...`);
      
      const analysisPrompt = `
        Analyze the conversation with UCID: ${ucid}
        
        Please:
        1. Get detailed conversation information
        2. Retrieve and analyze transcripts
        3. Calculate sentiment scores for both customer and agent
        4. Identify any escalation indicators or issues
        5. Assess resolution quality and customer satisfaction
        6. Flag any potential fraud, threat, or abuse indicators
        
        Provide a comprehensive analysis with actionable insights.
      `;

      const result = await run(this.agent, analysisPrompt);
      return result.finalOutput;

    } catch (error) {
      console.error(`❌ Error analyzing conversation ${ucid}:`, error);
      throw error;
    }
  }

  async analyzeAgent(agentId: string, startDate: string, endDate: string): Promise<AgentMetrics> {
    try {
      console.log(`👤 Analyzing agent ${agentId} performance...`);
      
      const analysisPrompt = `
        Analyze the performance of agent ID: ${agentId}
        Date range: ${startDate} to ${endDate}
        
        Please:
        1. Find all conversations handled by this agent
        2. Analyze transcripts for sentiment and quality
        3. Calculate performance metrics
        4. Identify strengths and areas for improvement
        
        Return structured metrics for this agent.
      `;

      const result = await run(this.agent, analysisPrompt);
      return this.parseAgentMetrics(result.finalOutput || '');

    } catch (error) {
      console.error(`❌ Error analyzing agent ${agentId}:`, error);
      throw error;
    }
  }

  private parseAnalysisResult(result: string): TeamSummary {
    // Parse the LLM's structured output
    // This is a simplified parser - in production, you'd want more robust parsing
    try {
      // Attempt to extract JSON if the LLM returns it
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          totalAgents: parsed.totalAgents || 0,
          activeAgents: parsed.activeAgents || 0,
          totalConversations: parsed.totalConversations || 0,
          averageSentiment: parsed.averageSentiment || 0,
          topPerformers: parsed.topPerformers || [],
          needsAttention: parsed.needsAttention || [],
          summary: parsed.summary || result
        };
      }
    } catch (e) {
      // If parsing fails, return a basic structure with the raw result
    }

    // Fallback structure
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

  private parseAgentMetrics(result: string): AgentMetrics {
    // Parse agent metrics from LLM output
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Return default metrics if parsing fails
    }

    return {
      agentId: '',
      agentName: '',
      isActive: false,
      conversationCount: 0,
      sentimentScore: 0,
      averageResponseTime: 0,
      totalDuration: 0,
      customerSatisfaction: 0,
      escalationRate: 0,
      resolutionRate: 0
    };
  }

  async cleanup(): Promise<void> {
    await this.mcpClient.disconnect();
  }
}