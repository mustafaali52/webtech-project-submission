import React from 'react';
import { CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const TaskCard = ({ task, onEdit, onDelete, onViewDetails, onAssignTask, assignmentData }) => {
  const getComplexityBadge = (complexity) => {
    const complexityMap = {
      75: { label: 'Easy', color: 'bg-green-100 text-green-800' },
      100: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      150: { label: 'Hard', color: 'bg-red-100 text-red-800' }
    };
    
    const complexityInfo = complexityMap[complexity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${complexityInfo.color}`}>
        {complexityInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const isExpired = new Date(task.deadline) < new Date();
  const hasAwaitingAcceptance = assignmentData?.hasAwaitingAcceptance || false;
  const hasActiveAssignments = assignmentData?.hasActiveAssignments || false;
  const canAssign = !isExpired && !hasActiveAssignments;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">

        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              {getComplexityBadge(task.complexity)}
              {task.requiresExperience && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Experience Required
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Expired
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Deadline: {formatDate(task.deadline)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-2" />
            <span>Field: {task.fieldName}</span>
          </div>

          {task.monetaryCompensation && (
            <div className="flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              <span>${task.monetaryCompensation}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>Posted: {formatDate(task.createdAt)}</span>
          </div>
        </div>        

        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <span>{task.assignmentCount} assignment(s)</span>
            {hasAwaitingAcceptance && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Awaiting Acceptance
              </span>
            )}
          </div>
          <span>By: {task.employerName}</span>
        </div>
   
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(task)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>            
            <button
              onClick={() => onAssignTask(task)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                canAssign
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canAssign}              
              title={
                isExpired 
                  ? "Cannot assign expired tasks" 
                  : hasActiveAssignments 
                    ? "Task has active assignments" 
                    : "Assign this task to students"
              }            >
              {hasActiveAssignments ? 'Has Active Assignment' : 'Assign Task'}
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task)}
              className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
