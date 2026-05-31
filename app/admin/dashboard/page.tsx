import React from "react";
import { prisma } from "@/lib/db/prisma";
import { ShieldCheck, Activity, Award, MessageSquare, Plus, CheckCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Query stats from Neon
  const [facilitiesCount, reviewsCount, inquiriesCount, facilities] = await Promise.all([
    prisma.facility.count(),
    prisma.review.count(),
    prisma.inquiry.count(),
    prisma.facility.findMany({
      include: {
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalOpenBeds = facilities.reduce((sum, f) => sum + f.bedsAvailable, 0);

  const STATS = [
    { label: "Total Facilities", value: facilitiesCount, icon: Activity, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Open Beds Capacity", value: totalOpenBeds, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Patient Reviews", value: reviewsCount, icon: Award, color: "text-violet-600 bg-violet-50 border-violet-100" },
    { label: "Pending Inquiries", value: inquiriesCount, icon: MessageSquare, color: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Console Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back to your administrator dashboard. Review live metrics and moderate content updates.
          </p>
        </div>
        <Link 
          href="/listings"
          className="inline-flex items-center justify-center h-10 px-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium shadow-md shadow-primary/10 transition-all hover:scale-[1.01] text-sm"
        >
          <Plus className="h-4 w-4 mr-1.5 shrink-0" />
          <span>Search Directory</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
            >
              <div className={`p-3 rounded-xl border shrink-0 ${stat.color}`}>
                <IconComp className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-2xl font-extrabold text-slate-900 block leading-none">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Facilities List */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Managed Facilities
          </h2>
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
            {facilities.length} Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Facility Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Beds (Avail / Total)</th>
                <th className="p-4">Est. Cost</th>
                <th className="p-4">Verification</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-600 text-sm">
              {facilities.slice(0, 5).map((fac) => (
                <tr key={fac.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-900">
                    {fac.name}
                    {fac.isFeatured && (
                      <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                        FEATURED
                      </span>
                    )}
                  </td>
                  <td className="p-4">{fac.city}, {fac.state}</td>
                  <td className="p-4 font-medium">
                    <span className={fac.bedsAvailable > 0 ? "text-emerald-600" : "text-amber-600"}>
                      {fac.bedsAvailable}
                    </span>
                    <span className="text-slate-500"> / {fac.bedsCount}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-900">
                    ${fac.priceMin.toLocaleString()}
                    {fac.priceMax && ` - $${fac.priceMax.toLocaleString()}`}
                  </td>
                  <td className="p-4">
                    {fac.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <HelpCircle className="h-4 w-4" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Link 
                      href={`/facility/${fac.slug}`}
                      className="text-xs font-bold text-primary hover:text-primary-hover hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {facilities.length > 5 && (
          <div className="p-4 border-t border-border text-center">
            <Link 
              href="/admin/dashboard/facilities"
              className="text-sm font-bold text-primary hover:text-primary-hover hover:underline"
            >
              View All Facilities ({facilities.length})
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
