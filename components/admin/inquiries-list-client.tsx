"use client";

import React, { useState } from "react";
import { updateInquiryStatus } from "@/lib/actions/inquiry.actions";
import {
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building,
  CheckCircle,
  Clock,
  Archive,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InquiryData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: Date;
  facility: {
    name: string;
  };
}

export function InquiriesListClient({ initialInquiries }: { initialInquiries: InquiryData[] }) {
  const [inquiries, setInquiries] = useState<InquiryData[]>(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<"NEW" | "CONTACTED" | "CLOSED" | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const fullName = `${inq.firstName} ${inq.lastName}`.toLowerCase();
    const email = inq.email.toLowerCase();
    const facilityName = inq.facility.name.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || 
                          email.includes(search.toLowerCase()) ||
                          facilityName.includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: "NEW" | "CONTACTED" | "CLOSED") => {
    setUpdatingStatus(newStatus);
    try {
      const res = await updateInquiryStatus(id, newStatus);
      if (res.success && res.data) {
        setInquiries((prev) => 
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
            <Clock className="h-3 w-3" />
            <span>New</span>
          </span>
        );
      case "CONTACTED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
            <CheckCircle className="h-3 w-3" />
            <span>Contacted</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-full">
            <Archive className="h-3 w-3" />
            <span>Closed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title / Action Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Inquiries</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review patient leads, question submissions, and request callbacks for care centers.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sender name, email, or facility..."
            className="w-full pl-11 pr-4 py-2 bg-muted hover:bg-muted/80 focus:bg-surface text-slate-800 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto self-start sm:self-center">
          {["ALL", "NEW", "CONTACTED", "CLOSED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-slate-600 border-border hover:bg-muted"
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Sender</th>
                <th className="p-4">Facility</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-600 text-sm">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <span>No inquiries match your filters.</span>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900">
                      <div>{inq.firstName} {inq.lastName}</div>
                      <div className="text-xs text-slate-400 font-normal">{inq.email}</div>
                    </td>
                    <td className="p-4 max-w-[180px] truncate font-medium text-slate-700">
                      {inq.facility.name}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-500 font-normal">
                      {inq.message}
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(inq.status)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInquiry(inq)}
                        className="h-8.5 rounded-lg border-border hover:bg-muted font-bold text-xs cursor-pointer"
                      >
                        Open Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        {selectedInquiry && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                Inquiry from {selectedInquiry.firstName} {selectedInquiry.lastName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              {/* Contact Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border border-border p-3.5 bg-muted/40 rounded-xl">
                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">Email</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:text-primary-hover hover:underline font-medium flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{selectedInquiry.email}</span>
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">Phone</span>
                  {selectedInquiry.phone ? (
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:text-primary-hover hover:underline font-medium flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{selectedInquiry.phone}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground font-medium">None provided</span>
                  )}
                </div>
                <div className="col-span-2 space-y-1 pt-1.5 border-t border-border">
                  <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">Inquired Facility</span>
                  <div className="text-foreground font-semibold flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{selectedInquiry.facility.name}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">Message Details</span>
                <div className="text-foreground bg-background border border-border p-4 rounded-xl text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-xs font-bold text-foreground">Current Status:</span>
                <div>{getStatusBadge(selectedInquiry.status)}</div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-2 w-full justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedInquiry.id, "NEW")}
                  disabled={updatingStatus !== null || selectedInquiry.status === "NEW"}
                  className="h-9 text-xs font-semibold rounded-lg border-border hover:bg-muted cursor-pointer flex items-center gap-1.5"
                >
                  {updatingStatus === "NEW" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Mark New</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedInquiry.id, "CONTACTED")}
                  disabled={updatingStatus !== null || selectedInquiry.status === "CONTACTED"}
                  className="h-9 text-xs font-semibold rounded-lg border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-600 cursor-pointer flex items-center gap-1.5"
                >
                  {updatingStatus === "CONTACTED" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Mark Contacted</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedInquiry.id, "CLOSED")}
                  disabled={updatingStatus !== null || selectedInquiry.status === "CLOSED"}
                  className="h-9 text-xs font-semibold rounded-lg border-border hover:bg-muted text-foreground/80 cursor-pointer flex items-center gap-1.5"
                >
                  {updatingStatus === "CLOSED" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Mark Closed</span>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
