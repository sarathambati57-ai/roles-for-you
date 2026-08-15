import Link from "next/link";
import {
  GraduationCap, Briefcase, Laptop, BarChart3, Cpu, Landmark,
  Home as HomeIcon, Building2, MapPin, Globe, TrendingUp, Sparkles,
} from "lucide-react";

const categories = [
  { label: "Fresher Jobs", href: "/jobs?experience=Fresher", icon: GraduationCap },
  { label: "Experienced Jobs", href: "/jobs?experience=3%2B+Years", icon: Briefcase },
  { label: "Internships", href: "/jobs?job_type=Internship", icon: Sparkles },
  { label: "Software Jobs", href: "/jobs?category=Software", icon: Laptop },
  { label: "Data Analyst Jobs", href: "/jobs?category=Data", icon: BarChart3 },
  { label: "IT Jobs", href: "/jobs?category=Software", icon: Cpu },
  { label: "Banking Jobs", href: "/jobs?category=Banking", icon: Landmark },
  { label: "Work From Home", href: "/jobs?location=Remote", icon: HomeIcon },
  { label: "Government Jobs", href: "/jobs?category=Other", icon: Building2 },
  { label: "Hyderabad Jobs", href: "/jobs?location=Hyderabad", icon: MapPin },
  { label: "Bangalore Jobs", href: "/jobs?location=Bangalore", icon: MapPin },
  { label: "Other Locations", href: "/jobs?location=India", icon: Globe },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
          💼 Popular Categories
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-800 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-brand-800">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
