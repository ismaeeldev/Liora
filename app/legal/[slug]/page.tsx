import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ChevronRight, FileText, ShieldAlert, Lock, Fingerprint, ArrowLeft } from "lucide-react";

interface LegalContent {
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  sections: {
    heading: string;
    body: string;
  }[];
}

const LEGAL_DATA: Record<string, LegalContent> = {
  "terms-of-service": {
    title: "Terms of Service",
    description: "Welcome to Aldora. By accessing or using our website, directories, and software applications, you agree to comply with the terms set forth below.",
    category: "Legal Framework",
    icon: FileText,
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "Aldora provides a directory search portal and listing tools for behavioral health centers. By registering an account, search-filtering, or utilizing any of our features, you acknowledge that you have read, understood, and agreed to these Terms of Service."
      },
      {
        heading: "2. Directory Information Disclaimer",
        body: "All materials, data, and directories listed on Aldora are for informational and search convenience only. Aldora is not a healthcare provider and does not offer formal medical diagnosis, treatment planning, or emergency clinical interventions. Please consult with qualified clinical professionals in emergency situations."
      },
      {
        heading: "3. User Conduct & Account Policy",
        body: "Registered admins and facility managers must provide complete, accurate, and current information. Impersonating other companies or submitting fraudulent licenses is strictly prohibited and constitutes grounds for immediate account suspension."
      }
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Your privacy is paramount. Learn how we collect, store, transmit, and safeguard your data when using the Aldora portal.",
    category: "Data Protection",
    icon: Lock,
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect basic contact info, inquiry forms submit details (such as names and email addresses), search criteria history, and analytical logs when navigating the platform. We do not sell or lease user information to third-party advertising companies."
      },
      {
        heading: "2. Secure Form Transmission",
        body: "Inquiry forms sent to treatment centers are encrypted using Secure Sockets Layer (SSL/TLS) protocols. They are safely transmitted to the selected facility to guarantee data integrity."
      },
      {
        heading: "3. Your Rights & Choices",
        body: "You can request the correction or complete removal of any personal records or inquiries stored in the Aldora directory at any time by contacting our privacy compliance department."
      }
    ]
  },
  "hipaa-compliance": {
    title: "HIPAA Compliance Statement",
    description: "Aldora is committed to maintaining strict administrative, physical, and technical safeguards in alignment with HIPAA directives.",
    category: "Compliance",
    icon: ShieldAlert,
    sections: [
      {
        heading: "1. Overview of HIPAA Integration",
        body: "The Health Insurance Portability and Accountability Act (HIPAA) sets the regulatory framework for protecting sensitive patient health records. While Aldora serves primarily as a public directory and informational resource, we apply HIPAA-grade encryption for all inquiries containing health-related search criteria."
      },
      {
        heading: "2. Technical and Administrative Safeguards",
        body: "All communications between browsers and our backend database are encrypted. Additionally, our teams undergo regular compliance audits to prevent unauthorized access or disclosure of protected health info (PHI)."
      }
    ]
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description: "Learn how we utilize browser cookies, tracking pixels, and session states to provide a seamless browsing experience on Aldora.",
    category: "Cookies & State",
    icon: Fingerprint,
    sections: [
      {
        heading: "1. What are Cookies?",
        body: "Cookies are tiny text files saved to your computer or mobile device. They help us remember preferred filter selections, support portal authentication sessions, and compile performance telemetry to improve loading speeds."
      },
      {
        heading: "2. Categories of Cookies Used",
        body: "We use essential cookies (necessary to run login and search forms) and performance/analytical cookies (used to measure page load speeds and identify visual layout issues)."
      },
      {
        heading: "3. Managing Your Preferences",
        body: "You can block or delete cookies via your browser's security dashboard. Note that blocking essential cookies may disrupt search filtering and account login sessions."
      }
    ]
  }
};

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function LegalPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const data = LEGAL_DATA[slug];

  if (!data) {
    notFound();
  }

  const IconComponent = data.icon;

  return (
    <div className="flex-1 bg-background py-16 md:py-24">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header info */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-700 text-xs font-semibold uppercase tracking-wide">
                <IconComponent className="h-3.5 w-3.5" />
                {data.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {data.title}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl font-light">
                {data.description}
              </p>
            </div>

            {/* Sections Accordion-like layout */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              {data.sections.map((sec, idx) => (
                <div key={idx} className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-3 hover:shadow-sm transition-all duration-200">
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {sec.heading}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info Card (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Legal Navigation</h4>
              <nav className="flex flex-col gap-3">
                {Object.keys(LEGAL_DATA).map((key) => {
                  const item = LEGAL_DATA[key];
                  const isCurrent = key === slug;
                  return (
                    <Link
                      key={key}
                      href={`/legal/${key}`}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all ${
                        isCurrent
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-surface border-border text-slate-700 hover:bg-muted"
                      }`}
                    >
                      <span className="capitalize">{item.title}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
