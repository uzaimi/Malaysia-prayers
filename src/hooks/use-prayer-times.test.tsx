import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePrayerTimes } from './use-prayer-times';
import { getPrayerTimes, type PrayerTime } from '@/lib/prayer-time';

vi.mock('@/lib/prayer-time', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/prayer-time')>(),
  getPrayerTimes: vi.fn(),
}));

const times: PrayerTime = {
  fajr: '06:00:00', sunrise: '07:00:00', dhuhr: '13:00:00',
  asr: '16:00:00', maghrib: '19:00:00', isha: '20:00:00', date: '09-Sep-2026',
};
const fetchTimes = vi.mocked(getPrayerTimes);
const flush = () => act(async () => { await Promise.resolve(); });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-09T05:30:00Z'));
  fetchTimes.mockReset();
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('prayer timetable lifecycle', () => {
  it('ignores an old zone response and aborts its request', async () => {
    let resolveOld!: (value: PrayerTime) => void;
    fetchTimes.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
      .mockResolvedValueOnce({ ...times, fajr: '06:15:00' });
    const { result, rerender } = renderHook(({ zone }) => usePrayerTimes(zone), { initialProps: { zone: 'WLY01' } });
    const oldSignal = fetchTimes.mock.calls[0][2];
    rerender({ zone: 'PNG01' });
    expect(result.current.prayerTimes).toBeNull();
    expect(oldSignal?.aborted).toBe(true);
    await flush();
    expect(result.current.prayerTimes?.fajr).toBe('06:15:00');
    await act(async () => resolveOld(times));
    expect(result.current.prayerTimes?.fajr).toBe('06:15:00');
  });

  it('ignores an old failure after a new zone has loaded', async () => {
    let rejectOld!: (reason: Error) => void;
    fetchTimes.mockImplementationOnce(() => new Promise((_, reject) => { rejectOld = reject; }))
      .mockResolvedValueOnce(times);
    const { result, rerender } = renderHook(({ zone }) => usePrayerTimes(zone), { initialProps: { zone: 'WLY01' } });
    rerender({ zone: 'PNG01' });
    await flush();
    await act(async () => rejectOld(new Error('Old request failed')));
    expect(result.current.prayerTimes).toEqual(times);
    expect(result.current.error).toBeNull();
  });

  it('loads a new timetable at Malaysian midnight, before UTC midnight', async () => {
    vi.setSystemTime(new Date('2026-09-09T15:59:59Z'));
    fetchTimes.mockResolvedValueOnce(times).mockResolvedValueOnce({ ...times, date: '10-Sep-2026' });
    const { result } = renderHook(() => usePrayerTimes('WLY01'));
    await flush();
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(fetchTimes).toHaveBeenCalledTimes(2);
    expect(fetchTimes.mock.calls[1][1]?.toISOString()).toBe('2026-09-10T04:00:00.000Z');
    expect(result.current.prayerTimes?.date).toBe('10-Sep-2026');
  });

  it('refreshes the date when a suspended page becomes visible', async () => {
    fetchTimes.mockResolvedValue(times);
    renderHook(() => usePrayerTimes('WLY01'));
    await flush();
    vi.setSystemTime(new Date('2026-09-10T05:30:00Z'));
    await act(async () => document.dispatchEvent(new Event('visibilitychange')));
    expect(fetchTimes).toHaveBeenCalledTimes(2);
  });

  it('updates the countdown without refetching within the same day', async () => {
    fetchTimes.mockResolvedValue(times);
    const { result } = renderHook(() => usePrayerTimes('WLY01'));
    await flush();
    expect(result.current.nextPrayer).toEqual({ name: 'asr', timeRemaining: 150 });
    await act(async () => { await vi.advanceTimersByTimeAsync(60000); });
    expect(result.current.nextPrayer?.timeRemaining).toBe(149);
    expect(fetchTimes).toHaveBeenCalledTimes(1);
  });

  it('allows retry after a request failure', async () => {
    fetchTimes.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(times);
    const { result } = renderHook(() => usePrayerTimes('WLY01'));
    await flush();
    expect(result.current.error?.message).toBe('Offline');
    await act(async () => result.current.retry());
    expect(result.current.prayerTimes).toEqual(times);
    expect(result.current.error).toBeNull();
  });
});
