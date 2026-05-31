"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Admin operations schema
export const ReviewApproveSchema = z.object({
  isApproved: z.boolean(),
});

export async function toggleFacilityVerification(id: string, isVerified: boolean) {
  try {
    const now = new Date();
    const facility = await prisma.facility.update({
      where: { id },
      data: {
        isVerified,
        updatedAt: now,
      },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath(`/facility/${facility.slug}`);
    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error toggling verification:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update verification status" };
  }
}

export async function toggleFacilityFeaturedStatus(id: string, isFeatured: boolean, expiresDays?: number) {
  try {
    const now = new Date();
    const featuredExpiresAt = isFeatured && expiresDays 
      ? new Date(now.getTime() + expiresDays * 24 * 60 * 60 * 1000) 
      : null;

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        isFeatured,
        featuredExpiresAt,
        updatedAt: now,
      },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath(`/facility/${facility.slug}`);
    return { success: true, data: facility };
  } catch (error: unknown) {
    console.error("Error toggling featured status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update featured status" };
  }
}

export async function approveReview(id: string, isApproved: boolean) {
  try {
    const now = new Date();
    const review = await prisma.review.update({
      where: { id },
      data: {
        isApproved,
        updatedAt: now,
      },
      include: {
        facility: true,
      }
    });

    revalidatePath(`/facility/${review.facility.slug}`);
    return { success: true, data: review };
  } catch (error: unknown) {
    console.error("Error approving review:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to approve review" };
  }
}

export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.delete({
      where: { id },
      include: {
        facility: true,
      }
    });

    revalidatePath(`/facility/${review.facility.slug}`);
    return { success: true, data: review };
  } catch (error: unknown) {
    console.error("Error deleting review:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete review" };
  }
}
