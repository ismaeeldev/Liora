"use client";

import React from "react";
import {
  Stethoscope, 
  HeartHandshake, 
  Activity, 
  Users, 
  Truck, 
  Utensils, 
  CalendarCheck,
  CheckCircle2,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceCategory = "Clinical Care" | "Program Services" | "Lifestyle Support";

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  iconName?: string;
}

export interface FacilityServicesProps {
  services?: ServiceItem[];
}

// Icon mapper for dynamic database-driven lookup strings
const ICON_MAP: Record<string, LucideIcon> = {
  detox: Stethoscope,
  therapy: HeartHandshake,
  medical: Activity,
  group: Users,
  family: Users,
  transport: Truck,
  meals: Utensils,
  aftercare: CalendarCheck,
  default: CheckCircle2
};

export function FacilityServices({ services = [] }: FacilityServicesProps) {
  
  // Default mock services if none passed, representing clinical, program, and lifestyle requirements
  const displayServices = services.length > 0 ? services : [
    { id: "1", name: "Medical Detoxification", category: "Clinical Care" as ServiceCategory, iconName: "detox" },
    { id: "2", name: "Individual CBT/DBT Therapy", category: "Clinical Care" as ServiceCategory, iconName: "therapy" },
    { id: "3", name: "Medication Assisted Treatment (MAT)", category: "Clinical Care" as ServiceCategory, iconName: "medical" },
    { id: "4", name: "Family Counselling Sessions", category: "Program Services" as ServiceCategory, iconName: "family" },
    { id: "5", name: "Group Therapy Workshops", category: "Program Services" as ServiceCategory, iconName: "group" },
    { id: "6", name: "Relapse Prevention Seminars", category: "Program Services" as ServiceCategory, iconName: "aftercare" },
    { id: "7", name: "Patient Transportation Services", category: "Lifestyle Support" as ServiceCategory, iconName: "transport" },
    { id: "8", name: "Chef-Prepared Nutritional Meals", category: "Lifestyle Support" as ServiceCategory, iconName: "meals" },
    { id: "9", name: "Aftercare & Sober Living Match", category: "Lifestyle Support" as ServiceCategory, iconName: "aftercare" },
  ];

  // Group services by category type
  const groupedServices: Record<ServiceCategory, ServiceItem[]> = {
    "Clinical Care": [],
    "Program Services": [],
    "Lifestyle Support": [],
  };

  displayServices.forEach((item) => {
    if (groupedServices[item.category]) {
      groupedServices[item.category].push(item);
    }
  });

  const CATEGORIES: { id: ServiceCategory; title: string; color: string; desc: string }[] = [
    {
      id: "Clinical Care",
      title: "Clinical Care",
      color: "border-teal-100 bg-teal-50/10 text-teal-800",
      desc: "Accredited medical therapies & withdrawal management.",
    },
    {
      id: "Program Services",
      title: "Program Services",
      color: "border-blue-100 bg-blue-50/10 text-blue-800",
      desc: "Structured rehabilitation workshops and counseling.",
    },
    {
      id: "Lifestyle Support",
      title: "Lifestyle Support",
      color: "border-violet-100 bg-violet-50/10 text-violet-800",
      desc: "Daily accommodation comforts and recovery transport.",
    },
  ];

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Treatment & Services
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1 font-light">
          Compare verified clinical treatments and accommodation amenities below.
        </p>
      </div>

      {/* Grid containing the 3 categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
        {CATEGORIES.map((cat) => {
          const items = groupedServices[cat.id] || [];
          return (
            <div 
              key={cat.id} 
              className={cn(
                "p-5 rounded-2xl border flex flex-col h-full shadow-xs hover:shadow-md hover:scale-[1.01] hover:bg-surface/60 transition-all duration-300",
                cat.color.split(" ")[0] // Border class
              )}
            >
              {/* Category Header */}
              <div className="mb-4">
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                  cat.color.split(" ")[1], // Background class
                  cat.color.split(" ")[2]  // Text class
                )}>
                  {cat.title}
                </span>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Services List inside Category */}
              <ul className="space-y-3.5 mt-2 flex-grow">
                {items.map((item) => {
                  const IconComp = ICON_MAP[item.iconName || ""] || ICON_MAP.default;
                  return (
                    <li 
                      key={item.id} 
                      className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100/80 text-slate-500 shrink-0">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <span className="text-xs md:text-sm font-medium leading-tight">
                        {item.name}
                      </span>
                    </li>
                  );
                })}
                {items.length === 0 && (
                  <li className="text-xs text-slate-400 italic">No services listed</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default FacilityServices;
