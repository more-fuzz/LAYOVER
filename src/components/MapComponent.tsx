'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import { ActivityItem, DestinationItem } from '@/data/sampleData';
import { calculateRouteOSRM, RouteResult } from '@/services/osrm';
import { Icon } from '@/components/ui/Icon';

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
  isAfterDark?: boolean;
  locateTarget?: [number, number] | null;
}

const PRESET_ORIGINS: { label: string; coords: [number, number] }[] = [
  { label: 'Dehradun Hub', coords: [30.3165, 78.0322] },
  { label: 'New Delhi HQ', coords: [28.6139, 77.209] },
  { label: 'Bengaluru Base', coords: [12.9716, 77.5946] },
  { label: 'Manali Trailhead', coords: [32.2396, 77.1887] },
  { label: 'Jaipur Gateway', coords: [26.9124, 75.7873] },
  { label: 'Zurich Central', coords: [47.3769, 8.5417] },
];

export default function MapComponent({
  activities = [],
  destinations = [],
  center = [28.5, 78.5],
  zoom = 5,
  height = '580px',
  selectedId,
  onSelectMarker,
  showFilters = false,
  enableRouting = true,
  isAfterDark = false,
  locateTarget = null,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const initialFitDoneRef = useRef(false);

  const [activeFilter, setActiveFilter] = useState<'all' | 'activities' | 'destinations'>('all');

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

  // Initialize Leaflet Map once
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && isMounted) {
        const map = L.map(mapContainerRef.current, {
          center,
          zoom,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        const routeLayer = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
        routeLayerRef.current = routeLayer;

        renderMarkers(L);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        routeLayerRef.current = null;
      }
    };
  }, []);

  // ResizeObserver: handle container resizing, mobile drawer/view toggles without recreating the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let resizeTimer: any = null;
    const handleResize = () => {
      if (mapInstanceRef.current) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize({ debounceMoveend: true });
          }
        }, 50);
      }
    };

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(handleResize);
      observer.observe(mapContainerRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Re-render marker visuals when props or selection change (without viewport movement)
  useEffect(() => {
    if (mapInstanceRef.current) {
      import('leaflet').then((module) => {
        renderMarkers(module.default);
      });
    }
  }, [activities, destinations, activeFilter, selectedId, isAfterDark]);

  // Handle explicit user-initiated locate actions
  useEffect(() => {
    if (locateTarget && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(locateTarget, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [locateTarget]);

  // Sync selectedId with destination for routing info
  useEffect(() => {
    if (selectedId) {
      const act = activities.find((a) => a.id === selectedId);
      if (act) {
        setSelectedDestination(act);
        return;
      }
      const dest = destinations.find((d) => d.id === selectedId);
      if (dest) {
        setSelectedDestination(dest);
      }
    }
  }, [selectedId, activities, destinations]);

  const renderMarkers = (L: any) => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    const bounds: [number, number][] = [];
    const pinColor = isAfterDark ? '#D8F23C' : '#FF5A1F';
    const pinTextColor = '#0F1F1A';

    // 1. Activities Markers
    if (activeFilter === 'all' || activeFilter === 'activities') {
      activities.forEach((act) => {
        if (!act.latitude || !act.longitude) return;
        const isSelected = selectedId === act.id;
        bounds.push([act.latitude, act.longitude]);

        const customIcon = L.divIcon({
          className: 'field-map-pin',
          html: `
            <button
              type="button"
              aria-label="${act.name}"
              style="
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                position: relative;
              "
            >
              ${
                isSelected
                  ? `<span style="
                      position: absolute;
                      width: 32px;
                      height: 32px;
                      border-radius: 50%;
                      background: ${pinColor};
                      opacity: 0.4;
                      animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></span>`
                  : ''
              }
              <span style="
                width: ${isSelected ? '26px' : '20px'};
                height: ${isSelected ? '26px' : '20px'};
                border-radius: 50%;
                background: ${pinColor};
                color: ${pinTextColor};
                border: 2px solid #0F1F1A;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(15, 31, 26, 0.35);
                transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
                transition: transform 0.2s cubic-bezier(.2,.8,.2,1);
              ">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #0F1F1A;"></span>
              </span>
            </button>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          popupAnchor: [0, -22],
        });

        const marker = L.marker([act.latitude, act.longitude], { icon: customIcon })
          .addTo(markersLayerRef.current);

        marker.on('click', () => {
          setSelectedDestination(act);
          if (onSelectMarker) onSelectMarker(act, 'activity');
        });
      });
    }

    // 2. Destinations Markers (Folklore / Spooky)
    if (activeFilter === 'all' || activeFilter === 'destinations') {
      destinations.forEach((dest) => {
        if (!dest.latitude || !dest.longitude) return;
        const isSelected = selectedId === dest.id;
        bounds.push([dest.latitude, dest.longitude]);
        const destColor = isAfterDark ? '#D8F23C' : '#B8390A';

        const customIcon = L.divIcon({
          className: 'field-map-pin',
          html: `
            <button
              type="button"
              aria-label="${dest.name}"
              style="
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                position: relative;
              "
            >
              ${
                isSelected
                  ? `<span style="
                      position: absolute;
                      width: 32px;
                      height: 32px;
                      border-radius: 50%;
                      background: ${destColor};
                      opacity: 0.4;
                      animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></span>`
                  : ''
              }
              <span style="
                width: ${isSelected ? '26px' : '20px'};
                height: ${isSelected ? '26px' : '20px'};
                border-radius: 6px;
                background: ${destColor};
                color: #0F1F1A;
                border: 2px solid #0F1F1A;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(15, 31, 26, 0.35);
                transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
                transition: transform 0.2s cubic-bezier(.2,.8,.2,1);
              ">
                <span style="width: 5px; height: 5px; border-radius: 1px; background: #0F1F1A;"></span>
              </span>
            </button>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          popupAnchor: [0, -22],
        });

        const marker = L.marker([dest.latitude, dest.longitude], { icon: customIcon })
          .addTo(markersLayerRef.current);

        marker.on('click', () => {
          setSelectedDestination(dest);
          if (onSelectMarker) onSelectMarker(dest, 'destination');
        });
      });
    }

    // Only perform automatic fit/view once on the initial load of markers
    if (!initialFitDoneRef.current) {
      if (selectedId) {
        const selectedItem =
          activities.find((a) => a.id === selectedId) ||
          destinations.find((d) => d.id === selectedId);
        if (selectedItem?.latitude && selectedItem?.longitude) {
          mapInstanceRef.current.setView(
            [selectedItem.latitude, selectedItem.longitude],
            Math.max(zoom, 8)
          );
          initialFitDoneRef.current = true;
          return;
        }
      }

      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
        initialFitDoneRef.current = true;
      }
    }
    // Subsequent re-renders deliberately do not move or reset viewport!
  };

  // Explicit user action: Fit all charted waypoints into view
  const handleFitResults = () => {
    if (!mapInstanceRef.current) return;
    const bounds: [number, number][] = [];
    if (activeFilter === 'all' || activeFilter === 'activities') {
      activities.forEach((act) => {
        if (act.latitude && act.longitude) bounds.push([act.latitude, act.longitude]);
      });
    }
    if (activeFilter === 'all' || activeFilter === 'destinations') {
      destinations.forEach((dest) => {
        if (dest.latitude && dest.longitude) bounds.push([dest.latitude, dest.longitude]);
      });
    }
    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    }
  };

  // Explicit user action: Center map on selected waypoint
  const handleLocateSelected = () => {
    if (!mapInstanceRef.current || !selectedDestination) return;
    if (selectedDestination.latitude && selectedDestination.longitude) {
      mapInstanceRef.current.panTo([selectedDestination.latitude, selectedDestination.longitude], {
        animate: true,
        duration: 0.5,
      });
    }
  };

  // Route calculation
  const handleCalculateRoute = async () => {
    if (!selectedDestination || !selectedDestination.latitude || !selectedDestination.longitude) {
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

      const polyline = L.polyline(result.coordinates, {
        color: '#FF5A1F',
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
    <div
      className={`relative z-0 isolate w-full rounded-[var(--radius-lg,22px)] overflow-hidden border-[1.5px] border-[var(--ink,#0F1F1A)] ${
        isAfterDark ? 'map-after-dark' : ''
      }`}
      style={{ minHeight: height, height }}
    >
      {/* Map Control Toolbar: After Dark indicator, Fit results, Locate */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        {/* After Dark Indicator Banner */}
        {isAfterDark && (
          <div className="bg-[var(--ink,#0F1F1A)] text-[var(--citron,#D8F23C)] border border-[var(--citron,#D8F23C)] px-3 py-1.5 rounded-[var(--radius-sm,8px)] font-mono-label text-[11px] font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[var(--citron,#D8F23C)]" aria-hidden="true" />
            <span>AFTER DARK MODE</span>
          </div>
        )}

        {/* Explicit Fit Results Button */}
        <button
          type="button"
          onClick={handleFitResults}
          title="Fit charted waypoints into view"
          aria-label="Fit results into viewport"
          className="btn-field bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] border border-[var(--ink,#0F1F1A)] shadow-md text-[11px] font-mono-label font-bold py-1.5 px-3 flex items-center gap-1.5 hover:bg-[var(--sand,#EADFC8)] transition-all cursor-pointer"
        >
          <Icon name="route" size={12} aria-hidden="true" />
          <span>Fit results</span>
        </button>

        {/* Explicit Locate Waypoint Button (only when an item is selected) */}
        {selectedDestination && selectedDestination.latitude && (
          <button
            type="button"
            onClick={handleLocateSelected}
            title={`Locate ${selectedDestination.name}`}
            aria-label={`Locate ${selectedDestination.name}`}
            className="btn-field bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] border border-[var(--ink,#0F1F1A)] shadow-md text-[11px] font-mono-label font-bold py-1.5 px-3 flex items-center gap-1.5 hover:bg-[var(--sand,#EADFC8)] transition-all cursor-pointer"
          >
            <Icon name="compass" size={12} aria-hidden="true" />
            <span>Locate</span>
          </button>
        )}
      </div>

      {/* Route Direction Panel (Accessible overlay if routing active) */}
      {enableRouting && selectedDestination && (
        <div className="absolute top-4 right-4 z-20 max-w-xs bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] p-3 rounded-[var(--radius,14px)] shadow-lg text-xs space-y-2">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-[var(--muted,#5E675F)]">
            <span>ROUTE PLANNER</span>
            {routeResult && (
              <button
                type="button"
                onClick={handleClearRoute}
                className="text-[var(--flame,#FF5A1F)] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="font-display font-bold text-[var(--ink,#0F1F1A)] truncate">
            To: {selectedDestination.name}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <select
              value={`${selectedOriginCoords[0]},${selectedOriginCoords[1]}`}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',').map(Number);
                setSelectedOriginCoords([lat, lng]);
              }}
              className="w-full bg-[var(--sand,#EADFC8)] border border-[var(--line,#D8CBB0)] rounded p-1 text-[11px] font-mono-label"
              aria-label="Departure point"
            >
              {PRESET_ORIGINS.map((o) => (
                <option key={o.label} value={`${o.coords[0]},${o.coords[1]}`}>
                  From: {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleCalculateRoute}
            disabled={routingLoading}
            className="w-full btn-field btn-flame text-xs py-1.5 min-h-[38px] font-bold mt-1"
          >
            {routingLoading ? 'Calculating...' : 'Calculate Trail Route'}
          </button>

          {/* Route results */}
          {routeResult && (
            <div className="pt-2 border-t border-[var(--line,#D8CBB0)] space-y-1">
              {routeResult.success ? (
                <div className="font-mono-label text-[11px] text-[var(--ink,#0F1F1A)]">
                  <div>Distance: <span className="font-bold tabular-nums">{routeResult.distanceKm} km</span></div>
                  <div>Estimated time: <span className="font-bold tabular-nums">~{routeResult.durationFormatted || `${routeResult.durationMinutes} min`}</span></div>
                </div>
              ) : (
                <div className="text-[11px] text-[var(--folklore,#B8390A)]">
                  {routeResult.error || 'Unable to chart route between selected points.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: height, height }} />
    </div>
  );
}
