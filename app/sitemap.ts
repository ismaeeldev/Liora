import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com";

  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Fetch all facilities from the database
  try {
    const facilities = await prisma.facility.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const facilityRoutes: MetadataRoute.Sitemap = facilities.map((facility) => ({
      url: `${baseUrl}/facility/${facility.slug}`,
      lastModified: facility.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...routes, ...facilityRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap for facilities:", error);
    return routes;
  }
}
