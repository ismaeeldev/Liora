import { Hero } from "@/components/home/hero";
import { FilterBar } from "@/components/home/filter-bar";
import { ListingCard } from "@/components/listings";
import { MapWrapper } from "@/components/map/MapWrapper";
import { prisma } from "@/lib/db/prisma";
import Script from "next/script";
import { Search, ShieldCheck, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Query featured facilities from Neon
  let featuredDbFacilities: any[] = [];
  try {
    featuredDbFacilities = await prisma.facility.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        images: true,
        categories: true,
        reviews: true,
      },
      take: 3,
    });
  } catch (error) {
    console.error("Prisma query failed on Homepage:", error);
  }

  const listings = featuredDbFacilities.map((fac) => {
    const primaryImage = fac.images.find((img: { isPrimary: boolean }) => img.isPrimary) || fac.images[0];
    const totalRating = fac.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
    const rating = fac.reviews.length > 0 ? Number((totalRating / fac.reviews.length).toFixed(1)) : 4.8;
    const reviewCount = fac.reviews.length;

    return {
      id: fac.id,
      title: fac.name,
      imageUrl: primaryImage ? primaryImage.url : "/images/wellness_hero_bg.png",
      categories: fac.categories.map((c: { name: string }) => c.name),
      rating,
      reviewCount,
      priceMin: fac.priceMin,
      priceMax: fac.priceMax || undefined,
      slug: fac.slug,
      bedsAvailable: fac.bedsAvailable,
      city: fac.city,
      state: fac.state,
      isFeatured: fac.isFeatured,
      position: fac.latitude && fac.longitude ? [fac.latitude, fac.longitude] as [number, number] : undefined,
    };
  });

  // Query all map markers from Neon
  let mapDbFacilities: any[] = [];
  try {
    mapDbFacilities = await prisma.facility.findMany({
      take: 10,
    });
  } catch (error) {
    console.error("Prisma map query failed on Homepage:", error);
  }

  const mapMarkers = mapDbFacilities.map((fac) => ({
    id: fac.id,
    position: [fac.latitude || 33.5794, fac.longitude || -112.1124] as [number, number],
    title: fac.name,
    price: fac.priceMin,
    bedsAvailable: fac.bedsAvailable,
    city: `${fac.city}, ${fac.state}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aldora Marketplace",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com",
    description: "Behavioral health platform connecting you to trusted care.",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Script
        id="schema-org-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero section */}
      <main className="flex-grow">
        <Hero />

        {/* Reusable Featured Listing Cards Grid */}
        <section className="py-24 md:py-32 px-4 md:px-8 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-primary block mb-3">
                  Handpicked Recoveries
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
                  Featured Treatment Facilities
                </h2>
              </div>
              <p className="mt-2 md:mt-0 text-slate-500 text-sm max-w-md">
                Verified high-quality rehabilitation and mental health resorts offering immediate intake and top accreditation.
              </p>
            </div>

            {/* Grid structure (1 col mobile, 2 col tablet, 3 col desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </div>
        </section>

        {/* Leaflet Map Section */}
        <section className="py-24 md:py-32 px-4 md:px-8 bg-surface border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center md:text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-primary block mb-3">
                Geographic Intake Match
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
                Explore Care Nationwide
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Zoom and click individual facility pins to view open bed statuses.
              </p>
            </div>

            {/* Map Container */}
            <div className="h-[450px] w-full rounded-2xl border border-border shadow-md overflow-hidden relative">
              <MapWrapper
                center={[33.5794, -112.1124]} // Center of Phoenix, AZ area
                zoom={10}
                markers={mapMarkers}
              />
            </div>
          </div>
        </section>

        {/* Feature grid to showcase luxury medical brand style */}
        <section className="bg-surface py-24 md:py-32 px-4 md:px-8 border-t border-border">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
              Simplifying the search for recovery
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Connecting patients, families, and healthcare providers to verified and trustworthy treatment clinics.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Detailed Listings",
                  desc: "Filter by therapies, programs, accepted insurance networks, and wellness accommodations.",
                  icon: Search
                },
                {
                  title: "Accredited Partners",
                  desc: "We verify state licensing and Joint Commission badges to offer peace of mind.",
                  icon: ShieldCheck
                },
                {
                  title: "Direct Inquiry",
                  desc: "Contact facility coordinators securely and privately directly through the platform.",
                  icon: MessageCircle
                }
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div key={idx} className="p-8 rounded-3xl border border-border/50 bg-background shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 text-left group">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
