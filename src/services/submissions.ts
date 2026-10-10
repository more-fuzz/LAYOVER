import { createClient } from '@/lib/supabase/server';
import { SAMPLE_SUBMISSIONS, SAMPLE_ACTIVITIES, SubmissionItem } from '@/data/sampleData';

// In-memory demo submissions store for session demonstration
const demoSubmissions: SubmissionItem[] = [...SAMPLE_SUBMISSIONS];

export async function createSubmission(data: {
  userId: string;
  userDisplayName?: string;
  activityId: string;
  evidencePath: string;
  claimedLatitude?: number | null;
  claimedLongitude?: number | null;
}): Promise<{ id: string; status: string; is_demo?: boolean }> {
  const activity = SAMPLE_ACTIVITIES.find((a) => a.id === data.activityId);

  try {
    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();

    if (authUser.user) {
      const { data: row, error } = await supabase
        .from('submissions')
        .insert({
          user_id: authUser.user.id,
          activity_id: data.activityId,
          evidence_path: data.evidencePath,
          claimed_latitude: data.claimedLatitude ?? null,
          claimed_longitude: data.claimedLongitude ?? null,
          status: 'pending',
        })
        .select('id, status')
        .single();

      if (!error && row) {
        return { id: row.id, status: row.status };
      }
    }
  } catch (err) {
    console.warn('Supabase submission insert fallback:', err);
  }

  // Demo store fallback for prototype demonstrations
  const newId = `sub-${Date.now().toString(36)}`;
  const newSubmission: SubmissionItem = {
    id: newId,
    user_id: data.userId,
    user_display_name: data.userDisplayName || 'Traveler',
    activity_id: data.activityId,
    activity_name: activity?.name || 'Adventure Expedition',
    activity_category: activity?.category || 'hiking',
    points: activity?.base_points || 200,
    evidence_path: data.evidencePath,
    evidence_url: data.evidencePath.startsWith('http')
      ? data.evidencePath
      : 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: data.claimedLatitude ?? null,
    claimed_longitude: data.claimedLongitude ?? null,
    status: 'pending',
    submitted_at: new Date().toISOString(),
  };

  demoSubmissions.unshift(newSubmission);
  return { id: newId, status: 'pending', is_demo: true };
}

export async function getUserSubmissions(userId: string): Promise<SubmissionItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('submissions')
      .select('*, activities(name, category, base_points)')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        user_display_name: 'You',
        activity_id: row.activity_id,
        activity_name: row.activities?.name || 'Adventure Expedition',
        activity_category: row.activities?.category || 'hiking',
        points: row.activities?.base_points || 200,
        evidence_path: row.evidence_path,
        evidence_url: row.evidence_path.startsWith('http')
          ? row.evidence_path
          : 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
        claimed_latitude: row.claimed_latitude ? Number(row.claimed_latitude) : null,
        claimed_longitude: row.claimed_longitude ? Number(row.claimed_longitude) : null,
        status: row.status,
        reviewer_id: row.reviewer_id,
        review_notes: row.review_notes,
        submitted_at: row.submitted_at,
        reviewed_at: row.reviewed_at,
      }));
    }
  } catch (err) {
    console.warn('Fallback getting user submissions:', err);
  }

  return demoSubmissions.filter((s) => s.user_id === userId || s.user_id === 'u6');
}

export async function getAllSubmissions(status?: string): Promise<SubmissionItem[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('submissions')
      .select('*, activities(name, category, base_points), profiles(display_name)')
      .order('submitted_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        user_display_name: row.profiles?.display_name || 'Traveler',
        activity_id: row.activity_id,
        activity_name: row.activities?.name || 'Adventure Expedition',
        activity_category: row.activities?.category || 'hiking',
        points: row.activities?.base_points || 200,
        evidence_path: row.evidence_path,
        evidence_url: row.evidence_path.startsWith('http')
          ? row.evidence_path
          : 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
        claimed_latitude: row.claimed_latitude ? Number(row.claimed_latitude) : null,
        claimed_longitude: row.claimed_longitude ? Number(row.claimed_longitude) : null,
        status: row.status,
        reviewer_id: row.reviewer_id,
        review_notes: row.review_notes,
        submitted_at: row.submitted_at,
        reviewed_at: row.reviewed_at,
      }));
    }
  } catch (err) {
    console.warn('Fallback getting all submissions:', err);
  }

  if (status) {
    return demoSubmissions.filter((s) => s.status === status);
  }
  return demoSubmissions;
}

export async function reviewSubmission(
  submissionId: string,
  reviewerId: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data: sub, error: subErr } = await supabase
      .from('submissions')
      .update({
        status,
        reviewer_id: reviewerId,
        reviewed_at: now,
        review_notes: notes || null,
      })
      .eq('id', submissionId)
      .select('*, activities(base_points, name)')
      .single();

    if (!subErr && sub) {
      // If approved, insert point ledger award
      if (status === 'approved') {
        const points = (sub as any).activities?.base_points || 200;
        await supabase.from('point_ledger').insert({
          user_id: sub.user_id,
          submission_id: sub.id,
          reason: `Verified completion of ${(sub as any).activities?.name || 'Adventure'}`,
          points_delta: points,
        });
      }
      return { success: true };
    }
  } catch (err: any) {
    console.warn('Supabase submission review fallback:', err);
  }

  // Fallback to local demo store
  const found = demoSubmissions.find((s) => s.id === submissionId);
  if (found) {
    found.status = status;
    found.reviewer_id = reviewerId;
    found.review_notes = notes || null;
    found.reviewed_at = new Date().toISOString();
    return { success: true };
  }

  return { success: false, error: 'Submission not found' };
}
