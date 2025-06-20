import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  BellIcon
} from '@heroicons/react/24/outline';
import StudentTaskCard from './StudentTaskCard';

const StudentDashboardContent = ({ 
  loading, 
  activeTab, 
  currentAssignments, 
  actionLoading,
  onAcceptTask,
  onRejectTask,
  onCompleteTask
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <span className="mt-4 text-gray-600 font-medium">
            Loading your assignments...
          </span>
        </div>
      </div>
    );
  }

  if (currentAssignments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
          {activeTab === 'pending' && <BellIcon className="h-16 w-16" />}
          {activeTab === 'accepted' && <ClockIcon className="h-16 w-16" />}
          {activeTab === 'completed' && <CheckCircleIcon className="h-16 w-16" />}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No {activeTab} assignments
        </h3>

        <p className="text-gray-500 max-w-md mx-auto">
          {activeTab === 'pending' && "You don't have any pending task assignments. New opportunities will appear here when employers assign tasks to you."}
          {activeTab === 'accepted' && "You don't have any tasks in progress. Accept pending tasks to start working on them."}
          {activeTab === 'completed' && "You haven't completed any tasks yet. Complete your accepted tasks to earn SWEEP tokens!"}
        </p>

      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {currentAssignments.map((assignment) => (
        <StudentTaskCard
          key={assignment.assignmentId}
          assignment={assignment}
          onAccept={() => onAcceptTask(assignment.assignmentId)}
          onReject={() => onRejectTask(assignment.assignmentId)}
          onComplete={() => onCompleteTask(assignment.assignmentId)}
          isLoading={actionLoading[assignment.assignmentId]}
        />
      ))}
    </div>
    
  );
};

export default StudentDashboardContent;
