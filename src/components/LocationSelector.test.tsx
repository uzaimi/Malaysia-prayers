import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { LocationSelector } from './LocationSelector';

afterEach(cleanup);
it('shows the selected zone without offering fake automatic detection', () => {
  const onZoneChange = vi.fn();
  render(<LocationSelector selectedZone="PNG01" onZoneChange={onZoneChange} />);
  expect(screen.getByRole('button').textContent).toContain('Pulau Pinang');
  fireEvent.click(screen.getByRole('button'));
  expect(screen.queryByRole('button', { name: /detect my location/i })).toBeNull();
  fireEvent.change(screen.getByPlaceholderText('Search by state or area...'), { target: { value: 'JHR01' } });
  fireEvent.click(screen.getByRole('button', { name: /Pulau Aur dan Pulau Pemanggil/i }));
  expect(onZoneChange).toHaveBeenCalledWith('JHR01');
});
