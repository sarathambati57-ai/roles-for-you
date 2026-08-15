import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { getPublishedJobs } from "@/lib/jobs";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = { title: "Companies Hiring" };
export const revalidate = 60;

export default async function CompaniesPage() {
  const jobs = await getPublishedJobs();

  const companyMap = new Map<string, { name: string; logo: string | null; count: number }>();
  for (const job of jobs) {
    const existing = companyMap.get(job.company_name);
    if (existing) {
      existing.count += 1;
    } else {
      companyMap.set(job.company_name, { name: job.company_name, logo: job.company_logo, count: 1 });
    }
  }
  const companies = Array.from(companyMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-2xl font-bold text-brand-950 sm:text-3xl">Companies Hiring</h1>

      {companies.length === 0 ? (
        <EmptyState title="No companies yet" message="Companies will appear here once jobs are published." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {companies.map((c) => (
            <Link
              key={c.name}
              href={`/jobs?q=${encodeURIComponent(c.name)}`}
              className="flex flex-col items-center gap-3 rounded-xl2 border border-slate-100 bg-white p-6 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-brand-50 ring-1 ring-brand-100">
                {c.logo ? (
                  <Image src={c.logo} alt={c.name} width={56} height={56} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-brand-700" />
                )}
              </div>
              <p className="font-display text-sm font-semibold text-brand-950">{c.name}</p>
              <p className="text-xs text-slate-500">{c.count} open role{c.count === 1 ? "" : "s"}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
