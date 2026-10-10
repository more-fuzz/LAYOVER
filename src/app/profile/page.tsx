'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SafeImage from '@/components/SafeImage';
import { User, ShieldCheck, Sparkles, CheckCircle2, Award, Settings, Bell, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { profile, role, signOut } = useAuth();

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#D6CCBC] shrink-0">
          <SafeImage
            src={avatarUrl}
            alt={displayName}
            aspectRatio="1/1"
            fallbackTitle={displayName}
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-[#292820] font-sans">{displayName}</h1>
            <span className="retro-stamp text-[10px]">
              ROLE: {role.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-[#6D685C] font-mono">@{profile.username}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-[#292820] font-mono">
            <span className="font-bold text-[#B85F43] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A45B]" />
              <span>{profile.points.toLocaleString()} PTS Verified</span>
            </span>
            <span className="text-[#6D685C]">• Rank #{profile.rank || 6} Global</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] shadow-xs space-y-6">
        <div className="border-b border-[#D6CCBC] pb-4">
          <h2 className="text-lg font-bold text-[#292820] flex items-center gap-2 font-sans">
            <Settings className="w-4 h-4 text-[#777A53]" />
            <span>Profile Settings & Identity</span>
          </h2>
          <p className="text-xs text-[#6D685C] mt-1 leading-relaxed">
            In accordance with Row Level Security (RLS), explorers can edit their display identity.
            Role escalation to administrative privileges is strictly guarded by server database policies.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-[#EAE1D3] border border-[#777A53] text-[#777A53] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#777A53]" />
            <span>Profile changes updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold text-[#6D685C] uppercase tracking-wider mb-1.5">
              Explorer Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-sm focus:outline-hidden focus:border-[#777A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#6D685C] uppercase tracking-wider mb-2">
              Select Field Avatar
            </label>
            <div className="flex items-center gap-3">
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    avatarUrl === url
                      ? 'border-[#B85F43] scale-105'
                      : 'border-[#D6CCBC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-12 h-12 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#6D685C] uppercase tracking-wider mb-1.5">
              Custom Avatar Visual URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs focus:outline-hidden focus:border-[#777A53] font-mono"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#6D685C]">
              <Lock className="w-4 h-4 text-[#777A53]" />
              <span>Database Role Security (trg_protect_profile_role):</span>
            </div>
            <span className="font-bold text-[#B85F43] uppercase font-mono">
              {role} (IMMUTABLE BY CLIENT)
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="btn-journal-primary text-xs py-2.5 px-5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>

            <button
              type="button"
              onClick={() => signOut()}
              className="btn-journal-secondary text-xs py-2.5 px-4 text-[#B85F43]"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
