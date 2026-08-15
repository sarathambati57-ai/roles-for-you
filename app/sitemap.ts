import type { MetadataRoute } from "next";
import { getPublishedJobs } from "@/lib/jobs";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getPublishedJobs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: siteUrl("/jobs"), changeFrequency: "hourly", priority: 0.9 },
    { url: siteUrl("/companies"), changeFrequency: "daily", priority: 0.6 },
    { url: siteUrl("/about"), changeFrequency: "monthly", priority: 0.3 },
    { url: siteUrl("/contact"), changeFrequency: "monthly", priority: 0.3 },
  ];

  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: siteUrl(`/jobs/${job.slug}`),
    lastModified: job.updated_at,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...jobRoutes];
}
