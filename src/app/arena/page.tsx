import React from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/services/leaderboard';
import {
  Trophy,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  FileCheck2,
  Award,
} from 'lucide-react';

export default async function AdventureArenaPage() {
  const users = await getLeaderboard(30);
  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  // Exact milestone progression requested in master prompt
  const MILESTONE_TITLES = [
    {
      title: 'Trail Starter',
      range: '0 – 499 PTS',
      desc: 'First recorded summits, coastal explorations, or trail completions.',
      icon: '🧭',
      completed: true,
    },
    {
      title: 'Path Finder',
      range: '500 – 1,499 PTS',
      desc: 'Accomplished navigation across multiple verified terrains.',
      icon: '⛰️',
      completed: true,
    },
    {
      title: 'Route Collector',
      range: '1,500 – 2,999 PTS',
      desc: 'Regular explorer with verified whitewater, caves, or high-altitude passes.',
      icon: '🗺️',
      completed: true,
    },
    {
      title: 'Expedition Regular',
      range: '3,000 – 4,999 PTS',
      desc: 'Consistent field expeditioner with advanced terrain accomplishments.',
      icon: '🦅',
      completed: false,
    },
    {
      title: 'Field Legend',
      range: '5,000+ PTS',
      desc: 'Master wilderness explorer certified across demanding global summits.',
      icon: '👑',
      completed: false,
    },
  ];

  const POINT_RULES = [
    {
      title: 'Alpine & High-Altitude Summits',
      points: '300 – 550 PTS',
      desc: 'Certified glacial passes, high moraines, and mountain peaks with summit photo & GPS evidence.',
      tag: 'ALPINE',
    },
    {
      title: 'Whitewater & Marine Expeditions',
      points: '200 – 350 PTS',
      desc: 'Class III-V whitewater river runs, sea kayaking, and coral dives with certified outfitters.',
      tag: 'AQUATIC',
    },
    {
      title: 'Folklore & Heritage Enigmas',
      points: '150 – 300 PTS',
      desc: 'Daylight exploration of ancient archaeological citadels, craters, and historical legends.',
      tag: 'HERITAGE',
    },
    {
      title: 'Leave-No-Trace Trail Bonus',
      points: '+50 BONUS',
      desc: 'Awarded when photographic proof confirms clean campsite departure and zero trail litter.',
      tag: 'ETHICS',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-12">
      {/* 1. Header Banner & Point Model Explanation */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EAE1D3] border border-[#D6CCBC] text-[#777A53] text-xs font-mono font-bold">
          <Trophy className="w-3.5 h-3.5 text-[#B85F43]" />
          <span>EXPEDITION STANDINGS & POINT RECORD</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-[#292820] font-sans">
          The Expedition Board
        </h1>

        <p className="text-xs sm:text-sm text-[#6D685C] leading-relaxed max-w-2xl mx-auto">
          A dynamic record of verified expeditions, milestones, and community progress. Point totals
          are calculated directly from officially verified summit and trail completions.
        </p>

        {/* Clear Distinction: Total Earned vs Redeemable Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2 text-left">
          <div className="p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#777A53]">
                LIFETIME ACHIEVEMENTS
              </span>
              <Award className="w-4 h-4 text-[#777A53]" />
            </div>
            <div className="text-base font-bold text-[#292820] font-sans mt-1">
              Total Earned Points
            </div>
            <p className="text-xs text-[#6D685C] mt-1 leading-relaxed">
              Represents cumulative achievement over time. Your competitive rank on this board is permanent
              and never drops when you spend points.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#C6A45B]/60 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#C6A45B]">
                SPENDABLE BALANCE
              </span>
              <Sparkles className="w-4 h-4 text-[#C6A45B]" />
            </div>
            <div className="text-base font-bold text-[#292820] font-sans mt-1">
              Redeemable Points
            </div>
            <p className="text-xs text-[#6D685C] mt-1 leading-relaxed">
              Represents the balance currently available to exchange for authentic outfitter vouchers
              and gear badges in the Rewards store.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/submissions/new"
            className="btn-journal-primary text-xs flex items-center gap-1.5 py-2 px-4"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Submit Verification Proof</span>
          </Link>
          <Link
            href="/rewards"
            className="btn-journal-terracotta text-xs flex items-center gap-1.5 py-2 px-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Rewards Store</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Three Podium (Compact & Restrained) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#292820] font-sans">
            Top Expedition Leaders
          </h2>
          <p className="text-xs text-[#6D685C]">
            Verified trail counts and cumulative earned points across all expeditions.
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
                {topThree[1].completed_count} verified expeditions
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
                {topThree[0].completed_count} verified expeditions
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
                {topThree[2].completed_count} verified expeditions
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Full Expedition Board Ranking */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#D6CCBC] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#292820] font-sans">Complete Expedition Ranking</h3>
            <p className="text-[11px] text-[#6D685C]">
              Rankings determined by total verified points. Tie-breaks determined by completed expeditions.
            </p>
          </div>
          <span className="text-xs text-[#777A53] font-mono font-bold">Official Record</span>
        </div>

        <div className="divide-y divide-[#D6CCBC]">
          {restUsers.map((u) => {
            const isCurrentUser = u.id === 'u6';
            return (
              <div
                key={u.id}
                className={`p-3.5 sm:px-6 flex items-center justify-between transition-colors ${
                  isCurrentUser
                    ? 'bg-[#C6A45B]/15 border-l-4 border-[#C6A45B]'
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
                      {isCurrentUser && (
                        <span className="text-[9px] font-mono font-bold bg-[#C6A45B] text-[#292820] px-1.5 py-0.5 rounded">
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
                  <div className="text-xs sm:text-sm font-extrabold text-[#292820] font-mono">
                    {u.total_points.toLocaleString()} PTS
                  </div>
                  <div className="text-[10px] text-[#777A53] font-mono">
                    {u.completed_count} verified
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Milestones & Expedition Titles Section (With Handwritten Accent) */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D6CCBC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#292820] font-sans">
                Milestone Ranks & Title Progression
              </h2>
              {/* Handwritten Accent */}
              <span className="font-handwritten text-lg text-[#B85F43] -rotate-3 select-none hidden sm:inline">
                you made it! ~
              </span>
            </div>
            <p className="text-xs text-[#6D685C] mt-0.5">
              Advance your explorer title by completing certified trailheads and verified summit ascents.
            </p>
          </div>
          <span className="retro-stamp text-[10px] self-start sm:self-auto">
            CERTIFIED RANKS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MILESTONE_TITLES.map((mile, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                mile.completed
                  ? 'bg-[#EAE1D3]/50 border-[#777A53]'
                  : 'bg-[#F5F0E7] border-[#D6CCBC] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{mile.icon}</span>
                  {mile.completed && (
                    <span className="text-[9px] font-mono font-bold text-[#777A53] bg-[#EAE1D3] px-1.5 py-0.5 rounded border border-[#777A53]">
                      EARNED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-[#292820] font-sans mt-2">{mile.title}</h3>
                <div className="text-[11px] font-mono text-[#B85F43] font-bold mt-0.5">
                  {mile.range}
                </div>
                <p className="text-[11px] text-[#6D685C] mt-1.5 leading-relaxed">{mile.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Point Scoring Rules */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="border-b border-[#D6CCBC] pb-3">
          <h2 className="text-lg font-bold text-[#292820] font-sans">
            How Expedition Points Are Awarded
          </h2>
          <p className="text-xs text-[#6D685C]">
            Point values are determined strictly by difficulty, environmental rigor, and verified safety adherence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POINT_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] flex flex-col justify-between space-y-2"
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
                <h3 className="font-bold text-xs text-[#292820] font-sans mt-2">{rule.title}</h3>
                <p className="text-[11px] text-[#6D685C] mt-1 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
