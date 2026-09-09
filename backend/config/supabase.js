const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ [Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend environment!");
}

// Client for public / user authenticated operations
const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Admin client with service role key (bypasses Row Level Security)
const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : supabase;

/**
 * Health check function to test connectivity to Supabase
 */
async function testSupabaseConnection() {
  try {
    // Check connection via Supabase Auth service
    const { error } = await supabase.auth.getSession();
    if (error && error.status !== 400) {
      return {
        success: false,
        message: error.message,
        url: supabaseUrl,
      };
    }

    return {
      success: true,
      message: "Connected to Supabase successfully",
      url: supabaseUrl,
      hasAdminClient: Boolean(supabaseServiceRoleKey),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to reach Supabase endpoint",
      url: supabaseUrl,
    };
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  testSupabaseConnection,
};
