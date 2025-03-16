
// Types for prayer times functionality
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

// Define the zones for Malaysia
export type Zone = {
  code: string;
  name: string;
  state: string;
};

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
