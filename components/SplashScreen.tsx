import React from 'react';
import { Atom } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-violet-900/30 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <div className="relative w-40 h-40 mb-10">
          {/* Orbital Rings */}
          <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="url(#grad1)" strokeWidth="1" fill="none" strokeDasharray="20 10" />
             <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-60" style={{ animationDirection: 'reverse', animationDuration: '15s' }} viewBox="0 0 100 100">
             <ellipse cx="50" cy="50" rx="18" ry="46" stroke="#a855f7" strokeWidth="0.5" fill="none" transform="rotate(45 50 50)" />
             <ellipse cx="50" cy="50" rx="18" ry="46" stroke="#6366f1" strokeWidth="0.5" fill="none" transform="rotate(-45 50 50)" />
          </svg>
          
          {/* Central Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.6)] animate-pop">
               <Atom size={48} className="text-white animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="text-center space-y-3 z-10">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400 animate-fade-in" style={{ animationDuration: '1.5s' }}>
                NanoLearn
            </h1>
            <p className="text-indigo-300/80 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase animate-slide-up" style={{ animationDelay: '0.5s' }}>
                Big Learning. Tiny Moments.
            </p>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-16 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
         <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-full origin-left animate-fill-bar"></div>
      </div>
    </div>
  );
};