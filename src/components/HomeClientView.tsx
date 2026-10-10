'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ActivityItem, DestinationItem } from '@/data/sampleData';
import { adaptActivity, adaptDestination, UIActivity, UIDestination } from '@/lib/ui/adapters';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ImageTile } from '@/components/ui/ImageTile';
import { DifficultyDots } from '@/components/ui/DifficultyDots';
import { StampBadge } from '@/components/ui/StampBadge';
import { StatTile } from '@/components/ui/StatTile';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { apiClient } from '@/lib/ui/api';

interface HomeClientViewProps {
  activities: ActivityItem[];
  destinations: DestinationItem[];
}

export default function HomeClientView({
  activities: rawActivities,
  destinations: rawDestinations,
}: HomeClientViewProps) {
  const { user, profile, isDemoUser } = useAuth();
  const isAuthenticated = !!user || !isDemoUser;

  // Adapt data safely with typed adapters
  const activities: UIActivity[] = (rawActivities || []).map(adaptActivity);
  const destinations: UIDestination[] = (rawDestinations || []).map(adaptDestination);

  // UI-TODO: Bookmarks kept in-memory for session; no backend saved_activities table exists
  const [savedActivityIds, setSavedActivityIds] = useState<Set<string>>(new Set());
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedActivityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Signed-in next-action data
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      let isMounted = true;
      setIsLoadingSubmissions(true);
      apiClient.get<any[]>('/api/submissions').then((res) => {
        if (isMounted && res.ok && Array.isArray(res.data)) {
          setUserSubmissions(res.data);
        }
        if (isMounted) setIsLoadingSubmissions(false);
      });
      return () => {
        isMounted = false;
      };
    }
  }, [isAuthenticated]);

  // Determine single next-action card priority:
  // 1. Pending submission (3-step progress: Sent, Reviewing, Points)
  // 2. Newly approved submission
  // 3. Saved activity
  // 4. Otherwise "Find your next adventure"
  const pendingSubmission = userSubmissions.find((s) => s.status === 'pending');
  const approvedSubmission = userSubmissions.find((s) => s.status === 'approved');
  const firstSavedActivity = activities.find((a) => savedActivityIds.has(a.id));

  // Beginner-friendly activities sorted by lowest difficulty (up to 3)
  const startHereActivities = [...activities]
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 3);

  // Categories for ticker marquee
  const categories = Array.from(
    new Set(activities.map((a) => a.category).filter(Boolean))
  );
  const tickerItems = categories.length > 0
    ? categories
    : ['Alpine Hiking', 'Kayaking', 'Night Trek', 'Caving', 'Heritage Trail', 'Folklore Exploration'];

  // Glance card activity for signed-out hero
  const glanceActivity = activities[0];

  return (
    <div className="flex flex-col w-full page-rise space-y-12 md:space-y-16 py-6 md:py-10">
      {/* 1. Top Block: Signed Out Hero OR Signed In Welcome-Back */}
      <section className="field-container w-full">
        {!isAuthenticated ? (
          /* ================= SIGNED-OUT INK HERO ================= */
          <div className="panel-ink p-6 md:p-12 border border-[var(--ink-line,#2D4C42)] relative overflow-hidden shadow-2xl">
            {/* Top kicker */}
            <div className="flex items-center justify-between border-b border-[var(--ink-line,#2D4C42)] pb-4 mb-8">
              <span className="font-mono-label text-[11px] text-[var(--sand,#EADFC8)]">
                EXPEDITION DISCOVERY &amp; MEMOIR
              </span>
              <span className="font-mono-label text-[11px] text-[var(--citron,#D8F23C)] hidden sm:inline-block">
                FIELD GUIDE AFTER DARK
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Heading & CTA */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="font-display text-[clamp(40px,6vw,84px)] font-extrabold text-[var(--paper,#F6EFE2)] leading-[1.0] tracking-tight">
                  Go somewhere worth{' '}
                  <span className="font-serif-accent text-[var(--citron,#D8F23C)] font-normal">
                    remembering.
                  </span>
                </h1>
                <p className="text-base md:text-lg text-[var(--sand,#EADFC8)] max-w-xl leading-relaxed">
                  An independent adventure field guide, printed after dark. Discover uncrowded trails, document local folklore, and collect verified summit achievements.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Button
                    variant="flame"
                    size="lg"
                    href="/explorer"
                    hasArrow
                  >
                    Explore adventures
                  </Button>
                </div>
              </div>

              {/* Right Column: Styled Map Preview Card + Floating Glance Card */}
              <div className="lg:col-span-5 relative">
                {/* Styled map preview background tile */}
                <div className="relative w-full aspect-[4/3] rounded-[var(--radius-lg,22px)] overflow-hidden bg-[var(--ink-2,#18302A)] border border-[var(--ink-line,#2D4C42)] p-4 flex flex-col justify-between">
                  {/* Subtle map contour SVG lines */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M20,60 Q120,20 220,80 T380,40 M0,120 Q140,80 260,160 T400,100 M20,180 Q160,140 280,220 T380,180 M0,240 Q180,200 320,280"
                      fill="none"
                      stroke="var(--citron,#D8F23C)"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* 3-4 map pins (one pulsing live pin) */}
                  <div className="absolute top-1/4 left-1/3 flex items-center justify-center">
                    <span className="absolute w-6 h-6 rounded-full bg-[var(--flame,#FF5A1F)] opacity-40 animate-ping" />
                    <span className="relative w-3.5 h-3.5 rounded-full bg-[var(--flame,#FF5A1F)] border-2 border-[var(--ink,#0F1F1A)]" />
                  </div>
                  <div className="absolute top-1/2 right-1/4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--citron,#D8F23C)] border border-[var(--ink,#0F1F1A)] block" />
                  </div>
                  <div className="absolute bottom-1/3 left-1/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--sand,#EADFC8)] border border-[var(--ink,#0F1F1A)] block" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono-label text-[10px] text-[var(--citron,#D8F23C)]">
                      EXPEDITION WAYPOINTS
                    </span>
                    <span className="font-mono-label text-[10px] text-[var(--sand,#EADFC8)]">
                      ACTIVE SURVEY
                    </span>
                  </div>

                  <div className="relative z-10 text-[11px] font-mono-label text-[var(--sand,#EADFC8)]">
                    OSRM CARTO PREVIEW
                  </div>
                </div>

                {/* Floating Glance Card showing a REAL activity */}
                {glanceActivity ? (
                  <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-6 max-w-[280px] sm:max-w-[320px] bg-[var(--card,#FFFAF0)] text-[var(--text,#1A241F)] p-4 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] shadow-xl z-20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] uppercase">
                        {glanceActivity.category}
                      </span>
                      <DifficultyDots difficulty={glanceActivity.difficultyString} />
                    </div>
                    <h2 className="font-display text-sm font-bold text-[var(--ink,#0F1F1A)] line-clamp-1">
                      {glanceActivity.title}
                    </h2>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--line,#D8CBB0)] text-xs font-mono-label text-[var(--muted,#5E675F)]">
                      <span>{glanceActivity.costLabel}</span>
                      <Link
                        href={`/activities/${glanceActivity.id}`}
                        className="text-[var(--flame,#FF5A1F)] font-bold hover:underline"
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="absolute -bottom-6 -left-4 max-w-[280px] bg-[var(--card,#FFFAF0)] text-[var(--text,#1A241F)] p-4 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] shadow-xl z-20">
                    <p className="text-xs text-[var(--muted,#5E675F)]">
                      No activities loaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ================= SIGNED-IN WELCOME-BACK ================= */
          <div className="panel-ink p-6 md:p-10 border border-[var(--ink-line,#2D4C42)] relative overflow-hidden shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--ink-line,#2D4C42)] pb-3">
              <span className="font-mono-label text-[11px] text-[var(--citron,#D8F23C)]">
                AUTHENTICATED PASSPORT
              </span>
              <span className="font-mono-label text-[11px] text-[var(--sand,#EADFC8)]">
                MEMOIR ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Greeting */}
              <div className="lg:col-span-7 space-y-4">
                <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--paper,#F6EFE2)] tracking-tight">
                  Welcome back,{' '}
                  <span className="font-serif-accent text-[var(--citron,#D8F23C)] font-normal">
                    {profile?.display_name || 'Explorer'}.
                  </span>
                </h1>
                <p className="text-sm md:text-base text-[var(--sand,#EADFC8)] max-w-lg leading-relaxed">
                  Your expedition log is up to date. Review your verified achievements, plan your next waypoint route, or browse outfitter redemptions.
                </p>
              </div>

              {/* Right Column: Single Next-Action Card */}
              <div className="lg:col-span-5 w-full">
                {pendingSubmission ? (
                  /* 1. Pending submission */
                  <div className="bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] p-5 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)]">
                        PENDING SUBMISSION
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] font-mono-label text-[10px] font-bold">
                        <span className="live-dot" aria-hidden="true" />
                        In Review
                      </span>
                    </div>
                    <div className="font-display font-bold text-base text-[var(--ink,#0F1F1A)]">
                      {pendingSubmission.activity_name || 'Adventure Expedition'}
                    </div>
                    <ProgressSteps
                      steps={[
                        { title: 'Sent' },
                        { title: 'Reviewing' },
                        { title: 'Points' },
                      ]}
                      currentStep={1}
                      className="py-1"
                    />
                    <div className="text-xs text-[var(--muted,#5E675F)] pt-1">
                      Submitted on {new Date(pendingSubmission.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                ) : approvedSubmission ? (
                  /* 2. Newly approved submission */
                  <div className="bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] p-5 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)]">
                        LATEST APPROVAL
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#E2F7EE] text-[var(--jade-deep,#0B7A50)] font-mono-label text-[10px] font-bold">
                        Verified
                      </span>
                    </div>
                    <div className="font-display font-bold text-base text-[var(--ink,#0F1F1A)]">
                      {approvedSubmission.activity_name || 'Expedition Complete'}
                    </div>
                    <p className="text-xs text-[var(--muted,#5E675F)]">
                      Your proof was verified by the arbiters. Lifetime points have been registered.
                    </p>
                    <Link
                      href="/memoir"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--flame,#FF5A1F)] hover:underline"
                    >
                      View in journal &rarr;
                    </Link>
                  </div>
                ) : firstSavedActivity ? (
                  /* 3. Saved activity */
                  <div className="bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] p-5 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] space-y-3">
                    <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block">
                      BOOKMARKED EXPEDITION
                    </span>
                    <div className="font-display font-bold text-base text-[var(--ink,#0F1F1A)]">
                      {firstSavedActivity.title}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <DifficultyDots difficulty={firstSavedActivity.difficultyString} />
                      <Button
                        variant="ink"
                        size="sm"
                        href={`/activities/${firstSavedActivity.id}`}
                        hasArrow
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* 4. Default: Find your next adventure */
                  <div className="bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] p-5 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] space-y-3">
                    <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block">
                      NEXT EXPEDITION
                    </span>
                    <div className="font-display font-bold text-base text-[var(--ink,#0F1F1A)]">
                      Find your next adventure
                    </div>
                    <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
                      Survey new trails, water routes, and folklore mysteries on the field cartography map.
                    </p>
                    <Button
                      variant="flame"
                      size="sm"
                      href="/explorer"
                      hasArrow
                    >
                      Explore adventures
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Under it: Three Stat Tiles (Only show if real value exists) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--ink-line,#2D4C42)]">
              {/* Tile 1: Total earned */}
              {typeof profile?.total_earned_points === 'number' && (
                <StatTile
                  label="TOTAL EARNED"
                  value={profile.total_earned_points}
                  unit="PTS"
                  variant="ink"
                  description="Lifetime points decided by achievements. Never decreases."
                />
              )}

              {/* Tile 2: Redeemable now (Citron tile) */}
              {typeof profile?.points === 'number' && (
                <StatTile
                  label="REDEEMABLE NOW"
                  value={profile.points}
                  unit="PTS"
                  variant="citron"
                  description="Available balance for gear & coupon redemptions."
                />
              )}

              {/* Tile 3: Your rank */}
              {typeof profile?.rank === 'number' && (
                <StatTile
                  label="YOUR RANK"
                  value={`#${profile.rank}`}
                  variant="default"
                  description="Global standing on the official field leaderboard."
                />
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Marquee Ticker Band (Flame, ink text, rotated -1deg, 38s linear, pauses under reduced motion) */}
      <section className="w-full overflow-hidden py-3 bg-[var(--flame,#FF5A1F)] text-[var(--ink,#0F1F1A)] transform -rotate-1 shadow-sm select-none">
        <div className="ticker-marquee flex items-center gap-8 font-mono-label text-xs font-bold tracking-widest uppercase">
          {/* Repeat list twice for smooth seamless loop */}
          {[...tickerItems, ...tickerItems, ...tickerItems].map((cat, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{cat}</span>
              <span aria-hidden="true">&#9670;</span>
            </span>
          ))}
        </div>
      </section>

      {/* 3. The 5-Step Loop: Stamped Circles */}
      <section className="field-container w-full">
        <div className="p-6 md:p-8 rounded-[var(--radius-lg,22px)] border border-[var(--line,#D8CBB0)] bg-[var(--card,#FFFAF0)]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              THE EXPEDITION PROTOCOL
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--ink,#0F1F1A)] mt-1">
              Five steps. <span className="font-serif-accent text-[var(--flame,#FF5A1F)]">One story.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 md:gap-6">
            {[
              { step: '01', name: 'Discover', desc: 'Find uncrowded routes & enigmas' },
              { step: '02', name: 'Experience', desc: 'Trek, paddle, or investigate' },
              { step: '03', name: 'Verify', desc: 'Submit field coordinates & photo' },
              { step: '04', name: 'Earn', desc: 'Unlock points & ladder rank' },
              { step: '05', name: 'Remember', desc: 'Archive entries in your memoir' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center p-3 rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] bg-[var(--sand,#EADFC8)]/50 hover:border-[var(--ink-line,#2D4C42)] transition-colors"
              >
                <div className="w-12 h-12 rounded-full border-2 border-[var(--ink,#0F1F1A)] bg-[var(--card,#FFFAF0)] flex items-center justify-center font-mono-label text-sm font-bold text-[var(--ink,#0F1F1A)] mb-2 shadow-xs">
                  {item.step}
                </div>
                <div className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)]">
                  {item.name}
                </div>
                <div className="text-[11px] text-[var(--muted,#5E675F)] mt-1 leading-snug">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Start Here Recommendations (Up to 3 lowest difficulty activities) */}
      <section className="field-container w-full space-y-6">
        <div className="flex items-end justify-between border-b border-[var(--line,#D8CBB0)] pb-4">
          <div>
            <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              RECOMMENDED EXPEDITIONS
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--ink,#0F1F1A)] mt-1">
              Start here.
            </h2>
          </div>
          <Link
            href="/explorer"
            className="text-xs font-semibold text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] flex items-center gap-1 transition-colors"
          >
            <span>View all ({activities.length})</span>
            <Icon name="arrow-right" size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {startHereActivities.map((act) => {
            const isBookmarked = savedActivityIds.has(act.id);
            return (
              <div
                key={act.id}
                className="card-field overflow-hidden flex flex-col justify-between group"
              >
                {/* 4:3 Image Tile */}
                <div className="relative">
                  <ImageTile
                    src={act.imageUrl}
                    alt={act.title}
                    aspectRatio="4/3"
                  />
                  {/* Category tag */}
                  <span className="absolute top-3 left-3 z-10 font-mono-label text-[10px] text-[var(--ink,#0F1F1A)] bg-[var(--card,#FFFAF0)]/95 border border-[var(--line,#D8CBB0)] px-2 py-0.5 rounded shadow-xs">
                    {act.category}
                  </span>
                  {/* Bookmark toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(act.id, e)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark activity'}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                      isBookmarked
                        ? 'bg-[var(--flame,#FF5A1F)] text-[var(--ink,#0F1F1A)] border-[var(--flame,#FF5A1F)] scale-105'
                        : 'bg-[var(--card,#FFFAF0)]/90 text-[var(--muted,#5E675F)] border-[var(--line,#D8CBB0)] hover:scale-110 active:scale-90 hover:text-[var(--flame,#FF5A1F)]'
                    }`}
                  >
                    <Icon name="bookmark" size={16} aria-hidden="true" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)] group-hover:text-[var(--flame,#FF5A1F)] transition-colors line-clamp-1">
                      {act.title}
                    </h3>
                    <p className="text-xs text-[var(--muted,#5E675F)] line-clamp-2 mt-1 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Metadata strip: Difficulty dots, cost, duration */}
                  <div className="pt-3 border-t border-[var(--line,#D8CBB0)] flex items-center justify-between text-xs">
                    <DifficultyDots difficulty={act.difficultyString} />
                    <div className="font-mono-label text-[11px] text-[var(--ink,#0F1F1A)] font-bold">
                      {act.costLabel}
                      {act.durationMinutes ? ` · ${act.durationMinutes}m` : ''}
                    </div>
                  </div>

                  {/* View details button */}
                  <Button
                    variant="ink"
                    size="default"
                    href={`/activities/${act.id}`}
                    className="w-full"
                    hasArrow
                  >
                    View details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. "Am I Brave Enough?" Ink Band */}
      <section className="field-container w-full">
        <div className="panel-ink p-6 md:p-10 border border-[var(--ink-line,#2D4C42)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--ink-line,#2D4C42)] pb-4">
            <div>
              <span className="font-mono-label text-[11px] text-[var(--folklore,#B8390A)] font-bold">
                ENIGMAS &amp; FOLKLORE
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper,#F6EFE2)] mt-1">
                Am I brave <span className="font-serif-accent text-[var(--citron,#D8F23C)] font-normal">enough?</span>
              </h2>
            </div>
            <Link
              href="/brave-enough"
              className="text-xs font-mono-label text-[var(--citron,#D8F23C)] hover:underline flex items-center gap-1.5"
            >
              <span>Explore folklore dossier</span>
              <Icon name="arrow-right" size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map((dest) => (
              <div
                key={dest.id}
                className="p-5 rounded-[var(--radius,14px)] bg-[var(--ink-2,#18302A)] border border-[var(--ink-line,#2D4C42)] flex flex-col justify-between space-y-4 hover:border-[var(--citron,#D8F23C)] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {dest.hasHistory ? (
                      <StampBadge variant="history" />
                    ) : dest.hasFolklore ? (
                      <StampBadge variant="folklore" />
                    ) : (
                      <StampBadge variant="history" text="Public Trail" />
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-[var(--paper,#F6EFE2)]">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[var(--sand,#EADFC8)] line-clamp-3 mt-2 leading-relaxed">
                    {dest.folkloreText || dest.historyText || dest.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--ink-line,#2D4C42)] flex items-center justify-between text-xs">
                  <span className="font-mono-label text-[10px] text-[var(--sand,#EADFC8)]">
                    {dest.category}
                  </span>
                  <Link
                    href={`/explorer?dest=${dest.id}`}
                    className="text-xs font-bold text-[var(--citron,#D8F23C)] hover:underline flex items-center gap-1"
                  >
                    Locate on map &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Footer Line */}
          <div className="pt-4 border-t border-[var(--ink-line,#2D4C42)] flex items-center justify-between text-xs text-[var(--sand,#EADFC8)] font-mono-label">
            <span>Public, accessible places only.</span>
            <span>Leave no trace. Respect regional lore.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
