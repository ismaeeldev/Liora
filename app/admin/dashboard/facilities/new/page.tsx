import React from "react";
import { prisma } from "@/lib/db/prisma";
import { FacilityForm } from "@/components/admin/facility-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewFacilityPage() {
  const [services, categories] = await Promise.all([
    prisma.facilityService.findMany({ select: { id: true, name: true } }),
    prisma.facilityCategory.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dashboard/facilities"
          className="flex items-center justify-center h-10 w-10 rounded-xl bg-surface border border-border text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Facility</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details below to add a new facility to the marketplace directory.
          </p>
        </div>
      </div>

      <FacilityForm 
        availableServices={services} 
        availableCategories={categories} 
      />
    </div>
  );
}
