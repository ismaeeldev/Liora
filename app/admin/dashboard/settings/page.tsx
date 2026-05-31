import React from "react";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/utils/jwt";
import { prisma } from "@/lib/db/prisma";
import { 
  User, 
  Shield, 
  Database, 
  Server,
  Mail,
  UserCheck
} from "lucide-react";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-safe-admin-jwt-secret-key-10220";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  let admin = null;

  if (token) {
    const decoded = await verifyJWT(token, JWT_SECRET);
    if (decoded && decoded.sub) {
      admin = await prisma.adminUser.findUnique({
        where: { id: decoded.sub as string },
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Console Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review system configuration, account status, security, and database metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-slate-900">Administrator Profile</h2>
          </div>

          {admin ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Administrator Name</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                  {admin.name || "Default Administrator"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Access Email</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {admin.email}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Role Identity</span>
                <div>
                  <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                    {admin.role}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Registered At</span>
                <span className="text-sm font-medium text-slate-500">
                  {new Date(admin.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold">
              Warning: Could not fetch active credentials from cookie session.
            </div>
          )}
        </div>

        {/* Security & Access */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Shield className="h-5 w-5 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900">Security Parameters</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Session Protocol</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                HTTP-Only Cookie containing cryptographically signed JSON Web Token (HS256). Expires automatically in 24 hours.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Middleware Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active Routing Shield</span>
              </span>
            </div>
          </div>
        </div>

        {/* Database Metrics */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Database className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900">Neon Cloud Database Integration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Adapter Engine</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Server className="h-4 w-4 text-slate-400" />
                <span>Prisma Client w/ Pg-Adapter</span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Database Mode</span>
              <span className="text-sm font-semibold text-slate-800">
                Direct Connection Pool
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Connection Status</span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
