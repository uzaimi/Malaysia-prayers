import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Index from './Index';
import { getPrayerTimes, ZONES } from '@/lib/prayer-time';
import { detectCurrentPrayerZone } from '@/lib/location';

vi.mock('@/components/Header', () => ({ Header: () => <h1>Prayer Times</h1> }));
vi.mock('@/lib/location', () => ({ detectCurrentPrayerZone: vi.fn() }));
vi.mock('@/lib/prayer-time', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/prayer-time')>(), getPrayerTimes: vi.fn(),
}));
afterEach(() => { cleanup(); localStorage.clear(); });

it('loads and displays the timetable for the GPS-selected zone', async () => {
  localStorage.clear();
  vi.mocked(getPrayerTimes).mockImplementation(async zone => ({
    fajr: zone === 'SBH07' ? '05:09:00' : '06:00:00', sunrise: '07:00:00',
    dhuhr: '13:00:00', asr: '16:00:00', maghrib: '19:00:00', isha: '20:00:00', date: '10-Sep-2026',
  }));
  vi.mocked(detectCurrentPrayerZone).mockResolvedValue({ zone: ZONES.find(z => z.code === 'SBH07')!, accuracy: 15 });
  render(<Index />);
  expect(await screen.findByText('6:00 AM')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Use my location' }));
  expect(await screen.findByText('5:09 AM')).toBeTruthy();
  expect(getPrayerTimes).toHaveBeenCalledWith('SBH07', expect.any(Date), expect.any(AbortSignal));
  expect(localStorage.getItem('prayerZone')).toBe('SBH07');
  expect(localStorage.length).toBe(1);
});
