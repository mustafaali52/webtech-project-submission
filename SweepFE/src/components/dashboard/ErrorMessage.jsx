import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
      <div className="flex items-start">
        <ExclamationCircleIcon className="h-6 w-6 text-red-400 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Something went wrong
          </h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={onRetry}
              className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={onDismiss}
              className="text-sm text-red-600 hover:text-red-800 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
