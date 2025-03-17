
import React, { useEffect, useState } from "react";
import { 
  getPrayerTimes, 
  PrayerTime, 
  getCurrentPrayer, 
  getNextPrayer, 
  formatTimeRemaining
} from "@/lib/prayer-time";
import { Loader2, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PrayerTimesWidgetProps {
  zoneCode?: string;
  compact?: boolean;
}

export function PrayerTimesWidget({ zoneCode = "WLY01", compact = true }: PrayerTimesWidgetProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeRemaining: number } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const times = await getPrayerTimes(zoneCode, today);
        setPrayerTimes(times);
        setCurrentDate(today);
        
        if (times) {
          setCurrentPrayer(getCurrentPrayer(times));
          setNextPrayer(getNextPrayer(times));
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        
        toast({
          title: "Unable to fetch prayer times",
          description: "Please check your connection or download offline data.",
          variant: "destructive",
        });
        
        setPrayerTimes(null);
        setCurrentPrayer(null);
        setNextPrayer(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrayerTimes();
    
    // Update every minute
    const intervalId = setInterval(() => {
      const now = new Date();
      // Check if day has changed
      const currentDay = format(now, 'yyyy-MM-dd');
      const widgetDay = format(currentDate, 'yyyy-MM-dd');
      
      if (currentDay !== widgetDay) {
        // Day has changed, refetch prayer times
        fetchPrayerTimes();
      } else if (prayerTimes) {
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
    <div className={`flex flex-col gap-2 p-4 bg-card rounded-lg shadow-sm border animate-fade-in`}>
      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
        <Calendar className="h-3 w-3" />
        <span>{format(currentDate, 'EEEE, dd MMMM yyyy')}</span>
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
