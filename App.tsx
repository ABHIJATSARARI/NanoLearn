import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { LessonGenerator } from './components/LessonGenerator';
import { MicroLessonView } from './components/MicroLessonView';
import { QuizView } from './components/QuizView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SplashScreen } from './components/SplashScreen';
import { UserStats, ViewState, MicroLesson, LessonHistoryItem } from './types';
import { getStats, getHistory, saveStats, saveHistoryItem, saveLesson } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    lastLogin: Date.now(),
    xp: 0,
    sessionsCompleted: 0,
    masteryScore: 0,
  });
  const [history, setHistory] = useState<LessonHistoryItem[]>([]);
  const [currentLesson, setCurrentLesson] = useState<MicroLesson | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Load real data from storage on mount
  useEffect(() => {
    const storedStats = getStats();
    const storedHistory = getHistory();
    setStats(storedStats);
    setHistory(storedHistory);

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    // Splash screen timer
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLessonGenerated = (lesson: MicroLesson) => {
    setCurrentLesson(lesson);
    saveLesson(lesson); // Save raw lesson
    setView(ViewState.LEARNING);
  };

  const handleQuizComplete = (score: number) => {
    if (!currentLesson) return;

    const maxScore = currentLesson.quiz.length;
    const percentage = (score / maxScore) * 100;

    // Update Stats
    const newStats = {
        ...stats,
        xp: stats.xp + (score * 10) + (percentage === 100 ? 50 : 0), // Bonus for perfect score
        sessionsCompleted: stats.sessionsCompleted + 1,
        masteryScore: Math.min(100, Math.max(0, Math.round((stats.masteryScore + percentage) / 2))) // Rolling average-ish
    };

    setStats(newStats);
    saveStats(newStats);

    // Save History
    const historyItem: LessonHistoryItem = {
        lessonId: currentLesson.id,
        topic: currentLesson.topic,
        emoji: currentLesson.emoji,
        score: score,
        maxScore: maxScore,
        timestamp: Date.now(),
        attempts: 1
    };

    saveHistoryItem(historyItem);
    setHistory(getHistory()); // Reload history to ensure sync
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <Dashboard userStats={stats} history={history} setView={setView} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case ViewState.CREATE_LESSON:
        return <LessonGenerator onLessonGenerated={handleLessonGenerated} onCancel={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.LEARNING:
        return currentLesson ? (
          <MicroLessonView 
            lesson={currentLesson} 
            onStartQuiz={() => setView(ViewState.QUIZ)} 
            onBack={() => setView(ViewState.DASHBOARD)} 
          />
        ) : <Dashboard userStats={stats} history={history} setView={setView} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case ViewState.QUIZ:
        return currentLesson ? (
          <QuizView 
            questions={currentLesson.quiz} 
            onComplete={handleQuizComplete}
            onHome={() => setView(ViewState.DASHBOARD)}
          />
        ) : <Dashboard userStats={stats} history={history} setView={setView} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case ViewState.TEACHER:
        return <TeacherDashboard history={history} />;
      default:
        return <Dashboard userStats={stats} history={history} setView={setView} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-950 min-h-screen shadow-2xl overflow-hidden relative flex flex-col transition-colors duration-300">
          {/* Main Content Area */}
          <main className="flex-grow p-6 overflow-y-auto no-scrollbar relative">
              {/* Decorative background blobs */}
              <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-200 dark:bg-indigo-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 pointer-events-none transition-colors duration-1000"></div>
              <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-pink-200 dark:bg-pink-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 pointer-events-none transition-colors duration-1000"></div>
              
              <div className="relative z-10 h-full">
                 {renderContent()}
              </div>
          </main>

          {/* Navigation - Only show if not in active learning/quiz mode to minimize distraction */}
          {view !== ViewState.QUIZ && view !== ViewState.LEARNING && (
            <Navigation currentView={view} setView={setView} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;