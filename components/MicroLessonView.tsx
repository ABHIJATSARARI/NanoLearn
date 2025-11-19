import React, { useState } from 'react';
import { MicroLesson } from '../types';
import { ArrowRight, BookOpen, CheckCircle2, List, ChevronLeft } from 'lucide-react';

interface MicroLessonViewProps {
  lesson: MicroLesson;
  onStartQuiz: () => void;
  onBack: () => void;
}

export const MicroLessonView: React.FC<MicroLessonViewProps> = ({ lesson, onStartQuiz, onBack }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'explainer' | 'keypoints'>('explainer');

  return (
    <div className="h-full flex flex-col pb-32 animate-fade-in relative">
      {/* Fixed Back Button/Header */}
      <div className="flex items-center pt-2 pb-4 z-20">
        <button 
            onClick={onBack} 
            className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50"
        >
            <ChevronLeft size={24} />
        </button>
        <span className="ml-3 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Micro-Lesson</span>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-900 rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-8 -translate-y-8 rotate-12">
          <BookOpen size={180} />
        </div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md shadow-sm">
                    {lesson.difficultyLevel}
                </span>
                <div className="text-5xl filter drop-shadow-md animate-float">{lesson.emoji}</div>
            </div>
            
            <h1 className="text-3xl font-bold leading-tight mb-3 tracking-tight">{lesson.topic}</h1>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90 border-l-2 border-indigo-300 pl-3">
                {lesson.summary}
            </p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl mb-6 flex shrink-0">
        <button
            onClick={() => setActiveTab('explainer')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'explainer' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
            <BookOpen size={16} />
            Explain
        </button>
        <button
            onClick={() => setActiveTab('keypoints')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'keypoints' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
            <List size={16} />
            Key Points
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto px-1 no-scrollbar pb-4">
        {activeTab === 'explainer' && (
          <div className="prose prose-lg prose-indigo dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-300 animate-slide-up">
            <p>{lesson.explainer}</p>
          </div>
        )}

        {activeTab === 'keypoints' && (
          <div className="space-y-4 animate-slide-up">
            {lesson.keyPoints.map((point, idx) => (
              <div 
                key={idx} 
                className="flex items-start bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-full mr-4 mt-0.5 shrink-0">
                    <CheckCircle2 size={18} strokeWidth={3} />
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium leading-snug">{point}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating CTA */}
      <div className="pt-4 mt-auto">
        <button
            onClick={onStartQuiz}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center shadow-xl shadow-slate-200 dark:shadow-indigo-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
            Start Nano Quiz
            <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
};