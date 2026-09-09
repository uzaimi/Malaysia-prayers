
import { ZONES, type Zone } from './prayer-time';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Function to get current user location
export async function getCurrentLocation(signal?: AbortSignal): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (window.isSecureContext === false) {
      reject(new Error('Location requires HTTPS. Open the secure version of this website.'));
      return;
    }
    if (!navigator.geolocation) {
      reject(new Error('This browser does not support location. Please select your area manually.'));
      return;
    }
    const abort = () => reject(new DOMException('Location request cancelled', 'AbortError'));
    if (signal?.aborted) { abort(); return; }
    signal?.addEventListener('abort', abort, { once: true });
    const cleanup = () => signal?.removeEventListener('abort', abort);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        cleanup();
        if (signal?.aborted) return;
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        cleanup();
        const messages: Record<number, string> = {
          1: 'Location permission was denied. Allow location in your browser site settings, then try again.',
          2: 'Your device could not find its location. Turn on location services or select your area manually.',
          3: 'Location took too long. Try again near a window or select your area manually.',
        };
        reject(new Error(messages[error.code] ?? 'Unable to get your location. Please select your area manually.'));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

// Waktu Solat resolves Malaysian prayer-zone polygons. Timetables still come from JAKIM.
export async function findZoneByCoordinates(coords: Coordinates, signal?: AbortSignal): Promise<Zone> {
  const { latitude, longitude } = coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Your device returned an invalid location. Please try again.');
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) throw new DOMException('Location request cancelled', 'AbortError');
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 10000);
  try {
    const response = await fetch(`https://api.waktusolat.app/zones/${latitude}/${longitude}`, {
      signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
    });
    const data = await response.json();
    if (data?.error === 'No zone found for the given coordinates.') {
      throw new Error('No Malaysian prayer zone was found here. This app covers Malaysia only; select an area manually.');
    }
    if (!response.ok) throw new Error('The zone lookup service is unavailable. Please try again or select your area manually.');
    const zone = ZONES.find(item => item.code === data?.zone);
    if (!zone) throw new Error('The service returned an unsupported prayer zone. Please select your area manually.');
    return zone;
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Location request cancelled', 'AbortError');
    if (controller.signal.aborted) throw new Error('Zone lookup timed out. Please try again.');
    if (error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error('Could not contact the zone lookup service. Check your connection or select your area manually.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export async function detectCurrentPrayerZone(signal?: AbortSignal) {
  const coords = await getCurrentLocation(signal);
  if (signal?.aborted) throw new DOMException('Location request cancelled', 'AbortError');
  if (coords.accuracy != null && coords.accuracy > 10000) {
    throw new Error('Your device location is too approximate to choose a prayer zone. Try on your phone or select your area manually.');
  }
  const zone = await findZoneByCoordinates(coords, signal);
  return { zone, accuracy: coords.accuracy };
}
