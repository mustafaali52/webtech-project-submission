import React from 'react';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ 
  variant = 'employer', 
  stats = {},
  pending = 0,
  inProgress = 0,
  completed = 0,
  tokenBalance = 0 
}) => {
  
  const getEmployerStats = () => {
    const defaultStats = {
      totalTasks: 0,
      activeTasks: 0,
      completedTasks: 0,
      totalAssignments: 0,
      ...stats
    };

    return [
      {
        name: 'Total Tasks',
        value: defaultStats.totalTasks,
        icon: BriefcaseIcon,
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        iconColor: 'text-blue-100',
        change: null
      },
      {
        name: 'Active Tasks',
        value: defaultStats.activeTasks,
        icon: ClockIcon,
        bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        iconColor: 'text-yellow-100',
        change: defaultStats.activeTasks > 0 ? '+' + defaultStats.activeTasks : null
      },
      {
        name: 'Completed Tasks',
        value: defaultStats.completedTasks,
        icon: CheckCircleIcon,
        bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
        iconColor: 'text-green-100',
        change: defaultStats.completedTasks > 0 ? '+' + defaultStats.completedTasks : null
      },
      {
        name: 'Total Assignments',
        value: defaultStats.totalAssignments,
        icon: UserGroupIcon,
        bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
        iconColor: 'text-purple-100',
        change: defaultStats.totalAssignments > 0 ? '+' + defaultStats.totalAssignments : null
      }
    ];
  };

  const getStudentStats = () => {
    const total = pending + inProgress + completed;
    
    return [
      {
        name: 'Total Assignments',
        value: total,
        icon: ClipboardDocumentListIcon,
        bgColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
        iconColor: 'text-slate-100',
        change: null
      },
      {
        name: 'Pending Tasks',
        value: pending,
        icon: BellIcon,
        bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        iconColor: 'text-yellow-100',
        change: pending > 0 ? '+' + pending : null
      },
      {
        name: 'In Progress',
        value: inProgress,
        icon: ClockIcon,
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        iconColor: 'text-blue-100',
        change: inProgress > 0 ? '+' + inProgress : null
      },
      {
        name: 'Completed',
        value: completed,
        icon: CheckCircleIcon,
        bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
        iconColor: 'text-green-100',
        change: completed > 0 ? '+' + completed : null
      },
      {
        name: 'Token Balance',
        value: tokenBalance,
        icon: CurrencyDollarIcon,
        bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        iconColor: 'text-yellow-100',
        suffix: ' Tokens'
      }
    ];
  };

  const statData = variant === 'student' ? getStudentStats() : getEmployerStats();
  const gridCols = variant === 'student' 
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridCols} gap-4 mb-8`}>
      {statData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate mb-2">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stat.value}{stat.suffix || ''}
                  </dd>
                  <div className="mt-2 h-6 flex items-center">
                    {stat.change && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`flex-shrink-0 w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
