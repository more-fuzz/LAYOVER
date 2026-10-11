'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/ui/api';
import { adaptLeaderboardUser, UILeaderboardUser } from '@/lib/ui/adapters';
import { StatTile } from '@/components/ui/StatTile';
import { StampBadge } from '@/components/ui/StampBadge';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import { ErrorState } from '@/components/ui/EmptyState';

export function ArenaView() {
  const { profile } = useAuth();

  const [leaderboard, setLeaderboard] = useState<UILeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.get<any[]>('/api/leaderboard');
      if (res.ok && Array.isArray(res.data)) {
        setLeaderboard(res.data.map(adaptLeaderboardUser));
        // Check if sample fallback data
        if (res.data.some((u: any) => u.username === 'elena_rostova' || u.is_demo)) {
          setIsDemoData(true);
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("We can't reach the leaderboard right now. Check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-10 page-rise">
      {/* 1. Header with Total Earned vs Redeemable Now */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                EXPEDITION STANDINGS
              </span>
              {isDemoData && <DemoBadge />}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--ink,#0F1F1A)] mt-1">
              Adventure <span className="font-serif-accent text-[var(--flame,#FF5A1F)]">Arena.</span>
            </h1>
            <p className="text-xs text-[var(--muted,#5E675F)] mt-1">
              Total earned decides your rank. Spending points never lowers it.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              href="/rewards"
              className="btn-field btn-citron text-xs font-bold"
            >
              Browse Rewards Catalogue &rarr;
            </Link>
          </div>
        </div>

        {/* Stat strip: Total earned next to Redeemable now */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatTile
            label="TOTAL EARNED"
            value={profile?.total_earned_points ?? profile?.points ?? 0}
            unit="PTS"
            variant="ink"
            description="Lifetime verified points deciding your ladder rank."
          />
          <StatTile
            label="REDEEMABLE NOW"
            value={profile?.points ?? 0}
            unit="PTS"
            variant="citron"
            description="Available points for outfitter gear and partner coupons."
          />
          {typeof profile?.rank === 'number' && (
            <StatTile
              label="YOUR STANDING"
              value={`#${profile.rank}`}
              variant="default"
              description="Global standing among certified trail explorers."
            />
          )}
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <ErrorState
          title="Standings unavailable"
          message={errorMessage}
          onRetry={loadLeaderboard}
        />
      )}

      {/* Loading state */}
      {isLoading && !errorMessage && (
        <div className="py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
          Calibrating verified explorer standings...
        </div>
      )}

      {/* 2. Leaderboard Table */}
      {!isLoading && !errorMessage && leaderboard.length > 0 && (
        <div className="card-field overflow-hidden shadow-lg border-[1.5px] border-[var(--ink,#0F1F1A)]">
          <div className="p-4 md:p-6 border-b border-[var(--line,#D8CBB0)] flex items-center justify-between bg-[var(--sand,#EADFC8)]/40">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)]">
                Authoritative Leaderboard
              </h2>
              <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                Ranked by lifetime earned points from verified accomplishments.
              </span>
            </div>
            {isDemoData && <DemoBadge />}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line,#D8CBB0)] bg-[var(--sand,#EADFC8)]/20 font-mono-label text-[10px] text-[var(--muted,#5E675F)] uppercase">
                  <th scope="col" className="py-3 px-4 w-16">Rank</th>
                  <th scope="col" className="py-3 px-4">Explorer</th>
                  <th scope="col" className="py-3 px-4 text-center">Verified Expeditions</th>
                  <th scope="col" className="py-3 px-4 text-right">Lifetime Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line,#D8CBB0)]/40 text-xs font-medium">
                {leaderboard.map((user, idx) => {
                  const rankNumber = user.rank || idx + 1;
                  const isCurrentUser =
                    profile?.id === user.id ||
                    profile?.username === user.username ||
                    (user.username === 'alex_mercer' && profile?.username === 'alex_mercer');

                  return (
                    <tr
                      key={user.id || user.username}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-[var(--citron,#D8F23C)]/25 font-bold'
                          : 'hover:bg-[var(--sand,#EADFC8)]/30'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 font-mono-label text-xs tabular-nums">
                        {rankNumber <= 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--ink,#0F1F1A)] text-[var(--citron,#D8F23C)] font-bold text-[10px]">
                            {rankNumber}
                          </span>
                        ) : (
                          <span className="text-[var(--muted,#5E675F)]">#{rankNumber}</span>
                        )}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-[var(--line,#D8CBB0)]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[var(--sand,#EADFC8)] flex items-center justify-center font-bold text-[10px]">
                              {user.displayName.charAt(0)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)] truncate">
                                {user.displayName}
                              </span>
                              {isCurrentUser && (
                                <span className="font-mono-label text-[9px] px-1.5 py-0.5 rounded bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border border-[var(--ink,#0F1F1A)] font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)]">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Verified Count */}
                      <td className="py-3.5 px-4 text-center font-mono-label tabular-nums text-[var(--ink,#0F1F1A)]">
                        {user.completedCount}
                      </td>

                      {/* Total Points */}
                      <td className="py-3.5 px-4 text-right font-display font-bold text-sm tabular-nums text-[var(--ink,#0F1F1A)]">
                        {user.totalPoints.toLocaleString()} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
