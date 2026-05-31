"use client";

import React from "react";
import { Bed, CalendarCheck, UserCheck, ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FacilityInfoProps {
  description: string;
  bedsCount: number;
  bedsAvailable?: number;
  insuranceAccepted?: string;
  genderSupport?: string;
  sameDayAdmission?: boolean;
  licenseStatus?: string;
  conditionsTreated?: string[];
}

export function FacilityInfo({
  description,
  bedsCount,
  bedsAvailable = 4,
  insuranceAccepted = "Accepts Aetna, Blue Cross, Cigna, Humana",
  genderSupport = "Co-Ed / All Genders Welcome",
  sameDayAdmission = true,
  licenseStatus = "Active State License: #CA-9874-H",
  conditionsTreated = [
    "Substance Abuse",
    "Alcohol Addiction",
    "PTSD & Trauma",
    "Depression",
    "Anxiety Disorders",
    "Co-occurring Disorders",
  ],
}: FacilityInfoProps) {
  
  const KEY_ATTRIBUTES = [
    {
      icon: Bed,
      label: "Beds Capacity",
      value: `${bedsCount} Total Beds (${bedsAvailable} Open)`,
      colorClass: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      icon: ShieldCheck,
      label: "Insurance Accepted",
      value: insuranceAccepted,
      colorClass: "bg-teal-50 text-teal-700 border-teal-100",
    },
    {
      icon: UserCheck,
      label: "Gender Support",
      value: genderSupport,
      colorClass: "bg-violet-50 text-violet-700 border-violet-100",
    },
    {
      icon: CalendarCheck,
      label: "Same Day Admission",
      value: sameDayAdmission ? "Available" : "Call to Confirm",
      colorClass: sameDayAdmission 
        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
        : "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      icon: FileCheck,
      label: "Licensing Status",
      value: licenseStatus,
      colorClass: "bg-slate-50 text-slate-700 border-slate-200",
    },
  ];

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-8">
      
      {/* 1. Overview / Description */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
          Overview
        </h2>
        <p className="text-slate-600 font-light leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>

      {/* 2. Key Attributes Grid */}
      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">
          Facility Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KEY_ATTRIBUTES.map((attr, idx) => {
            const IconComp = attr.icon;
            return (
              <div 
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-all hover:bg-slate-50/50",
                  attr.colorClass.split(" ")[2] // Border color
                )}
              >
                <div className={cn("p-2 rounded-lg shrink-0", attr.colorClass.split(" ")[0], attr.colorClass.split(" ")[1])}>
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {attr.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 leading-snug">
                    {attr.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Conditions Treated */}
      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">
          Conditions Treated
        </h2>
        <div className="flex flex-wrap gap-2">
          {conditionsTreated.map((condition) => (
            <div
              key={condition}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium border border-teal-100 hover:bg-secondary/70 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-secondary-foreground/80 shrink-0" />
              <span>{condition}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
export default FacilityInfo;
