
import { format } from 'date-fns';
import { PrayerTime } from './types';

// Simple mock function for development - more sophisticated version with zone-based variations
export function getMockPrayerTimes(zone: string = "WLY01"): PrayerTime {
  // Base times that we'll adjust slightly based on zone to simulate regional differences
  const baseTimes = {
    fajr: '05:45',
    sunrise: '07:01',
    dhuhr: '13:15',
    asr: '16:30',
    maghrib: '19:25',
    isha: '20:40',
  };
  
  // Add some slight variations based on the zone code to simulate different regions
  // This is just for simulation - real prayer times vary much more based on location
  const zoneDigits = zone.replace(/\D/g, '');
  const zoneOffset = parseInt(zoneDigits, 10) % 5; // Get a number between 0-4
  
  // Adjust minutes by zone for more realistic regional variations
  const adjustTime = (time: string, minutesOffset: number): string => {
    const [hours, minutes] = time.split(':').map(Number);
    let newMinutes = minutes + minutesOffset;
    let newHours = hours;
    
    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    } else if (newMinutes < 0) {
      newMinutes += 60;
      newHours -= 1;
    }
    
    if (newHours >= 24) newHours -= 24;
    if (newHours < 0) newHours += 24;
    
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };
  
  return {
    fajr: adjustTime(baseTimes.fajr, zoneOffset - 2),
    sunrise: adjustTime(baseTimes.sunrise, zoneOffset - 1),
    dhuhr: adjustTime(baseTimes.dhuhr, zoneOffset),
    asr: adjustTime(baseTimes.asr, zoneOffset + 1),
    maghrib: adjustTime(baseTimes.maghrib, zoneOffset + 2),
    isha: adjustTime(baseTimes.isha, zoneOffset + 3),
    date: format(new Date(), 'yyyy-MM-dd'),
  };
}
