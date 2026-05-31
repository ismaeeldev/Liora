"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createInquiry } from "@/lib/actions/inquiry.actions";
import { InquiryCreateSchema } from "@/lib/validations/inquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type InquiryFormValues = z.infer<typeof InquiryCreateSchema>;

interface InquiryFormProps {
  facilityId: string;
}

export function InquiryForm({ facilityId }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InquiryFormValues>({

    resolver: zodResolver(InquiryCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      insurance: "",
      notes: "",
      facilityId,
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  const onSubmit = async (data: InquiryFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await createInquiry(data);

      if (result.success) {
        toast.success("Inquiry Sent Successfully", {
          description: "Thank you for reaching out. The facility admissions team will review your details and contact you shortly.",
          position: "top-center",
        });
        reset();
      } else {
        toast.error("Submission Failed", {
          description: result.error || "An error occurred.",
          position: "top-center",
        });
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Unexpected Error", {
        description: "An unexpected error occurred while sending your inquiry.",
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface sm:p-6 p-4 rounded-2xl space-y-6">
      <div className="space-y-1.5">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Request Information</h3>
        <p className="text-sm text-slate-500">Contact the admissions team directly with any questions.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")} 
            className="h-11 rounded-xl bg-slate-50 text-sm md:text-base border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" 
            placeholder="John Doe" 
          />
          {errors.name && <p id="name-error" className="text-[11px] font-medium text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")} 
              type="email"
              className="h-11 rounded-xl bg-slate-50 text-sm md:text-base border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" 
              placeholder="john@example.com" 
            />
            {errors.email && <p id="email-error" className="text-[11px] font-medium text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-600 uppercase">
              Phone Number
            </Label>
            <Input 
              id="phone"
              {...register("phone")} 
              type="tel"
              className="h-11 rounded-xl bg-slate-50 text-sm md:text-base border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" 
              placeholder="(555) 123-4567" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurance" className="text-xs font-semibold text-slate-600 uppercase">
            Insurance Provider
          </Label>
          <Input 
            id="insurance"
            {...register("insurance")} 
            className="h-11 rounded-xl bg-slate-50 text-sm md:text-base border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" 
            placeholder="e.g. BlueCross, Medicare, etc." 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-xs font-semibold text-slate-600 uppercase">
            How can we help? <span className="text-red-500">*</span>
          </Label>
          <Textarea 
            id="notes"
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? "notes-error" : undefined}
            {...register("notes")} 
            rows={4}
            className="min-h-[100px] rounded-xl bg-slate-50 text-sm md:text-base border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 resize-y" 
            placeholder="Tell us about your situation..." 
          />
          {errors.notes && <p id="notes-error" className="text-[11px] font-medium text-destructive">{errors.notes.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base shadow-md transition-all active:scale-95"
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
        ) : (
          "Send Inquiry"
        )}
      </Button>
      <p className="text-center text-[11px] text-slate-500 mt-2 font-medium">
        Your information is secure and will only be shared with this facility.
      </p>
    </form>
  );
}
