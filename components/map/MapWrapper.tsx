"use client";

import React from "react";
import dynamic from "next/dynamic";
import { type FacilityMapProps } from "./FacilityMap";
import { MapErrorBoundary } from "./MapErrorBoundary";

// Dynamically import FacilityMap with SSR disabled to prevent hydration warnings/errors
const FacilityMap = dynamic(() => import("./FacilityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] bg-slate-100 flex flex-col items-center justify-center gap-3 rounded-xl border border-border animate-pulse">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/25">
        <div className="h-4 w-4 rounded-full bg-primary animate-ping" />
      </div>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Loading Calming Map Tiles...
      </span>
    </div>
  ),
});

export function MapWrapper(props: FacilityMapProps) {
  return (
    <MapErrorBoundary>
      <FacilityMap {...props} />
    </MapErrorBoundary>
  );
}
