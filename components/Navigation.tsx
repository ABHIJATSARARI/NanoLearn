import React from 'react';
import { Home, PlusCircle, GraduationCap } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const getIconClass = (view: ViewState) => 
    `relative p-3 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center ${
      currentView === view 
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 scale-110 shadow-sm' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
    }`;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center animate-slide-up">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 px-2 py-2 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 flex justify-between items-center w-full max-w-[320px]">
        <button 
          onClick={() => setView(ViewState.DASHBOARD)} 
          className={getIconClass(ViewState.DASHBOARD)}
        >
          <Home size={24} strokeWidth={currentView === ViewState.DASHBOARD ? 2.5 : 2} />
        </button>

        <button 
          onClick={() => setView(ViewState.CREATE_LESSON)} 
          className="bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white p-4 rounded-full shadow-lg shadow-indigo-300 dark:shadow-indigo-900/50 hover:scale-110 transition-transform duration-300 active:scale-95 mx-4 group"
        >
          <PlusCircle size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <button 
          onClick={() => setView(ViewState.TEACHER)} 
          className={getIconClass(ViewState.TEACHER)}
        >
          <GraduationCap size={24} strokeWidth={currentView === ViewState.TEACHER ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};