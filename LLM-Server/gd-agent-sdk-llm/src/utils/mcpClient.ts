/**
 * MCP Client utilities for integrating with MCP Server tools
 */
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';

export interface MCPToolRequest {
  tool: string;
  arguments: Record<string, any>;
}

export interface MCPToolResponse {
  status: string;
  message?: string;
  data?: any;
  error?: string;
}

export class MCPClient extends EventEmitter {
  private mcpProcess: any;
  private isConnected: boolean = false;
  private requestId: number = 0;
  private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map();

  constructor(private mcpServerPath: string = '../MCP-Server/main.py') {
    super();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.mcpProcess = spawn('python3', [this.mcpServerPath, '--stdio'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        this.mcpProcess.stdout.on('data', (data: Buffer) => {
          const response = JSON.parse(data.toString());
          this.handleResponse(response);
        });

        this.mcpProcess.stderr.on('data', (data: Buffer) => {
          console.error('MCP Server Error:', data.toString());
        });

        this.mcpProcess.on('close', (code: number) => {
          console.log(`MCP Server process exited with code ${code}`);
          this.isConnected = false;
        });

        this.mcpProcess.on('error', (error: Error) => {
          console.error('MCP Server process error:', error);
          reject(error);
        });

        // Give the server a moment to start
        setTimeout(() => {
          this.isConnected = true;
          resolve();
        }, 1000);

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleResponse(response: any): void {
    if (response.id && this.pendingRequests.has(response.id)) {
      const { resolve, reject } = this.pendingRequests.get(response.id)!;
      this.pendingRequests.delete(response.id);

      if (response.error) {
        reject(new Error(response.error.message || 'MCP Tool execution failed'));
      } else {
        resolve(response.result);
      }
    }
  }

  async callTool(tool: string, args: Record<string, any>): Promise<MCPToolResponse> {
    if (!this.isConnected) {
      throw new Error('MCP Client not connected');
    }

    return new Promise((resolve, reject) => {
      const requestId = ++this.requestId;
      this.pendingRequests.set(requestId, { resolve, reject });

      const request = {
        jsonrpc: '2.0',
        id: requestId,
        method: 'tools/call',
        params: {
          name: tool,
          arguments: args
        }
      };

      this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('MCP Tool call timeout'));
        }
      }, 30000);
    });
  }

  async disconnect(): Promise<void> {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.isConnected = false;
    }
  }
}

// Tool-specific methods for easier usage
export class ConversationStateTools {
  constructor(private mcpClient: MCPClient) {}

  async searchConversations(params: {
    contactCenterId: string;
    startDate?: string;
    endDate?: string;
    customerId?: string;
    jomaxId?: string;
    conversationId?: string;
    limit?: number;
    nextToken?: string;
  }): Promise<MCPToolResponse> {
    return this.mcpClient.callTool('conversation_state_search', params);
  }

  async getContactDetails(params: {
    ucid: string;
    includeConversations?: boolean;
  }): Promise<MCPToolResponse> {
    return this.mcpClient.callTool('conversation_state_ucid_detail', params);
  }

  async getTranscripts(params: {
    ucid: string;
  }): Promise<MCPToolResponse> {
    return this.mcpClient.callTool('conversation_state_transcripts', params);
  }
}
