/* Sync roadmap and study progress with the authenticated Supabase account. */
(() => {
  "use strict";
  const URL = "https://qnzjvghhuvygftntalng.supabase.co";
  const KEY = "sb_publishable_EKvl8YYlYJUFkWFOEeBJrg_cSpuxXO5";
  const TABLE = "user_progress";
  const $ = s => document.querySelector(s);
  const status = $("#progress-sync-status");
  if (!status || !window.supabase) return;
  const client = window.supabase.createClient(URL, KEY);
  let userId = null, hydrated = false, timer = null, pushing = false, queuedState = null;
  const say = message => { status.textContent = message; };
  const mergeStates = (local, remote) => {
    const daily = {...(remote.daily || {})};
    for (const [day, tasks] of Object.entries(local.daily || {})) {
      daily[day] = [...new Set([...(daily[day] || []), ...(tasks || [])])];
    }
    const dayTasks = {...(remote.dayTasks || {}), ...(local.dayTasks || {})};
    return {
      ...remote, ...local,
      weeks: [...new Set([...(remote.weeks || []), ...(local.weeks || [])])].sort((a,b)=>a-b),
      learned: [...new Set([...(remote.learned || []), ...(local.learned || [])])],
      daily, dayTasks,
      lastStudyDate: [remote.lastStudyDate, local.lastStudyDate].filter(Boolean).sort().at(-1) || null,
      streak: Math.max(Number(remote.streak || 0), Number(local.streak || 0)),
      theme: local.theme || remote.theme || "dark"
    };
  };
  async function push(state) {
    if (!userId || !hydrated) { queuedState = state; return; }
    if (pushing) { queuedState = state; return; }
    pushing = true;
    try {
      const {error} = await client.from(TABLE).upsert(
        {user_id:userId, state, updated_at:new Date().toISOString()},
        {onConflict:"user_id"}
      );
      if (error) throw error;
      say("Cloud synced ✓");
    } catch (error) {
      say("Sync error: " + error.message);
    } finally {
      pushing = false;
      if (queuedState) {
        const next = queuedState; queuedState = null;
        push(next);
      }
    }
  }
  async function hydrate(user) {
    userId = user?.id || null;
    hydrated = false;
    clearTimeout(timer);
    if (!userId) { say("Sign in above to sync across devices."); return; }
    say("Loading your cloud progress…");
    try {
      const {data,error} = await client.from(TABLE).select("state").eq("user_id",userId).maybeSingle();
      if (error) throw error;
      const local = window.LLDProgress.getState();
      if (data?.state) {
        const merged = mergeStates(local, data.state);
        window.LLDProgress.applyCloudState(merged);
        hydrated = true;
        await push(merged);
      } else {
        hydrated = true;
        await push(local);
      }
      say("Cloud sync ready ✓");
    } catch (error) {
      hydrated = false;
      say("Progress sync setup needed: " + error.message);
    }
  }
  window.addEventListener("lld-progress-changed", event => {
    if (!userId || !hydrated) return;
    queuedState = event.detail;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const next = queuedState || window.LLDProgress.getState();
      queuedState = null;
      push(next);
    }, 500);
  });
  client.auth.getSession().then(({data,error}) => {
    if (error) throw error;
    return hydrate(data.session?.user || null);
  }).catch(error => say("Could not check session: " + error.message));
  client.auth.onAuthStateChange((event,session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
      const nextId = session?.user?.id || null;
      if (nextId !== userId) hydrate(session?.user || null);
    }
  });
})();