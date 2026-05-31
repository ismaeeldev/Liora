import React from "react";
import ListingsView from "./listings-view";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { FacilityCategory } from "@/types";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ListingsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  
  // Extract all advanced filters
  const treatmentType = typeof resolvedParams.treatmentType === "string" ? resolvedParams.treatmentType.split(",") : [];
  const insurance = typeof resolvedParams.insurance === "string" ? resolvedParams.insurance.split(",") : [];
  const gender = typeof resolvedParams.gender === "string" ? resolvedParams.gender.split(",") : [];
  const age = typeof resolvedParams.age === "string" ? resolvedParams.age.split(",") : [];
  const amenities = typeof resolvedParams.amenities === "string" ? resolvedParams.amenities.split(",") : [];

  const where: Prisma.FacilityWhereInput = {};
  
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { state: { contains: q, mode: "insensitive" } },
      { zipCode: { contains: q, mode: "insensitive" } },
    ];
  }

  let dbFacilities: any[] = [];
  try {
    dbFacilities = await prisma.facility.findMany({
      where,
      include: {
        images: true,
        categories: true,
        reviews: true,
      },
    });
  } catch (error) {
    console.error("Prisma query failed on Listings page:", error);
  }

  // Filter in memory for categories since it's a relation (or we could do it in Prisma)
  let filteredFacilities = dbFacilities;
  
  if (category && category !== "all") {
    filteredFacilities = filteredFacilities.filter(f => 
      f.categories.some((c: { name: string }) => c.name.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Apply Advanced Filters
  if (treatmentType.length > 0) {
    filteredFacilities = filteredFacilities.filter(f => 
      f.categories.some((c: { name: string }) => treatmentType.some(t => c.name.toLowerCase().includes(t.toLowerCase()))) ||
      f.conditionsTreated.some((cond: string) => treatmentType.some(t => cond.toLowerCase().includes(t.toLowerCase())))
    );
  }

  if (insurance.length > 0) {
    filteredFacilities = filteredFacilities.filter(f => 
      insurance.some(ins => f.insuranceAccepted.toLowerCase().includes(ins.toLowerCase()))
    );
  }

  if (gender.length > 0) {
    filteredFacilities = filteredFacilities.filter(f => 
      gender.some(g => f.genderSupport.toLowerCase().includes(g.toLowerCase()))
    );
  }

  if (age.length > 0) {
    filteredFacilities = filteredFacilities.filter(f => 
      age.some(a => f.conditionsTreated.some((cond: string) => cond.toLowerCase().includes(a.toLowerCase())))
    );
  }

  const mappedFacilities = filteredFacilities.map((fac) => {
    const primaryImage = fac.images.find((img: { isPrimary: boolean }) => img.isPrimary) || fac.images[0];
    const totalRating = fac.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
    const rating = fac.reviews.length > 0 ? Number((totalRating / fac.reviews.length).toFixed(1)) : 4.8;
    const reviewCount = fac.reviews.length;

    const catName = (fac.categories[0]?.name || "Residential") as FacilityCategory;

    return {
      id: fac.id,
      title: fac.name,
      imageUrl: primaryImage ? primaryImage.url : "/images/wellness_hero_bg.png",
      categories: fac.categories.map((c: { name: string }) => c.name),
      category: catName,
      insuranceAccepted: fac.insuranceAccepted,
      rating,
      reviewCount,
      priceMin: fac.priceMin,
      priceMax: fac.priceMax,
      slug: fac.slug,
      bedsAvailable: fac.bedsAvailable,
      city: fac.city,
      state: fac.state,
      position: [fac.latitude || 33.5794, fac.longitude || -112.1124] as [number, number],
    };
  });

  return <ListingsView initialFacilities={mappedFacilities} />;
}
