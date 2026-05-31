"use client";

import React, { useEffect, useRef, memo, useCallback } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { cn } from "@/lib/utils";
import { type FacilityCategory } from "@/types";

export interface MapMarkerProps {
  id: string;
  position: [number, number];
  title: string;
  category?: FacilityCategory;
  price?: number;
  bedsAvailable?: number;
  city?: string;
  isActive?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const CATEGORY_MAP: Record<FacilityCategory, { colorClass: string; activeColorClass: string; name: string }> = {
  Detox: {
    colorClass: "bg-red-600 border-red-500",
    activeColorClass: "bg-slate-900 border-white",
    name: "Detox",
  },
  Residential: {
    colorClass: "bg-blue-600 border-blue-500",
    activeColorClass: "bg-slate-900 border-white",
    name: "Residential",
  },
  "Mental Health": {
    colorClass: "bg-violet-600 border-violet-500",
    activeColorClass: "bg-slate-900 border-white",
    name: "Mental Health",
  },
  IOP: {
    colorClass: "bg-emerald-600 border-emerald-500",
    activeColorClass: "bg-slate-900 border-white",
    name: "IOP",
  },
};

export const MapMarker = memo(function MapMarker({
  position,
  title,
  category = "Residential",
  price,
  bedsAvailable = 1,
  city,
  isActive = false,
  isHovered = false,
  isSelected = false,
  onClick,
}: MapMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const isCurrentlyActive = isActive || isSelected || isHovered;


  const createCustomIcon = useCallback(() => {
    const config = CATEGORY_MAP[category] || CATEGORY_MAP.Residential;
    const pillText = config.name;
    
    const bgClass = isCurrentlyActive 
      ? "bg-slate-950 border-white ring-2 ring-slate-950/30 scale-110 z-[1000] shadow-xl" 
      : `${config.colorClass} shadow-md scale-100 hover:scale-105`;

    const htmlString = `
      <div class="flex items-center justify-center transition-all duration-300">
        <div class="relative flex items-center gap-1.5 transition-all duration-300 ease-out ${bgClass} text-white px-2.5 py-1.5 text-xs font-bold rounded-full border whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-white shrink-0"></span>
          <span>${pillText}</span>
          <div class="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
            isCurrentlyActive ? "bg-slate-950" : config.colorClass.split(" ")[0]
          } border-r border-b border-white/20"></div>
        </div>
      </div>
    `;

    return L.divIcon({
      html: htmlString,
      className: "custom-div-icon",
      iconSize: [110, 36],
      iconAnchor: [55, 30],
    });
  }, [category, isCurrentlyActive]);

  // React to changes in states to update icon dynamically without rebuilding layer
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(createCustomIcon());
      
      if (isSelected) {
        markerRef.current.openPopup();
      }
    }
  }, [isHovered, isSelected, isCurrentlyActive, createCustomIcon]);

  return (
    <Marker 
      ref={markerRef}
      position={position} 
      icon={createCustomIcon()}
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        }
      }}
    >
      <Popup className="custom-leaflet-popup">
        <div className="p-1 min-w-44 text-slate-800">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
              category === "Detox" && "bg-red-100 text-red-800",
              category === "Residential" && "bg-blue-100 text-blue-800",
              category === "Mental Health" && "bg-violet-100 text-violet-800",
              category === "IOP" && "bg-emerald-100 text-emerald-800"
            )}>
              {CATEGORY_MAP[category]?.name || category}
            </span>
          </div>
          <h4 className="font-semibold text-sm text-slate-900 mb-1 leading-tight">{title}</h4>
          {city && <p className="text-xs text-slate-500 mb-2">{city}</p>}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Availability</span>
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md",
              bedsAvailable > 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            )}>
              {bedsAvailable > 0 ? `${bedsAvailable} Beds` : "Waitlist"}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});
