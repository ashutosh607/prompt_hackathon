import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ [Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in frontend/.env.local"
  );
}

if (supabaseUrl && supabaseUrl.includes("supabase.com/dashboard")) {
  console.error(
    "⚠️ [Supabase] Invalid VITE_SUPABASE_URL: It looks like you provided the Dashboard URL. Please use https://<project-ref>.supabase.co instead."
  );
}

const validUrl = supabaseUrl && supabaseUrl.startsWith("http") ? supabaseUrl : "https://shqdkeoboannuyxprwqv.supabase.co";
const validKey = supabaseAnonKey || "sb_publishable_placeholder";

export const supabase = createClient(
  validUrl,
  validKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Diagnostic check to verify connection to Supabase
 */
export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.auth.getSession();
    if (error && error.status !== 400) {
      return {
        connected: false,
        message: error.message,
        url: supabaseUrl,
      };
    }
    return {
      connected: true,
      message: "Successfully connected to Supabase",
      url: supabaseUrl,
    };
  } catch (err) {
    return {
      connected: false,
      message: err.message || "Unable to reach Supabase",
      url: supabaseUrl,
    };
  }
}
