"use client";

import React from "react";
import Image from "next/image";
import { Bed, CalendarRange } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface RoomCardProps {
  id: string;
  name: string;
  imageUrl: string;
  bedCount: number;
  stayDuration: string;
  description: string;
}

export function RoomCard({
  name,
  imageUrl,
  bedCount,
  stayDuration,
  description,
}: RoomCardProps) {
  return (
    <Card className="group flex flex-col h-full bg-surface border border-border rounded-xl shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-200 overflow-hidden">
      
      {/* Room Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-border/50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Body */}
      <CardContent className="p-4 md:p-5 flex flex-col flex-grow space-y-3">
        {/* Name Title */}
        <h4 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors leading-tight">
          {name}
        </h4>

        {/* Metadata Indicators Badges */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-800 text-[10px] font-bold uppercase tracking-wider">
            <Bed className="h-3.5 w-3.5 text-sky-600" />
            <span>{bedCount} Bed{bedCount !== 1 && "s"}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
            <CalendarRange className="h-3.5 w-3.5 text-teal-600" />
            <span>{stayDuration}</span>
          </span>
        </div>

        {/* Description Text */}
        <p className="text-xs text-slate-500 font-light leading-relaxed flex-grow">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
export default RoomCard;
