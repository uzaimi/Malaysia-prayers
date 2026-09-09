import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { LocationSelector } from './LocationSelector';
import { detectCurrentPrayerZone } from '@/lib/location';
import { ZONES } from '@/lib/prayer-time';

vi.mock('@/lib/location', () => ({ detectCurrentPrayerZone: vi.fn() }));
const detect = vi.mocked(detectCurrentPrayerZone);
beforeEach(() => { detect.mockReset(); });

afterEach(cleanup);
it('keeps manual zone search available without requesting location on mount', () => {
  const onZoneChange = vi.fn();
  render(<LocationSelector selectedZone="PNG01" onZoneChange={onZoneChange} />);
  expect(detect).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /Pulau Pinang/i }));
  fireEvent.change(screen.getByPlaceholderText('Search by state or area...'), { target: { value: 'JHR01' } });
  fireEvent.click(screen.getByRole('button', { name: /Pulau Aur dan Pulau Pemanggil/i }));
  expect(onZoneChange).toHaveBeenCalledWith('JHR01');
});

it('selects the detected zone and displays its accuracy', async () => {
  const onZoneChange = vi.fn();
  detect.mockResolvedValue({ zone: ZONES.find(z => z.code === 'SBH07')!, accuracy: 25 });
  render(<LocationSelector selectedZone="WLY01" onZoneChange={onZoneChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Use my location' }));
  expect((screen.getByRole('button', { name: 'Detecting location...' }) as HTMLButtonElement).disabled).toBe(true);
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('SBH07'));
  expect(screen.getByRole('status').textContent).toContain('25 m');
  expect(onZoneChange).toHaveBeenCalledWith('SBH07');
});

it('preserves the selected zone when location permission is denied', async () => {
  const onZoneChange = vi.fn();
  detect.mockRejectedValue(new Error('Location permission was denied.'));
  render(<LocationSelector selectedZone="PNG01" onZoneChange={onZoneChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Use my location' }));
  expect((await screen.findByRole('alert')).textContent).toContain('denied');
  expect(onZoneChange).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: /Pulau Pinang/i })).toBeTruthy();
});

it('does not let late GPS overwrite a manual selection', async () => {
  let resolveGps!: (result: Awaited<ReturnType<typeof detectCurrentPrayerZone>>) => void;
  detect.mockImplementation(() => new Promise(resolve => { resolveGps = resolve; }));
  const onZoneChange = vi.fn();
  render(<LocationSelector selectedZone="PNG01" onZoneChange={onZoneChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Use my location' }));
  const signal = detect.mock.calls[0][0];
  fireEvent.click(screen.getByRole('button', { name: /Pulau Pinang/i }));
  fireEvent.change(screen.getByPlaceholderText('Search by state or area...'), { target: { value: 'JHR01' } });
  fireEvent.click(screen.getByRole('button', { name: /Pulau Aur dan Pulau Pemanggil/i }));
  await act(async () => resolveGps({ zone: ZONES.find(z => z.code === 'WLY01')!, accuracy: 10 }));
  expect(signal?.aborted).toBe(true);
  expect(onZoneChange).toHaveBeenCalledTimes(1);
  expect(onZoneChange).toHaveBeenCalledWith('JHR01');
// Radix portal/focus cleanup is slow in jsdom with the complete zone catalogue.
}, 60000);

