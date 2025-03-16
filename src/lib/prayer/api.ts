import { format } from 'date-fns';
import { PrayerTime, ZONES } from './types';
import { cachePrayerTimes, getCachedPrayerTimes } from './cache';
import { getMockPrayerTimes } from './mock-data';

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Coordinates for zones (NOTE: These are approximate coordinates for demo purposes)
  const zoneCoordinates: Record<string, [number, number]> = {
    // Kuala Lumpur and surrounding areas
    "WLY01": [3.139003, 101.686855], // KL, Putrajaya
    "SGR01": [3.073621, 101.518929], // Selangor
    "NGS02": [2.719297, 101.942577], // Seremban, NS
    "MLK01": [2.188567, 102.250198], // Melaka
    // Other key zones
    "PNG01": [5.414167, 100.329444], // Penang
    "PRK01": [4.596094, 101.090109], // Perak
    "TRG01": [5.329769, 103.137578], // Terengganu
    "PHG01": [2.818122, 104.225376], // Pahang - Tioman
    "SBH05": [5.976478, 116.072924], // Kota Kinabalu
    "SWK08": [1.553110, 110.345032], // Kuching
    // Adding a few more for better coverage
    "JHR02": [1.485163, 103.761012], // Johor - East
    "KDH01": [6.108990, 100.366777], // Kedah - Kota Setar
    "KTN01": [6.125401, 102.238017], // Kelantan
    "PLS01": [6.443589, 100.216598], // Perlis
    "WLY02": [5.280688, 115.241057], // Labuan
  };
  
  // If we have the zone in our coordinates list, use it
  if (zoneCoordinates[lat2]) {
    const [zoneLat, zoneLon] = zoneCoordinates[lat2];
    lat2 = zoneLat;
    lon2 = zoneLon;
  }
  
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

// Function to find a zone by coordinates
export async function findZoneByCoordinates(latitude: number, longitude: number): Promise<string> {
  // Define approximate center coordinates for each zone (for demo purposes)
  const zoneCoordinates: Record<string, [number, number]> = {
    // Kuala Lumpur and surrounding areas
    "WLY01": [3.139003, 101.686855], // KL, Putrajaya
    "SGR01": [3.073621, 101.518929], // Selangor
    "NGS02": [2.719297, 101.942577], // Seremban, NS
    "MLK01": [2.188567, 102.250198], // Melaka
    // Other key zones
    "PNG01": [5.414167, 100.329444], // Penang
    "PRK01": [4.596094, 101.090109], // Perak
    "TRG01": [5.329769, 103.137578], // Terengganu
    "PHG01": [2.818122, 104.225376], // Pahang - Tioman
    "SBH05": [5.976478, 116.072924], // Kota Kinabalu
    "SWK08": [1.553110, 110.345032], // Kuching
    // Adding a few more for better coverage
    "JHR02": [1.485163, 103.761012], // Johor - East
    "KDH01": [6.108990, 100.366777], // Kedah - Kota Setar
    "KTN01": [6.125401, 102.238017], // Kelantan
    "PLS01": [6.443589, 100.216598], // Perlis
    "WLY02": [5.280688, 115.241057], // Labuan
  };
  
  // Find the closest zone
  let closestZone = "WLY01"; // Default to KL
  let minDistance = Infinity;
  
  for (const [zoneCode, [zoneLat, zoneLon]] of Object.entries(zoneCoordinates)) {
    const distance = calculateDistance(latitude, longitude, zoneLat, zoneLon);
    if (distance < minDistance) {
      minDistance = distance;
      closestZone = zoneCode;
    }
  }
  
  console.log(`Closest zone to coordinates (${latitude}, ${longitude}) is ${closestZone}`);
  return closestZone;
}

// Function to get prayer times from JAKIM e-Solat API
export async function getPrayerTimes(zone: string, date: Date = new Date()): Promise<PrayerTime> {
  try {
    // First try to get data from our cache
    const cachedData = getCachedPrayerTimes(zone);
    if (cachedData) {
      console.log("Using cached prayer times data");
      return cachedData;
    }
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Try to use the API directly first
    try {
      const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${zone}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prayer times: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the response status is "OK!" (the API returns "OK!" not "OK")
      if (data.status === "OK!" && data.prayerTime && data.prayerTime.length > 0) {
        const prayerTimeData = data.prayerTime[0];
        
        const result = {
          fajr: prayerTimeData.fajr,
          sunrise: prayerTimeData.syuruk,
          dhuhr: prayerTimeData.dhuhr || prayerTimeData.zohor, // Handle both possible spellings
          asr: prayerTimeData.asr,
          maghrib: prayerTimeData.maghrib,
          isha: prayerTimeData.isha || prayerTimeData.isyak, // Handle both possible spellings
          date: prayerTimeData.date,
        };
        
        // Cache the data locally
        cachePrayerTimes(zone, result);
        
        return result;
      } else {
        console.error("API Response:", data);
        throw new Error('Invalid data format received from the API');
      }
    } catch (directApiError) {
      console.warn("Direct API request failed, using fallback methods:", directApiError);
      
      // Generate mock data based on zone to simulate different prayer times
      const mockData = getMockPrayerTimes(zone);
      
      // Cache the mock data
      cachePrayerTimes(zone, mockData);
      
      return mockData;
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    
    // Ultimate fallback - return mock data for the requested zone
    return getMockPrayerTimes(zone);
  }
}
