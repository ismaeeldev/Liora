"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Bed, DollarSign } from "lucide-react";
import { ReviewStars } from "@/components/shared/review-stars";
import { ListingTag } from "@/components/shared/badges";
import { Card, CardContent } from "@/components/ui/card";
import { useMapStore } from "@/lib/store/map-store";
import { useRouter } from "next/navigation";

export interface ListingCardProps {
  id: string;
  slug?: string;
  title: string;
  imageUrl: string;
  categories: string[];
  insuranceAccepted?: string;
  rating: number;
  reviewCount: number;
  priceMin: number;
  priceMax?: number;
  bedsAvailable: number;
  distance?: number;
  city: string;
  state: string;
  isFeatured?: boolean;
  position?: [number, number];
}

export function ListingCard({
  id,
  title,
  imageUrl,
  categories,
  insuranceAccepted = "In-Network / Most Insurances",
  rating,
  reviewCount,
  priceMin,
  priceMax,
  bedsAvailable,
  distance,
  city,
  state,
  isFeatured = false,
  position,
  slug,
}: ListingCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Hook into Zustand map store
  const { 
    selectedFacilityId, 
    setSelectedFacilityId,
    setHoveredFacilityId,
    setActiveMarkerId,
    setMapCenter,
    setMapZoom
  } = useMapStore();

  const isSelected = selectedFacilityId === id;

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  };

  const handleCardClick = () => {
    setSelectedFacilityId(id);
    setActiveMarkerId(id);
    if (position) {
      setMapCenter(position);
      setMapZoom(12); // Zillow-style zoom in on click
    }
    // Navigate to details page when the card is clicked
    router.push(`/facility/${slug || id}`);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
      onMouseEnter={() => setHoveredFacilityId(id)}
      onMouseLeave={() => setHoveredFacilityId(null)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View map location for ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <Card className={`group relative h-full flex flex-col overflow-hidden bg-surface border py-0 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? "border-primary ring-2 ring-primary ring-offset-1 shadow-md scale-[1.01]" 
          : "border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5"
      }`}>
        
        {/* Card Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 shadow-[inset_0_-20px_40px_rgb(0,0,0,0.4)]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            priority={isFeatured}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {isFeatured && (
              <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase bg-slate-900 text-white rounded shadow-sm border border-white/10">
                Featured
              </span>
            )}
            <ListingTag status={bedsAvailable > 0 ? "success" : "warning"} className="w-fit text-[9px] px-1.5 py-0.5 font-semibold">
              {bedsAvailable > 0 ? "Beds Available" : "Waitlist Only"}
            </ListingTag>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Avoid card selection trigger
              setIsSaved(!isSaved);
            }}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 backdrop-blur-xs border border-border/50 text-slate-700 shadow-sm hover:bg-surface hover:text-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none"
            aria-label={isSaved ? `Unsave ${title}` : `Save ${title}`}
            aria-pressed={isSaved}
          >
            <motion.div
              animate={{ scale: isSaved ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${
                  isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"
                }`}
              />
            </motion.div>
          </button>
        </div>

        {/* Card Content Details */}
        <CardContent className="flex flex-col flex-1 p-3.5">
          {/* Location & Distance */}
          <div className="flex items-center justify-between gap-2 text-slate-500 text-[11px] mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="truncate">{city}, {state}</span>
            </span>
            {distance !== undefined && (
              <span className="shrink-0 font-medium bg-muted px-2 py-0.5 rounded-full text-slate-600">
                {distance.toFixed(1)} mi
              </span>
            )}
          </div>

          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link 
              href={`/facility/${slug || id}`}
              className="flex-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>
            <Link 
              href={`/facility/${slug || id}`}
              className="text-[10px] font-bold text-primary shrink-0 transition-colors self-center flex items-center gap-0.5 hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View details for ${title}`}
            >
              <span>Details</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Reviews */}
          <div className="mb-1.5">
            <ReviewStars
              rating={rating}
              reviewCount={reviewCount}
              showText
              className="text-[11px]"
            />
          </div>

          {/* Insurance Accepted */}
          <div className="flex items-center gap-1 text-[11px] text-teal-700 font-semibold mb-2">
            <svg className="h-3 w-3 shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="truncate">{insuranceAccepted}</span>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="px-1.5 py-0.5 text-[9px] bg-secondary/60 text-secondary-foreground rounded font-medium border border-teal-100/40"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Bed availability & Pricing */}
          <div className="mt-auto pt-2.5 border-t border-border/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-slate-600">
              <Bed className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="text-xs">
                <strong className="font-bold text-slate-800">
                  {bedsAvailable}
                </strong>{" "}
                bed{bedsAvailable !== 1 && "s"} open
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-[9px] uppercase font-semibold text-slate-400 block tracking-wider leading-none" aria-hidden="true">
                Est. Cost
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-900 flex items-center justify-end" aria-label={`Estimated cost from ${formatPrice(priceMin)}`}>
                <DollarSign className="h-3.5 w-3.5 -mr-0.5 text-slate-600" aria-hidden="true" />
                {formatPrice(priceMin)}
                {priceMax && ` - $${formatPrice(priceMax)}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
