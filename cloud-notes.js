/* Cloud notes powered by Supabase Auth, Database, and private Storage. */
(() => {
  "use strict";
  const SUPABASE_URL = "https://qnzjvghhuvygftntalng.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_EKvl8YYlYJUFkWFOEeBJrg_cSpuxXO5";
  const BUCKET = "handwritten-notes";
  const $ = (selector) => document.querySelector(selector);
  if (!window.supabase || !$("#note-upload-form")) return;
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  let currentUser = null;
  let notesCache = [];
  const feedback = (message) => {
    const status = $("#cloud-account-status");
    if (status) status.textContent = message || "";
  };
  const noteFeedback = (message) => { $("#note-feedback").textContent = message || ""; };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function setAuthUi(user) {
    currentUser = user || null;
    const accountStatus = $("#cloud-account-status");
    const accountLink = $("#cloud-auth-link");
    if (accountStatus) accountStatus.textContent = user
      ? "Signed in as " + user.email + ". Notes and learning progress sync to this account."
      : "Sign in to upload notes and sync learning progress across devices.";
    if (accountLink) accountLink.textContent = user ? "Account & sign-out →" : "Sign in or create account →";
    $("#note-upload-form").querySelectorAll("input,select,button").forEach(el => { el.disabled = !user; });
    if (!user) {
      notesCache = [];
      renderNotes();
      noteFeedback("Sign in to upload and view your cloud notes.");
    }
  }
  async function getSignedImage(path) {
    const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, 3600);
    if (error) throw error;
    return data.signedUrl;
  }
  async function loadNotes() {
    if (!currentUser) return;
    $("#notes-grid").innerHTML = '<p class="muted small">Loading cloud notes…</p>';
    const { data, error } = await client.from("handwritten_notes")
      .select("id,title,topic,storage_path,created_at")
      .eq("user_id", currentUser.id).order("created_at", { ascending: false });
    if (error) throw error;
    notesCache = await Promise.all((data || []).map(async note => ({
      ...note, imageUrl: await getSignedImage(note.storage_path)
    })));
    renderNotes();
  }
  function renderNotes() {
    const query = ($("#notes-search")?.value || "").trim().toLowerCase();
    const filtered = notesCache.filter(n => (n.title + " " + n.topic).toLowerCase().includes(query));
    $("#notes-count").textContent = notesCache.length + " page" + (notesCache.length === 1 ? "" : "s");
    $("#notes-grid").innerHTML = filtered.length ? filtered.map(n =>
      '<article class="note-card"><a class="note-preview" href="' + n.imageUrl + '" target="_blank" rel="noreferrer" aria-label="Open ' + escapeHtml(n.title) + ' in a new tab"><img src="' + n.imageUrl + '" alt="' + escapeHtml(n.title) + '" loading="lazy"></a><div class="note-card-body"><span class="chip">' + escapeHtml(n.topic) + '</span><h4>' + escapeHtml(n.title) + '</h4><p class="muted small">' + new Date(n.created_at).toLocaleDateString() + '</p><div class="note-card-actions"><button type="button" class="button secondary" data-download-note="' + n.id + '">Download PNG</button><button type="button" class="text-button" data-delete-note="' + n.id + '">Delete</button></div></div></article>'
    ).join("") : '<p class="muted small">' + (query ? "No notes match that search." : (currentUser ? "No cloud notes yet. Upload your first handwritten PNG." : "Sign in to see your notes from any device.")) + '</p>';
    $("#notes-grid").querySelectorAll("[data-download-note]").forEach(btn => btn.addEventListener("click", async () => {
      const note = notesCache.find(n => n.id === btn.dataset.downloadNote);
      if (!note) return;
      try {
        const response = await fetch(note.imageUrl);
        if (!response.ok) throw new Error("Could not download image.");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob), link = document.createElement("a");
        link.href = url; link.download = (note.title.replace(/[^a-z0-9-_ ]/gi, "").trim() || "handwritten-note") + ".png";
        document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) { noteFeedback("Download failed: " + error.message); }
    }));
    $("#notes-grid").querySelectorAll("[data-delete-note]").forEach(btn => btn.addEventListener("click", async () => {
      const note = notesCache.find(n => n.id === btn.dataset.deleteNote);
      if (!note || !confirm('Delete "' + note.title + '" from your cloud library?')) return;
      try {
        const { error: storageError } = await client.storage.from(BUCKET).remove([note.storage_path]);
        if (storageError) throw storageError;
        const { error } = await client.from("handwritten_notes").delete().eq("id", note.id).eq("user_id", currentUser.id);
        if (error) throw error;
        noteFeedback("Cloud note deleted.");
        await loadNotes();
      } catch (error) { noteFeedback("Could not delete note: " + error.message); }
    }));
  }
  async function refreshSession() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    const user = data.session?.user || null;
    setAuthUi(user);
    if (user) {
      try { await loadNotes(); noteFeedback("Your cloud notes are up to date."); }
      catch (err) { $("#notes-grid").innerHTML = '<p class="muted small">Cloud setup is not finished yet. Run the SQL setup steps shown in the instructions.</p>'; noteFeedback("Could not load notes: " + err.message); }
    }
  }
  $("#notes-search").addEventListener("input", renderNotes);
  $("#note-upload-form").addEventListener("submit", async event => {
    event.preventDefault();
    const title = $("#note-title").value.trim(), topic = $("#note-topic").value, file = $("#note-image").files[0];
    if (!currentUser) { noteFeedback("Please sign in first."); return; }
    if (!title || !file) { noteFeedback("Add a title and choose a PNG image first."); return; }
    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) { noteFeedback("Please choose a PNG file."); return; }
    if (file.size > 20 * 1024 * 1024) { noteFeedback("This PNG is larger than 20 MB. Choose a smaller image."); return; }
    const submit = $("#note-upload-form button[type=submit]");
    submit.disabled = true; noteFeedback("Uploading PNG to your private cloud storage…");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = currentUser.id + "/" + Date.now() + "-" + safeName;
    try {
      const { error: uploadError } = await client.storage.from(BUCKET).upload(path, file, { contentType: "image/png", upsert: false });
      if (uploadError) throw uploadError;
      const { error } = await client.from("handwritten_notes").insert({ user_id: currentUser.id, title, topic, storage_path: path });
      if (error) {
        await client.storage.from(BUCKET).remove([path]);
        throw error;
      }
      $("#note-upload-form").reset();
      noteFeedback("Saved to the cloud! Sign in with this account on another device to access it.");
      await loadNotes();
    } catch (error) { noteFeedback("Upload failed: " + error.message); }
    finally { submit.disabled = !currentUser; }
  });
  client.auth.onAuthStateChange((_event, session) => {
    const user = session?.user || null;
    if (user?.id !== currentUser?.id) {
      setAuthUi(user);
      if (user) loadNotes().catch(error => noteFeedback("Could not load cloud notes: " + error.message));
    }
  });
  setAuthUi(null);
  refreshSession().catch(error => feedback("Supabase connection error: " + error.message));
})();