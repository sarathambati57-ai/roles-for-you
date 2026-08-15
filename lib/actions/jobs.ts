"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";
import { makeSlug } from "@/lib/utils";

const jobSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_logo: z.string().url().optional().or(z.literal("")),
  company_description: z.string().optional(),
  job_title: z.string().min(1, "Job title is required"),
  category: z.string().min(1),
  job_type: z.enum(["Full Time", "Internship", "Apprenticeship", "Part Time"]),
  location: z.string().min(1),
  experience: z.string().min(1),
  qualification: z.string().min(1),
  batch: z.string().optional(),
  salary: z.string().optional(),
  job_id: z.string().optional(),
  requisition_id: z.string().optional(),
  description: z.string().min(1, "Job description is required"),
  skills: z.array(z.string()).default([]),
  application_url: z.string().url("Enter a valid application URL"),
  apply_button_text: z.string().default("Apply Now"),
  deadline: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false),
});

export type JobFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseFormData(formData: FormData) {
  const skills = String(formData.get("skills") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    company_name: String(formData.get("company_name") || ""),
    company_logo: String(formData.get("company_logo") || ""),
    company_description: String(formData.get("company_description") || ""),
    job_title: String(formData.get("job_title") || ""),
    category: String(formData.get("category") || "Other"),
    job_type: String(formData.get("job_type") || "Full Time"),
    location: String(formData.get("location") || ""),
    experience: String(formData.get("experience") || ""),
    qualification: String(formData.get("qualification") || ""),
    batch: String(formData.get("batch") || ""),
    salary: String(formData.get("salary") || ""),
    job_id: String(formData.get("job_id") || ""),
    requisition_id: String(formData.get("requisition_id") || ""),
    description: String(formData.get("description") || ""),
    skills,
    application_url: String(formData.get("application_url") || ""),
    apply_button_text: String(formData.get("apply_button_text") || "Apply Now"),
    deadline: String(formData.get("deadline") || ""),
    status: String(formData.get("status") || "draft"),
    featured: formData.get("featured") === "on",
    urgent: formData.get("urgent") === "on",
  };
}

export async function createJobAction(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const raw = parseFormData(formData);
  const parsed = jobSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const supabase = createClient();
  const cleanDescription = DOMPurify.sanitize(parsed.data.description);
  const slug = makeSlug(parsed.data.job_title, parsed.data.company_name, Date.now().toString(36));

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      ...parsed.data,
      description: cleanDescription,
      company_logo: parsed.data.company_logo || null,
      deadline: parsed.data.deadline || null,
      slug,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs?created=${data.id}`);
}

export async function updateJobAction(
  jobId: string,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const raw = parseFormData(formData);
  const parsed = jobSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const supabase = createClient();
  const cleanDescription = DOMPurify.sanitize(parsed.data.description);

  const { error } = await supabase
    .from("jobs")
    .update({
      ...parsed.data,
      description: cleanDescription,
      company_logo: parsed.data.company_logo || null,
      deadline: parsed.data.deadline || null,
    })
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs?updated=${jobId}`);
}

export async function deleteJobAction(jobId: string) {
  const supabase = createClient();
  await supabase.from("jobs").delete().eq("id", jobId);
  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
}

export async function togglePublishAction(jobId: string, currentStatus: "draft" | "published") {
  const supabase = createClient();
  await supabase
    .from("jobs")
    .update({ status: currentStatus === "published" ? "draft" : "published" })
    .eq("id", jobId);
  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
}

export async function toggleFeaturedAction(jobId: string, current: boolean) {
  const supabase = createClient();
  await supabase.from("jobs").update({ featured: !current }).eq("id", jobId);
  revalidatePath("/");
  revalidatePath("/admin/jobs");
}

export async function toggleUrgentAction(jobId: string, current: boolean) {
  const supabase = createClient();
  await supabase.from("jobs").update({ urgent: !current }).eq("id", jobId);
  revalidatePath("/");
  revalidatePath("/admin/jobs");
}

export async function duplicateJobAction(jobId: string) {
  const supabase = createClient();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", jobId).single();
  if (!job) return;

  const { id, created_at, updated_at, slug, ...rest } = job;
  const newSlug = makeSlug(rest.job_title, rest.company_name, Date.now().toString(36));

  await supabase.from("jobs").insert({ ...rest, slug: newSlug, status: "draft" });
  revalidatePath("/admin/jobs");
}
