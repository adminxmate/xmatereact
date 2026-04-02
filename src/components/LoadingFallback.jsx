import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">Loading experience...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
