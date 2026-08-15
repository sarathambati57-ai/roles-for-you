export type JobStatus = "draft" | "published";
export type JobType = "Full Time" | "Internship" | "Apprenticeship" | "Part Time";

export interface Job {
  id: string;
  company_name: string;
  company_logo: string | null;
  company_description: string | null;
  job_title: string;
  slug: string;
  category: string;
  job_type: JobType;
  location: string;
  experience: string;
  qualification: string;
  batch: string | null;
  salary: string | null;
  job_id: string | null;
  requisition_id: string | null;
  description: string;
  skills: string[];
  application_url: string;
  apply_button_text: string;
  deadline: string | null; // ISO date
  posted_date: string; // ISO date
  status: JobStatus;
  featured: boolean;
  urgent: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
}

export type JobInsert = Omit<Job, "id" | "created_at" | "updated_at">;
export type JobUpdate = Partial<JobInsert>;

export const CATEGORIES = [
  "Software",
  "Data",
  "Banking",
  "Sales",
  "Customer Support",
  "Finance",
  "Other",
] as const;

export const JOB_TYPES: JobType[] = ["Full Time", "Internship", "Apprenticeship", "Part Time"];

export const EXPERIENCE_LEVELS = ["Fresher", "0-1 Years", "0-2 Years", "1-3 Years", "3+ Years"];

export const LOCATIONS = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Pune",
  "Mumbai",
  "Delhi",
  "Remote",
  "India",
];

export const QUALIFICATIONS = ["B.Tech", "B.E", "BCA", "MCA", "MBA", "Any Graduate", "Other"];
