"use client";

import React from "react";
import { Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ListingTag } from "@/components/shared/badges";

export interface PricingCardProps {
  priceMin: number;
  priceMax?: number;
  insuranceAccepted?: string;
  bedsAvailable?: number;
}

export function PricingCard({
  priceMin,
  priceMax,
  insuranceAccepted = "Accepts Aetna, BCBS, Cigna",
  bedsAvailable = 4,
}: PricingCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  };

  return (
    <Card className="bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-6 space-y-5">
        
        {/* Cost Section */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Estimated Monthly Cost
          </span>
          <div className="flex items-baseline gap-1 text-slate-950">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              ${formatPrice(priceMin)}
            </h3>
            {priceMax && (
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                - ${formatPrice(priceMax)}
              </h3>
            )}
            <span className="text-slate-500 font-light text-sm ml-1">/ month</span>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500">Availability</span>
          <ListingTag status={bedsAvailable > 0 ? "success" : "warning"} className="text-[10px] px-2.5 py-0.5 font-bold">
            {bedsAvailable > 0 ? `${bedsAvailable} Beds Open` : "Waitlist Only"}
          </ListingTag>
        </div>

        {/* Insurance accepted list */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Insurance Match
          </span>
          <div className="flex items-start gap-2 text-xs text-slate-600 bg-teal-50/20 border border-teal-100/50 p-3 rounded-xl">
            <CheckCircle2 className="h-4.5 w-4.5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 leading-none mb-1">Accepts Private Insurance</p>
              <p className="font-light leading-relaxed">{insuranceAccepted}</p>
            </div>
          </div>
        </div>

        {/* Info Disclaimer */}
        <div className="flex gap-1.5 text-[10px] text-slate-400 leading-relaxed font-light">
          <Info className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span>Costs are estimated based on typical programs lengths. Direct intake specialists can verify exact insurance coverage values.</span>
        </div>

      </CardContent>
    </Card>
  );
}
export default PricingCard;
