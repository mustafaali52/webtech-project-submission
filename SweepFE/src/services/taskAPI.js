const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class TaskAPI {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Helper method to get auth headers for file uploads (without Content-Type)
  getAuthHeadersForUpload() {
    const token = localStorage.getItem("authToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Create a new task with optional file attachments
  async createTask(taskData, attachments = []) {
    try {
      // If there are attachments, use FormData for multipart/form-data
      if (attachments && attachments.length > 0) {
        const formData = new FormData();

        // Add all task data fields
        formData.append("title", taskData.title);
        formData.append("description", taskData.description);
        formData.append("deadline", taskData.deadline);
        formData.append("requiresExperience", taskData.requiresExperience);
        formData.append("complexity", taskData.complexity);
        formData.append("fieldId", taskData.fieldId);

        if (taskData.monetaryCompensation) {
          formData.append(
            "monetaryCompensation",
            taskData.monetaryCompensation
          );
        }

        // Add attachments
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        const response = await fetch(`${API_BASE_URL}/task`, {
          method: "POST",
          headers: this.getAuthHeadersForUpload(),
          credentials: "include",
          body: formData,
        });
        if (!response.ok) {
          let errorMessage = "Failed to create task";
          try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } catch {
            errorMessage = `Server error (${response.status}): ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        return await response.json();
      } else {
        const response = await fetch(`${API_BASE_URL}/task`, {
          method: "POST",
          headers: this.getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          let errorMessage = "Failed to create task";
          try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } catch {
            errorMessage = `Server error (${response.status}): ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        return await response.json();
      }
    } catch (error) {
      console.error("Create task error:", error);
      throw error;
    }
  }

  //task deets by id
  async getTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch task");
      }

      return await response.json();
    } catch (error) {
      console.error("Get task error:", error);
      throw error;
    }
  }

  //update task
  async updateTask(taskId, taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update task");
      }

      return await response.json();
    } catch (error) {
      console.error("Update task error:", error);
      throw error;
    }
  }

  //delete task
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete task");
      }

      return true;
    } catch (error) {
      console.error("Delete task error:", error);
      throw error;
    }
  }

  //get all tasks with filters
  async getTasks(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.fieldId) queryParams.append("fieldId", filters.fieldId);
      if (filters.complexity !== undefined)
        queryParams.append("complexity", filters.complexity);
      if (filters.requiresExperience !== undefined)
        queryParams.append("requiresExperience", filters.requiresExperience);
      if (filters.includeExpired !== undefined)
        queryParams.append("includeExpired", filters.includeExpired);
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.pageSize) queryParams.append("pageSize", filters.pageSize);

      const url = `${API_BASE_URL}/task${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch tasks");
      }

      return await response.json();
    } catch (error) {
      console.error("Get tasks error:", error);
      throw error;
    }
  }

  //get emp's tasks
  async getMyTasks(page = 1, pageSize = 10) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("pageSize", pageSize);

      const response = await fetch(
        `${API_BASE_URL}/task/employer?${queryParams.toString()}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch employer tasks");
      }

      return await response.json();
    } catch (error) {
      console.error("Get employer tasks error:", error);
      throw error;
    }
  }

  //get fields for task create
  async getFields() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/fields`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch fields");
      }

      return await response.json();
    } catch (error) {
      console.error("Get fields error:", error);
      throw error;
    }
  }

  //downlaod
  async downloadAttachment(attachmentId, fileName) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/task/download-attachment/${attachmentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to download attachment");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Download attachment error:", error);
      throw error;
    }
  }
}

export default new TaskAPI();
