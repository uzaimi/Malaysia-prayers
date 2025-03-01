
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { format } from "date-fns";

export function Header() {
  const today = new Date();
  
  return (
    <header className="flex justify-between items-center mb-6 animate-fade-in">
      <div>
        <h1 className="font-semibold text-2xl">Prayer Times</h1>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, d MMMM yyyy")}
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}
