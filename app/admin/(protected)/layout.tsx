import Link from "next/link";
import { LayoutDashboard, ListChecks, PlusCircle, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-100 bg-white px-4 py-6 lg:flex">
          <Link href="/admin" className="mb-8 flex items-center gap-2 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800 font-display text-sm font-bold text-white">R.</span>
            <span className="font-display text-sm font-bold text-brand-950">Admin Panel</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/admin/jobs" icon={ListChecks} label="Manage Jobs" />
            <NavItem href="/admin/jobs/new" icon={PlusCircle} label="Add New Job" />
          </nav>

          <form action={logoutAction}>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
            <span className="font-display text-sm font-bold text-brand-950">Roles_for_you_ Admin</span>
            <form action={logoutAction}>
              <button className="text-xs font-medium text-red-600">Logout</button>
            </form>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-800"
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
