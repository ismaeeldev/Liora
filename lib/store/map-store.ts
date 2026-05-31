import { create } from "zustand";

interface MapState {
  selectedFacilityId: string | null;
  hoveredFacilityId: string | null;
  activeMarkerId: string | null;
  mapCenter: [number, number];
  mapZoom: number;
  
  setSelectedFacilityId: (id: string | null) => void;
  setHoveredFacilityId: (id: string | null) => void;
  setActiveMarkerId: (id: string | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  resetMapState: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedFacilityId: null,
  hoveredFacilityId: null,
  activeMarkerId: null,
  mapCenter: [37.0902, -95.7129], // Default to center of US
  mapZoom: 4,

  setSelectedFacilityId: (id) => set({ selectedFacilityId: id }),
  setHoveredFacilityId: (id) => set({ hoveredFacilityId: id }),
  setActiveMarkerId: (id) => set({ activeMarkerId: id }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  resetMapState: () => set({
    selectedFacilityId: null,
    hoveredFacilityId: null,
    activeMarkerId: null,
    mapCenter: [37.0902, -95.7129],
    mapZoom: 4,
  }),
}));
