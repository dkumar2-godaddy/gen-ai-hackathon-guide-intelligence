/**
 * MCP Server Configuration
 */
export const MCP_CONFIG = {
  // MCP Server path relative to the LLM-Server directory
  serverPath: process.env.MCP_SERVER_PATH ?? '/Users/ajohari/Projects/gen-ai-hackathon-guide-intelligence/MCP-Server/main.py',
  
  // Connection timeout in milliseconds
  connectionTimeout: 30000,
  
  // Request timeout in milliseconds
  requestTimeout: 30000,
  
  // Default contact center ID
  defaultContactCenterId: 'gd-dev-us-001',
  
  // Default date range for analysis (can be overridden)
  defaultDateRange: {
    startDate: '2025-10-15 00:00',
    endDate: '2025-10-15 23:59'
  },
  
  // Pagination settings
  pagination: {
    defaultLimit: 100,
    maxLimit: 1000
  }
};

export interface MCPAnalysisParams {
  contactCenterId: string;
  startDate: string;
  endDate: string;
  limit?: number;
}
