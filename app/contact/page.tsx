import type { Metadata } from "next";
import InstagramIcon from "@/components/InstagramIcon";	
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">Contact Us</h1>
      <p className="mt-2 text-sm text-slate-500">
        Have a question or want to share a job with us? Send a message below.
      </p>

      <a
        href="https://instagram.com/Roles_for_you_"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
      >
        <InstagramIcon className="h-4 w-4" /> @Roles_for_you_
      </a>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
