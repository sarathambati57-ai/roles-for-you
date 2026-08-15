"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchHero() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/jobs${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-block animate-fadeUp rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-brand-100">
          New jobs added every week
        </span>
        <h1 className="mt-5 animate-fadeUp font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Find Your Next Opportunity
        </h1>
        <p className="mx-auto mt-4 max-w-xl animate-fadeUp text-base text-brand-100 sm:text-lg">
          Discover the latest jobs, internships and career opportunities in one place.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl animate-fadeUp flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search by job title, company, skill or location"
              className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Search Jobs
          </button>
        </form>

        <div className="mt-5 flex animate-fadeUp justify-center">
          <a
            href="/jobs"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View Latest Jobs
          </a>
        </div>
      </div>
    </section>
  );
}
