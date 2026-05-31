import React from "react";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { FacilityActions } from "@/components/admin/facility-actions";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Search, 
  MapPin, 
  BedDouble, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Star,
  Plus
} from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
}

export default async function AdminFacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.q || "";

  let facilities: any[] = [];
  try {
    facilities = await prisma.facility.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        reviews: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Prisma error loading facilities in admin dashboard:", error);
  }

  return (
    <div className="space-y-8">
      {/* Title / Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Managed Facilities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure beds, details, images, and search visibility for clinics and care homes.
          </p>
        </div>
        <Link
          href="/admin/dashboard/facilities/new"
          className="inline-flex items-center justify-center h-10 px-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium shadow-md shadow-primary/10 transition-all hover:scale-[1.01] text-sm shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add New Facility</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
        <form method="GET" className="flex gap-2 max-w-lg w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Search by facility name, city, or state..."
              className="w-full pl-11 pr-4 py-2 bg-muted hover:bg-muted/80 focus:bg-surface text-slate-800 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm transition-all"
            />
          </div>
          <Button type="submit" className="h-10 rounded-xl px-5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer">
            Search
          </Button>
          {search && (
            <Link
              href="/admin/dashboard/facilities"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-border bg-surface text-slate-600 hover:bg-muted text-xs font-semibold cursor-pointer"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 gap-5">
        {facilities.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No facilities found matching your search.</p>
          </div>
        ) : (
          facilities.map((facility) => {
            const avgRating = facility.reviews.length
              ? (facility.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / facility.reviews.length).toFixed(1)
              : null;

            return (
              <div 
                key={facility.id} 
                className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:shadow-md transition-shadow"
              >
                {/* Image Preview */}
                <div className="w-full lg:w-36 h-24 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                  {facility.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={facility.images[0].url} 
                      alt={facility.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Building2 className="h-8 w-8" />
                    </div>
                  )}
                  {facility.isFeatured && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase">
                      Featured
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 truncate">{facility.name}</h2>
                    {avgRating && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md border border-amber-100">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {avgRating} ({facility.reviews.length})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {facility.city}, {facility.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                      {facility.bedsAvailable} / {facility.bedsCount} beds open
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      ${facility.priceMin.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                {/* Badges / Status */}
                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 justify-between lg:justify-end">
                  <div>
                    {facility.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-full">
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </div>
                  <FacilityActions id={facility.id} slug={facility.slug} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
