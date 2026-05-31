"use client";

import React from "react";
import { RoomCard, type RoomCardProps } from "./RoomCard";

export interface RoomTypesProps {
  roomTypes?: RoomCardProps[];
}

export function RoomTypes({ roomTypes = [] }: RoomTypesProps) {
  
  // Default mock room structures if none passed from dynamic page
  const displayRooms = roomTypes.length > 0 ? roomTypes : [
    {
      id: "r1",
      name: "Private Luxury Suite",
      imageUrl: "/images/clinic_one.png",
      bedCount: 1,
      stayDuration: "Min. 30 Days",
      description: "A completely private, premium suite containing a king-size bed, workstation, private bathroom, and nature view windows.",
    },
    {
      id: "r2",
      name: "Shared Companionship Suite",
      imageUrl: "/images/clinic_two.png",
      bedCount: 2,
      stayDuration: "Flex Stay",
      description: "A comfortable shared room containing two double beds, dividers, shared closets, and direct courtyard accessibility.",
    },
  ];

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Accommodation & Room Types
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1 font-light">
          Review comfortable living options designed to support your treatment and wellness program.
        </p>
      </div>

      {/* Grid container: 1 col on mobile, 2 col on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        {displayRooms.map((room) => (
          <RoomCard key={room.id} {...room} />
        ))}
      </div>
    </div>
  );
}
export default RoomTypes;
