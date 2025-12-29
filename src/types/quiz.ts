export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizOption {
  id: string;
  text: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  skill_id: string;
  title: string;
  description: string | null;
  difficulty: QuizDifficulty;
  duration_minutes: number;
  passing_score: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  skills?: Skill;
  questions?: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  options: QuizOption[];
  correct_option_id: string;
  explanation: string | null;
  points: number;
  order_index: number;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  started_at: string;
  ended_at: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_questions: number;
  score_percentage: number;
  time_taken_seconds: number | null;
  recommended_level: QuizDifficulty | null;
  created_at: string;
}

export interface QuizAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
  is_skipped: boolean;
  answered_at: string;
}

export interface QuizSummary {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: string;
  timeTaken: string;
  recommendedLevel: QuizDifficulty;
  passed: boolean;
}
