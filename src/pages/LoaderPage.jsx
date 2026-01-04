import React from 'react';
import { Loader2 } from 'lucide-react';

const LoaderPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#09090b] text-white font-sans">
      <div className="relative mb-8">
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150"></div>
        
        {/* Spinner */}
        <Loader2 className="w-16 h-16 animate-spin text-emerald-500 relative z-10" />
      </div>
      
      {/* Loading Text */}
      <h2 className="text-lg font-semibold text-white mb-2">Setting up your workspace</h2>
      <p className="text-slate-500 font-mono text-xs tracking-wide animate-pulse">
        INITIALIZING DEVELOPMENT ENVIRONMENT...
      </p>
    </div>
  );
};

export default LoaderPage;