import slugify from "slugify";
import type { Job } from "@/types/job";

export function makeSlug(jobTitle: string, companyName: string, existingSuffix?: string) {
  const base = slugify(`${companyName}-${jobTitle}`, { lower: true, strict: true });
  return existingSuffix ? `${base}-${existingSuffix}` : base;
}

function parseDate(dateStr: string): Date | null {
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  const d = parseDate(dateStr);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysBetween(a: Date, b: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const aStart = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bStart = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((aStart.getTime() - bStart.getTime()) / msPerDay);
}

export function isExpired(job: Pick<Job, "deadline">) {
  if (!job.deadline) return false;
  const d = parseDate(job.deadline);
  if (!d) return false;
  return daysBetween(d, startOfToday()) < 0;
}

export function daysUntilDeadline(deadline: string | null | undefined) {
  if (!deadline) return null;
  const d = parseDate(deadline);
  if (!d) return null;
  return daysBetween(d, startOfToday());
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