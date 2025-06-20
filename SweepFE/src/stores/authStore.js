import { create } from "zustand";
import { persist } from "zustand/middleware";
import AuthAPI from "../services/authAPI";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isRefreshing: false,

      isAuthenticated: () => !!get().user,

      token: () => get().user?.token || localStorage.getItem("authToken"),

      login: (userData) => {
        set({ user: userData });
        //store auth data in localStorage
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem(
          "hasCompletedProfile",
          userData.hasCompletedProfile
        );
      },

      logout: async () => {
        //clear auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("hasCompletedProfile");
        set({ user: null });
      },

      updateProfile: (profileData) => {
        set((state) => ({
          user: {
            ...state.user,
            hasCompletedProfile: true,
            ...profileData,
          },
        }));
        localStorage.setItem("hasCompletedProfile", "true");
      },

      clearAuthData: () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("hasCompletedProfile");
        set({ user: null });
      }, //init auth status on app start
      initializeAuth: async () => {
        try {
          // Prevent multiple simultaneous refresh attempts
          if (get().isRefreshing) {
            console.log("AuthStore - Refresh already in progress, skipping");
            return;
          }

          const token = localStorage.getItem("authToken");

          if (!token) {
            set({ loading: false });
            return;
          }

          //refresh flag
          set({ isRefreshing: true });

          //refresh token validity
          try {
            const data = await AuthAPI.refreshToken();

            if (data && data.token) {
              // Store updated data
              localStorage.setItem("authToken", data.token);
              localStorage.setItem("userRole", data.role);
              localStorage.setItem("userId", data.userId);
              localStorage.setItem(
                "hasCompletedProfile",
                data.hasCompletedProfile
              );

              set({
                user: {
                  userId: data.userId,
                  email: data.email,
                  role: data.role,
                  hasCompletedProfile: data.hasCompletedProfile,
                  token: data.token,
                },
              });
            } else {
              get().clearAuthData();
            }
          } catch (refreshError) {
            console.log("AuthStore - Token refresh failed:", refreshError);

            if (
              refreshError.message &&
              refreshError.message.includes("Server error (500)")
            ) {
              console.log(
                "AuthStore - Server error during refresh, keeping current session"
              );
            } else {
              console.log("AuthStore - Clearing auth data due to token error");
              get().clearAuthData();
            }
          }
        } catch (error) {
          console.error("AuthStore - Auth check failed:", error);
          get().clearAuthData();
        } finally {
          set({ loading: false, isRefreshing: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
