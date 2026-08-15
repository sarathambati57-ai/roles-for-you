/**
 * One-time helper to create your admin account in Supabase Auth.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx NEXT_PUBLIC_SUPABASE_URL=xxx \
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=your-strong-password \
 *   npx tsx scripts/seed.ts
 *
 * This uses the Supabase service role key (server-only, never commit it)
 * to create a confirmed user directly, so you don't need email delivery
 * configured just to get your first login working.
 *
 * IMPORTANT: In Supabase Dashboard > Authentication > Providers, disable
 * "Allow new users to sign up" after creating this account, since this
 * project treats ANY authenticated user as an admin.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error(
    "Missing required env vars. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD."
  );
  process.exit(1);
}

async function main() {
  const supabase = createClient(url as string, serviceKey as string, {
    auth: { autoConfirm: true },
  });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  console.log(`✅ Admin account created for ${data.user?.email}`);
  console.log("You can now log in at /admin/login with this email and password.");
}

main();
