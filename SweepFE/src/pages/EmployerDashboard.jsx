import React from 'react';
import { useEmployerDashboard } from '../hooks/useEmployerDashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import DashboardStats from '../components/dashboard/DashboardStats';
import TaskFilters from '../components/dashboard/TaskFilters';
import EmployerDashboardContent from '../components/dashboard/EmployerDashboardContent';
import EmployerDashboardModals from '../components/dashboard/EmployerDashboardModals';
import ErrorMessage from '../components/dashboard/ErrorMessage';

const EmployerDashboard = () => {  const {
    //states
    tasks,
    fields,
    taskAssignments,
    loading,
    error,
    dashboardStats,
    refreshing,
    employerProfile,
    profileLoading,
    
    //modal states
    showTaskForm,
    showTaskDetails,
    showStudentSelection,
    selectedTask,
    editingTask,
    taskToAssign,
    
    //actions
    setError,
    handleRefresh,
    handleFiltersChange,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleViewTaskDetails,
    handleEditTask,
    handleNewTask,
    handleAssignTask,
    handleAssignmentSuccess,
    handleCloseStudentSelection,
    handleTaskApproval,
    handleTaskUnassign,

    //modal setters
    setShowTaskForm,
    setShowTaskDetails,
    setEditingTask,
    setSelectedTask
  } = useEmployerDashboard();

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleCloseTaskDetails = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">      <DashboardHeader 
        userType="employer"
        profile={employerProfile}
        profileLoading={profileLoading}
        onNewTask={handleNewTask}
        showTokens={false}
      />

      <WelcomeBanner 
        userType="employer"
        profile={employerProfile}
        profileLoading={profileLoading}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">          <div className="mb-8">
            <DashboardStats variant="employer" stats={dashboardStats} />
          </div>

          <ErrorMessage 
            error={error}
            onRetry={() => {
              setError(null);
            }}
            onDismiss={() => setError(null)}
          />          <div className="mb-6">
            <TaskFilters 
              onFiltersChange={handleFiltersChange}
              fields={fields}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          </div>

          <EmployerDashboardContent 
            loading={loading}
            tasks={tasks}
            error={error}
            filters={{}}
            taskAssignments={taskAssignments}
            onNewTask={handleNewTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onViewTaskDetails={handleViewTaskDetails}
            onAssignTask={handleAssignTask}
          />
        </div>
      </main>

      <EmployerDashboardModals 
        showTaskForm={showTaskForm}
        showTaskDetails={showTaskDetails}
        showStudentSelection={showStudentSelection}
        selectedTask={selectedTask}
        editingTask={editingTask}
        taskToAssign={taskToAssign}
        onCloseTaskForm={handleCloseTaskForm}
        onCloseTaskDetails={handleCloseTaskDetails}
        onCloseStudentSelection={handleCloseStudentSelection}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onTaskApproval={handleTaskApproval}
        onTaskUnassign={handleTaskUnassign}
        onAssignmentSuccess={handleAssignmentSuccess}
      />
    </div>
  );
};

export default EmployerDashboard;