import React from "react";
import { Navbar, Footer } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacilityDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
        {/* Gallery Skeleton */}
        <Skeleton className="w-full h-80 rounded-xl bg-muted" />

        {/* Content Split Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-2/3 h-10 rounded bg-muted" />
            <Skeleton className="w-1/2 h-5 rounded bg-muted" />
            <Skeleton className="w-full h-32 rounded bg-muted" />
            <Skeleton className="w-full h-24 rounded bg-muted" />
          </div>

          <div className="space-y-6">
            <Skeleton className="w-full h-44 rounded bg-muted" />
            <Skeleton className="w-full h-36 rounded bg-muted" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
