import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg font-display font-bold text-base ${
          light ? "bg-white text-brand-800" : "bg-brand-800 text-white"
        } transition-transform group-hover:scale-105`}
      >
        R.
      </span>
      <span
        className={`font-display font-bold text-lg tracking-tight ${
          light ? "text-white" : "text-brand-950"
        }`}
      >
        Roles_for_you_
      </span>
    </Link>
  );
}
