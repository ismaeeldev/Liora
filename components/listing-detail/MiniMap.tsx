"use client";

import React from "react";
import { MapWrapper } from "@/components/map/MapWrapper";
import { MapPin } from "lucide-react";
import { type FacilityCategory } from "@/types";

export interface MiniMapProps {
  position: [number, number];
  title: string;
  category?: FacilityCategory;
  price?: number;
  bedsAvailable?: number;
  city?: string;
  address?: string;
}

export function MiniMap({
  position,
  title,
  category = "Residential",
  price = 8500,
  bedsAvailable = 4,
  city = "Malibu",
  address = "23400 Civic Center Way",
}: MiniMapProps) {
  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Location
          </h2>
          <div className="flex items-center gap-1.5 mt-1 text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
            <span className="text-sm font-medium">{address}, {city}</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] md:h-[300px] rounded-xl overflow-hidden border border-border relative z-0">
        <MapWrapper
          center={position}
          zoom={14}
          markers={[
            {
              id: "detail",
              position,
              title,
              category,
              price,
              bedsAvailable,
              city,
            },
          ]}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
        />
      </div>
    </div>
  );
}

export default MiniMap;

