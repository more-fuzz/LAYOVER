'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import { SAMPLE_DESTINATIONS, DestinationItem } from '@/data/sampleData';
import {
  Ghost,
  ShieldCheck,
  Compass,
  AlertTriangle,
  BookOpen,
  MapPin,
  ExternalLink,
  Sparkles,
  Flame,
  HelpCircle,
} from 'lucide-react';

export default function BraveEnoughPage() {
  const spookyDestinations = SAMPLE_DESTINATIONS.filter((d) => d.is_spooky);
  const [selectedDestId, setSelectedDestId] = useState<string | undefined>(undefined);
  const [braveryScore, setBraveryScore] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const toggleQuest = (id: string) => {
    if (completedQuests.includes(id)) {
      setCompletedQuests(completedQuests.filter((q) => q !== id));
      setBraveryScore((prev) => Math.max(0, prev - 25));
    } else {
      setCompletedQuests([...completedQuests, id]);
      setBraveryScore((prev) => prev + 25);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#0a0714] via-[#0d0918] to-[#0a100d] text-zinc-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[#2d1c4d] bg-gradient-to-r from-[#170e2e] via-[#120a24] to-[#0a0614] shadow-2xl">
          <div className="absolute -right-12 -top-12 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold shadow-lg">
              <Ghost className="w-4 h-4 text-purple-400 animate-bounce" />
              <span>Dedicated Spooky & Folklore Exploration</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              &quot;Am I Brave Enough?&quot;{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                Folklore Enigmas & Lost Ruins
              </span>
            </h1>

            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Journey into the world’s most enigmatic subterranean troglodyte labyrinths, mist-shrouded twisted oak groves, and desert ghost towns. Uncover verifiable historical foundations alongside centuries-old local legends.
            </p>

            {/* Strict Safety Advisory Banner */}
            <div className="p-4 rounded-2xl bg-[#24133b]/80 border border-purple-700/60 flex items-start gap-3 text-xs text-purple-200">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Responsible Exploration Protocol: </span>
                All listed sites are officially approved heritage locations. We strictly prohibit visiting restricted or unsafe locations. Never trespass, always visit during designated daylight hours, and adhere to Leave-No-Trace principles.
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Bravery Tracker Widget */}
        <div className="p-6 rounded-3xl bg-[#130d22] border border-[#2a1a45] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/90 border border-purple-600 flex items-center justify-center text-2xl shadow-inner">
              👻
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-purple-400">
                Spooky Explorer Index
              </div>
              <div className="text-xl font-black text-white">
                {braveryScore === 100 ? 'Mythic Crypt Walker 🏆' : braveryScore >= 50 ? 'Enigma Seeker 🔮' : 'Curious Wanderer 🕯️'}
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-xs font-semibold text-purple-300 mb-1.5">
              <span>Bravery Progress</span>
              <span>{completedQuests.length} / {spookyDestinations.length} Investigated</span>
            </div>
            <div className="w-full bg-[#201538] h-3 rounded-full overflow-hidden p-0.5 border border-[#37235e]">
              <div
                className="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedQuests.length / spookyDestinations.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interactive Map of Spooky Destinations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <span>Map of Approved Enigmatic Destinations</span>
            </h2>
            <span className="text-xs text-purple-300">Click a marker to inspect lore</span>
          </div>

          <MapComponent
            destinations={spookyDestinations}
            selectedId={selectedDestId}
            height="460px"
            center={[35.0, 25.0]}
            zoom={3}
            onSelectMarker={(item) => setSelectedDestId(item.id)}
          />
        </div>

        {/* Detailed Destination Stories & Legends */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-black text-white">
            Enigmatic Expeditions & Lore
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spookyDestinations.map((dest) => {
              const isInvestigated = completedQuests.includes(dest.id);
              return (
                <div
                  id={dest.id}
                  key={dest.id}
                  className={`rounded-3xl bg-[#120c22] border overflow-hidden shadow-2xl transition-all ${
                    selectedDestId === dest.id
                      ? 'border-purple-400 ring-2 ring-purple-500/50'
                      : 'border-[#26173d] hover:border-purple-600/70'
                  }`}
                >
                  <div className="relative h-60 w-full">
                    <img
                      src={dest.image_url}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120c22] via-transparent to-black/40" />
                    <div className="absolute top-4 left-4 bg-purple-950/90 border border-purple-700 px-3 py-1 rounded-lg text-xs font-bold text-purple-300 uppercase">
                      {dest.category.replace('_', ' ')}
                    </div>
                    {dest.spooky_rating && (
                      <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-600/40">
                        Spook Index: {dest.spooky_rating}/5 👻
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-xs text-purple-400 font-semibold mb-1">
                        📍 {dest.location_name}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Historical Fact vs Local Legend (Structured Distinction) */}
                    <div className="space-y-3 pt-2">
                      {dest.historical_context && (
                        <div className="p-4 rounded-2xl bg-[#18112c] border border-[#2f1f50] text-xs">
                          <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Historical & Geological Fact</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed">
                            {dest.historical_context}
                          </p>
                        </div>
                      )}

                      {dest.folklore_legend && (
                        <div className="p-4 rounded-2xl bg-[#201236] border border-purple-800/60 text-xs">
                          <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Local Folklore & Enigma</span>
                          </div>
                          <p className="text-purple-200/90 italic leading-relaxed">
                            &quot;{dest.folklore_legend}&quot;
                          </p>
                        </div>
                      )}

                      {dest.safety_advisory && (
                        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300/90 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{dest.safety_advisory}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#23153d] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleQuest(dest.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isInvestigated
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#201538] hover:bg-[#2c1d4d] text-purple-200 border border-[#3b2566]'
                        }`}
                      >
                        {isInvestigated ? '✓ Marked as Researched' : '+ Mark as Researched'}
                      </button>

                      {dest.source_url && (
                        <a
                          href={dest.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <span>Official Heritage Docs</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
