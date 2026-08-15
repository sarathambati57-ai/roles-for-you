import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Roles_for_you_, a career opportunity platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">About Roles_for_you_</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
        <p>
          Roles_for_you_ is a career opportunity platform sharing job openings, internships and career
          updates to help candidates discover their next opportunity.
        </p>
        <p>
          We share opportunities daily on Instagram at{" "}
          <a href="https://instagram.com/Roles_for_you_" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
            @Roles_for_you_
          </a>{" "}
          and list the complete details here — role, eligibility, salary, deadline and the official
          application link — so you never miss an opportunity.
        </p>
        <p>
          We do not charge candidates for job listings, and we do not guarantee interviews, offers, or
          employment outcomes. All applications go through each company's official hiring process.
        </p>
      </div>
    </div>
  );
}
