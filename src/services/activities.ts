import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type Activity = Database['public']['Tables']['activities']['Row'];

/**
 * Service to fetch published adventure activities.
 */
export async function getPublishedActivities(
  supabase: SupabaseClient<Database>,
  category?: string
): Promise<Activity[]> {
  let query = supabase
    .from('activities')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load activities: ${error.message}`);
  }

  return data ?? [];
}
