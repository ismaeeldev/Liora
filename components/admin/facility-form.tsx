"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createFacility, updateFacility, uploadImageAction } from "@/lib/actions/facility.actions";
import { FacilityCreateSchema } from "@/lib/validations/facility";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, ImageIcon, Upload } from "lucide-react";

type FacilityFormValues = z.infer<typeof FacilityCreateSchema>;

interface FacilityFormProps {
  initialData?: FacilityFormValues & { id: string };
  availableServices: { id: string; name: string }[];
  availableCategories: { id: string; name: string }[];
}

export function FacilityForm({ initialData, availableServices, availableCategories }: FacilityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageAction(formData);
      if (res.success && res.url) {
        // cast appendImage due to zod typing behavior with optional arrays
        (appendImage as (value: string) => void)(res.url);
      } else {
        alert(res.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const form = useForm<FacilityFormValues>({
    // @ts-expect-error Zod typing mismatch with react-hook-form
    resolver: zodResolver(FacilityCreateSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
      phone: "",
      website: "",
      priceMin: 0,
      priceMax: null,
      bedsCount: 0,
      bedsAvailable: 0,
      insuranceAccepted: "In-Network / Most Insurances",
      genderSupport: "Co-Ed / All Genders Welcome",
      sameDayAdmission: true,
      licenseStatus: "Active State License",
      conditionsTreated: [],
      ownerId: null,
      images: [],
      services: [],
      categories: [],
    },
  });

  const { control, handleSubmit, register, setValue, getValues, formState: { errors } } = form;

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images" as never, // cast due to zod typing behavior with optional arrays
  });

  const selectedServices = useWatch({ control, name: "services" }) || [];
  const selectedCategories = useWatch({ control, name: "categories" }) || [];
  const conditions = useWatch({ control, name: "conditionsTreated" }) || [];

  const handleConditionAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !conditions.includes(val)) {
        setValue("conditionsTreated", [...conditions, val]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeCondition = (condition: string) => {
    setValue("conditionsTreated", conditions.filter((c) => c !== condition));
  };

  const toggleSelection = (field: "services" | "categories", id: string) => {
    const current = getValues(field) || [];
    if (current.includes(id)) {
      setValue(field, current.filter(itemId => itemId !== id));
    } else {
      setValue(field, [...current, id]);
    }
  };

  const onSubmit = async (data: FacilityFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;
      if (initialData?.id) {
        result = await updateFacility(initialData.id, data);
      } else {
        result = await createFacility(data);
      }

      if (result.success) {
        router.push("/admin/dashboard/facilities");
        router.refresh();
      } else {
        setSubmitError(result.error || "An unknown error occurred");
      }
    } catch (error: unknown) {
      console.error(error);
      setSubmitError("An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      // @ts-expect-error Zod strict typing mismatch with SubmitHandler
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-8 pb-12"
    >
      {submitError && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-semibold">
          {submitError}
        </div>
      )}

      {/* General Information */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-border pb-2">General Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Facility Name</label>
            <input {...register("name")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" placeholder="Aldora Center" />
            {errors.name && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">URL Slug</label>
            <input {...register("slug")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" placeholder="aldora-center" />
            {errors.slug && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Description</label>
            <textarea {...register("description")} rows={4} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" placeholder="Describe the facility..." />
            {errors.description && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-border pb-2">Location & Contact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Street Address</label>
            <input {...register("address")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
            {errors.address && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.address.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">City</label>
            <input {...register("city")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
            {errors.city && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">State</label>
            <input {...register("state")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
            {errors.state && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.state.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Zip Code</label>
            <input {...register("zipCode")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
            {errors.zipCode && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.zipCode.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Phone</label>
            <input {...register("phone")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Website URL</label>
            <input {...register("website")} type="url" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
        </div>
      </div>

      {/* Operations & Pricing */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-border pb-2">Operations & Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Minimum Monthly Price ($)</label>
            <input {...register("priceMin", { valueAsNumber: true })} type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
            {errors.priceMin && <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errors.priceMin.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Maximum Monthly Price ($)</label>
            <input {...register("priceMax", { valueAsNumber: true })} type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Total Beds Capacity</label>
            <input {...register("bedsCount", { valueAsNumber: true })} type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Currently Available Beds</label>
            <input {...register("bedsAvailable", { valueAsNumber: true })} type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Insurance Accepted</label>
            <input {...register("insuranceAccepted")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Gender Support</label>
            <input {...register("genderSupport")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">License Status</label>
            <input {...register("licenseStatus")} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
          </div>
          <div className="space-y-2 flex items-center gap-2 pt-6">
            <input {...register("sameDayAdmission")} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Offers Same-Day Admission</label>
          </div>
        </div>

        {/* Conditions Treated */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Conditions Treated</label>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <span key={condition} className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-slate-700 text-xs font-medium rounded-full">
                {condition}
                <button type="button" onClick={() => removeCondition(condition)} className="hover:text-destructive text-slate-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type condition and press Enter..."
            onKeyDown={handleConditionAdd}
            className="w-full md:max-w-md px-4 py-2 bg-background border border-border rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          />
        </div>
      </div>

      {/* Relations & Media */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-border pb-2">Media & Relations</h2>

        {/* Images */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Facility Images (URLs)</label>
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                {...register(`images.${index}` as never)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => removeImage(index)} className="shrink-0 text-destructive hover:bg-destructive/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2 mt-2 flex-wrap">
            <Button type="button" variant="outline" size="sm" onClick={() => appendImage("")} className="h-9 text-xs font-semibold rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Image URL
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()} 
              className="h-9 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 text-slate-500" />
                  <span>Upload Image File</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Assigned Categories</label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleSelection("categories", cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  selectedCategories.includes(cat.id)
                    ? "bg-primary/10 text-primary border-primary"
                    : "bg-background text-slate-600 border-border hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Assigned Services</label>
          <div className="flex flex-wrap gap-2">
            {availableServices.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => toggleSelection("services", srv.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  selectedServices.includes(srv.id)
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-background text-slate-600 border-border hover:bg-muted"
                }`}
              >
                {srv.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 rounded-xl text-slate-700 border-border hover:bg-muted px-6 font-semibold cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-primary hover:bg-primary-hover text-white px-8 font-semibold shadow-md cursor-pointer transition-all hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <>{initialData ? "Save Changes" : "Create Facility"}</>
          )}
        </Button>
      </div>
    </form>
  );
}
