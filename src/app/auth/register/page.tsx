'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoMark } from '@/components/brand/LogoMark';
import { Button } from '@/components/ui/Button';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/explorer';

  const { signUpWithEmail } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Leave-No-Trace and adventure safety terms.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signUpWithEmail(email, password, displayName);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(res.message || 'Registration complete! Check your email or sign in below.');
    }
  };

  return (
    <div className="field-container min-h-[75vh] flex items-center justify-center py-12 px-4 page-rise">
      <div className="max-w-md w-full space-y-6 bg-[var(--card,#FFFAF0)] p-8 rounded-[var(--radius-lg,22px)] border-[1.5px] border-[var(--ink,#0F1F1A)] shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoMark className="w-12 h-12" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--ink,#0F1F1A)]">
            Create Explorer Passport
          </h1>
          <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
            Create your traveler identity to log routes, verify feats, and claim outdoor rewards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-[var(--radius-sm,8px)] border border-[var(--folklore,#B8390A)]/40 bg-[#FBF3F0] text-xs text-[var(--folklore,#B8390A)] font-medium"
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="p-3.5 rounded-[var(--radius-sm,8px)] border border-[var(--jade-deep,#0B7A50)] bg-[#E2F7EE] text-[var(--jade-deep,#0B7A50)] text-xs font-semibold"
            >
              {successMsg}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="reg-name" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              Explorer Display Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full h-11 px-3.5 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-sm text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-email" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              Email Address
            </label>
            <input
              id="reg-email"
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
              <label htmlFor="reg-pass" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
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
              id="reg-pass"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-sm text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-confirm" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-sm text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            />
          </div>

          {/* Leave-No-Trace Safety Commitment */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              id="terms-check"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[var(--line,#D8CBB0)] text-[var(--flame,#FF5A1F)] focus:ring-[var(--flame,#FF5A1F)] cursor-pointer"
            />
            <label htmlFor="terms-check" className="text-xs text-[var(--muted,#5E675F)] leading-relaxed cursor-pointer">
              I agree to adhere to Leave-No-Trace outdoor principles, respect regional boundaries, and explore public trails responsibly.
            </label>
          </div>

          <Button
            type="submit"
            variant="flame"
            size="lg"
            isLoading={loading}
            disabled={loading}
            className="w-full font-bold"
          >
            {loading ? 'Creating Passport...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center text-xs text-[var(--muted,#5E675F)]">
          Already registered?{' '}
          <Link
            href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="font-bold text-[var(--ink,#0F1F1A)] hover:text-[var(--flame,#FF5A1F)] underline"
          >
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="field-container py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
          Loading registration gateway...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
