/**
 * Base Agent Intelligence Analyzer with Common Functionality
 * Eliminates duplication between manual and autonomous analyzers
 */
import { GDAgent } from '@godaddy/agent-sdk';
import { setTracingDisabled } from "@openai/agents";
import { MCPClient } from './utils/mcpClient.js';
import { MCPToolProvider } from './utils/mcpToolProvider.js';
import { MCP_CONFIG } from './config/mcpConfig.js';

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

export abstract class BaseAgentIntelligenceAnalyzer {
  protected agent: GDAgent;
  protected mcpClient: MCPClient;
  protected toolProvider: MCPToolProvider;

  constructor(agentName: string, instructions: string) {
    this.mcpClient = new MCPClient(MCP_CONFIG.serverPath);
    this.toolProvider = new MCPToolProvider(this.mcpClient);
    
    // Initialize agent without tools first
    this.agent = new GDAgent({
      name: agentName,
      instructions,
      model: 'claude-sonnet-4-20250514',
    });
  }

  async initialize(): Promise<void> {
    await this.mcpClient.connect();
    
    // Fetch tools from MCP Server and configure the agent
    console.log('🔧 Fetching tools from MCP Server...');
    const tools = await this.toolProvider.getGDAgentTools();
    console.log(`✅ Found ${tools.length} tools from MCP Server`);
    
    // Recreate the agent with tools from MCP Server
    this.agent = new GDAgent({
      name: this.agent.name,
      instructions: this.getEnhancedInstructions(tools),
      model: 'claude-sonnet-4-20250514',
      tools: tools,
    });
  }

  protected abstract getEnhancedInstructions(tools: any[]): string;

  protected calculateAverageResponseTime(transcripts: any[]): number {
    // Simplified response time calculation
    // In production, calculate actual time differences between customer and agent messages
    return Math.random() * 300; // Random value for demo
  }

  protected createTeamSummaryPrompt(agentMetrics: AgentMetrics[], transcripts: any[]): string {
    return `
    Analyze the following agent performance data and generate a comprehensive team summary for the day:

    AGENT METRICS:
    ${JSON.stringify(agentMetrics, null, 2)}

    SAMPLE TRANSCRIPTS:
    ${JSON.stringify(transcripts.slice(0, 3), null, 2)}

    Please provide:
    1. Overall team performance summary
    2. Key insights and trends
    3. Top performing agents and why
    4. Agents needing attention and recommendations
    5. Customer satisfaction insights
    6. Areas for improvement
    7. Actionable recommendations for management

    Format the response as a comprehensive dashboard summary suitable for management review.
    `;
  }

  async cleanup(): Promise<void> {
    await this.mcpClient.disconnect();
  }
}
