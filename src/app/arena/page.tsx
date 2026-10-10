import React from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/services/leaderboard';
import {
  Trophy,
  Medal,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Flame,
  Award,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';

export default async function AdventureArenaPage() {
  const users = await getLeaderboard(30);
  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  const POINT_RULES = [
    {
      title: 'High-Altitude & Alpine Treks',
      points: '300 – 550 PTS',
      desc: 'Awarded for certified alpine trails, glacial passes, and mountain summits. Requires summit photo + GPS trail metadata.',
      tag: 'ALPINE',
    },
    {
      title: 'Whitewater & Marine Expeditions',
      points: '200 – 350 PTS',
      desc: 'Awarded for certified Grade III-V river runs, sea kayaking, and coral reef dives with certified outfitters.',
      tag: 'AQUATIC',
    },
    {
      title: 'Folklore & Mystery Enigmas',
      points: '150 – 300 PTS',
      desc: 'Awarded for daylight exploration of ancient archaeological sites, meteor craters, and historical enigmas.',
      tag: 'HERITAGE',
    },
    {
      title: 'Leave-No-Trace Verification',
      points: '+50 BONUS',
      desc: 'Automatic bonus awarded when photographic evidence confirms clean campsite departure and zero litter trail etiquette.',
      tag: 'ETHICS',
    },
  ];

  const BADGE_TIERS = [
    {
      title: 'Trail Apprentice',
      range: '0 – 499 PTS',
      desc: 'Initial field explorer rank for completing first verified expeditions.',
      icon: '🧭',
    },
    {
      title: 'Alpine Voyager',
      range: '500 – 1,499 PTS',
      desc: 'Accomplished multi-terrain hiker across diverse mountain terrains.',
      icon: '🏔️',
    },
    {
      title: 'Folklore Cartographer',
      range: '1,500 – 2,999 PTS',
      desc: 'Specialist investigator of ancient heritage ruins and regional folklore.',
      icon: '📜',
    },
    {
      title: 'Summit Veteran',
      range: '3,000+ PTS',
      desc: 'Elite adventure specialist with access to exclusive tactical gear rewards.',
      icon: '👑',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EAE1D3] border border-[#D6CCBC] text-[#777A53] text-xs font-mono font-bold">
          <Trophy className="w-3.5 h-3.5 text-[#B85F43]" />
          <span>AUTHORITATIVE ADVENTURE ARENA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#292820] font-sans">
          Adventure Arena & Points Ledger
        </h1>
        <p className="text-xs sm:text-sm text-[#6D685C] leading-relaxed">
          Points represent verified field accomplishments, authenticated through reviewer logs.
          Review rules, track your standing on the global ledger, and exchange earned points for
          tactical outfitter vouchers.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/submissions/new"
            className="btn-journal-primary text-xs flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Submit Verification Proof</span>
          </Link>
          <Link
            href="/rewards"
            className="btn-journal-terracotta text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redeem Rewards</span>
          </Link>
        </div>
      </div>

      {/* Point Rules Section */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D6CCBC] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#292820] font-sans">
              Transparent Point Criteria
            </h2>
            <p className="text-xs text-[#6D685C]">
              Point values are determined strictly by difficulty, environmental rigor, and verified safety adherence.
            </p>
          </div>
          <span className="retro-stamp text-[10px] self-start sm:self-auto">
            ETHICAL REWARD PROTOCOL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {POINT_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#777A53] bg-[#EAE1D3] px-2 py-0.5 rounded">
                    {rule.tag}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#B85F43]">
                    {rule.points}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#292820] mt-2 font-sans">{rule.title}</h3>
                <p className="text-xs text-[#6D685C] mt-1 leading-relaxed">{rule.desc}</p>
              </div>
              <div className="text-[10px] text-[#8E8675] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#777A53]" />
                <span>Admin Review Required</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety & Ethics Warning Box */}
        <div className="p-3.5 rounded-xl bg-[#EAE1D3]/70 border border-[#D6CCBC] flex items-start gap-3 text-xs text-[#6D685C]">
          <AlertTriangle className="w-4 h-4 text-[#B85F43] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#292820]">Safety Notice:</span> Points are never awarded
            for hazardous risk-taking, trespassing into restricted protected zones, or violating national
            park regulations. Submissions with safety violations will be rejected without appeal.
          </div>
        </div>
      </div>

      {/* Explorer Badges & Rank Tiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#292820] font-sans">
              Explorer Rank Tiers
            </h2>
            <p className="text-xs text-[#6D685C]">
              Progress through field qualifications based on total verified points.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGE_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="space-y-2">
                <div className="text-3xl">{tier.icon}</div>
                <h3 className="font-bold text-base text-[#292820] font-sans">{tier.title}</h3>
                <span className="inline-block text-[10px] font-mono font-bold text-[#B85F43] bg-[#F5F0E7] px-2 py-0.5 rounded border border-[#D6CCBC]">
                  {tier.range}
                </span>
                <p className="text-xs text-[#6D685C] leading-relaxed pt-1">{tier.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (Warm Minimal Retro Maximalism) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#292820] font-sans">
            Authoritative Explorer Standings
          </h2>
          <p className="text-xs text-[#6D685C]">
            Lifetime adventure points calculated from officially verified expeditions and summits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col items-center text-center shadow-xs relative">
              <div className="absolute top-4 left-4 font-mono font-bold text-sm text-[#6D685C]">
                #02
              </div>
              <div className="relative mb-3">
                <img
                  src={topThree[1].avatar_url}
                  alt={topThree[1].display_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D6CCBC]"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#EAE1D3] text-[#292820] border border-[#D6CCBC] p-1 rounded-full text-xs">
                  🥈
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#292820] font-sans">
                {topThree[1].display_name}
              </h3>
              <span className="text-xs text-[#6D685C] font-mono">@{topThree[1].username}</span>
              <div className="mt-2 text-[10px] font-mono font-bold text-[#777A53] bg-[#EAE1D3] px-2 py-0.5 rounded">
                {topThree[1].badge_title}
              </div>
              <div className="mt-3 text-xl font-extrabold text-[#292820] font-mono">
                {topThree[1].total_points.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#6D685C]">PTS</span>
              </div>
              <div className="text-[10px] text-[#8E8675] mt-1 font-mono">
                {topThree[1].completed_count} verified trails
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Editorial Elevated) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 p-7 rounded-2xl bg-[#FFFDF8] border-2 border-[#B85F43] flex flex-col items-center text-center shadow-sm relative md:-translate-y-2">
              <div className="absolute top-4 left-4 font-mono font-extrabold text-sm text-[#B85F43]">
                #01
              </div>
              <div className="relative mb-3">
                <img
                  src={topThree[0].avatar_url}
                  alt={topThree[0].display_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#B85F43]"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#B85F43] text-white p-1 rounded-full text-xs">
                  👑
                </span>
              </div>
              <h3 className="font-bold text-base text-[#292820] font-sans">
                {topThree[0].display_name}
              </h3>
              <span className="text-xs text-[#6D685C] font-mono">@{topThree[0].username}</span>
              <div className="mt-2 text-xs font-mono font-bold text-[#B85F43] bg-[#F5F0E7] px-3 py-0.5 rounded border border-[#D6CCBC]">
                {topThree[0].badge_title}
              </div>
              <div className="mt-3 text-2xl font-black text-[#B85F43] font-mono">
                {topThree[0].total_points.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#6D685C]">PTS</span>
              </div>
              <div className="text-xs text-[#777A53] mt-1 font-mono">
                {topThree[0].completed_count} verified trails
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="order-3 p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col items-center text-center shadow-xs relative">
              <div className="absolute top-4 left-4 font-mono font-bold text-sm text-[#6D685C]">
                #03
              </div>
              <div className="relative mb-3">
                <img
                  src={topThree[2].avatar_url}
                  alt={topThree[2].display_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D6CCBC]"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#EAE1D3] text-[#292820] border border-[#D6CCBC] p-1 rounded-full text-xs">
                  🥉
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#292820] font-sans">
                {topThree[2].display_name}
              </h3>
              <span className="text-xs text-[#6D685C] font-mono">@{topThree[2].username}</span>
              <div className="mt-2 text-[10px] font-mono font-bold text-[#777A53] bg-[#EAE1D3] px-2 py-0.5 rounded">
                {topThree[2].badge_title}
              </div>
              <div className="mt-3 text-xl font-extrabold text-[#292820] font-mono">
                {topThree[2].total_points.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#6D685C]">PTS</span>
              </div>
              <div className="text-[10px] text-[#8E8675] mt-1 font-mono">
                {topThree[2].completed_count} verified trails
              </div>
            </div>
          )}
        </div>

        {/* Global Standings Table */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-[#D6CCBC] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#292820] font-sans">Complete Ledger Ranking</h3>
            <span className="text-xs text-[#777A53] font-mono">Updated via Server Ledger</span>
          </div>

          <div className="divide-y divide-[#D6CCBC]">
            {restUsers.map((u) => (
              <div
                key={u.id}
                className={`p-3.5 sm:px-6 flex items-center justify-between transition-colors ${
                  u.id === 'u6'
                    ? 'bg-[#EAE1D3]/60 border-l-4 border-[#777A53]'
                    : 'hover:bg-[#F5F0E7]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono font-bold text-[#8E8675] w-6 text-center">
                    #{u.rank}
                  </span>
                  <img
                    src={u.avatar_url}
                    alt={u.display_name}
                    className="w-9 h-9 rounded-full object-cover border border-[#D6CCBC]"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#292820] flex items-center gap-2">
                      <span>{u.display_name}</span>
                      {u.id === 'u6' && (
                        <span className="text-[9px] font-mono font-bold bg-[#777A53] text-white px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6D685C]">
                      @{u.username} • {u.badge_title}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs sm:text-sm font-extrabold text-[#777A53] font-mono">
                    {u.total_points.toLocaleString()} PTS
                  </div>
                  <div className="text-[10px] text-[#8E8675] font-mono">
                    {u.completed_count} verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
