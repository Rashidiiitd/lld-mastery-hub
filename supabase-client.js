/* One shared Supabase client for authentication, notes, and progress sync. */
(() => {
  "use strict";
  if (!window.supabase || window.masterySupabase) return;
  const SUPABASE_URL = "https://qnzjvghhuvygftntalng.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_EKvl8YYlYJUFkWFOEeBJrg_cSpuxXO5";
  window.masterySupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
})();
