import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SearchHero from "@/components/SearchHero";
import CategoryGrid from "@/components/CategoryGrid";
import JobCard from "@/components/JobCard";
import EmptyState from "@/components/EmptyState";
import { getPublishedJobs } from "@/lib/jobs";

export const revalidate = 60;

export default async function HomePage() {
  const [latest, featured, urgent] = await Promise.all([
    getPublishedJobs(),
    getPublishedJobs({ featured: true }),
    getPublishedJobs({ urgent: true }),
  ]);

  return (
    <div>
      <SearchHero />

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <SectionHeader emoji="🔥" title="Featured Jobs" href="/jobs?featured=true" />
          <JobGrid jobs={featured.slice(0, 6)} />
        </section>
      )}

      {urgent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <SectionHeader emoji="🚨" title="Urgent Jobs" href="/jobs?urgent=true" />
          <JobGrid jobs={urgent.slice(0, 6)} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <SectionHeader emoji="🆕" title="Latest Jobs" href="/jobs" />
        {latest.length === 0 ? (
          <EmptyState
            title="No jobs published yet"
            message="Once jobs are added and published from the admin dashboard, they'll show up here."
          />
        ) : (
          <JobGrid jobs={latest.slice(0, 9)} />
        )}
      </section>

      <CategoryGrid />

      <section className="bg-hero-gradient">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Looking for your next opportunity?
          </h2>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
          >
            Explore Latest Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ emoji, title, href }: { emoji: string; title: string; href: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
        {emoji} {title}
      </h2>
      <Link href={href} className="text-sm font-semibold text-brand-700 hover:underline">
        View all →
      </Link>
    </div>
  );
}

function JobGrid({ jobs }: { jobs: Awaited<ReturnType<typeof getPublishedJobs>> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
