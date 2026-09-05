'use client';

import React from 'react';
import { subDays, format, startOfWeek, addDays, getMonth } from 'date-fns';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

interface HeatmapProps {
  heatmapLogs: { [dateStr: string]: number };
}

export const ConsistencyHeatmap: React.FC<HeatmapProps> = ({ heatmapLogs }) => {
  const today = new Date();
  // Generate 52 weeks (364 days) leading up to today
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 }); // Sunday

  const weeks: Date[][] = [];
  let currentDay = startDate;

  for (let w = 0; w < 52; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
  }

  // Month header markers
  const monthLabels: { index: number; name: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = getMonth(week[0]);
    if (month !== lastMonth && i % 4 === 0) {
      monthLabels.push({ index: i, name: format(week[0], 'MMM') });
      lastMonth = month;
    }
  });

  const getIntensityColor = (count: number) => {
    if (!count || count === 0) return 'bg-brand-surface-container-low border-slate-100';
    if (count === 1) return 'bg-emerald-200 border-emerald-300';
    if (count === 2) return 'bg-emerald-400 border-emerald-500';
    return 'bg-brand-primary border-emerald-800 text-white';
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-zenith-soft border border-brand-surface-container-high">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold font-outfit text-brand-slate">
            Consistency Heatmap
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">Past 365 Days</span>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          
          {/* Months Row */}
          <div className="flex text-[10px] text-slate-400 font-semibold mb-2 pl-7">
            {monthLabels.map((m, idx) => (
              <span key={idx} className="w-[12px] mr-[34px] text-left">
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Rows (Days Sun-Sat) */}
          <div className="flex">
            
            {/* Day of Week Column */}
            <div className="flex flex-col justify-between text-[9px] text-slate-400 font-medium pr-2 h-[88px] py-[1px]">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex space-x-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col space-y-[3px]">
                  {week.map((day, dIdx) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const count = heatmapLogs[dateStr] || 0;
                    return (
                      <div
                        key={dIdx}
                        className={`heatmap-cell w-[11px] h-[11px] rounded-[2px] border ${getIntensityColor(
                          count
                        )}`}
                        title={`${format(day, 'MMM d, yyyy')}: ${count} micro-habits completed`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <div className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Visualizing daily completion density</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span>Less</span>
          <span className="w-3 h-3 rounded-[2px] bg-brand-surface-container-low border border-slate-100" />
          <span className="w-3 h-3 rounded-[2px] bg-emerald-200" />
          <span className="w-3 h-3 rounded-[2px] bg-emerald-400" />
          <span className="w-3 h-3 rounded-[2px] bg-brand-primary" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
