import { MapPin } from "lucide-react";
import { FilterBar } from "@/components/home/filter-bar";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <FilterBar />
      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-8.5rem)] overflow-hidden">
        <div className="w-full lg:w-[55%] h-full p-6 border-r border-border">
          <div className="mb-6 space-y-2">
            <div className="h-8 w-64 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-4 w-48 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[45%] h-full bg-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center text-slate-400 gap-3">
            <MapPin className="h-10 w-10 animate-bounce" />
            <p className="font-medium animate-pulse">Loading nationwide map...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
