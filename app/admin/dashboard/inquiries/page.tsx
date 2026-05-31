import React from "react";
import { prisma } from "@/lib/db/prisma";
import { InquiriesListClient } from "@/components/admin/inquiries-list-client";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      facility: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <InquiriesListClient initialInquiries={inquiries} />;
}
