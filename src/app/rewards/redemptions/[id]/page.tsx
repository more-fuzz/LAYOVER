'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/ui/api';
import { adaptRedemption, UiRedemption } from '@/lib/ui/adapters';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ImageTile } from '@/components/ui/ImageTile';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';

export default function CouponRedemptionPage() {
  const params = useParams();
  const redemptionId = params?.id as string;

  const [redemption, setRedemption] = useState<UiRedemption | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy code state: 2.2s feedback with rotated "Copied" stamp
  const [copied, setCopied] = useState(false);
  const hiddenTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!redemptionId) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorCode(null);
    setErrorMessage(null);

    apiClient.get<any>(`/api/rewards/redemptions/${redemptionId}`).then((res) => {
      if (!isMounted) return;
      setIsLoading(false);

      if (res.ok && res.data) {
        setRedemption(adaptRedemption(res.data));
      } else {
        setErrorCode(res.status);
        setErrorMessage(res.message);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [redemptionId]);

  // Copy handler with fallback textarea selection, never logging code
  const handleCopyCode = () => {
    if (!redemption?.claimCode) return;

    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(redemption.claimCode);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      // Hidden textarea fallback
      if (hiddenTextAreaRef.current) {
        hiddenTextAreaRef.current.value = redemption.claimCode;
        hiddenTextAreaRef.current.select();
        document.execCommand('copy');
      }
    }

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  // Status mapping
  const formatStatus = (rawStatus: string) => {
    switch (rawStatus.toLowerCase()) {
      case 'active':
      case 'issued':
        return 'Voucher Issued';
      case 'claimed':
      case 'redeemed':
        return 'Partner Confirmed';
      case 'expired':
        return 'Expired';
      default:
        return rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="field-container w-full py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
        Opening authenticated voucher ticket...
      </div>
    );
  }

  // 403 or 404 or missing coupon
  if (errorCode === 403 || errorCode === 404 || !redemption) {
    return (
      <div className="field-container w-full py-16">
        <EmptyState
          title="We couldn't find that coupon"
          description="The requested redemption ticket could not be found or you do not have permission to view it."
          actionLabel="Return to Rewards"
          actionHref="/rewards"
          icon="ticket"
        />
      </div>
    );
  }

  return (
    <div className="field-container w-full py-8 md:py-16 space-y-8 page-rise">
      {/* Hidden textarea for safe copy fallback */}
      <textarea
        ref={hiddenTextAreaRef}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        readOnly
      />

      {/* Back button */}
      <div>
        <Link
          href="/rewards"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] transition-colors"
        >
          <Icon name="arrow-left" size={14} aria-hidden="true" />
          <span>Back to Rewards Catalogue</span>
        </Link>
      </div>

      {/* Ticket Grid: Left Column Reward Tile, Right Column Ink Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* Left Column (5 cols): Illustrative reward tile, name, points spent */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-field p-6 space-y-4">
            <div className="rounded-[var(--radius-sm,8px)] overflow-hidden border border-[var(--line,#D8CBB0)]">
              <ImageTile
                src={redemption.imageUrl}
                alt={redemption.rewardName}
                aspectRatio="4/3"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)]">
                REWARD SPECIFICATION
              </span>
              <h2 className="font-display font-bold text-xl text-[var(--ink,#0F1F1A)]">
                {redemption.rewardName}
              </h2>
              {redemption.rewardDescription && (
                <p className="text-xs text-[var(--muted,#5E675F)] pt-1 leading-relaxed">
                  {redemption.rewardDescription}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--line,#D8CBB0)] flex items-center justify-between text-xs">
              <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">Points debited:</span>
              <span className="font-display font-bold text-base text-[var(--ink,#0F1F1A)] tabular-nums">
                {redemption.pointsSpent.toLocaleString()} PTS
              </span>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/50 border border-[var(--line,#D8CBB0)] text-xs text-[var(--muted,#5E675F)] leading-relaxed">
            Your coupon status updates here once the partner confirms.
          </div>
        </div>

        {/* Right Column (7 cols): Ink Ticket */}
        <div className="lg:col-span-7">
          <div className="panel-ink p-6 md:p-8 border border-[var(--ink-line,#2D4C42)] relative overflow-hidden shadow-2xl space-y-6">
            {/* Top Mono Label */}
            <div className="flex items-center justify-between border-b border-[var(--ink-line,#2D4C42)] pb-4">
              <span className="font-mono-label text-[11px] text-[var(--citron,#D8F23C)]">
                EXPEDITION CLAIM TICKET
              </span>
              <span className="font-mono-label text-[10px] text-[var(--sand,#EADFC8)]">
                OFFICIAL VOUCHER
              </span>
            </div>

            {/* Voucher Code Block */}
            <div className="p-6 rounded-[var(--radius,14px)] bg-[var(--ink-2,#18302A)] border border-[var(--ink-line,#2D4C42)] text-center relative space-y-4">
              <span className="font-mono-label text-[10px] text-[var(--sand,#EADFC8)] block">
                YOUR UNIQUE CLAIM CODE
              </span>

              {/* Huge display code or unavailable notice */}
              {redemption.claimCode ? (
                <>
                  <div className="font-display font-extrabold text-2xl sm:text-4xl text-[var(--paper,#F6EFE2)] tracking-widest tabular-nums select-all py-1">
                    {redemption.claimCode}
                  </div>

                  {/* Copy Code Button with Rotated Copied Stamp */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      aria-live="polite"
                      className={`btn-field ${
                        copied
                          ? 'bg-[var(--jade-deep,#0B7A50)] text-white border-[var(--jade-deep,#0B7A50)]'
                          : 'btn-citron'
                      } text-xs font-bold py-2 px-5 transition-all`}
                    >
                      <Icon name={copied ? 'check' : 'copy'} size={14} aria-hidden="true" />
                      <span>{copied ? 'Code copied' : 'Copy code'}</span>
                    </button>

                    {/* Animated rotated "Copied" stamp */}
                    {copied && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 -right-6 font-mono-label text-[10px] font-extrabold px-2 py-0.5 rounded bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border border-[var(--ink,#0F1F1A)] transform -rotate-8 animate-in zoom-in-150 duration-200 shadow-md"
                      >
                        COPIED
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-[var(--radius-sm,8px)] bg-[var(--ink,#0F1F1A)] text-xs text-[var(--sand,#EADFC8)] font-mono-label">
                  This voucher claim code is currently unavailable from the partner depot.
                </div>
              )}
            </div>

            {/* Ticket Perforation Line with notches */}
            <div className="relative my-4 flex items-center justify-between">
              <span className="absolute -left-9 w-6 h-6 rounded-full bg-[var(--paper,#F6EFE2)]" aria-hidden="true" />
              <div className="w-full border-t border-dashed border-[var(--ink-line,#2D4C42)]" />
              <span className="absolute -right-9 w-6 h-6 rounded-full bg-[var(--paper,#F6EFE2)]" aria-hidden="true" />
            </div>

            {/* Status and Expires */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono-label">
              <div>
                <span className="text-[var(--sand,#EADFC8)] block text-[10px]">STATUS</span>
                <span className="font-bold text-[var(--citron,#D8F23C)]">
                  {formatStatus(redemption.status)}
                </span>
              </div>
              {redemption.expiresAt && (
                <div>
                  <span className="text-[var(--sand,#EADFC8)] block text-[10px]">EXPIRES</span>
                  <span className="font-bold text-[var(--paper,#F6EFE2)] tabular-nums">
                    {new Date(redemption.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Numbered usage steps */}
            {redemption.usageSteps.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="font-mono-label text-[11px] text-[var(--sand,#EADFC8)] block">
                  USAGE INSTRUCTIONS
                </span>
                <ol className="space-y-2 text-xs text-[var(--sand,#EADFC8)]">
                  {redemption.usageSteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono-label font-bold text-[var(--citron,#D8F23C)] shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Partner link: only if merchantUrl exists */}
            {redemption.merchantUrl && (
              <div className="pt-4 border-t border-[var(--ink-line,#2D4C42)]">
                <a
                  href={redemption.merchantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-field btn-flame w-full text-xs font-bold py-3 flex items-center justify-center gap-2"
                >
                  <span>Go to partner site</span>
                  <Icon name="arrow-up-right" size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
