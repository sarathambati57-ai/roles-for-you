import { createBrowserClient } from "@supabase/ssr";

// Used inside Client Components ("use client"). Only ever uses the public
// anon key, which is safe to expose — RLS policies in supabase/schema.sql
// enforce that anonymous users can only read published jobs.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
