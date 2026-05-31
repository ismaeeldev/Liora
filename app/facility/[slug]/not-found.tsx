import Link from "next/link";
import { Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
          <Building2 className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Facility Not Found</h1>
        <p className="text-slate-500 leading-relaxed">
          We couldn&apos;t find the facility you were looking for. It may have been removed, or the URL might be incorrect.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/listings" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-xl gap-2 font-semibold">
              <Search className="h-4 w-4" />
              Browse All Facilities
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl font-semibold">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
