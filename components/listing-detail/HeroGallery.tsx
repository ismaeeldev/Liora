"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroGalleryProps {
  images: { id: string; url: string; isPrimary: boolean }[];
}

export function HeroGallery({ images }: HeroGalleryProps) {
  // If images are empty, fallback to mock data
  const galleryImages = images.length > 0 ? images : [
    { id: "1", url: "/images/wellness_hero_bg.png", isPrimary: true },
    { id: "2", url: "/images/clinic_one.png", isPrimary: false },
    { id: "3", url: "/images/clinic_two.png", isPrimary: false },
  ];

  // Extend to 5 mock items if needed for the Zillow split layout
  const displayImages = galleryImages.length >= 3 
    ? galleryImages.slice(0, 3) 
    : [...galleryImages, ...galleryImages, ...galleryImages].slice(0, 3);

  const allImages = galleryImages.length >= 5 
    ? galleryImages 
    : [...galleryImages, ...galleryImages].slice(0, 5);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize Embla Carousel for mobile layout
  const [emblaRef] = useEmblaCarousel({ loop: true });

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-md">
      
      {/* 1. Mobile Carousel Layout (visible on screen widths < md) */}
      <div className="block md:hidden relative overflow-hidden bg-slate-900 aspect-[4/3]" ref={emblaRef}>
        <div className="flex h-full">
          {allImages.map((img, idx) => (
            <div 
              key={`mobile-${img.id}-${idx}`} 
              className="relative flex-[0_0_100%] min-w-0 h-full cursor-pointer"
              onClick={() => openModal(idx)}
            >
              <Image
                src={img.url}
                alt={`Facility view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Floating Page Number indicator */}
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1 text-xs font-semibold text-white bg-slate-950/60 backdrop-blur-xs rounded-full">
          {currentIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* 2. Desktop Split Grid Layout (visible on screen widths >= md) */}
      {/* Zillow style: 1 large left image, 2 stacked right images */}
      <div className="hidden md:grid grid-cols-3 gap-2 aspect-[21/9] w-full bg-slate-100">
        
        {/* Main Cover (Occupies 2/3 width) */}
        <div 
          className="col-span-2 relative h-full w-full overflow-hidden cursor-pointer group"
          onClick={() => openModal(0)}
        >
          <Image
            src={displayImages[0].url}
            alt="Facility main view"
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            sizes="(max-width: 1200px) 70vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        </div>

        {/* Stacked Right Panel (Occupies 1/3 width, split dynamically) */}
        <div className="grid grid-rows-2 gap-2 h-full">
          {displayImages.slice(1, 3).map((img, idx) => (
            <div
              key={`right-${img.id}-${idx}`}
              className="relative h-full w-full overflow-hidden cursor-pointer group"
              onClick={() => openModal(idx + 1)}
            >
              <Image
                src={img.url}
                alt={`Facility detail ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1200px) 35vw, 30vw"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom Right: "Show all photos" floating triggers */}
        <button
          type="button"
          onClick={() => openModal(0)}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-surface/90 hover:bg-surface border border-border shadow-md rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ImageIcon className="h-4 w-4" />
          <span>Show all photos</span>
        </button>
      </div>

      {/* 3. Fullscreen Modal Image Viewer Overlay (Framer Motion transitions) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between"
          >
            {/* Modal Header controls */}
            <div className="p-4 flex items-center justify-between z-10 text-white">
              <span className="text-sm font-semibold tracking-wider">
                {currentIndex + 1} / {allImages.length}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                aria-label="Close gallery"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Viewport (Large Image + Paging arrows) */}
            <div className="relative flex-1 flex items-center justify-center px-4 md:px-12 select-none">
              
              {/* Left Arrow */}
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 md:left-8 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Central Dynamic Image */}
              <div className="relative w-full max-w-4xl h-[60vh] md:h-[70vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={allImages[currentIndex].url}
                      alt={`Facility fullscreen view ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1200px) 100vw, 85vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 md:right-8 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Thumbnails list (Horizontal scroll bar) */}
            <div className="bg-black/40 border-t border-white/10 py-4 px-4 overflow-x-auto no-scrollbar flex justify-center gap-3">
              {allImages.map((img, idx) => (
                <div
                  key={`thumb-${img.id}-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative h-14 w-20 md:h-16 md:w-24 overflow-hidden rounded-md border-2 transition-all cursor-pointer shrink-0",
                    currentIndex === idx
                      ? "border-primary scale-105 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
export default HeroGallery;
