import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">Terms of Use</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
        <p>
          Roles_for_you_ aggregates and shares publicly available job opportunities for informational
          purposes. We are not a recruitment agency and do not guarantee interviews, offers, or
          employment outcomes.
        </p>
        <p>
          Application links redirect to each employer's official career page. Please verify all details
          on the employer's site before applying, as roles may close or change without notice.
        </p>
        <p>Use of this site implies acceptance of these terms.</p>
      </div>
    </div>
  );
}
