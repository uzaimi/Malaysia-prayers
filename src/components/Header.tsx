
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { formatMalaysiaDate } from "@/lib/prayer-time";

export function Header({ date = new Date() }: { date?: Date }) {
  
  return (
    <header className="flex justify-between items-center mb-6 animate-fade-in">
      <div>
        <h1 className="font-semibold text-2xl">Prayer Times</h1>
        <p className="text-sm text-muted-foreground">
          {formatMalaysiaDate(date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
