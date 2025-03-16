
import { format } from 'date-fns';
import { PrayerTime } from './types';

// Cache functions to store and retrieve prayer times locally
export function cachePrayerTimes(zone: string, data: PrayerTime): void {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cacheKey = `prayer_times_${zone}_${today}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching prayer times:', error);
  }
}

export function getCachedPrayerTimes(zone: string): PrayerTime | null {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cacheKey = `prayer_times_${zone}_${today}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving cached prayer times:', error);
    return null;
  }
}
