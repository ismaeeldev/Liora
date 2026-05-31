"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { adminLogout } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await adminLogout();
      if (res.success) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="h-10 px-4 rounded-xl text-slate-700 border-border hover:bg-muted font-medium flex items-center gap-1.5 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 text-slate-500" />
      )}
      <span>Log Out</span>
    </Button>
  );
}
export default LogoutButton;
