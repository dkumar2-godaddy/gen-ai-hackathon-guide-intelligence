import React, { useState } from 'react';
import { Search, User, Clock, Star, MessageSquare, AlertCircle, Loader, Calendar } from 'lucide-react';
import { getAgentById } from '../services/api';

const AgentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set default date range (last 7 days)
  React.useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(lastWeek.toISOString().split('T')[0]);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter an agent ID');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);
    setAgentData(null);

    try {
      // Extract agent ID from jomax/agentid format or use as-is
      const agentId = searchTerm.includes('/') 
        ? searchTerm.split('/').pop() 
        : searchTerm;

      // Format dates as required by the server (2025-10-17 00:00 format)
      const formattedStartDate = startDate + ' 00:00';
      const formattedEndDate = endDate + ' 23:59';

      const data = await getAgentById(agentId, formattedStartDate, formattedEndDate);
      setAgentData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch agent details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-success-600 bg-success-100';
      case 'on-call':
        return 'text-warning-600 bg-warning-100';
      case 'offline':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <div className="w-2 h-2 bg-success-500 rounded-full"></div>;
      case 'on-call':
        return <div className="w-2 h-2 bg-warning-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Agent Search</h2>
          <div className="text-sm text-gray-500">
            Search by agent ID or jomax/agentid format
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter agent ID (e.g., agent-1 or jomax/agent-1)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim() || !startDate || !endDate}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Date Range:</span>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Date Range Presets */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Quick select:</span>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                  setStartDate(yesterday.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                disabled={loading}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  setStartDate(lastWeek.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                disabled={loading}
              >
                Last 7 days
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                  setStartDate(lastMonth.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                disabled={loading}
              >
                Last 30 days
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-danger-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">Error</h3>
              <div className="mt-2 text-sm text-danger-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Details */}
      {agentData && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Agent Details</h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(agentData.callStatus)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agentData.callStatus)}`}>
                {agentData.callStatus.charAt(0).toUpperCase() + agentData.callStatus.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Agent Name</label>
                <p className="text-lg font-semibold text-gray-900">{agentData.agentName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Agent ID</label>
                <p className="text-sm text-gray-900 font-mono">{agentData.agentId}</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Sentiment Score</label>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-warning-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    {(agentData.sentimentScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Conversations</label>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-primary-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    {agentData.numberOfConversations}
                  </span>
                </div>
              </div>
            </div>

            {/* Handling Time */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Average Handling Time</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    {formatDuration(agentData.averageHandlingTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sentiment Rating</span>
                  <span className={`text-sm font-medium ${
                    agentData.sentimentScore > 0.7 ? 'text-success-600' : 
                    agentData.sentimentScore > 0.5 ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    {agentData.sentimentScore > 0.7 ? 'Excellent' : 
                     agentData.sentimentScore > 0.5 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      agentData.sentimentScore > 0.7 ? 'bg-success-500' : 
                      agentData.sentimentScore > 0.5 ? 'bg-warning-500' : 'bg-danger-500'
                    }`}
                    style={{ width: `${agentData.sentimentScore * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Activity Level</span>
                  <span className={`text-sm font-medium ${
                    agentData.numberOfConversations > 10 ? 'text-success-600' : 
                    agentData.numberOfConversations > 5 ? 'text-warning-600' : 'text-gray-600'
                  }`}>
                    {agentData.numberOfConversations > 10 ? 'High' : 
                     agentData.numberOfConversations > 5 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {agentData.numberOfConversations} conversations
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Efficiency</span>
                  <span className={`text-sm font-medium ${
                    agentData.averageHandlingTime < 300 ? 'text-success-600' : 
                    agentData.averageHandlingTime < 600 ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    {agentData.averageHandlingTime < 300 ? 'Fast' : 
                     agentData.averageHandlingTime < 600 ? 'Average' : 'Slow'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {formatDuration(agentData.averageHandlingTime)} avg
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSearch;





