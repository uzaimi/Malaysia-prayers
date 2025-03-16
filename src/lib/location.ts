
// Location service for prayer times app
import { findZoneByCoordinates } from './prayer/api';
import { ZONES, Zone } from './prayer/types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Function to get current user location
export async function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

// Get default location for fallback (Kuala Lumpur)
export function getDefaultLocation(): Coordinates {
  return {
    latitude: 3.139003,
    longitude: 101.686855
  };
}

// Get the closest prayer zone based on coordinates
export async function getClosestPrayerZone(coords: Coordinates): Promise<Zone> {
  try {
    const zoneCode = await findZoneByCoordinates(coords.latitude, coords.longitude);
    const zone = ZONES.find(z => z.code === zoneCode);
    
    if (!zone) {
      throw new Error("Zone not found");
    }
    
    return zone;
  } catch (error) {
    console.error("Error finding closest zone:", error);
    // Default to Kuala Lumpur
    const defaultZone = ZONES.find(z => z.code === "WLY01");
    if (!defaultZone) {
      throw new Error("Default zone not found");
    }
    return defaultZone;
  }
}
