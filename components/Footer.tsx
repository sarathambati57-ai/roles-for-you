import Link from "next/link";
import Logo from "./Logo";
import InstagramIcon from "./InstagramIcon";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-brand-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-3 text-sm text-slate-400">Find Your Next Opportunity</p>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Latest Jobs</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Categories</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-white">Follow</h4>
            <a href="https://instagram.com/Roles_for_you_" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-white">
              <InstagramIcon className="h-4 w-4" /> @Roles_for_you_
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Roles_for_you_. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}