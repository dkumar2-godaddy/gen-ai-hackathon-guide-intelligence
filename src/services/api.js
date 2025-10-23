import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add any authentication headers here
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // POST /api/agents - accepts startDate and endDate in body
  getAgents: (startDate, endDate) => 
    api.post('/api/agents', { startDate, endDate }),
  
  // GET /api/agents/:agentId - returns agent specific details with date filtering
  getAgentById: (agentId, startDate, endDate) => 
    api.get(`/api/agents/${agentId}?startDate=${startDate}&endDate=${endDate}`),
  
  // Analytics (keeping existing for compatibility)
  getConversationAnalytics: (timeRange) => 
    api.get(`/api/analytics/conversations?timeRange=${timeRange}`),
  
  // System health (keeping existing for compatibility)
  getSystemHealth: () => 
    api.get('/api/system/health'),
  
  // MCP Server integration (keeping existing for compatibility)
  callMCPTool: (toolName, args) => 
    api.post('/api/mcp/call-tool', { toolName, arguments: args }),
  
  listMCPTools: () => 
    api.get('/api/mcp/tools'),
};

// Service functions - matching the actual server endpoints
export const getAgents = async (startDate, endDate) => {
  try {
    const response = await apiEndpoints.getAgents(startDate, endDate);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch agents');
  }
};

export const getAgentById = async (agentId, startDate, endDate) => {
  try {
    const response = await apiEndpoints.getAgentById(agentId, startDate, endDate);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent by ID:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch agent details');
  }
};

// Alias for backward compatibility
export const getActiveAgents = async (startDate, endDate) => {
  return getAgents(startDate, endDate);
};

export const getConversationAnalytics = async (timeRange = '7d') => {
  try {
    const response = await apiEndpoints.getConversationAnalytics(timeRange);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation analytics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch conversation analytics');
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await apiEndpoints.getSystemHealth();
    return response.data;
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch system health');
  }
};

// MCP Server integration functions
export const callMCPTool = async (toolName, args = {}) => {
  try {
    const response = await apiEndpoints.callMCPTool(toolName, args);
    return response.data;
  } catch (error) {
    console.error('Error calling MCP tool:', error);
    throw new Error(error.response?.data?.message || 'Failed to call MCP tool');
  }
};

export const listMCPTools = async () => {
  try {
    const response = await apiEndpoints.listMCPTools();
    return response.data;
  } catch (error) {
    console.error('Error listing MCP tools:', error);
    throw new Error(error.response?.data?.message || 'Failed to list MCP tools');
  }
};

// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default api;
