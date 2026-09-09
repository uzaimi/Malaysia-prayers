
import React, { useEffect } from "react";
import { formatTimeRemaining, formatMalaysiaDate } from "@/lib/prayer-time";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { Loader2, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrayerTimesWidgetProps {
  zoneCode?: string;
  compact?: boolean;
}

export function PrayerTimesWidget({ zoneCode = "WLY01", compact = true }: PrayerTimesWidgetProps) {
  const { prayerTimes, isLoading, error, currentPrayer, nextPrayer, now: currentDate } = usePrayerTimes(zoneCode);
  const { toast } = useToast();

  useEffect(() => {
    if (error) toast({
      title: "Unable to fetch prayer times",
      description: "Please check your connection and try again.",
      variant: "destructive",
    });
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-card rounded-lg shadow-sm border animate-pulse">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!prayerTimes || !nextPrayer) {
    return (
      <div className="flex items-center justify-center p-4 bg-card rounded-lg shadow-sm border">
        <p className="text-sm text-muted-foreground">Unable to load prayer times</p>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col gap-2 p-4 bg-card rounded-lg shadow-sm border animate-fade-in`}>
      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
        <Calendar className="h-3 w-3" />
        <span>{formatMalaysiaDate(currentDate)}</span>
      </div>
      
      <div className={`flex ${compact ? 'flex-row' : 'flex-col'} gap-2 w-full`}>
        {currentPrayer && (
          <div className={`${compact ? 'flex-1' : 'w-full'} bg-background rounded p-2`}>
            <p className="text-xs text-muted-foreground">Current</p>
            <div className="flex items-center justify-between">
              <p className="font-medium">{currentPrayer}</p>
              <p className="text-sm">{prayerTimes[currentPrayer]}</p>
            </div>
          </div>
        )}
        
        <div className={`${compact ? 'flex-1' : 'w-full'} bg-background rounded p-2`}>
          <p className="text-xs text-muted-foreground">Next</p>
          <div className="flex items-center justify-between">
            <p className="font-medium">{nextPrayer.name}</p>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              <span>{formatTimeRemaining(nextPrayer.timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
