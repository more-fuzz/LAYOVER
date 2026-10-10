'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import SafeImage from '@/components/SafeImage';
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
  CheckCircle2,
  HelpCircle,
  FileText,
} from 'lucide-react';

export default function BraveEnoughPage() {
  const spookyDestinations = SAMPLE_DESTINATIONS.filter((d) => d.is_spooky);
  const [selectedDestId, setSelectedDestId] = useState<string | undefined>(undefined);
  const [investigatedIds, setInvestigatedIds] = useState<string[]>([]);

  const toggleInvestigated = (id: string) => {
    if (investigatedIds.includes(id)) {
      setInvestigatedIds(investigatedIds.filter((item) => item !== id));
    } else {
      setInvestigatedIds([...investigatedIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-10">
      {/* Editorial Header Banner */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CCBC] pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#B85F43] bg-[#EAE1D3] px-3 py-1 rounded-md border border-[#D6CCBC]">
            <Ghost className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>FIELD FOLKLORE & ANCIENT MYSTERIES</span>
          </div>
          <span className="retro-stamp text-[10px]">DAYLIGHT HERITAGE STUDY</span>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#292820] font-sans leading-tight">
            &quot;Am I Brave Enough?&quot; Field Studies
          </h1>
          <p className="text-sm sm:text-base text-[#6D685C] leading-relaxed">
            A restrained exploration of the world&apos;s most intriguing geological enigmas, abandoned
            archaeological citadels, and centuries-old regional folklore. Each dossier separates
            verified historical facts from oral lore.
          </p>

          {/* Strict Safety Protocol Advisory */}
          <div className="p-4 rounded-xl bg-[#EAE1D3]/70 border border-[#D6CCBC] flex items-start gap-3 text-xs text-[#6D685C]">
            <ShieldCheck className="w-5 h-5 text-[#B85F43] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#292820]">Ethical Field Protocol: </span>
              All catalogued sites are officially registered public heritage monuments. We strictly
              forbid night trespassing, violating Archaeological Survey or park guidelines, or treating
              cultural tragedy as entertainment. Always explore during daylight hours with certified guides.
            </div>
          </div>
        </div>
      </div>

      {/* Field Dossier Progress Widget */}
      <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-xl shrink-0">
            📜
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#777A53]">
              Dossier Reconnaissance Tracker
            </div>
            <div className="text-base font-bold text-[#292820] font-sans">
              {investigatedIds.length === spookyDestinations.length
                ? 'Master Folklore Cartographer 🏆'
                : investigatedIds.length > 0
                ? 'Active Field Investigator'
                : 'Curious Historical Wanderer'}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="flex justify-between text-xs font-mono font-bold text-[#6D685C] mb-1.5">
            <span>Dossiers Studied:</span>
            <span>
              {investigatedIds.length} / {spookyDestinations.length} Recorded
            </span>
          </div>
          <div className="w-full bg-[#EAE1D3] h-2.5 rounded-full overflow-hidden border border-[#D6CCBC]">
            <div
              className="bg-[#B85F43] h-full rounded-full transition-all duration-300"
              style={{
                width: `${(investigatedIds.length / spookyDestinations.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Map of Enigmatic Destinations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
          <h2 className="text-lg font-bold text-[#292820] flex items-center gap-2 font-sans">
            <Compass className="w-4 h-4 text-[#777A53]" />
            <span>Map of Approved Enigmatic Locations</span>
          </h2>
          <span className="text-xs font-mono text-[#8E8675]">Route Planning Available</span>
        </div>

        <MapComponent
          destinations={spookyDestinations}
          selectedId={selectedDestId}
          height="480px"
          center={[27.0, 76.0]}
          zoom={4}
          enableRouting={true}
          onSelectMarker={(item) => setSelectedDestId(item.id)}
        />
      </div>

      {/* Detailed Dossiers Grid */}
      <div className="space-y-6 pt-2">
        <div className="border-b border-[#D6CCBC] pb-2">
          <h2 className="text-xl font-bold text-[#292820] font-sans">
            Archaeological & Geological Dossiers
          </h2>
          <p className="text-xs text-[#6D685C]">
            Verified field records, historical timeline context, and documented oral folklore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {spookyDestinations.map((dest) => {
            const isStudied = investigatedIds.includes(dest.id);
            const isFocused = selectedDestId === dest.id;

            return (
              <div
                id={dest.id}
                key={dest.id}
                className={`rounded-2xl bg-[#FFFDF8] border overflow-hidden shadow-xs transition-all ${
                  isFocused
                    ? 'border-[#B85F43] ring-2 ring-[#B85F43]/30'
                    : 'border-[#D6CCBC] hover:border-[#777A53]'
                }`}
              >
                <div className="relative w-full">
                  <SafeImage
                    src={dest.image_url}
                    alt={dest.name}
                    aspectRatio="16/9"
                    fallbackTitle={dest.name}
                  />
                  <div className="absolute top-3 left-3 bg-[#FFFDF8]/90 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#B85F43] uppercase border border-[#D6CCBC]">
                    {dest.category.replace('_', ' ')}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#EAE1D3] text-[#292820] border border-[#D6CCBC] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    DAYLIGHT ONLY
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6D685C] mb-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#B85F43]" />
                      <span>{dest.location_name}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#292820] font-sans">{dest.name}</h3>
                    <p className="text-xs sm:text-sm text-[#6D685C] mt-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  {/* Fact vs Folklore Comparison Box */}
                  <div className="space-y-2.5 pt-2 border-t border-[#D6CCBC]">
                    <div className="p-3 bg-[#F5F0E7] rounded-xl border border-[#D6CCBC] space-y-1">
                      <div className="text-[10px] font-mono font-bold uppercase text-[#777A53] flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Verified Historical & Scientific Context</span>
                      </div>
                      <p className="text-xs text-[#292820] leading-relaxed">
                        {dest.historical_context ||
                          'Registered historical monument with official preservation status.'}
                      </p>
                    </div>

                    {dest.folklore_legend && (
                      <div className="p-3 bg-[#FFFDF8] rounded-xl border border-[#D6CCBC] space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase text-[#B85F43] flex items-center gap-1">
                          <Ghost className="w-3 h-3" />
                          <span>Oral Folklore & Legends (Unverified)</span>
                        </div>
                        <p className="text-xs text-[#6D685C] italic leading-relaxed">
                          &quot;{dest.folklore_legend}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-[#D6CCBC] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleInvestigated(dest.id)}
                      className={`text-xs font-mono font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                        isStudied
                          ? 'bg-[#EAE1D3] text-[#777A53] border border-[#D6CCBC]'
                          : 'btn-journal-secondary'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isStudied ? 'text-[#777A53]' : 'text-[#8E8675]'
                        }`}
                      />
                      <span>{isStudied ? 'Dossier Recorded' : 'Mark as Studied'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDestId(dest.id)}
                      className="text-xs font-bold text-[#B85F43] hover:underline flex items-center gap-1"
                    >
                      <span>Focus on Map</span>
                      <Compass className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
