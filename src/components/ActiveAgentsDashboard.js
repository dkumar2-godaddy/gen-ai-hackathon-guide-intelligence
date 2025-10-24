import React, { useState, useEffect, useCallback } from 'react';
import { Users, Activity, Clock, MessageSquare, Star, AlertCircle, Calendar } from 'lucide-react';
import { getActiveAgents, getAgentById } from '../services/api';
import websocketService from '../services/websocket';
import notificationService from '../services/notification';

const ActiveAgentsDashboard = ({ onAgentSelect }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Current date
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Current date
  const [dataLoaded, setDataLoaded] = useState(false);


  const fetchActiveAgents = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate date range
      if (new Date(startDate) > new Date(endDate)) {
        setError('Start date cannot be after end date');
        setLoading(false);
        return;
      }
      
      // Format dates as required by the server (2025-10-17 00:00 format)
      const formattedEndDate = endDate + ' 23:59';
      const formattedStartDate = startDate + ' 00:00';
      
      const data = await getActiveAgents(formattedStartDate, formattedEndDate);
      console.log('API Response:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data keys:', data ? Object.keys(data) : 'No data');
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      
      // Handle multiple API response formats dynamically
      let transformedAgents = [];
      let agentsArray = [];
      
      // Determine the correct agents array from different possible response formats
      if (Array.isArray(data)) {
        // Direct array format: [agent1, agent2, ...]
        console.log('Received direct array format:', data);
        agentsArray = data;
      } else if (data && data.agentsSummary && Array.isArray(data.agentsSummary)) {
        // LLM Server format: {agentsSummary: [...]}
        console.log('Received agentsSummary format:', data);
        agentsArray = data.agentsSummary;
      } else if (data && data.agents && Array.isArray(data.agents)) {
        // Backend format: {agents: [...]}
        console.log('Received backend agents format:', data);
        agentsArray = data.agents;
      } else if (data && data.data && Array.isArray(data.data)) {
        // Wrapped format: {data: [...]}
        console.log('Received wrapped data format:', data);
        agentsArray = data.data;
      } else {
        console.error('Unexpected data format:', data);
        console.log('Available keys:', Object.keys(data || {}));
        const errorMessage = `Invalid data format received from API. Expected array or object with agents/agentsSummary/data property. Received: ${JSON.stringify(data)}`;
        throw new Error(errorMessage);
      }
      
      // Transform agents array based on the detected format
      if (agentsArray.length === 0) {
        console.log('No agents found in response');
        console.log('Raw API data for debugging:', JSON.stringify(data, null, 2));
        
        transformedAgents = [];
        
        setAgents(transformedAgents);
        setLastUpdate(new Date());
        return;
      } else {
        console.log(`Processing ${agentsArray.length} agents`);
        
        // Check the structure of the first agent to determine the format
        const firstAgent = agentsArray[0];
        console.log('First agent structure:', firstAgent);
        
        if (firstAgent.agentId && firstAgent.agentName) {
          // New API format: {agentId, agentName, performanceStats, overallPerformanceScore}
          console.log('Detected new API format');
          transformedAgents = agentsArray.map((agent, index) => {
            return {
              id: agent.agentId,
              name: agent.agentName,
              jomaxId: agent.agentId,
              totalConversations: agent.performanceStats?.totalInteractions || 0,
              averageHandlingTime: agent.performanceStats?.totalDurationSeconds || 0,
              sentimentScore: (agent.overallPerformanceScore || 0) / 100,
              avgResponseTime: agent.performanceStats?.totalInteractions > 0 
                ? Math.round((agent.performanceStats.totalDurationSeconds / agent.performanceStats.totalInteractions) / 60)
                : 0
            };
          });
        } else if (firstAgent.id && firstAgent.name) {
          // Backend format: {id, name, status, ...}
          console.log('Detected backend format');
          transformedAgents = agentsArray.map((agent, index) => {
            return {
              id: agent.id,
              name: agent.name,
              jomaxId: agent.jomaxId || agent.id,
              totalConversations: agent.totalConversations || 0,
              avgResponseTime: agent.avgResponseTime ? parseFloat(agent.avgResponseTime) : 0,
              sentimentScore: agent.satisfaction ? agent.satisfaction / 5 : 0,
              averageHandlingTime: agent.avgResponseTime ? parseFloat(agent.avgResponseTime) * 60 : 0
            };
          });
        } else {
          // Unknown format - try to extract what we can
          console.log('Unknown agent format, attempting basic mapping');
          transformedAgents = agentsArray.map((agent, index) => {
            const stableSeed = index % 10;
            return {
              id: agent.id || agent.agentId || `agent-${index}`,
              name: agent.name || agent.agentName || `Agent ${index + 1}`,
              jomaxId: agent.jomaxId || agent.id || agent.agentId || `agent-${index}`,
              totalConversations: agent.totalConversations || 0,
              avgResponseTime: agent.avgResponseTime ? parseFloat(agent.avgResponseTime) : 0,
              sentimentScore: agent.satisfaction ? agent.satisfaction / 5 : 0,
              averageHandlingTime: agent.avgResponseTime ? parseFloat(agent.avgResponseTime) * 60 : 0
            };
          });
        }
      }
      
      setAgents(transformedAgents);
      setLastUpdate(new Date());
      setDataLoaded(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch active agents');
      console.error('API Error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]); // Include startDate and endDate in dependencies

  // Separate useEffect for initial setup and WebSocket
  useEffect(() => {
    // Only fetch data if we haven't loaded it yet
    if (!dataLoaded) {
    fetchActiveAgents();
    }
    setLoading(false);

    // Set up WebSocket connection
    websocketService.connect();
    
    // WebSocket event handlers
    const handleConnected = () => setWsConnected(true);
    const handleDisconnected = () => setWsConnected(false);
    const handlePerformanceAlert = (data) => {
      console.log('Performance alert received:', data);
      
      // Show notification if enabled
      if (notificationsEnabled) {
        notificationService.showPerformanceAlert({
          agentId: data.agentId,
          agentName: 'Agent', // Simplified to avoid dependency
          summary: 'Performance threshold crossed'
        });
      }
    };

    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('performanceAlert', handlePerformanceAlert);

    // Request notification permission
    notificationService.requestPermission().then(() => {
      setNotificationsEnabled(true);
    }).catch(() => {
      setNotificationsEnabled(false);
    });

    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('performanceAlert', handlePerformanceAlert);
      websocketService.disconnect();
    };
  }, [dataLoaded]); // Include dataLoaded to prevent re-fetching


  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'status-online';
      case 'busy':
        return 'status-busy';
      case 'away':
        return 'status-offline';
      default:
        return 'status-offline';
    }
  };


  const formatLastActivity = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleAgentClick = async (agent) => {
    try {
      console.log('🖱️ Agent clicked:', agent);
      console.log('🖱️ Agent jomaxId:', agent.jomaxId);
      console.log('🖱️ onAgentSelect function exists:', !!onAgentSelect);
      
      // Format dates as required by the server
      const formattedEndDate = endDate + ' 23:59';
      const formattedStartDate = startDate + ' 00:00';
      
      console.log('📅 Date range:', { formattedStartDate, formattedEndDate });
      
      // Call the API to get agent details
      console.log('🔄 Calling getAgentById API...');
      const agentDetails = await getAgentById(agent.jomaxId, formattedStartDate, formattedEndDate);
      console.log('✅ Agent details received:', agentDetails);
      
      // Pass the agent details to the parent component
      if (onAgentSelect) {
        console.log('📤 Calling onAgentSelect with:', agentDetails);
        onAgentSelect(agentDetails);
      } else {
        console.error('❌ onAgentSelect function not provided');
      }
    } catch (error) {
      console.error('❌ Error fetching agent details:', error);
      // Show error message instead of mock data
      setError('Failed to fetch agent details. Please try again.');
    }
  };


  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading active agents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Active Agents Dashboard</h2>
            <p className="text-gray-600">Real-time agent performance monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Date Range:</label>
              <div className="flex items-center space-x-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      // Auto-adjust end date if it's before start date
                      if (new Date(e.target.value) > new Date(endDate)) {
                        setEndDate(e.target.value);
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    max={new Date().toISOString().split('T')[0]} // Can't select future dates
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    max={new Date().toISOString().split('T')[0]} // Can't select future dates
                    min={startDate} // Can't select before start date
                  />
                </div>
                <button
                  onClick={() => {
                    setDataLoaded(false);
                    fetchActiveAgents();
                  }}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-success-500" />
              <span className="text-sm text-gray-600">Live</span>
              {loading && (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-primary-600"></div>
                  <span className="text-xs text-gray-500">Updating...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-success-500' : 'bg-danger-500'}`}></div>
              <span className="text-sm text-gray-600">
                WebSocket {wsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${notificationsEnabled ? 'bg-success-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                Notifications {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </span>
          </div>
        </div>

        {/* Quick Stats - Based on API Response */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Agents</p>
                <p className="text-2xl font-semibold text-gray-900">{agents.length}</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Interactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {agents.reduce((sum, agent) => sum + (agent.totalConversations || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Duration</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(agents.reduce((sum, agent) => sum + (agent.averageHandlingTime || 0), 0) / 3600 * 100) / 100}h
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Performance</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + (agent.sentimentScore * 100 || 0), 0) / agents.length) : 0}/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {/* {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-danger-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">API Error</h3>
              <div className="mt-2 text-sm text-danger-700">{error}</div>
              <div className="mt-2 text-xs text-danger-600">
                Make sure the server is running on localhost:4000
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* No Data Message */}
      {!loading && !error && agents.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">No Data</h3>
              <div className="mt-2 text-sm text-gray-700">
                No agents found for the selected date range. Try adjusting the date range or check the server connection.
              </div>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800 font-medium">Debug Info:</p>
                  <p className="text-xs text-yellow-700">Check browser console for API response details</p>
                  <p className="text-xs text-yellow-700">Expected API format: Array of objects with agentId, agentName, performanceStats, overallPerformanceScore</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agents Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
          <h3 className="text-lg font-semibold text-gray-900">Agent Status</h3>
            <p className="text-sm text-gray-500">
              Click on any agent row to view performance details • Showing data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Interactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map((agent) => (
                <tr 
                  key={agent.id} 
                  className="hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500"
                  onClick={() => handleAgentClick(agent)}
                  title="Click to view performance details"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.jomaxId}</div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{agent.totalConversations}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {Math.round(agent.averageHandlingTime / 3600 * 100) / 100}h
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-sm text-gray-900">{Math.round(agent.sentimentScore * 100)}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{agent.avgResponseTime}m</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ActiveAgentsDashboard;
