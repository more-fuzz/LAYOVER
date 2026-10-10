import { getUserSubmissions } from './submissions';
import { SAMPLE_ACTIVITIES } from '@/data/sampleData';

export interface MemoirItem {
  id: string;
  activity_id: string;
  activity_name: string;
  category: string;
  completed_at: string;
  points_earned: number;
  latitude: number;
  longitude: number;
  evidence_url: string;
  notes?: string | null;
  location_name: string;
  badge_awarded?: string;
}

export async function getUserMemoir(userId: string): Promise<{
  total_expeditions: number;
  total_points: number;
  badges: string[];
  entries: MemoirItem[];
}> {
  const submissions = await getUserSubmissions(userId);
  const approved = submissions.filter((s) => s.status === 'approved');

  const entries: MemoirItem[] = approved.map((sub) => {
    const act = SAMPLE_ACTIVITIES.find((a) => a.id === sub.activity_id);
    return {
      id: sub.id,
      activity_id: sub.activity_id,
      activity_name: sub.activity_name,
      category: sub.activity_category,
      completed_at: sub.reviewed_at || sub.submitted_at,
      points_earned: sub.points,
      latitude: sub.claimed_latitude || act?.latitude || 46.5,
      longitude: sub.claimed_longitude || act?.longitude || 8.0,
      evidence_url: sub.evidence_url,
      notes: sub.review_notes,
      location_name: act?.location_name || 'Alpine Coordinates',
      badge_awarded: act?.category === 'mountaineering' ? 'High Altitude Pioneer' : act?.category === 'diving' ? 'Deep Blue Explorer' : 'Wilderness Trailblazer',
    };
  });

  const totalPoints = entries.reduce((acc, curr) => acc + curr.points_earned, 0);

  const badges = [
    'Trail Pathfinder',
    ...(totalPoints >= 300 ? ['Alpine Pioneer'] : []),
    ...(entries.some((e) => e.category === 'diving') ? ['Deep Blue Diver'] : []),
    ...(entries.some((e) => e.category === 'climbing') ? ['Vertical Ascender'] : []),
  ];

  return {
    total_expeditions: entries.length,
    total_points: totalPoints,
    badges,
    entries,
  };
}
