import { createPublicClient } from '@/lib/supabase/server';
import { SAMPLE_ACTIVITIES, ActivityItem } from '@/data/sampleData';

/**
 * Service to fetch published adventure activities.
 * Gracefully integrates with Supabase DB; falls back to sample activities if database has not yet been seeded.
 */
export async function getPublishedActivities(params?: {
  category?: string;
  difficulty?: number;
  search?: string;
}): Promise<ActivityItem[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('activities')
      .select('*')
      .eq('is_published', true);

    if (params?.category) {
      query = query.eq('category', params.category);
    }
    if (params?.difficulty) {
      query = query.eq('difficulty', params.difficulty);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      // Map database rows to ActivityItem format
      let results: ActivityItem[] = data.map((row) => {
        const sampleMatch = SAMPLE_ACTIVITIES.find((s) => s.slug === row.slug || s.name === row.name);
        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          category: row.category as any,
          description: row.description,
          difficulty: row.difficulty,
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          base_points: row.base_points,
          estimated_cost: row.estimated_cost ? Number(row.estimated_cost) : null,
          requirements: row.requirements ?? [],
          safety_info: row.safety_info,
          is_published: row.is_published,
          image_url: sampleMatch?.image_url ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          location_name: sampleMatch?.location_name ?? 'Adventure Coordinate',
          duration_hours: sampleMatch?.duration_hours ?? 4,
        };
      });

      if (params?.search) {
        const q = params.search.toLowerCase();
        results = results.filter(
          (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
        );
      }
      return results;
    }
  } catch (err) {
    console.warn('Database query fallback to sample activities:', err);
  }

  // Graceful fallback to verified sample activities
  let filtered = [...SAMPLE_ACTIVITIES];
  if (params?.category) {
    filtered = filtered.filter((a) => a.category === params.category);
  }
  if (params?.difficulty) {
    filtered = filtered.filter((a) => a.difficulty === Number(params.difficulty));
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.location_name.toLowerCase().includes(q)
    );
  }
  return filtered;
}

/**
 * Service to fetch single activity by ID or slug.
 */
export async function getActivityById(idOrSlug: string): Promise<ActivityItem | null> {
  try {
    const supabase = createPublicClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const query = supabase.from('activities').select('*');
    const { data, error } = isUuid
      ? await query.eq('id', idOrSlug).single()
      : await query.eq('slug', idOrSlug).single();

    if (!error && data) {
      const sampleMatch = SAMPLE_ACTIVITIES.find((s) => s.slug === data.slug || s.name === data.name);
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category as any,
        description: data.description,
        difficulty: data.difficulty,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        base_points: data.base_points,
        estimated_cost: data.estimated_cost ? Number(data.estimated_cost) : null,
        requirements: data.requirements ?? [],
        safety_info: data.safety_info,
        is_published: data.is_published,
        image_url: sampleMatch?.image_url ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        location_name: sampleMatch?.location_name ?? 'Adventure Coordinate',
        duration_hours: sampleMatch?.duration_hours ?? 4,
      };
    }
  } catch (err) {
    console.warn('Database query fallback to sample activity by ID:', err);
  }

  const sample = SAMPLE_ACTIVITIES.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
  return sample ?? null;
}
