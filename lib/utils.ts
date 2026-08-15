import { format, differenceInCalendarDays, parseISO, isValid } from "date-fns";
import slugify from "slugify";
import type { Job } from "@/types/job";

export function makeSlug(jobTitle: string, companyName: string, existingSuffix?: string) {
  const base = slugify(`${companyName}-${jobTitle}`, { lower: true, strict: true });
  return existingSuffix ? `${base}-${existingSuffix}` : base;
}

export function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  const d = parseISO(dateStr);
  if (!isValid(d)) return "—";
  return format(d, "d MMMM yyyy");
}

export function isExpired(job: Pick<Job, "deadline">) {
  if (!job.deadline) return false;
  const d = parseISO(job.deadline);
  if (!isValid(d)) return false;
  return differenceInCalendarDays(d, new Date()) < 0;
}

export function daysUntilDeadline(deadline: string | null | undefined) {
  if (!deadline) return null;
  const d = parseISO(deadline);
  if (!isValid(d)) return null;
  return differenceInCalendarDays(d, new Date());
}

export function isDeadlineApproaching(deadline: string | null | undefined, withinDays = 5) {
  const days = daysUntilDeadline(deadline);
  return days !== null && days >= 0 && days <= withinDays;
}

export function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path}`;
}

export function truncate(text: string, max = 160) {
  const plain = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max - 1)}…` : plain;
}
