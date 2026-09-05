'use client';

import React from 'react';
import { BarChart2, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { HabitStats } from '@/lib/supabase/types';

interface AnalyticsProps {
  stats: HabitStats;
}

export const AnalyticsChart: React.FC<AnalyticsProps> = ({ stats }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxDayCount = Math.max(...Object.values(stats.weeklyBreakdown), 3);

  return (
    <div className="bg-white rounded-card p-6 shadow-zenith-soft border border-brand-surface-container-high">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold font-outfit text-brand-slate">
            Weekly Analytics & Progress
          </h2>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-pill">
          {stats.completionRate7Days}% 7-Day Completion Rate
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-brand-surface-container-low p-4 rounded-2xl border border-brand-surface-container">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium">Total Logged</span>
          </div>
          <span className="font-outfit text-2xl font-bold text-brand-slate">
            {stats.totalCompletions}
          </span>
        </div>

        <div className="bg-brand-surface-container-low p-4 rounded-2xl border border-brand-surface-container">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium">Best Streak</span>
          </div>
          <span className="font-outfit text-2xl font-bold text-brand-slate">
            {stats.maxStreak} <span className="text-xs font-normal text-slate-400">days</span>
          </span>
        </div>

        <div className="bg-brand-surface-container-low p-4 rounded-2xl border border-brand-surface-container">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-medium">Active Cap</span>
          </div>
          <span className="font-outfit text-2xl font-bold text-brand-slate">
            {stats.currentActiveHabits}/3
          </span>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="mt-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Completions by Day of Week
        </span>

        <div className="flex items-end justify-between h-32 pt-6 px-2 border-b border-slate-100">
          {days.map(day => {
            const count = stats.weeklyBreakdown[day] || 0;
            const heightPercent = Math.round((count / maxDayCount) * 100);

            return (
              <div key={day} className="flex flex-col items-center flex-1 space-y-2 group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {count}
                </span>
                <div className="w-full max-w-[28px] bg-slate-100 h-24 rounded-t-full relative overflow-hidden flex items-end">
                  <div
                    className="w-full bg-brand-primary rounded-t-full transition-all duration-500 group-hover:bg-brand-primary-container"
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 font-outfit">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
