import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Clock, MessageSquare, Star, Users } from 'lucide-react';

const PerformanceDashboard = ({ agent }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockData = {
    '7d': {
      conversations: [
        { day: 'Mon', count: 12 },
        { day: 'Tue', count: 18 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 22 },
        { day: 'Fri', count: 19 },
        { day: 'Sat', count: 8 },
        { day: 'Sun', count: 5 }
      ],
      responseTime: [
        { hour: '9AM', time: 2.5 },
        { hour: '10AM', time: 3.2 },
        { hour: '11AM', time: 2.8 },
        { hour: '12PM', time: 4.1 },
        { hour: '1PM', time: 3.5 },
        { hour: '2PM', time: 2.9 },
        { hour: '3PM', time: 3.8 },
        { hour: '4PM', time: 2.2 }
      ],
      satisfaction: [
        { name: 'Excellent', value: 45, color: '#22c55e' },
        { name: 'Good', value: 35, color: '#3b82f6' },
        { name: 'Average', value: 15, color: '#f59e0b' },
        { name: 'Poor', value: 5, color: '#ef4444' }
      ],
      metrics: {
        totalConversations: 99,
        avgResponseTime: '3.2 min',
        customerSatisfaction: '4.2/5',
        resolutionRate: '87%',
        activeHours: '42.5 hrs',
        escalationRate: '8%'
      }
    },
    '30d': {
      conversations: [
        { week: 'Week 1', count: 89 },
        { week: 'Week 2', count: 95 },
        { week: 'Week 3', count: 102 },
        { week: 'Week 4', count: 88 }
      ],
      responseTime: [
        { week: 'Week 1', time: 3.1 },
        { week: 'Week 2', time: 2.9 },
        { week: 'Week 3', time: 2.7 },
        { week: 'Week 4', time: 3.0 }
      ],
      satisfaction: [
        { name: 'Excellent', value: 48, color: '#22c55e' },
        { name: 'Good', value: 32, color: '#3b82f6' },
        { name: 'Average', value: 15, color: '#f59e0b' },
        { name: 'Poor', value: 5, color: '#ef4444' }
      ],
      metrics: {
        totalConversations: 374,
        avgResponseTime: '2.9 min',
        customerSatisfaction: '4.3/5',
        resolutionRate: '89%',
        activeHours: '168.5 hrs',
        escalationRate: '6%'
      }
    }
  };

  useEffect(() => {
    if (agent) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setPerformanceData(mockData[timeRange]);
        setLoading(false);
      }, 1000);
    }
  }, [agent, timeRange]);

  if (!agent) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Agent Selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please search for an agent to view their performance metrics.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading performance data...</span>
        </div>
      </div>
    );
  }

  const data = performanceData || mockData[timeRange];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
            <p className="text-gray-600">Agent: {agent.jomaxId || agent.agentId}</p>
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
              <p className="text-sm font-medium text-gray-500">Conversations</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.totalConversations}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Response</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.avgResponseTime}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-warning-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Satisfaction</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.customerSatisfaction}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.resolutionRate}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.activeHours}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-danger-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Escalation Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{data.metrics.escalationRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations Over Time */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.conversations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.responseTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="time" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.satisfaction}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.satisfaction.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data.satisfaction.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <span className="ml-auto text-sm text-gray-500">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-success-600" />
              <h4 className="ml-2 text-sm font-medium text-success-800">Strengths</h4>
            </div>
            <ul className="mt-2 text-sm text-success-700">
              <li>• Excellent customer satisfaction rating</li>
              <li>• Consistent response times</li>
              <li>• High resolution rate</li>
            </ul>
          </div>
          
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingDown className="h-5 w-5 text-warning-600" />
              <h4 className="ml-2 text-sm font-medium text-warning-800">Areas for Improvement</h4>
            </div>
            <ul className="mt-2 text-sm text-warning-700">
              <li>• Reduce escalation rate</li>
              <li>• Improve peak hour performance</li>
              <li>• Increase conversation volume</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
