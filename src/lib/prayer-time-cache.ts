
import { format } from "date-fns";
import { PrayerTime, ZONES } from "./prayer-time";

export type CachedPrayerData = {
  [zoneCode: string]: {
    [dateKey: string]: PrayerTime;
  };
};

// In-memory cache to hold prayer times
let prayerTimesCache: CachedPrayerData = {};

// Check if cache is already stored in localStorage
const loadCacheFromStorage = (): void => {
  try {
    const storedCache = localStorage.getItem("prayerTimesCache");
    if (storedCache) {
      prayerTimesCache = JSON.parse(storedCache);
      console.log("Loaded prayer times cache from localStorage");
    }
  } catch (error) {
    console.error("Failed to load prayer times cache:", error);
  }
};

// Initialize by loading from localStorage
loadCacheFromStorage();

// Save current cache to localStorage
const saveCacheToStorage = (): void => {
  try {
    localStorage.setItem("prayerTimesCache", JSON.stringify(prayerTimesCache));
  } catch (error) {
    console.error("Failed to save prayer times cache:", error);
    // If storage quota exceeded, clear cache and try again
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      localStorage.clear();
      try {
        localStorage.setItem("prayerTimesCache", JSON.stringify(prayerTimesCache));
      } catch (retryError) {
        console.error("Still failed to save cache after clearing localStorage:", retryError);
      }
    }
  }
};

// Format date to use as cache key (YYYY-MM-DD)
export const getDateKey = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// Add prayer time to cache
export const cachePrayerTime = (zoneCode: string, date: Date, prayerTime: PrayerTime): void => {
  const dateKey = getDateKey(date);
  
  if (!prayerTimesCache[zoneCode]) {
    prayerTimesCache[zoneCode] = {};
  }
  
  prayerTimesCache[zoneCode][dateKey] = prayerTime;
  saveCacheToStorage();
};

// Get prayer time from cache
export const getCachedPrayerTime = (zoneCode: string, date: Date): PrayerTime | null => {
  const dateKey = getDateKey(date);
  
  if (prayerTimesCache[zoneCode] && prayerTimesCache[zoneCode][dateKey]) {
    return prayerTimesCache[zoneCode][dateKey];
  }
  
  return null;
};

// Check if we have a full year cached for a zone
export const isYearCachedForZone = (zoneCode: string, year: number): boolean => {
  if (!prayerTimesCache[zoneCode]) return false;
  
  // Check if we have 365 (or 366 for leap years) days cached
  const daysInYear = new Date(year, 1, 29).getDate() === 29 ? 366 : 365;
  const dateKeysForYear = Object.keys(prayerTimesCache[zoneCode]).filter(key => 
    key.startsWith(`${year}-`)
  );
  
  return dateKeysForYear.length >= daysInYear;
};

// Bulk download and cache prayer times for a whole year
export const downloadYearData = async (zoneCode: string, year: number): Promise<boolean> => {
  try {
    // Create an array of all days in the year
    const days = [];
    const isLeapYear = new Date(year, 1, 29).getDate() === 29;
    const daysInYear = isLeapYear ? 366 : 365;
    
    const startDate = new Date(year, 0, 1); // Jan 1
    
    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    
    // Fetch prayer times for each day (use batching to avoid too many requests at once)
    const batchSize = 7; // Process a week at a time
    
    for (let i = 0; i < days.length; i += batchSize) {
      const batchDays = days.slice(i, i + batchSize);
      await Promise.all(batchDays.map(async (date) => {
        try {
          // Direct API call - bypass our normal getPrayerTimes function to avoid recursion
          const formattedDate = format(date, 'yyyy-MM-dd');
          const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=date&zone=${zoneCode}&date=${formattedDate}`;
          
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
          
          if (data.status === "OK!" && data.prayerTime && data.prayerTime.length > 0) {
            const prayerTimeData = data.prayerTime[0];
            
            const prayerTime: PrayerTime = {
              fajr: prayerTimeData.fajr,
              sunrise: prayerTimeData.syuruk,
              dhuhr: prayerTimeData.dhuhr || prayerTimeData.zohor,
              asr: prayerTimeData.asr,
              maghrib: prayerTimeData.maghrib,
              isha: prayerTimeData.isha || prayerTimeData.isyak,
              date: prayerTimeData.date,
            };
            
            cachePrayerTime(zoneCode, date, prayerTime);
          }
        } catch (error) {
          console.error(`Failed to fetch prayer time for ${date}:`, error);
        }
      }));
      
      // Add a small delay between batches to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    saveCacheToStorage();
    return true;
  } catch (error) {
    console.error("Failed to download year data:", error);
    return false;
  }
};

// Download all zones for a specific year
export const downloadAllZonesForYear = async (year: number, onProgress?: (progress: number) => void): Promise<boolean> => {
  try {
    const totalZones = ZONES.length;
    let completedZones = 0;
    
    for (const zone of ZONES) {
      await downloadYearData(zone.code, year);
      completedZones++;
      
      if (onProgress) {
        onProgress((completedZones / totalZones) * 100);
      }
    }
    
    saveCacheToStorage();
    return true;
  } catch (error) {
    console.error("Failed to download all zones:", error);
    return false;
  }
};

// Clear all cached data
export const clearCache = (): void => {
  prayerTimesCache = {};
  localStorage.removeItem("prayerTimesCache");
};

// Get cache stats
export const getCacheStats = (): { totalZones: number, totalDays: number, sizeInBytes: number } => {
  const zones = Object.keys(prayerTimesCache);
  let totalDays = 0;
  
  zones.forEach(zone => {
    totalDays += Object.keys(prayerTimesCache[zone]).length;
  });
  
  const sizeInBytes = new Blob([JSON.stringify(prayerTimesCache)]).size;
  
  return {
    totalZones: zones.length,
    totalDays,
    sizeInBytes
  };
};
