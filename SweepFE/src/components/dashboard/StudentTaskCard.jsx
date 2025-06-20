import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  UserIcon,
  TagIcon,
  EyeIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import StudentTaskDetailsModal from './StudentTaskDetailsModal';

const StudentTaskCard = ({ assignment, onAccept, onReject, onComplete, isLoading }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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
  const getComplexityBadge = (complexity) => {
    const complexityMap = {
      75: { label: 'Easy', color: 'bg-gradient-to-r from-green-500 to-green-600 text-white', tokens: '75 Tokens' },
      100: { label: 'Medium', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white', tokens: '100 Tokens' },
      150: { label: 'Hard', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white', tokens: '150 Tokens' }
    };
    
    const complexityInfo = complexityMap[complexity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', tokens: '0 Tokens' };
    
    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${complexityInfo.color}`}>
          {complexityInfo.label}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <StarIcon className="h-3 w-3 mr-1" />
          {complexityInfo.tokens}
        </span>
      </div>
    );
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpired = new Date(assignment.deadline) < new Date();
  const isPending = !assignment.acceptedAt;
  const isInProgress = assignment.acceptedAt && !assignment.completedAt;
  const isCompleted = assignment.completedAt && !assignment.approvedAt;
  const isApproved = assignment.approvedAt;

  // Check if any action is in progress
  const isActionLoading = isLoading && typeof isLoading === 'string';
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Card Header with Status Indicator */}
      <div className={`h-2 ${
        isApproved ? 'bg-gradient-to-r from-green-400 to-green-500' :
        isCompleted ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
        isInProgress ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
        'bg-gradient-to-r from-gray-300 to-gray-400'
      }`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {assignment.taskTitle}
            </h3>
            <div className="flex items-center space-x-2 mb-3 flex-wrap gap-2">
              {getComplexityBadge(assignment.complexity)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment)}`}>
                {getStatusText(assignment)}
              </span>
              {isExpired && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  ⚠️ Expired
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {assignment.taskDescription}
        </p>

        <div className="grid grid-cols-1 gap-3 mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-sm text-gray-700">
            <CalendarIcon className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
            <span className="font-medium">Deadline:</span>
            <span className="ml-2">{formatDate(assignment.deadline)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <UserIcon className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />
            <span className="font-medium">Employer:</span>
            <span className="ml-2">{assignment.employerName || 'Unknown'}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <TagIcon className="h-4 w-4 mr-3 text-purple-500 flex-shrink-0" />
            <span className="font-medium">Field:</span>
            <span className="ml-2">{assignment.fieldName || 'General'}</span>
          </div>          
          
          {assignment.monetaryCompensation && (
            <div className="flex items-center text-sm text-gray-700">
              <CurrencyDollarIcon className="h-4 w-4 mr-3 text-yellow-500 flex-shrink-0" />
              <span className="font-medium">Compensation:</span>
              <span className="ml-2 text-green-600 font-semibold">${assignment.monetaryCompensation}</span>
            </div>
          )}

          {isApproved && assignment.tokensAwarded && (
            <div className="flex items-center text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-2">
              <StarIcon className="h-4 w-4 mr-3 text-yellow-500 flex-shrink-0" />
              <span className="font-medium">Tokens Earned:</span>
              <span className="ml-2 text-yellow-600 font-bold">{assignment.tokensAwarded} Tokens</span>
            </div>
          )}
        </div>        

        <div className="flex flex-col space-y-3">

          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Full Details
          </button>

          {isPending && !isExpired && (
            <div className="flex space-x-3">
              <button
                onClick={onAccept}
                disabled={isActionLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
              >
                {isLoading === 'accepting' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Accept
                  </>
                )}
              </button>
              <button
                onClick={onReject}
                disabled={isActionLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
              >
                {isLoading === 'rejecting' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  '✖️ Decline'
                )}
              </button>
            </div>
          )}

          {isInProgress && !isExpired && (
            <button
              onClick={onComplete}
              disabled={isActionLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
            >
              {isLoading === 'completing' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Mark Complete
                </>
              )}
            </button>
          )}

          {(isExpired && isPending) && (
            <div className="text-center text-sm text-red-600 py-3 bg-red-50 rounded-lg border border-red-200 font-medium">
              ⚠️ This task has expired and can no longer be accepted
            </div>
          )}

          {isCompleted && !isApproved && (
            <div className="text-center text-sm text-blue-600 py-3 bg-blue-50 rounded-lg border border-blue-200 font-medium">
              <ClockIcon className="h-4 w-4 inline mr-2" />
              Awaiting employer approval
            </div>
          )}

          {isApproved && (
            <div className="text-center text-sm text-green-600 py-3 bg-green-50 rounded-lg border border-green-200 font-medium">
              ✅ Task completed successfully! Tokens have been awarded.
            </div>
          )}
        </div>
      </div>

      <StudentTaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        assignment={assignment}
        onAccept={() => {
          setIsDetailsModalOpen(false);
          onAccept();
        }}
        onReject={() => {
          setIsDetailsModalOpen(false);
          onReject();
        }}
        onComplete={() => {
          setIsDetailsModalOpen(false);
          onComplete();
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StudentTaskCard;
