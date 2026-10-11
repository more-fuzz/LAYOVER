'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/ui/api';
import { adaptReward, UiReward } from '@/lib/ui/adapters';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState, EmptyState } from '@/components/ui/EmptyState';
import { ImageTile } from '@/components/ui/ImageTile';

function RewardsContent() {
  const router = useRouter();
  const { user, profile, refreshProfile, isDemoUser } = useAuth();
  const isAuthenticated = !!user || !isDemoUser;

  const [rewards, setRewards] = useState<UiReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redemption dialog state
  const [selectedReward, setSelectedReward] = useState<UiReward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const loadRewards = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.get<any[]>('/api/rewards');
      if (res.ok && Array.isArray(res.data)) {
        setRewards(res.data.map(adaptReward));
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("We can't load the rewards catalogue right now. Check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  // Execution: single request in flight, no client-supplied balance or cost
  const handleConfirmRedeem = async () => {
    if (!selectedReward || isRedeeming) return;

    setIsRedeeming(true);
    setRedeemError(null);

    const res = await apiClient.post<{ redemption_id: string; claim_code: string }>(
      `/api/rewards/${selectedReward.id}/redeem`
    );

    setIsRedeeming(false);

    if (res.ok && res.data && res.data.redemption_id) {
      setSelectedReward(null);
      await refreshProfile();
      // Navigate to coupon page using the ID from the response
      router.push(`/rewards/redemptions/${res.data.redemption_id}`);
    } else {
      setRedeemError(res.message || 'Redemption failed. Please try again.');
    }
  };

  const userBalance = profile?.points;

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-8 page-rise">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-6">
        <div>
          <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
            OUTFITTER PERKS
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--ink,#0F1F1A)] mt-1">
            Rewards <span className="font-serif-accent text-[var(--citron,#D8F23C)] bg-[var(--ink,#0F1F1A)] px-2 rounded-[8px]">Catalogue.</span>
          </h1>
          <p className="text-xs text-[var(--muted,#5E675F)] mt-1">
            Exchange your verified redeemable points for expedition vouchers and gear discounts.
          </p>
        </div>

        {/* Current Redeemable Balance Chip */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {typeof userBalance === 'number' && (
            <div className="px-4 py-2 rounded-[var(--radius,14px)] bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border border-[var(--citron,#D8F23C)] font-mono-label text-xs font-bold shadow-xs">
              <span>REDEEMABLE: </span>
              <span className="tabular-nums font-extrabold">{userBalance.toLocaleString()} PTS</span>
            </div>
          )}
        </div>
      </div>

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
          className="p-4 rounded-[var(--radius,14px)] border border-[var(--folklore,#B8390A)] bg-[#FBF3F0] text-xs text-[var(--folklore,#B8390A)]"
        >
          {redeemError}
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
