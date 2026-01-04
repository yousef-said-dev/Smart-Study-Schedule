import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-20 h-20 border-[6px]',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
      <div className={`${sizes[size]} border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-lg shadow-indigo-500/10`} />
      {message && (
        <p className="mt-6 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;