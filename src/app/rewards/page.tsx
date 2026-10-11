'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/ui/api';
import { adaptReward, adaptRedemption, UiReward, UiRedemption } from '@/lib/ui/adapters';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState, EmptyState } from '@/components/ui/EmptyState';
import { ImageTile } from '@/components/ui/ImageTile';

interface JustRedeemedState {
  id: string;
  rewardName: string;
  pointsSpent: number;
  claimCode: string | null;
  merchantName?: string;
  usageInstructions?: string[];
}

function RewardsContent() {
  const router = useRouter();
  const { user, profile, refreshProfile, isDemoUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalogue' | 'vouchers'>('catalogue');

  // Rewards Catalogue state
  const [rewards, setRewards] = useState<UiReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Claimed Vouchers state
  const [vouchers, setVouchers] = useState<UiRedemption[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
  const [vouchersErrorMessage, setVouchersErrorMessage] = useState<string | null>(null);

  // Redemption dialog & success state
  const [selectedReward, setSelectedReward] = useState<UiReward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<JustRedeemedState | null>(null);

  // Copy code feedback state (for cards & modal)
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const hiddenTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const loadRewards = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.get<any[]>('/api/rewards');
      if (res.ok && Array.isArray(res.data)) {
        setRewards(res.data.map(adaptReward));
      } else {
        setErrorMessage(res.message || 'Unable to load rewards catalogue.');
      }
    } catch {
      setErrorMessage("We can't load the rewards catalogue right now. Check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClaimedVouchers = async () => {
    setIsLoadingVouchers(true);
    setVouchersErrorMessage(null);
    try {
      const res = await apiClient.get<any[]>('/api/rewards?mine=true');
      if (res.ok && Array.isArray(res.data)) {
        setVouchers(res.data.map(adaptRedemption));
      } else {
        setVouchersErrorMessage(res.message || 'Unable to load your claimed vouchers.');
      }
    } catch {
      setVouchersErrorMessage("Unable to load claimed vouchers right now. Check connection and try again.");
    } finally {
      setIsLoadingVouchers(false);
    }
  };

  useEffect(() => {
    loadRewards();
    loadClaimedVouchers();
  }, []);

  // Safe clipboard copy with fallback
  const handleCopyCode = (code: string, id: string) => {
    if (!code) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      if (hiddenTextAreaRef.current) {
        hiddenTextAreaRef.current.value = code;
        hiddenTextAreaRef.current.select();
        document.execCommand('copy');
      }
    }

    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId((prev) => (prev === id ? null : prev));
    }, 2400);
  };

  // Execution: single request in flight, no client-supplied balance or cost
  const handleConfirmRedeem = async () => {
    if (!selectedReward || isRedeeming) return;

    setIsRedeeming(true);
    setRedeemError(null);

    const res = await apiClient.post<any>(
      `/api/rewards/${selectedReward.id}/redeem`
    );

    if (res.ok && res.data) {
      let claimCode: string | null = res.data.claim_code || res.data.claimCode || null;
      const redemptionId: string = res.data.redemption_id || res.data.id || '';

      // If the backend confirmed redemption but the code is not in the immediate POST response,
      // retrieve it through the existing supported redemption-details flow
      if (!claimCode && redemptionId) {
        try {
          const detailRes = await apiClient.get<any>(`/api/rewards/redemptions/${redemptionId}`);
          if (detailRes.ok && detailRes.data?.claim_code) {
            claimCode = detailRes.data.claim_code;
          }
        } catch {
          // If details fetch fails, proceed with null claimCode to display proper unavailable message
        }
      }

      // Display the actual redemption details modal in-place
      setJustRedeemed({
        id: redemptionId,
        rewardName: selectedReward.name,
        pointsSpent: selectedReward.costPoints,
        claimCode: claimCode,
        merchantName: selectedReward.merchantName,
        usageInstructions: selectedReward.usageInstructions,
      });

      setSelectedReward(null);
      setIsRedeeming(false);

      // Refresh points and refetch claimed vouchers
      await refreshProfile();
      await loadClaimedVouchers();
    } else {
      setIsRedeeming(false);
      setRedeemError(res.message || 'Redemption failed. Please try again.');
    }
  };

  const userBalance = profile?.points;

  const formatStatus = (rawStatus: string) => {
    switch (rawStatus.toLowerCase()) {
      case 'active':
      case 'issued':
        return 'Voucher Issued';
      case 'claimed':
      case 'fulfilled':
      case 'redeemed':
        return 'Partner Confirmed';
      case 'expired':
        return 'Expired';
      default:
        return rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }
  };

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-8 page-rise">
      {/* Hidden textarea for safe copy fallback */}
      <textarea
        ref={hiddenTextAreaRef}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        readOnly
      />

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-6">
        <div>
          <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
            OUTFITTER PERKS &amp; EXPEDITION GEAR
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--ink,#0F1F1A)] mt-1">
            Rewards <span className="font-serif-accent text-[var(--citron,#D8F23C)] bg-[var(--ink,#0F1F1A)] px-2 rounded-[8px]">Depot.</span>
          </h1>
          <p className="text-xs text-[var(--muted,#5E675F)] mt-1">
            Exchange your verified redeemable points for authentic expedition vouchers and partner gear discounts.
          </p>
        </div>

        {/* Current Redeemable Balance Chip */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {typeof userBalance === 'number' && (
            <div className="px-4 py-2 rounded-[var(--radius,14px)] bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border border-[var(--citron,#D8F23C)] font-mono-label text-xs font-bold shadow-xs flex items-center gap-2">
              <span>REDEEMABLE: </span>
              <span className="tabular-nums font-extrabold">{userBalance.toLocaleString()} PTS</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line,#D8CBB0)] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalogue')}
          className={`px-4 py-2 rounded-[var(--radius-sm,8px)] text-xs font-mono-label font-bold transition-all flex items-center gap-2 ${
            activeTab === 'catalogue'
              ? 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] shadow-xs'
              : 'bg-transparent text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] hover:bg-[var(--sand,#EADFC8)]/50'
          }`}
        >
          <Icon name="bookmark" size={14} aria-hidden="true" />
          <span>Reward Catalogue</span>
          <span className="text-[10px] opacity-75 tabular-nums">({rewards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2 rounded-[var(--radius-sm,8px)] text-xs font-mono-label font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vouchers'
              ? 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] shadow-xs'
              : 'bg-transparent text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] hover:bg-[var(--sand,#EADFC8)]/50'
          }`}
        >
          <Icon name="ticket" size={14} aria-hidden="true" />
          <span>Claimed Vouchers</span>
          {vouchers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] font-extrabold tabular-nums">
              {vouchers.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. Tab: Reward Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <ErrorState
              title="Rewards unavailable"
              message={errorMessage}
              onRetry={loadRewards}
            />
          )}

          {/* Loading state */}
          {isLoading && !errorMessage && (
            <div className="py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
              Loading outfitter rewards catalogue...
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !errorMessage && rewards.length === 0 && (
            <EmptyState
              title="No rewards available"
              description="Outfitter rewards are currently restocking. Check back soon for gear discounts and vouchers."
              icon="ticket"
            />
          )}

          {/* Rewards Grid */}
          {!isLoading && !errorMessage && rewards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const isOutOfStock = reward.stock !== null && reward.stock <= 0;
                const hasInsufficientPoints =
                  typeof userBalance === 'number' && userBalance < reward.costPoints;
                const canRedeem = !isOutOfStock && !hasInsufficientPoints;

                return (
                  <div
                    key={reward.id}
                    className={`card-field p-5 flex flex-col justify-between space-y-4 ${
                      isOutOfStock ? 'opacity-60 grayscale' : ''
                    }`}
                  >
                    {/* Reward Image Tile */}
                    <div className="relative">
                      <ImageTile
                        src={reward.imageUrl}
                        alt={reward.name}
                        aspectRatio="16/9"
                        className="w-full h-full object-cover rounded-[var(--radius-sm,8px)]"
                      />
                      <span className="absolute top-3 left-3 z-10 font-mono-label text-[10px] text-[var(--ink,#0F1F1A)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] px-2 py-0.5 rounded shadow-xs">
                        {reward.category}
                      </span>
                      {reward.stock !== null && (
                        <span className="absolute top-3 right-3 z-10 font-mono-label text-[10px] text-[var(--muted,#5E675F)] bg-[var(--sand,#EADFC8)] px-2 py-0.5 rounded border border-[var(--line,#D8CBB0)]">
                          {isOutOfStock ? 'Out of Stock' : `${reward.stock} Left`}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 flex-1">
                      <h3 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)] line-clamp-1">
                        {reward.name}
                      </h3>
                      <p className="text-xs text-[var(--muted,#5E675F)] line-clamp-2 leading-relaxed">
                        {reward.description}
                      </p>
                      {reward.merchantName && (
                        <div className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] pt-1">
                          Partner: {reward.merchantName}
                        </div>
                      )}
                    </div>

                    {/* Points Cost & Action */}
                    <div className="pt-3 border-t border-[var(--line,#D8CBB0)] flex items-center justify-between gap-3">
                      <div className="font-mono-label text-xs font-bold text-[var(--ink,#0F1F1A)]">
                        <span className="tabular-nums">{reward.costPoints.toLocaleString()}</span> PTS
                      </div>

                      <Button
                        variant={canRedeem ? 'flame' : 'outline'}
                        size="sm"
                        disabled={!canRedeem}
                        onClick={() => {
                          setSelectedReward(reward);
                          setRedeemError(null);
                        }}
                      >
                        {isOutOfStock
                          ? 'Out of Stock'
                          : hasInsufficientPoints
                          ? 'Need More Points'
                          : 'Redeem'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Tab: Claimed Vouchers */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          {/* Error Banner */}
          {vouchersErrorMessage && (
            <ErrorState
              title="Claimed vouchers unavailable"
              message={vouchersErrorMessage}
              onRetry={loadClaimedVouchers}
            />
          )}

          {/* Loading state */}
          {isLoadingVouchers && !vouchersErrorMessage && (
            <div className="py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
              Retrieving your claimed expedition vouchers...
            </div>
          )}

          {/* Empty state */}
          {!isLoadingVouchers && !vouchersErrorMessage && vouchers.length === 0 && (
            <EmptyState
              title="No claimed vouchers yet"
              description="You have not redeemed any expedition vouchers yet. Browse the catalogue to exchange your points for gear perks."
              actionLabel="Explore Reward Catalogue"
              onAction={() => setActiveTab('catalogue')}
              icon="ticket"
            />
          )}

          {/* Vouchers Grid */}
          {!isLoadingVouchers && !vouchersErrorMessage && vouchers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vouchers.map((voucher) => {
                const isCopied = copiedCodeId === voucher.id;

                return (
                  <div
                    key={voucher.id}
                    className="card-field p-6 flex flex-col justify-between space-y-5 border border-[var(--line,#D8CBB0)]"
                  >
                    {/* Top Row: Partner / Name and Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] uppercase">
                            {voucher.merchantName || 'Trails & Tales Outfitter Depot'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-label font-bold bg-[var(--sand,#EADFC8)] text-[var(--ink,#0F1F1A)] border border-[var(--line,#D8CBB0)]">
                            {formatStatus(voucher.status)}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)]">
                          {voucher.rewardName}
                        </h3>
                        <div className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                          Claimed: {new Date(voucher.createdAt).toLocaleDateString()} &bull;{' '}
                          <span className="font-bold text-[var(--ink,#0F1F1A)]">
                            {voucher.pointsSpent.toLocaleString()} PTS
                          </span>
                        </div>
                      </div>

                      {voucher.imageUrl && (
                        <div className="w-16 h-16 shrink-0 rounded-[var(--radius-sm,8px)] overflow-hidden border border-[var(--line,#D8CBB0)]">
                          <ImageTile
                            src={voucher.imageUrl}
                            alt={voucher.rewardName}
                            aspectRatio="1/1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Official Coupon Code Block */}
                    <div className="p-4 rounded-[var(--radius,14px)] bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] space-y-2 border border-[var(--ink-line,#2D4C42)] shadow-sm">
                      <div className="flex items-center justify-between text-[10px] font-mono-label text-[var(--sand,#EADFC8)]">
                        <span>AUTHENTICATED COUPON CODE</span>
                        {voucher.expiresAt && (
                          <span>Expires {new Date(voucher.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        {voucher.claimCode ? (
                          <div className="font-display font-extrabold text-xl sm:text-2xl text-[var(--citron,#D8F23C)] tracking-wider tabular-nums select-all truncate">
                            {voucher.claimCode}
                          </div>
                        ) : (
                          <div className="text-xs text-[var(--sand,#EADFC8)] font-mono-label">
                            Coupon code currently unavailable
                          </div>
                        )}

                        {voucher.claimCode && (
                          <button
                            type="button"
                            onClick={() => handleCopyCode(voucher.claimCode, voucher.id)}
                            aria-live="polite"
                            className={`btn-field ${
                              isCopied
                                ? 'bg-[var(--jade-deep,#0B7A50)] text-white border-[var(--jade-deep,#0B7A50)]'
                                : 'btn-citron'
                            } text-xs font-bold py-1.5 px-3 transition-all shrink-0`}
                          >
                            <Icon name={isCopied ? 'check' : 'copy'} size={13} aria-hidden="true" />
                            <span>{isCopied ? 'Copied!' : 'Copy code'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer link to full voucher ticket */}
                    <div className="pt-2 border-t border-[var(--line,#D8CBB0)] flex items-center justify-between">
                      <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                        Ticket ID: {voucher.id.slice(0, 12)}...
                      </span>

                      <Link
                        href={`/rewards/redemptions/${voucher.id}`}
                        className="text-xs font-bold text-[var(--flame,#FF5A1F)] hover:underline flex items-center gap-1"
                      >
                        <span>View Voucher Ticket</span>
                        <Icon name="arrow-right" size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Accessible Confirm Dialog */}
      {selectedReward && (
        <ConfirmDialog
          isOpen={!!selectedReward}
          onClose={() => {
            if (!isRedeeming) setSelectedReward(null);
          }}
          onConfirm={handleConfirmRedeem}
          title={`Redeem ${selectedReward.name}?`}
          description={`This reward costs ${selectedReward.costPoints.toLocaleString()} redeemable points. Your balance will be debited and an authenticated voucher claim code will be generated immediately.`}
          confirmLabel={isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
          confirmVariant="flame"
          isLoading={isRedeeming}
        />
      )}

      {/* Error Toast / Alert during redemption */}
      {redeemError && (
        <div
          role="alert"
          className="p-4 rounded-[var(--radius,14px)] border border-[var(--folklore,#B8390A)] bg-[#FBF3F0] text-xs text-[var(--folklore,#B8390A)] flex items-center justify-between gap-4"
        >
          <span>{redeemError}</span>
          <button
            type="button"
            onClick={() => setRedeemError(null)}
            className="text-[var(--folklore,#B8390A)] font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Post-Redemption Ticket Dialog with Immediate Coupon Code & Copy Action */}
      {justRedeemed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="redemption-success-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[var(--card,#FFFAF0)] border-[1.5px] border-[var(--ink,#0F1F1A)] rounded-[var(--radius-lg,22px)] max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-4">
              <div className="space-y-1">
                <span className="font-mono-label text-[10px] text-[var(--jade-deep,#0B7A50)] font-bold flex items-center gap-1.5">
                  <Icon name="check" size={12} aria-hidden="true" />
                  REDEMPTION CONFIRMED
                </span>
                <h2
                  id="redemption-success-title"
                  className="font-display font-extrabold text-2xl text-[var(--ink,#0F1F1A)]"
                >
                  Expedition Voucher Ready!
                </h2>
                <p className="text-xs text-[var(--muted,#5E675F)]">
                  {justRedeemed.rewardName} &bull; {justRedeemed.pointsSpent.toLocaleString()} points debited
                </p>
              </div>

              <button
                type="button"
                onClick={() => setJustRedeemed(null)}
                className="text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] p-1 rounded"
                aria-label="Close dialog"
              >
                <Icon name="close" size={18} aria-hidden="true" />
              </button>
            </div>

            {/* High-visibility Coupon Code Ink Block */}
            <div className="p-6 rounded-[var(--radius,14px)] bg-[var(--ink,#0F1F1A)] border border-[var(--ink-line,#2D4C42)] text-center space-y-4 shadow-md">
              <span className="font-mono-label text-[10px] text-[var(--sand,#EADFC8)] block tracking-widest">
                OFFICIAL VOUCHER CLAIM CODE
              </span>

              {justRedeemed.claimCode ? (
                <>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--paper,#F6EFE2)] tracking-widest tabular-nums select-all py-1">
                    {justRedeemed.claimCode}
                  </div>

                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(justRedeemed.claimCode!, 'modal-redeemed')}
                      aria-live="polite"
                      className={`btn-field ${
                        copiedCodeId === 'modal-redeemed'
                          ? 'bg-[var(--jade-deep,#0B7A50)] text-white border-[var(--jade-deep,#0B7A50)]'
                          : 'btn-citron'
                      } text-xs font-bold py-2 px-5 transition-all`}
                    >
                      <Icon
                        name={copiedCodeId === 'modal-redeemed' ? 'check' : 'copy'}
                        size={14}
                        aria-hidden="true"
                      />
                      <span>
                        {copiedCodeId === 'modal-redeemed' ? 'Code copied!' : 'Copy coupon code'}
                      </span>
                    </button>

                    {copiedCodeId === 'modal-redeemed' && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 -right-6 font-mono-label text-[10px] font-extrabold px-2 py-0.5 rounded bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border border-[var(--ink,#0F1F1A)] transform -rotate-8 animate-in zoom-in duration-200 shadow-md"
                      >
                        COPIED
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-3 rounded bg-[var(--sand,#EADFC8)]/10 text-xs text-[var(--sand,#EADFC8)] font-mono-label">
                  Coupon code is currently being processed by partner depot and will appear in your Claimed Vouchers list.
                </div>
              )}
            </div>

            {/* Partner instructions summary if present */}
            {justRedeemed.usageInstructions && justRedeemed.usageInstructions.length > 0 && (
              <div className="space-y-2 text-xs text-[var(--muted,#5E675F)] bg-[var(--sand,#EADFC8)]/40 p-4 rounded-[var(--radius-sm,8px)] border border-[var(--line,#D8CBB0)]">
                <span className="font-mono-label text-[10px] font-bold text-[var(--ink,#0F1F1A)] block">
                  USAGE INSTRUCTIONS:
                </span>
                <p className="line-clamp-3 leading-relaxed">
                  {justRedeemed.usageInstructions[0]}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setJustRedeemed(null);
                  setActiveTab('vouchers');
                }}
                className="w-full sm:w-auto"
              >
                View in Claimed Vouchers
              </Button>

              {justRedeemed.id && (
                <Link
                  href={`/rewards/redemptions/${justRedeemed.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="flame" size="sm" className="w-full gap-2">
                    <span>Open Full Voucher Ticket</span>
                    <Icon name="arrow-right" size={14} aria-hidden="true" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RewardsPage() {
  return (
    <Suspense
      fallback={
        <div className="field-container w-full py-12 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
          Loading rewards catalogue...
        </div>
      }
    >
      <RewardsContent />
    </Suspense>
  );
}
