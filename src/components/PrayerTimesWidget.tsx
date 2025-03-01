
import React, { useEffect, useState } from "react";
import { 
  getPrayerTimes, 
  PrayerTime, 
  getCurrentPrayer, 
  getNextPrayer, 
  formatTimeRemaining,
  getMockPrayerTimes
} from "@/lib/prayer-time";
import { Loader2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrayerTimesWidgetProps {
  zoneCode?: string;
  compact?: boolean;
}

export function PrayerTimesWidget({ zoneCode = "WLY01", compact = true }: PrayerTimesWidgetProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeRemaining: number } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setIsLoading(true);
      try {
        const times = await getPrayerTimes(zoneCode);
        setPrayerTimes(times);
        setIsOfflineMode(false);
        
        if (times) {
          setCurrentPrayer(getCurrentPrayer(times));
          setNextPrayer(getNextPrayer(times));
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        // Fallback to mock data with the current date
        const mockTimes = getMockPrayerTimes(new Date());
        setPrayerTimes(mockTimes);
        setCurrentPrayer(getCurrentPrayer(mockTimes));
        setNextPrayer(getNextPrayer(mockTimes));
        setIsOfflineMode(true);
        
        toast({
          title: "Using offline prayer times",
          description: "Connected to local data. 3 months of prayer times available.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrayerTimes();
    
    // Update every minute
    const intervalId = setInterval(() => {
      if (prayerTimes) {
        setCurrentPrayer(getCurrentPrayer(prayerTimes));
        setNextPrayer(getNextPrayer(prayerTimes));
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [zoneCode, toast]);
  
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
    <div className={`flex ${compact ? 'flex-row' : 'flex-col'} gap-2 p-4 bg-card rounded-lg shadow-sm border animate-fade-in`}>
      {isOfflineMode && (
        <div className="w-full mb-1">
          <p className="text-xs text-amber-500">Offline mode - using local data</p>
        </div>
      )}
      
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
  );
}
