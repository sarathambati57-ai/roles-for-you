import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-bold text-brand-800">404</p>
      <h1 className="mt-4 font-display text-xl font-bold text-brand-950">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The job or page you're looking for may have expired or moved.
      </p>
      <Link
        href="/jobs"
        className="mt-6 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Browse Latest Jobs
      </Link>
    </div>
  );
}
