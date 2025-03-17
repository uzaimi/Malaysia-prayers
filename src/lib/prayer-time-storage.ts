
import { PrayerTime, ZONES } from "./prayer-time";
import { format, parse, addDays } from "date-fns";

// Interface for storing prayer times for a specific day and zone
interface StoredPrayerTime extends PrayerTime {
  zone: string;
  dateKey: string; // YYYY-MM-DD format
}

// Function to download prayer times for a specific zone and date range
async function downloadPrayerTimesForZone(
  zoneCode: string,
  startDate: Date,
  endDate: Date
): Promise<StoredPrayerTime[]> {
  const result: StoredPrayerTime[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = format(currentDate, "yyyy-MM-dd");
    const period = format(currentDate, "yyyy-MM");
    
    try {
      // Using month period API to get all data for the month at once
      const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=${period}&zone=${zoneCode}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prayer times: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "OK!" && data.prayerTime && Array.isArray(data.prayerTime)) {
        // Find the matching date in the returned data
        const foundPrayerTime = data.prayerTime.find(
          (pt: any) => {
            // Convert API date format (e.g. "17-Mar-2025") to our dateKey format (e.g. "2025-03-17")
            try {
              const apiDate = parse(pt.date, "dd-MMM-yyyy", new Date());
              const apiDateKey = format(apiDate, "yyyy-MM-dd");
              return apiDateKey === dateKey;
            } catch (error) {
              return false;
            }
          }
        );
        
        if (foundPrayerTime) {
          result.push({
            fajr: foundPrayerTime.fajr,
            sunrise: foundPrayerTime.syuruk,
            dhuhr: foundPrayerTime.dhuhr || foundPrayerTime.zohor,
            asr: foundPrayerTime.asr,
            maghrib: foundPrayerTime.maghrib,
            isha: foundPrayerTime.isha || foundPrayerTime.isyak,
            date: foundPrayerTime.date,
            zone: zoneCode,
            dateKey
          });
        }
      }
    } catch (error) {
      console.error(`Error downloading prayer time for ${zoneCode} on ${dateKey}:`, error);
    }
    
    // Move to next day
    currentDate = addDays(currentDate, 1);
  }
  
  return result;
}

// Function to download prayer times for all zones for the entire year
export async function downloadAllPrayerTimesFor2025(): Promise<void> {
  const startDate = new Date(2025, 0, 1); // January 1, 2025
  const endDate = new Date(2025, 11, 31); // December 31, 2025
  const allPrayerTimes: StoredPrayerTime[] = [];
  
  // Show progress in console
  console.log("Starting download of prayer times for 2025...");
  
  // Process zones in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < ZONES.length; i += batchSize) {
    const zoneBatch = ZONES.slice(i, i + batchSize);
    
    // Download for each zone in the batch concurrently
    const batchPromises = zoneBatch.map(zone => {
      console.log(`Downloading for zone ${zone.code} (${zone.name})...`);
      return downloadPrayerTimesForZone(zone.code, startDate, endDate);
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(zonePrayerTimes => {
      allPrayerTimes.push(...zonePrayerTimes);
    });
    
    // Simple progress log
    console.log(`Downloaded ${i + batchSize} of ${ZONES.length} zones...`);
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Store all prayer times in localStorage
  try {
    // Group data by zone to make storage more manageable
    const prayerTimesByZone: Record<string, StoredPrayerTime[]> = {};
    
    allPrayerTimes.forEach(prayerTime => {
      if (!prayerTimesByZone[prayerTime.zone]) {
        prayerTimesByZone[prayerTime.zone] = [];
      }
      prayerTimesByZone[prayerTime.zone].push(prayerTime);
    });
    
    // Store each zone separately to avoid localStorage size limits
    Object.entries(prayerTimesByZone).forEach(([zone, zonePrayerTimes]) => {
      localStorage.setItem(`prayerTimes_${zone}_2025`, JSON.stringify(zonePrayerTimes));
    });
    
    // Store a completion flag
    localStorage.setItem('prayerTimesDownloaded2025', 'true');
    console.log("All prayer times for 2025 have been downloaded and stored successfully!");
  } catch (error) {
    console.error("Failed to store prayer times in localStorage:", error);
    throw error;
  }
}

// Function to get stored prayer time for a specific zone and date
export function getStoredPrayerTime(zone: string, date: Date): PrayerTime | null {
  try {
    const dateKey = format(date, "yyyy-MM-dd");
    const year = format(date, "yyyy");
    
    // Get stored data for this zone and year
    const storedData = localStorage.getItem(`prayerTimes_${zone}_${year}`);
    if (!storedData) return null;
    
    const zonePrayerTimes = JSON.parse(storedData) as StoredPrayerTime[];
    const prayerTime = zonePrayerTimes.find(pt => pt.dateKey === dateKey);
    
    return prayerTime || null;
  } catch (error) {
    console.error("Error retrieving stored prayer time:", error);
    return null;
  }
}

// Check if prayer times for 2025 have been downloaded
export function isPrayerTimesDownloaded(): boolean {
  return localStorage.getItem('prayerTimesDownloaded2025') === 'true';
}
