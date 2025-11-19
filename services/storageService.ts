import { MicroLesson, UserStats, LessonHistoryItem } from "../types";

const KEYS = {
  STATS: 'nanolearn_stats',
  HISTORY: 'nanolearn_history',
  LESSONS: 'nanolearn_lessons'
};

const DEFAULT_STATS: UserStats = {
  streak: 1,
  lastLogin: Date.now(),
  xp: 0,
  sessionsCompleted: 0,
  masteryScore: 0,
};

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(KEYS.STATS);
  if (!stored) return DEFAULT_STATS;
  
  const stats = JSON.parse(stored);
  
  // Simple streak logic: if last login was > 48 hours ago, reset streak
  const hoursSinceLogin = (Date.now() - stats.lastLogin) / (1000 * 60 * 60);
  if (hoursSinceLogin > 48) {
    stats.streak = 0;
  }
  
  return stats;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(KEYS.STATS, JSON.stringify({
    ...stats,
    lastLogin: Date.now()
  }));
};

export const getHistory = (): LessonHistoryItem[] => {
  const stored = localStorage.getItem(KEYS.HISTORY);
  return stored ? JSON.parse(stored) : [];
};

export const saveHistoryItem = (item: LessonHistoryItem) => {
  const history = getHistory();
  // Check if we already have an entry for this lesson, if so update it
  const existingIndex = history.findIndex(h => h.lessonId === item.lessonId);
  
  if (existingIndex >= 0) {
    // Only update if score is better
    if (item.score > history[existingIndex].score) {
        history[existingIndex] = { ...item, attempts: history[existingIndex].attempts + 1 };
    } else {
        history[existingIndex].attempts += 1;
        history[existingIndex].timestamp = Date.now();
    }
  } else {
    history.unshift(item); // Add to front
  }
  
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
};

export const getSavedLessons = (): MicroLesson[] => {
  const stored = localStorage.getItem(KEYS.LESSONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveLesson = (lesson: MicroLesson) => {
  const lessons = getSavedLessons();
  lessons.unshift(lesson);
  localStorage.setItem(KEYS.LESSONS, JSON.stringify(lessons));
};

export const clearAllData = () => {
  localStorage.removeItem(KEYS.STATS);
  localStorage.removeItem(KEYS.HISTORY);
  localStorage.removeItem(KEYS.LESSONS);
};