import { notFound } from "next/navigation";
import JobForm from "@/components/admin/JobForm";
import { updateJobAction } from "@/lib/actions/jobs";
import { getJobByIdAdmin } from "@/lib/jobs";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const job = await getJobByIdAdmin(params.id);
  if (!job) notFound();

  const boundAction = updateJobAction.bind(null, job.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-950">Edit Job</h1>
        <p className="mt-1 text-sm text-slate-500">
          {job.company_name} — {job.job_title}
        </p>
      </div>
      <JobForm action={boundAction} job={job} />
    </div>
  );
}
