"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Directory", href: "/listings" },
  { name: "Featured Facility", href: "/facility/demo-facility" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Handle scroll for sticky glassmorphism effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Hide navbar on admin paths
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 w-full transition-all duration-300 ease-in-out border-b",
          isScrolled
            ? "bg-surface/80 backdrop-blur-md border-border shadow-sm"
            : "bg-surface border-transparent"
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 md:px-8">
          
          {/* Left: Logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L3 20h4l3-6h4l3 6h4L12 3zm-1 8h2" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-wide text-slate-950 hidden sm:block">
                Aldora
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex flex-none items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <Link 
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 transition-colors shadow-sm"
            >
              <User className="h-4 w-4 mr-2" />
              <span>Admin Access</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="flex lg:hidden p-2 text-slate-600 hover:bg-muted rounded-lg transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
          >
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-surface shadow-xl border-l border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-semibold text-slate-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">


                {/* Mobile Links */}
                <div className="flex flex-col gap-1.5">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 text-base font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "text-primary bg-primary/5 font-semibold"
                            : "text-slate-700 hover:bg-muted hover:text-slate-900"
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-primary text-primary-foreground h-12 font-medium text-sm transition-colors hover:bg-primary/90"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Admin Access</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
