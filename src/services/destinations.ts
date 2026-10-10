import { createPublicClient } from '@/lib/supabase/server';
import { SAMPLE_DESTINATIONS, DestinationItem } from '@/data/sampleData';

/**
 * Service to fetch published adventure & mysterious destinations.
 * Gracefully integrates with Supabase DB; falls back to sample destinations if database has not yet been seeded.
 */
export async function getPublishedDestinations(params?: {
  category?: string;
  search?: string;
  spookyOnly?: boolean;
}): Promise<DestinationItem[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('destinations')
      .select('*')
      .eq('is_published', true);

    if (params?.category) {
      query = query.eq('category', params.category);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let results: DestinationItem[] = data.map((row) => {
        const sampleMatch = SAMPLE_DESTINATIONS.find((s) => s.name === row.name || s.id === row.id);
        return {
          id: row.id,
          name: row.name,
          category: row.category as any,
          description: row.description,
          historical_context: row.historical_context,
          source_url: row.source_url,
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          access_notes: row.access_notes,
          is_published: row.is_published,
          is_spooky: sampleMatch?.is_spooky ?? (row.category === 'mystery_trail' || row.category === 'abandoned'),
          spooky_rating: sampleMatch?.spooky_rating ?? 3,
          folklore_legend: sampleMatch?.folklore_legend,
          safety_advisory: sampleMatch?.safety_advisory,
          image_url: sampleMatch?.image_url ?? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
          location_name: sampleMatch?.location_name ?? 'Heritage Site',
        };
      });

      if (params?.spookyOnly) {
        results = results.filter((d) => d.is_spooky);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        results = results.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            (d.folklore_legend && d.folklore_legend.toLowerCase().includes(q))
        );
      }
      return results;
    }
  } catch (err) {
    console.warn('Database query fallback to sample destinations:', err);
  }

  // Graceful fallback to verified sample destinations
  let filtered = [...SAMPLE_DESTINATIONS];
  if (params?.spookyOnly) {
    filtered = filtered.filter((d) => d.is_spooky);
  }
  if (params?.category) {
    filtered = filtered.filter((d) => d.category === params.category);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.location_name.toLowerCase().includes(q) ||
        (d.folklore_legend && d.folklore_legend.toLowerCase().includes(q))
    );
  }
  return filtered;
}

/**
 * Service to fetch single destination by ID.
 */
export async function getDestinationById(id: string): Promise<DestinationItem | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const sampleMatch = SAMPLE_DESTINATIONS.find((s) => s.id === data.id || s.name === data.name);
      return {
        id: data.id,
        name: data.name,
        category: data.category as any,
        description: data.description,
        historical_context: data.historical_context,
        source_url: data.source_url,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        access_notes: data.access_notes,
        is_published: data.is_published,
        is_spooky: sampleMatch?.is_spooky ?? false,
        spooky_rating: sampleMatch?.spooky_rating ?? 3,
        folklore_legend: sampleMatch?.folklore_legend,
        safety_advisory: sampleMatch?.safety_advisory,
        image_url: sampleMatch?.image_url ?? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        location_name: sampleMatch?.location_name ?? 'Heritage Site',
      };
    }
  } catch (err) {
    console.warn('Database query fallback to sample destination by ID:', err);
  }

  const sample = SAMPLE_DESTINATIONS.find((d) => d.id === id);
  return sample ?? null;
}
