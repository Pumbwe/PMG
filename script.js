<script>
/* ===== NOTES DATABASE =====
   Items can be strings or objects: { title: "Topic", href: "path/to/file.html" }
*/
const notes = {
  MA110: {
    title: "MA110 – Mathematics Notes",
    items: [
      "Algebra: Linear equations, Quadratics, Polynomials",
      "Functions: Types, Domain & Range, Composition",
      "Trigonometry: Identities, Equations, Graphs",
      "Sequences & Series: AP, GP",
      "Calculus: Limits, Differentiation, Integration"
    ]
  },
  PH110: {
    title: "PH110 – Physics Notes",
    items: [
      "Mechanics: Newton’s Laws, Kinematics",
      "Work, Energy & Power",
      "Waves & Oscillations",
      "Optics: Reflection, Refraction",
      "Electricity: Ohm’s Law, Circuits"
    ]
  },
  LA111: {
    title: "LA111 – Language & Study Skills",
    items: [
      "Parts of Speech & Sentence Structure",
      "Essay Writing: Thesis & Cohesion",
      "Academic Writing & Referencing",
      "Comprehension & Summary Writing"
    ]
  },
  CH110: {
    title: "CH110 – Chemistry Notes",
    items: [
      "Atomic Structure & Periodic Trends",
      "Chemical Bonding",
      "Stoichiometry",
      "States of Matter"
    ]
  }
};

/* ===== Utility: normalize subject keys ===== */
function normalizeKey(key) {
  if (!key && key !== 0) return "";
  return String(key).replace(/\s+/g, "").toUpperCase();
}

/* ===== Find note entry by flexible key (accepts spaces/case) ===== */
function findNoteEntry(subject) {
  const key = normalizeKey(subject);
  // Try direct match first
  if (notes[key]) return notes[key];
  // Try scanning keys (in case original keys include different formatting)
  for (const k of Object.keys(notes)) {
    if (normalizeKey(k) === key) return notes[k];
  }
  return null;
}

/* ===== Render a single note item (string or {title, href}) ===== */
function renderNoteItem(item) {
  if (!item) return "";
  if (typeof item === "string") {
    return `<li style="margin:8px 0;">${escapeHtml(item)}</li>`;
  }
  if (typeof item === "object" && item.title) {
    const title = escapeHtml(item.title);
    if (item.href) {
      const href = escapeHtml(item.href);
      return `<li style="margin:8px 0;"><a href="${href}" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:underline;">${title}</a></li>`;
    }
    return `<li style="margin:8px 0;">${title}</li>`;
  }
  return "";
}

/* ===== Basic HTML escape to avoid accidental injection ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ===== SHOW NOTES =====
   subject: string like "CH110", "CH 110", "ch110"
*/
function showNotes(subject) {
  const notesSection = document.getElementById("notesSection");
  const notesTitle = document.getElementById("notesTitle");
  const notesContent = document.getElementById("notesContent");

  // Safety: ensure DOM elements exist
  if (!notesSection || !notesTitle || !notesContent) {
    console.warn("Notes UI elements missing: ensure #notesSection, #notesTitle, #notesContent exist.");
    return;
  }

  const entry = findNoteEntry(subject);

  if (!entry) {
    notesTitle.innerText = "Notes Not Available";
    notesContent.innerHTML = "<p style='color:#f87171;'>Notes for this subject are coming soon.</p>";
    notesSection.classList.remove("hidden");
    return;
  }

  notesTitle.innerText = entry.title || "Notes";
  const listHtml = (entry.items || [])
    .map(renderNoteItem)
    .join("");

  notesContent.innerHTML = `<ul style="text-align:left; padding-left:18px;">${listHtml}</ul>`;
  notesSection.classList.remove("hidden");
  // Optionally focus the notes section for accessibility
  notesSection.setAttribute("tabindex", "-1");
  notesSection.focus({ preventScroll: true });
}

/* ===== CLOSE NOTES ===== */
function closeNotes() {
  const notesSection = document.getElementById("notesSection");
  if (notesSection) {
    notesSection.classList.add("hidden");
  }
}

/* ===== Expose functions globally for inline handlers ===== */
window.showNotes = showNotes;
window.closeNotes = closeNotes;

/* ===== Example: how to add a linked note item dynamically =====
   notes['CH260'] = notes['CH260'] || { title: 'CH260', items: [] };
   notes['CH260'].items.push({ title: 'Hybridization', href: 'course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/hybridization.html' });
*/
</script>
