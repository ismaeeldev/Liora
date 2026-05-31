import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Navbar, ConditionalFooter } from "@/components/layout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com"),
  title: {
    default: "Aldora | Premium Behavioral Health Marketplace",
    template: "%s | Aldora",
  },
  description: "Discover, compare, and connect with trusted behavioral health facilities, treatment centers, and recovery homes.",
  keywords: ["behavioral health", "treatment centers", "recovery homes", "rehab facilities", "mental health care", "healthcare marketplace"],
  authors: [{ name: "Aldora Team" }],
  creator: "Aldora",
  publisher: "Aldora Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://aldora.com",
    siteName: "Aldora Marketplace",
    title: "Aldora | Premium Behavioral Health Marketplace",
    description: "Discover, compare, and connect with trusted behavioral health facilities, treatment centers, and recovery homes.",
    images: [
      {
        url: "/images/wellness_hero_bg.png",
        width: 1200,
        height: 630,
        alt: "Aldora Behavioral Health Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aldora | Premium Behavioral Health Marketplace",
    description: "Discover, compare, and connect with trusted behavioral health facilities, treatment centers, and recovery homes.",
    images: ["/images/wellness_hero_bg.png"],
    creator: "@aldoraplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <ConditionalFooter />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
