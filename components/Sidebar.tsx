'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  BarChart3, 
  Sliders, 
  Smartphone, 
  Settings, 
  Zap, 
  X, 
  LogOut, 
  Sparkles, 
  Flame,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export type DashboardView = 'habits' | 'analytics' | 'manage' | 'sync' | 'settings';

interface SidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  activeCount: number;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  userName?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeCount,
  isOpen,
  onClose,
  userEmail,
  userName,
}) => {
  const navItems: {
    id: DashboardView;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'habits',
      label: "Today's Habits",
      description: 'Daily check-off & streak',
      icon: CheckCircle2,
      badge: `${activeCount}/3`,
    },
    {
      id: 'analytics',
      label: 'Analytics & Heatmap',
      description: '365-day consistency graph',
      icon: BarChart3,
    },
    {
      id: 'manage',
      label: 'Manage Habits',
      description: 'Add, edit & archive',
      icon: Sliders,
    },
    {
      id: 'sync',
      label: 'Android & Cloud Sync',
      description: 'Mobile widget & pairing',
      icon: Smartphone,
      badge: 'Live',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Reminders & preferences',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-primary-container fill-primary-container" />
              </div>
              <div>
                <span className="font-headline-md font-bold text-lg text-on-surface tracking-tight leading-none block">
                  Zenith
                </span>
                <span className="text-[11px] font-medium text-on-surface-variant">
                  The Quiet Coach
                </span>
              </div>
            </Link>

            {/* Close Button for Mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Capacity Meter Indicator */}
          <div className="mx-4 my-4 p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Habit Capacity</span>
              </div>
              <span className="font-outfit font-bold text-primary">
                {activeCount} / 3 Max
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${(activeCount / 3) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 leading-tight">
              Strict 3-habit rule ensures peak daily consistency.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all group ${
                    isActive
                      ? 'bg-primary text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`text-[11px] leading-tight ${
                          isActive ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-primary'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile & App Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-surface/50">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs uppercase">
                {userName ? userName.slice(0, 2) : userEmail ? userEmail.slice(0, 2) : 'ZH'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-on-surface truncate">
                  {userName || (userEmail ? userEmail.split('@')[0] : 'My Account')}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{userEmail ? 'Cloud Synced' : 'Local Storage'}</span>
                </div>
              </div>
            </div>

            <Link
              href="/auth"
              className="p-1.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={userEmail ? "Account / Switch User" : "Sign In / Register"}
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>Zenith Web</span>
            <Link href="/" className="hover:text-primary transition-colors">
              Landing Page →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
