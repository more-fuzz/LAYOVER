'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, ShieldCheck, User, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  const handleDemoTraveler = () => {
    switchDemoRole('traveler');
    router.push('/dashboard');
  };

  const handleDemoAdmin = () => {
    switchDemoRole('admin');
    router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#101b15] p-8 rounded-3xl border border-[#1f3529] shadow-2xl">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 items-center justify-center shadow-lg shadow-emerald-950/50 mb-3">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome Back, Adventurer
          </h2>
          <p className="mt-2 text-xs text-zinc-400">
            Sign in to access your adventure memoir and verified points
          </p>
        </div>

        {/* Quick Demo One-Click Access for Judges & Evaluators */}
        <div className="p-4 rounded-2xl bg-[#14231b] border border-[#223d2e] space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Evaluation Access</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Click below to instantly explore as a Traveler or evaluate as an Administrator without waiting for email confirmations:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDemoTraveler}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Traveler Demo</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#1b2f24] w-full" />
          <span className="bg-[#101b15] px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Or Supabase Account
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@traveler.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In with Supabase'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/register" className="font-bold text-emerald-400 hover:text-emerald-300">
            Create an Account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
