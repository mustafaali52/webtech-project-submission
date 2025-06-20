import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const StudentDashboardTabs = ({ 
  activeTab, 
  setActiveTab, 
  pendingCount, 
  acceptedCount, 
  completedCount,
  handleRefresh,
  refreshing,
  loading 
}) => {
  const tabs = [
    { id: 'pending', name: 'Pending', count: pendingCount, icon: BellIcon },
    { id: 'accepted', name: 'In Progress', count: acceptedCount, icon: ClockIcon },
    { id: 'completed', name: 'Completed', count: completedCount, icon: CheckCircleIcon },
  ];

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-2 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardTabs;
