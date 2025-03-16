
import { PrayerTime, PRAYER_ORDER } from './types';

// Function to format time remaining
export function formatTimeRemaining(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
}

// Function to get the current prayer based on the time
export function getCurrentPrayer(prayerTimes: PrayerTime): string | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const prayers = PRAYER_ORDER.map(key => ({
    name: key,
    time: timeToMinutes(prayerTimes[key])
  }));
  
  // Sort prayers by time
  prayers.sort((a, b) => a.time - b.time);
  
  // Find the next prayer
  let currentPrayer = null;
  for (let i = 0; i < prayers.length; i++) {
    if (currentTime < prayers[i].time) {
      // Current time is before this prayer, so the previous one is current
      if (i > 0) {
        currentPrayer = prayers[i - 1].name;
      } else {
        // If we're before the first prayer of the day, the current prayer is the last one from yesterday
        currentPrayer = prayers[prayers.length - 1].name;
      }
      break;
    }
  }
  
  // If we've passed all prayers for the day, the current prayer is the last one
  if (currentPrayer === null) {
    currentPrayer = prayers[prayers.length - 1].name;
  }
  
  return currentPrayer;
}

// Function to find the next prayer
export function getNextPrayer(prayerTimes: PrayerTime): { name: string; timeRemaining: number } | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const prayers = PRAYER_ORDER.map(key => ({
    name: key,
    time: timeToMinutes(prayerTimes[key])
  }));
  
  // Sort prayers by time
  prayers.sort((a, b) => a.time - b.time);
  
  // Find the next prayer
  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return {
        name: prayer.name,
        timeRemaining: prayer.time - currentTime
      };
    }
  }
  
  // If we're after the last prayer of the day, the next prayer is the first one tomorrow
  return {
    name: prayers[0].name,
    timeRemaining: (24 * 60 - currentTime) + prayers[0].time
  };
}

export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${formattedHour}:${minutes} ${ampm}`;
}
