import { Habit, HabitLog, HabitStats } from './supabase/types';
import { format, subDays, startOfWeek, isSameDay } from 'date-fns';
import { supabase } from './supabase/client';

const STORAGE_KEY_HABITS = 'zenith_habits_v1';
const STORAGE_KEY_LOGS = 'zenith_logs_v1';

export class HabitStore {
  static getHabits(): Habit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY_HABITS);
    if (!data) {
      return [];
    }
    try {
      const habits: Habit[] = JSON.parse(data);
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      return habits.map(h => ({
        ...h,
        is_completed_today: h.last_completed_at === todayStr,
      }));
    } catch {
      return [];
    }
  }

  static getLogs(): HabitLog[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveHabits(habits: Habit[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    }
  }

  static saveLogs(logs: HabitLog[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    }
  }

  static async syncFromSupabase(): Promise<{ habits: Habit[]; logs: HabitLog[] }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: dbHabits } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('archived', false);

        const { data: dbLogs } = await supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', session.user.id);

        if (dbHabits) {
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const enrichedHabits: Habit[] = dbHabits.map(h => ({
            ...h,
            is_completed_today: h.last_completed_at === todayStr,
          }));
          this.saveHabits(enrichedHabits);
        }

        if (dbLogs) {
          this.saveLogs(dbLogs);
        }
      }
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }
    return { habits: this.getHabits(), logs: this.getLogs() };
  }

  static createHabit(name: string, category: string = 'General'): { habit?: Habit; error?: string } {
    const habits = this.getHabits();
    const activeHabits = habits.filter(h => !h.archived);

    if (activeHabits.length >= 3) {
      return { error: 'Maximum limit of 3 active habits reached. Archive an existing habit to create a new one.' };
    }

    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      user_id: 'user_default',
      name: name.trim(),
      category: category.trim() || 'General',
      streak_count: 0,
      last_completed_at: null,
      archived: false,
      created_at: new Date().toISOString(),
      is_completed_today: false,
    };

    const updated = [newHabit, ...habits];
    this.saveHabits(updated);

    // Sync to Supabase if authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('habits').insert({
          user_id: session.user.id,
          name: name.trim(),
          category: category.trim() || 'General',
          streak_count: 0,
          archived: false,
        }).then();
      }
    });

    return { habit: newHabit };
  }

  static toggleHabitComplete(habitId: string): { habit: Habit; habits: Habit[] } {
    const habits = this.getHabits();
    const logs = this.getLogs();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

    const index = habits.findIndex(h => h.id === habitId);
    if (index === -1) throw new Error('Habit not found');

    const target = habits[index];
    const isCompletedToday = target.last_completed_at === todayStr;

    let updatedHabit: Habit;
    let updatedLogs: HabitLog[];

    if (isCompletedToday) {
      const newStreak = Math.max(0, target.streak_count - 1);
      updatedHabit = {
        ...target,
        streak_count: newStreak,
        last_completed_at: null,
        is_completed_today: false,
      };

      updatedLogs = logs.filter(l => !(l.habit_id === habitId && l.completed_date === todayStr));
    } else {
      let newStreak = target.streak_count;
      if (target.last_completed_at === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      updatedHabit = {
        ...target,
        streak_count: newStreak,
        last_completed_at: todayStr,
        is_completed_today: true,
      };

      updatedLogs = [
        ...logs,
        {
          id: `log_${Date.now()}`,
          habit_id: habitId,
          user_id: 'user_default',
          completed_date: todayStr,
          created_at: today.toISOString(),
        },
      ];
    }

    habits[index] = updatedHabit;
    this.saveHabits(habits);
    this.saveLogs(updatedLogs);

    // Sync to Supabase if authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('habits').update({
          streak_count: updatedHabit.streak_count,
          last_completed_at: updatedHabit.last_completed_at,
        }).eq('id', habitId).then();

        if (updatedHabit.is_completed_today) {
          supabase.from('habit_logs').upsert({
            habit_id: habitId,
            user_id: session.user.id,
            completed_date: todayStr,
          }).then();
        } else {
          supabase.from('habit_logs').delete()
            .eq('habit_id', habitId)
            .eq('completed_date', todayStr)
            .then();
        }
      }
    });

    return { habit: updatedHabit, habits };
  }

  static archiveHabit(habitId: string): Habit[] {
    const habits = this.getHabits();
    const updated = habits.map(h => (h.id === habitId ? { ...h, archived: true } : h));
    this.saveHabits(updated);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('habits').update({ archived: true }).eq('id', habitId).then();
      }
    });

    return updated;
  }

  static getStats(): HabitStats {
    const habits = this.getHabits().filter(h => !h.archived);
    const logs = this.getLogs();
    const today = new Date();

    const maxStreak = habits.length > 0 
      ? habits.reduce((max, h) => Math.max(max, h.streak_count), 0)
      : 0;

    const heatmapLogs: { [dateStr: string]: number } = {};
    logs.forEach(log => {
      heatmapLogs[log.completed_date] = (heatmapLogs[log.completed_date] || 0) + 1;
    });

    const weeklyBreakdown: { [day: string]: number } = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    let past7DaysCompletions = 0;
    for (let i = 0; i < 7; i++) {
      const d = subDays(today, i);
      const dStr = format(d, 'yyyy-MM-dd');
      const count = heatmapLogs[dStr] || 0;
      past7DaysCompletions += count;

      const dayName = format(d, 'EEE');
      if (weeklyBreakdown[dayName] !== undefined) {
        weeklyBreakdown[dayName] += count;
      }
    }

    const potential7Days = habits.length * 7;
    const completionRate7Days = potential7Days > 0 
      ? Math.round((past7DaysCompletions / potential7Days) * 100)
      : 0;

    return {
      totalCompletions: logs.length,
      currentActiveHabits: habits.length,
      maxStreak,
      completionRate7Days,
      weeklyBreakdown,
      heatmapLogs,
    };
  }

  static clearStore() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_HABITS);
      localStorage.removeItem(STORAGE_KEY_LOGS);
    }
  }

  // Alias for backward compatibility
  static resetStore() {
    this.clearStore();
  }
}

export const HabitLocalStore = HabitStore;
