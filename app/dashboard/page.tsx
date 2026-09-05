'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar, DashboardView } from '@/components/Sidebar';
import { HabitCard } from '@/components/HabitCard';
import { ConsistencyHeatmap } from '@/components/ConsistencyHeatmap';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { AddHabitModal } from '@/components/AddHabitModal';
import { Habit, HabitStats } from '@/lib/supabase/types';
import { HabitStore } from '@/lib/habitStore';
import { supabase } from '@/lib/supabase/client';
import { 
  Plus, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  RefreshCw, 
  QrCode, 
  Bell, 
  Sliders, 
  Trash2, 
  Archive, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  Award,
  Zap,
  Check,
  Download,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { startOfWeek, addDays, format, subDays, isSameDay } from 'date-fns';

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats>({
    totalCompletions: 0,
    currentActiveHabits: 0,
    maxStreak: 0,
    completionRate7Days: 0,
    weeklyBreakdown: {},
    heatmapLogs: {},
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<DashboardView>('habits');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Suggested micro-habit templates for rapid creation
  const habitTemplates = [
    { name: 'Drink 3L Water', category: 'Health', icon: '💧' },
    { name: 'Read 10 Pages', category: 'Mindset', icon: '📖' },
    { name: '15-Min Stretch Routine', category: 'Fitness', icon: '🧘' },
    { name: '45-Min Deep Focus Block', category: 'Productivity', icon: '⚡' },
    { name: 'Evening Digital Sunset', category: 'Mindset', icon: '🌙' },
  ];

  // Load state on mount and sync
  useEffect(() => {
    refreshData();
    
    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        setUserName((session.user.user_metadata?.full_name as string) ?? null);
      }
    });

    HabitStore.syncFromSupabase().then(() => refreshData());
  }, []);

  const refreshData = () => {
    const list = HabitStore.getHabits().filter(h => !h.archived);
    const updatedStats = HabitStore.getStats();
    setHabits(list);
    setStats(updatedStats);
  };

  const handleToggleComplete = (id: string) => {
    const { habit } = HabitStore.toggleHabitComplete(id);
    refreshData();

    if (habit.is_completed_today) {
      showToast(`Logged "${habit.name}"! Streak: ${habit.streak_count} days 🔥`);
    } else {
      showToast(`Unchecked "${habit.name}"`);
    }
  };

  const handleAddHabit = (name: string, category: string) => {
    const res = HabitStore.createHabit(name, category);
    if (res.error) {
      showToast(res.error);
      return;
    }
    refreshData();
    showToast(`Added habit "${name}"!`);
  };

  const handleDeleteHabit = (id: string) => {
    HabitStore.archiveHabit(id);
    refreshData();
    showToast('Habit archived.');
  };

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    await HabitStore.syncFromSupabase();
    refreshData();
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Cloud & Android synchronized successfully! ☁️');
    }, 600);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local habit and streak data?')) {
      HabitStore.clearStore();
      refreshData();
      showToast('All habit and log data cleared.');
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const activeCount = habits.length;

  // Real Week-at-a-glance calculation (Monday through Sunday)
  const weekDays = useMemo(() => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const days: { label: string; dateStr: string; isToday: boolean; isDone: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, i);
      const dStr = format(d, 'yyyy-MM-dd');
      const isToday = isSameDay(d, today);
      const isDone = (stats.heatmapLogs[dStr] || 0) > 0;
      days.push({
        label: format(d, 'EEEEE'), // Single letter M, T, W, T, F, S, S
        dateStr: dStr,
        isToday,
        isDone,
      });
    }
    return days;
  }, [stats.heatmapLogs]);

  // Real Habit Insights calculation (Adherence % over past 30 days)
  const habitInsights = useMemo(() => {
    const logs = HabitStore.getLogs();
    const today = new Date();
    const thirtyDaysAgo = format(subDays(today, 30), 'yyyy-MM-dd');

    return habits.map(habit => {
      const habitCompletions = logs.filter(
        l => l.habit_id === habit.id && l.completed_date >= thirtyDaysAgo
      ).length;
      const rate = Math.min(100, Math.round((habitCompletions / 30) * 100));
      return {
        id: habit.id,
        name: habit.name,
        category: habit.category,
        adherenceRate: rate,
        completions: habitCompletions,
      };
    });
  }, [habits, stats.totalCompletions]);

  const getViewMeta = () => {
    switch (currentView) {
      case 'habits':
        return { title: "Today's Habits", subtitle: "Focus on your 3 high-impact micro-actions" };
      case 'analytics':
        return { title: 'Analytics & Heatmap', subtitle: 'Yearly consistency patterns and streak metrics' };
      case 'manage':
        return { title: 'Habit Manager', subtitle: 'Configure active routines & templates' };
      case 'sync':
        return { title: 'Android & Cloud Sync', subtitle: 'Real-time multi-device pairing & widget config' };
      case 'settings':
        return { title: 'Preferences & Settings', subtitle: 'Notification times, sound cues, and data control' };
      default:
        return { title: 'Zenith Dashboard', subtitle: 'Micro-habit tracker' };
    }
  };

  const { title, subtitle } = getViewMeta();

  return (
    <div className="min-h-screen flex bg-background text-on-background font-body-md antialiased">
      
      {/* Responsive Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeCount={activeCount}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userEmail={userEmail}
        userName={userName}
      />

      {/* Main Workspace Canvas (Offset on desktop for fixed sidebar) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all">
        
        {/* Top Header Navbar */}
        <Navbar
          activeCount={activeCount}
          streakCount={stats.maxStreak}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-bounce border border-slate-700">
            <Sparkles className="w-4 h-4 text-primary-container" />
            <span>{notification}</span>
          </div>
        )}

        {/* Main Content Area based on selected view */}
        <main className="flex-grow px-4 sm:px-8 pt-6 pb-16 max-w-7xl mx-auto w-full flex flex-col gap-8">
          
          {/* ================= VIEW 1: TODAY'S HABITS ================= */}
          {currentView === 'habits' && (
            <>
              {/* Current Streak Hero Card */}
              <section className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-slate-100">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
                
                <span className="font-label-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2 relative z-10 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Current Consistency Streak
                </span>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="font-display-lg text-primary text-glow font-bold text-5xl sm:text-7xl">
                    {stats.maxStreak}
                  </span>
                  <span className="font-body-lg text-lg sm:text-xl font-semibold text-on-surface-variant">days</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-2 max-w-md relative z-10">
                  {stats.maxStreak > 0
                    ? "You're building steady momentum! Compound small actions daily to achieve lasting transformation."
                    : 'Check off your daily micro-habits below to start your streak.'}
                </p>

                {/* Quick stats mini-row */}
                <div className="mt-5 pt-4 border-t border-slate-100 w-full max-w-lg flex items-center justify-around text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">7-Day Rate</span>
                    <strong className="font-outfit text-sm text-primary">{stats.completionRate7Days}%</strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Logged</span>
                    <strong className="font-outfit text-sm text-slate-800">{stats.totalCompletions}</strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Active Habits</span>
                    <strong className="font-outfit text-sm text-emerald-600">{activeCount}/3</strong>
                  </div>
                </div>
              </section>

              {/* 2-Column Split Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT PANEL: Active Habits List */}
                <section className="lg:col-span-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="font-headline-md text-xl font-bold text-on-surface">
                        Daily Micro-Habits
                      </h2>
                      <div className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {activeCount}/3 Active
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      disabled={activeCount >= 3}
                      className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint shadow-sm transition-all flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Habit</span>
                    </button>
                  </div>

                  {/* Habit Cards Container */}
                  <div className="space-y-3.5">
                    {habits.length === 0 ? (
                      <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-dashed border-outline-variant">
                        <CheckCircle2 className="w-10 h-10 text-outline mx-auto mb-3 text-slate-300" />
                        <h3 className="text-base font-bold font-outfit text-on-surface">
                          No active habits yet
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 mb-4">
                          Create your first micro-habit to kickstart your daily streak.
                        </p>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm"
                        >
                          + Create Habit
                        </button>
                      </div>
                    ) : (
                      habits.map((habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteHabit}
                        />
                      ))
                    )}

                    {/* Strict 3-Limit Educational Box */}
                    <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-container/20 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                          {activeCount}/3
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">
                            Strict 3-Habit Maximum
                          </h4>
                          <p className="text-[11px] text-on-surface-variant leading-tight">
                            Minimal cognitive load ensures highest long-term adherence.
                          </p>
                        </div>
                      </div>
                      <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${(activeCount / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* RIGHT PANEL: Week overview & Summary Chart */}
                <section className="lg:col-span-6 flex flex-col gap-6">
                  
                  {/* Weekly Completion Row */}
                  <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold font-outfit text-on-surface flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        This Week at a Glance
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {stats.completionRate7Days}% 7-Day Consistency
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                      {weekDays.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <span className={`text-[11px] font-bold ${day.isToday ? 'text-primary' : 'text-slate-400'}`}>
                            {day.label}
                          </span>
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              day.isDone
                                ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                                : day.isToday
                                ? 'border-2 border-primary bg-primary/10 text-primary'
                                : 'border-2 border-dashed border-slate-200 text-slate-300'
                            }`}
                          >
                            {day.isDone ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : day.isToday ? (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analytics Bar Breakdown */}
                  <AnalyticsChart stats={stats} />
                </section>
              </div>

              {/* Consistency Heatmap Full Row */}
              <section className="mt-2">
                <ConsistencyHeatmap heatmapLogs={stats.heatmapLogs} />
              </section>
            </>
          )}

          {/* ================= VIEW 2: ANALYTICS & HEATMAP ================= */}
          {currentView === 'analytics' && (
            <div className="space-y-8">
              {/* Metrics Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Longest Streak</span>
                    <strong className="text-2xl font-outfit text-on-surface">{stats.maxStreak} Days</strong>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Total Completions</span>
                    <strong className="text-2xl font-outfit text-on-surface">{stats.totalCompletions}</strong>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">7-Day Rate</span>
                    <strong className="text-2xl font-outfit text-on-surface">{stats.completionRate7Days}%</strong>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Active Slots</span>
                    <strong className="text-2xl font-outfit text-on-surface">{activeCount}/3 Filled</strong>
                  </div>
                </div>
              </div>

              {/* 365 Days Heatmap */}
              <ConsistencyHeatmap heatmapLogs={stats.heatmapLogs} />

              {/* Analytics Day of Week Breakdown & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <AnalyticsChart stats={stats} />
                </div>

                <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-outfit text-on-surface mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Consistency Insights
                    </h3>
                    
                    {habitInsights.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 leading-relaxed">
                        No habits active yet. Add micro-habits to start generating personalized consistency patterns.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                          30-day completion rate calculated from your recorded habit completions:
                        </p>

                        <div className="space-y-3">
                          {habitInsights.map(item => (
                            <div key={item.id} className="p-3 bg-surface-container-low rounded-xl">
                              <div className="flex justify-between text-xs font-bold text-on-surface mb-1">
                                <span className="truncate pr-2">{item.name}</span>
                                <span className="text-primary shrink-0">{item.adherenceRate}% Adherence</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary h-full transition-all duration-300"
                                  style={{ width: `${item.adherenceRate}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                    Calculated automatically from your live synchronized habit logs.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: MANAGE HABITS ================= */}
          {currentView === 'manage' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold font-outfit text-on-surface">
                    Active Habits ({activeCount}/3 Slots Used)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    To maintain maximum focus, Zenith limits you to 3 simultaneous habits.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={activeCount >= 3}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-surface-tint transition-all flex items-center space-x-2 disabled:opacity-50 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Habit</span>
                </button>
              </div>

              {/* Active Habits Management Cards */}
              {habits.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-dashed border-slate-200">
                  <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold font-outfit text-on-surface">No habits configured</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Choose a recommended template below or create your own custom habit.</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold"
                  >
                    + Create Habit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {habits.map((habit) => (
                    <div 
                      key={habit.id}
                      className="bg-surface-container-lowest rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                            {habit.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {habit.streak_count}d Streak
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-on-surface font-outfit mb-2">
                          {habit.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Created {new Date(habit.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleComplete(habit.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                            habit.is_completed_today
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {habit.is_completed_today ? '✓ Logged Today' : 'Mark Completed'}
                        </button>

                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          title="Archive Habit"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommended Micro-Habit Templates */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-base font-bold font-outfit text-on-surface mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Recommended High-Leverage Templates
                </h4>
                <p className="text-xs text-slate-500 mb-6">
                  Quickly add science-backed micro-habits designed for low friction and compounding returns:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habitTemplates.map((template, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{template.name}</div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{template.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddHabit(template.name, template.category)}
                        disabled={activeCount >= 3}
                        className="p-1.5 rounded-xl bg-white text-primary border border-slate-200 hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary"
                        title={activeCount >= 3 ? "Capacity reached" : "Add this habit"}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 4: ANDROID & CLOUD SYNC ================= */}
          {currentView === 'sync' && (
            <div className="space-y-8">
              
              {/* Sync Banner Status */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold font-outfit text-on-surface">
                        Android Companion &amp; Cloud Gateway
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {userEmail ? 'Cloud Synced' : 'Ready to Pair'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                      Your habits, completion timestamps, and streaks synchronize bi-directionally across the Zenith Web App and Android Native App in real-time.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSyncCloud}
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-surface-tint transition-all flex items-center space-x-2 shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
                </button>
              </div>

              {/* 2-Column Pairing & Widget Guide */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Pairing Code Card */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200 mb-4">
                    <QrCode className="w-36 h-36 text-slate-800" />
                  </div>
                  <h4 className="text-base font-bold font-outfit text-on-surface">
                    Scan with Zenith Android
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm">
                    Open Zenith on your mobile phone, navigate to Settings → Pair Device, and scan this QR code to authenticate instantly.
                  </p>

                  <div className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 flex justify-between items-center">
                    <span>TOKEN: {userEmail ? userEmail.slice(0, 8).toUpperCase() : 'ZENITH-GUEST'}</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
                  </div>
                </div>

                {/* Android Home Screen Widget Feature */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold font-outfit text-on-surface mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      1-Tap Android Home Widget
                    </h4>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      Check off your 3 daily habits straight from your phone home screen without opening the application. Reduces cognitive friction to absolute zero.
                    </p>

                    {/* Widget Preview */}
                    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-3">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Zap className="w-3 h-3 fill-emerald-400" /> Zenith Quick Widget
                        </span>
                        <span>🔥 {stats.maxStreak} Days</span>
                      </div>

                      <div className="space-y-2">
                        {habits.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No habits added yet. Create habits in the dashboard to view them here.
                          </div>
                        ) : (
                          habits.slice(0, 3).map((h) => (
                            <div key={h.id} className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-xl text-xs">
                              <span className="truncate pr-2">{h.name}</span>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                h.is_completed_today ? 'bg-emerald-500 text-slate-900' : 'border border-slate-500'
                              }`}>
                                {h.is_completed_today ? '✓' : ''}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Android Build: Kotlin Jetpack Compose</span>
                    <a
                      href="#download-apk"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast('Android App package download initialized!');
                      }}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download APK
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 5: SETTINGS ================= */}
          {currentView === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              
              {/* Notification & Reminders */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-base font-bold font-outfit text-on-surface flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Evening Reminder &amp; Push Triggers
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
                  <div>
                    <div className="text-sm font-bold text-on-surface">Daily Push Reminder</div>
                    <p className="text-xs text-slate-500">
                      Sends an alert if your 3 daily habits are not yet completed.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => {
                      setPushEnabled(e.target.checked);
                      showToast(`Push notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
                    }}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
                  <div>
                    <div className="text-sm font-bold text-on-surface">Reminder Schedule Time</div>
                    <p className="text-xs text-slate-500">Default is set to 8:00 PM for calm evening review.</p>
                  </div>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => {
                      setReminderTime(e.target.value);
                      showToast(`Reminder set to ${e.target.value}`);
                    }}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface outline-none"
                  />
                </div>
              </div>

              {/* Data & Storage Management */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-base font-bold font-outfit text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Local Cache &amp; Storage Controls
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
                  <div>
                    <div className="text-sm font-bold text-on-surface">Clear All Local Data</div>
                    <p className="text-xs text-slate-500">
                      Erases all saved habits and completion records from local storage.
                    </p>
                  </div>
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Habit Modal Dialog */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
        activeCount={activeCount}
      />
    </div>
  );
}
