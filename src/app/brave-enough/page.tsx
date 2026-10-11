'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import { SAMPLE_DESTINATIONS, DestinationItem } from '@/data/sampleData';
import { adaptDestination } from '@/lib/ui/adapters';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StampBadge } from '@/components/ui/StampBadge';
import { ImageTile } from '@/components/ui/ImageTile';

export default function BraveEnoughPage() {
  const spookyDestinations = SAMPLE_DESTINATIONS.filter((d) => d.is_spooky);
  const [selectedDestId, setSelectedDestId] = useState<string | undefined>(spookyDestinations[0]?.id);

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-8 page-rise">
      {/* 1. Clear Exit Route back to Normal Explore */}
      <div className="flex items-center justify-between border-b border-[var(--line,#D8CBB0)] pb-4">
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] transition-colors"
        >
          <Icon name="arrow-left" size={14} aria-hidden="true" />
          <span>Return to Normal Explore</span>
        </Link>
        <span className="font-mono-label text-[10px] text-[var(--citron,#D8F23C)] bg-[var(--ink,#0F1F1A)] px-2.5 py-1 rounded-[6px]">
          AFTER DARK DOSSIER
        </span>
      </div>

      {/* Editorial Ink Header Banner */}
      <div className="panel-ink p-8 md:p-12 border border-[var(--ink-line,#2D4C42)] shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ink-line,#2D4C42)] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--citron,#D8F23C)] animate-ping" aria-hidden="true" />
            <span className="font-mono-label text-[11px] text-[var(--citron,#D8F23C)] font-bold">
              FOLKLORE &amp; ANCIENT MYSTERIES
            </span>
          </div>
          <span className="font-mono-label text-[10px] text-[var(--sand,#EADFC8)]">
            PUBLIC, ACCESSIBLE PLACES ONLY
          </span>
        </div>

        <div className="max-w-2xl space-y-3">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--paper,#F6EFE2)] tracking-tight">
            Am I brave <span className="font-serif-accent text-[var(--citron,#D8F23C)] font-normal">enough?</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--sand,#EADFC8)] leading-relaxed">
            A dusk-to-dawn survey of regional lore, meteor craters, and high-altitude legends. Every destination is rigorously separated between documented historical fact and local oral folklore.
          </p>
        </div>
      </div>

      {/* Map in After Dark Mode */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-[var(--ink,#0F1F1A)]">
            Cartography of Regional Legends
          </h2>
          <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
            {spookyDestinations.length} sites charted
          </span>
        </div>

        <div className="rounded-[28px] overflow-hidden border-[1.5px] border-[var(--ink,#0F1F1A)]">
          <MapComponent
            destinations={spookyDestinations}
            selectedId={selectedDestId}
            onSelectMarker={(item) => setSelectedDestId(item.id)}
            isAfterDark={true}
            height="460px"
            showFilters={false}
          />
        </div>
      </div>

      {/* Folklore Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spookyDestinations.map((dest) => {
          const adapted = adaptDestination(dest);
          const isSelected = selectedDestId === dest.id;

          return (
            <div
              key={dest.id}
              id={dest.id}
              onClick={() => setSelectedDestId(dest.id)}
              className={`p-6 rounded-[var(--radius-lg,22px)] border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] border-[var(--citron,#D8F23C)] shadow-xl'
                  : 'bg-[var(--card,#FFFAF0)] text-[var(--text,#1A241F)] border-[var(--line,#D8CBB0)] hover:border-[var(--ink-line,#2D4C42)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <StampBadge
                  variant="folklore"
                  text={adapted.hasFolklore ? 'Local Folklore' : 'Documented History'}
                />
                <span
                  className={`font-mono-label text-[10px] ${
                    isSelected ? 'text-[var(--citron,#D8F23C)]' : 'text-[var(--muted,#5E675F)]'
                  }`}
                >
                  {adapted.category}
                </span>
              </div>

              <div>
                <h3
                  className={`font-display font-bold text-xl ${
                    isSelected ? 'text-[var(--paper,#F6EFE2)]' : 'text-[var(--ink,#0F1F1A)]'
                  }`}
                >
                  {adapted.name}
                </h3>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    isSelected ? 'text-[var(--sand,#EADFC8)]' : 'text-[var(--muted,#5E675F)]'
                  }`}
                >
                  {adapted.description}
                </p>
              </div>

              {/* Separated Fact vs Legend */}
              <div className="space-y-2 pt-2 border-t border-[var(--line,#D8CBB0)]/30 text-xs">
                {adapted.folkloreText && (
                  <div className="p-3 rounded-[var(--radius-sm,8px)] bg-[var(--folklore,#B8390A)]/10 text-[var(--folklore,#B8390A)] space-y-1">
                    <span className="font-mono-label text-[10px] font-bold block">
                      ORAL FOLKLORE &amp; ENIGMA
                    </span>
                    <p className="leading-relaxed">{adapted.folkloreText}</p>
                  </div>
                )}

                {adapted.historyText && (
                  <div className="p-3 rounded-[var(--radius-sm,8px)] bg-[var(--jade-deep,#0B7A50)]/10 text-[var(--jade-deep,#0B7A50)] space-y-1">
                    <span className="font-mono-label text-[10px] font-bold block">
                      DOCUMENTED HISTORICAL CONTEXT
                    </span>
                    <p className="leading-relaxed">{adapted.historyText}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono-label">
                <span className={isSelected ? 'text-[var(--sand,#EADFC8)]' : 'text-[var(--muted,#5E675F)]'}>
                  Public, accessible places only.
                </span>
                <Link
                  href={`/explorer?dest=${dest.id}`}
                  className="font-bold text-[var(--flame,#FF5A1F)] hover:underline flex items-center gap-1"
                >
                  Locate on Map &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
