import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getActivityById } from '@/services/activities';
import { SAMPLE_ACTIVITIES } from '@/data/sampleData';
import { ActivityDetailView } from '@/components/activities/ActivityDetailView';

export function generateStaticParams() {
  return SAMPLE_ACTIVITIES.map((act) => ({
    id: act.id,
  }));
}

async function ActivityDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await getActivityById(id);

  if (!activity) {
    notFound();
  }

  return <ActivityDetailView activity={activity} />;
}

export default function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-[var(--muted,#5E675F)] font-mono-label">
          Retrieving field dossier...
        </div>
      }
    >
      <ActivityDetailContent params={params} />
    </Suspense>
  );
}
