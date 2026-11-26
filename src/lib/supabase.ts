import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xgdljkydluwncnqyjahg.supabase.co"
).replace(/^["']|["']$/g, "");

// Service role key is only present on server environments.
// We provide a fallback so @supabase/supabase-js never crashes at module evaluation time in client bundles.
const supabaseKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.client_safe_stub_key"
).replace(/^["']|["']$/g, "");

// Use service role key to bypass RLS for server-side admin dashboard
export const supabase = createClient(supabaseUrl, supabaseKey);
