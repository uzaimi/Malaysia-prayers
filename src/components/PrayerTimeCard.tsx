
import React from "react";
import { 
  formatPrayerTime, 
  PRAYER_NAMES 
} from "@/lib/prayer-time";
import { cn } from "@/lib/utils";

interface PrayerTimeCardProps {
  prayerName: string;
  time: string;
  isNext?: boolean;
  isCurrent?: boolean;
  timeRemaining?: string;
}

export function PrayerTimeCard({ 
  prayerName, 
  time, 
  isNext = false, 
  isCurrent = false,
  timeRemaining
}: PrayerTimeCardProps) {
  return (
    <div 
      className={cn(
        "cupertino-card p-4 mb-3 flex justify-between items-center animate-fade-in",
        (isNext || isCurrent) && "cupertino-card-active"
      )}
      style={{ animationDelay: `${Math.random() * 0.3}s` }}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            {PRAYER_NAMES[prayerName as keyof typeof PRAYER_NAMES]}
          </h3>
          {isNext && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
              Next
            </span>
          )}
          {isCurrent && (
            <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground animate-pulse-subtle">
              Current
            </span>
          )}
        </div>
        {isNext && timeRemaining && (
          <p className="text-sm text-muted-foreground mt-1">
            In {timeRemaining}
          </p>
        )}
      </div>
      <p className="text-lg font-semibold">{formatPrayerTime(time)}</p>
    </div>
  );
}
