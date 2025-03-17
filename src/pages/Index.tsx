
import React, { useEffect, useState } from "react";
import { 
  getPrayerTimes, 
  PrayerTime, 
  PRAYER_ORDER, 
  getCurrentPrayer, 
  getNextPrayer, 
  formatTimeRemaining
} from "@/lib/prayer-time";
import { downloadAllPrayerTimesFor2025, isPrayerTimesDownloaded } from "@/lib/prayer-time-storage";
import { Header } from "@/components/Header";
import { LocationSelector } from "@/components/LocationSelector";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Loader2, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState("WLY01"); // Default to KL
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeRemaining: number } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDataDownloaded, setIsDataDownloaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Try to get saved zone from localStorage
    const savedZone = localStorage.getItem("prayerZone");
    if (savedZone) {
      setSelectedZone(savedZone);
    }
    
    // Check if prayer times have been downloaded
    setIsDataDownloaded(isPrayerTimesDownloaded());
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
          description: "Please check your connection and try again. You can download offline data for 2025 as a backup.",
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
  
  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      await downloadAllPrayerTimesFor2025();
      setIsDataDownloaded(true);
      toast({
        title: "Download complete",
        description: "Prayer times for 2025 have been downloaded and will be used when the API is unavailable.",
      });
    } catch (error) {
      console.error("Failed to download prayer times:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the prayer times. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4 md:p-8 max-w-lg mx-auto">
        <Header />
        
        <LocationSelector selectedZone={selectedZone} onZoneChange={handleZoneChange} />
        
        <div className="mb-4">
          <Button
            variant={isDataDownloaded ? "outline" : "default"}
            className="w-full flex items-center justify-center gap-2"
            disabled={isDownloading || isDataDownloaded}
            onClick={handleDownloadData}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading 2025 prayer times...
              </>
            ) : isDataDownloaded ? (
              <>
                <Check className="h-4 w-4" />
                2025 prayer times downloaded
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download 2025 prayer times for offline use
              </>
            )}
          </Button>
          {isDataDownloaded && (
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Offline data will be used when the API is unavailable
            </p>
          )}
        </div>
        
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
