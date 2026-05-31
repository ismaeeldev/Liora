"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendMail } from "@/lib/mail/transporter";
import { emailTemplates } from "@/lib/mail/templates";

import { InquiryCreateSchema, InquiryStatusUpdateSchema } from "@/lib/validations/inquiry";

export async function createInquiry(formData: z.infer<typeof InquiryCreateSchema>) {
  try {
    const validatedData = InquiryCreateSchema.parse(formData);
    const now = new Date();

    // Split name into first and last name for the DB schema
    const nameParts = validatedData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const inquiry = await prisma.inquiry.create({
      data: {
        firstName,
        lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        insurance: validatedData.insurance,
        message: validatedData.notes,
        facilityId: validatedData.facilityId,
        status: "NEW",
        createdAt: now,
        updatedAt: now,
      },
      include: {
        facility: true,
      }
    });

    // Send email notification using reusable architecture
    const template = emailTemplates.newInquiry({
      facilityName: inquiry.facility.name,
      senderName: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      insurance: validatedData.insurance,
      notes: validatedData.notes,
    });

    await sendMail({
      to: validatedData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: validatedData.email,
    });

    // Send confirmation email to the user
    const confirmationTemplate = emailTemplates.inquiryConfirmation({
      facilityName: inquiry.facility.name,
      senderName: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      insurance: validatedData.insurance,
      notes: validatedData.notes,
      facilityPhone: inquiry.facility.phone || undefined,
      facilityEmail: inquiry.facility.website || undefined, // using website field as a fallback for facility contact if email isn't explicitly defined
    });

    await sendMail({
      to: validatedData.email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
      text: confirmationTemplate.text,
    });

    revalidatePath(`/facility/${inquiry.facility.slug}`);
    revalidatePath(`/admin/dashboard/inquiries`);
    return { success: true, data: inquiry };
  } catch (error: unknown) {
    console.error("Error creating inquiry:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit inquiry" };
  }
}

export async function getInquiriesByFacility(facilityId: string) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { facilityId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: inquiries };
  } catch (error: unknown) {
    console.error("Error fetching inquiries:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch inquiries" };
  }
}

export async function updateInquiryStatus(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
  try {
    const now = new Date();
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status,
        updatedAt: now,
      },
      include: {
        facility: true,
      }
    });

    revalidatePath(`/facility/${inquiry.facility.slug}`);
    revalidatePath(`/admin/dashboard/inquiries`);
    return { success: true, data: inquiry };
  } catch (error: unknown) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update inquiry status" };
  }
}
