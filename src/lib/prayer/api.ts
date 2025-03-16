
import { format } from 'date-fns';
import { PrayerTime } from './types';
import { cachePrayerTimes, getCachedPrayerTimes } from './cache';
import { getMockPrayerTimes } from './mock-data';

// Function to find a zone by coordinates
export async function findZoneByCoordinates(latitude: number, longitude: number): Promise<string> {
  // This is a simplified version - in a real app, you'd use a more sophisticated
  // algorithm to map coordinates to JAKIM zones.
  
  // For demo purposes, let's just return Kuala Lumpur zone as default
  // In a real app, this would be based on actual geolocation matching
  return "WLY01";
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
