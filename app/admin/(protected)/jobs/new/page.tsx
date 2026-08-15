import JobForm from "@/components/admin/JobForm";
import { createJobAction } from "@/lib/actions/jobs";

export default function NewJobPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-950">Add New Job</h1>
        <p className="mt-1 text-sm text-slate-500">Fill in the details below and publish when ready.</p>
      </div>
      <JobForm action={createJobAction} />
    </div>
  );
}
