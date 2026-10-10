'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, ShieldCheck, Sparkles, CheckCircle2, Award, Settings, Bell, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { profile, role } = useAuth();

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Profile Overview Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#14231b] via-[#101b15] to-[#0a120e] border border-[#1e3427] shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/40 shadow-xl"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <span className="text-xs bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-800">
              {role.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-zinc-400">@{profile.username}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-zinc-300">
            <span className="font-bold text-amber-400">
              ✨ {profile.points.toLocaleString()} Verified Points
            </span>
            <span>• Rank #6 Global</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-8 rounded-3xl bg-[#101b15] border border-[#1e3427] shadow-xl space-y-6">
        <div className="border-b border-[#1b2f24] pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Profile Settings & Identity</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            In accordance with Row Level Security (RLS), travelers may edit their display name and avatar. Role escalation to admin is protected by database triggers.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center gap-3">
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`relative rounded-2xl overflow-hidden ring-2 transition-all ${
                    avatarUrl === url ? 'ring-emerald-500 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-14 h-14 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              Custom Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1410] border border-[#1a2d21] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Database Role Security (trg_protect_profile_role):</span>
            </div>
            <span className="font-bold text-emerald-400 uppercase font-mono">
              {role} (Immutable by client)
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
