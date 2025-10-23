import { GDAgent } from '@godaddy/agent-sdk';
import { MCPServerStreamableHttp, run, setTracingDisabled } from "@openai/agents";

setTracingDisabled(true);

export interface AgentPerformanceStats {
  totalInteractions: number;
  totalDurationSeconds: number;
  averageResponseTimeSeconds: number;
  sessionCompletionRate: number;
  resolutionRate: number;
  averageCustomerWaitTimeSeconds: number;
}

export interface AlertFlag {
  flagType: 'threat' | 'abuse' | 'fraud' | 'escalation_required' | 'poor_performance' | 'communication_gap' | 'premature_disconnect' | 'no_response';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detectedAt?: string;
}

export interface PerformanceScore {
  overall: number;
  responsiveness: number;
  customerSatisfaction: number;
  communicationQuality: number;
}

export interface AgentAnalytics {
  agentId: string;
  agentName: string;
  performanceStats: AgentPerformanceStats;
  alertFlags: AlertFlag[];
  performanceScore: PerformanceScore;
}


export interface TeamAgentPerformanceStats {
  totalInteractions: number;
  totalDurationSeconds: number;
}

export interface AgentSummary {
  agentId: string;
  agentName: string;
  performanceStats: TeamAgentPerformanceStats;
  overallPerformanceScore: number;
}

export interface TeamSummary {
  agentsSummary: AgentSummary[];
}

export class AgentIntelligenceAnalyzer {
  private agent: GDAgent;
  private mcpServer: MCPServerStreamableHttp;

