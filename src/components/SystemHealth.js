import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const SystemHealth = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());


  useEffect(() => {
    const fetchSystemData = () => {
      // TODO: Implement real API call
      setSystemData(null);
      setLastUpdate(new Date());
    };

    fetchSystemData();
    setLoading(false);

    // Update every 30 seconds
    const interval = setInterval(fetchSystemData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success-600 bg-success-100';
      case 'warning':
        return 'text-warning-600 bg-warning-100';
      case 'error':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date) => {
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

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading system health data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Health Dashboard</h2>
            <p className="text-gray-600">Real-time system monitoring and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-success-500" />
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">System Uptime</p>
              <p className="text-2xl font-semibold text-gray-900">{systemData.uptime}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">{systemData.responseTime}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-warning-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Connections</p>
              <p className="text-2xl font-semibold text-gray-900">{systemData.activeConnections}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Network Latency</p>
              <p className="text-2xl font-semibold text-gray-900">{systemData.networkLatency}ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CPU Usage</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Usage</span>
            <span className="text-sm font-medium text-gray-900">{systemData.cpuUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${systemData.cpuUsage > 80 ? 'bg-danger-500' : systemData.cpuUsage > 60 ? 'bg-warning-500' : 'bg-success-500'}`}
              style={{ width: `${systemData.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Usage</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Usage</span>
            <span className="text-sm font-medium text-gray-900">{systemData.memoryUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${systemData.memoryUsage > 85 ? 'bg-danger-500' : systemData.memoryUsage > 70 ? 'bg-warning-500' : 'bg-success-500'}`}
              style={{ width: `${systemData.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disk Usage</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Usage</span>
            <span className="text-sm font-medium text-gray-900">{systemData.diskUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${systemData.diskUsage > 90 ? 'bg-danger-500' : systemData.diskUsage > 75 ? 'bg-warning-500' : 'bg-success-500'}`}
              style={{ width: `${systemData.diskUsage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Check
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {systemData.services.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Server className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1">{service.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.uptime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.responseTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(service.lastCheck)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-4">
          {systemData.alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`border rounded-lg p-4 ${
                alert.type === 'error' ? 'border-danger-200 bg-danger-50' :
                alert.type === 'warning' ? 'border-warning-200 bg-warning-50' :
                'border-primary-200 bg-primary-50'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {alert.type === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-danger-400" />
                  ) : alert.type === 'warning' ? (
                    <AlertCircle className="h-5 w-5 text-warning-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-primary-400" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      alert.type === 'error' ? 'text-danger-800' :
                      alert.type === 'warning' ? 'text-warning-800' :
                      'text-primary-800'
                    }`}>
                      {alert.message}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                  {alert.resolved && (
                    <p className="mt-1 text-sm text-gray-600">Resolved</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Requests</span>
              <span className="text-sm font-medium text-gray-900">{systemData.metrics.totalRequests.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Successful Requests</span>
              <span className="text-sm font-medium text-success-600">{systemData.metrics.successfulRequests.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Failed Requests</span>
              <span className="text-sm font-medium text-danger-600">{systemData.metrics.failedRequests.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {((systemData.metrics.successfulRequests / systemData.metrics.totalRequests) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="text-sm font-medium text-gray-900">{systemData.metrics.avgResponseTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Peak Concurrent Users</span>
              <span className="text-sm font-medium text-gray-900">{systemData.metrics.peakConcurrentUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Processed</span>
              <span className="text-sm font-medium text-gray-900">{systemData.metrics.dataProcessed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Health</span>
              <span className="text-sm font-medium text-success-600 capitalize">{systemData.overallHealth}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
