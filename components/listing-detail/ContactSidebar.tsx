"use client";

import React, { useState } from "react";
import { Phone, Heart, Mail, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { InquiryForm } from "@/components/inquiry-form";

export interface ContactSidebarProps {
  facilityId: string;
  phone?: string;
  priceMin?: number;
}

export function ContactSidebar({
  facilityId,
  phone = "1-800-555-0199",
  priceMin = 8500,
}: ContactSidebarProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <>
      {/* 1. Desktop Layout (Card matches sidebar width, hidden on mobile) */}
      <Card className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden hidden lg:block">
        <CardContent className="p-0">
          
          {/* Quick Stats/Headers */}
          <div className="p-6 text-center border-b border-border bg-muted/20">
            <span className="text-xs text-slate-600 font-medium block">Confidential Admissions Hotline</span>
            <a 
              href={`tel:${phone}`}
              className="text-lg font-bold text-slate-800 hover:text-primary flex items-center justify-center gap-1.5 mt-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
              aria-label={`Call admissions hotline at ${phone}`}
            >
              <Phone className="h-4.5 w-4.5 text-primary animate-pulse" aria-hidden="true" />
              <span>{phone}</span>
            </a>
          </div>

          {/* Form directly visible on desktop */}
          <div className="border-b border-border">
            <InquiryForm facilityId={facilityId} />
          </div>

          <div className="p-6 space-y-4">
            {/* Secondary Save Button */}
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              aria-pressed={isSaved}
              className="w-full h-12 rounded-xl border border-border bg-surface hover:bg-muted text-slate-700 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              <span>{isSaved ? "Saved to Favorites" : "Save Listing"}</span>
            </button>

            {/* Compliance Disclaimer */}
            <div className="flex gap-2 text-[10px] text-slate-600 bg-muted/40 p-3 rounded-xl border border-border/40">
              <ShieldAlert className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" aria-hidden="true" />
              <span>All phone inquiries are 100% confidential and HIPAA-compliant. Aldora never charges patient fees.</span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 2. Mobile Fixed Bottom CTA Bar (Only visible on screens < lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border p-4 flex items-center justify-between lg:hidden shadow-lg select-none">
        
        {/* Mobile Price indicator */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">
            Est. Cost
          </span>
          <span className="text-sm font-extrabold text-slate-950 block">
            From ${priceMin.toLocaleString()}/mo
          </span>
        </div>

        {/* Mobile buttons group */}
        <div className="flex items-center gap-2">
          {/* Quick Save Heart Button */}
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-slate-700 shadow-sm active:scale-90 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={isSaved ? "Unsave facility" : "Save facility"}
            aria-pressed={isSaved}
          >
            <motion.div
              animate={{ scale: isSaved ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"
                }`}
              />
            </motion.div>
          </button>

          {/* Contact Trigger wrapped in Dialog */}
          <Dialog>
            <DialogTrigger render={
              <Button
                aria-haspopup="dialog"
                className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Contact</span>
              </Button>
            } />
            <DialogContent className="sm:max-w-md w-[95vw] p-0 border-none bg-transparent shadow-none max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader className="sr-only">
                <DialogTitle>Contact Facility</DialogTitle>
                <DialogDescription>Submit an inquiry to the facility admissions team.</DialogDescription>
              </DialogHeader>
              <InquiryForm facilityId={facilityId} />
            </DialogContent>
          </Dialog>
        </div>

      </div>
    </>
  );
}
export default ContactSidebar;
