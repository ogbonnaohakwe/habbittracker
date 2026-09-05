export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  streak_count: number;
  last_completed_at: string | null;
  archived: boolean;
  created_at: string;
  is_completed_today?: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string; // YYYY-MM-DD
  created_at: string;
}

export interface HabitStats {
  totalCompletions: number;
  currentActiveHabits: number;
  maxStreak: number;
  completionRate7Days: number;
  weeklyBreakdown: { [day: string]: number };
  heatmapLogs: { [dateStr: string]: number }; // YYYY-MM-DD -> completion count
}
