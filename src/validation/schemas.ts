import { z } from 'zod';

export const userRoleSchema = z.enum(['traveler', 'admin']);

export const profileUpdateSchema = z.object({
  display_name: z.string().min(1, 'Display name cannot be empty').max(100),
  avatar_url: z.string().url().nullable().optional(),
});

export const activityCategorySchema = z.enum([
  'hiking',
  'climbing',
  'diving',
  'kayaking',
  'paragliding',
  'caving',
  'biking',
  'mountaineering',
]);

export const activityFilterSchema = z.object({
  category: activityCategorySchema.optional(),
  difficulty: z.coerce.number().int().min(1).max(5).optional(),
});

export const destinationCategorySchema = z.enum([
  'historical',
  'natural_wonder',
  'mystery_trail',
  'abandoned',
  'cultural_heritage',
]);

export const destinationFilterSchema = z.object({
  category: destinationCategorySchema.optional(),
});

export const submissionCreateSchema = z.object({
  activity_id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid activity UUID'),
  evidence_path: z.string().min(1, 'Evidence storage path is required'),
  claimed_latitude: z.number().min(-90).max(90).nullable().optional(),
  claimed_longitude: z.number().min(-180).max(180).nullable().optional(),
});

export const submissionReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  review_notes: z.string().max(1000).nullable().optional(),
});

export const redemptionCreateSchema = z.object({
  reward_id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid reward UUID'),
});

export const consentRecordSchema = z.object({
  terms_version: z.string().min(1, 'Terms version is required'),
});
