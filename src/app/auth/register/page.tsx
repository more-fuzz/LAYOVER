'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="max-w-md w-full space-y-8 bg-[#101b15] p-8 rounded-3xl border border-[#1f3529] shadow-2xl">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 items-center justify-center shadow-lg shadow-emerald-950/50 mb-3">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Join Trails & Tales
          </h2>
          <p className="mt-2 text-xs text-zinc-400">
            Create your traveler passport and start earning verified adventure points
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Explorer Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded bg-[#0b1410] border-[#1d3326] text-emerald-600 focus:ring-0"
            />
            <label htmlFor="terms" className="text-[11px] text-zinc-400 leading-snug">
              I pledge to practice Leave-No-Trace outdoor ethics, respect cultural heritage sites, and adhere to mandatory safety protocols.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Passport...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already registered?{' '}
          <Link href="/auth/login" className="font-bold text-emerald-400 hover:text-emerald-300">
            Sign In here &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
