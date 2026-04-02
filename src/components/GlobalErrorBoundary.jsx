import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-sm">
          We've encountered an unexpected error. Don't worry, your data is safe.
        </p>
        
        {import.meta.env.DEV && (
          <div className="mb-6 text-left bg-red-50 p-3 rounded-lg overflow-auto border border-red-200">
            <p className="font-mono text-xs text-red-800 break-all">{error.message}</p>
          </div>
        )}
        
        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Try Again
        </button>
      </div>
    </div>
  );
};

const GlobalErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/'; 
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
