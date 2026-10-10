'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import { ActivityItem, DestinationItem } from '@/data/sampleData';
import { Compass, MapPin, Ghost, Mountain, Eye, ExternalLink, Locate } from 'lucide-react';

interface MapComponentProps {
  activities?: ActivityItem[];
  destinations?: DestinationItem[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string;
  onSelectMarker?: (item: ActivityItem | DestinationItem, type: 'activity' | 'destination') => void;
  showFilters?: boolean;
}

export default function MapComponent({
  activities = [],
  destinations = [],
  center = [46.5, 9.0], // Default center around Alpine region
  zoom = 4,
  height = '560px',
  selectedId,
  onSelectMarker,
  showFilters = true,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'activities' | 'destinations'>('all');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Fix default Leaflet marker icon asset paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && isMounted) {
        // Initialize Map with dark / topographic cartography
        const map = L.map(mapContainerRef.current, {
          center,
          zoom,
          zoomControl: false,
        });

        // Add sleek CartoDB Dark Matter / Voyager tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
      }

      if (mapInstanceRef.current && markersLayerRef.current) {
        renderMarkers(L);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filters or items change
  useEffect(() => {
    if (mapInstanceRef.current) {
      import('leaflet').then((module) => {
        renderMarkers(module.default);
      });
    }
  }, [activities, destinations, activeFilter, selectedId]);

  const renderMarkers = (L: any) => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    const bounds: [number, number][] = [];

    // 1. Render Activities
    if (activeFilter === 'all' || activeFilter === 'activities') {
      activities.forEach((act) => {
        if (!act.latitude || !act.longitude) return;
        const isSelected = selectedId === act.id;
        bounds.push([act.latitude, act.longitude]);

        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: linear-gradient(135deg, #10b981, #047857);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.45);
              border: ${isSelected ? '3px solid #facc15' : '2px solid #ffffff'};
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              <span style="color: white; font-size: 16px; font-weight: bold;">🏔️</span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        });

        const popupHtml = `
          <div style="font-family: sans-serif; min-width: 200px; color: #18181b;">
            <img src="${act.image_url}" alt="${act.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #059669; margin-bottom: 2px;">
              ${act.category} • Difficulty ${act.difficulty}/5
            </div>
            <div style="font-weight: 700; font-size: 13px; line-height: 1.2; margin-bottom: 4px;">
              ${act.name}
            </div>
            <div style="font-size: 11px; color: #52525b; margin-bottom: 8px;">
              📍 ${act.location_name}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; font-weight: 700; color: #047857; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">
                +${act.base_points} pts
              </span>
              <a href="/activities/${act.id}" style="font-size: 11px; font-weight: 700; color: #0284c7; text-decoration: none;">
                View Details &rarr;
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([act.latitude, act.longitude], { icon: customIcon })
          .bindPopup(popupHtml, { maxWidth: 260 })
          .addTo(markersLayerRef.current);

        marker.on('click', () => {
          if (onSelectMarker) onSelectMarker(act, 'activity');
        });
      });
    }

    // 2. Render Destinations (including spooky)
    if (activeFilter === 'all' || activeFilter === 'destinations') {
      destinations.forEach((dest) => {
        if (!dest.latitude || !dest.longitude) return;
        const isSelected = selectedId === dest.id;
        bounds.push([dest.latitude, dest.longitude]);

        const isSpooky = dest.is_spooky;
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: ${
                isSpooky
                  ? 'linear-gradient(135deg, #7c3aed, #4c1d95)'
                  : 'linear-gradient(135deg, #d97706, #92400e)'
              };
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px ${isSpooky ? 'rgba(124, 58, 237, 0.45)' : 'rgba(217, 119, 6, 0.45)'};
              border: ${isSelected ? '3px solid #facc15' : '2px solid #ffffff'};
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              <span style="color: white; font-size: 16px;">${isSpooky ? '👻' : '🏛️'}</span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        });

        const popupHtml = `
          <div style="font-family: sans-serif; min-width: 200px; color: #18181b;">
            <img src="${dest.image_url}" alt="${dest.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${isSpooky ? '#6d28d9' : '#b45309'}; margin-bottom: 2px;">
              ${dest.category.replace('_', ' ')} ${isSpooky ? '• Spooky Legend' : ''}
            </div>
            <div style="font-weight: 700; font-size: 13px; line-height: 1.2; margin-bottom: 4px;">
              ${dest.name}
            </div>
            <div style="font-size: 11px; color: #52525b; margin-bottom: 8px;">
              📍 ${dest.location_name}
            </div>
            ${
              dest.folklore_legend
                ? `<div style="font-size: 10px; font-style: italic; color: #4b5563; margin-bottom: 6px; background: #f3f4f6; padding: 4px; border-radius: 4px;">
                    "${dest.folklore_legend.substring(0, 90)}..."
                   </div>`
                : ''
            }
            <div style="display: flex; justify-content: flex-end;">
              <a href="/brave-enough#${dest.id}" style="font-size: 11px; font-weight: 700; color: #6d28d9; text-decoration: none;">
                Explore Mystery &rarr;
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([dest.latitude, dest.longitude], { icon: customIcon })
          .bindPopup(popupHtml, { maxWidth: 260 })
          .addTo(markersLayerRef.current);

        marker.on('click', () => {
          if (onSelectMarker) onSelectMarker(dest, 'destination');
        });
      });
    }

    // Adjust view if bounds exist
    if (bounds.length > 0 && !selectedId) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);

        if (mapInstanceRef.current) {
          const L = (await import('leaflet')).default;
          mapInstanceRef.current.setView([lat, lng], 10);

          const userIcon = L.divIcon({
            html: `
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #3b82f6;
                border: 3px solid #ffffff;
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
                animation: pulse 2s infinite;
              "></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          L.marker([lat, lng], { icon: userIcon })
            .bindPopup('<b>You are here!</b><br>Exploring nearby trails.')
            .addTo(markersLayerRef.current)
            .openPopup();
        }
      },
      (err) => {
        setGeoLocating(false);
        alert(`Location permission denied or unavailable: ${err.message}`);
      }
    );
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-[#1b2b22]">
      {/* Map Filter Controls Bar */}
      {showFilters && (
        <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 bg-[#0c1611]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#1f382a] shadow-lg">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-300 hover:text-white hover:bg-[#15271d]'
            }`}
          >
            All Pins ({activities.length + destinations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('activities')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeFilter === 'activities'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-300 hover:text-white hover:bg-[#15271d]'
            }`}
          >
            <span>🏔️</span>
            <span>Adventures ({activities.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('destinations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeFilter === 'destinations'
                ? 'bg-purple-600 text-white shadow'
                : 'text-zinc-300 hover:text-white hover:bg-[#15271d]'
            }`}
          >
            <span>👻</span>
            <span>Spooky & Enigmas ({destinations.length})</span>
          </button>
        </div>
      )}

      {/* Locate Me Floating Button */}
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={geoLocating}
        className="absolute top-4 right-4 z-[400] flex items-center gap-1.5 bg-[#0c1611]/90 hover:bg-[#162a1f] text-emerald-300 border border-[#1f382a] px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md transition-all disabled:opacity-50"
      >
        <Locate className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
        <span>{geoLocating ? 'Locating...' : 'Locate Me'}</span>
      </button>

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="bg-[#121c17]" />
    </div>
  );
}
