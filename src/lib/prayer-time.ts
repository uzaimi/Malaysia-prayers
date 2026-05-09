import { format, addDays, addMonths, isSameDay } from 'date-fns';

// Define the zones for Malaysia
export type Zone = {
  code: string;
  name: string;
  state: string;
};

export type ZoneMatch = {
  zone: Zone;
  distanceKm: number;
};

// Prayer time interface
export interface PrayerTime {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

// Define prayer names and their display order
export const PRAYER_NAMES = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha'
};

export const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

// Define JAKIM zones for Malaysia
export const ZONES: Zone[] = [
  { code: "JHR01", name: "Pulau Aur dan Pulau Pemanggil", state: "Johor" },
  { code: "JHR02", name: "Kota Tinggi, Mersing, Johor Bahru", state: "Johor" },
  { code: "JHR03", name: "Kluang, Pontian", state: "Johor" },
  { code: "JHR04", name: "Batu Pahat, Muar, Segamat, Gemas Johor", state: "Johor" },
  { code: "KDH01", name: "Kota Setar, Kubang Pasu, Pokok Sena", state: "Kedah" },
  { code: "KDH02", name: "Pendang, Kuala Muda, Yan", state: "Kedah" },
  { code: "KDH03", name: "Padang Terap, Sik", state: "Kedah" },
  { code: "KDH04", name: "Baling", state: "Kedah" },
  { code: "KDH05", name: "Kulim, Bandar Baharu", state: "Kedah" },
  { code: "KDH06", name: "Langkawi", state: "Kedah" },
  { code: "KDH07", name: "Gunung Jerai", state: "Kedah" },
  { code: "KTN01", name: "Jajahan Kota Bharu, Bachok, Pasir Puteh, Tumpat", state: "Kelantan" },
  { code: "KTN03", name: "Jajahan Machang, Tanah Merah, Pasir Mas, Jeli", state: "Kelantan" },
  { code: "MLK01", name: "Seluruh Negeri Melaka", state: "Melaka" },
  { code: "NGS01", name: "Jempol, Tampin", state: "Negeri Sembilan" },
  { code: "NGS02", name: "Port Dickson, Seremban, Kuala Pilah, Jelebu, Rembau", state: "Negeri Sembilan" },
  { code: "PHG01", name: "Pulau Tioman", state: "Pahang" },
  { code: "PHG02", name: "Rompin, Pekan, Muadzam Shah", state: "Pahang" },
  { code: "PHG03", name: "Maran, Chenor, Temerloh, Bera, Jerantut", state: "Pahang" },
  { code: "PHG04", name: "Bentong, Raub, Kuala Lipis", state: "Pahang" },
  { code: "PHG05", name: "Genting Sempah, Janda Baik, Bukit Tinggi", state: "Pahang" },
  { code: "PHG06", name: "Cameron Highlands, Genting Highlands, Bukit Fraser", state: "Pahang" },
  { code: "PLS01", name: "Kangar, Padang Besar, Arau", state: "Perlis" },
  { code: "PNG01", name: "Seluruh Negeri Pulau Pinang", state: "Pulau Pinang" },
  { code: "PRK01", name: "Tapah, Slim River, Tanjung Malim", state: "Perak" },
  { code: "PRK02", name: "Ipoh, Batu Gajah, Kampar, Sungai Siput, Kuala Kangsar", state: "Perak" },
  { code: "PRK03", name: "Pengkalan Hulu, Grik, Lenggong", state: "Perak" },
  { code: "PRK04", name: "Temengor, Belum", state: "Perak" },
  { code: "PRK05", name: "Teluk Intan, Bagan Datuk, Kampung Gajah, Sri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor", state: "Perak" },
  { code: "PRK06", name: "Selama, Taiping, Bagan Serai, Parit Buntar", state: "Perak" },
  { code: "PRK07", name: "Bukit Larut", state: "Perak" },
  { code: "SBH01", name: "Bahagian Sandakan (Timur)", state: "Sabah" },
  { code: "SBH02", name: "Bahagian Tawau (Timur)", state: "Sabah" },
  { code: "SBH03", name: "Lahad Datu, Kunak, Silam, Tungku, Sahabat, Semporna", state: "Sabah" },
  { code: "SBH04", name: "Bahagian Kudat", state: "Sabah" },
  { code: "SBH05", name: "Kota Kinabalu, Penampang, Putatan, Tuaran, Papar, Kota Belud", state: "Sabah" },
  { code: "SBH06", name: "Gunung Kinabalu", state: "Sabah" },
  { code: "SBH07", name: "Beluran, Telupit, Pinangah, Telupid Sapi, Kuamut", state: "Sabah" },
  { code: "SBH08", name: "Keningau, Tenom, Nabawan, Tambunan", state: "Sabah" },
  { code: "SBH09", name: "Sipitang, Membakut, Beaufort, Kuala Penyu, Weston, Tenom, Long Pa Sia", state: "Sabah" },
  { code: "SGR01", name: "Hulu Selangor, Gombak, Petaling, Sepang, Klang, Kuala Selangor, Sabak Bernam, Hulu Langat, Kuala Langat", state: "Selangor" },
  { code: "SGR02", name: "Sabak Bernam", state: "Selangor" },
  { code: "SGR03", name: "Klang, Kuala Selangor", state: "Selangor" },
  { code: "SGR04", name: "Sepang, Kuala Langat", state: "Selangor" },
  { code: "SWK01", name: "Limbang, Sundar, Trusan", state: "Sarawak" },
  { code: "SWK02", name: "Miri, Niah, Bekenu, Sibuti, Marudi", state: "Sarawak" },
  { code: "SWK03", name: "Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu", state: "Sarawak" },
  { code: "SWK04", name: "Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit", state: "Sarawak" },
  { code: "SWK05", name: "Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai", state: "Sarawak" },
  { code: "SWK06", name: "Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok", state: "Sarawak" },
  { code: "SWK07", name: "Serian, Simunjan, Samarahan, Sebuyau, Sebangan", state: "Sarawak" },
  { code: "SWK08", name: "Kuching, Bau, Lundu, Sematan", state: "Sarawak" },
  { code: "SWK09", name: "Zon Khas (Kampung Patarikan)", state: "Sarawak" },
  { code: "TRG01", name: "Kuala Terengganu, Marang, Kuala Nerus", state: "Terengganu" },
  { code: "TRG02", name: "Besut, Setiu", state: "Terengganu" },
  { code: "TRG03", name: "Hulu Terengganu", state: "Terengganu" },
  { code: "TRG04", name: "Dungun, Kemaman", state: "Terengganu" },
  { code: "WLY01", name: "Kuala Lumpur, Putrajaya", state: "W.P. Kuala Lumpur" },
  { code: "WLY02", name: "Labuan", state: "W.P. Labuan" }
];

