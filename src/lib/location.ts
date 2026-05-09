
// Location service for prayer times app

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
