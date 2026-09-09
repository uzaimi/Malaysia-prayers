import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCurrentPrayer, getNextPrayer, getMalaysiaDate, formatMalaysiaDate, getPrayerTimes } from './prayer-time';

const times = {
  fajr: '06:00:00', sunrise: '07:00:00', dhuhr: '13:00:00',
  asr: '16:00:00', maghrib: '19:00:00', isha: '20:00:00', date: '09-Sep-2026',
};
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('Malaysian time', () => {
  it('uses Malaysian time for prayer selection regardless of the host timezone', () => {
    const now = new Date('2026-09-09T05:30:00Z');
    expect(getCurrentPrayer(times, now)).toBe('dhuhr');
    expect(getNextPrayer(times, now)).toEqual({ name: 'asr', timeRemaining: 150 });
  });
  it('changes dates at 16:00 UTC and labels the header consistently', () => {
    expect(getMalaysiaDate(new Date('2026-09-09T15:59:59Z'))).toBe('2026-09-09');
    const midnight = new Date('2026-09-09T16:00:00Z');
    expect(getMalaysiaDate(midnight)).toBe('2026-09-10');
    expect(formatMalaysiaDate(midnight)).toBe('Thursday, 10 September 2026');
    expect(getNextPrayer(times, midnight)).toEqual({ name: 'fajr', timeRemaining: 360 });
  });
  it('passes the cancellation signal and selects today using the Malaysian date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-09T16:30:00Z'));
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({
      status: 'OK!', prayerTime: [{ ...times, syuruk: times.sunrise }],
    }) });
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    await getPrayerTimes('WLY01', new Date('2026-09-10T04:00:00Z'), controller.signal);
    expect(fetchMock.mock.calls[0][0]).toContain('period=today');
    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
  });
});
