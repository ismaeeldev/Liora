import React from "react";
import { prisma } from "@/lib/db/prisma";
import { FacilityForm } from "@/components/admin/facility-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [services, categories, facility] = await Promise.all([
    prisma.facilityService.findMany({ select: { id: true, name: true } }),
    prisma.facilityCategory.findMany({ select: { id: true, name: true } }),
    prisma.facility.findUnique({
      where: { id },
      include: {
        images: true,
        services: true,
        categories: true,
      },
    }),
  ]);

  if (!facility) {
    notFound();
  }

  // Format initial data for the form
  const initialData = {
    ...facility,
    latitude: facility.latitude ?? undefined,
    longitude: facility.longitude ?? undefined,
    phone: facility.phone ?? undefined,
    website: facility.website ?? undefined,
    priceMax: facility.priceMax ?? undefined,
    ownerId: facility.ownerId ?? undefined,
    images: facility.images.map((img) => img.url),
    services: facility.services.map((srv) => srv.id),
    categories: facility.categories.map((cat) => cat.id),
  };

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Facility</h1>
          <p className="text-sm text-slate-500 mt-1">
            Update details and configuration for {facility.name}.
          </p>
        </div>
      </div>

      <FacilityForm 
        initialData={initialData}
        availableServices={services} 
        availableCategories={categories} 
      />
    </div>
  );
}
