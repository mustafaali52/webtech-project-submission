const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class AuthAPI {
  //traditional register
  async register(email, password, role) {
    try {
      //str role to int conversion
      const roleValue = role === "Student" ? 0 : role === "Employer" ? 1 : 0;

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, role: roleValue }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  //regular email/password login
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  //clerk OAuth authentication
  async authenticateWithClerk(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/clerk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Clerk authentication failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Clerk authentication error:", error);
      throw error;
    }
  }
  //Clerk registration with role selection
  async completeClerkRegistration(email, clerkId, clerkToken, role) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/clerk/complete-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            clerkId,
            clerkToken,
            role,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to complete registration");
      }

      return await response.json();
    } catch (error) {
      console.error("Complete Clerk registration error:", error);
      throw error;
    }
  }
  //refresh token
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Token refresh failed";
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          const textResponse = await response.text();
          console.error("Non-JSON error response:", textResponse);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.warn(
          "Logout request failed, but proceeding with local cleanup"
        );
      }

      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  async createStudentProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create student profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Create student profile error:", error);
      throw error;
    }
  }

  async createEmployerProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/employer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create employer profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Create employer profile error:", error);
      throw error;
    }
  }
  async getFields() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/fields`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch fields");
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch fields error:", error);
      throw error;
    }
  }

  async getStudentProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/student`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch student profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Get student profile error:", error);
      throw error;
    }
  }

  async getEmployerProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/employer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch employer profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Get employer profile error:", error);
      throw error;
    }
  }
  async healthCheck() {
    try {
      // Use the anonymous task endpoint as health check
      const response = await fetch(`${API_BASE_URL}/task?pageSize=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return response.ok;
    } catch (error) {
      console.log("Health check failed:", error.message);
      return false;
    }
  }
}

export default new AuthAPI();
