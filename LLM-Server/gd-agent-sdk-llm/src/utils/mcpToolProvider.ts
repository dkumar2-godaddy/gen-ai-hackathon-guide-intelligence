/**
 * MCP Tool Provider - Fetches tool schemas directly from MCP Server
 */
import { MCPClient } from './mcpClient.js';

export interface MCPToolSchema {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
}

export class MCPToolProvider {
  private mcpClient: MCPClient;

  constructor(mcpClient: MCPClient) {
    this.mcpClient = mcpClient;
  }

  /**
   * Fetch all available tools from MCP Server
   */
  async getAvailableTools(): Promise<MCPToolSchema[]> {
    try {
      // Use the MCP protocol to list tools
      const response = await this.mcpClient.callTool('tools/list', {});
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch tools from MCP Server:', error);
      // Fallback to hardcoded tools if MCP Server is not available
      return this.getFallbackTools();
    }
  }

  /**
   * Fallback tools if MCP Server is not available
   */
  private getFallbackTools(): MCPToolSchema[] {
    return [
      {
        name: 'conversation_state_search',
        description: 'Search for conversations by date range and contact center ID',
        inputSchema: {
          type: 'object',
          properties: {
            contactCenterId: { type: 'string', description: 'Contact center ID' },
            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD HH:MM)' },
            endDate: { type: 'string', description: 'End date (YYYY-MM-DD HH:MM)' },
            limit: { type: 'integer', description: 'Max records to fetch (1-100)' }
          },
          required: ['contactCenterId']
        }
      },
      {
        name: 'conversation_state_ucid_detail',
        description: 'Get detailed conversation information by UCID',
        inputSchema: {
          type: 'object',
          properties: {
            ucid: { type: 'string', description: 'Unique Conversation ID' },
            includeConversations: { type: 'boolean', description: 'Include conversations' }
          },
          required: ['ucid']
        }
      },
      {
        name: 'conversation_state_transcripts',
        description: 'Retrieve conversation transcripts',
        inputSchema: {
          type: 'object',
          properties: {
            ucid: { type: 'string', description: 'Unique Conversation ID' }
          },
          required: ['ucid']
        }
      }
    ];
  }

  /**
   * Convert MCP tool schemas to GDAgent function tool format
   */
  convertToGDAgentTools(mcpTools: MCPToolSchema[]): any[] {
    return mcpTools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema
      }
    }));
  }

  /**
   * Get tools in GDAgent format directly from MCP Server
   */
  async getGDAgentTools(): Promise<any[]> {
    const mcpTools = await this.getAvailableTools();
    return this.convertToGDAgentTools(mcpTools);
  }
}
