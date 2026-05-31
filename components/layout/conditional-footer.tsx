"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Hide footer on listings page to preserve fullscreen split-panel layout, and on admin dashboard/login pages
  const isListings = pathname?.startsWith("/listings");
  const isAdmin = pathname?.startsWith("/admin");

  if (isListings || isAdmin) return null;
  return <Footer />;
}
