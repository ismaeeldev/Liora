import * as React from "react"
import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { Container } from "./container"
import { Button } from "@/components/ui/button"

const FOOTER_LINKS = {
  platform: [
    { name: "Search Facilities", href: "/listings" },
    { name: "Featured Resort", href: "/listings" },
    { name: "Home Dashboard", href: "/" },
    { name: "List a Property", href: "/admin/dashboard" },
  ],
  resources: [
    { name: "Help Center", href: "/resources/help-center" },
    { name: "Medical Glossary", href: "/resources/medical-glossary" },
    { name: "Recovery Blog", href: "/resources/recovery-blog" },
    { name: "Insurance Guides", href: "/resources/insurance-guides" },
  ],
  legal: [
    { name: "Terms of Service", href: "/legal/terms-of-service" },
    { name: "Privacy Policy", href: "/legal/privacy-policy" },
    { name: "HIPAA Compliance", href: "/legal/hipaa-compliance" },
    { name: "Cookie Policy", href: "/legal/cookie-policy" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-surface pt-16 pb-8 text-sm">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 xl:gap-16">
          
          {/* Brand & App Download Section */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L3 20h4l3-6h4l3 6h4L12 3zm-1 8h2" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-wide text-slate-950">
                Aldora
              </span>
            </Link>
            <p className="max-w-sm text-slate-600 leading-relaxed">
              Empowering your recovery journey with trusted, verified behavioral health and addiction treatment facilities nationwide.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <span className="font-semibold text-slate-900">Get the Aldora App</span>
              <div className="flex flex-wrap gap-3">
                {/* Placeholder App Store Buttons */}
                <Button variant="outline" className="h-12 w-36 gap-2 justify-start px-3 bg-slate-900 text-white hover:bg-slate-800 hover:text-white border-transparent">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-slate-300">Download on the</span>
                    <span className="font-semibold text-sm">App Store</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-12 w-36 gap-2 justify-start px-3 bg-slate-900 text-white hover:bg-slate-800 hover:text-white border-transparent">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-slate-300">GET IT ON</span>
                    <span className="font-semibold text-sm">Google Play</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-slate-900">Platform</h3>
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-600 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-slate-900">Resources</h3>
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-600 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-slate-900">Contact</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="mailto:support@aldora.com" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    support@aldora.com
                  </a>
                </li>
                <li>
                  <a href="tel:+18005550199" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                    1-800-555-0199
                  </a>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    123 Recovery Way, Suite 400<br />
                    Austin, TX 78701
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Social */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 sm:justify-start">
            <span>&copy; {currentYear} Aldora, Inc.</span>
            <span className="hidden sm:inline-block">•</span>
            {FOOTER_LINKS.legal.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link href={link.href} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  {link.name}
                </Link>
                {index < FOOTER_LINKS.legal.length - 1 && (
                  <span className="hidden sm:inline-block">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors" aria-label="Facebook">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </Link>
            <Link href="/" className="hover:text-primary transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="/" className="hover:text-primary transition-colors" aria-label="Instagram">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
            <Link href="/" className="hover:text-primary transition-colors" aria-label="LinkedIn">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
