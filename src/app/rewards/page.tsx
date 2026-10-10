'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SafeImage from '@/components/SafeImage';
import { SAMPLE_REWARDS, SAMPLE_REDEMPTIONS, RewardItem, RedemptionItem } from '@/data/sampleData';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Ticket,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

function RewardsContent() {
  const { profile, refreshProfile } = useAuth();
  const searchParams = useSearchParams();

  const [rewards, setRewards] = useState<RewardItem[]>(SAMPLE_REWARDS);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>(SAMPLE_REDEMPTIONS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-claims'>(
    searchParams.get('tab') === 'my-claims' ? 'my-claims' : 'catalog'
  );

  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successRedemption, setSuccessRedemption] = useState<{
    claimCode: string;
    redemptionId: string;
  } | null>(null);

  useEffect(() => {
    async function loadRewardsData() {
      try {
        const res = await fetch('/api/rewards');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setRewards(json.data);
          }
        }
      } catch (err) {
        console.warn('API rewards fetch failed, using sample fixtures', err);
      }
    }
    loadRewardsData();
  }, []);

  const handleOpenRedeem = (reward: RewardItem) => {
    setSelectedReward(reward);
    setErrorMsg('');
    setSuccessRedemption(null);
  };

  const confirmRedemption = async () => {
    if (!selectedReward) return;

    if (profile.points < selectedReward.cost_points) {
      setErrorMsg(
        `Insufficient points. You need ${selectedReward.cost_points} pts, but have ${profile.points} pts.`
      );
      return;
    }

    setRedeeming(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/rewards/${selectedReward.id}/redeem`, {
        method: 'POST',
      });
      const data = await res.json();
      setRedeeming(false);

      if (!res.ok) {
        setErrorMsg(data.message || 'Redemption failed');
      } else {
        const redId = data.redemption_id || `red-${Date.now()}`;
        const claimCode = data.claim_code;

        setSuccessRedemption({
          claimCode,
          redemptionId: redId,
        });

        // Add to local redemptions
        const newClaim: RedemptionItem = {
          id: redId,
          user_id: profile.id,
          reward_id: selectedReward.id,
          reward_name: selectedReward.name,
          reward_description: selectedReward.description,
          reward_image: selectedReward.image_url,
          points_spent: selectedReward.cost_points,
          status: 'fulfilled',
          claim_code: claimCode,
          created_at: new Date().toISOString(),
          merchant_name: selectedReward.merchant_name,
          merchant_url: selectedReward.merchant_url,
          usage_instructions: selectedReward.usage_instructions,
        };
        setRedemptions([newClaim, ...redemptions]);

        // Deduct points locally
        profile.points = Math.max(0, profile.points - selectedReward.cost_points);
      }
    } catch (err: any) {
      setRedeeming(false);
      setErrorMsg(err.message || 'Network error during redemption');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Editorial Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-3 py-1 rounded-md border border-[#D6CCBC]">
            <Gift className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>Field Outfitter Exchange</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#292820] font-sans">
            Expedition Rewards & Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-[#6D685C] max-w-xl leading-relaxed">
            Redeem verified trail points for official expedition patches, tactical navigation gear,
            field handbooks, and certified national outfitter vouchers.
          </p>
        </div>

        {/* User Authoritative Balance Box */}
        <div className="bg-[#F5F0E7] px-6 py-4 rounded-xl border border-[#D6CCBC] text-center shadow-inner shrink-0 self-start md:self-auto">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#6D685C]">
            Verified Balance
          </div>
          <div className="text-3xl font-extrabold text-[#B85F43] flex items-center justify-center gap-1.5 mt-1 font-mono">
            <Sparkles className="w-5 h-5 text-[#C6A45B]" />
            <span>{profile.points.toLocaleString()} PTS</span>
          </div>
          <div className="text-[10px] text-[#777A53] font-medium mt-1">
            Authoritative Server Ledger
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D6CCBC] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'catalog'
              ? 'btn-journal-primary'
              : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Available Catalogue ({rewards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-claims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'my-claims'
              ? 'btn-journal-primary'
              : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Claimed Vouchers ({redemptions.length})</span>
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = profile.points >= reward.cost_points;
            const inStock = reward.stock === null || reward.stock > 0;

            return (
              <div
                key={reward.id}
                className="group flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] hover:border-[#777A53] overflow-hidden shadow-sm transition-all hover:-translate-y-0.5"
              >
                <div className="relative w-full">
                  <SafeImage
                    src={reward.image_url}
                    alt={reward.name}
                    aspectRatio="4/3"
                    fallbackTitle={reward.name}
                  />
                  <div className="absolute top-3 left-3 bg-[#FFFDF8]/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-[#777A53] uppercase border border-[#D6CCBC]">
                    {reward.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#B85F43] text-white px-2.5 py-1 rounded-md text-xs font-mono font-bold shadow-xs">
                    {reward.cost_points} PTS
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-[#292820] group-hover:text-[#B85F43] transition-colors line-clamp-1 font-sans">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-[#6D685C] line-clamp-2 mt-1 leading-relaxed">
                      {reward.description}
                    </p>
                    <div className="mt-2 text-[11px] text-[#777A53] font-mono">
                      Depot: {reward.merchant_name || 'Outfitter Depot'}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D6CCBC] flex items-center justify-between">
                    <span className="text-[11px] text-[#6D685C] font-mono">
                      {reward.stock !== null ? `${reward.stock} remaining` : 'Unlimited Digital'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenRedeem(reward)}
                      disabled={!inStock}
                      className={`text-xs font-bold py-2 px-3.5 rounded-lg transition-all ${
                        !inStock
                          ? 'bg-[#EAE1D3] text-[#8E8675] cursor-not-allowed border border-[#D6CCBC]'
                          : canAfford
                          ? 'btn-journal-terracotta'
                          : 'btn-journal-secondary text-[#B85F43]'
                      }`}
                    >
                      {!inStock ? 'Out of Stock' : canAfford ? 'Redeem Voucher' : 'Need More Points'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: My Claimed Vouchers */}
      {activeTab === 'my-claims' && (
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] text-center text-[#6D685C]">
              <Ticket className="w-8 h-8 text-[#777A53] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No claimed vouchers in your journal yet.</p>
              <p className="text-xs text-[#8E8675] mt-1">
                Complete and verify trail expeditions to accumulate points and redeem tactical rewards.
              </p>
            </div>
          ) : (
            redemptions.map((red) => (
              <div
                key={red.id}
                className="p-5 rounded-xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#777A53] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#777A53] shrink-0">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#292820] font-sans">
                      {red.reward_name}
                    </div>
                    <div className="text-xs text-[#6D685C] mt-0.5">
                      Redeemed for {red.points_spent} pts •{' '}
                      {new Date(red.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-2 px-3 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] font-mono text-xs font-bold text-[#B85F43]">
                    {red.claim_code}
                  </div>
                  <span className="retro-stamp text-[10px]">
                    {red.status.toUpperCase()}
                  </span>
                  <Link
                    href={`/rewards/redemptions/${red.id}`}
                    className="btn-journal-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
                  >
                    <span>View Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation & Redemption Result Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292820]/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-xl space-y-6">
            {successRedemption ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EAE1D3] border border-[#777A53] flex items-center justify-center text-[#777A53] mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#292820] font-sans">
                  Redemption Confirmed!
                </h3>
                <p className="text-xs text-[#6D685C] leading-relaxed">
                  {selectedReward.cost_points} points deducted from your ledger. Your official voucher code has been issued:
                </p>

                <div className="p-3 rounded-xl bg-[#F5F0E7] border-2 border-[#D6CCBC] font-mono text-base font-extrabold text-[#B85F43] tracking-wider select-all">
                  {successRedemption.claimCode}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href={`/rewards/redemptions/${successRedemption.redemptionId}`}
                    className="btn-journal-terracotta text-xs w-full flex items-center justify-center gap-1.5 py-2.5"
                  >
                    <span>Open Dedicated Voucher & Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReward(null);
                      setSuccessRedemption(null);
                    }}
                    className="btn-journal-secondary text-xs w-full py-2"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-[#D6CCBC] pb-2">
                  <h3 className="text-lg font-bold text-[#292820] font-sans">
                    Confirm Reward Redemption
                  </h3>
                  <p className="text-xs text-[#6D685C]">
                    Review ledger details before generating your voucher.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC]">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#D6CCBC] shrink-0">
                    <SafeImage
                      src={selectedReward.image_url}
                      alt={selectedReward.name}
                      aspectRatio="1/1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-[#292820] truncate">
                      {selectedReward.name}
                    </div>
                    <div className="text-xs text-[#B85F43] font-bold font-mono mt-0.5">
                      Cost: {selectedReward.cost_points} PTS
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 bg-[#FFFDF8] p-3 rounded-lg border border-[#D6CCBC]">
                  <div className="flex justify-between text-[#6D685C]">
                    <span>Current Available Balance:</span>
                    <span className="text-[#292820] font-bold font-mono">{profile.points} pts</span>
                  </div>
                  <div className="flex justify-between text-[#6D685C]">
                    <span>Remaining Balance:</span>
                    <span className="text-[#777A53] font-bold font-mono">
                      {Math.max(0, profile.points - selectedReward.cost_points)} pts
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#B85F43] text-[#B85F43] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="btn-journal-secondary flex-1 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRedemption}
                    disabled={redeeming}
                    className="btn-journal-terracotta flex-1 py-2 text-xs font-bold disabled:opacity-50"
                  >
                    {redeeming ? 'Authorizing...' : 'Authorize Redemption'}
                  </button>
                </div>
              </div>
            )}
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#6D685C]">
          Retrieving Rewards Catalogue...
        </div>
      }
    >
      <RewardsContent />
    </Suspense>
  );
}
