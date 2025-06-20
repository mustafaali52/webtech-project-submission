import React from 'react';
import { PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import TaskCard from './TaskCard';

const EmployerDashboardContent = ({
  loading,
  tasks,
  error,
  filters,
  taskAssignments,
  onNewTask,
  onEditTask,
  onDeleteTask,
  onViewTaskDetails,
  onAssignTask
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Cog6ToothIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600 mb-6">
          {Object.keys(filters).length > 0 
            ? 'Try adjusting your filters or create a new task.'
            : 'Get started by creating your first task.'
          }
        </p>
        <button
          onClick={onNewTask}
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Your First Task
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.jobTaskId}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onViewDetails={onViewTaskDetails}
          onAssignTask={onAssignTask}
          assignmentData={taskAssignments[task.jobTaskId]}
        />
      ))}
    </div>
  );
};

export default EmployerDashboardContent;
