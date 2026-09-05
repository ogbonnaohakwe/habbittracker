'use client';

import React from 'react';
import { Habit } from '@/lib/supabase/types';
import { Check, Flame, Trash2, Droplets, BookOpen, Dumbbell, Sparkles } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggleComplete, onDelete }) => {
  const isCompleted = habit.is_completed_today;

  // Icon chooser based on category/name to mirror Stitch design
  const renderCategoryIcon = () => {
    const nameLower = habit.name.toLowerCase();
    if (nameLower.includes('water') || nameLower.includes('drink')) {
      return <Droplets className="w-6 h-6 text-primary" />;
    }
    if (nameLower.includes('read') || nameLower.includes('book')) {
      return <BookOpen className="w-6 h-6 text-primary" />;
    }
    if (nameLower.includes('workout') || nameLower.includes('exercise')) {
      return <Dumbbell className="w-6 h-6 text-primary" />;
    }
    return <Sparkles className="w-6 h-6 text-primary" />;
  };

  return (
    <div
      className={`rounded-xl p-md flex items-center justify-between group cursor-pointer transition-all duration-300 ${
        isCompleted
          ? 'habit-card-completed'
          : 'habit-card-incomplete bg-surface-container-lowest hover:shadow-lg'
      }`}
    >
      {/* Left Icon & Information */}
      <div className={`flex items-center gap-md ${isCompleted ? 'opacity-80' : ''}`}>
        <div
          className={`p-2.5 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-primary-container/20' : 'bg-secondary-container/30'
          }`}
        >
          {renderCategoryIcon()}
        </div>

        <div>
          <h3
            className={`font-body-lg text-body-lg mb-xs ${
              isCompleted
                ? 'line-through text-on-surface-variant font-medium'
                : 'text-on-surface font-semibold group-hover:text-primary transition-colors'
            }`}
          >
            {habit.name}
          </h3>

          <p
            className={`font-label-md text-label-md flex items-center gap-1.5 ${
              isCompleted ? 'text-primary font-semibold' : 'text-on-surface-variant'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{habit.streak_count} Day Streak{isCompleted ? '!' : ''}</span>
          </p>
        </div>
      </div>

      {/* Right Actions & 1-Tap Log Button */}
      <div className="flex items-center gap-sm">
        {/* Archive Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit.id);
          }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          title="Archive Habit"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* 1-Tap Log Button (Stitch Spec) */}
        <button
          aria-label={isCompleted ? `Unlog ${habit.name}` : `Log ${habit.name}`}
          onClick={() => onToggleComplete(habit.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center focus:outline-none transition-all duration-200 ${
            isCompleted
              ? 'btn-log-completed shadow-md'
              : 'btn-log-incomplete hover:bg-slate-50 hover:border-primary'
          }`}
        >
          <Check
            className={`w-6 h-6 stroke-[3] ${
              isCompleted ? 'text-on-primary scale-100' : 'text-transparent scale-75'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

