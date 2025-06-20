import React from 'react';

const StudentDashboardFooter = ({ 
  completedAssignments, 
  pendingAssignments, 
  studentProfile 
}) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tip</h4>
            <p className="text-sm text-blue-700">
              Complete tasks early to build a strong reputation with employers and increase your chances of getting more assignments!
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">🎯 Your Progress</h4>
            <p className="text-sm text-green-700">
              You've completed {completedAssignments.length} task{completedAssignments.length !== 1 ? 's' : ''} and earned {studentProfile?.tokenBalance || 0} SWEEP tokens. Keep up the great work!
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">🚀 Next Goal</h4>
            <p className="text-sm text-purple-700">
              {pendingAssignments.length > 0 
                ? `You have ${pendingAssignments.length} pending assignment${pendingAssignments.length !== 1 ? 's' : ''}. Review and accept them to start earning!`
                : 'All caught up! New opportunities will appear here when available.'
              }
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StudentDashboardFooter;
