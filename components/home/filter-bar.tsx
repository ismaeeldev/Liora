"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";

// Filter structures
interface FilterOption {
  value: string;
  label: string;
}

interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

const FILTER_DATA: FilterCategory[] = [
  {
    id: "treatmentType",
    label: "Treatment Type",
    options: [
      { value: "detox", label: "Medical Detox" },
      { value: "inpatient", label: "Residential / Inpatient" },
      { value: "outpatient", label: "Outpatient (PHP / IOP)" },
      { value: "therapy", label: "Individual Therapy" },
      { value: "telehealth", label: "Telehealth / Virtual" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance Accepted",
    options: [
      { value: "aetna", label: "Aetna" },
      { value: "bluecross", label: "Blue Cross Blue Shield" },
      { value: "cigna", label: "Cigna" },
      { value: "united", label: "UnitedHealthcare" },
      { value: "humana", label: "Humana" },
      { value: "medicaid", label: "Medicaid" },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    options: [
      { value: "immediate", label: "Immediate (Today)" },
      { value: "week", label: "Within 7 Days" },
      { value: "month", label: "Next 30 Days" },
    ],
  },
  {
    id: "gender",
    label: "Gender Program",
    options: [
      { value: "coed", label: "Co-Ed Programs" },
      { value: "mens", label: "Men's Only" },
      { value: "womens", label: "Women's Only" },
      { value: "lgbtq", label: "LGBTQ+ Focused" },
    ],
  },
  {
    id: "age",
    label: "Age Group",
    options: [
      { value: "adolescents", label: "Adolescents (12-17)" },
      { value: "young-adults", label: "Young Adults (18-25)" },
      { value: "adults", label: "Adults (26+)" },
      { value: "seniors", label: "Seniors / Older Adults" },
    ],
  },
];

const MORE_AMENITIES = [
  { value: "private-room", label: "Private Rooms" },
  { value: "chef-meals", label: "Chef-prepared Meals" },
  { value: "pool", label: "Pool & Spa Access" },
  { value: "pet-friendly", label: "Pet Friendly" },
  { value: "gym", label: "Fitness Center / Gym" },
  { value: "holistic", label: "Holistic Therapies" },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    treatmentType: searchParams.get("treatmentType")?.split(",").filter(Boolean) || [],
    insurance: searchParams.get("insurance")?.split(",").filter(Boolean) || [],
    availability: searchParams.get("availability")?.split(",").filter(Boolean) || [],
    gender: searchParams.get("gender")?.split(",").filter(Boolean) || [],
    age: searchParams.get("age")?.split(",").filter(Boolean) || [],
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  });
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync to URL whenever selectedFilters change
  const applyFiltersToUrl = (newFilters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.keys(newFilters).forEach((key) => {
      const values = newFilters[key];
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
    });

    // We only push if we are on /listings. If on home, maybe wait for 'Show Results'?
    // Let's just push to /listings if they interact with the filter bar.
    router.push(`/listings?${params.toString()}`, { scroll: false });
  };

  // Sync local state when URL searchParams change (e.g., routing, browser navigation)
  useEffect(() => {
    setSelectedFilters({
      treatmentType: searchParams.get("treatmentType")?.split(",").filter(Boolean) || [],
      insurance: searchParams.get("insurance")?.split(",").filter(Boolean) || [],
      availability: searchParams.get("availability")?.split(",").filter(Boolean) || [],
      gender: searchParams.get("gender")?.split(",").filter(Boolean) || [],
      age: searchParams.get("age")?.split(",").filter(Boolean) || [],
      amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
    });
  }, [searchParams]);



  const handleSelectOption = (categoryId: string, optionValue: string) => {
    const current = selectedFilters[categoryId] || [];
    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];

    const newState = { ...selectedFilters, [categoryId]: updated };
    setSelectedFilters(newState);
    applyFiltersToUrl(newState);
  };

  const handleClearCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newState = { ...selectedFilters, [categoryId]: [] };
    setSelectedFilters(newState);
    applyFiltersToUrl(newState);
  };

  const handleClearAll = () => {
    const newState = {
      treatmentType: [],
      insurance: [],
      availability: [],
      gender: [],
      age: [],
      amenities: [],
    };
    setSelectedFilters(newState);
    applyFiltersToUrl(newState);
    setShowMoreFiltersModal(false);
  };

  const getPillLabel = (category: FilterCategory) => {
    const selected = selectedFilters[category.id] || [];
    if (selected.length === 0) return category.label;
    if (selected.length === 1) {
      const option = category.options.find((o) => o.value === selected[0]);
      return option ? option.label : category.label;
    }
    return `${category.label} (${selected.length})`;
  };

  return (
    <div className="sticky top-16 z-30 w-full bg-surface border-b border-border py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">

        {/* Pills wrapper with horizontal scrolling support */}
        <div
          ref={containerRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 flex-1"
        >
          {FILTER_DATA.map((category) => {
            const hasSelections = (selectedFilters[category.id] || []).length > 0;
            const isOpen = activeDropdown === category.id;

            return (
              <Popover
                key={category.id}
                open={isOpen}
                onOpenChange={(open) => setActiveDropdown(open ? category.id : null)}
              >
                <div className="relative filter-dropdown-wrapper shrink-0">
                  <PopoverTrigger
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      hasSelections
                        ? "bg-primary/10 border-primary text-primary hover:bg-primary/25"
                        : "bg-surface border-border text-slate-700 hover:border-slate-300 hover:bg-muted"
                    )}
                  >
                    <span>{getPillLabel(category)}</span>
                    {hasSelections ? (
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClearCategory(category.id, e);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Clear ${category.label} filter`}
                        className="p-0.5 hover:bg-primary/20 rounded-full transition-colors ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10 relative"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    ) : (
                      <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
                    )}
                  </PopoverTrigger>

                  <PopoverContent className="w-72 p-4 rounded-xl shadow-xl z-50" align="start">
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                      {category.options.map((option) => {
                        const isChecked = (selectedFilters[category.id] || []).includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectOption(category.id, option.value);
                            }}
                            className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-muted transition-colors cursor-pointer"
                          >
                            <span>{option.label}</span>
                            {isChecked && <Check className="h-4.5 w-4.5 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </div>
              </Popover>
            );
          })}

          {/* More Filters Pill */}
          <button
            type="button"
            onClick={() => setShowMoreFiltersModal(true)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              selectedFilters.amenities.length > 0
                ? "bg-primary/10 border-primary text-primary hover:bg-primary/25"
                : "bg-surface border-border text-slate-700 hover:border-slate-300 hover:bg-muted"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
            {selectedFilters.amenities.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full font-bold">
                {selectedFilters.amenities.length}
              </span>
            )}
          </button>
        </div>

        {/* Clear All action (Only visible if filters active) */}
        {Object.values(selectedFilters).some((f) => f.length > 0) && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer shrink-0 hidden md:inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Reset All
          </button>
        )}
      </div>

      {/* More Filters Modal Dialog */}
      <AnimatePresence>
        {showMoreFiltersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-border flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="text-lg font-semibold text-slate-900">Advanced Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowMoreFiltersModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Filters List */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Quick select / program options inside dialog */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Facility Amenities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {MORE_AMENITIES.map((amenity) => {
                      const isSelected = selectedFilters.amenities.includes(amenity.value);
                      return (
                        <button
                          key={amenity.value}
                          type="button"
                          onClick={() => handleSelectOption("amenities", amenity.value)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                            isSelected
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-surface border-border text-slate-700 hover:bg-muted"
                          )}
                        >
                          <span>{amenity.label}</span>
                          {isSelected && <Check className="h-4.5 w-4.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info Disclaimer */}
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-xs text-slate-500 leading-relaxed">
                  Aldora verifies all treatment facilities and coordinates with your insurance provider directly. Safe, compliant, and confidential directories.
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  Clear All Filters
                </button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowMoreFiltersModal(false)}
                    className="h-10 px-4 rounded-xl text-slate-700 border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowMoreFiltersModal(false)}
                    className="h-10 px-6 rounded-xl bg-primary text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Show Results
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
