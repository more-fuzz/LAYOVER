import React from 'react';
import { getPublishedActivities } from '@/services/activities';
import { getPublishedDestinations } from '@/services/destinations';
import HomeClientView from '@/components/HomeClientView';

export default async function Home() {
  const activities = await getPublishedActivities();
  const destinations = await getPublishedDestinations();

  return (
    <HomeClientView
      activities={activities}
      destinations={destinations}
    />
  );
}
