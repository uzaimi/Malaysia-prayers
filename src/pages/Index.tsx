
import React, { useEffect, useState } from "react";
import { PRAYER_ORDER, formatTimeRemaining, ZONES } from "@/lib/prayer-time";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { Header } from "@/components/Header";
import { LocationSelector } from "@/components/LocationSelector";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedZone, setSelectedZone] = useState(() => {
    const savedZone = localStorage.getItem("prayerZone");
    return ZONES.some(zone => zone.code === savedZone) ? savedZone! : "WLY01";
  });
  const { prayerTimes, isLoading, error, currentPrayer, nextPrayer, now, retry } = usePrayerTimes(selectedZone);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("prayerZone", selectedZone);
  }, [selectedZone]);

  useEffect(() => {
    if (error) toast({
      title: "Unable to fetch prayer times",
      description: "Please check your connection and try again.",
      variant: "destructive",
    });
  }, [error, toast]);

  const handleZoneChange = (zoneCode: string) => {
    setSelectedZone(zoneCode);
  };
  
  return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4 md:p-8 max-w-lg mx-auto">
        <Header date={now} />
        
        <LocationSelector selectedZone={selectedZone} onZoneChange={handleZoneChange} />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : prayerTimes ? (
          <div className="flex-1">
            {PRAYER_ORDER.map((prayer) => (
              <PrayerTimeCard
                key={prayer}
                prayerName={prayer}
                time={prayerTimes[prayer]}
                isNext={nextPrayer?.name === prayer}
                isCurrent={currentPrayer === prayer}
                timeRemaining={nextPrayer?.name === prayer ? formatTimeRemaining(nextPrayer.timeRemaining) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Unable to load prayer times</p>
              <button className="mt-3 underline" onClick={retry}>Try again</button>
            </div>
          </div>
        )}
        
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>Data provided by JAKIM e-Solat</p>
          <p className="mt-1 font-medium">code by Uzaimi</p>
        </footer>
      </div>
  );
};

export default Index;
