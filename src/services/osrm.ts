export interface RouteResult {
  success: boolean;
  coordinates?: [number, number][]; // [lat, lng]
  distanceKm?: number;
  durationMinutes?: number;
  durationFormatted?: string;
  error?: string;
}

/**
 * Calculates a real driving/expedition route between two geographical coordinates
 * using the Open Source Routing Machine (OSRM).
 *
 * Notice: Coordinates passed to OSRM URL must be in {longitude},{latitude} order,
 * while Leaflet displays routes in [latitude, longitude].
 */
export async function calculateRouteOSRM(
  start: [number, number], // [lat, lng]
  destination: [number, number] // [lat, lng]
): Promise<RouteResult> {
  const [startLat, startLng] = start;
  const [destLat, destLng] = destination;

  // Validation
  if (
    isNaN(startLat) || isNaN(startLng) ||
    isNaN(destLat) || isNaN(destLng) ||
    startLat < -90 || startLat > 90 ||
    destLat < -90 || destLat > 90 ||
    startLng < -180 || startLng > 180 ||
    destLng < -180 || destLng > 180
  ) {
    return {
      success: false,
      error: 'Invalid coordinates provided for route calculation.',
    };
  }

  // Check if points are identical
  if (Math.abs(startLat - destLat) < 0.0001 && Math.abs(startLng - destLng) < 0.0001) {
    return {
      success: false,
      error: 'Starting point and destination are the same location.',
    };
  }

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(osrmUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: 'Route calculation is currently unavailable. Please try again or select another departure point.',
      };
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return {
        success: false,
        error: 'We couldn’t find a route between these locations. Backcountry trails may require foot navigation or an alternative departure point.',
      };
    }

    const primaryRoute = data.routes[0];
    const geoJsonCoords: [number, number][] = primaryRoute.geometry.coordinates;

    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const leafletCoords: [number, number][] = geoJsonCoords.map(([lng, lat]) => [lat, lng]);

    const distanceMeters = primaryRoute.distance;
    const durationSeconds = primaryRoute.duration;

    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
    const durationMinutes = Math.round(durationSeconds / 60);

    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationFormatted =
      hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    return {
      success: true,
      coordinates: leafletCoords,
      distanceKm,
      durationMinutes,
      durationFormatted,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Route calculation took too long to respond. Please check your connection and try again.',
      };
    }
    return {
      success: false,
      error: 'We couldn’t find a route. Try another starting point.',
    };
  }
}
