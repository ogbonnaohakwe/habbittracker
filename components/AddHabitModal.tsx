'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (name: string, category: string) => void;
  activeCount: number;
}

const CATEGORIES = ['Health', 'Fitness', 'Mindset', 'Productivity', 'General'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
  activeCount,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isLimitReached = activeCount >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      setError('Active limit reached (3 max). Please archive a habit first.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a habit title.');
      return;
    }

    onAddHabit(name.trim(), category);
    setName('');
    setCategory('General');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-card max-w-md w-full p-6 shadow-zenith-card border border-brand-surface-container-high relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-bold font-outfit text-brand-slate">
              Create New Micro-Habit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Limit Warning if 3/3 */}
        {isLimitReached ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-6 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">3 Active Habit Cap Reached</span>
              The Micro-Habit philosophy limits active tracking to 3 habits simultaneously to prevent burnout and ensure 100% daily consistency.
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-6">
            Keep habit names action-oriented and small (e.g., &quot;Drink 3L Water&quot;, &quot;Read 10 Pages&quot;).
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Habit Name Input - Minimal bottom border matching design.md */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Read 10 pages before sleep"
              disabled={isLimitReached}
              className="w-full bg-transparent border-b-2 border-slate-200 focus:border-brand-primary px-1 py-2 text-base text-brand-slate outline-none transition-colors disabled:opacity-50"
              autoFocus
            />
          </div>

          {/* Category Chips Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  disabled={isLimitReached}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-pill transition-all ${
                    category === cat
                      ? 'bg-brand-primary text-white shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-pill text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLimitReached || !name.trim()}
              className="px-6 py-2.5 rounded-pill text-xs font-bold bg-brand-primary text-white hover:bg-brand-on-primary-container shadow-zenith-floating disabled:opacity-50 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Habit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
