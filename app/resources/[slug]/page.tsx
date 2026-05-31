import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ChevronRight, HelpCircle, BookOpen, Newspaper, Shield, FileText, ArrowLeft, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceContent {
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  sections: {
    heading: string;
    body: string;
  }[];
}

const RESOURCES_DATA: Record<string, ResourceContent> = {
  "help-center": {
    title: "Help Center",
    description: "Find quick answers, support, and step-by-step guides for navigating the Aldora behavioral health marketplace.",
    category: "Support",
    icon: HelpCircle,
    sections: [
      {
        heading: "How do I search for a treatment facility?",
        body: "You can search by treatment type, insurance provider, age groups, and gender programs directly on our Search Portal. Use the smart filter bar at the top of the listings page to narrow down your choices based on same-day admission, private rooms, and other specialized amenities."
      },
      {
        heading: "Is my personal data protected?",
        body: "Yes. Aldora takes user privacy and HIPAA compliance extremely seriously. Any inquiry forms or messages sent to facilities are encrypted and safely delivered in accordance with industry best-practices for healthcare directories."
      },
      {
        heading: "What does 'Verified Facility' mean?",
        body: "A verified facility has been audited by the Aldora team. We confirm their active state licensing, accreditation status (such as Joint Commission or CARF), and verify their physical locations so you can browse with peace of mind."
      },
      {
        heading: "How do I list my own treatment facility?",
        body: "To list your property on Aldora, click 'List a Property' in the footer or visit the Admin portal to register and submit your center's specifications, service offerings, and media assets."
      }
    ]
  },
  "medical-glossary": {
    title: "Medical Glossary",
    description: "Understand the terms, acronyms, and clinical vocabularies commonly used in behavioral health and addiction treatment.",
    category: "Education",
    icon: BookOpen,
    sections: [
      {
        heading: "Medical Detoxification (Detox)",
        body: "A clinical procedure designed to safely manage the physical symptoms of withdrawal when an individual stops using alcohol or drugs. Usually conducted under constant medical supervision."
      },
      {
        heading: "Residential / Inpatient Rehab",
        body: "A live-in treatment facility where patients receive 24/7 care, structured therapeutic programs, and clinical support in a safe, controlled environment."
      },
      {
        heading: "PHP (Partial Hospitalization Program)",
        body: "A high-intensity outpatient program where patients attend therapy at a clinic for 4 to 8 hours a day, 3 to 5 days a week, but return home or to a sober living facility at night."
      },
      {
        heading: "IOP (Intensive Outpatient Program)",
        body: "A step-down treatment plan consisting of 9 to 20 hours of clinical group sessions and individual therapy weekly, designed to fit around work or school schedules."
      },
      {
        heading: "Dual Diagnosis (Co-occurring Disorders)",
        body: "The clinical term for when a patient experiences both a mental health condition (such as depression, anxiety, or PTSD) and a substance use disorder simultaneously."
      }
    ]
  },
  "recovery-blog": {
    title: "Recovery Blog",
    description: "Explore the latest insights, expert guides, and encouraging recovery stories from licensed clinicians and therapists.",
    category: "Insights",
    icon: Newspaper,
    sections: [
      {
        heading: "5 Critical Signs to Look for When Choosing a Treatment Center",
        body: "Understanding state licenses, therapist-to-patient ratios, customized care plans, family integration models, and aftercare tracking systems can save lives when selecting a rehab facility."
      },
      {
        heading: "Demystifying Dual Diagnosis: The Path to Balanced Mental Health",
        body: "Treating substance use without addressing root mental health triggers leads to high relapse rates. Learn how integrated clinical teams treat the whole individual for sustained wellness."
      },
      {
        heading: "Mindfulness and Somatic Practices in Modern Addiction Recovery",
        body: "Clinical studies show that adding yoga, breathwork, and sensory awareness exercises to traditional cognitive behavioral therapy (CBT) helps stabilize nervous systems during recovery."
      }
    ]
  },
  "insurance-guides": {
    title: "Insurance Guides",
    description: "Learn how to navigate health insurance benefits, verify coverage options, and minimize out-of-pocket treatment costs.",
    category: "Financials",
    icon: Shield,
    sections: [
      {
        heading: "In-Network vs. Out-of-Network Benefits",
        body: "In-network providers have contracted agreements with insurance carriers to provide care at preset rates. Out-of-network benefits may still cover treatment but generally carry higher deductibles and co-insurance thresholds."
      },
      {
        heading: "Understanding HMO vs. PPO Policies",
        body: "HMO plans typically require primary physician referrals and restrict care to in-network centers. PPO plans allow for wider flexibility, often covering premium out-of-state recovery facilities with minimal referral barriers."
      },
      {
        heading: "The Mental Health Parity and Addiction Equity Act (MHPAEA)",
        body: "A federal law stating that health insurance providers must provide mental health and substance abuse benefits on par with standard surgical or medical coverage. Limits, deductibles, and co-pays cannot be more restrictive."
      }
    ]
  }
};

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ResourcePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const data = RESOURCES_DATA[slug];

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
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wide">
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
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">More Resources</h4>
              <nav className="flex flex-col gap-3">
                {Object.keys(RESOURCES_DATA).map((key) => {
                  const item = RESOURCES_DATA[key];
                  const isCurrent = key === slug;
                  return (
                    <Link
                      key={key}
                      href={`/resources/${key}`}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all ${
                        isCurrent
                          ? "bg-primary/10 border-primary text-primary"
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

            {/* Helpline CTA Card */}
            <div className="bg-gradient-to-tr from-cyan-600 to-primary text-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <PhoneCall className="h-6 w-6" />
                <h4 className="font-extrabold text-lg">Need Immediate Help?</h4>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-light">
                Connect with our compassionate care advocates now. Get confidential assistance finding treatment option resources.
              </p>
              <div className="pt-2">
                <a href="tel:+18005550199" className="inline-flex items-center justify-center w-full h-11 bg-white text-primary font-bold text-sm rounded-xl shadow-xs hover:bg-slate-50 transition-colors">
                  Call 1-800-555-0199
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
