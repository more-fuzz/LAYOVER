'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import { ActivityItem, DestinationItem } from '@/data/sampleData';
import { calculateRouteOSRM, RouteResult } from '@/services/osrm';
import {
  Compass,
  MapPin,
  Ghost,
  Mountain,
  Navigation,
  Locate,
  X,
  AlertCircle,
  Clock,
  Milestone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface MapComponentProps {
  activities?: ActivityItem[];
  destinations?: DestinationItem[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string;
  onSelectMarker?: (item: ActivityItem | DestinationItem, type: 'activity' | 'destination') => void;
  showFilters?: boolean;
  enableRouting?: boolean;
}

const PRESET_ORIGINS: { label: string; coords: [number, number] }[] = [
  { label: 'Dehradun Hub (Uttarakhand)', coords: [30.3165, 78.0322] },
  { label: 'New Delhi HQ', coords: [28.6139, 77.209] },
  { label: 'Bengaluru Southern Base', coords: [12.9716, 77.5946] },
  { label: 'Manali Trailhead', coords: [32.2396, 77.1887] },
  { label: 'Jaipur Gateway', coords: [26.9124, 75.7873] },
  { label: 'Zurich Central (Europe)', coords: [47.3769, 8.5417] },
];

export default function MapComponent({
  activities = [],
  destinations = [],
  center = [28.5, 78.5], // Centered around North India by default
  zoom = 5,
  height = '580px',
  selectedId,
  onSelectMarker,
  showFilters = true,
  enableRouting = true,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'activities' | 'destinations'>('all');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // Routing state
  const [selectedDestination, setSelectedDestination] = useState<
    ActivityItem | DestinationItem | null
  >(null);
  const [selectedOriginCoords, setSelectedOriginCoords] = useState<[number, number]>(
    PRESET_ORIGINS[0].coords
  );
  const [originLabel, setOriginLabel] = useState<string>(PRESET_ORIGINS[0].label);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingPanelOpen, setRoutingPanelOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Fix Leaflet marker icon asset paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && isMounted) {
        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center,
          zoom,
          zoomControl: false,
        });

        // Add standard OpenStreetMap tiles with verified attribution
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        const routeLayer = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
        routeLayerRef.current = routeLayer;
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

  // Set destination if selectedId changes from external click
  useEffect(() => {
    if (selectedId) {
      const act = activities.find((a) => a.id === selectedId);
      if (act) {
        setSelectedDestination(act);
        setRoutingPanelOpen(true);
        return;
      }
      const dest = destinations.find((d) => d.id === selectedId);
      if (dest) {
        setSelectedDestination(dest);
        setRoutingPanelOpen(true);
      }
    }
  }, [selectedId, activities, destinations]);

  const renderMarkers = (L: any) => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    const bounds: [number, number][] = [];

    // 1. Activities (Muted Olive & Badge Marker)
    if (activeFilter === 'all' || activeFilter === 'activities') {
      activities.forEach((act) => {
        if (!act.latitude || !act.longitude) return;
        const isSelected = selectedId === act.id;
        bounds.push([act.latitude, act.longitude]);

        const customIcon = L.divIcon({
          className: 'retro-leaflet-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: #777A53;
              color: #FFFDF8;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(41, 40, 32, 0.35);
              border: ${isSelected ? '3px solid #B85F43' : '2px solid #FFFDF8'};
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              <span style="font-size: 14px;">🏔️</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const popupHtml = `
          <div style="font-family: inherit; min-width: 220px; color: #292820; padding: 2px;">
            <div style="width: 100%; height: 95px; overflow: hidden; border-radius: 6px; margin-bottom: 8px; background: #EAE1D3; border: 1px solid #D6CCBC;">
              <img src="${act.image_url}" alt="${act.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
            </div>
            <div style="font-size: 10px; font-family: monospace; font-weight: bold; text-transform: uppercase; color: #777A53; margin-bottom: 2px;">
              ${act.category} • DIFF ${act.difficulty}/5
            </div>
            <div style="font-weight: 700; font-size: 13px; line-height: 1.25; margin-bottom: 4px; color: #292820;">
              ${act.name}
            </div>
            <div style="font-size: 11px; color: #6D685C; margin-bottom: 8px;">
              📍 ${act.location_name}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #D6CCBC; padding-top: 6px;">
              <span style="font-size: 10px; font-family: monospace; font-weight: bold; color: #B85F43;">
                +${act.base_points} PTS
              </span>
              <a href="/activities/${act.id}" style="font-size: 11px; font-weight: bold; color: #777A53; text-decoration: underline;">
                Field Details &rarr;
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([act.latitude, act.longitude], { icon: customIcon })
          .bindPopup(popupHtml, { maxWidth: 260 })
          .addTo(markersLayerRef.current);

        marker.on('click', () => {
          setSelectedDestination(act);
          if (onSelectMarker) onSelectMarker(act, 'activity');
        });
      });
    }

    // 2. Destinations & Folklore (Terracotta & Dark Stamp Marker)
    if (activeFilter === 'all' || activeFilter === 'destinations') {
      destinations.forEach((dest) => {
        if (!dest.latitude || !dest.longitude) return;
        const isSelected = selectedId === dest.id;
        bounds.push([dest.latitude, dest.longitude]);

        const customIcon = L.divIcon({
          className: 'retro-leaflet-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: #B85F43;
              color: #FFFDF8;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(41, 40, 32, 0.35);
              border: ${isSelected ? '3px solid #777A53' : '2px solid #FFFDF8'};
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              <span style="font-size: 14px;">${dest.is_spooky ? '👻' : '🏛️'}</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const popupHtml = `
          <div style="font-family: inherit; min-width: 220px; color: #292820; padding: 2px;">
            <div style="width: 100%; height: 95px; overflow: hidden; border-radius: 6px; margin-bottom: 8px; background: #EAE1D3; border: 1px solid #D6CCBC;">
              <img src="${dest.image_url}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
            </div>
            <div style="font-size: 10px; font-family: monospace; font-weight: bold; text-transform: uppercase; color: #B85F43; margin-bottom: 2px;">
              ${dest.category.replace('_', ' ')} ${dest.is_spooky ? '• FOLKLORE' : ''}
            </div>
            <div style="font-weight: 700; font-size: 13px; line-height: 1.25; margin-bottom: 4px; color: #292820;">
              ${dest.name}
            </div>
            <div style="font-size: 11px; color: #6D685C; margin-bottom: 6px;">
              📍 ${dest.location_name}
            </div>
            <div style="display: flex; justify-content: flex-end; border-top: 1px solid #D6CCBC; padding-top: 6px;">
              <a href="/brave-enough#${dest.id}" style="font-size: 11px; font-weight: bold; color: #B85F43; text-decoration: underline;">
                Field Record &rarr;
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([dest.latitude, dest.longitude], { icon: customIcon })
          .bindPopup(popupHtml, { maxWidth: 260 })
          .addTo(markersLayerRef.current);

        marker.on('click', () => {
          setSelectedDestination(dest);
          if (onSelectMarker) onSelectMarker(dest, 'destination');
        });
      });
    }

    if (bounds.length > 0 && !selectedId) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    }
  };

  // Explicit user-driven Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);
        setSelectedOriginCoords([lat, lng]);
        setOriginLabel('My Verified Location');

        if (mapInstanceRef.current) {
          const L = (await import('leaflet')).default;
          mapInstanceRef.current.setView([lat, lng], 10);

          const userIcon = L.divIcon({
            html: `
              <div style="
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #B85F43;
                border: 3px solid #FFFDF8;
                box-shadow: 0 0 10px rgba(184, 95, 67, 0.7);
              "></div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          L.marker([lat, lng], { icon: userIcon })
            .bindPopup('<b>Explorer Position</b><br>Coordinates calibrated.')
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

  // OSRM Route Calculation Execution
  const handleCalculateRoute = async () => {
    if (!selectedDestination || !selectedDestination.latitude || !selectedDestination.longitude) {
      alert('Please select a destination activity or marker on the map first.');
      return;
    }

    setRoutingLoading(true);
    setRouteResult(null);

    const startCoords: [number, number] = selectedOriginCoords;
    const destCoords: [number, number] = [
      selectedDestination.latitude,
      selectedDestination.longitude,
    ];

    const result = await calculateRouteOSRM(startCoords, destCoords);
    setRoutingLoading(false);
    setRouteResult(result);

    if (result.success && result.coordinates && mapInstanceRef.current && routeLayerRef.current) {
      const L = (await import('leaflet')).default;
      routeLayerRef.current.clearLayers();

      // Render terracotta dashed expedition route polyline
      const polyline = L.polyline(result.coordinates, {
        color: '#B85F43',
        weight: 4,
        opacity: 0.9,
        dashArray: '6, 6',
      }).addTo(routeLayerRef.current);

      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  };

  const handleClearRoute = () => {
    setRouteResult(null);
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#D6CCBC] bg-[#FFFDF8] shadow-sm">
      {/* Top Filter Bar */}
      {showFilters && (
        <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-1.5 bg-[#FFFDF8]/95 backdrop-blur-xs p-1 rounded-xl border border-[#D6CCBC] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#777A53] text-white'
                : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3]'
            }`}
          >
            All Waypoints ({activities.length + destinations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('activities')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeFilter === 'activities'
                ? 'bg-[#777A53] text-white'
                : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3]'
            }`}
          >
            <span>🏔️</span>
            <span>Adventures ({activities.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('destinations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeFilter === 'destinations'
                ? 'bg-[#B85F43] text-white'
                : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3]'
            }`}
          >
            <span>👻</span>
            <span>Folklore ({destinations.length})</span>
          </button>
        </div>
      )}

      {/* Top Right Controls: Route Drawer & Locate Me */}
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2">
        {enableRouting && (
          <button
            type="button"
            onClick={() => setRoutingPanelOpen(!routingPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border transition-colors ${
              routingPanelOpen
                ? 'bg-[#B85F43] text-white border-[#B85F43]'
                : 'bg-[#FFFDF8]/95 text-[#292820] border-[#D6CCBC] hover:bg-[#EAE1D3]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Planner (OSRM)</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={geoLocating}
          className="flex items-center gap-1.5 bg-[#FFFDF8]/95 hover:bg-[#EAE1D3] text-[#777A53] border border-[#D6CCBC] px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          title="Detect my current location with browser permission"
        >
          <Locate className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
          <span>{geoLocating ? 'Calibrating...' : 'My Location'}</span>
        </button>
      </div>

      {/* OSRM Route Calculation Floating Drawer */}
      {enableRouting && routingPanelOpen && (
        <div className="absolute top-16 right-4 z-[450] w-80 sm:w-96 bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-xl shadow-lg p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#777A53] uppercase">
              <Compass className="w-4 h-4 text-[#B85F43]" />
              <span>OSRM Expedition Routing</span>
            </div>
            <button
              type="button"
              onClick={() => setRoutingPanelOpen(false)}
              className="text-[#6D685C] hover:text-[#292820] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Origin Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#6D685C] block">
              1. Expedition Departure Point:
            </label>
            <select
              value={originLabel}
              onChange={(e) => {
                const found = PRESET_ORIGINS.find((p) => p.label === e.target.value);
                if (found) {
                  setSelectedOriginCoords(found.coords);
                  setOriginLabel(found.label);
                } else if (userCoords && e.target.value === 'My Verified Location') {
                  setSelectedOriginCoords(userCoords);
                  setOriginLabel('My Verified Location');
                }
              }}
              className="w-full text-xs bg-[#F5F0E7] border border-[#D6CCBC] rounded-md px-2.5 py-1.5 text-[#292820] focus:outline-hidden"
            >
              {userCoords && <option value="My Verified Location">My Verified Location</option>}
              {PRESET_ORIGINS.map((hub) => (
                <option key={hub.label} value={hub.label}>
                  {hub.label}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#6D685C] block">
              2. Target Trail / Destination:
            </label>
            {selectedDestination ? (
              <div className="p-2 bg-[#F5F0E7] border border-[#D6CCBC] rounded-md flex items-center justify-between text-xs">
                <div className="truncate font-semibold text-[#292820]">
                  📍 {selectedDestination.name}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDestination(null)}
                  className="text-[10px] text-[#B85F43] font-mono underline ml-2 shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <select
                onChange={(e) => {
                  const act = activities.find((a) => a.id === e.target.value);
                  if (act) setSelectedDestination(act);
                  else {
                    const dest = destinations.find((d) => d.id === e.target.value);
                    if (dest) setSelectedDestination(dest);
                  }
                }}
                defaultValue=""
                className="w-full text-xs bg-[#F5F0E7] border border-[#D6CCBC] rounded-md px-2.5 py-1.5 text-[#292820] focus:outline-hidden"
              >
                <option value="" disabled>
                  Click a map pin or select here...
                </option>
                <optgroup label="Adventures">
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.location_name})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Folklore Dest.">
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.location_name})
                    </option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>

          {/* Action Row */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleCalculateRoute}
              disabled={routingLoading || !selectedDestination}
              className="btn-journal-terracotta flex-1 text-xs py-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{routingLoading ? 'Calculating OSRM...' : 'Calculate Route'}</span>
            </button>

            {routeResult && (
              <button
                type="button"
                onClick={handleClearRoute}
                className="btn-journal-secondary text-xs px-3 py-2"
                title="Clear route polyline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Route Metrics Result Box */}
          {routeResult && (
            <div className="mt-2 p-3 bg-[#EAE1D3]/60 border border-[#D6CCBC] rounded-lg space-y-1.5 text-xs">
              {routeResult.success ? (
                <>
                  <div className="flex items-center justify-between text-[#777A53] font-bold font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Milestone className="w-3.5 h-3.5 text-[#B85F43]" />
                      <span>Distance: {routeResult.distanceKm} km</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#777A53]" />
                      <span>Travel: {routeResult.durationFormatted}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6D685C] leading-snug">
                    * Route computed via OpenStreetMap road network. High mountain trails may require trekking permits and pack transport.
                  </p>
                </>
              ) : (
                <div className="text-[#B85F43] flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight">
                    {routeResult.error || 'Navigable route calculation failed.'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="bg-[#EAE1D3]" />
    </div>
  );
}
