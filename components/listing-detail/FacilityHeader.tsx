"use client";

import React from "react";
import { MapPin, ShieldCheck, Award } from "lucide-react";
import { ReviewStars } from "@/components/shared/review-stars";

export interface FacilityHeaderProps {
  title: string;
  rating: number;
  reviewCount: number;
  city: string;
  state: string;
  address?: string;
  isVerified?: boolean;
}

export function FacilityHeader({
  title,
  rating,
  reviewCount,
  city,
  state,
  address = "123 Recovery Hill Road",
  isVerified = true,
}: FacilityHeaderProps) {
  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-4">
      {/* Dynamic badges */}
      <div className="flex flex-wrap gap-2">
        {isVerified && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>State Licensed & Verified</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold border border-primary/20">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span>Joint Commission Accredited</span>
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
        {title}
      </h1>

      {/* Address */}
      <div className="flex items-center gap-2 text-slate-600 text-sm">
        <MapPin className="h-4.5 w-4.5 shrink-0 text-slate-400" />
        <span className="font-light">
          {address}, {city}, {state}
        </span>
      </div>

      {/* Ratings stars */}
      <div className="flex items-center gap-3 pt-1 border-t border-slate-100 mt-2">
        <ReviewStars rating={rating} reviewCount={reviewCount} showText className="text-sm" />
      </div>
    </div>
  );
}
export default FacilityHeader;
