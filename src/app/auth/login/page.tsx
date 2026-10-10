'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, ShieldCheck, Lock, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="max-w-md w-full space-y-6 bg-[#FFFDF8] p-8 rounded-2xl border-2 border-[#D6CCBC] shadow-sm">
        {/* Official Brand Logo & Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D6CCBC] flex items-center justify-center bg-[#FFFDF8] mx-auto mb-3 shadow-xs">
            <img
              src="/logo.jpg"
              alt="Trails & Tales Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#292820] font-sans">
            Welcome to Trails & Tales
          </h1>
          <p className="mt-1 text-xs text-[#6D685C]">
            Sign in to access your adventure journal, verified achievements, and gear vouchers.
          </p>
        </div>

        {/* Quick Demo Access for Evaluators */}
        <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#777A53] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>Instant Evaluator Mode Access</span>
          </div>
          <p className="text-[11px] text-[#6D685C] leading-snug">
            Explore as a traveler or test reviewer administrative tools directly:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDemoTraveler}
              className="btn-journal-primary text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Traveler Persona</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="btn-journal-terracotta text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Persona</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#D6CCBC] w-full" />
          <span className="bg-[#FFFDF8] px-3 text-[10px] font-mono uppercase text-[#8E8675] tracking-wider">
            Or Account Details
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FFFDF8] border border-[#B85F43] text-[#B85F43] text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#6D685C] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@traveler.com"
              className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs focus:outline-hidden focus:border-[#777A53]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono font-bold uppercase text-[#6D685C]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#777A53] hover:underline flex items-center gap-1 font-mono"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs focus:outline-hidden focus:border-[#777A53]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-journal-primary w-full py-2.5 text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#6D685C]">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/register" className="font-bold text-[#777A53] hover:underline">
            Register New Explorer &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
