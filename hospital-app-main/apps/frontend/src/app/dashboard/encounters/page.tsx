"use client";

import { useState } from "react";
import { Stethoscope, Search } from "lucide-react";
import { useEncounters } from "@/features/encounters/hooks/useEncounters";
import { EncountersTable } from "@/features/encounters/components/EncountersTable";
import { Button } from "@/components/ui/button";

export default function EncountersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { encounters, pagination, isLoading } = useEncounters({
    search,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6 animate-fade-in px-2 lg:px-4 py-4">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm"
            style={{ background: "oklch(0.55 0.14 230 / 0.15)" }} // Classic Medical Blue light bg
          >
            <Stethoscope size={24} style={{ color: "oklch(0.55 0.14 230)" }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">Encounter Queue</h1>
            <p className="text-[14px] font-medium text-muted-foreground mt-0.5">
              {encounters ? `${encounters.length} active records` : "Loading encounters..."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search chief complaint..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none shadow-sm transition-all hover:border-border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* ── Table card ── */}
      <div className="rounded-[20px] border border-border bg-white shadow-sm overflow-hidden flex flex-col">
        <EncountersTable encounters={encounters} isLoading={isLoading} />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 px-4 font-semibold text-muted-foreground hover:text-foreground"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm font-semibold text-muted-foreground px-2">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 px-4 font-semibold text-muted-foreground hover:text-foreground"
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
