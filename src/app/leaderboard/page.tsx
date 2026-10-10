import React from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/services/leaderboard';
import { Trophy, ArrowLeft, Sparkles, Compass } from 'lucide-react';

export default async function LeaderboardPage() {
  const users = await getLeaderboard(50);
  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6CCBC] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-2.5 py-0.5 rounded border border-[#D6CCBC] mb-2">
            <Trophy className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>Official Explorer Standings</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#292820] font-sans">
            Authoritative Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6D685C] mt-1">
            Calculated from server-side point transactions. Client-supplied scores are never accepted.
          </p>
        </div>

        <Link
          href="/arena"
          className="btn-journal-primary text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Adventure Arena & Rules</span>
        </Link>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Silver Rank 2 */}
        {topThree[1] && (
          <div className="order-2 md:order-1 p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col items-center text-center shadow-xs relative">
            <div className="absolute top-4 left-4 font-mono font-bold text-sm text-[#6D685C]">#02</div>
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
            <h3 className="font-bold text-sm text-[#292820] font-sans">{topThree[1].display_name}</h3>
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

        {/* Gold Rank 1 (Elevated) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 p-7 rounded-2xl bg-[#FFFDF8] border-2 border-[#B85F43] flex flex-col items-center text-center shadow-sm relative md:-translate-y-2">
            <div className="absolute top-4 left-4 font-mono font-extrabold text-sm text-[#B85F43]">#01</div>
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
            <h3 className="font-bold text-base text-[#292820] font-sans">{topThree[0].display_name}</h3>
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

        {/* Bronze Rank 3 */}
        {topThree[2] && (
          <div className="order-3 p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col items-center text-center shadow-xs relative">
            <div className="absolute top-4 left-4 font-mono font-bold text-sm text-[#6D685C]">#03</div>
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
            <h3 className="font-bold text-sm text-[#292820] font-sans">{topThree[2].display_name}</h3>
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

      {/* Full Ranked Table */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#D6CCBC] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#292820] font-sans">Full Verified Standings</h2>
          <span className="text-xs text-[#777A53] font-mono">Ledger Verified</span>
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
                  {u.completed_count} verified trails
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
