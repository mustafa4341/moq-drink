/* ═══════════════════════════════════════════════════════════════
   Supabase Client — DORMANT (lazy singleton)
   ───────────────────────────────────────────────────────────────
   This module is intentionally dependency-free right now.
   `@supabase/supabase-js` is NOT installed yet — it is loaded via a
   dynamic `await import(...)` only when env vars are present, so the
   package is never bundled until the user actually configures Supabase.

   How to go live later (no UI changes required):
     1. npm install @supabase/supabase-js
     2. Add to .env.local:
          NEXT_PUBLIC_SUPABASE_URL=...
          NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     3. Run supabase/migrations/0001_beach_posts.sql in the dashboard.
   getCommunityRepository() in lib/community.ts will then automatically
   switch from the Mock repository to the Supabase repository.
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  if (cached) return cached;

  try {
    cached = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    return cached;
  } catch (err) {
    console.error("[supabase] Failed to initialize Supabase client:", err);
    return null;
  }
}
