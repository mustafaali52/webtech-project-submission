import React from 'react';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import DashboardStats from '../components/dashboard/DashboardStats';
import StudentDashboardTabs from '../components/dashboard/StudentDashboardTabs';
import StudentDashboardContent from '../components/dashboard/StudentDashboardContent';
import StudentDashboardFooter from '../components/dashboard/StudentDashboardFooter';
import ErrorMessage from '../components/dashboard/ErrorMessage';

const StudentDashboard = () => {
  const {
    //state
    studentProfile,
    loading,
    profileLoading,
    error,
    actionLoading,
    activeTab,
    refreshing,
    
    //compute
    pendingAssignments,
    acceptedAssignments,
    completedAssignments,
    
    //action
    setActiveTab,
    setError,
    fetchAssignments,
    fetchStudentProfile,
    handleRefresh,
    handleAcceptTask,
    handleRejectTask,
    handleCompleteTask,
    getCurrentAssignments
  } = useStudentDashboard();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <DashboardHeader 
        userType="student"
        profile={studentProfile}
        profileLoading={profileLoading}
        showTokens={true}
      />
        <WelcomeBanner 
        userType="student"
        profile={studentProfile}
        profileLoading={profileLoading}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-8">

            <DashboardStats 
              variant="student"
              pending={pendingAssignments.length}
              inProgress={acceptedAssignments.length}
              completed={completedAssignments.length}
              tokenBalance={studentProfile?.tokenBalance || 0}
            />
          </div>

          <ErrorMessage 
            error={error}
            onRetry={() => {
              setError(null);
              fetchAssignments();
              fetchStudentProfile();
            }}
            onDismiss={() => setError(null)}
          />

          <StudentDashboardTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingCount={pendingAssignments.length}
            acceptedCount={acceptedAssignments.length}
            completedCount={completedAssignments.length}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
            loading={loading}
          />

          <StudentDashboardContent 
            loading={loading}
            activeTab={activeTab}
            currentAssignments={getCurrentAssignments()}
            actionLoading={actionLoading}
            onAcceptTask={handleAcceptTask}
            onRejectTask={handleRejectTask}
            onCompleteTask={handleCompleteTask}
          />
        </div>
      </main>

      {!loading && !profileLoading && studentProfile && (
        <StudentDashboardFooter 
          completedAssignments={completedAssignments}
          pendingAssignments={pendingAssignments}
          studentProfile={studentProfile}
        />
      )}
    </div>
  );
};

export default StudentDashboard;