
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadAllZonesForYear, getCacheStats, clearCache } from "@/lib/prayer-time-cache";
import { Progress } from "@/components/ui/progress";
import { DatabaseBackup, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CacheManager() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(getCacheStats());
  const { toast } = useToast();

  const updateStats = () => {
    setStats(getCacheStats());
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setProgress(0);
      
      const success = await downloadAllZonesForYear(2025, (progressValue) => {
        setProgress(progressValue);
      });
      
      if (success) {
        toast({
          title: "Download Complete",
          description: "Prayer times for 2025 have been saved for offline use",
        });
      } else {
        toast({
          title: "Download Failed",
          description: "There was an error downloading prayer times",
          variant: "destructive",
        });
      }
      
      updateStats();
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading prayer times",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    updateStats();
    toast({
      title: "Cache Cleared",
      description: "All stored prayer times have been removed",
    });
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 mt-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-2">Offline Prayer Times</h3>
      
      <div className="text-xs text-muted-foreground mb-4">
        {stats.totalZones > 0 ? (
          <div className="space-y-1">
            <p>Zones: {stats.totalZones} / {67}</p>
            <p>Days: {stats.totalDays}</p>
            <p>Size: {formatSize(stats.sizeInBytes)}</p>
          </div>
        ) : (
          <p>No offline data available</p>
        )}
      </div>
      
      {isDownloading ? (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center">{progress.toFixed(0)}% Complete</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-1" 
            onClick={handleDownload}
          >
            <DatabaseBackup className="h-3 w-3" />
            <span>Download 2025</span>
          </Button>
          
          {stats.totalZones > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearCache}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