type ZoneReferencePoint = {
  zoneCode: string;
  latitude: number;
  longitude: number;
};

// Representative coordinates for each JAKIM zone. Zones can cover several districts,
// so matching uses the closest representative district point.
const ZONE_REFERENCE_POINTS: ZoneReferencePoint[] = [
  { zoneCode: "JHR01", latitude: 2.4406, longitude: 104.5227 },
  { zoneCode: "JHR02", latitude: 1.4927, longitude: 103.7414 },
  { zoneCode: "JHR02", latitude: 2.4312, longitude: 103.8405 },
  { zoneCode: "JHR03", latitude: 2.0251, longitude: 103.3328 },
  { zoneCode: "JHR03", latitude: 1.4854, longitude: 103.3896 },
  { zoneCode: "JHR04", latitude: 1.8548, longitude: 102.9325 },
  { zoneCode: "JHR04", latitude: 2.0442, longitude: 102.5689 },
  { zoneCode: "JHR04", latitude: 2.5148, longitude: 102.8158 },
  { zoneCode: "KDH01", latitude: 6.1248, longitude: 100.3678 },
  { zoneCode: "KDH02", latitude: 5.6436, longitude: 100.4894 },
  { zoneCode: "KDH02", latitude: 5.8078, longitude: 100.3728 },
  { zoneCode: "KDH03", latitude: 6.2559, longitude: 100.5772 },
  { zoneCode: "KDH03", latitude: 5.8212, longitude: 100.7489 },
  { zoneCode: "KDH04", latitude: 5.6781, longitude: 100.9167 },
  { zoneCode: "KDH05", latitude: 5.3655, longitude: 100.5618 },
  { zoneCode: "KDH05", latitude: 5.1327, longitude: 100.4932 },
  { zoneCode: "KDH06", latitude: 6.35, longitude: 99.8 },
  { zoneCode: "KDH07", latitude: 5.7936, longitude: 100.4346 },
  { zoneCode: "KTN01", latitude: 6.1254, longitude: 102.2386 },
  { zoneCode: "KTN01", latitude: 5.8367, longitude: 102.4042 },
  { zoneCode: "KTN03", latitude: 5.764, longitude: 102.214 },
  { zoneCode: "KTN03", latitude: 5.8106, longitude: 102.1483 },
  { zoneCode: "MLK01", latitude: 2.1896, longitude: 102.2501 },
  { zoneCode: "NGS01", latitude: 2.8937, longitude: 102.4044 },
  { zoneCode: "NGS01", latitude: 2.4703, longitude: 102.2307 },
  { zoneCode: "NGS02", latitude: 2.7258, longitude: 101.9381 },
  { zoneCode: "NGS02", latitude: 2.5225, longitude: 101.7959 },
  { zoneCode: "PHG01", latitude: 2.7902, longitude: 104.1698 },
  { zoneCode: "PHG02", latitude: 3.4867, longitude: 103.3996 },
  { zoneCode: "PHG02", latitude: 2.8136, longitude: 103.4885 },
  { zoneCode: "PHG03", latitude: 3.4486, longitude: 102.4176 },
  { zoneCode: "PHG03", latitude: 3.936, longitude: 102.3626 },
  { zoneCode: "PHG04", latitude: 3.5222, longitude: 101.9103 },
  { zoneCode: "PHG04", latitude: 3.7899, longitude: 101.857 },
  { zoneCode: "PHG05", latitude: 3.3486, longitude: 101.8197 },
  { zoneCode: "PHG05", latitude: 3.3377, longitude: 101.8517 },
  { zoneCode: "PHG06", latitude: 4.4709, longitude: 101.3764 },
  { zoneCode: "PHG06", latitude: 3.4241, longitude: 101.7932 },
  { zoneCode: "PLS01", latitude: 6.4414, longitude: 100.1986 },
  { zoneCode: "PNG01", latitude: 5.4141, longitude: 100.3288 },
  { zoneCode: "PNG01", latitude: 5.3991, longitude: 100.3638 },
  { zoneCode: "PRK01", latitude: 4.1969, longitude: 101.2616 },
  { zoneCode: "PRK01", latitude: 3.6849, longitude: 101.5183 },
  { zoneCode: "PRK02", latitude: 4.5975, longitude: 101.0901 },
  { zoneCode: "PRK02", latitude: 4.7667, longitude: 100.9333 },
  { zoneCode: "PRK03", latitude: 5.4297, longitude: 101.129 },
  { zoneCode: "PRK03", latitude: 5.1158, longitude: 100.9686 },
  { zoneCode: "PRK04", latitude: 5.5499, longitude: 101.3404 },
  { zoneCode: "PRK05", latitude: 4.0259, longitude: 101.0213 },
  { zoneCode: "PRK05", latitude: 4.2105, longitude: 100.6986 },
  { zoneCode: "PRK05", latitude: 4.4692, longitude: 100.6286 },
  { zoneCode: "PRK06", latitude: 4.8519, longitude: 100.7414 },
  { zoneCode: "PRK06", latitude: 5.1267, longitude: 100.4932 },
  { zoneCode: "PRK07", latitude: 4.8624, longitude: 100.7927 },
  { zoneCode: "SBH01", latitude: 5.8394, longitude: 118.1172 },
  { zoneCode: "SBH02", latitude: 4.2448, longitude: 117.8912 },
  { zoneCode: "SBH03", latitude: 5.0268, longitude: 118.327 },
  { zoneCode: "SBH03", latitude: 4.4818, longitude: 118.6115 },
  { zoneCode: "SBH04", latitude: 6.8837, longitude: 116.8477 },
  { zoneCode: "SBH05", latitude: 5.9804, longitude: 116.0735 },
  { zoneCode: "SBH05", latitude: 5.7333, longitude: 115.9333 },
  { zoneCode: "SBH06", latitude: 6.075, longitude: 116.558 },
  { zoneCode: "SBH07", latitude: 5.8756, longitude: 117.5536 },
  { zoneCode: "SBH07", latitude: 5.6286, longitude: 117.1264 },
  { zoneCode: "SBH08", latitude: 5.3378, longitude: 116.1602 },
  { zoneCode: "SBH08", latitude: 5.671, longitude: 116.366 },
  { zoneCode: "SBH09", latitude: 5.0833, longitude: 115.55 },
  { zoneCode: "SBH09", latitude: 5.3473, longitude: 115.7455 },
  { zoneCode: "SGR01", latitude: 3.0738, longitude: 101.5183 },
  { zoneCode: "SGR01", latitude: 3.1073, longitude: 101.6067 },
  { zoneCode: "SGR02", latitude: 3.7698, longitude: 100.9877 },
  { zoneCode: "SGR03", latitude: 3.0449, longitude: 101.4456 },
  { zoneCode: "SGR03", latitude: 3.3408, longitude: 101.2497 },
  { zoneCode: "SGR04", latitude: 2.6931, longitude: 101.7505 },
  { zoneCode: "SGR04", latitude: 2.8033, longitude: 101.5028 },
  { zoneCode: "SWK01", latitude: 4.75, longitude: 115.0 },
  { zoneCode: "SWK02", latitude: 4.3995, longitude: 113.9914 },
  { zoneCode: "SWK03", latitude: 3.1706, longitude: 113.0419 },
  { zoneCode: "SWK04", latitude: 2.2873, longitude: 111.8305 },
  { zoneCode: "SWK05", latitude: 2.1234, longitude: 111.5223 },
  { zoneCode: "SWK06", latitude: 1.2376, longitude: 111.4621 },
  { zoneCode: "SWK06", latitude: 1.545, longitude: 111.523 },
  { zoneCode: "SWK07", latitude: 1.5533, longitude: 110.5748 },
  { zoneCode: "SWK07", latitude: 1.459, longitude: 110.501 },
  { zoneCode: "SWK08", latitude: 1.5533, longitude: 110.3592 },
  { zoneCode: "SWK08", latitude: 1.4167, longitude: 110.1667 },
  { zoneCode: "SWK09", latitude: 3.0, longitude: 115.0 },
  { zoneCode: "TRG01", latitude: 5.3302, longitude: 103.1408 },
  { zoneCode: "TRG01", latitude: 5.2057, longitude: 103.2059 },
  { zoneCode: "TRG02", latitude: 5.7333, longitude: 102.5 },
  { zoneCode: "TRG02", latitude: 5.5333, longitude: 102.9 },
  { zoneCode: "TRG03", latitude: 5.075, longitude: 102.95 },
  { zoneCode: "TRG04", latitude: 4.7563, longitude: 103.3996 },
  { zoneCode: "TRG04", latitude: 4.2305, longitude: 103.421 },
  { zoneCode: "WLY01", latitude: 3.139, longitude: 101.6869 },
  { zoneCode: "WLY01", latitude: 2.9264, longitude: 101.6964 },
  { zoneCode: "WLY02", latitude: 5.2831, longitude: 115.2308 },
];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(toLatitude - fromLatitude);
  const lonDelta = toRadians(toLongitude - fromLongitude);
  const fromLat = toRadians(fromLatitude);
  const toLat = toRadians(toLatitude);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

