(() => {
  "use strict";
  const SUPABASE_URL = "https://qnzjvghhuvygftntalng.supabase.co";
  const SUPABASE_KEY = "sb_publishable_EKvl8YYlYJUFkWFOEeBJrg_cSpuxXO5";
  const $ = (id) => document.getElementById(id);
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const form = $("auth-form");
  const feedback = $("auth-feedback");
  const submit = $("auth-submit");
  const submitText = $("auth-submit-text");
  const switchText = $("auth-switch-text");
  const switchButton = $("auth-switch");
  const password = $("auth-password");
  let mode = "signin";
  let busy = false;

  function say(message, kind = "") {
    feedback.textContent = message;
    feedback.className = "auth-feedback" + (kind ? " " + kind : "");
    const recoveryFeedback = $("recovery-feedback");
    if (recoveryFeedback) { recoveryFeedback.textContent = message; recoveryFeedback.className = "auth-feedback" + (kind ? " " + kind : ""); }
  }
  function setBusy(value) {
    busy = value;
    submit.disabled = value;
    switchButton.disabled = value;
    $("forgot-password").disabled = value;
    $("resend-confirmation").disabled = value;
    submitText.textContent = value ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account";
  }
  function setMode(next) {
    mode = next;
    $("auth-eyebrow").textContent = mode === "signin" ? "WELCOME BACK" : "START YOUR LEARNING JOURNEY";
    $("auth-title").textContent = mode === "signin" ? "Sign in to your workspace." : "Create your account.";
    $("auth-description").textContent = mode === "signin"
      ? "Pick up where you left off. Your notes and learning progress stay connected to your account."
      : "One account for your private notes and synced learning progress.";
    submitText.textContent = mode === "signin" ? "Sign in" : "Create account";
    switchText.textContent = mode === "signin" ? "New here?" : "Already have an account?";
    switchButton.textContent = mode === "signin" ? "Create an account" : "Sign in instead";
    $("forgot-password").hidden = mode !== "signin";
    $("resend-confirmation").hidden = true;
    $("auth-name").hidden = mode === "signin";
    $("auth-name-label").hidden = mode === "signin";
    $("auth-name").required = mode !== "signin";
    password.autocomplete = mode === "signin" ? "current-password" : "new-password";
    say("");
  }
  function goToWorkspace() {
    window.location.assign(new URL("lld.html#notes", window.location.href).href);
  }
  switchButton.addEventListener("click", () => {
    if (!busy) setMode(mode === "signin" ? "signup" : "signin");
  });
  $("toggle-password").addEventListener("click", () => {
    const reveal = password.type === "password";
    password.type = reveal ? "text" : "password";
    $("toggle-password").textContent = reveal ? "Hide" : "Show";
    $("toggle-password").setAttribute("aria-label", reveal ? "Hide password" : "Show password");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    const email = $("auth-email").value.trim();
    const pass = password.value;
    setBusy(true);
    try {
      if (mode === "signin") {
        say("Signing you in…");
        const { error } = await client.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        say("Signed in. Opening your workspace…", "success");
        goToWorkspace();
      } else {
        const fullName = $("auth-name").value.trim();
        say("Creating your account…");
        const { data, error } = await client.auth.signUp({
          email, password: pass,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: new URL("lld.html#notes", window.location.href).href
          }
        });
        if (error) throw error;
        if (data.session) {
          say("Account created. Opening your workspace…", "success");
          goToWorkspace();
        } else {
          setMode("signin");
          say("Account created. Check your email for the confirmation link, then sign in here.", "success");
        }
      }
    } catch (error) {
      say(error.message || "Something went wrong. Please try again.", "error");
      if (mode === "signin" && /email not confirmed|not confirmed/i.test(error.message || "")) {
        $("resend-confirmation").hidden = false;
      }
    } finally {
      setBusy(false);
    }
  });
  $("resend-confirmation").addEventListener("click", async () => {
    const email = $("auth-email").value.trim();
    if (!email) {
      say("Enter your email address first, then resend the confirmation.", "error");
      $("auth-email").focus();
      return;
    }
    setBusy(true);
    say("Sending a new confirmation email…");
    try {
      const { error } = await client.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: new URL("lld.html#notes", window.location.href).href }
      });
      if (error) throw error;
      say("If this account needs confirmation, a new email has been sent. Check your inbox and spam folder.", "success");
      $("resend-confirmation").hidden = true;
    } catch (error) {
      say(error.message || "Could not resend the confirmation email.", "error");
    } finally {
      setBusy(false);
    }
  });

  $("forgot-password").addEventListener("click", async () => {
    const email = $("auth-email").value.trim();
    if (!email) {
      say("Enter your email address first, then choose Forgot password.", "error");
      $("auth-email").focus();
      return;
    }
    setBusy(true);
    try {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: new URL("login.html?recovery=1", window.location.href).href
      });
      if (error) throw error;
      say("If an account exists for that email, a password-reset link will arrive shortly. Check your inbox.", "success");
    } catch (error) {
      say(error.message || "Could not request a password reset.", "error");
    } finally {
      setBusy(false);
    }
  });

  async function checkSession() {
    const { data, error } = await client.auth.getSession();
    if (error) { say(error.message, "error"); return; }
    if (data.session && new URLSearchParams(window.location.search).get("recovery") !== "1") {
      $("signed-in-state").hidden = false;
      $("auth-form-wrap").hidden = true;
      $("auth-user-email").textContent = data.session.user.email || "Your account";
      $("auth-signout").hidden = false;
    }
    if (new URLSearchParams(window.location.search).get("recovery") === "1") {
      $("recovery-wrap").hidden = false;
      $("auth-form-wrap").hidden = true;
      $("signed-in-state").hidden = true;
    }
  }
  $("auth-signout").addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) { say(error.message, "error"); return; }
    $("signed-in-state").hidden = true;
    $("auth-form-wrap").hidden = false;
    $("auth-signout").hidden = true;
    setMode("signin");
    say("You have signed out.", "success");
  });
  $("recovery-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const nextPassword = $("new-password").value;
    if (nextPassword.length < 8) { say("Choose a password with at least 8 characters.", "error"); return; }
    setBusy(true);
    try {
      const { error } = await client.auth.updateUser({ password: nextPassword });
      if (error) throw error;
      await client.auth.signOut();
      $("recovery-wrap").hidden = true;
      $("auth-form-wrap").hidden = false;
      setMode("signin");
      say("Password updated. Sign in with your new password.", "success");
      history.replaceState({}, "", new URL("login.html", window.location.href).href);
    } catch (error) {
      say(error.message || "Could not update your password.", "error");
    } finally { setBusy(false); }
  });
  setMode("signin");
  checkSession();
})();