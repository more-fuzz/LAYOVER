'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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
      setSuccessMsg(res.message || 'Registration complete! Check your email or proceed to login.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#FFFDF8] p-8 rounded-2xl border-2 border-[#D6CCBC] shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D6CCBC] flex items-center justify-center bg-[#FFFDF8] mx-auto mb-3 shadow-xs">
            <img
              src="/logo.jpg"
              alt="Trails & Tales Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#292820] font-sans">
            Create Explorer Passport
          </h1>
          <p className="mt-1 text-xs text-[#6D685C]">
            Create your traveler identity to log routes, verify feats, and claim outdoor rewards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FFFDF8] border border-[#B85F43] text-[#B85F43] text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-[#EAE1D3] border border-[#777A53] text-[#777A53] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#6D685C] mb-1">
              Explorer Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs focus:outline-hidden focus:border-[#777A53]"
            />
          </div>

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
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs focus:outline-hidden focus:border-[#777A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#6D685C] mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs focus:outline-hidden focus:border-[#777A53]"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-[#D6CCBC] text-[#777A53] focus:ring-0"
            />
            <label htmlFor="terms" className="text-[11px] text-[#6D685C] leading-snug">
              I pledge to practice Leave-No-Trace outdoor ethics, respect cultural heritage sites,
              and adhere to mandatory safety protocols.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-journal-terracotta w-full py-2.5 text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Creating Passport...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#6D685C]">
          Already registered?{' '}
          <Link href="/auth/login" className="font-bold text-[#777A53] hover:underline">
            Sign In here &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
