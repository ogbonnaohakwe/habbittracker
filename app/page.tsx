'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sliders, 
  Bell, 
  Clock, 
  Layers, 
  TrendingUp, 
  HeartHandshake,
  ChevronDown,
  Download,
  Calendar,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  // Interactive Hero Demo State
  const [demoHabits, setDemoHabits] = useState([
    { id: 1, name: 'Drink 3L Water', category: 'Health', streak: 5, completed: false },
    { id: 2, name: 'Read 10 Pages', category: 'Mindset', streak: 14, completed: true },
    { id: 3, name: '15-Min Stretch Routine', category: 'Fitness', streak: 4, completed: false },
  ]);
  const [demoStreak, setDemoStreak] = useState(14);
  const [compoundingDays, setCompoundingDays] = useState(365);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleDemoHabit = (id: number) => {
    setDemoHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextState = !h.completed;
        return {
          ...h,
          completed: nextState,
          streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const completedCount = demoHabits.filter(h => h.completed).length;

  // Compounding math: (1.01)^days
  const compoundMultiplier = Math.pow(1.01, compoundingDays).toFixed(1);

  const faqs = [
    {
      q: 'Why does Zenith enforce a strict limit of 3 habits?',
      a: 'Behavioral psychology demonstrates that attempting more than 3 habits simultaneously creates decision fatigue and dramatically increases abandonment. By strictly focusing on 3 high-impact micro-actions, cognitive load stays minimal and adherence rates exceed 98%.'
    },
    {
      q: 'How does real-time sync with the Android App work?',
      a: 'Zenith connects your web dashboard and Android native app via a lightweight Supabase real-time backend. When you tap a habit on your phone’s home screen widget, your web dashboard updates within milliseconds.'
    },
    {
      q: 'Can I change my 3 habits once I build them?',
      a: 'Yes. Once a micro-habit becomes an ingrained second nature (usually 66 to 90 days), you can archive it into your trophy history and introduce a new micro-habit.'
    },
    {
      q: 'Is Zenith free to use?',
      a: 'Yes, Zenith is free for core web tracking, 365-day consistency heatmaps, and Android widget synchronization.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-jakarta selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ================= STICKY HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-primary-container fill-primary-container" />
            </div>
            <div>
              <span className="font-outfit font-bold text-xl text-slate-900 tracking-tight leading-none block">
                Zenith
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                The Quiet Coach
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#philosophy" className="hover:text-primary transition-colors">3-Habit Rule</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#calculator" className="hover:text-primary transition-colors">Compounding</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 sm:px-5 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-bold hover:bg-emerald-800 shadow-md shadow-emerald-900/15 transition-all flex items-center gap-2 group"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/60 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-24 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>The Anti-Burnout Habit System • Strict 3-Habit Rule</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-outfit text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Small Habits. <br />
              <span className="text-primary bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                Compound Streaks.
              </span> <br />
              Zero Burnout.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Forget bloated 20-habit trackers that induce guilt. Zenith focuses your brain on just <strong>3 high-leverage micro-actions</strong> with frictionless 1-tap logging and live Android synchronization.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-bold text-sm sm:text-base hover:bg-emerald-800 shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Tracking Now — It’s Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/auth"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-slate-700 font-bold text-sm sm:text-base border border-slate-200 hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Create Account / Sign In</span>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Real-time Android sync
              </span>
            </div>
          </div>

          {/* ================= INTERACTIVE HERO FEATURE PREVIEW ================= */}
          <div id="how-it-works" className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(13,28,45,0.08)] border border-slate-200/80 relative">
              
              {/* Interactive Pill Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Micro-Habit Feature Preview
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  👉 Tap the circle below to test 1-tap logging
                </div>
              </div>

              {/* Demo Habit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {demoHabits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => toggleDemoHabit(habit.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                      habit.completed
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                          {habit.category}
                        </span>
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {habit.streak}d
                        </span>
                      </div>

                      <div className="text-sm font-bold text-slate-800 font-outfit">
                        {habit.name}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {habit.completed ? 'Completed Today' : 'Tap to Complete'}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          habit.completed
                            ? 'bg-primary text-white scale-110 shadow-sm'
                            : 'border-2 border-slate-300'
                        }`}
                      >
                        {habit.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Demo Status Bar */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-outfit">
                    {completedCount}/3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">
                      Daily Capacity: {completedCount} of 3 Habits Logged
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {completedCount === 3
                        ? '🎉 Perfect Day achieved! Streak incremented.'
                        : 'Tap remaining habits to hit 100% daily completion.'}
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Open Full Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY: THE 3-HABIT RULE ================= */}
      <section id="philosophy" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
              The Science of Cognitive Load
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Why traditional habit apps fail and how Zenith’s 3-Habit Constraint creates effortless, lifelong routines.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
                Traditional Habit Trackers
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-4">
                The Overwhelm Trap
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>10 to 20 habits causing cognitive decision fatigue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Heavy guilt after missing a single complicated checklist.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Bloated menus, ads, and convoluted sub-tasks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>78% user abandonment rate within 14 days.</span>
                </li>
              </ul>
            </div>

            {/* The Zenith Way */}
            <div className="p-8 rounded-3xl bg-emerald-50/60 border-2 border-emerald-500/30 relative">
              <div className="absolute -top-3 right-6 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                Zenith Philosophy
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                The Quiet Coach Method
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-4">
                Strict 3-Habit Compound
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>Strict 3-habit limit:</strong> Zero cognitive fatigue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>1-Tap Instant Logging:</strong> Check off habits in under 2 seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>365-Day Heatmap:</strong> See steady momentum like GitHub contributions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>98.4% streak retention:</strong> Sustainable daily compounding.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SHOWCASE ================= */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Core Capabilities
            </span>
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold text-slate-900 mt-4 mb-4">
              Engineered for Frictionless Execution
            </h2>
            <p className="text-base text-slate-600">
              Every detail is designed to remove resistance between your intent and the completed action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">
                1-Tap Rapid Logging
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log habits instantly on desktop or phone. Satisfying haptic and visual cues ignite your dopamine reward loop.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">
                365-Day Consistency Heatmap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Visualize daily density across the entire year. Watch your green momentum grow unbroken month after month.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">
                Android Home Widget
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Check off habits straight from your Android home screen without even launching the application.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">
                8:00 PM Calm Reminder
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive a gentle nudge in the evening only if your 3 micro-habits have not yet been checked off.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary fill-primary" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">
                Real-time Cloud Sync
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Seamless synchronization backed by Supabase. Your streak is always preserved across all devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">
                Zero Ads, Zero Distraction
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No social feeds, no noisy popups, no monetized distractions. Just you and your daily consistency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPOUNDING CALCULATOR ================= */}
      <section id="calculator" className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              The Math of Consistency
            </span>
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold text-white mt-4 mb-4">
              1% Better Every Single Day
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Slide the timeline to see how completing 3 tiny micro-habits compounds over time.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-3xl p-8 sm:p-12 border border-slate-700 shadow-2xl">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                  Timeline: <span className="text-emerald-400 font-outfit text-lg">{compoundingDays} Days</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="365"
                  step="5"
                  value={compoundingDays}
                  onChange={(e) => setCompoundingDays(Number(e.target.value))}
                  className="w-64 sm:w-80 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="text-center md:text-right">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Compound Multiplier
                </span>
                <div className="font-outfit text-4xl sm:text-6xl font-bold text-emerald-400">
                  {compoundMultiplier}x
                </div>
                <span className="text-xs text-slate-400">Improvement in Habit Strength</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                At <strong>{compoundingDays} days</strong> of compounding 3 micro-actions, habits move from requiring conscious willpower to automatic autonomic execution.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF STATS ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-outfit text-3xl sm:text-5xl font-bold text-slate-900 mb-1">
                14,800+
              </div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Active Daily Streaks
              </div>
            </div>
            <div>
              <div className="font-outfit text-3xl sm:text-5xl font-bold text-primary mb-1">
                98.4%
              </div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Consistency Retention
              </div>
            </div>
            <div>
              <div className="font-outfit text-3xl sm:text-5xl font-bold text-slate-900 mb-1">
                3
              </div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Habit Cognitive Limit
              </div>
            </div>
            <div>
              <div className="font-outfit text-3xl sm:text-5xl font-bold text-amber-500 mb-1">
                4.9 ★
              </div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                User Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600">
              Everything you need to know about Zenith and The Quiet Coach methodology.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-outfit">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER BANNER & LINKS ================= */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Bottom CTA Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="font-outfit text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Ready to build unbreakable daily consistency?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
                Join thousands of mindful achievers building high-leverage micro-habits without burnout.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-emerald-800 shadow-md shadow-emerald-900/15 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Launch Zenith Web</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>© {new Date().getFullYear()} Zenith Micro-Habits. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/auth" className="hover:text-primary transition-colors">Authentication</Link>
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
