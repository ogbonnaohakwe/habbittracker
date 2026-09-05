'use client';

import React from 'react';
import { Sparkles, Smartphone, Menu, Plus, Flame, User, Bell } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  activeCount: number;
  streakCount?: number;
  onOpenSidebar?: () => void;
  onOpenAddModal?: () => void;
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeCount, 
  streakCount = 0,
  onOpenSidebar,
  onOpenAddModal,
  title = "Today's Focus",
  subtitle = "Zenith Micro-Habit Hub"
}) => {
  return (
    <header className="w-full top-0 sticky bg-white/80 dark:bg-slate-900/80 z-30 transition-opacity duration-200 border-b border-slate-200/70 dark:border-slate-800 backdrop-blur-md">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3.5 w-full max-w-7xl mx-auto">
        
        {/* Left Section: Mobile Menu Trigger + Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface leading-tight">
              {title}
            </h1>
            <p className="font-body-sm text-[11px] sm:text-xs text-on-surface-variant font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Streak Badge + Capacity + Add Action + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Streak Counter Pill */}
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs px-3 py-1.5 rounded-full font-bold border border-amber-200/70">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streakCount} Days</span>
          </div>

          {/* Habit Capacity Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 bg-surface-container-low px-3.5 py-1.5 rounded-full border border-surface-container-high text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-on-surface font-medium">
              Capacity: <strong className="font-outfit text-primary">{activeCount}/3</strong>
            </span>
          </div>

          {/* Android Sync Status */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-200">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Android Synced</span>
          </div>

          {/* Quick Add Habit Button */}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              disabled={activeCount >= 3}
              className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint shadow-sm transition-all flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title={activeCount >= 3 ? "3-habit maximum reached" : "Add new micro-habit"}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">New Habit</span>
            </button>
          )}

          {/* User Auth Link */}
          <Link
            href="/auth"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-on-surface transition-colors"
            title="Account & Auth"
          >
            <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </Link>
        </div>
      </div>
    </header>
  );
};
