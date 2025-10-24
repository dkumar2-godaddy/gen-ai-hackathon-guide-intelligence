import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const ConversationAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    // TODO: Implement real API call
    setAnalyticsData(null);
    setLoading(false);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  const data = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Conversation Analytics</h2>
            <p className="text-gray-600">Comprehensive conversation performance insights</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="metric-card">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Conversations</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.totalConversations}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.resolvedConversations}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-warning-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Resolution</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.avgResolutionTime}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">First Call Resolution</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.firstCallResolution}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Satisfaction</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.customerSatisfaction}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-danger-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Escalation Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.escalationRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Volume */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.conversationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeRange === '7d' ? 'hour' : 'week'} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="conversations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="resolved" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.channelDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.channelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Time vs Target */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Time Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.resolutionTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeRange === '7d' ? 'day' : 'week'} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} name="Average Time" />
            <Line type="monotone" dataKey="targetTime" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target Time" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Satisfaction Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.satisfactionTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeRange === '7d' ? 'day' : 'week'} />
            <YAxis domain={[3, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="satisfaction" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Channels</h3>
          <div className="space-y-4">
            {data.channelDistribution
              .sort((a, b) => b.value - a.value)
              .map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: channel.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{channel.value}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${channel.value}%`, 
                          backgroundColor: channel.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <h4 className="ml-2 text-sm font-medium text-success-800">Strengths</h4>
              </div>
              <ul className="mt-2 text-sm text-success-700">
                <li>• High first call resolution rate</li>
                <li>• Consistent customer satisfaction</li>
                <li>• Good resolution time performance</li>
              </ul>
            </div>
            
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
                <h4 className="ml-2 text-sm font-medium text-warning-800">Areas for Improvement</h4>
              </div>
              <ul className="mt-2 text-sm text-warning-700">
                <li>• Reduce escalation rate</li>
                <li>• Improve weekend performance</li>
                <li>• Optimize peak hour handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalytics;
