import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "No jobs found",
  message = "Try adjusting your filters or search with different keywords.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <SearchX className="mb-3 h-9 w-9 text-slate-300" />
      <p className="font-display text-base font-semibold text-slate-700">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