  constructor() {
    this.mcpServer = new MCPServerStreamableHttp({
      url: "http://127.0.0.1:5132/mcp",
      name: "Conversation State Service MCP Server",
      // other options if needed
    });
    
    // Initialize agent without tools first
    this.agent = new GDAgent({
      name: 'Agent Intelligence Analyzer',
      instructions: this.getBaseInstructions(),
      //model: 'gpt-4.1', //'claude-sonnet-4-20250514',
      mcpServers: [this.mcpServer],
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
      ${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n      ')}
      
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
    await this.mcpServer.connect();
    
    // Fetch tools from MCP Server and configure the agent
    console.log('🔧 Fetching tools from MCP Server...');
    const tools = await this.mcpServer.listTools();
    console.log(`✅ Found ${tools.length} tools from MCP Server`);
    
    // Recreate the agent with tools from MCP Server
    this.agent = new GDAgent({
      name: 'Agent Intelligence Analyzer',
      instructions: this.getEnhancedInstructions(tools),
    //  model: 'claude-sonnet-4-20250514',
      mcpServers: [this.mcpServer],
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
        
        IMPORTANT: Return your analysis in the following EXACT JSON schema format:
        {
          "agentsSummary": [
            {
              "agentId": "string",
              "agentName": "string", 
              "performanceStats": {
                "totalInteractions": number,
                "totalDurationSeconds": number
              },
              "overallPerformanceScore": number
            }
          ]
        }
        
        The overallPerformanceScore should be a number between 0-100 representing the agent's overall performance.
        Calculate totalInteractions as the count of conversations handled by each agent.
        Calculate totalDurationSeconds as the total time spent by each agent in conversations.
        Ensure the JSON is valid and follows the exact schema structure.
      `;

      // The LLM will now autonomously use the tools to complete the analysis
      const result = await run(this.agent, analysisPrompt);
      
      console.log(result.finalOutput);
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

  async analyzeAgent( {agentId , startDate, endDate}: {agentId: string, startDate: string, endDate: string}): Promise<AgentAnalytics> {
    try {
      console.log(`👤 Analyzing agent ${agentId} performance...`);
      
      const analysisPrompt = `
        Analyze the performance of agent ID: ${agentId}
        Date range: ${startDate} to ${endDate}
        
        Autonomously:
        1. Search for all conversations handled by this agent in the specified date range
        2. Get detailed information for each conversation found
        3. Retrieve and analyze transcripts for comprehensive performance metrics
        4. Calculate detailed performance statistics including:
           - Total interactions and duration
           - Average response times
           - Session completion and resolution rates
           - Customer wait times
        5. Analyze for alert flags including:
           - Threat, abuse, or fraud indicators
           - Escalation requirements
           - Performance issues
           - Communication gaps
           - Premature disconnects
        6. Calculate performance scores across multiple dimensions:
           - Overall performance (0-100)
           - Responsiveness (0-100)
           - Customer satisfaction (0-100)
           - Communication quality (0-100)
        
        Use the available MCP tools to complete this analysis autonomously.
        
        IMPORTANT: Return your analysis in the following EXACT JSON schema format:
        {
          "agentAnalytics": {
            "agentId": "string",
            "agentName": "string",
            "performanceStats": {
              "totalInteractions": number,
              "totalDurationSeconds": number,
              "averageResponseTimeSeconds": number,
              "sessionCompletionRate": number,
              "resolutionRate": number,
              "averageCustomerWaitTimeSeconds": number
            },
            "alertFlags": [
              {
                "flagType": "threat|abuse|fraud|escalation_required|poor_performance|communication_gap|premature_disconnect|no_response",
                "severity": "critical|high|medium|low",
                "description": "string",
                "detectedAt": "ISO date-time string"
              }
            ],
            "performanceScore": {
              "overall": number,
              "responsiveness": number,
              "customerSatisfaction": number,
              "communicationQuality": number
            }
          }
        }
        
        Ensure all performance scores are between 0-100.
        Session completion and resolution rates should be between 0.0-1.0 (as decimals).
        Alert flags should only be included if issues are detected.
        Ensure the JSON is valid and follows the exact schema structure.
      `;

      const result = await run(this.agent, analysisPrompt);
      return this.parseAgentAnalytics(result.finalOutput || '');

    } catch (error) {
      console.error(`❌ Error analyzing agent ${agentId}:`, error);
      throw error;
    }
  }

  private parseAnalysisResult(result: string): TeamSummary {
    // Parse the LLM's structured output to match the new JSON schema format
    try {
      console.log("\n \n  results in parseAnalysisResult: ", result);
      // Attempt to extract JSON if the LLM returns it
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and transform the parsed data to match our interface
        if (parsed.agentsSummary && Array.isArray(parsed.agentsSummary)) {
          return {
            agentsSummary: parsed.agentsSummary.map((agent: any) => ({
              agentId: agent.agentId || '',
              agentName: agent.agentName || '',
              performanceStats: {
                totalInteractions: agent.performanceStats?.totalInteractions || 0,
                totalDurationSeconds: agent.performanceStats?.totalDurationSeconds || 0
              },
              overallPerformanceScore: agent.overallPerformanceScore || 0
            }))
          };
        }
      }
    } catch (e) {
      console.error('Error parsing analysis result:', e);
    }

    // Fallback structure with empty agentsSummary array
    return {
      agentsSummary: []
    };
  }

  private parseAgentAnalytics(result: string): AgentAnalytics {
    // Parse agent analytics from LLM output to match the new JSON schema format
    try {
      // Attempt to extract JSON if the LLM returns it
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and transform the parsed data to match our interface
        if (parsed.agentAnalytics) {
          const analytics = parsed.agentAnalytics;
          return {
            agentId: analytics.agentId || '',
            agentName: analytics.agentName || '',
            performanceStats: {
              totalInteractions: analytics.performanceStats?.totalInteractions || 0,
              totalDurationSeconds: analytics.performanceStats?.totalDurationSeconds || 0,
              averageResponseTimeSeconds: analytics.performanceStats?.averageResponseTimeSeconds || 0,
              sessionCompletionRate: analytics.performanceStats?.sessionCompletionRate || 0,
              resolutionRate: analytics.performanceStats?.resolutionRate || 0,
              averageCustomerWaitTimeSeconds: analytics.performanceStats?.averageCustomerWaitTimeSeconds || 0
            },
            alertFlags: analytics.alertFlags || [],
            performanceScore: {
              overall: analytics.performanceScore?.overall || 0,
              responsiveness: analytics.performanceScore?.responsiveness || 0,
              customerSatisfaction: analytics.performanceScore?.customerSatisfaction || 0,
              communicationQuality: analytics.performanceScore?.communicationQuality || 0
            }
          };
        }
      }
    } catch (e) {
      console.error('Error parsing agent analytics result:', e);
    }

    // Fallback structure with default values
    return {
      agentId: '',
      agentName: '',
      performanceStats: {
        totalInteractions: 0,
        totalDurationSeconds: 0,
        averageResponseTimeSeconds: 0,
        sessionCompletionRate: 0,
        resolutionRate: 0,
        averageCustomerWaitTimeSeconds: 0
      },
      alertFlags: [],
      performanceScore: {
        overall: 0,
        responsiveness: 0,
        customerSatisfaction: 0,
        communicationQuality: 0
      }
    };
  }

  async cleanup(): Promise<void> {
    await this.mcpServer.close();
  }
}

// // TEST_RUN:
// const analyzer = new AgentIntelligenceAnalyzer();
// await analyzer.initialize();
// const result = await analyzer.generateTeamFullDaySummary({
//   contactCenterId: 'gd-dev-us-001',
//   startDate: '2025-10-17 00:00',
//   endDate: '2025-10-17 23:59'
// });

// console.log('\n📊 TEAM FULL DAY SUMMARY RESULTS:');
// console.log('=====================================');
// console.log(JSON.stringify(result, null, 2));
// console.log('\n📈 SUMMARY STATISTICS:');
// console.log(`Total Agents: ${result.agentsSummary.length}`);
// if (result.agentsSummary.length > 0) {
//   const avgScore = result.agentsSummary.reduce((sum, agent) => sum + agent.overallPerformanceScore, 0) / result.agentsSummary.length;
//   const totalInteractions = result.agentsSummary.reduce((sum, agent) => sum + agent.performanceStats.totalInteractions, 0);
//   const totalDuration = result.agentsSummary.reduce((sum, agent) => sum + agent.performanceStats.totalDurationSeconds, 0);
  
//   console.log(`Average Performance Score: ${avgScore.toFixed(2)}`);
//   console.log(`Total Interactions: ${totalInteractions}`);
//   console.log(`Total Duration: ${Math.round(totalDuration / 3600 * 100) / 100} hours`);
  
//   console.log('\n🏆 TOP PERFORMERS:');
//   result.agentsSummary
//     .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
//     .slice(0, 3)
//     .forEach((agent, index) => {
//       console.log(`${index + 1}. ${agent.agentName} (${agent.agentId}) - Score: ${agent.overallPerformanceScore}`);
//     });
// }
// console.log('=====================================\n');

// await analyzer.cleanup();

// // const result = await analyzer.analyzeConversation('b714c328-96fa-42a0-a1e6-d39f97d04f87');

// // const analyzer = new AgentIntelligenceAnalyzer();
// // await analyzer.initialize();
// // const result = await analyzer.analyzeAgent({
// //   agentId: 'jkumari1',
// //   startDate: '2025-10-17 00:00',
// //   endDate: '2025-10-17 23:59'
// // });
// // console.log(result);
// // await analyzer.cleanup();




