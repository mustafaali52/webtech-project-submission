import { useState, useEffect, useCallback } from "react";
import AuthAPI from "../services/authAPI";

export const useBackendStatus = () => {
  const [isBackendAwake, setIsBackendAwake] = useState(null);
  const [showWakeUpModal, setShowWakeUpModal] = useState(false);
  const [hasCheckedInitially, setHasCheckedInitially] = useState(false);

  const checkBackendHealth = useCallback(async () => {
    try {
      return await AuthAPI.healthCheck();
    } catch (error) {
      console.log("Backend health check failed:", error.message);
      return false;
    }
  }, []);
  const performInitialCheck = useCallback(async () => {
    if (hasCheckedInitially) return;

    // Check if we're in development mode and using local API
    const isDevelopment = import.meta.env.DEV;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
    const isLocalApi =
      apiBaseUrl.startsWith("/") || apiBaseUrl.includes("localhost");

    // Skip wake-up check if we're in development with local API
    if (isDevelopment && isLocalApi) {
      console.log(
        "Development mode with local API detected, skipping wake-up check"
      );
      setIsBackendAwake(true);
      setHasCheckedInitially(true);
      return;
    }

    console.log("Performing initial backend health check...");
    setHasCheckedInitially(true);

    const isHealthy = await checkBackendHealth();

    if (isHealthy) {
      console.log("Backend is awake and ready");
      setIsBackendAwake(true);
    } else {
      console.log("Backend appears to be sleeping, showing wake-up modal");
      setIsBackendAwake(false);
      setShowWakeUpModal(true);
    }
  }, [checkBackendHealth, hasCheckedInitially]);

  const handleBackendReady = useCallback(() => {
    setIsBackendAwake(true);
    setShowWakeUpModal(false);
  }, []);

  const closeWakeUpModal = useCallback(() => {
    setShowWakeUpModal(false);
  }, []);

  const recheckBackendStatus = useCallback(async () => {
    const isHealthy = await checkBackendHealth();
    setIsBackendAwake(isHealthy);
    return isHealthy;
  }, [checkBackendHealth]);

  const skipInitialCheck = useCallback(() => {
    setIsBackendAwake(true);
    setShowWakeUpModal(false);
    setHasCheckedInitially(true);
  }, []);

  const resetBackendStatus = useCallback(() => {
    setIsBackendAwake(null);
    setHasCheckedInitially(false);
    setShowWakeUpModal(false);
  }, []);

  const forceShowWakeUpModal = useCallback(() => {
    setIsBackendAwake(false);
    setShowWakeUpModal(true);
    setHasCheckedInitially(true);
  }, []);

  useEffect(() => {
    if (!hasCheckedInitially) {
      const timer = setTimeout(() => {
        performInitialCheck();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [performInitialCheck, hasCheckedInitially]);
  return {
    isBackendAwake,
    showWakeUpModal,
    handleBackendReady,
    closeWakeUpModal,
    recheckBackendStatus,
    skipInitialCheck,
    resetBackendStatus,
    forceShowWakeUpModal,
    checkBackendHealth,
  };
};
