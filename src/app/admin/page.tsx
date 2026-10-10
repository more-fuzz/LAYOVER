'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SafeImage from '@/components/SafeImage';
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
  ArrowRight,
  Lock,
  FileCheck2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { profile, role, switchDemoRole } = useAuth();

  const [submissions, setSubmissions] = useState<SubmissionItem[]>(SAMPLE_SUBMISSIONS);
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
          review_notes:
            reviewNotes ||
            (status === 'approved'
              ? 'Verified summit photo meets environmental ethics and GPS criteria.'
              : 'Evidence photo did not clearly verify activity completion.'),
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
                  review_notes:
                    reviewNotes || (status === 'approved' ? 'Verified completion.' : 'Rejected.'),
                  reviewed_at: new Date().toISOString(),
                }
              : s
          )
        );
        setActionMessage({
          text: `Submission successfully marked as ${status}! Points ledger updated atomically.`,
          type: 'success',
        });
        setTimeout(() => {
          setReviewingSub(null);
        }, 1500);
      }
    } catch (err: any) {
      setActionLoading(false);
      setActionMessage({ text: err.message || 'Network error', type: 'error' });
    }
  };

  // Enforce access control presentation
  if (role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EAE1D3] border border-[#B85F43] flex items-center justify-center text-[#B85F43] mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#292820] font-sans">
            Administrative Access Restricted
          </h1>
          <p className="text-xs text-[#6D685C] leading-relaxed">
            This section is restricted to authorized expedition reviewers. Ordinary traveler accounts
            cannot access server review panels or award point ledger transactions.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => switchDemoRole('admin')}
              className="btn-journal-terracotta text-xs py-2 px-4"
            >
              Simulate Admin Persona (Evaluator Test)
            </button>
            <Link href="/" className="btn-journal-secondary text-xs py-2 px-4">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#B85F43] bg-[#EAE1D3] px-3 py-1 rounded-md border border-[#D6CCBC] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMINISTRATIVE EVIDENCE REVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#292820] font-sans">
            Submission Review & Evidence Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#6D685C] max-w-xl mt-1">
            Inspect user-submitted photographic proof, validate trailhead coordinates, enforce safety
            protocols, and officially certify explorer achievements.
          </p>
        </div>

        {/* Admin Role Status Badge */}
        <div className="bg-[#F5F0E7] p-4 rounded-xl border border-[#D6CCBC] text-center shrink-0 space-y-1.5">
          <div className="text-[10px] font-mono text-[#6D685C] uppercase tracking-wider">
            Active Authorization
          </div>
          <div className="text-sm font-extrabold text-[#B85F43] flex items-center justify-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#B85F43]" />
            <span>ROLE: ADMIN</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D6CCBC] pb-3">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filterStatus === st
                ? 'btn-journal-primary'
                : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3]'
            }`}
          >
            {st} ({submissions.filter((s) => st === 'all' || s.status === st).length})
          </button>
        ))}
      </div>

      {/* Submissions List Table */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] overflow-hidden shadow-xs">
        <div className="divide-y divide-[#D6CCBC]">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-[#6D685C] text-xs">
              No submissions found for filter: {filterStatus}.
            </div>
          ) : (
            filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F5F0E7] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D6CCBC] shrink-0 bg-[#EAE1D3]">
                    <SafeImage
                      src={sub.evidence_url}
                      alt={sub.activity_name}
                      aspectRatio="1/1"
                      fallbackTitle="Proof Photo"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#777A53] bg-[#EAE1D3] px-2 py-0.5 rounded">
                        {sub.activity_category}
                      </span>
                      <span className="text-xs font-bold text-[#292820] font-sans">
                        {sub.activity_name}
                      </span>
                    </div>

                    <div className="text-xs text-[#6D685C] flex items-center gap-3 font-mono">
                      <span>Traveler: {sub.user_display_name || sub.user_id}</span>
                      <span>•</span>
                      <span>
                        Date: {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#6D685C] italic line-clamp-1">
                      &quot;{sub.notes || 'No traveler notes provided.'}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`retro-stamp text-[10px] ${
                      sub.status === 'approved'
                        ? 'text-[#777A53] border-[#777A53]'
                        : sub.status === 'rejected'
                        ? 'text-[#B85F43] border-[#B85F43]'
                        : 'text-[#C6A45B] border-[#C6A45B]'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(sub)}
                    className="btn-journal-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Evidence</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review & Adjudication Modal */}
      {reviewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292820]/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#292820] font-sans">
                  Inspect Submission #{reviewingSub.id.toUpperCase()}
                </h3>
                <p className="text-xs text-[#6D685C]">
                  Evaluate photo authenticity, GPS timestamp, and safety standards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingSub(null)}
                className="text-[#6D685C] hover:text-[#292820]"
              >
                ✕
              </button>
            </div>

            {/* Evidence Image Viewer */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6D685C] block">
                Encrypted Private Storage Photo:
              </label>
              <div className="rounded-xl overflow-hidden border border-[#D6CCBC]">
                <SafeImage
                  src={reviewingSub.evidence_url}
                  alt={reviewingSub.activity_name}
                  aspectRatio="16/9"
                  fallbackTitle="Private Evidence Asset"
                />
              </div>
            </div>

            <div className="p-3.5 bg-[#F5F0E7] rounded-xl border border-[#D6CCBC] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#6D685C]">Target Activity:</span>
                <span className="text-[#292820] font-bold">{reviewingSub.activity_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D685C]">Points on Approval:</span>
                <span className="text-[#B85F43] font-bold">+{reviewingSub.points} PTS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D685C]">Submitted Date:</span>
                <span className="text-[#292820]">
                  {new Date(reviewingSub.submitted_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Reviewer Notes Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6D685C] block">
                Official Reviewer Notes / Audit Justification:
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="e.g. Verified summit landmark in photo matches topographical coordinates..."
                className="w-full text-xs p-3 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] focus:outline-hidden"
              />
            </div>

            {actionMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  actionMessage.type === 'success'
                    ? 'bg-[#EAE1D3] text-[#777A53] border border-[#777A53]'
                    : 'bg-[#F5F0E7] text-[#B85F43] border border-[#B85F43]'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision('rejected')}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold border border-[#B85F43] text-[#B85F43] hover:bg-[#B85F43]/10 transition-colors disabled:opacity-50"
              >
                Reject Submission
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision('approved')}
                className="btn-journal-primary flex-1 py-2.5 text-xs font-bold disabled:opacity-50"
              >
                {actionLoading ? 'Processing Ledger...' : 'Approve & Award Points'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
