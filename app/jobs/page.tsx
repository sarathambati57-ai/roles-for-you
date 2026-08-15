import type { Metadata } from "next";
import { Suspense } from "react";
import JobFilters from "@/components/JobFilters";
import JobCard from "@/components/JobCard";
import EmptyState from "@/components/EmptyState";
import { getPublishedJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Latest Jobs",
  description: "Browse the latest job openings, internships and career opportunities.",
};

export const revalidate = 30;

interface SearchParams {
  q?: string;
  category?: string;
  job_type?: string;
  experience?: string;
  location?: string;
  qualification?: string;
  featured?: string;
  urgent?: string;
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const jobs = await getPublishedJobs({
    q: searchParams.q,
    category: searchParams.category,
    jobType: searchParams.job_type,
    experience: searchParams.experience,
    location: searchParams.location,
    qualification: searchParams.qualification,
    featured: searchParams.featured === "true",
    urgent: searchParams.urgent === "true",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">Latest Jobs</h1>
        <p className="mt-1 text-sm text-slate-500">
          {jobs.length} opportunit{jobs.length === 1 ? "y" : "ies"} available
          {searchParams.q ? ` for "${searchParams.q}"` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={null}>
            <JobFilters />
          </Suspense>
        </aside>

        <div>
          {jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
