"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteFacility } from "@/lib/actions/facility.actions";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2, ExternalLink } from "lucide-react";

export function FacilityActions({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this facility? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteFacility(id);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Failed to delete facility");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/facility/${slug}`}
        target="_blank"
        className="inline-flex items-center justify-center h-9 w-9 border border-border bg-surface text-slate-600 hover:bg-muted hover:text-primary rounded-xl text-xs transition-all"
        title="View public listing"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
      
      <Link
        href={`/admin/dashboard/facilities/${id}/edit`}
        className="inline-flex items-center justify-center h-9 px-3 bg-muted text-slate-700 hover:bg-muted/80 rounded-xl text-xs font-bold transition-all gap-1.5"
      >
        <Edit2 className="h-3.5 w-3.5" />
        <span>Edit</span>
      </Link>
      
      <Button
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-9 px-3 border-destructive/20 text-destructive hover:bg-destructive/10 rounded-xl text-xs font-bold transition-all gap-1.5 cursor-pointer"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        <span>Delete</span>
      </Button>
      {error && <span className="text-xs text-destructive ml-2 font-medium">{error}</span>}
    </div>
  );
}
