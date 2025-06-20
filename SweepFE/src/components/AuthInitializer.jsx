import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBackendStatus } from '../hooks/useBackendStatus';
import BackendWakeUpModal from './BackendWakeUpModal';

function AuthInitializer({ children }) {
  const { initializeAuth } = useAuth();
  const {
    isBackendAwake,
    showWakeUpModal,
    handleBackendReady,
    closeWakeUpModal,
  } = useBackendStatus();

  useEffect(() => {
    if (isBackendAwake === true) {
      initializeAuth();
    }
  }, [initializeAuth, isBackendAwake]);

  return (
    <>
      {children}
      <BackendWakeUpModal
        isOpen={showWakeUpModal}
        onClose={closeWakeUpModal}
        onBackendReady={handleBackendReady}
      />
    </>
  );
}

export default AuthInitializer;
