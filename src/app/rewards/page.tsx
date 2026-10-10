'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_REWARDS, SAMPLE_REDEMPTIONS, RewardItem, RedemptionItem } from '@/data/sampleData';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Ticket,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';

export default function RewardsPage() {
  const { profile, refreshProfile } = useAuth();

  const [rewards, setRewards] = useState<RewardItem[]>(SAMPLE_REWARDS);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>(SAMPLE_REDEMPTIONS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-claims'>('catalog');

  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successClaimCode, setSuccessClaimCode] = useState<string | null>(null);

  const handleRedeem = async (reward: RewardItem) => {
    setSelectedReward(reward);
    setErrorMsg('');
    setSuccessClaimCode(null);
  };

  const confirmRedemption = async () => {
    if (!selectedReward) return;

    if (profile.points < selectedReward.cost_points) {
      setErrorMsg(`Insufficient points. You need ${selectedReward.cost_points} pts, but have ${profile.points} pts.`);
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
        setSuccessClaimCode(data.claim_code);
        // Add to local redemptions
        const newClaim: RedemptionItem = {
          id: `red-${Date.now()}`,
          user_id: profile.id,
          reward_id: selectedReward.id,
          reward_name: selectedReward.name,
          points_spent: selectedReward.cost_points,
          status: 'fulfilled',
          claim_code: data.claim_code,
          created_at: new Date().toISOString(),
        };
        setRedemptions([newClaim, ...redemptions]);
        // Deduct points locally
        profile.points -= selectedReward.cost_points;
      }
    } catch (err: any) {
      setRedeeming(false);
      setErrorMsg(err.message || 'Network error during redemption');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-[#17261d] via-[#101e16] to-[#0a130e] border border-[#203a2b] shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
            <Gift className="w-4 h-4" />
            <span>Gamified Rewards Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Expedition Rewards Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            Redeem your verified accomplishment points for commemorative patches, tactical gear, field guides, and equipment vouchers.
          </p>
        </div>

        {/* User Balance Box */}
        <div className="bg-[#0b1410] px-6 py-4 rounded-2xl border border-[#1d3326] text-center shadow-inner shrink-0">
          <div className="text-xs text-zinc-400 font-semibold">Your Available Balance</div>
          <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1.5 mt-1">
            <Sparkles className="w-5 h-5 fill-amber-400" />
            <span>{profile.points.toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2f23] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'catalog'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-zinc-400 hover:text-white hover:bg-[#132219]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Available Rewards ({rewards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-claims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my-claims'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-zinc-400 hover:text-white hover:bg-[#132219]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Claimed Vouchers ({redemptions.length})</span>
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
                className="group flex flex-col rounded-3xl bg-[#101b15] border border-[#1f3529] hover:border-emerald-600 overflow-hidden shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={reward.image_url}
                    alt={reward.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-300 uppercase">
                    {reward.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-600 px-3 py-1 rounded-full text-xs font-black text-amber-400">
                    {reward.cost_points} pts
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#182a20] flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {reward.stock !== null ? `${reward.stock} in stock` : 'Unlimited Digital'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRedeem(reward)}
                      disabled={!inStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        !inStock
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          : 'bg-[#182920] hover:bg-[#20372b] text-amber-400/90 border border-amber-600/30'
                      }`}
                    >
                      {!inStock ? 'Out of Stock' : canAfford ? 'Redeem Now' : 'Need More Points'}
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
            <div className="p-12 rounded-3xl bg-[#101b15] border border-[#1f3529] text-center text-zinc-400">
              You have not redeemed any rewards yet. Summit trails to accumulate points!
            </div>
          ) : (
            redemptions.map((red) => (
              <div
                key={red.id}
                className="p-5 rounded-2xl bg-[#111c16] border border-[#1e3427] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{red.reward_name}</div>
                    <div className="text-xs text-zinc-400">
                      Redeemed for {red.points_spent} pts • {new Date(red.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#09120d] border border-[#1c3326] font-mono text-xs font-bold text-amber-400 flex items-center gap-2">
                    <span>{red.claim_code}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded">
                    {red.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation & Claim Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101c15] border border-[#213a2b] p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
            {successClaimCode ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Redemption Successful!
                </h3>
                <p className="text-xs text-zinc-300">
                  {selectedReward.cost_points} points deducted. Your voucher code is active:
                </p>
                <div className="p-3 rounded-2xl bg-[#08100b] border border-[#1b3123] font-mono text-base font-black text-amber-400 tracking-wider">
                  {successClaimCode}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReward(null)}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                  Confirm Reward Redemption
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#09120d] border border-[#1a2d21]">
                  <img
                    src={selectedReward.image_url}
                    alt={selectedReward.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-white truncate">
                      {selectedReward.name}
                    </div>
                    <div className="text-xs text-amber-400 font-bold mt-0.5">
                      Cost: {selectedReward.cost_points} points
                    </div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Current Balance:</span>
                    <span className="text-white font-bold">{profile.points} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance after redemption:</span>
                    <span className="text-emerald-400 font-bold">
                      {profile.points - selectedReward.cost_points} pts
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#142219] hover:bg-[#1a2d22] text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRedemption}
                    disabled={redeeming}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow disabled:opacity-50"
                  >
                    {redeeming ? 'Redeeming...' : 'Confirm'}
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
