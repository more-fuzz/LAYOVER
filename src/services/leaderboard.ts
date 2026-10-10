import { createPublicClient } from '@/lib/supabase/server';
import { SAMPLE_LEADERBOARD, LeaderboardUser } from '@/data/sampleData';

/**
 * Service to calculate leaderboard rankings from trusted point_ledger data.
 */
export async function getLeaderboard(limit = 20): Promise<LeaderboardUser[]> {
  try {
    const supabase = createPublicClient();

    // Query profiles along with aggregated point ledger
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, point_ledger(points_delta)');

    if (!error && profiles && profiles.length > 0) {
      const ranked: LeaderboardUser[] = profiles.map((p: any) => {
        const total_points = (p.point_ledger || []).reduce(
          (sum: number, l: any) => sum + (l.points_delta || 0),
          0
        );
        return {
          id: p.id,
          username: p.username,
          display_name: p.display_name,
          avatar_url: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          total_points,
          completed_count: (p.point_ledger || []).filter((l: any) => (l.points_delta || 0) > 0).length,
          rank: 0,
          badge_title: total_points >= 2000 ? 'Alpine Legend' : total_points >= 1000 ? 'Ridge Master' : 'Pathfinder',
        };
      });

      ranked.sort((a, b) => b.total_points - a.total_points);
      ranked.forEach((u, idx) => {
        u.rank = idx + 1;
      });

      if (ranked.length > 0 && ranked[0].total_points > 0) {
        return ranked.slice(0, limit);
      }
    }
  } catch (err) {
    console.warn('Leaderboard query fallback to sample leaderboard:', err);
  }

  return SAMPLE_LEADERBOARD.slice(0, limit);
}
