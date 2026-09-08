import { useEffect, useState } from 'react';
import { getPrayerTimes, getMalaysiaDate, getCurrentPrayer, getNextPrayer, type PrayerTime } from '@/lib/prayer-time';

export function usePrayerTimes(zone: string) {
  const [now, setNow] = useState(() => new Date());
  const [attempt, setAttempt] = useState(0);
  const day = getMalaysiaDate(now);
  const key = `${zone}:${day}:${attempt}`;
  const [result, setResult] = useState<{
    key: string; times: PrayerTime | null; error: Error | null;
  } | null>(null);

  useEffect(() => {
    const tick = () => setNow(previous => {
      const current = new Date();
      return Math.floor(current.getTime() / 60000) === Math.floor(previous.getTime() / 60000)
        ? previous : current;
    });
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    // Bind the request to this Malaysian date, including after a suspended tab resumes.
    const date = new Date(`${day}T12:00:00+08:00`);
    getPrayerTimes(zone, date, controller.signal).then(times => {
      if (active) setResult({ key, times, error: null });
    }).catch(error => {
      if (active) setResult({ key, times: null, error: error instanceof Error ? error : new Error(String(error)) });
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [zone, day, key]);

  // Never display another zone/day's cached result, even before effect cleanup runs.
  const current = result?.key === key ? result : null;
  const prayerTimes = current?.times ?? null;
  return {
    now,
    prayerTimes,
    isLoading: current === null,
    error: current?.error ?? null,
    currentPrayer: prayerTimes ? getCurrentPrayer(prayerTimes, now) : null,
    nextPrayer: prayerTimes ? getNextPrayer(prayerTimes, now) : null,
    retry: () => setAttempt(value => value + 1),
  };
}
