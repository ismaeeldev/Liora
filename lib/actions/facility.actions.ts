"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FacilityCreateSchema, FacilityUpdateSchema } from "@/lib/validations/facility";
import { uploadFile } from "@/lib/utils/blob";

export async function createFacility(formData: z.infer<typeof FacilityCreateSchema>) {
  try {
    const validatedData = FacilityCreateSchema.parse(formData);
    const now = new Date();
    
    // Extract relations
    const { images, services, categories, ...baseData } = validatedData;
    
    const facility = await prisma.facility.create({
      data: {
        ...baseData,
        createdAt: now,
        updatedAt: now,
        images: images && images.length > 0 ? {
          create: images.map((url, index) => ({ url, isPrimary: index === 0 }))
        } : undefined,
        services: services && services.length > 0 ? {
          connect: services.map(id => ({ id }))
        } : undefined,
        categories: categories && categories.length > 0 ? {
          connect: categories.map(id => ({ id }))
        } : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath("/admin/dashboard/facilities");
    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error creating facility:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create facility" };
  }
}

export async function getFacilityBySlug(slug: string) {
  try {
    const facility = await prisma.facility.findUnique({
      where: { slug },
      include: {
        images: true,
        categories: true,
        services: true,
        reviews: {
          where: { isApproved: true },
        },
      },
    });

    if (!facility) {
      return { success: false, error: "Facility not found" };
    }

    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error fetching facility:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch facility" };
  }
}

export async function getFacilityById(id: string) {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        images: true,
        categories: true,
        services: true,
      },
    });

    if (!facility) {
      return { success: false, error: "Facility not found" };
    }

    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error fetching facility by ID:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch facility" };
  }
}

export async function updateFacility(id: string, formData: z.infer<typeof FacilityUpdateSchema>) {
  try {
    const validatedData = FacilityUpdateSchema.parse(formData);
    const now = new Date();

    const { images, services, categories, ...baseData } = validatedData;

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        ...baseData,
        updatedAt: now,
        images: images !== undefined ? {
          deleteMany: {},
          create: images.map((url, index) => ({ url, isPrimary: index === 0 }))
        } : undefined,
        services: services !== undefined ? {
          set: services.map(srvId => ({ id: srvId }))
        } : undefined,
        categories: categories !== undefined ? {
          set: categories.map(catId => ({ id: catId }))
        } : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath(`/facility/${facility.slug}`);
    revalidatePath("/admin/dashboard/facilities");
    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error updating facility:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update facility" };
  }
}

export async function deleteFacility(id: string) {
  try {
    const facility = await prisma.facility.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath("/admin/dashboard/facilities");
    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error deleting facility:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete facility" };
  }
}

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    const blob = await uploadFile(file, "facilities");
    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
}
