export const MALAYSIA_TIME_ZONE = 'Asia/Kuala_Lumpur';

export function getMalaysiaDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: MALAYSIA_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function formatMalaysiaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: MALAYSIA_TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

function getMalaysiaMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: MALAYSIA_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date);
  return Number(parts.find(p => p.type === 'hour')!.value) * 60 +
    Number(parts.find(p => p.type === 'minute')!.value);
}

// Define the zones for Malaysia
export type Zone = {
  code: string;
  name: string;
  state: string;
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
// Zone catalog: https://api.waktusolat.app/zones (2026-09-10).
export const ZONES: Zone[] = [
  {"code":"JHR01","name":"Pulau Aur dan Pulau Pemanggil","state":"Johor"},
  {"code":"JHR02","name":"Johor Bahru, Kota Tinggi, Mersing, Kulai","state":"Johor"},
  {"code":"JHR03","name":"Kluang, Pontian","state":"Johor"},
  {"code":"JHR04","name":"Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak","state":"Johor"},
  {"code":"KDH01","name":"Kota Setar, Kubang Pasu, Pokok Sena (Daerah Kecil)","state":"Kedah"},
  {"code":"KDH02","name":"Kuala Muda, Yan, Pendang","state":"Kedah"},
  {"code":"KDH03","name":"Padang Terap, Sik","state":"Kedah"},
  {"code":"KDH04","name":"Baling","state":"Kedah"},
  {"code":"KDH05","name":"Bandar Baharu, Kulim","state":"Kedah"},
  {"code":"KDH06","name":"Langkawi","state":"Kedah"},
  {"code":"KDH07","name":"Puncak Gunung Jerai","state":"Kedah"},
  {"code":"KTN01","name":"Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku","state":"Kelantan"},
  {"code":"KTN02","name":"Gua Musang (Daerah Galas Dan Bertam), Jeli, Jajahan Kecil Lojing","state":"Kelantan"},
  {"code":"MLK01","name":"SELURUH NEGERI MELAKA","state":"Melaka"},
  {"code":"NGS01","name":"Tampin, Jempol","state":"Negeri Sembilan"},
  {"code":"NGS02","name":"Jelebu, Kuala Pilah, Rembau","state":"Negeri Sembilan"},
  {"code":"NGS03","name":"Port Dickson, Seremban","state":"Negeri Sembilan"},
  {"code":"PHG01","name":"Pulau Tioman","state":"Pahang"},
  {"code":"PHG02","name":"Kuantan, Pekan, Muadzam Shah","state":"Pahang"},
  {"code":"PHG03","name":"Jerantut, Temerloh, Maran, Bera, Chenor, Jengka","state":"Pahang"},
  {"code":"PHG04","name":"Bentong, Lipis, Raub","state":"Pahang"},
  {"code":"PHG05","name":"Genting Sempah, Janda Baik, Bukit Tinggi","state":"Pahang"},
  {"code":"PHG06","name":"Cameron Highlands, Genting Higlands, Bukit Fraser","state":"Pahang"},
  {"code":"PHG07","name":"Zon Khas Daerah Rompin, (Mukim Rompin, Mukim Endau, Mukim Pontian)","state":"Pahang"},
  {"code":"PRK01","name":"Tapah, Slim River, Tanjung Malim","state":"Perak"},
  {"code":"PRK02","name":"Kuala Kangsar, Sg. Siput , Ipoh, Batu Gajah, Kampar","state":"Perak"},
  {"code":"PRK03","name":"Lenggong, Pengkalan Hulu, Grik","state":"Perak"},
  {"code":"PRK04","name":"Temengor, Belum","state":"Perak"},
  {"code":"PRK05","name":"Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor","state":"Perak"},
  {"code":"PRK06","name":"Selama, Taiping, Bagan Serai, Parit Buntar","state":"Perak"},
  {"code":"PRK07","name":"Bukit Larut","state":"Perak"},
  {"code":"PLS01","name":"SELURUH NEGERI PERLIS","state":"Perlis"},
  {"code":"PNG01","name":"SELURUH NEGERI PULAU PINANG","state":"Pulau Pinang"},
  {"code":"SBH01","name":"Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan, Bandar Sandakan, Sukau","state":"Sabah"},
  {"code":"SBH02","name":"Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)","state":"Sabah"},
  {"code":"SBH03","name":"Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku, Bahagian Tawau (Timur)","state":"Sabah"},
  {"code":"SBH04","name":"Bandar Tawau, Balong, Merotai, Kalabakan, Bahagian Tawau (Barat)","state":"Sabah"},
  {"code":"SBH05","name":"Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat","state":"Sabah"},
  {"code":"SBH06","name":"Gunung Kinabalu","state":"Sabah"},
  {"code":"SBH07","name":"Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat","state":"Sabah"},
  {"code":"SBH08","name":"Pensiangan, Keningau, Tambunan, Nabawan, Bahagian Pendalaman (Atas)","state":"Sabah"},
  {"code":"SBH09","name":"Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pasia, Membakut, Weston, Bahagian Pendalaman (Bawah)","state":"Sabah"},
  {"code":"SWK01","name":"Limbang, Lawas, Sundar, Trusan","state":"Sarawak"},
  {"code":"SWK02","name":"Miri, Niah, Bekenu, Sibuti, Marudi","state":"Sarawak"},
  {"code":"SWK03","name":"Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu","state":"Sarawak"},
  {"code":"SWK04","name":"Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit","state":"Sarawak"},
  {"code":"SWK05","name":"Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai","state":"Sarawak"},
  {"code":"SWK06","name":"Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok","state":"Sarawak"},
  {"code":"SWK07","name":"Serian, Simunjan, Samarahan, Sebuyau, Meludam","state":"Sarawak"},
  {"code":"SWK08","name":"Kuching, Bau, Lundu, Sematan","state":"Sarawak"},
  {"code":"SWK09","name":"Zon Khas (Kampung Patarikan)","state":"Sarawak"},
  {"code":"SGR01","name":"Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam","state":"Selangor"},
  {"code":"SGR02","name":"Kuala Selangor, Sabak Bernam","state":"Selangor"},
  {"code":"SGR03","name":"Klang, Kuala Langat","state":"Selangor"},
  {"code":"TRG01","name":"Kuala Terengganu, Marang, Kuala Nerus","state":"Terengganu"},
  {"code":"TRG02","name":"Besut, Setiu","state":"Terengganu"},
  {"code":"TRG03","name":"Hulu Terengganu","state":"Terengganu"},
  {"code":"TRG04","name":"Dungun, Kemaman","state":"Terengganu"},
  {"code":"WLY01","name":"Kuala Lumpur, Putrajaya","state":"Wilayah Persekutuan"},
  {"code":"WLY02","name":"Labuan","state":"Wilayah Persekutuan"}
];

// Function to get prayer times from JAKIM e-Solat API
export async function getPrayerTimes(zone: string, date: Date = new Date(), signal?: AbortSignal): Promise<PrayerTime> {
  const requestedDay = getMalaysiaDate(date);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  if (requestedDay !== getMalaysiaDate(today) && requestedDay !== getMalaysiaDate(tomorrow)) {
    throw new Error('Only today and tomorrow are supported');
  }
  
  // Try to use the API directly
  const period = requestedDay === getMalaysiaDate(today) ? 'today' : 'tomorrow';
  const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=${period}&zone=${zone}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
    signal,
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
export function getCurrentPrayer(prayerTimes: PrayerTime, now: Date = new Date()): string | null {
  const currentTime = getMalaysiaMinutes(now);
  
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
export function getNextPrayer(prayerTimes: PrayerTime, now: Date = new Date()): { name: string; timeRemaining: number } | null {
  const currentTime = getMalaysiaMinutes(now);
  
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

export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${formattedHour}:${minutes} ${ampm}`;
}
