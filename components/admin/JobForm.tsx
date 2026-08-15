"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import RichTextEditor from "./RichTextEditor";
import LogoUploader from "./LogoUploader";
import {
  CATEGORIES, JOB_TYPES, EXPERIENCE_LEVELS, QUALIFICATIONS,
} from "@/types/job";
import type { Job } from "@/types/job";
import type { JobFormState } from "@/lib/actions/jobs";

type Action = (state: JobFormState, formData: FormData) => Promise<JobFormState>;

export default function JobForm({ action, job }: { action: Action; job?: Job }) {
  const [state, formAction] = useFormState<JobFormState, FormData>(action, {});
  const [description, setDescription] = useState(job?.description || "");
  const [logo, setLogo] = useState(job?.company_logo || "");
  const [skills, setSkills] = useState((job?.skills || []).join(", "));

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Basic Information */}
      <Section title="Basic Information">
        <Grid>
          <Field label="Company Name" error={state.fieldErrors?.company_name}>
            <input name="company_name" defaultValue={job?.company_name} required className={inputClass} />
          </Field>
          <Field label="Job Title" error={state.fieldErrors?.job_title}>
            <input name="job_title" defaultValue={job?.job_title} required className={inputClass} />
          </Field>
          <Field label="Job Category">
            <select name="category" defaultValue={job?.category || "Other"} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Job Type">
            <select name="job_type" defaultValue={job?.job_type || "Full Time"} className={inputClass}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Location" error={state.fieldErrors?.location}>
            <input name="location" defaultValue={job?.location} required placeholder="e.g. Bangalore" className={inputClass} />
          </Field>
          <Field label="Experience">
            <input list="experience-options" name="experience" defaultValue={job?.experience || "Fresher"} className={inputClass} />
            <datalist id="experience-options">
              {EXPERIENCE_LEVELS.map((e) => <option key={e} value={e} />)}
            </datalist>
          </Field>
          <Field label="Qualification">
            <input list="qualification-options" name="qualification" defaultValue={job?.qualification || "Any Graduate"} className={inputClass} />
            <datalist id="qualification-options">
              {QUALIFICATIONS.map((q) => <option key={q} value={q} />)}
            </datalist>
          </Field>
          <Field label="Batch">
            <input name="batch" defaultValue={job?.batch || ""} placeholder="e.g. 2025 / 2026" className={inputClass} />
          </Field>
          <Field label="Salary / CTC">
            <input name="salary" defaultValue={job?.salary || ""} placeholder="e.g. ₹6 LPA" className={inputClass} />
          </Field>
          <Field label="Application Deadline">
            <input type="date" name="deadline" defaultValue={job?.deadline || ""} className={inputClass} />
          </Field>
          <Field label="Job ID">
            <input name="job_id" defaultValue={job?.job_id || ""} className={inputClass} />
          </Field>
          <Field label="Requisition ID">
            <input name="requisition_id" defaultValue={job?.requisition_id || ""} className={inputClass} />
          </Field>
        </Grid>
      </Section>

      {/* Company */}
      <Section title="Company">
        <div className="mb-5">
          <label className={labelClass}>Company Logo</label>
          <LogoUploader value={logo} onChange={setLogo} />
          <input type="hidden" name="company_logo" value={logo} />
        </div>
        <Field label="Company Description">
          <textarea
            name="company_description"
            defaultValue={job?.company_description || ""}
            rows={3}
            placeholder="A short line about the company"
            className={inputClass}
          />
        </Field>
      </Section>

      {/* Description */}
      <Section title="Job Description">
        <RichTextEditor value={description} onChange={setDescription} />
        <input type="hidden" name="description" value={description} />
        {state.fieldErrors?.description && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.description}</p>
        )}
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <Field label="Comma-separated skills">
          <input
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="SQL, Python, Excel, Power BI, Communication"
            className={inputClass}
          />
        </Field>
      </Section>

      {/* Application */}
      <Section title="Application">
        <Grid>
          <Field label="Application URL" error={state.fieldErrors?.application_url}>
            <input
              name="application_url"
              type="url"
              defaultValue={job?.application_url}
              required
              placeholder="https://careers.company.com/apply"
              className={inputClass}
            />
          </Field>
          <Field label="Button Text">
            <input name="apply_button_text" defaultValue={job?.apply_button_text || "Apply Now"} className={inputClass} />
          </Field>
        </Grid>
      </Section>

      {/* Publishing */}
      <Section title="Publishing">
        <Grid>
          <Field label="Status">
            <select name="status" defaultValue={job?.status || "draft"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <div className="flex items-center gap-6 pt-6">
            <Checkbox name="featured" label="Featured" defaultChecked={job?.featured} />
            <Checkbox name="urgent" label="Urgent" defaultChecked={job?.urgent} />
          </div>
        </Grid>
      </Section>

      <SubmitButton label={job ? "Save Changes" : "Create Job"} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-slate-100 bg-white p-6 shadow-card">
      <h3 className="mb-5 font-display text-base font-semibold text-brand-950">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-400" />
      {label}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
