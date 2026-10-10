/**
 * Typed UI Adapters for Trails & Tales ("Field Guide, After Dark").
 * Maps real backend API response shapes to component view models.
 * If a field is missing, it is safely omitted or set to undefined (never fabricated).
 */

export interface UiActivity {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  difficulty: number;
  latitude: number;
  longitude: number;
  basePoints: number;
  estimatedCost: number | null;
  requirements: string[];
  safetyInfo: string;
  imageUrl?: string;
  locationName?: string;
  durationHours?: number;
}

export function adaptActivity(item: any): UiActivity {
  return {
    id: String(item.id),
    slug: String(item.slug || ''),
    name: String(item.name || ''),
    category: String(item.category || 'hiking'),
    description: String(item.description || ''),
    difficulty: Number(item.difficulty || 1),
    latitude: Number(item.latitude || 0),
    longitude: Number(item.longitude || 0),
    basePoints: Number(item.base_points || 0),
    estimatedCost: item.estimated_cost !== null && item.estimated_cost !== undefined ? Number(item.estimated_cost) : null,
    requirements: Array.isArray(item.requirements) ? item.requirements : [],
    safetyInfo: String(item.safety_info || ''),
    imageUrl: item.image_url ? String(item.image_url) : undefined,
    locationName: item.location_name ? String(item.location_name) : undefined,
    durationHours: item.duration_hours ? Number(item.duration_hours) : undefined,
  };
}

export interface UiDestination {
  id: string;
  name: string;
  category: string;
  description: string;
  historicalContext?: string | null;
  sourceUrl?: string | null;
  latitude: number;
  longitude: number;
  accessNotes?: string | null;
  isSpooky: boolean;
  spookyRating?: number;
  folkloreLegend?: string | null;
  safetyAdvisory?: string | null;
  locationName?: string;
  imageUrl?: string;
}

export function adaptDestination(item: any): UiDestination {
  return {
    id: String(item.id),
    name: String(item.name || ''),
    category: String(item.category || 'historical'),
    description: String(item.description || ''),
    historicalContext: item.historical_context ?? null,
    sourceUrl: item.source_url ?? null,
    latitude: Number(item.latitude || 0),
    longitude: Number(item.longitude || 0),
    accessNotes: item.access_notes ?? null,
    isSpooky: Boolean(item.is_spooky),
    spookyRating: item.spooky_rating ? Number(item.spooky_rating) : undefined,
    folkloreLegend: item.folklore_legend ?? null,
    safetyAdvisory: item.safety_advisory ?? null,
    locationName: item.location_name ? String(item.location_name) : undefined,
    imageUrl: item.image_url ? String(item.image_url) : undefined,
  };
}

export interface UiLeaderboardUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalPoints: number;
  completedCount: number;
  rank: number;
  badgeTitle?: string;
}

export function adaptLeaderboardUser(item: any): UiLeaderboardUser {
  return {
    id: String(item.id),
    username: String(item.username || ''),
    displayName: String(item.display_name || item.username || 'Explorer'),
    avatarUrl: item.avatar_url ? String(item.avatar_url) : undefined,
    totalPoints: Number(item.total_points || 0),
    completedCount: Number(item.completed_count || 0),
    rank: Number(item.rank || 0),
    badgeTitle: item.badge_title ? String(item.badge_title) : undefined,
  };
}

export interface UiReward {
  id: string;
  name: string;
  description: string;
  costPoints: number;
  stock: number | null;
  isActive: boolean;
  category: string;
  merchantName?: string;
  merchantUrl?: string;
  usageInstructions?: string[];
  imageUrl?: string;
}

export function adaptReward(item: any): UiReward {
  return {
    id: String(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    costPoints: Number(item.cost_points || 0),
    stock: item.stock !== null && item.stock !== undefined ? Number(item.stock) : null,
    isActive: Boolean(item.is_active ?? true),
    category: String(item.category || 'gear'),
    merchantName: item.merchant_name ? String(item.merchant_name) : undefined,
    merchantUrl: item.merchant_url ? String(item.merchant_url) : undefined,
    usageInstructions: Array.isArray(item.usage_instructions) ? item.usage_instructions : undefined,
    imageUrl: item.image_url ? String(item.image_url) : undefined,
  };
}

export interface UiRedemption {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  rewardDescription?: string;
  rewardImage?: string;
  pointsSpent: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
  claimCode: string;
  createdAt: string;
  merchantName?: string;
  merchantUrl?: string;
  usageInstructions?: string[];
}

export function adaptRedemption(item: any): UiRedemption {
  return {
    id: String(item.id),
    userId: String(item.user_id || ''),
    rewardId: String(item.reward_id || ''),
    rewardName: String(item.reward_name || 'Expedition Voucher'),
    rewardDescription: item.reward_description ? String(item.reward_description) : undefined,
    rewardImage: item.reward_image ? String(item.reward_image) : undefined,
    pointsSpent: Number(item.points_spent || 0),
    status: (item.status || 'pending') as any,
    claimCode: String(item.claim_code || ''),
    createdAt: String(item.created_at || new Date().toISOString()),
    merchantName: item.merchant_name ? String(item.merchant_name) : undefined,
    merchantUrl: item.merchant_url ? String(item.merchant_url) : undefined,
    usageInstructions: Array.isArray(item.usage_instructions) ? item.usage_instructions : undefined,
  };
}

export interface UiSubmission {
  id: string;
  userId: string;
  userDisplayName: string;
  activityId: string;
  activityName: string;
  activityCategory: string;
  points: number;
  evidencePath: string;
  evidenceUrl?: string;
  claimedLatitude?: number | null;
  claimedLongitude?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string | null;
  reviewerId?: string | null;
  reviewNotes?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
}

export function adaptSubmission(item: any): UiSubmission {
  return {
    id: String(item.id),
    userId: String(item.user_id || ''),
    userDisplayName: String(item.user_display_name || 'Traveler'),
    activityId: String(item.activity_id || ''),
    activityName: String(item.activity_name || 'Adventure Trail'),
    activityCategory: String(item.activity_category || 'hiking'),
    points: Number(item.points || 0),
    evidencePath: String(item.evidence_path || ''),
    evidenceUrl: item.evidence_url ? String(item.evidence_url) : undefined,
    claimedLatitude: item.claimed_latitude ?? null,
    claimedLongitude: item.claimed_longitude ?? null,
    status: (item.status || 'pending') as any,
    notes: item.notes ?? null,
    reviewerId: item.reviewer_id ?? null,
    reviewNotes: item.review_notes ?? null,
    submittedAt: String(item.submitted_at || new Date().toISOString()),
    reviewedAt: item.reviewed_at ?? null,
  };
}
