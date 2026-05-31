"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  Settings, 
  Menu, 
  ArrowLeft
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Facilities",
    href: "/admin/dashboard/facilities",
    icon: Building2,
  },
  {
    label: "Inquiries",
    href: "/admin/dashboard/inquiries",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getIsActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderNavigationLinks = (onClick?: () => void) => (
    <nav className="flex flex-col gap-1.5 px-2 py-4">
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = getIsActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-slate-600 hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-slate-400"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar (Left side, fixed width) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border fixed inset-y-0 left-0 z-20">
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-border flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-primary text-primary-foreground shadow-md shadow-primary/20">
            <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L3 20h4l3-6h4l3 6h4L12 3zm-1 8h2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-slate-900 leading-none">Aldora Console</span>
            <span className="text-[10px] text-primary font-semibold tracking-wider uppercase mt-0.5">Administrator</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto">
          {renderNavigationLinks()}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border flex flex-col gap-2 bg-background/30">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border bg-surface text-slate-600 hover:bg-muted text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Portal</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Top Header (top, fixed height) */}
      <header className="md:hidden sticky top-0 z-20 w-full bg-surface border-b border-border h-16 flex items-center justify-between px-4 shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-primary text-primary-foreground shadow-md shadow-primary/10">
            <svg className="w-4.5 h-4.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L3 20h4l3-6h4l3 6h4L12 3zm-1 8h2" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-wide text-slate-900">
            Aldora Admin
          </span>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl text-slate-600 border-border hover:bg-muted cursor-pointer"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 flex flex-col h-full w-72">
            <SheetHeader className="h-16 px-6 border-b border-border flex flex-row items-center gap-2.5 shrink-0 space-y-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-primary text-primary-foreground shadow-md shadow-primary/20">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L3 20h4l3-6h4l3 6h4L12 3zm-1 8h2" />
                </svg>
              </div>
              <div>
                <SheetTitle className="text-sm font-bold tracking-wide text-slate-900 leading-none">Aldora Console</SheetTitle>
                <SheetDescription className="text-[10px] text-slate-400 mt-0.5">Admin Navigation Portal</SheetDescription>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              {renderNavigationLinks(() => setMobileOpen(false))}
            </div>
            <div className="p-4 border-t border-border flex flex-col gap-2 bg-background/50">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border bg-surface text-slate-600 hover:bg-muted text-xs font-semibold shadow-xs transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Portal</span>
              </Link>
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
