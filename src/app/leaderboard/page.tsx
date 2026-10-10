import React from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/services/leaderboard';
import { Trophy, Medal, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

export default async function LeaderboardPage() {
  const users = await getLeaderboard(50);
  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/50 text-amber-300 text-xs font-bold shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Global Verified Point Ledger</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Adventurer Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Rankings are calculated strictly from verified database point-ledger transactions. Client-submitted scores are never trusted.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Silver Rank 2 */}
        {topThree[1] && (
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-[#111915] border border-[#23352b] flex flex-col items-center text-center shadow-xl relative">
            <div className="absolute top-4 left-4 text-2xl font-black text-zinc-400">#2</div>
            <div className="relative mb-4">
              <img
                src={topThree[1].avatar_url}
                alt={topThree[1].display_name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-zinc-400/50 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-zinc-700 text-white p-1 rounded-full text-xs">
                🥈
              </span>
            </div>
            <h3 className="font-bold text-base text-white">{topThree[1].display_name}</h3>
            <span className="text-xs text-zinc-400">@{topThree[1].username}</span>
            <div className="mt-2 text-xs font-bold text-zinc-300 bg-zinc-800/80 px-2.5 py-0.5 rounded-full">
              {topThree[1].badge_title}
            </div>
            <div className="mt-4 text-2xl font-black text-zinc-200">
              {topThree[1].total_points.toLocaleString()} <span className="text-xs font-normal text-zinc-400">pts</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {topThree[1].completed_count} verified expeditions
            </div>
          </div>
        )}

        {/* Gold Rank 1 (Elevated) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-[#1c2e22] via-[#122319] to-[#0d1812] border-2 border-amber-500/80 flex flex-col items-center text-center shadow-2xl relative md:-translate-y-3">
            <div className="absolute top-4 left-4 text-2xl font-black text-amber-400">#1</div>
            <div className="relative mb-4">
              <img
                src={topThree[0].avatar_url}
                alt={topThree[0].display_name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-amber-500 text-black p-1.5 rounded-full text-sm font-bold">
                👑
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-white">{topThree[0].display_name}</h3>
            <span className="text-xs text-amber-300/80">@{topThree[0].username}</span>
            <div className="mt-2 text-xs font-bold text-amber-300 bg-amber-950/90 border border-amber-700 px-3 py-0.5 rounded-full">
              {topThree[0].badge_title}
            </div>
            <div className="mt-4 text-3xl font-black text-amber-400">
              {topThree[0].total_points.toLocaleString()} <span className="text-xs font-normal text-zinc-300">pts</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {topThree[0].completed_count} verified expeditions
            </div>
          </div>
        )}

        {/* Bronze Rank 3 */}
        {topThree[2] && (
          <div className="order-3 p-6 rounded-3xl bg-[#111915] border border-[#23352b] flex flex-col items-center text-center shadow-xl relative">
            <div className="absolute top-4 left-4 text-2xl font-black text-amber-700">#3</div>
            <div className="relative mb-4">
              <img
                src={topThree[2].avatar_url}
                alt={topThree[2].display_name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-700/50 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-amber-800 text-white p-1 rounded-full text-xs">
                🥉
              </span>
            </div>
            <h3 className="font-bold text-base text-white">{topThree[2].display_name}</h3>
            <span className="text-xs text-zinc-400">@{topThree[2].username}</span>
            <div className="mt-2 text-xs font-bold text-amber-600 bg-amber-950/60 px-2.5 py-0.5 rounded-full">
              {topThree[2].badge_title}
            </div>
            <div className="mt-4 text-2xl font-black text-amber-600">
              {topThree[2].total_points.toLocaleString()} <span className="text-xs font-normal text-zinc-400">pts</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {topThree[2].completed_count} verified expeditions
            </div>
          </div>
        )}
      </div>

      {/* Full Ranked Table */}
      <div className="rounded-3xl bg-[#0f1813] border border-[#1d3126] overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-[#1b2d23] flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Full Global Standings</h2>
          <span className="text-xs text-zinc-400">Updated from Point Ledger</span>
        </div>

        <div className="divide-y divide-[#17271e]">
          {restUsers.map((u) => (
            <div
              key={u.id}
              className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                u.id === 'u6' ? 'bg-[#16271e]/70 border-l-4 border-emerald-500' : 'hover:bg-[#132019]'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-zinc-500 w-6 text-center">
                  #{u.rank}
                </span>
                <img
                  src={u.avatar_url}
                  alt={u.display_name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-600/40"
                />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{u.display_name}</span>
                    {u.id === 'u6' && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400">
                    @{u.username} • {u.badge_title}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-emerald-400">
                  {u.total_points.toLocaleString()} pts
                </div>
                <div className="text-[11px] text-zinc-500">
                  {u.completed_count} verified expeditions
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
