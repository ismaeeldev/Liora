import { z } from "zod";

export const InquiryCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  insurance: z.string().optional(),
  notes: z.string().min(5, "Notes must be at least 5 characters"),
  facilityId: z.string(),
});

export const InquiryStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});
