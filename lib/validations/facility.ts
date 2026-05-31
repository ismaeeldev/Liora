import { z } from "zod";

export const FacilityCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  priceMin: z.number().min(0),
  priceMax: z.number().optional().nullable(),
  bedsCount: z.number().min(0),
  bedsAvailable: z.number().min(0),
  insuranceAccepted: z.string(),
  genderSupport: z.string(),
  sameDayAdmission: z.boolean().default(true),
  licenseStatus: z.string(),
  conditionsTreated: z.array(z.string()),
  ownerId: z.string().optional().nullable(),
  images: z.array(z.string().url()).optional(),
  services: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export const FacilityUpdateSchema = FacilityCreateSchema.partial();
