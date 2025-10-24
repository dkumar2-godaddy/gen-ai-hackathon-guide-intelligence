import React, { useState } from 'react';
import { Search, User, Clock, Star, MessageSquare, AlertCircle, Loader, Calendar } from 'lucide-react';
import { getAgentById } from '../services/api';

const AgentSearch = ({ agent: selectedAgent }) => {
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

  // Auto-load agent data when selectedAgent is provided
  React.useEffect(() => {
    if (selectedAgent) {
      setSearchTerm(selectedAgent.jomaxId || selectedAgent.id);
      setAgentData(selectedAgent);
    }
  }, [selectedAgent]);

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
      console.log('Agent search response:', data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Agent Search</h2>
            <p className="text-lg text-gray-600">Search and analyze individual agent performance metrics</p>
          </div>

          {/* Enhanced Search Form - Only show if no selectedAgent */}
          {!selectedAgent && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Search Agent</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Search by agent ID or jomax/agentid format
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* Enhanced Search Input */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter agent ID (e.g., jkumari1 or jomax/jkumari1)"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 hover:border-gray-300"
                      disabled={loading}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !searchTerm.trim() || !startDate || !endDate}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span className="font-semibold">{loading ? 'Searching...' : 'Search'}</span>
                </button>
              </div>

              {/* Enhanced Date Range Picker */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-800">Date Range Filter</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Enhanced Quick Date Range Presets */}
                <div className="flex items-center space-x-3 mt-4">
                  <span className="text-sm font-medium text-gray-600">Quick select:</span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                        setStartDate(yesterday.toISOString().split('T')[0]);
                        setEndDate(today.toISOString().split('T')[0]);
                      }}
                      className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300"
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
                      className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300"
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
                      className="px-4 py-2 text-sm bg-white text-gray-700 transition-all duration-200 border border-gray-200 hover:border-blue-300"
                      disabled={loading}
                    >
                      Last 30 days
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          )}

          {/* Enhanced Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Agent Details */}
          {agentData && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Agent Details</h3>
                  <p className="text-gray-600 mt-1">Comprehensive performance analysis</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold text-green-700 bg-green-100">
                    Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Enhanced Basic Info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <User className="h-6 w-6 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Agent Information</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Agent Name</label>
                        <p className="text-xl font-bold text-gray-900 mt-1">{agentData.agentName || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Agent ID</label>
                        <p className="text-lg text-gray-900 font-mono mt-1">{agentData.agentId || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Performance Metrics */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Star className="h-6 w-6 text-green-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Key Metrics</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Customer Satisfaction</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="text-2xl font-bold text-gray-900">
                            {agentData.performanceScore?.customerSatisfaction ? `${agentData.performanceScore.customerSatisfaction}/100` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Interactions</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <MessageSquare className="h-5 w-5 text-blue-400" />
                          <span className="text-2xl font-bold text-gray-900">
                            {agentData.performanceStats?.totalInteractions || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Performance Stats */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="h-6 w-6 text-purple-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Performance Stats</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Response Time</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {agentData.performanceStats?.averageResponseTimeSeconds ? `${Math.round(agentData.performanceStats.averageResponseTimeSeconds)}s` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Duration</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {agentData.performanceStats?.totalDurationSeconds ? `${Math.round(agentData.performanceStats.totalDurationSeconds / 3600 * 100) / 100}h` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Completion Rate</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-4 w-4 text-green-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {agentData.performanceStats?.sessionCompletionRate ? `${Math.round(agentData.performanceStats.sessionCompletionRate * 100)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Resolution Rate</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {agentData.performanceStats?.resolutionRate ? `${Math.round(agentData.performanceStats.resolutionRate * 100)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Performance Summary */}
              <div className="mt-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Performance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Overall Performance</span>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {agentData.performanceScore?.overall ? `${agentData.performanceScore.overall}/100` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on comprehensive analysis
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Activity Level</span>
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {(agentData.performanceStats?.totalInteractions || 0) > 50 ? 'High' : 
                       (agentData.performanceStats?.totalInteractions || 0) > 20 ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {agentData.performanceStats?.totalInteractions || 0} total interactions
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Communication Quality</span>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {agentData.performanceScore?.communicationQuality ? `${agentData.performanceScore.communicationQuality}/100` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Communication effectiveness score
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Additional Performance Scores */}
              <div className="mt-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Performance Scores</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Responsiveness</span>
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-cyan-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-cyan-600 mb-2">
                      {agentData.performanceScore?.responsiveness ? `${agentData.performanceScore.responsiveness}/100` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Response time effectiveness
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Customer Wait Time</span>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {agentData.performanceStats?.averageCustomerWaitTimeSeconds ? `${agentData.performanceStats.averageCustomerWaitTimeSeconds}s` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Average customer wait time
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Alert Flags */}
              {agentData.alertFlags && agentData.alertFlags.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">Alert Flags</h4>
                  <div className="space-y-4">
                    {agentData.alertFlags.map((flag, index) => (
                      <div key={index} className={`rounded-xl p-6 border-2 ${
                        flag.severity === 'critical' ? 'bg-red-50 border-red-200' :
                        flag.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                        flag.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                flag.severity === 'critical' ? 'bg-red-100' :
                                flag.severity === 'high' ? 'bg-orange-100' :
                                flag.severity === 'medium' ? 'bg-yellow-100' :
                                'bg-blue-100'
                              }`}>
                                <AlertCircle className={`h-4 w-4 ${
                                  flag.severity === 'critical' ? 'text-red-600' :
                                  flag.severity === 'high' ? 'text-orange-600' :
                                  flag.severity === 'medium' ? 'text-yellow-600' :
                                  'text-blue-600'
                                }`} />
                              </div>
                              <div>
                                <span className="text-lg font-semibold text-gray-900 capitalize">
                                  {flag.flagType.replace(/_/g, ' ')}
                                </span>
                                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                                  flag.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                  flag.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                  flag.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {flag.severity}
                                </span>
                              </div>
                            </div>
                            {flag.description && (
                              <p className="text-gray-700 mb-3">{flag.description}</p>
                            )}
                            {flag.detectedAt && (
                              <p className="text-sm text-gray-500">
                                Detected: {new Date(flag.detectedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSearch;





