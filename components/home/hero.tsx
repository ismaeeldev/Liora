"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, X, SlidersHorizontal, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", name: "All Programs", placeholder: "Enter city, state, zip or facility name..." },
  { id: "rehab", name: "Inpatient Rehab", placeholder: "Search inpatient rehab clinics..." },
  { id: "detox", name: "Detox Programs", placeholder: "Search medical detox centers..." },
  { id: "mental", name: "Mental Health", placeholder: "Search psychiatric or trauma facilities..." },
  { id: "outpatient", name: "Outpatient Care", placeholder: "Search partial hospitalization & outpatient..." },
];

const HERO_INSURANCES = [
  { label: "Aetna", value: "aetna" },
  { label: "Blue Cross", value: "bluecross" },
  { label: "Cigna", value: "cigna" },
  { label: "UnitedHealth", value: "united" },
  { label: "Humana", value: "humana" },
  { label: "Medicaid", value: "medicaid" },
];

const HERO_AMENITIES = [
  { label: "Private Rooms", value: "private-room" },
  { label: "Chef-prepared Meals", value: "chef-meals" },
  { label: "Pool & Spa", value: "pool" },
  { label: "Gym / Fitness Center", value: "gym" },
  { label: "Pet Friendly", value: "pet-friendly" },
  { label: "Holistic Therapy", value: "holistic" },
];

const TRUST_TAGS = [
  { icon: ShieldCheck, text: "HIPAA Compliant & Confidential" },
  { icon: Heart, text: "Joint Commission Accredited Facilities" },
  { icon: Sparkles, text: "Luxury & Executive Amenity Matches" },
];

export function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const activePlaceholder = TABS.find((t) => t.id === activeTab)?.placeholder || TABS[0].placeholder;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeTab !== "all") params.set("category", activeTab);
    
    if (selectedInsurances.length > 0) {
      params.set("insurance", selectedInsurances.join(","));
    }
    if (selectedAmenities.length > 0) {
      params.set("amenities", selectedAmenities.join(","));
    }
    
    router.push(`/listings?${params.toString()}`);
  };

  const toggleInsurance = (insurance: string) => {
    setSelectedInsurances((prev) =>
      prev.includes(insurance) ? prev.filter((i) => i !== insurance) : [...prev, insurance]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedInsurances([]);
    setSelectedAmenities([]);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 md:py-32">
      {/* Background Imagery */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-slate-900"
        style={{
          backgroundImage: `url('/images/wellness_hero_bg.png')`,
        }}
      >
        {/* Layered calming overlays for maximum contrast & premium medical feeling */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-slate-950/40" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        
        {/* Top Accent Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/35 text-secondary-foreground text-xs md:text-sm font-semibold tracking-wide uppercase"
        >
          <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>Premier Behavioral Health Directory</span>
        </motion.div>

        {/* H1 Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white max-w-3xl leading-[1.1]"
        >
          Find Healing. <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-teal-200 via-white to-teal-100 bg-clip-text text-transparent drop-shadow-sm">
            Discover Trusted Care.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-base md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed"
        >
          Compare verified treatment facilities, luxury recovery programs, and dedicated rehab specialists near you.
        </motion.p>

        {/* Zillow-Style Search Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl mt-10"
        >
          {/* Tabs Navigation (Horizontal scrolling on small screens) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1 mb-2 bg-slate-950/40 backdrop-blur-md p-1 rounded-t-xl max-w-fit mx-auto border-t border-x border-slate-700/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Combined Search Bar & Options Panel */}
          <div className="bg-surface/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 overflow-hidden text-left ring-1 ring-black/5">
            <form onSubmit={handleSearch} className="p-3 md:p-4 flex flex-col md:flex-row gap-3">
              {/* Input wrapper */}
              <div className="relative flex-1 flex items-center bg-muted/40 hover:bg-muted/70 focus-within:bg-surface focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 rounded-xl transition-all border border-border/50">
                <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground/80 shrink-0" />
                <input
                  type="text"
                  placeholder={activePlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-transparent text-sm md:text-base outline-none text-slate-800 placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Advanced Filters Toggle */}
                <Button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex-1 md:flex-initial h-12 px-5 rounded-full font-medium border border-border flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]",
                    showFilters
                      ? "bg-secondary text-secondary-foreground border-teal-200 hover:bg-secondary/80 shadow-sm"
                      : "bg-surface text-slate-700 hover:bg-slate-50 hover:shadow-sm"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {(selectedInsurances.length > 0 || selectedAmenities.length > 0) && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full font-bold">
                      {selectedInsurances.length + selectedAmenities.length}
                    </span>
                  )}
                </Button>

                {/* Primary Search Button */}
                <Button
                  type="submit"
                  className="flex-1 md:flex-initial h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgb(0,118,255,0.39)] transition-transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
              </div>
            </form>

            {/* Advanced Filters Expandable Drawer/Section */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="border-t border-border/80 bg-muted/20"
                >
                  <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Insurance Filter */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1">
                        <span>Accepted Insurances</span>
                        <span className="text-xs text-muted-foreground font-normal">(Select all that apply)</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {HERO_INSURANCES.map((insurance) => (
                          <button
                            key={insurance.value}
                            type="button"
                            onClick={() => toggleInsurance(insurance.value)}
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer",
                              selectedInsurances.includes(insurance.value)
                                ? "bg-primary/10 border-primary text-primary font-medium"
                                : "bg-surface border-border text-slate-600 hover:bg-muted"
                            )}
                          >
                            {insurance.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Luxury Amenities Filter */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1">
                        <span>Luxury Amenities</span>
                        <span className="text-xs text-muted-foreground font-normal">(Select all that apply)</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {HERO_AMENITIES.map((amenity) => (
                          <button
                            key={amenity.value}
                            type="button"
                            onClick={() => toggleAmenity(amenity.value)}
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer",
                              selectedAmenities.includes(amenity.value)
                                ? "bg-primary/10 border-primary text-primary font-medium"
                                : "bg-surface border-border text-slate-600 hover:bg-muted"
                            )}
                          >
                            {amenity.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar inside Filters drawer */}
                  <div className="px-4 py-3 bg-muted/40 border-t border-border flex items-center justify-between">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <Button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="h-8 px-4 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Helper Links / Suggested searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-x-2 gap-y-1.5 text-xs md:text-sm text-slate-300 font-light"
        >
          <span className="text-slate-400">Popular Searches:</span>
          {["Executive Detox", "Dual Diagnosis Rehab", "Outpatient PHP", "Holistic Healing"].map((item) => (
            <button
              key={item}
              onClick={() => setSearchQuery(item)}
              className="text-white underline decoration-slate-500 underline-offset-4 hover:decoration-secondary-foreground transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </motion.div>

        {/* Brand/Trust badges (calming feel) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 w-full border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300"
        >
          {TRUST_TAGS.map((tag, idx) => {
            const IconComponent = tag.icon;
            return (
              <div key={idx} className="flex items-center justify-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
                  <IconComponent className="h-4.5 w-4.5 text-secondary-foreground" />
                </div>
                <span className="text-xs md:text-sm font-medium tracking-wide">{tag.text}</span>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
