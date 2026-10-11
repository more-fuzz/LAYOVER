'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatTile } from '@/components/ui/StatTile';

export default function ProfilePage() {
  const { profile, role, signOut } = useAuth();

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Separate, clearly explained privacy toggles (no single blanket consent)
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [privateMemoir, setPrivateMemoir] = useState(true);
  const [locationPermitted, setLocationPermitted] = useState(false);
  const [locationPrompt, setLocationPrompt] = useState<string | null>(null);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      profile.display_name = displayName;
      profile.avatar_url = avatarUrl;
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  const handleRequestLocation = () => {
    setLocationPrompt('Requesting current GPS coordinates to calculate expedition trailhead proximity...');
    if (!navigator.geolocation) {
      setLocationPrompt('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermitted(true);
        setLocationPrompt('Location calibrated successfully for expedition waypoint distance calculations.');
      },
      (err) => {
        setLocationPermitted(false);
        setLocationPrompt(`Location access was denied (${err.message}). You can still enter trailheads manually.`);
      }
    );
  };

  return (
    <div className="field-container max-w-4xl w-full py-8 md:py-12 space-y-8 page-rise">
      {/* 1. Profile Overview Header */}
      <div className="p-6 md:p-8 rounded-[var(--radius-lg,22px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--line,#D8CBB0)] shrink-0">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[var(--ink,#0F1F1A)]">
              {displayName}
            </h1>
            <span className="font-mono-label text-[10px] px-2 py-0.5 rounded bg-[var(--sand,#EADFC8)] border border-[var(--line,#D8CBB0)] text-[var(--muted,#5E675F)] font-bold">
              ROLE: {role.toUpperCase()}
            </span>
          </div>
          <p className="font-mono-label text-xs text-[var(--muted,#5E675F)]">
            @{profile.username}
          </p>
        </div>

        {/* Sign Out Button */}
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 2. Passport Standing Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="TOTAL EARNED"
          value={profile.total_earned_points ?? profile.points}
          unit="PTS"
          variant="ink"
          description="Permanent competitive rank points."
        />
        <StatTile
          label="REDEEMABLE BALANCE"
          value={profile.points}
          unit="PTS"
          variant="citron"
          description="Available for gear and voucher redemptions."
        />
        {typeof profile.rank === 'number' && (
          <StatTile
            label="GLOBAL STANDING"
            value={`#${profile.rank}`}
            variant="default"
            description="Leaderboard rank decided by verified completions."
          />
        )}
      </div>

      {/* 3. Profile Identity Settings */}
      <div className="p-6 md:p-8 rounded-[var(--radius-lg,22px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] shadow-sm space-y-6">
        <div className="border-b border-[var(--line,#D8CBB0)] pb-4">
          <h2 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)]">
            Explorer Identity
          </h2>
          <p className="text-xs text-[var(--muted,#5E675F)] mt-1">
            Configure how your name and avatar appear on public trailheads and expedition records.
          </p>
        </div>

        {savedSuccess && (
          <div
            role="status"
            className="p-3.5 rounded-[var(--radius-sm,8px)] bg-[#E2F7EE] border border-[var(--jade-deep,#0B7A50)] text-[var(--jade-deep,#0B7A50)] text-xs font-semibold"
          >
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="display-name" className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-sm text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
              Choose Avatar
            </label>
            <div className="flex flex-wrap gap-3">
              {sampleAvatars.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform ${
                    avatarUrl === url
                      ? 'border-[var(--flame,#FF5A1F)] scale-110'
                      : 'border-[var(--line,#D8CBB0)] hover:scale-105'
                  }`}
                  aria-label={`Select avatar ${i + 1}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="ink"
            size="default"
            isLoading={saving}
          >
            {saving ? 'Saving...' : 'Save Identity'}
          </Button>
        </form>
      </div>

      {/* 4. Clearly Explained Privacy Controls (No Blanket Consent) */}
      <div className="p-6 md:p-8 rounded-[var(--radius-lg,22px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] shadow-sm space-y-6">
        <div className="border-b border-[var(--line,#D8CBB0)] pb-4">
          <h2 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)]">
            Privacy &amp; Data Governance
          </h2>
          <p className="text-xs text-[var(--muted,#5E675F)] mt-1">
            Independent privacy controls for every feature. We never use bundled or all-or-nothing consent agreements.
          </p>
        </div>

        <div className="space-y-4">
          {/* Toggle 1: Leaderboard */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/30 border border-[var(--line,#D8CBB0)]">
            <div className="space-y-1">
              <span className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)] block">
                Public Leaderboard Standing
              </span>
              <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
                Display your verified points and username in the community ranking table. If disabled, your standing is anonymized.
              </p>
            </div>
            <input
              type="checkbox"
              checked={publicLeaderboard}
              onChange={(e) => setPublicLeaderboard(e.target.checked)}
              aria-label="Toggle public leaderboard standing"
              className="mt-1 w-5 h-5 rounded border-[var(--line,#D8CBB0)] text-[var(--flame,#FF5A1F)] focus:ring-[var(--flame,#FF5A1F)] cursor-pointer shrink-0"
            />
          </div>

          {/* Toggle 2: Memoir Photo Privacy */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/30 border border-[var(--line,#D8CBB0)]">
            <div className="space-y-1">
              <span className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)] block">
                Private Archival Evidence
              </span>
              <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
                Keep photo uploads and evidence files private to you and designated review arbiters. Never published to search engines.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privateMemoir}
              onChange={(e) => setPrivateMemoir(e.target.checked)}
              aria-label="Toggle private archival evidence"
              className="mt-1 w-5 h-5 rounded border-[var(--line,#D8CBB0)] text-[var(--flame,#FF5A1F)] focus:ring-[var(--flame,#FF5A1F)] cursor-pointer shrink-0"
            />
          </div>

          {/* Location Request On-Demand (One-line reason) */}
          <div className="p-4 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/30 border border-[var(--line,#D8CBB0)] space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)] block">
                  Trailhead Location Triangulation
                </span>
                <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
                  Reason: Calculates real road distance and OSRM driving duration from your current position to adventure trailheads.
                </p>
              </div>
              <Button
                variant={locationPermitted ? 'citron' : 'outline'}
                size="sm"
                onClick={handleRequestLocation}
                className="shrink-0"
              >
                {locationPermitted ? 'Calibrated' : 'Calibrate GPS'}
              </Button>
            </div>

            {locationPrompt && (
              <div className="font-mono-label text-[11px] text-[var(--ink,#0F1F1A)] bg-[var(--card,#FFFAF0)] p-2 rounded border border-[var(--line,#D8CBB0)]">
                {locationPrompt}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
