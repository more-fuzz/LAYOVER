import { createClient } from '@/lib/supabase/server';
import { SAMPLE_REWARDS, SAMPLE_REDEMPTIONS, RewardItem, RedemptionItem } from '@/data/sampleData';

const demoRedemptions: RedemptionItem[] = [...SAMPLE_REDEMPTIONS];

export async function getActiveRewards(): Promise<RewardItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true);

    if (!error && data && data.length > 0) {
      return data.map((r) => {
        const sampleMatch = SAMPLE_REWARDS.find((s) => s.id === r.id || s.name === r.name);
        return {
          id: r.id,
          name: r.name,
          description: r.description,
          cost_points: r.cost_points,
          stock: r.stock,
          is_active: r.is_active,
          image_url: sampleMatch?.image_url ?? 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          category: sampleMatch?.category ?? 'gear',
        };
      });
    }
  } catch (err) {
    console.warn('Rewards query fallback to sample rewards:', err);
  }

  return SAMPLE_REWARDS;
}

export async function getUserRedemptions(userId: string): Promise<RedemptionItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('redemptions')
      .select('*, rewards(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        reward_id: r.reward_id,
        reward_name: r.rewards?.name || 'Adventure Reward',
        points_spent: r.points_spent,
        status: r.status,
        claim_code: `TT-CLAIM-${r.id.substring(0, 8).toUpperCase()}`,
        created_at: r.created_at,
      }));
    }
  } catch (err) {
    console.warn('Redemptions query fallback:', err);
  }

  return demoRedemptions.filter((r) => r.user_id === userId || r.user_id === 'u6');
}

export async function redeemReward(
  userId: string,
  rewardId: string
): Promise<{ success: boolean; error?: string; claim_code?: string }> {
  try {
    const supabase = await createClient();

    // 1. Fetch reward
    const { data: reward, error: rErr } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (!rErr && reward) {
      if (reward.stock !== null && reward.stock <= 0) {
        return { success: false, error: 'This reward is currently out of stock.' };
      }

      // 2. Check balance
      const { data: ledger } = await supabase
        .from('point_ledger')
        .select('points_delta')
        .eq('user_id', userId);

      const currentBalance = (ledger || []).reduce((sum, entry) => sum + entry.points_delta, 0);
      if (currentBalance < reward.cost_points) {
        return {
          success: false,
          error: `Insufficient points. You have ${currentBalance} pts, but this reward costs ${reward.cost_points} pts.`,
        };
      }

      // 3. Insert negative point deduction
      await supabase.from('point_ledger').insert({
        user_id: userId,
        reason: `Redeemed: ${reward.name}`,
        points_delta: -reward.cost_points,
      });

      // 4. Record redemption
      const { data: redemption } = await supabase
        .from('redemptions')
        .insert({
          user_id: userId,
          reward_id: reward.id,
          points_spent: reward.cost_points,
          status: 'pending',
        })
        .select('id')
        .single();

      // 5. Decrement stock if finite
      if (reward.stock !== null) {
        await supabase
          .from('rewards')
          .update({ stock: reward.stock - 1 })
          .eq('id', reward.id);
      }

      const code = `TT-CLAIM-${(redemption?.id || reward.id).substring(0, 8).toUpperCase()}`;
      return { success: true, claim_code: code };
    }
  } catch (err: any) {
    console.warn('Supabase redemption error, using demo fallback:', err);
  }

  // Demo fallback
  const reward = SAMPLE_REWARDS.find((r) => r.id === rewardId);
  if (!reward) {
    return { success: false, error: 'Reward not found.' };
  }

  const claimCode = `TT-CLAIM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  demoRedemptions.unshift({
    id: `red-${Date.now()}`,
    user_id: userId,
    reward_id: reward.id,
    reward_name: reward.name,
    points_spent: reward.cost_points,
    status: 'fulfilled',
    claim_code: claimCode,
    created_at: new Date().toISOString(),
  });

  return { success: true, claim_code: claimCode };
}
