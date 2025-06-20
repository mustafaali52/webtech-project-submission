import useAuthStore from "../stores/authStore";

export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    loading: store.loading,
    isAuthenticated: store.isAuthenticated(),
    token: store.token(),
    login: store.login,
    logout: store.logout,
    updateProfile: store.updateProfile,
    initializeAuth: store.initializeAuth,
  };
};
