import { useState, useEffect } from "react";
import taskAssignmentAPI from "../services/taskAssignmentAPI";
import AuthAPI from "../services/authAPI";

export const useStudentDashboard = () => {
  //state management
  const [assignments, setAssignments] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);

  //fetch student profile
  const fetchStudentProfile = async () => {
    try {
      setProfileLoading(true);
      const profileData = await AuthAPI.getStudentProfile();
      console.log("Student profile data:", profileData);
      setStudentProfile(profileData);
    } catch (err) {
      console.error("Failed to fetch student profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  //fetch assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskAssignmentAPI.getStudentAssignments();
      console.log("Fetched assignments:", data);
      setAssignments(data || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      setError("Failed to load your assignments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  //handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await Promise.all([fetchAssignments(), fetchStudentProfile()]);
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  //task actions
  const handleAcceptTask = async (assignmentId) => {
    try {
      console.log("Accepting task with assignmentId:", assignmentId);
      setActionLoading((prev) => ({ ...prev, [assignmentId]: "accepting" }));
      await taskAssignmentAPI.acceptTask(assignmentId);
      await fetchAssignments();
    } catch (err) {
      console.error("Failed to accept task:", err);
      setError("Failed to accept the task. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [assignmentId]: null }));
    }
  };

  const handleRejectTask = async (assignmentId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [assignmentId]: "rejecting" }));
      await taskAssignmentAPI.rejectTask(assignmentId);
      await fetchAssignments();
    } catch (err) {
      console.error("Failed to reject task:", err);
      setError("Failed to reject the task. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [assignmentId]: null }));
    }
  };

  const handleCompleteTask = async (assignmentId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [assignmentId]: "completing" }));
      await taskAssignmentAPI.markTaskComplete(assignmentId);
      await fetchAssignments();
    } catch (err) {
      console.error("Failed to complete task:", err);
      setError("Failed to mark the task as complete. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [assignmentId]: null }));
    }
  };

  //filter assignments by status
  const pendingAssignments = assignments.filter((a) => !a.acceptedAt);
  const acceptedAssignments = assignments.filter(
    (a) => a.acceptedAt && !a.completedAt
  );
  const completedAssignments = assignments.filter((a) => a.completedAt);

  //get current assignments based on active tab
  const getCurrentAssignments = () => {
    switch (activeTab) {
      case "pending":
        return pendingAssignments;
      case "accepted":
        return acceptedAssignments;
      case "completed":
        return completedAssignments;
      default:
        return [];
    }
  };

  //initialize data on mount
  useEffect(() => {
    fetchAssignments();
    fetchStudentProfile();
  }, []);

  return {
    //state
    assignments,
    studentProfile,
    loading,
    profileLoading,
    error,
    actionLoading,
    activeTab,
    refreshing,

    //computed values
    pendingAssignments,
    acceptedAssignments,
    completedAssignments,

    //actions
    setActiveTab,
    setError,
    fetchAssignments,
    fetchStudentProfile,
    handleRefresh,
    handleAcceptTask,
    handleRejectTask,
    handleCompleteTask,
    getCurrentAssignments,
  };
};
