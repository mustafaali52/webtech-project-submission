import React from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import AttachmentsList from './AttachmentsList';

const TaskDetailsModal = ({ isOpen, onClose, task, onEdit, onDelete, onApprove, onUnassign }) => {
  if (!isOpen || !task) return null;

  const getComplexityInfo = (complexity) => {
    const complexityMap = {
      75: { label: 'Easy', color: 'bg-green-100 text-green-800', tokens: '75 tokens' },
      100: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', tokens: '100 tokens' },
      150: { label: 'Hard', color: 'bg-red-100 text-red-800', tokens: '150 tokens' }
    };
    
    return complexityMap[complexity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', tokens: 'Unknown tokens' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };  
    const isExpired = new Date(task.deadline) < new Date();
  const complexityInfo = getComplexityInfo(task.complexity);
  const hasAssignments = task.assignments && task.assignments.length > 0;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

        <div className="flex justify-between items-start p-6 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-1 pr-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 break-words">{task.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${complexityInfo.color} shadow-sm`}>
                <AcademicCapIcon className="h-4 w-4 mr-1" />
                {complexityInfo.label} ({complexityInfo.tokens})
              </span>
              {task.requiresExperience && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  Experience Required
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 shadow-sm">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Expired
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                Description
              </h4>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>
            </div>

            {task.attachments && task.attachments.length > 0 && (
              <AttachmentsList 
                attachments={task.attachments} 
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200"
              />
            )}

            {hasAssignments && task.assignments[0] && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-amber-600" />
                  Current Assignment
                </h4>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">
                      {task.assignments[0].studentName}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {task.assignments[0].university} • {task.assignments[0].email}
                    </p>
                  </div>                    
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {task.assignments[0].approvedAt ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Approved ({task.assignments[0].tokensAwarded} tokens)
                      </span>
                    ) : task.assignments[0].completedAt ? (
                      <>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          ⏳ Completed
                        </span>
                        <button
                          onClick={() => onApprove && onApprove(task.assignments[0])}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                      </>                      
                      ) : task.assignments[0].acceptedAt ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        🔄 In Progress
                      </span>
                    ) : (
                      <>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          ⏸️ Pending
                        </span>
                        <button
                          onClick={() => onUnassign && onUnassign(task.assignments[0])}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Unassign
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Assigned: {formatDateShort(task.assignments[0].requestedAt)}
                  {task.assignments[0].completedAt && (
                    <> • Completed: {formatDateShort(task.assignments[0].completedAt)}</>
                  )}
                  {task.assignments[0].approvedAt && (
                    <> • Approved: {formatDateShort(task.assignments[0].approvedAt)}</>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                  Task Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Deadline</p>
                    <p className="text-gray-600 text-xs">{formatDate(task.deadline)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Field</p>
                    <p className="text-gray-600">{task.fieldName}</p>
                  </div>
                  {task.monetaryCompensation && (
                    <div>
                      <p className="font-medium text-gray-900">Compensation</p>
                      <p className="text-gray-600">${task.monetaryCompensation}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Created</p>
                    <p className="text-gray-600">{formatDateShort(task.createdAt)}</p>
                  </div>
                  {task.updatedAt && task.updatedAt !== task.createdAt && (
                    <div>
                      <p className="font-medium text-gray-900">Last Updated</p>
                      <p className="text-gray-600">{formatDateShort(task.updatedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-green-600" />
                  Employer
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Name</p>
                    <p className="text-gray-600">{task.employerName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Organization</p>
                    <p className="text-gray-600">{task.organization}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-purple-600" />
                  Statistics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{task.totalRequests || 0}</div>
                    <div className="text-xs text-gray-600">Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{task.acceptedRequests || 0}</div>
                    <div className="text-xs text-gray-600">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{task.completedTasks || 0}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{task.approvedTasks || 0}</div>
                    <div className="text-xs text-gray-600">Approved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onEdit(task)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Edit Task
              </button>
              <button
                onClick={() => onDelete(task)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
