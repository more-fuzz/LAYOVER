'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_SUBMISSIONS, SAMPLE_REWARDS, SubmissionItem, RewardItem } from '@/data/sampleData';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertCircle,
  Eye,
  Gift,
  Sparkles,
  User,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { profile, role, switchDemoRole } = useAuth();

  const [submissions, setSubmissions] = useState<SubmissionItem[]>(SAMPLE_SUBMISSIONS);
  const [rewards, setRewards] = useState<RewardItem[]>(SAMPLE_REWARDS);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const [reviewingSub, setReviewingSub] = useState<SubmissionItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const handleOpenReview = (sub: SubmissionItem) => {
    setReviewingSub(sub);
    setReviewNotes('');
    setActionMessage(null);
  };

  const handleDecision = async (status: 'approved' | 'rejected') => {
    if (!reviewingSub) return;
    setActionLoading(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/submissions/${reviewingSub.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          review_notes: reviewNotes || (status === 'approved' ? 'Verified summit photo meets safety and GPS criteria.' : 'Evidence photo did not clearly show activity completion.'),
        }),
      });

      const data = await res.json();
      setActionLoading(false);

      if (!res.ok) {
        setActionMessage({ text: data.message || 'Action failed', type: 'error' });
      } else {
        // Update local state
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === reviewingSub.id
              ? {
                  ...s,
                  status,
                  review_notes: reviewNotes || (status === 'approved' ? 'Verified completion.' : 'Rejected.'),
                  reviewed_at: new Date().toISOString(),
                }
              : s
          )
        );
        setActionMessage({ text: `Submission successfully marked as ${status}! Points ledger updated.`, type: 'success' });
        setTimeout(() => {
          setReviewingSub(null);
        }, 1500);
      }
    } catch (err: any) {
      setActionLoading(false);
      setActionMessage({ text: err.message || 'Network error', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Admin Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1e1333] via-[#140c24] to-[#0a0714] border border-[#38235e] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/90 px-3 py-1 rounded-full border border-purple-700 mb-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Administrator Verification Authority</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Submission Review & Evidence Verification
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mt-1">
            Review user-submitted proof photos, validate coordinates, enforce safety compliance, and award verified points atomically to the ledger.
          </p>
        </div>

        {/* Admin Role Status Badge & Quick Switcher */}
        <div className="bg-[#120a22] p-4 rounded-2xl border border-[#2b184a] text-center shrink-0 space-y-2">
          <div className="text-xs text-purple-300 font-semibold">Active Session Role</div>
          <div className="text-lg font-black text-white flex items-center justify-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${role === 'admin' ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="uppercase">{role}</span>
          </div>
          {role !== 'admin' && (
            <button
              type="button"
              onClick={() => switchDemoRole('admin')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 underline"
            >
              Switch to Admin Mode
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#24173d] pb-3">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === st
                ? 'bg-purple-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-[#1a122e]'
            }`}
          >
            {st} Submissions ({submissions.filter((s) => st === 'all' || s.status === st).length})
          </button>
        ))}
      </div>

      {/* Submissions Queue Table */}
      <div className="rounded-3xl bg-[#110c22] border border-[#251742] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#21143b] flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            Verification Queue ({filteredSubmissions.length})
          </h2>
          <span className="text-xs text-zinc-400">Database Table: public.submissions</span>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-sm">
            No submissions found in this category.
          </div>
        ) : (
          <div className="divide-y divide-[#1e1338]">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 hover:bg-[#181130] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={sub.evidence_url}
                    alt={sub.activity_name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-purple-600/40"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                        {sub.activity_category}
                      </span>
                      <span className="text-xs text-zinc-400">
                        By {sub.user_display_name} • {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-base text-white">
                      {sub.activity_name}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>Reward: +{sub.points} pts</span>
                      {sub.claimed_latitude && (
                        <span>• GPS: {sub.claimed_latitude.toFixed(4)}, {sub.claimed_longitude?.toFixed(4)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${
                      sub.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : sub.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {sub.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(sub)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow transition-colors"
                  >
                    Review Proof &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#130d24] border border-[#2e1a52] p-6 sm:p-8 rounded-3xl max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#261642] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Verification Dossier
                </span>
                <h3 className="text-xl font-bold text-white">
                  {reviewingSub.activity_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingSub(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Evidence Image */}
            <div className="rounded-2xl overflow-hidden border border-[#2a174a]">
              <img
                src={reviewingSub.evidence_url}
                alt="Submitted Evidence"
                className="w-full max-h-72 object-cover"
              />
            </div>

            {/* Submission Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#0c0817] p-4 rounded-xl border border-[#21133b]">
              <div>
                <span className="text-zinc-500">Explorer:</span>
                <div className="font-bold text-white">{reviewingSub.user_display_name}</div>
              </div>
              <div>
                <span className="text-zinc-500">Points at Stake:</span>
                <div className="font-bold text-emerald-400">+{reviewingSub.points} Points</div>
              </div>
              <div>
                <span className="text-zinc-500">Claimed Coordinates:</span>
                <div className="font-mono text-zinc-300">
                  {reviewingSub.claimed_latitude || 'Not supplied'}, {reviewingSub.claimed_longitude || ''}
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Submitted Timestamp:</span>
                <div className="text-zinc-300">{new Date(reviewingSub.submitted_at).toLocaleString()}</div>
              </div>
            </div>

            {/* Review Notes */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Official Reviewer Notes (Visible to Traveler in Memoir)
              </label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="e.g. Verified summit marker and gear safety checklist."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0817] border border-[#261742] text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {actionMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  actionMessage.type === 'success'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Decision Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision('rejected')}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 transition-colors disabled:opacity-50"
              >
                Reject Proof
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision('approved')}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 transition-colors disabled:opacity-50"
              >
                Approve & Award Points
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
