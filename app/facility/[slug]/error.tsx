"use client";

import React, { useEffect } from "react";
import { Navbar, Footer } from "@/components/layout";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FacilityDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Facility Details Router caught error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/25 text-destructive mb-6">
          <AlertTriangle className="h-8 w-8" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight mb-2">
          Unable to Load Facility Details
        </h2>
        
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          The requested facility page could not be accessed. This might be due to an incorrect URL path, network issues, or database connectivity problems.
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.assign("/")}
            className="rounded-lg h-10 border-border"
          >
            Go Back Home
          </Button>
          <Button
            onClick={() => reset()}
            className="rounded-lg h-10 bg-primary text-white hover:bg-primary-hover"
          >
            Retry Loading Details
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
