"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function TodoApp() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Tasks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Stay organized and productive with your personal task manager
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
