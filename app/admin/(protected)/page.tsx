import Link from "next/link";
import { PlusCircle, Briefcase, CheckCircle2, FileEdit, Clock, Sparkles } from "lucide-react";
import { getJobStats } from "@/lib/jobs";

export default async function AdminDashboardPage() {
  const stats = await getJobStats();

  const cards = [
    { label: "Total Jobs", value: stats.total, icon: Briefcase, color: "bg-brand-50 text-brand-700" },
    { label: "Published Jobs", value: stats.published, icon: CheckCircle2, color: "bg-green-50 text-green-700" },
    { label: "Draft Jobs", value: stats.draft, icon: FileEdit, color: "bg-slate-100 text-slate-600" },
    { label: "Expired Jobs", value: stats.expired, icon: Clock, color: "bg-red-50 text-red-600" },
    { label: "Featured Jobs", value: stats.featured, icon: Sparkles, color: "bg-accent-amber/10 text-accent-amber" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back! Here's what's happening with your listings.</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="flex items-center gap-2 rounded-xl bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <PlusCircle className="h-4 w-4" /> Add New Job
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl2 border border-slate-100 bg-white p-5 shadow-card">
            <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-2xl font-bold text-brand-950">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl2 border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="mb-3 font-display text-base font-semibold text-brand-950">Quick workflow</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
          <li>Click <strong>Add New Job</strong></li>
          <li>Paste the job description into the rich text editor</li>
          <li>Fill in company, role, eligibility and salary details</li>
          <li>Add the application URL and upload the company logo</li>
          <li>Set status to <strong>Published</strong> and save</li>
        </ol>
      </div>
    </div>
  );
}
