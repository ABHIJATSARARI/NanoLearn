import React from 'react';
import { UserStats, ViewState, LessonHistoryItem } from '../types';
import { ProgressRing } from './ProgressRing';
import { Flame, Zap, BookOpen, Moon, Sun, ArrowRight, Sparkles, Clock } from 'lucide-react';

interface DashboardProps {
  userStats: UserStats;
  history: LessonHistoryItem[];
  setView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userStats, history, setView, isDarkMode, toggleTheme }) => {
  // Sort history by timestamp descending
  const recentLessons = [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);

  return (
    <div className="space-y-8 pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Hi, Student! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Let's learn something new.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="flex items-center bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 px-4 py-2 rounded-full border border-orange-100 dark:border-orange-800/30 shadow-sm">
            <Flame size={18} className="text-orange-500 mr-1.5 animate-pulse-slow" fill="currentColor" />
            <span className="text-orange-700 dark:text-orange-400 font-bold text-sm">{userStats.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Progress Rings Container */}
      <div className="glass-panel rounded-[2rem] p-8 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-white/50 dark:border-slate-700/30 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Zap size={20} className="text-indigo-500" fill="currentColor" />
                Daily Focus
            </h2>
            <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                Level {Math.floor(userStats.xp / 500) + 1}
            </span>
        </div>

        <div className="flex justify-around items-end gap-2">
          <div className="transform transition-transform hover:scale-105 duration-300">
            <ProgressRing 
                radius={38} 
                stroke={6} 
                progress={Math.min((userStats.sessionsCompleted / 5) * 100, 100)} 
                color="#8b5cf6" // Violet
                label="Sessions"
                subLabel={`${userStats.sessionsCompleted}/5`}
                icon={<Zap size={18} className="text-violet-500 dark:text-violet-400" fill="currentColor" />}
            />
          </div>
          <div className="transform -translate-y-4 transition-transform hover:scale-105 duration-300">
            <ProgressRing 
                radius={52} 
                stroke={8} 
                progress={Math.min(userStats.masteryScore, 100)} 
                color="#ec4899" // Pink
                label="Mastery"
                subLabel={`${userStats.xp} XP`}
                icon={<span className="text-xl font-black text-pink-500 dark:text-pink-400">XP</span>}
            />
          </div>
          <div className="transform transition-transform hover:scale-105 duration-300">
            <ProgressRing 
                radius={38} 
                stroke={6} 
                progress={userStats.masteryScore > 80 ? 95 : userStats.masteryScore} 
                color="#f97316" // Orange
                label="Recall"
                subLabel={userStats.masteryScore > 80 ? "High" : "Avg"}
                icon={<BookOpen size={18} className="text-orange-500 dark:text-orange-400" />}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => setView(ViewState.CREATE_LESSON)}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white p-6 rounded-3xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 group transition-all active:scale-[0.98] hover:shadow-indigo-300 dark:hover:shadow-indigo-900/50"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
          
          <div className="relative flex items-center justify-between z-10">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                 <Sparkles size={18} className="text-yellow-300" fill="currentColor" />
                 <span className="text-indigo-100 font-medium text-xs uppercase tracking-wider">AI Tutor</span>
              </div>
              <h3 className="font-bold text-xl">Start New Session</h3>
              <p className="text-indigo-100 text-sm opacity-90 mt-1">Turn any text into a micro-lesson</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10 group-hover:rotate-12 transition-transform duration-300">
              <ArrowRight size={28} className="text-white" />
            </div>
          </div>
        </button>
      </div>

      {/* Recent/Up Next */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
             <h3 className="text-slate-800 dark:text-white font-bold text-lg">Recent Activity</h3>
             <span className="text-xs text-slate-400 dark:text-slate-500 font-medium cursor-pointer hover:text-indigo-500 transition-colors">View All</span>
        </div>
        
        <div className="space-y-3">
          {recentLessons.length > 0 ? (
            recentLessons.map((item, idx) => {
                const percentage = Math.round((item.score / item.maxScore) * 100);
                const isPassed = percentage >= 60;
                const timeDiff = Math.floor((Date.now() - item.timestamp) / (1000 * 60));
                const timeString = timeDiff < 60 ? `${timeDiff}m ago` : `${Math.floor(timeDiff / 60)}h ago`;

                return (
                    <div 
                        key={idx} 
                        className="group bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-300 cursor-pointer"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                {item.emoji}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1 mb-1">{item.topic}</h4>
                                <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-12 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden`}>
                                        <div className={`h-full rounded-full ${isPassed ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className={`text-xs font-semibold ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                        {percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center text-xs text-slate-400 font-medium gap-1">
                            <Clock size={12} />
                            {timeString}
                        </div>
                    </div>
                )
            })
          ) : (
            <div className="text-center py-12 px-4 bg-white/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                    <BookOpen size={24} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No sessions yet.</p>
                <p className="text-indigo-500 dark:text-indigo-400 text-xs mt-1">Your learning journey starts today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};