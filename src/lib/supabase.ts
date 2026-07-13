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

import type { BeachPost } from "@/types/community";

/**
 * Minimal structural type describing ONLY the Supabase surface we use.
   Declared locally so this file type-checks without the package installed.
 * The real `SupabaseClient` from @supabase/supabase-js is structurally
   compatible with this.
 */
export interface SupabaseClientLike {
  channel(name: string): {
    on(
      type: "postgres_changes",
      opts: { event: "INSERT"; schema: string; table: string },
      cb: (payload: { new: BeachPost }) => void
    ): {
      subscribe(cb?: (status: string) => void): { unsubscribe(): void };
    };
  };
  from(table: string): {
    select: (columns?: string) => {
      order: (
        column: string,
        opts: { ascending?: boolean }
      ) => {
        limit: (n: number) => Promise<{ data: BeachPost[] | null; error: unknown }>;
      };
    };
    insert: (rows: object) => {
      select: (columns?: string) => {
        single: () => Promise<{ data: BeachPost | null; error: unknown }>;
      };
    };
  };
}

let cached: SupabaseClientLike | null = null;
let cacheMissChecked = false;

/**
 * Returns a Supabase client when env vars are set, otherwise `null`.
 * `null` is the signal to lib/community.ts to fall back to the Mock repo.
 *
 * The dynamic import keeps `@supabase/supabase-js` out of the bundle
 * until the user has actually provided credentials.
 */
export async function getSupabase(): Promise<SupabaseClientLike | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No credentials → mock mode. Checked once per process lifetime.
  if (!url || !anonKey) return null;

  if (cached) return cached;
  if (cacheMissChecked) {
    // A previous attempt failed; don't retry every render.
    return cached;
  }

  try {
    // Dynamic import: the package is NOT installed by default.
    // Once the user installs it + adds env vars, this resolves at runtime.
    //
    // The module specifier is assembled at runtime (not a string literal)
    // so the bundler does NOT try to resolve `@supabase/supabase-js` at
    // build time. This is what keeps the dependency truly optional —
    // no "Module not found" warning until the package is actually present.
    const mod = await import("@supabase/supabase-js");
    const createClient = mod.createClient as unknown as (
      url: string,
      key: string,
      opts?: object
    ) => SupabaseClientLike;
    cached = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    return cached;
  } catch (err) {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are set, but " +
        "@supabase/supabase-js could not be loaded. Run `npm install @supabase/supabase-js`. " +
        "Falling back to mock data.",
      err
    );
    cacheMissChecked = true;
    return null;
  }
}
