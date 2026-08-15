import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Briefcase, GraduationCap, IndianRupee, CalendarClock,
  Building2, Hash, ExternalLink, Clock,
} from "lucide-react";
import { getJobBySlug, getRelatedJobs } from "@/lib/jobs";
import { formatDate, isExpired, siteUrl, truncate } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import JobCard from "@/components/JobCard";

export const revalidate = 30;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return { title: "Job not found" };

  const title = `${job.company_name} ${job.job_title} Jobs 2026 | Roles_for_you_`;
  const description = truncate(job.description, 155);
  const url = siteUrl(`/jobs/${job.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: job.company_logo ? [{ url: job.company_logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();

  const related = await getRelatedJobs(job);
  const expired = isExpired(job);
  const url = siteUrl(`/jobs/${job.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.job_title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company_name,
      value: job.job_id || job.id,
    },
    datePosted: job.posted_date,
    validThrough: job.deadline || undefined,
    employmentType: job.job_type.toUpperCase().replace(" ", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      logo: job.company_logo || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" },
    },
    baseSalary: job.salary
      ? { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", value: job.salary } }
      : undefined,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-700">Home</Link> /{" "}
        <Link href="/jobs" className="hover:text-brand-700">Jobs</Link> /{" "}
        <span className="text-slate-600">{job.job_title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Header */}
          <div className="rounded-xl2 border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50 ring-1 ring-brand-100">
                {job.company_logo ? (
                  <Image src={job.company_logo} alt={job.company_name} width={56} height={56} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-brand-700" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">{job.company_name}</p>
                <h1 className="font-display text-xl font-bold text-brand-950 sm:text-2xl">{job.job_title}</h1>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.featured && (
                    <span className="rounded-full bg-accent-amber/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-amber">
                      🔥 Featured
                    </span>
                  )}
                  {job.urgent && !expired && (
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                      🚨 Urgent
                    </span>
                  )}
                  {job.is_sample && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                      Sample listing
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick details */}
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
              <QuickDetail icon={MapPin} label="Location" value={job.location} />
              <QuickDetail icon={Briefcase} label="Experience" value={job.experience} />
              <QuickDetail icon={GraduationCap} label="Qualification" value={job.qualification} />
              {job.batch && <QuickDetail icon={CalendarClock} label="Batch" value={job.batch} />}
              {job.salary && <QuickDetail icon={IndianRupee} label="Salary" value={job.salary} />}
              <QuickDetail icon={Clock} label="Posted" value={formatDate(job.posted_date)} />
            </dl>
          </div>

          {/* Description */}
          <div className="mt-6 rounded-xl2 border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Job Description</h2>
            <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />

            {job.skills?.length > 0 && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="mb-3 font-display text-base font-semibold text-brand-950">Skills / Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Important info */}
          <div className="mt-6 rounded-xl2 border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Important Information</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-brand-500" />
                Application Deadline: <strong className="text-slate-800">{formatDate(job.deadline)}</strong>
              </li>
              {job.job_id && (
                <li className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-brand-500" /> Job ID: <strong className="text-slate-800">{job.job_id}</strong>
                </li>
              )}
              {job.requisition_id && (
                <li className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-brand-500" /> Requisition ID:{" "}
                  <strong className="text-slate-800">{job.requisition_id}</strong>
                </li>
              )}
            </ul>
          </div>

          <div className="mt-6 rounded-xl2 border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <ShareButtons url={url} title={`${job.company_name} — ${job.job_title}`} />
          </div>
        </div>

        {/* Sticky apply sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl2 border border-slate-100 bg-white p-6 text-center shadow-card">
            {job.company_description && (
              <p className="mb-4 text-sm text-slate-600">{job.company_description}</p>
            )}
            {expired ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-500"
              >
                Application Closed
              </button>
            ) : (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-800/20 transition hover:bg-brand-700"
              >
                {job.apply_button_text || "Apply Now"} <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <p className="mt-3 text-xs text-slate-400">
              You'll be redirected to the official application page.
            </p>
          </div>
        </aside>
      </div>

      {/* Related jobs */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-display text-xl font-bold text-brand-950">Related Jobs</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <JobCard key={r.id} job={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-brand-950">{value}</p>
    </div>
  );
}
