import { useState, useEffect } from 'react';
import { Coffee, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import AuthAPI from '../services/authAPI';

const BackendWakeUpModal = ({ isOpen, onClose, onBackendReady }) => {
  const [isWaking, setIsWaking] = useState(false);
  const [wakeUpStatus, setWakeUpStatus] = useState('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);

  const MAX_RETRIES = 3;
  const WAKE_UP_TIMEOUT = 45000;
  const RETRY_DELAY = 5000;

  const checkBackendHealth = async () => {
    try {
      return await AuthAPI.healthCheck();
    } catch (error) {
      console.log('Backend health check failed:', error.message);
      return false;
    }
  };
  const wakeUpBackend = async () => {
    setIsWaking(true);
    setWakeUpStatus('waking');
    setProgress(0);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / WAKE_UP_TIMEOUT) * 100, 95);
      setProgress(newProgress);
    }, 500);

    try {
      // First, make a request to wake up the backend
      const wakeUpController = new AbortController();
      const wakeUpTimeoutId = setTimeout(() => wakeUpController.abort(), WAKE_UP_TIMEOUT);

      try {
        await checkBackendHealth();
      } catch {
        console.log('Initial wake-up request sent, backend may be starting...');
      }

      clearTimeout(wakeUpTimeoutId);

      let isReady = false;
      let attempts = 0;
      const maxAttempts = 15;

      while (!isReady && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        isReady = await checkBackendHealth();
        attempts++;

        const attemptProgress = 20 + (attempts / maxAttempts) * 75;
        setProgress(Math.min(attemptProgress, 95));
      }

      clearInterval(progressInterval);

      if (isReady) {
        setProgress(100);
        setWakeUpStatus('success');
        setTimeout(() => {
          onBackendReady();
          onClose();
        }, 1500);
      } else {
        throw new Error('Backend failed to respond after wake-up attempts');
      }
    } catch (wakeUpError) {
      clearInterval(progressInterval);
      console.error('Wake-up process failed:', wakeUpError);
      setWakeUpStatus('error');
      setProgress(0);
    } finally {
      setIsWaking(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        wakeUpBackend();
      }, RETRY_DELAY);
    }
  };

  const handleSkip = () => {
    onBackendReady();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setWakeUpStatus('idle');
      setProgress(0);
      setRetryCount(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            {wakeUpStatus === 'waking' && (
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            )}
            {wakeUpStatus === 'success' && (
              <CheckCircle className="w-8 h-8 text-green-600" />
            )}
            {wakeUpStatus === 'error' && (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
            {wakeUpStatus === 'idle' && (
              <Coffee className="w-8 h-8 text-orange-600" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {wakeUpStatus === 'idle' && 'Backend Service Sleeping'}
            {wakeUpStatus === 'waking' && 'Waking Up Backend...'}
            {wakeUpStatus === 'success' && 'Backend Ready!'}
            {wakeUpStatus === 'error' && 'Wake-up Failed'}
          </h3>

          <div className="text-sm text-gray-600 mb-6">
            {wakeUpStatus === 'idle' && (
              <p>
                Our backend service is currently sleeping to save resources. 
                This is normal for free hosting services. Click below to wake it up!
              </p>
            )}
            {wakeUpStatus === 'waking' && (
              <div>
                <p className="mb-3">
                  Please wait while we wake up the backend service. 
                  This usually takes 30-45 seconds.
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
              </div>
            )}
            {wakeUpStatus === 'success' && (
              <p>
                Great! The backend is now ready. You can now use all features of the application.
              </p>
            )}
            {wakeUpStatus === 'error' && (
              <p>
                We couldn't wake up the backend service. You can try again or skip this step, 
                though some features may not work properly.
                {retryCount < MAX_RETRIES && ` (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {wakeUpStatus === 'idle' && (
              <>
                <button
                  onClick={wakeUpBackend}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Wake Up Backend
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Skip
                </button>
              </>
            )}
            
            {wakeUpStatus === 'waking' && (
              <button
                onClick={handleSkip}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Continue Anyway
              </button>
            )}

            {wakeUpStatus === 'error' && (
              <>
                {retryCount < MAX_RETRIES && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Skip
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendWakeUpModal;
