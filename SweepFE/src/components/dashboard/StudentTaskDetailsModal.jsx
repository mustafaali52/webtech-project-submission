import React from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AttachmentsList from './AttachmentsList';

const StudentTaskDetailsModal = ({ isOpen, onClose, assignment, onAccept, onReject, onComplete, isLoading }) => {
  if (!isOpen || !assignment) return null;

  const task = assignment.task || assignment;

  const getComplexityInfo = (complexity) => {
    const complexityMap = {
      75: { label: 'Easy', color: 'bg-green-100 text-green-800', tokens: '75 tokens' },
      100: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', tokens: '100 tokens' },
      150: { label: 'Hard', color: 'bg-red-100 text-red-800', tokens: '150 tokens' }
    };
    
    return complexityMap[complexity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', tokens: 'Unknown tokens' };
  };

  const getStatusColor = (assignment) => {
    if (assignment.approvedAt) return 'bg-green-100 text-green-800';
    if (assignment.completedAt) return 'bg-blue-100 text-blue-800';
    if (assignment.acceptedAt) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (assignment) => {
    if (assignment.approvedAt) return `Approved (${assignment.tokensAwarded || 0} tokens)`;
    if (assignment.completedAt) return 'Completed - Awaiting Approval';
    if (assignment.acceptedAt) return 'In Progress';
    return 'Pending Acceptance';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    console.log("task: ", task);
    console.log("assignment: ", assignment);
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpired = new Date(task.deadline) < new Date();
  const complexityInfo = getComplexityInfo(task.complexity);
  const isPending = !assignment.acceptedAt;
  const isInProgress = assignment.acceptedAt && !assignment.completedAt;
  const isCompleted = assignment.completedAt && !assignment.approvedAt;
  const isApproved = assignment.approvedAt;
  const isActionLoading = isLoading && typeof isLoading === 'string';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center py-4 px-4">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl">

          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {task.title}
              </h2>
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${complexityInfo.color}`}>
                  {complexityInfo.label} • {complexityInfo.tokens}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment)}`}>
                  {getStatusText(assignment)}
                </span>
                {isExpired && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Expired
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 space-y-6">

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Task Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                {task.attachments && task.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Task Attachments</h3>
                    <AttachmentsList 
                      attachments={task.attachments} 
                      showTitle={false}
                      className="bg-gray-50 rounded-lg p-4"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Field</p>
                          <p className="text-sm text-gray-600">
                            {assignment.fieldName || 'General'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Experience Required</p>
                          <p className="text-sm text-gray-600">
                            {task.requiresExperience ? "Yes" : "No"} 
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Assigned</span>
                      <span className="text-sm text-gray-600">{formatDateShort(assignment.requestedAt)}</span>
                    </div>
                    {assignment.acceptedAt && (
                      <div className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Accepted</span>
                        <span className="text-sm text-gray-600">{formatDateShort(assignment.acceptedAt)}</span>
                      </div>
                    )}
                    {assignment.completedAt && (
                      <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Completed</span>
                        <span className="text-sm text-gray-600">{formatDateShort(assignment.completedAt)}</span>
                      </div>
                    )}
                    {assignment.approvedAt && (
                      <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Approved</span>
                        <span className="text-sm text-gray-600">{formatDateShort(assignment.approvedAt)}</span>
                      </div>
                    )}
                    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${isExpired ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <span className="text-sm font-medium text-gray-900">Deadline</span>
                      <span className={`text-sm ${isExpired ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {formatDateShort(task.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
                  <AttachmentsList attachments={task.attachments} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Task Information</h3>
                  <div className="space-y-3">
                    
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Deadline
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(task.deadline)}
                        </p>
                      </div>
                    </div>

                    {task.monetaryCompensation && (
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Compensation</p>
                          <p className="text-sm text-gray-600">
                            ${task.monetaryCompensation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Employer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Employer
                        </p>
                        <p className="text-sm text-gray-600">
                          {task.employerName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Organization
                        </p>
                        <p className="text-sm text-gray-600">
                          {task.organization || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Actions
                  </h3>
                  
                  {isPending && !isExpired && (
                    <div className="space-y-3">
                      <button
                        onClick={onAccept}
                        disabled={isActionLoading}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading === 'accepting' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2">
                              
                            </div>
                            Accepting Task...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Accept Task
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={onReject}
                        disabled={isActionLoading}
                        className="w-full bg-red-600 text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading === 'rejecting' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Rejecting Task...
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Reject Task
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isInProgress && !isExpired && (
                    <button
                      onClick={onComplete}
                      disabled={isActionLoading}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading === 'completing' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Marking Complete...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  )}

                  {isExpired && isPending && (
                    <div className="text-center text-sm text-gray-500 py-3 bg-red-50 rounded-md">
                      This task has expired and can no longer be accepted
                    </div>
                  )}

                  {(isCompleted || isApproved) && (
                    <div className="text-center text-sm text-gray-500 py-3 bg-gray-50 rounded-md">
                      {isCompleted ? 'Waiting for employer approval' : 'Task completed successfully'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTaskDetailsModal;
