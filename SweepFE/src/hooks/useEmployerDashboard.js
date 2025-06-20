import { useState, useEffect, useCallback } from "react";
import taskAPI from "../services/taskAPI";
import taskAssignmentAPI from "../services/taskAssignmentAPI";
import AuthAPI from "../services/authAPI";

export const useEmployerDashboard = () => {
  //state management
  const [tasks, setTasks] = useState([]);
  const [fields, setFields] = useState([]);
  const [taskAssignments, setTaskAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [employerProfile, setEmployerProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  //modal states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showStudentSelection, setShowStudentSelection] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToAssign, setTaskToAssign] = useState(null);

  //filter states
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  //stats
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalAssignments: 0,
  });

  //fetch tasks from API
  const fetchTasks = useCallback(async (page = 1, searchFilters = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await taskAPI.getMyTasks(page, 10);

      //filter tasks
      let filteredTasks = response;

      if (searchFilters.search) {
        const searchTerm = searchFilters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
      }

      if (searchFilters.fieldId) {
        filteredTasks = filteredTasks.filter(
          (task) => task.fieldId === searchFilters.fieldId
        );
      }

      if (searchFilters.complexity) {
        filteredTasks = filteredTasks.filter(
          (task) => task.complexity === searchFilters.complexity
        );
      }

      if (searchFilters.requiresExperience !== undefined) {
        filteredTasks = filteredTasks.filter(
          (task) => task.requiresExperience === searchFilters.requiresExperience
        );
      }

      if (!searchFilters.includeExpired) {
        filteredTasks = filteredTasks.filter(
          (task) => new Date(task.deadline) >= new Date()
        );
      }

      setTasks(filteredTasks);

      //calculate stats
      const stats = {
        totalTasks: filteredTasks.length,
        activeTasks: filteredTasks.filter(
          (task) => new Date(task.deadline) >= new Date()
        ).length,
        completedTasks: filteredTasks.filter((task) => task.assignmentCount > 0)
          .length,
        totalAssignments: filteredTasks.reduce(
          (sum, task) => sum + (task.assignmentCount || 0),
          0
        ),
      };

      setDashboardStats(stats);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  //fetch fields for filters
  const fetchFields = useCallback(async () => {
    try {
      const fieldsData = await taskAPI.getFields();
      setFields(fieldsData);
    } catch (err) {
      console.error("Error fetching fields:", err);
    }
  }, []);

  //fetch employer profile
  const fetchEmployerProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const profileData = await AuthAPI.getEmployerProfile();
      console.log("Employer profile data:", profileData);
      setEmployerProfile(profileData);
    } catch (err) {
      console.error("Failed to fetch employer profile:", err);
      // Don't set error for profile fetch failure since it's not critical
    } finally {
      setProfileLoading(false);
    }
  }, []);

  //fetch assignment data for all tasks
  const fetchTaskAssignments = useCallback(async () => {
    try {
      const assignments = await taskAssignmentAPI.getEmployerAssignments();

      //group assignments by task ID and check for pending assignments
      const assignmentMap = {};
      assignments.forEach((assignment) => {
        if (!assignmentMap[assignment.taskId]) {
          assignmentMap[assignment.taskId] = [];
        }
        assignmentMap[assignment.taskId].push(assignment);
      });

      //create map of task ID to assignment status
      const pendingAssignmentMap = {};
      Object.keys(assignmentMap).forEach((taskId) => {
        const taskAssignments = assignmentMap[taskId];

        //any assignments awaiting acceptance
        const hasAwaitingAcceptance = taskAssignments.some(
          (assignment) => !assignment.acceptedAt && !assignment.rejectedAt
        );

        //check if there are any active assignments
        const hasActiveAssignments = taskAssignments.some(
          (assignment) =>
            !assignment.rejectedAt &&
            (!assignment.completedAt || !assignment.approvedAt)
        );

        pendingAssignmentMap[taskId] = {
          assignments: taskAssignments,
          hasAwaitingAcceptance,
          hasActiveAssignments,
        };
      });

      setTaskAssignments(pendingAssignmentMap);
    } catch (err) {
      console.error("Error fetching task assignments:", err);
    }
  }, []);

  //initialize
  useEffect(() => {
    fetchTasks(1, {});
    fetchFields();
    fetchTaskAssignments();
    fetchEmployerProfile();
  }, [fetchTasks, fetchFields, fetchTaskAssignments, fetchEmployerProfile]);

  //handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      await Promise.all([
        fetchTasks(currentPage, filters),
        fetchFields(),
        fetchTaskAssignments(),
        fetchEmployerProfile(),
      ]);
    } catch (err) {
      console.error("Refresh failed:", err);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  //filter changes
  const handleFiltersChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setCurrentPage(1);
      fetchTasks(1, newFilters);
    },
    [fetchTasks]
  );

  //crud ops
  const handleCreateTask = async (taskData, attachments = []) => {
    await taskAPI.createTask(taskData, attachments);
    fetchTasks(currentPage, filters);
    setShowTaskForm(false);
  };

  const handleUpdateTask = async (taskData) => {
    await taskAPI.updateTask(editingTask.jobTaskId, taskData);
    fetchTasks(currentPage, filters);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (task) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await taskAPI.deleteTask(task.jobTaskId);
        fetchTasks(currentPage, filters);
        setShowTaskDetails(false);
        setSelectedTask(null);
      } catch (error) {
        setError(error.message || "Failed to delete task");
      }
    }
  };

  //modal handler
  const handleViewTaskDetails = async (task) => {
    try {
      const taskDetails = await taskAPI.getTask(task.jobTaskId);
      setSelectedTask(taskDetails);
      setShowTaskDetails(true);
    } catch (error) {
      setError(error.message || "Failed to fetch task details");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setShowTaskDetails(false);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  //task assignment handler
  const handleAssignTask = (task) => {
    setTaskToAssign(task);
    setShowStudentSelection(true);
  };

  const handleAssignmentSuccess = async (task, student) => {
    //refresh task details
    await fetchTasks(currentPage, filters);

    //refresh assignment data
    await fetchTaskAssignments();

    //show success
    alert(
      `Task "${task.title}" has been successfully assigned to ${student.studentName}`
    );

    setShowStudentSelection(false);
    setTaskToAssign(null);
  };

  const handleCloseStudentSelection = () => {
    setShowStudentSelection(false);
    setTaskToAssign(null);
  };

  //task approval
  const handleTaskApproval = async (assignment) => {
    const tokensAwarded = prompt(
      `How many tokens would you like to award for this completed task?\n\nComplexity: ${selectedTask?.complexity} tokens\nStudent: ${assignment.studentName}`,
      selectedTask?.complexity?.toString() || "75"
    );

    if (tokensAwarded === null) {
      return;
    }

    const tokens = parseInt(tokensAwarded);
    if (isNaN(tokens) || tokens <= 0) {
      alert("Please enter a valid number of tokens greater than 0");
      return;
    }

    try {
      await taskAssignmentAPI.approveCompletion(
        assignment.assignmentId,
        tokens
      );

      //refresh task details to show updation
      const updatedTaskDetails = await taskAPI.getTask(selectedTask.jobTaskId);
      setSelectedTask(updatedTaskDetails);

      //refresh tasks and assignments
      await fetchTasks(currentPage, filters);
      await fetchTaskAssignments();

      alert(
        `Task approved successfully! ${tokens} tokens awarded to ${assignment.studentName}.`
      );
    } catch (error) {
      console.error("Error approving task:", error);
      alert(error.message || "Failed to approve task. Please try again.");
    }
  };

  //task unassign handler
  const handleTaskUnassign = async (assignment) => {
    const confirmUnassign = window.confirm(
      `Are you sure you want to unassign this task from ${assignment.studentName}?\n\nThis action cannot be undone.`
    );

    if (!confirmUnassign) {
      return;
    }

    try {
      await taskAssignmentAPI.unassignTask(assignment.assignmentId);

      //refresh task details to show updated status
      const updatedTaskDetails = await taskAPI.getTask(selectedTask.jobTaskId);
      setSelectedTask(updatedTaskDetails);

      //refresh tasks and assignments
      await fetchTasks(currentPage, filters);
      await fetchTaskAssignments();

      alert("Task has been successfully unassigned.");
    } catch (error) {
      console.error("Error unassigning task:", error);
      alert("Failed to unassign task: " + error.message);
    }
  };

  return {
    //state
    tasks,
    fields,
    taskAssignments,
    loading,
    error,
    dashboardStats,
    currentPage,
    filters,
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
    setSelectedTask,
  };
};
