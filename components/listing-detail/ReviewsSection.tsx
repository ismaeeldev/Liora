"use client";

import React, { useState } from "react";
import { ReviewStars } from "@/components/shared/review-stars";

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReviewsSectionProps {
  facilityId: string;
  reviews?: ReviewItem[];
  averageRating?: number;
}

// Single Review Card component with "Read more" toggle state
function ReviewCard({ review }: { review: ReviewItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 250;
  const isLongText = review.content.length > wordLimit;

  const displayContent = isExpanded 
    ? review.content 
    : isLongText 
      ? `${review.content.slice(0, wordLimit)}...` 
      : review.content;

  const initials = review.authorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-5 border border-border rounded-xl bg-surface/50 hover:bg-surface hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-teal-100">
            {initials}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 leading-none">
              {review.authorName}
            </h4>
            <span className="text-[10px] text-slate-400 font-light mt-1 block">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <ReviewStars rating={review.rating} starClassName="h-4 w-4" />
      </div>

      {/* Review Body */}
      <div className="space-y-1.5 pl-0 md:pl-12">
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-wrap">
          {displayContent}
        </p>
        
        {isLongText && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-primary hover:text-primary-hover underline cursor-pointer mt-1"
          >
            {isExpanded ? "Show Less" : "Read Full Review"}
          </button>
        )}
      </div>
    </div>
  );
}

export function ReviewsSection({
  reviews = [],
  averageRating = 4.9,
}: ReviewsSectionProps) {
  
  // Default mock reviews matching DB query schema
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      id: "rev1",
      authorName: "Sarah Jenkins",
      rating: 5,
      createdAt: "2026-05-12T10:00:00.000Z",
      content: "The support I received at Malibu Recovery was life-changing. From the medical detox phase to the holistic therapies, the staff was extremely professional, kind, and attentive. The private suite made the stay very comfortable.",
    },
    {
      id: "rev2",
      authorName: "David Miller",
      rating: 4.8,
      createdAt: "2026-04-20T10:00:00.000Z",
      content: "Excellent clinical care. The therapists are Joint Commission accredited and truly understand dual diagnosis. The only downside was a short waitlist for same-day admission, but they coordinated with my insurance perfectly.",
    },
    {
      id: "rev3",
      authorName: "Amanda R.",
      rating: 5,
      createdAt: "2026-03-15T10:00:00.000Z",
      content: "Incredible wellness resort. The chef-prepared meals were delicious and the ocean breeze helped with my recovery journey. Highly recommend their inpatient rehab programs.",
    },
  ];

  const totalReviews = displayReviews.length;

  // Calculate review score distribution metrics
  const scoreCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
  displayReviews.forEach((rev) => {
    const idx = Math.floor(rev.rating) - 1;
    if (idx >= 0 && idx < 5) scoreCounts[idx]++;
  });

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Patient Reviews
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1 font-light">
          Read verified experiences from patients and family members who attended this facility.
        </p>
      </div>

      {/* Grid: Left (Summary Score), Right (Progress Bars chart) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-6 border-t border-slate-100">
        
        {/* Left: Overall Numeric Score */}
        <div className="text-center md:border-r md:border-slate-100 md:pr-8 py-2">
          <span className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-none block">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex justify-center mt-3">
            <ReviewStars rating={averageRating} starClassName="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-400 mt-2 block font-medium">
            Based on {totalReviews} patient reviews
          </span>
        </div>

        {/* Right: Progress bars distribution */}
        <div className="md:col-span-2 space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = scoreCounts[stars - 1] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs md:text-sm group/row hover:bg-slate-50/80 p-1.5 -m-1.5 rounded-lg transition-colors duration-200">
                <span className="w-12 font-medium text-slate-600 truncate text-right">
                  {stars} Star
                </span>
                
                {/* Progress track */}
                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 transition-all duration-200 group-hover/row:scale-[1.02]">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 font-medium text-slate-500 text-left pl-1">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Reviews list */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        {displayReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

    </div>
  );
}
export default ReviewsSection;
