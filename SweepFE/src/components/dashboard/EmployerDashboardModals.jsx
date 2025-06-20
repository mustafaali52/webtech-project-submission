import React from 'react';
import TaskFormModal from './TaskFormModal';
import TaskDetailsModal from './TaskDetailsModal';
import StudentSelectionModal from './StudentSelectionModal';

const EmployerDashboardModals = ({
  showTaskForm,
  showTaskDetails,
  showStudentSelection,
  selectedTask,
  editingTask,
  taskToAssign,
  onCloseTaskForm,
  onCloseTaskDetails,
  onCloseStudentSelection,
  onCreateTask,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
  onTaskApproval,
  onTaskUnassign,
  onAssignmentSuccess
}) => {
  return (
    <>
      <TaskFormModal
        isOpen={showTaskForm}
        onClose={onCloseTaskForm}
        task={editingTask}
        onSubmit={editingTask ? onUpdateTask : onCreateTask}
      />

      <TaskDetailsModal
        isOpen={showTaskDetails}
        onClose={onCloseTaskDetails}
        task={selectedTask}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onApprove={onTaskApproval}
        onUnassign={onTaskUnassign}
      />

      <StudentSelectionModal
        isOpen={showStudentSelection}
        onClose={onCloseStudentSelection}
        task={taskToAssign}
        onAssignSuccess={onAssignmentSuccess}
      />
    </>
  );
};

export default EmployerDashboardModals;
