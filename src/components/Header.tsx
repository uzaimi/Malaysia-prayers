
import React, { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { format } from "date-fns";
import { PrayerTimesWidget } from "./PrayerTimesWidget";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function Header() {
  const today = new Date();
  const [showWidget, setShowWidget] = useState(false);
  
  return (
    <header className="flex justify-between items-center mb-6 animate-fade-in">
      <div>
        <h1 className="font-semibold text-2xl">Prayer Times</h1>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, d MMMM yyyy")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover open={showWidget} onOpenChange={setShowWidget}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowWidget(!showWidget)}>
                    {showWidget ? "Close Widget" : "Open Widget"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground mb-2">Prayer Times Widget</p>
                    <PrayerTimesWidget />
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view quick prayer times widget</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ThemeToggle />
      </div>
    </header>
  );
}
