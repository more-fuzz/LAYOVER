'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import { RedemptionItem, SAMPLE_REDEMPTIONS } from '@/data/sampleData';
import {
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Ticket,
  AlertTriangle,
  Clock,
  Compass,
} from 'lucide-react';

export default function CouponRedemptionPage() {
  const params = useParams();
  const router = useRouter();
  const redemptionId = params?.id as string;

  const [redemption, setRedemption] = useState<RedemptionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    async function loadRedemption() {
      if (!redemptionId) return;
      try {
        const res = await fetch(`/api/rewards/redemptions/${redemptionId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setRedemption(json.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API redemption load failed, fallback to sample cache', err);
      }

      // Fallback lookup from sample redemptions
      const found = SAMPLE_REDEMPTIONS.find(
        (r) => r.id === redemptionId || r.claim_code === redemptionId
      );
      if (found) {
        setRedemption(found);
      }
      setLoading(false);
    }

    loadRedemption();
  }, [redemptionId]);

  const handleCopyCode = async () => {
    if (!redemption?.claim_code) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(redemption.claim_code);
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 3000);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      // Graceful fallback for environments blocking navigator.clipboard
      setCopyError(true);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block p-4 border border-[#D6CCBC] bg-[#FFFDF8] rounded-xl shadow-sm text-sm font-medium text-[#6D685C]">
          Retrieving Expedition Voucher Archives...
        </div>
      </div>
    );
  }

  if (!redemption) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-block p-6 border border-[#D6CCBC] bg-[#FFFDF8] rounded-2xl max-w-md mx-auto">
          <Ticket className="w-8 h-8 text-[#B85F43] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#292820] font-sans">Voucher Record Not Found</h2>
          <p className="text-xs text-[#6D685C] mt-2 leading-relaxed">
            The requested redemption ID could not be located in your authenticated trail archives.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/rewards"
              className="btn-journal-primary text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Rewards</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const instructions =
    redemption.usage_instructions || [
      'Copy your unique expedition coupon code shown in the voucher certificate below.',
      `Visit the certified ${redemption.merchant_name || 'Trails & Tales Outfitter Depot'} portal.`,
      'Add the eligible expedition gear or pass to your checkout kit.',
      'Paste this promotional coupon into the Outfitter Voucher input field at checkout.',
      'Confirm the full discount is applied to your order before finalizing delivery.',
    ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-4">
        <Link
          href="/rewards"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D685C] hover:text-[#292820] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rewards Catalogue</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="retro-stamp text-[10px]">VERIFIED DISPATCH</span>
          <span className="text-xs font-mono text-[#777A53] font-bold">
            REF #{redemption.id.substring(0, 10).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Hero Certificate Card */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative stamp */}
        <div className="absolute top-4 right-4 hidden sm:block border-2 border-dashed border-[#B85F43]/40 rounded-lg p-2 transform rotate-2 pointer-events-none select-none text-center">
          <div className="text-[9px] font-mono tracking-widest text-[#B85F43] font-bold uppercase">
            CERTIFIED VOUCHER
          </div>
          <div className="text-[8px] font-mono text-[#6D685C]">EXPEDITION ARCHIVE</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Reward Visual */}
          <div className="md:col-span-5 space-y-3">
            <div className="rounded-xl overflow-hidden border border-[#D6CCBC] shadow-sm">
              <SafeImage
                src={redemption.reward_image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'}
                alt={redemption.reward_name}
                aspectRatio="4/3"
                fallbackTitle={redemption.reward_name}
              />
            </div>
            <div className="p-3 bg-[#EAE1D3]/50 rounded-lg border border-[#D6CCBC] text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6D685C]">
                Official Provider / Depot
              </div>
              <div className="text-xs font-bold text-[#292820] mt-0.5">
                {redemption.merchant_name || 'Trails & Tales Outfitter Depot'}
              </div>
            </div>
          </div>

          {/* Reward Details & Code Box */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAE1D3] text-[#777A53] text-[11px] font-bold tracking-wider uppercase mb-2 font-mono">
                <Sparkles className="w-3 h-3 text-[#B85F43]" />
                <span>Points Redeemed: {redemption.points_spent} PTS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#292820] leading-tight font-sans">
                {redemption.reward_name}
              </h1>
              {redemption.reward_description && (
                <p className="text-xs sm:text-sm text-[#6D685C] mt-2 leading-relaxed">
                  {redemption.reward_description}
                </p>
              )}
            </div>

            {/* Monospace Coupon Code & Functional Copy Action */}
            <div className="p-4 bg-[#F5F0E7] border-2 border-[#D6CCBC] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6D685C]">
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Claim Code / Authorization Key:
                </span>
                <span className="text-[11px] font-mono text-[#777A53] font-bold">
                  Status: {redemption.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-[#FFFDF8] border border-[#BDB19C] rounded-lg px-4 py-2.5 font-mono text-base font-extrabold text-[#B85F43] tracking-wider select-all text-center sm:text-left">
                  {redemption.claim_code}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="btn-journal-primary text-xs flex items-center justify-center gap-1.5 py-2.5 px-4 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>{copyError ? 'Select & Copy Code' : 'Code Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#8E8675] italic">
                * Click &apos;Copy Code&apos; to store to clipboard, or highlight the code box directly.
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg border border-[#D6CCBC] bg-[#FFFDF8]">
                <div className="text-[10px] text-[#6D685C] uppercase font-mono">Issued On</div>
                <div className="font-bold text-[#292820] mt-0.5">
                  {new Date(redemption.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-[#D6CCBC] bg-[#FFFDF8]">
                <div className="text-[10px] text-[#6D685C] uppercase font-mono">Fulfillment</div>
                <div className="font-bold text-[#777A53] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Single-Use</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Redemption Instructions */}
      <div className="bg-[#FFFDF8] border border-[#D6CCBC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#D6CCBC] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#292820] font-sans">
              How to Claim & Redeem Your Item
            </h2>
            <p className="text-xs text-[#6D685C] mt-0.5">
              Follow these official verification instructions to receive your gear or pass.
            </p>
          </div>
          <Compass className="w-5 h-5 text-[#777A53] hidden sm:block" />
        </div>

        <ol className="space-y-4">
          {instructions.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-[#292820]">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#EAE1D3] text-[#777A53] font-mono font-bold text-xs shrink-0 border border-[#D6CCBC]">
                {idx + 1}
              </span>
              <div className="pt-0.5 leading-relaxed">{step}</div>
            </li>
          ))}
        </ol>

        {/* Action Row */}
        <div className="pt-4 border-t border-[#D6CCBC] flex flex-col sm:flex-row items-center justify-between gap-4">
          {redemption.merchant_url ? (
            <a
              href={redemption.merchant_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-journal-terracotta text-xs w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5"
            >
              <span>Continue to {redemption.merchant_name || 'Merchant Outfitter'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div className="text-xs text-[#6D685C] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#777A53]" />
              <span>Present this voucher in-person or at check-in station.</span>
            </div>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              href="/rewards?tab=my-claims"
              className="btn-journal-secondary text-xs text-center w-full sm:w-auto"
            >
              View Redemption History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
