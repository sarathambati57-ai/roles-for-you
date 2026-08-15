import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
        <p>
          Roles_for_you_ does not require an account to browse or view job listings. If you contact us
          through the Contact page, we collect your name, email address and message solely to respond
          to your query.
        </p>
        <p>
          We do not sell or share your personal information with third parties. Job applications are
          submitted directly on each employer's official website — we do not collect or store your
          application data.
        </p>
        <p>This policy may be updated from time to time. Continued use of the site means you accept the current policy.</p>
      </div>
    </div>
  );
}
