export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MicroLesson {
  id: string; // Added ID for persistence
  topic: string;
  emoji: string;
  summary: string;
  explainer: string; // The 60-second read
  keyPoints: string[];
  quiz: QuizQuestion[];
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  timestamp: number; // When it was created
}

export interface LessonHistoryItem {
  lessonId: string;
  topic: string;
  emoji: string;
  score: number; // 0-100%
  maxScore: number;
  timestamp: number;
  attempts: number;
}

export interface UserStats {
  streak: number;
  lastLogin: number;
  xp: number;
  sessionsCompleted: number;
  masteryScore: number; // 0-100
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CREATE_LESSON = 'CREATE_LESSON',
  LEARNING = 'LEARNING',
  QUIZ = 'QUIZ',
  SUMMARY = 'SUMMARY',
  TEACHER = 'TEACHER',
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';