"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { MapMarker, type MapMarkerProps } from "./MapMarker";
import { useMapStore } from "@/lib/store/map-store";

// Import Leaflet styles
import "leaflet/dist/leaflet.css";

// Dynamic fix for default icon assets resolution in standard Leaflet
const fixDefaultIconAssets = () => {
  // @ts-expect-error - Leaflet icon workaround
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// Sub-component to control map viewport panning/zooming dynamically from Zustand state
function MapViewController() {
  const map = useMap();
  const mapCenter = useMapStore((state) => state.mapCenter);
  const mapZoom = useMapStore((state) => state.mapZoom);

  useEffect(() => {
    map.setView(mapCenter, mapZoom, {
      animate: true,
      duration: 0.75, // Smooth animation duration
    });
  }, [mapCenter, mapZoom, map]);

  return null;
}

export interface FacilityMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: (Omit<MapMarkerProps, "isActive" | "isHovered" | "isSelected" | "onClick"> & { id: string })[];
  activeMarkerId?: string | null;
  onClickMarker?: (markerId: string) => void;
  className?: string;
  zoomControl?: boolean;
  dragging?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
}

export default function FacilityMap({
  center = [34.0522, -118.2437],
  zoom = 10,
  markers = [],
  onClickMarker,
  className,
  zoomControl = true,
  dragging = true,
  scrollWheelZoom = true,
  doubleClickZoom = true,
}: FacilityMapProps) {
  useEffect(() => {
    fixDefaultIconAssets();
  }, []);

  // Retrieve primitive hover and active markers state to minimize global re-renders
  const hoveredFacilityId = useMapStore((state) => state.hoveredFacilityId);
  const selectedFacilityId = useMapStore((state) => state.selectedFacilityId);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={zoomControl}
        dragging={dragging}
        doubleClickZoom={doubleClickZoom}
        className="w-full h-full z-10"
      >
        {/* View controller dynamically centers map */}
        {dragging && <MapViewController />}

        {/* OpenStreetMap calming premium tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Markers */}
        {markers.map((marker) => {
          const isSelected = selectedFacilityId === marker.id;
          const isHovered = hoveredFacilityId === marker.id;
          return (
            <MapMarker
              key={marker.id}
              id={marker.id}
              position={marker.position}
              title={marker.title}
              category={marker.category}
              price={marker.price}
              bedsAvailable={marker.bedsAvailable}
              city={marker.city}
              isHovered={isHovered}
              isSelected={isSelected}
              onClick={() => {
                if (onClickMarker) onClickMarker(marker.id);
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
