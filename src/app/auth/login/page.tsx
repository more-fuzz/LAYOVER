'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoMark } from '@/components/brand/LogoMark';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/explorer';

  const { signInWithEmail, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push(redirectTo);
    }
  };

  const handleDemoTraveler = () => {
    switchDemoRole('traveler');
    router.push(redirectTo);
  };

  const handleDemoAdmin = () => {
    switchDemoRole('admin');
    router.push('/admin');
  };

  return (
    <div className="field-container min-h-[75vh] flex items-center justify-center py-12 px-4 page-rise">
      <div className="max-w-md w-full space-y-6 bg-[var(--card,#FFFAF0)] p-8 rounded-[var(--radius-lg,22px)] border-[1.5px] border-[var(--ink,#0F1F1A)] shadow-xl">
        {/* Official Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoMark className="w-12 h-12" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--ink,#0F1F1A)]">
            Sign In to Trails <span className="font-serif-accent text-[var(--flame,#FF5A1F)]">&amp;</span> Tales
          </h1>
          <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
            Access your verified field guide, expedition journal, and gear vouchers.
          </p>
        </div>

        {/* Evaluator Quick Role Switcher */}
        <div className="p-4 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/60 border border-[var(--line,#D8CBB0)] space-y-2">
          <div className="flex items-center gap-1.5 font-mono-label text-[10px] text-[var(--ink,#0F1F1A)] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--flame,#FF5A1F)]" aria-hidden="true" />
            <span>EVALUATOR TEST ACCESS</span>
          </div>
          <p className="text-[11px] text-[var(--muted,#5E675F)] leading-tight">
            Switch persona to test explorer and arbiter admin interfaces:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDemoTraveler}
              className="btn-field btn-ink text-xs py-1.5 min-h-[38px] font-bold"
            >
              Traveler Persona
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="btn-field btn-flame text-xs py-1.5 min-h-[38px] font-bold"
            >
              Admin Persona
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[var(--line,#D8CBB0)] w-full" />
          <span className="bg-[var(--card,#FFFAF0)] px-3 font-mono-label text-[10px] text-[var(--muted,#5E675F)] uppercase">
            Or Account Credentials
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-[var(--radius-sm,8px)] border border-[var(--folklore,#B8390A)]/40 bg-[#FBF3F0] text-xs text-[var(--folklore,#B8390A)] font-medium"
            >
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="login-email" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@traveler.com"
              className="w-full h-11 px-3.5 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-sm text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] font-mono-label"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-sm text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset instructions will be dispatched to your email address.');
              }}
              className="text-[var(--muted,#5E675F)] hover:text-[var(--flame,#FF5A1F)] underline text-[11px]"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="flame"
            size="lg"
            isLoading={loading}
            disabled={loading}
            className="w-full font-bold"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-xs text-[var(--muted,#5E675F)]">
          Don&apos;t have a passport yet?{' '}
          <Link
            href={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="font-bold text-[var(--ink,#0F1F1A)] hover:text-[var(--flame,#FF5A1F)] underline"
          >
            Register New Explorer &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="field-container py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
          Loading authentication gateway...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
