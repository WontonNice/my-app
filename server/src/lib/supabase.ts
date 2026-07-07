import { createClient } from "@supabase/supabase-js";

// Accept both the names used by this repository and Supabase's standard
// service-role variable name. The public Vite URL is the same project URL and
// is already present on deployments where browser login works.
const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim();
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("Missing Supabase server credentials. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE (or SUPABASE_SERVICE_ROLE_KEY).");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRole);
