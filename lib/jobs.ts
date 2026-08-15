import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/types/job";

export interface JobFilters {
  q?: string;
  category?: string;
  jobType?: string;
  experience?: string;
  location?: string;
  qualification?: string;
  featured?: boolean;
  urgent?: boolean;
}

// Fetches only PUBLISHED jobs — safe for any public page.
export async function getPublishedJobs(filters: JobFilters = {}) {
  const supabase = createClient();
  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("posted_date", { ascending: false });

  if (filters.q) {
    query = query.or(
      `job_title.ilike.%${filters.q}%,company_name.ilike.%${filters.q}%,location.ilike.%${filters.q}%`
    );
  }
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.jobType) query = query.eq("job_type", filters.jobType);
  if (filters.experience) query = query.eq("experience", filters.experience);
  if (filters.location) query = query.eq("location", filters.location);
  if (filters.qualification) query = query.eq("qualification", filters.qualification);
  if (filters.featured) query = query.eq("featured", true);
  if (filters.urgent) query = query.eq("urgent", true);

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedJobs error:", error.message);
    return [];
  }
  return (data ?? []) as Job[];
}

export async function getJobBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getJobBySlug error:", error.message);
    return null;
  }
  return data as Job | null;
}

export async function getRelatedJobs(job: Job, limit = 6) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .neq("id", job.id)
    .or(`category.eq.${job.category},location.eq.${job.location}`)
    .order("posted_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRelatedJobs error:", error.message);
    return [];
  }
  return (data ?? []) as Job[];
}

// ---------- Admin-only queries (RLS still enforces the auth check) ----------

export async function getAllJobsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllJobsAdmin error:", error.message);
    return [];
  }
  return (data ?? []) as Job[];
}

export async function getJobByIdAdmin(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("getJobByIdAdmin error:", error.message);
    return null;
  }
  return data as Job | null;
}

export async function getJobStats() {
  const supabase = createClient();
  const { data, error } = await supabase.from("jobs").select("status, featured, deadline");
  if (error || !data) return { total: 0, published: 0, draft: 0, expired: 0, featured: 0 };

  const today = new Date().toISOString().slice(0, 10);
  return {
    total: data.length,
    published: data.filter((j) => j.status === "published").length,
    draft: data.filter((j) => j.status === "draft").length,
    expired: data.filter((j) => j.deadline && j.deadline < today).length,
    featured: data.filter((j) => j.featured).length,
  };
}
