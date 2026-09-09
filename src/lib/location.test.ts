import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detectCurrentPrayerZone, findZoneByCoordinates, getCurrentLocation } from './location';

const gps = vi.fn();
const fetchMock = vi.fn();
beforeEach(() => {
  gps.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal('isSecureContext', true);
  vi.stubGlobal('navigator', { geolocation: { getCurrentPosition: gps } });
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('device location', () => {
  it('requests fresh coordinates and resolves the actual prayer zone', async () => {
    gps.mockImplementation(success => success({ coords: { latitude: 5.9804, longitude: 116.0735, accuracy: 20 } }));
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ zone: 'SBH07' }) });
    const result = await detectCurrentPrayerZone();
    expect(result.zone.code).toBe('SBH07');
    expect(result.zone.name).toContain('Kota Kinabalu');
    expect(gps.mock.calls[0][2]).toEqual({ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.waktusolat.app/zones/5.9804/116.0735');
    expect(fetchMock.mock.calls[0][1].credentials).toBe('omit');
  });
  it.each([[1, /permission was denied/], [2, /location services/], [3, /too long/]])('explains location error %s', async (code, message) => {
    gps.mockImplementation((_, failure) => failure({ code }));
    await expect(detectCurrentPrayerZone()).rejects.toThrow(message);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('explains insecure websites before asking for coordinates', async () => {
    vi.stubGlobal('isSecureContext', false);
    await expect(getCurrentLocation()).rejects.toThrow(/HTTPS/);
    expect(gps).not.toHaveBeenCalled();
  });
  it('does not send an excessively approximate position', async () => {
    gps.mockImplementation(success => success({ coords: { latitude: 3, longitude: 101, accuracy: 20000 } }));
    await expect(detectCurrentPrayerZone()).rejects.toThrow(/too approximate/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('cancels while waiting for the GPS sensor', async () => {
    const controller = new AbortController();
    const result = detectCurrentPrayerZone(controller.signal);
    controller.abort();
    await expect(result).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('zone lookup', () => {
  it('rejects invalid coordinates before making a request', async () => {
    await expect(findZoneByCoordinates({ latitude: NaN, longitude: 101 })).rejects.toThrow(/invalid location/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('does not substitute Kuala Lumpur outside Malaysia', async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'No zone found for the given coordinates.' }) });
    await expect(findZoneByCoordinates({ latitude: 1.2897, longitude: 103.8501 })).rejects.toThrow(/Malaysia only/);
  });
  it('rejects unsupported zone codes', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ zone: 'UNKNOWN' }) });
    await expect(findZoneByCoordinates({ latitude: 3, longitude: 101 })).rejects.toThrow(/unsupported prayer zone/);
  });
  it('explains a network failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(findZoneByCoordinates({ latitude: 3, longitude: 101 })).rejects.toThrow(/connection/);
  });
  it('bounds lookup time and cleans up the request', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation((_, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    const result = findZoneByCoordinates({ latitude: 3, longitude: 101 });
    const assertion = expect(result).rejects.toThrow(/timed out/);
    await vi.advanceTimersByTimeAsync(10000);
    await assertion;
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });
});
