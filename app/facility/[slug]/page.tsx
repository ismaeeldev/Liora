import React from "react";
import { Metadata } from "next";
import Script from "next/script";

import {
  HeroGallery,
  FacilityHeader,
  FacilityInfo,
  FacilityServices,
  RoomTypes,
  ReviewsSection,
  ContactSidebar,
  MiniMap,
  PricingCard,
} from "@/components/listing-detail";

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const safeSlug = slug || "demo-facility";

  let dbFacility = await prisma.facility.findUnique({
    where: { slug: safeSlug },
    include: { images: true },
  });

  if (!dbFacility && safeSlug === "demo-facility") {
    dbFacility = await prisma.facility.findFirst({
      where: { isFeatured: true },
      include: { images: true },
    });
    if (!dbFacility) {
      dbFacility = await prisma.facility.findFirst({
        include: { images: true },
      });
    }
  }

  if (!dbFacility) {
    return {
      title: "Facility Not Found | Aldora",
    };
  }

  const primaryImage = dbFacility.images.find((img: any) => img.isPrimary) || dbFacility.images[0];

  return {
    title: `${dbFacility.name} | ${dbFacility.city} Rehab & Mental Health Center`,
    description: `Contact ${dbFacility.name} in ${dbFacility.city}, ${dbFacility.state}. Premier behavioral health, detox, and rehab facility. ${dbFacility.description}`,
    keywords: [
      dbFacility.name,
      `${dbFacility.city} rehab`,
      "mental health facilities",
      "detox centers",
      "behavioral health programs",
      `${dbFacility.state} treatment center`,
      ...dbFacility.conditionsTreated
    ],
    openGraph: {
      title: `${dbFacility.name} | Local ${dbFacility.city} Rehab & Detox`,
      description: dbFacility.description,
      images: primaryImage ? [{ url: primaryImage.url, alt: dbFacility.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dbFacility.name} | Local ${dbFacility.city} Rehab & Detox`,
      description: dbFacility.description,
      images: primaryImage ? [primaryImage.url] : [],
    },
  };
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const safeSlug = slug || "demo-facility";

  // Query facility details dynamically from Neon database
  let dbFacility = await prisma.facility.findUnique({
    where: { slug: safeSlug },
    include: {
      images: true,
      categories: true,
      services: true,
      reviews: {
        where: { isApproved: true },
      },
    },
  });

  if (!dbFacility && safeSlug === "demo-facility") {
    dbFacility = await prisma.facility.findFirst({
      where: { isFeatured: true },
      include: {
        images: true,
        categories: true,
        services: true,
        reviews: {
          where: { isApproved: true },
        },
      },
    });
    if (!dbFacility) {
      dbFacility = await prisma.facility.findFirst({
        include: {
          images: true,
          categories: true,
          services: true,
          reviews: {
            where: { isApproved: true },
          },
        },
      });
    }
  }

  if (!dbFacility) {
    notFound();
  }

  // Calculate dynamic review metrics
  const totalRating = dbFacility.reviews.reduce((sum, r) => sum + r.rating, 0);
  const rating = dbFacility.reviews.length > 0 ? Number((totalRating / dbFacility.reviews.length).toFixed(1)) : 4.8;
  const reviewCount = dbFacility.reviews.length;

  const mappedServices = dbFacility.services.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category as "Clinical Care" | "Program Services" | "Lifestyle Support",
    iconName: s.iconName,
  }));

  const mappedReviews = dbFacility.reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    createdAt: r.createdAt.toISOString(),
    content: r.comment || "",
  }));

  // Reusable room types representation
  const roomTypes = [
    {
      id: "r1",
      name: "Private Luxury Suite",
      imageUrl: "/images/clinic_one.png",
      bedCount: 1,
      stayDuration: "Min. 30 Days",
      description: "A completely private, premium suite containing a king-size bed, workstation, private bathroom, and nature view windows.",
    },
    {
      id: "r2",
      name: "Shared Companionship Suite",
      imageUrl: "/images/clinic_two.png",
      bedCount: 2,
      stayDuration: "Flex Stay",
      description: "A comfortable shared room containing two double beds, dividers, shared closets, and direct courtyard accessibility.",
    },
  ];

  const facility = {
    id: dbFacility.id,
    title: dbFacility.name,
    slug: dbFacility.slug,
    description: dbFacility.description,
    city: dbFacility.city,
    state: dbFacility.state,
    address: dbFacility.address,
    rating,
    reviewCount,
    bedsCount: dbFacility.bedsCount,
    bedsAvailable: dbFacility.bedsAvailable,
    phone: dbFacility.phone || "1-800-555-0199",
    email: dbFacility.website || "intake@facility.com",
    priceMin: dbFacility.priceMin,
    priceMax: dbFacility.priceMax || undefined,
    insuranceAccepted: dbFacility.insuranceAccepted,
    genderSupport: dbFacility.genderSupport,
    sameDayAdmission: dbFacility.sameDayAdmission,
    licenseStatus: dbFacility.licenseStatus,
    conditionsTreated: dbFacility.conditionsTreated,
    position: [dbFacility.latitude || 33.5794, dbFacility.longitude || -112.1124] as [number, number],
    images: dbFacility.images.map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary,
    })),
    services: mappedServices,
    reviews: mappedReviews,
    roomTypes,
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      name: facility.title,
      description: facility.description,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com"}/facility/${facility.slug}`,
      telephone: facility.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: facility.address,
        addressLocality: facility.city,
        addressRegion: facility.state,
      },
      aggregateRating: facility.reviewCount > 0 ? {
        "@type": "AggregateRating",
        ratingValue: facility.rating,
        reviewCount: facility.reviewCount,
      } : undefined,
      medicalSpecialty: facility.conditionsTreated,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: facility.title,
      image: facility.images.length > 0 ? facility.images[0].url : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: facility.address,
        addressLocality: facility.city,
        addressRegion: facility.state,
      },
      telephone: facility.phone,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com"}/facility/${facility.slug}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: facility.position[0],
        longitude: facility.position[1],
      },
      priceRange: facility.priceMin ? `$${facility.priceMin.toLocaleString()}+` : "$$",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: facility.title,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com"}/facility/${facility.slug}`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: facility.phone,
        contactType: "Admissions",
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Script
        id={`schema-org-${facility.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-grow pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Gallery Section */}
        <div className="mb-8">
          <HeroGallery images={facility.images} />
        </div>

        {/* 2-Column Split: Info Left, Pricing/Contact Right (Zillow-style details) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Info details, 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <FacilityHeader
              title={facility.title}
              rating={facility.rating}
              reviewCount={facility.reviewCount}
              city={facility.city}
              state={facility.state}
              address={facility.address}
            />

            <FacilityInfo
              description={facility.description}
              bedsCount={facility.bedsCount}
              bedsAvailable={facility.bedsAvailable}
              insuranceAccepted={facility.insuranceAccepted}
              genderSupport={facility.genderSupport}
              sameDayAdmission={facility.sameDayAdmission}
              licenseStatus={facility.licenseStatus}
              conditionsTreated={facility.conditionsTreated}
            />

            <FacilityServices services={facility.services} />

            <RoomTypes roomTypes={facility.roomTypes} />

            {/* Map Placement */}
            <MiniMap
              position={facility.position}
              title={facility.title}
              category="Residential"
              price={facility.priceMin}
              bedsAvailable={facility.bedsAvailable}
              city={facility.city}
              address={facility.address}
            />

            <ReviewsSection 
              facilityId={facility.id} 
              reviews={facility.reviews} 
              averageRating={facility.rating} 
            />
          </div>

          {/* Right Column (Sticky Pricing and Contact Cards, 1/3 width) */}
          <div className="space-y-6">
            <div className="sticky top-20 space-y-6">
              <PricingCard
                priceMin={facility.priceMin}
                priceMax={facility.priceMax}
                insuranceAccepted={facility.insuranceAccepted}
                bedsAvailable={facility.bedsAvailable}
              />

              <ContactSidebar
                facilityId={facility.id}
                phone={facility.phone || undefined}
                priceMin={facility.priceMin}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
