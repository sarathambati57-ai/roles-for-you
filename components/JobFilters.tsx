"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import {
  CATEGORIES, JOB_TYPES, EXPERIENCE_LEVELS, LOCATIONS, QUALIFICATIONS,
} from "@/types/job";

const FIELD_MAP: { key: string; label: string; options: readonly string[] }[] = [
  { key: "job_type", label: "Job Type", options: JOB_TYPES },
  { key: "experience", label: "Experience", options: EXPERIENCE_LEVELS },
  { key: "location", label: "Location", options: LOCATIONS },
  { key: "category", label: "Category", options: CATEGORIES },
  { key: "qualification", label: "Qualification", options: QUALIFICATIONS },
];

export default function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    const q = searchParams.get("q");
    router.push(`${pathname}${q ? `?q=${q}` : ""}`);
  }

  const hasActiveFilters = FIELD_MAP.some((f) => searchParams.get(f.key));

  return (
    <div className="rounded-xl2 border border-slate-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-brand-950">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </button>
        )}
      </div>

      <div className="space-y-5">
        {FIELD_MAP.map((field) => (
          <div key={field.key}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {field.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {field.options.map((opt) => {
                const active = searchParams.get(field.key) === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => updateParam(field.key, opt)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-brand-800 bg-brand-800 text-white"
                        : "border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
