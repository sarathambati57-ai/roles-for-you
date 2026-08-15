import Link from "next/link";
import Image from "next/image";
import { MapPin, Briefcase, GraduationCap, IndianRupee, Building2 } from "lucide-react";
import type { Job } from "@/types/job";
import { formatDate, isExpired } from "@/lib/utils";

export default function JobCard({ job }: { job: Job }) {
  const expired = isExpired(job);

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group flex flex-col rounded-xl2 border border-slate-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-50 ring-1 ring-brand-100">
            {job.company_logo ? (
              <Image src={job.company_logo} alt={job.company_name} width={44} height={44} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-5 w-5 text-brand-700" />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">{job.company_name}</p>
            <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-brand-950 group-hover:text-brand-700">
              {job.job_title}
            </h3>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
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
        {expired && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
            Closed
          </span>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 text-[13px] text-slate-600">
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-400" /> {job.location}</span>
        <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-brand-400" /> {job.experience}</span>
        <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-brand-400" /> {job.qualification}</span>
        {job.salary && (
          <span className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-brand-400" /> {job.salary}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-400">Posted {formatDate(job.posted_date)}</span>
        <span className="text-sm font-semibold text-brand-700 group-hover:underline">View Job →</span>
      </div>
    </Link>
  );
}
