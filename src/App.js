import React, { useState } from 'react';
import { Search, Users, BarChart3, Activity, Settings } from 'lucide-react';
import AgentSearch from './components/AgentSearch';
import PerformanceDashboard from './components/PerformanceDashboard';
import ActiveAgentsDashboard from './components/ActiveAgentsDashboard';
import ConversationAnalytics from './components/ConversationAnalytics';
import SystemHealth from './components/SystemHealth';

function App() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const tabs = [
    { id: 'active', name: 'Active Agents', icon: Users },
    { id: 'search', name: 'Agent Search', icon: Search },
    { id: 'performance', name: 'Performance', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: Activity },
    { id: 'system', name: 'System Health', icon: Settings }
  ];

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('performance');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Guide Intelligence Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Real-time Agent Performance Monitoring
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'active' && (
          <ActiveAgentsDashboard />
        )}
        
        {activeTab === 'search' && (
          <AgentSearch onAgentSelect={handleAgentSelect} />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceDashboard agent={selectedAgent} />
        )}
        
        {activeTab === 'analytics' && (
          <ConversationAnalytics />
        )}
        
        {activeTab === 'system' && (
          <SystemHealth />
        )}
      </main>
    </div>
  );
}

export default App;
