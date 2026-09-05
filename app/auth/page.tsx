'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  Flame, 
  Check, 
  ArrowLeft,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('Health');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Password reset instructions sent to your email!' });
        setLoading(false);
        return;
      }

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              primary_focus: selectedFocus,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          setMessage({ type: 'success', text: 'Account created! Redirecting to dashboard...' });
          setTimeout(() => {
            router.push('/dashboard');
          }, 600);
        } else {
          setMessage({ type: 'success', text: 'Account created! Please check your email to confirm your registration, or sign in.' });
          setAuthMode('login');
        }
        setLoading(false);
        return;
      }

      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;

        setMessage({ type: 'success', text: 'Welcome back! Loading your dashboard...' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed. Please check your credentials.',
      });
      setLoading(false);
    }
  };

  const habitGoals = [
    { label: 'Health', icon: '💧' },
    { label: 'Mindset', icon: '📖' },
    { label: 'Fitness', icon: '🏃' },
    { label: 'Focus', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] px-4 py-12 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform">
          <Zap className="w-6 h-6 text-primary-container fill-primary-container" />
        </div>
        <div>
          <span className="font-outfit font-bold text-2xl text-slate-900 tracking-tight leading-none block">
            Zenith
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            The Quiet Coach
          </span>
        </div>
      </Link>

      {/* Auth Card Container */}
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(13,28,45,0.06)] border border-slate-200/80 relative overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
          <button
            onClick={() => {
              setAuthMode('login');
              setMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Mode Titles */}
        <div className="mb-6">
          <h1 className="text-xl font-bold font-outfit text-slate-900">
            {authMode === 'login'
              ? 'Welcome back to Zenith'
              : authMode === 'signup'
              ? 'Create your Zenith account'
              : 'Reset your password'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'login'
              ? 'Access your daily micro-habits and consistency streak.'
              : authMode === 'signup'
              ? 'Join mindful achievers building 3 high-impact habits.'
              : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Status Message Notification */}
        {message && (
          <div className={`mb-5 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Sign Up only) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Password (Login & Sign Up) */}
          {authMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Habit Primary Focus Picker (Sign Up Only) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Primary Habit Focus
              </label>
              <div className="grid grid-cols-4 gap-2">
                {habitGoals.map((goal) => (
                  <button
                    key={goal.label}
                    type="button"
                    onClick={() => setSelectedFocus(goal.label)}
                    className={`py-2 px-1 rounded-xl text-center border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedFocus === goal.label
                        ? 'bg-emerald-50 border-primary text-primary shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">{goal.icon}</span>
                    <span className="text-[10px]">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary text-white font-bold text-xs sm:text-sm hover:bg-emerald-800 shadow-md shadow-emerald-900/15 transition-all flex items-center justify-center space-x-2 mt-2 group disabled:opacity-60"
          >
            <span>
              {loading
                ? 'Connecting...'
                : authMode === 'login'
                ? 'Log In to Zenith'
                : authMode === 'signup'
                ? 'Create Account & Start'
                : 'Send Reset Instructions'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Back Button for Forgot Password */}
        {authMode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              onClick={() => setAuthMode('login')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
            </button>
          </div>
        )}

        {/* Back Link to Landing */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