// Function to get prayer times from JAKIM e-Solat API
export async function getPrayerTimes(zone: string, date: Date = new Date()): Promise<PrayerTime> {
  // Format date to YYYY-MM-DD
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Try to use the API directly
  const period = isSameDay(date, new Date()) ? 'today' : 'tomorrow';
  const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=${period}&zone=${zone}`;
  
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
    
    return {
      fajr: prayerTimeData.fajr,
      sunrise: prayerTimeData.syuruk,
      dhuhr: prayerTimeData.dhuhr || prayerTimeData.zohor, // Handle both possible spellings
      asr: prayerTimeData.asr,
      maghrib: prayerTimeData.maghrib,
      isha: prayerTimeData.isha || prayerTimeData.isyak, // Handle both possible spellings
      date: prayerTimeData.date,
    };
  } else {
    console.error("API Response:", data);
    throw new Error('Invalid data format received from the API');
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

// Function to find a zone by coordinates
export function findNearestZoneByCoordinates(latitude: number, longitude: number): ZoneMatch {
  const nearestPoint = ZONE_REFERENCE_POINTS.reduce((best, point) => {
    const distanceKm = getDistanceKm(latitude, longitude, point.latitude, point.longitude);
    return !best || distanceKm < best.distanceKm ? { point, distanceKm } : best;
  }, null as { point: ZoneReferencePoint; distanceKm: number } | null);

  if (!nearestPoint) {
    const defaultZone = ZONES.find((zone) => zone.code === "WLY01") || ZONES[0];
    return { zone: defaultZone, distanceKm: 0 };
  }

  const zone = ZONES.find((candidate) => candidate.code === nearestPoint.point.zoneCode) || ZONES[0];
  return {
    zone,
    distanceKm: nearestPoint.distanceKm,
  };
}

export async function findZoneByCoordinates(latitude: number, longitude: number): Promise<string> {
  return findNearestZoneByCoordinates(latitude, longitude).zone.code;
}

export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${formattedHour}:${minutes} ${ampm}`;
}
