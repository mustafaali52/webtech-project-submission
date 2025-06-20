const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class TaskAssignmentAPI {
  getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  //assign task to student
  async assignTask(taskId, studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/taskassignment/assign`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          taskId,
          studentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to assign task");
      }

      return await response.json();
    } catch (error) {
      console.error("Assign task error:", error);
      throw error;
    }
  }

  //get available students for task assignment
  async getAvailableStudents(fieldId = 0, requiresExperience = false) {
    try {
      const queryParams = new URLSearchParams();
      if (fieldId) queryParams.append("fieldId", fieldId);
      if (requiresExperience)
        queryParams.append("requiresExperience", requiresExperience);

      const url = `${API_BASE_URL}/taskassignment/available-students${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch available students");
      }

      return await response.json();
    } catch (error) {
      console.error("Get available students error:", error);
      throw error;
    }
  }

  //get employer's task assignments
  async getEmployerAssignments(taskId = null) {
    try {
      const queryParams = new URLSearchParams();
      if (taskId) queryParams.append("taskId", taskId);

      const url = `${API_BASE_URL}/taskassignment/employer${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch assignments");
      }

      return await response.json();
    } catch (error) {
      console.error("Get employer assignments error:", error);
      throw error;
    }
  }

  //unassign a task
  async unassignTask(assignmentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/taskassignment/${assignmentId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unassign task");
      }

      return true;
    } catch (error) {
      console.error("Unassign task error:", error);
      throw error;
    }
  }

  //approve task completion and award tokens
  async approveCompletion(assignmentId, tokensAwarded) {
    try {
      const response = await fetch(`${API_BASE_URL}/taskassignment/approve`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          assignmentId,
          tokensAwarded,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve completion");
      }

      return await response.json();
    } catch (error) {
      console.error("Approve completion error:", error);
      throw error;
    }
  }

  //get student assignments
  async getStudentAssignments(completed = null) {
    try {
      const queryParams = new URLSearchParams();
      if (completed !== null) queryParams.append("completed", completed);

      const url = `${API_BASE_URL}/taskassignment/student${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      console.log("Fetching student assignments from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      console.log("Response:", response);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch student assignments");
      }

      return await response.json();
    } catch (error) {
      console.error("Get student assignments error:", error);
      throw error;
    }
  }
  //accept task assignments
  async acceptTask(assignmentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/taskassignment/accept`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          assignmentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to accept task assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Accept task error:", error);
      throw error;
    }
  }

  //reject, soft delete
  async rejectTask(assignmentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/taskassignment/${assignmentId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject task assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Reject task error:", error);
      throw error;
    }
  }

  //mark task complete
  async markTaskComplete(assignmentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/taskassignment/complete`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          assignmentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to mark task as complete");
      }

      return await response.json();
    } catch (error) {
      console.error("Mark task complete error:", error);
      throw error;
    }
  }
}

export default new TaskAssignmentAPI();
