'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/ui/api';
import { adaptSubmission, UiSubmission } from '@/lib/ui/adapters';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/ui/StatusTag';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/EmptyState';

export default function AdminPage() {
  const { role } = useAuth();

  const [submissions, setSubmissions] = useState<UiSubmission[]>([]);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  // Selected submission for review
  const [selectedSub, setSelectedSub] = useState<UiSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionInFlight, setActionInFlight] = useState(false);
  const [actionResultMsg, setActionResultMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Confirm dialog state
  const [pendingDecision, setPendingDecision] = useState<'approved' | 'rejected' | null>(null);

  const loadSubmissions = async (status: string) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await apiClient.get<any[]>(`/api/admin/submissions?status=${status}`);
      if (res.ok && Array.isArray(res.data)) {
        setSubmissions(res.data.map(adaptSubmission));
      } else {
        setServerError(res.message);
      }
    } catch {
      setServerError("We can't connect to the arbiter queue right now. Check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions(filterStatus);
  }, [filterStatus]);

  const handleExecuteReview = async () => {
    if (!selectedSub || !pendingDecision || actionInFlight) return;

    setActionInFlight(true);
    setActionResultMsg(null);

    const payload = {
      status: pendingDecision,
      review_notes: reviewNotes || (pendingDecision === 'approved' ? 'Verified completion.' : 'Evidence insufficient.'),
    };

    const res = await apiClient.post(`/api/admin/submissions/${selectedSub.id}/review`, payload);

    setActionInFlight(false);
    setPendingDecision(null);

    if (res.ok) {
      setActionResultMsg({
        text: `Submission successfully marked as ${payload.status}. Points ledger updated.`,
        ok: true,
      });
      // Refresh list from server after success
      await loadSubmissions(filterStatus);
      setSelectedSub(null);
      setReviewNotes('');
    } else {
      // Surface server's refusal (self-approval, duplicate award, etc.) in friendly words
      setActionResultMsg({
        text: res.message || 'Action refused by arbiter rules.',
        ok: false,
      });
    }
  };

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-6 page-rise">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-4">
        <div>
          <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
            ADMINISTRATIVE CONSOLE
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--ink,#0F1F1A)] mt-0.5">
            Verification Queue
          </h1>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--sand,#EADFC8)] rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)]">
          {(['pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setFilterStatus(status);
                setSelectedSub(null);
              }}
              className={`px-3 py-1.5 rounded-[var(--radius-sm,8px)] font-mono-label text-[11px] font-bold uppercase transition-colors ${
                filterStatus === status
                  ? 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] shadow-xs'
                  : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Server Error / Permission check refusal */}
      {serverError && (
        <ErrorState
          title="Access restricted or unavailable"
          message={serverError}
          onRetry={() => loadSubmissions(filterStatus)}
        />
      )}

      {/* Action result message */}
      {actionResultMsg && (
        <div
          role="status"
          className={`p-3 rounded-[var(--radius-sm,8px)] border text-xs font-medium flex items-center justify-between ${
            actionResultMsg.ok
              ? 'bg-[#E2F7EE] text-[var(--jade-deep,#0B7A50)] border-[var(--jade-deep,#0B7A50)]'
              : 'bg-[#FBF3F0] text-[var(--folklore,#B8390A)] border-[var(--folklore,#B8390A)]'
          }`}
        >
          <span>{actionResultMsg.text}</span>
          <button
            type="button"
            onClick={() => setActionResultMsg(null)}
            className="underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Queue: Table Left / Panel Right */}
      {!serverError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submissions Table (7 or 12 cols) */}
          <div className={selectedSub ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <div className="card-field overflow-hidden shadow-xs">
              {isLoading ? (
                <div className="py-16 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
                  Loading submissions queue...
                </div>
              ) : submissions.length === 0 ? (
                <div className="py-16 text-center text-xs text-[var(--muted,#5E675F)] font-mono-label">
                  No {filterStatus} submissions in queue.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--line,#D8CBB0)] bg-[var(--sand,#EADFC8)]/30 font-mono-label text-[10px] text-[var(--muted,#5E675F)] uppercase">
                        <th scope="col" className="py-3 px-3">Date</th>
                        <th scope="col" className="py-3 px-3">Explorer</th>
                        <th scope="col" className="py-3 px-3">Activity</th>
                        <th scope="col" className="py-3 px-3">Status</th>
                        <th scope="col" className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line,#D8CBB0)]/40 font-medium">
                      {submissions.map((sub) => {
                        const isSelected = selectedSub?.id === sub.id;
                        return (
                          <tr
                            key={sub.id}
                            className={`transition-colors ${
                              isSelected
                                ? 'bg-[var(--sand,#EADFC8)] font-bold'
                                : 'hover:bg-[var(--sand,#EADFC8)]/30'
                            }`}
                          >
                            <td className="py-3 px-3 font-mono-label text-[11px] whitespace-nowrap text-[var(--muted,#5E675F)]">
                              {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="py-3 px-3 font-bold text-[var(--ink,#0F1F1A)]">
                              {sub.userDisplayName}
                            </td>
                            <td className="py-3 px-3 text-[var(--ink,#0F1F1A)] truncate max-w-[180px]">
                              {sub.activityName}
                            </td>
                            <td className="py-3 px-3">
                              <StatusTag status={sub.status as any} />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSub(sub);
                                  setReviewNotes(sub.reviewNotes || '');
                                  setActionResultMsg(null);
                                }}
                                className="font-mono-label text-[11px] text-[var(--flame,#FF5A1F)] hover:underline font-bold"
                              >
                                Review &rarr;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Review Panel (5 cols) */}
          {selectedSub && (
            <div className="lg:col-span-5 card-field p-5 space-y-4 shadow-lg border-[1.5px] border-[var(--ink,#0F1F1A)] animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[var(--line,#D8CBB0)] pb-3">
                <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)] uppercase">
                  SUBMISSION DOSSIER
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="font-mono-label text-xs text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]"
                >
                  Close &times;
                </button>
              </div>

              {/* Photo Evidence */}
              <div className="space-y-1">
                <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block">
                  EVIDENCE PHOTO
                </span>
                <div className="aspect-[4/3] rounded-[var(--radius-sm,8px)] overflow-hidden border border-[var(--line,#D8CBB0)] bg-[var(--sand,#EADFC8)]">
                  {selectedSub.evidenceUrl ? (
                    <img
                      src={selectedSub.evidenceUrl}
                      alt="Submitted evidence"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
                      Evidence file stored
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-1.5 text-xs font-mono-label pt-2 border-t border-[var(--line,#D8CBB0)]">
                <div>Activity: <span className="font-bold text-[var(--ink,#0F1F1A)]">{selectedSub.activityName}</span></div>
                <div>User: <span className="font-bold text-[var(--ink,#0F1F1A)]">{selectedSub.userDisplayName}</span></div>
                <div>
                  Coordinates:{' '}
                  <span className="text-[var(--ink,#0F1F1A)]">
                    {selectedSub.claimedLatitude && selectedSub.claimedLongitude
                      ? `${selectedSub.claimedLatitude}, ${selectedSub.claimedLongitude}`
                      : 'None provided'}
                  </span>
                </div>
                <div>Award Points: <span className="font-bold text-[var(--flame,#FF5A1F)]">+{selectedSub.points} PTS</span></div>
              </div>

              {/* Arbiter Review Notes */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--line,#D8CBB0)]">
                <label htmlFor="review-notes" className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block">
                  ARBITER REVIEW NOTES
                </label>
                <textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Provide audit notes or reason for rejection..."
                  rows={2}
                  className="w-full p-2.5 rounded-[var(--radius-sm,8px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-xs text-[var(--ink,#0F1F1A)]"
                />
              </div>

              {/* Decision Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={actionInFlight}
                  onClick={() => setPendingDecision('rejected')}
                  className="flex-1 py-2 px-3 rounded-[var(--radius-sm,8px)] border border-[var(--folklore,#B8390A)] bg-transparent text-[var(--folklore,#B8390A)] font-mono-label text-xs font-bold hover:bg-[#FBF3F0] disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={actionInFlight}
                  onClick={() => setPendingDecision('approved')}
                  className="flex-1 py-2 px-3 rounded-[var(--radius-sm,8px)] bg-[var(--jade-deep,#0B7A50)] text-white font-mono-label text-xs font-bold hover:bg-[#096643] disabled:opacity-50 transition-colors"
                >
                  Approve &amp; Award
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accessible Confirmation Dialog */}
      {pendingDecision && (
        <ConfirmDialog
          isOpen={!!pendingDecision}
          onClose={() => {
            if (!actionInFlight) setPendingDecision(null);
          }}
          onConfirm={handleExecuteReview}
          title={pendingDecision === 'approved' ? 'Approve Expedition Submission?' : 'Reject Submission?'}
          description={
            pendingDecision === 'approved'
              ? `This will atomically credit +${selectedSub?.points} points to ${selectedSub?.userDisplayName}'s ledger and mark the activity as verified.`
              : `This will mark the submission as rejected and notify ${selectedSub?.userDisplayName} with your notes.`
          }
          confirmLabel={actionInFlight ? 'Processing...' : pendingDecision === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
          confirmVariant={pendingDecision === 'approved' ? 'flame' : 'ink'}
          isLoading={actionInFlight}
        />
      )}
    </div>
  );
}
