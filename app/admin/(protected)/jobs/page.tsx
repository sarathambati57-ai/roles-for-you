import Link from "next/link";
import Image from "next/image";
import { Building2, Eye, Pencil, Copy } from "lucide-react";
import { getAllJobsAdmin } from "@/lib/jobs";
import { formatDate, isExpired } from "@/lib/utils";
import {
  deleteJobAction, togglePublishAction, duplicateJobAction,
} from "@/lib/actions/jobs";
import EmptyState from "@/components/EmptyState";
import DeleteJobButton from "@/components/admin/DeleteJobButton";

interface SearchParams {
  q?: string;
  status?: string;
}

export default async function ManageJobsPage({ searchParams }: { searchParams: SearchParams }) {
  const allJobs = await getAllJobsAdmin();

  let jobs = allJobs;
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    jobs = jobs.filter(
      (j) => j.job_title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q)
    );
  }
  if (searchParams.status) {
    jobs = jobs.filter((j) => j.status === searchParams.status);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Manage Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">{jobs.length} job{jobs.length === 1 ? "" : "s"}</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + Add New Job
        </Link>
      </div>

      <form className="mb-5 flex flex-wrap gap-2" method="get">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search by title or company…"
          className="w-64 rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <select
          name="status"
          defaultValue={searchParams.status || ""}
          className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-400"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Filter
        </button>
        {(searchParams.q || searchParams.status) && (
          <Link href="/admin/jobs" className="flex items-center px-2 text-sm font-medium text-brand-700 hover:underline">
            Reset
          </Link>
        )}
      </form>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs found" message="Try a different search, or add your first job." />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-slate-100 bg-white shadow-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Job</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Posted</th>
                <th className="px-5 py-3 font-medium">Deadline</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const expired = isExpired(job);
                return (
                  <tr key={job.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="max-w-[220px] px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-50 ring-1 ring-brand-100">
                          {job.company_logo ? (
                            <Image src={job.company_logo} alt="" width={36} height={36} className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-4 w-4 text-brand-700" />
                          )}
                        </div>
                        <span className="line-clamp-2 font-medium text-brand-950">{job.job_title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{job.company_name}</td>
                    <td className="px-5 py-4 text-slate-600">{job.location}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          job.status === "published" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {job.status === "published" ? "Published" : "Draft"}
                      </span>
                      {expired && (
                        <span className="ml-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                          Expired
                        </span>
                      )}
                      {job.featured && <span className="ml-1.5 text-xs">🔥</span>}
                      {job.urgent && <span className="text-xs">🚨</span>}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(job.posted_date)}</td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(job.deadline)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {job.status === "published" && (
                          <Link
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-700"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-700"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={duplicateJobAction.bind(null, job.id)}>
                          <button type="submit" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-700" title="Duplicate">
                            <Copy className="h-4 w-4" />
                          </button>
                        </form>
                        <form action={togglePublishAction.bind(null, job.id, job.status)}>
                          <button
                            type="submit"
                            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-brand-700"
                          >
                            {job.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteJobAction.bind(null, job.id)}>
                          <DeleteJobButton />
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
