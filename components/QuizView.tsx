import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, Home, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onHome: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete, onHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === currentQuestion.correctIndex ? 0 : 0));
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isHighClick = percentage >= 70;
    
    return (
      <div className="h-full flex flex-col items-center justify-center pb-32 animate-fade-in text-center px-6">
        <div className="relative mb-10 animate-pop">
           <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
           {/* Results Ring */}
           <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle 
                    cx="96" cy="96" r="88" 
                    stroke="currentColor" strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={560} 
                    strokeDashoffset={560 - (560 * percentage) / 100}
                    strokeLinecap="round"
                    className={`${isHighClick ? 'text-green-500' : 'text-orange-500'} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 {isHighClick && <Trophy size={32} className="text-yellow-400 mb-1 animate-bounce" fill="currentColor" />}
                 <span className="text-4xl font-black text-slate-800 dark:text-white">{percentage}%</span>
              </div>
           </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight">
            {isHighClick ? 'You Crushed It!' : 'Good Effort!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg max-w-xs mx-auto leading-relaxed">
            {isHighClick 
                ? "You've mastered this nano-topic. +50 XP added to your streak." 
                : "A little more practice and you'll be a pro. Don't give up!"}
        </p>

        <button onClick={onHome} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg flex justify-center items-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200 dark:shadow-indigo-900/30">
            <Home size={20} className="mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pb-32 animate-slide-up">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
            className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Question {currentIndex + 1} / {questions.length}</span>
        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">Quiz Mode</span>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-tight">
        {currentQuestion.question}
      </h2>

      <div className="space-y-3 flex-grow">
        {currentQuestion.options.map((option, idx) => {
            let stateStyles = "border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98]";
            let icon = null;

            if (isAnswered) {
                if (idx === currentQuestion.correctIndex) {
                    stateStyles = "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-sm scale-[1.02]";
                    icon = <div className="bg-green-100 dark:bg-green-800 p-1 rounded-full"><Check size={16} className="text-green-600 dark:text-green-200" strokeWidth={3} /></div>;
                } else if (idx === selectedOption) {
                    stateStyles = "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 opacity-80 shake";
                    icon = <div className="bg-red-100 dark:bg-red-800 p-1 rounded-full"><X size={16} className="text-red-600 dark:text-red-200" strokeWidth={3} /></div>;
                } else {
                    stateStyles = "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 opacity-50 grayscale";
                }
            }

            return (
                <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full p-5 rounded-2xl border-2 text-left font-semibold transition-all duration-200 flex items-center justify-between shadow-sm ${stateStyles}`}
                >
                    <span className="leading-snug">{option}</span>
                    {icon}
                </button>
            );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 animate-fade-in fixed bottom-24 left-6 right-6 z-20">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/50 p-5 rounded-2xl shadow-2xl mb-4">
                <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block mb-1">Explanation</span>
                <p className="text-sm text-slate-600 dark:text-slate-300">{currentQuestion.explanation}</p>
            </div>
            <button 
                onClick={handleNext}
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
      )}
    </div>
  );
};