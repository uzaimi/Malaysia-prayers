
import React, { useEffect, useState } from "react";
import { 
  getPrayerTimes, 
  PrayerTime, 
  PRAYER_ORDER, 
  getCurrentPrayer, 
  getNextPrayer, 
  formatTimeRemaining,
  getMockPrayerTimes
} from "@/lib/prayer"; // Updated import path
import { Header } from "@/components/Header";
import { LocationSelector } from "@/components/LocationSelector";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState("WLY01"); // Default to KL
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeRemaining: number } | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Try to get saved zone from localStorage
    const savedZone = localStorage.getItem("prayerZone");
    if (savedZone) {
      setSelectedZone(savedZone);
    }
  }, []);
  
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setIsLoading(true);
      try {
        const times = await getPrayerTimes(selectedZone);
        setPrayerTimes(times);
        
        // Set current and next prayers
        if (times) {
          setCurrentPrayer(getCurrentPrayer(times));
          setNextPrayer(getNextPrayer(times));
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        toast({
          title: "Unable to fetch prayer times",
          description: "Using local data. API may be temporarily unavailable.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrayerTimes();
    
    // Save selected zone to localStorage
    localStorage.setItem("prayerZone", selectedZone);
  }, [selectedZone, toast]);
  
  // Update the next prayer's time remaining every minute
  useEffect(() => {
    if (!prayerTimes) return;
    
    const intervalId = setInterval(() => {
      setCurrentPrayer(getCurrentPrayer(prayerTimes));
      setNextPrayer(getNextPrayer(prayerTimes));
    }, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, [prayerTimes]);
  
  const handleZoneChange = (zoneCode: string) => {
    setSelectedZone(zoneCode);
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4 md:p-8 max-w-lg mx-auto">
        <Header />
        
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
            <p className="text-muted-foreground">Unable to load prayer times</p>
          </div>
        )}
        
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>Data provided by JAKIM e-Solat</p>
          <p className="mt-1 font-medium">code by Uzaimi</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
