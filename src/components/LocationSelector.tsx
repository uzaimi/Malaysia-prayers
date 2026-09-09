
import React, { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPinIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ZONES } from "@/lib/prayer-time";

interface LocationSelectorProps {
  selectedZone: string;
  onZoneChange: (zoneCode: string) => void;
}

export function LocationSelector({ selectedZone, onZoneChange }: LocationSelectorProps) {
  const [search, setSearch] = useState("");
  
  const selectedZoneData = ZONES.find(zone => zone.code === selectedZone);
  
  const filteredZones = ZONES.filter(zone => 
    search === "" ||
    zone.name.toLowerCase().includes(search.toLowerCase()) ||
    zone.state.toLowerCase().includes(search.toLowerCase()) ||
    zone.code.toLowerCase().includes(search.toLowerCase())
  );
  
  
  return (
    <div className="mb-6 animate-fade-in">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between shadow-sm bg-secondary/30 border-secondary/50 hover:bg-secondary/50"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPinIcon className="h-4 w-4" />
              <span className="truncate">
                {selectedZoneData 
                  ? `${selectedZoneData.name}, ${selectedZoneData.state}`
                  : "Select location"}
              </span>
            </div>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full max-w-xs md:max-w-md p-0 border-secondary/50">
          <div className="p-4 border-b border-secondary/50">
            <div className="relative mb-4">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by state or area..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Select your prayer zone by state or area.
            </p>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {filteredZones.length > 0 ? (
              filteredZones.map((zone) => (
                <button
                  key={zone.code}
                  className={`w-full text-left p-3 text-sm transition-colors hover:bg-secondary flex justify-between items-center ${
                    zone.code === selectedZone ? "bg-secondary" : ""
                  }`}
                  onClick={() => {
                    onZoneChange(zone.code);
                    setSearch("");
                  }}
                >
                  <div>
                    <div className="font-medium">{zone.name}</div>
                    <div className="text-xs text-muted-foreground">{zone.state}</div>
                  </div>
                  {zone.code === selectedZone && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No locations found
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
