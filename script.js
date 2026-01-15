<script>
/* Legendary Notes UI — gold, blue, black theme
   This script preserves your original notes data and upgrades the UI:
   - Injects compact theme styles (gold, blue, black)
   - Normalizes subject keys (spaces/case)
   - Supports plain text items and linked items {title, href}
   - Renders a polished notes panel with close button and subtle animation
   - Safe DOM checks and HTML escaping
*/

/* ===== NOTES DATABASE (unchanged content, extendable) ===== */
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

/* ===== Inject compact theme styles (gold, blue, black) ===== */
(function injectLegendStyles(){
  if(document.getElementById('pmg-legend-styles')) return;
  const css = `
    /* PMG Legendary Notes Theme */
    #notesSection { background:#0f0f1a; border:1px solid rgba(255,215,0,0.08); color:#fdfcf6; padding:18px; border-radius:12px; box-shadow:0 18px 40px rgba(0,0,0,0.6); max-width:900px; margin:12px auto; font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
    #notesTitle { color:#FFD700; font-family:'Playfair Display', serif; font-size:1.25rem; display:flex; justify-content:space-between; align-items:center; gap:12px; }
    #notesTitle .close-btn { background:#0b1220; color:#FFD700; border:1px solid rgba(255,215,0,0.12); padding:6px 10px; border-radius:10px; cursor:pointer; font-weight:700; }
    #notesContent ul { padding-left:18px; margin:12px 0 0 0; }
    #notesContent li { margin:10px 0; line-height:1.45; }
    .pmg-note-link { color:#2b9cff; text-decoration:underline; cursor:pointer; }
    .pmg-pill { display:inline-block; background:#0b1220; color:#fdfcf6; border:1px solid rgba(255,255,255,0.03); padding:6px 10px; border-radius:999px; margin:6px 6px 0 0; font-weight:700; cursor:pointer; }
    .pmg-legend-anim { animation:pmgFadeIn .28s ease both; }
    @keyframes pmgFadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
    .pmg-note-empty { color:#9aa4b2; font-style:italic; }
  `;
  const s = document.createElement('style');
  s.id = 'pmg-legend-styles';
  s.appendChild(document.createTextNode(css));
  document.head && document.head.appendChild(s);
})();

/* ===== Utilities ===== */
function normalizeKey(key){
  if(key === undefined || key === null) return '';
  return String(key).replace(/\s+/g,'').replace(/[^A-Za-z0-9]/g,'').toUpperCase();
}
function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

/* ===== Find note entry flexibly ===== */
function findNoteEntry(subject){
  const k = normalizeKey(subject);
  if(!k) return null;
  // direct match
  if(notes[k]) return notes[k];
  // scan keys
  for(const orig of Object.keys(notes)){
    if(normalizeKey(orig) === k) return notes[orig];
  }
  return null;
}

/* ===== Render a single note item (string or {title, href}) ===== */
function renderNoteItem(item){
  if(!item) return '';
  if(typeof item === 'string'){
    return `<li class="pmg-legend-anim">${escapeHtml(item)}</li>`;
  }
  if(typeof item === 'object' && item.title){
    const t = escapeHtml(item.title);
    if(item.href){
      const href = escapeHtml(item.href);
      return `<li class="pmg-legend-anim"><a class="pmg-note-link" href="${href}" target="_blank" rel="noopener noreferrer">${t}</a></li>`;
    }
    return `<li class="pmg-legend-anim">${t}</li>`;
  }
  return '';
}

/* ===== SHOW NOTES (legendary rendering) =====
   Expects these DOM elements to exist:
     - #notesSection
     - #notesTitle
     - #notesContent
*/
function showNotes(subject){
  const notesSection = document.getElementById("notesSection");
  const notesTitle = document.getElementById("notesTitle");
  const notesContent = document.getElementById("notesContent");

  if(!notesSection || !notesTitle || !notesContent){
    console.warn("PMG: Missing notes UI elements (#notesSection, #notesTitle, #notesContent).");
    return;
  }

  // Clear previous
  notesTitle.innerHTML = '';
  notesContent.innerHTML = '';

  const entry = findNoteEntry(subject);

  // Title area with close button
  const titleText = entry && entry.title ? escapeHtml(entry.title) : "Notes Not Available";
  const titleSpan = document.createElement('span');
  titleSpan.textContent = titleText;
  titleSpan.style.fontWeight = '800';
  titleSpan.style.letterSpacing = '0.2px';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = 'Close';
  closeBtn.onclick = closeNotes;

  notesTitle.appendChild(titleSpan);
  notesTitle.appendChild(closeBtn);

  if(!entry){
    notesContent.innerHTML = `<p class="pmg-note-empty">Notes for this subject are coming soon. You can add them as plain text or link to full HTML notes.</p>`;
    notesSection.classList.remove("hidden");
    notesSection.classList.add('pmg-legend-anim');
    return;
  }

  // Build list (supports strings and linked objects)
  const listHtml = (entry.items || []).map(renderNoteItem).join('');
  notesContent.innerHTML = `<ul>${listHtml}</ul>`;

  // If there are linked items, also show quick pill shortcuts
  const linked = (entry.items || []).filter(i => typeof i === 'object' && i.href);
  if(linked.length){
    const pills = document.createElement('div');
    pills.style.marginTop = '12px';
    linked.forEach(it => {
      const p = document.createElement('button');
      p.className = 'pmg-pill';
      p.textContent = it.title || 'Open';
      p.onclick = ()=> window.open(it.href, '_blank');
      pills.appendChild(p);
    });
    notesContent.appendChild(pills);
  }

  // Reveal section with animation
  notesSection.classList.remove("hidden");
  notesSection.classList.add('pmg-legend-anim');
  // focus for accessibility
  notesSection.setAttribute('tabindex','-1');
  notesSection.focus({preventScroll:true});
}

/* ===== CLOSE NOTES ===== */
function closeNotes(){
  const notesSection = document.getElementById("notesSection");
  if(!notesSection) return;
  notesSection.classList.add("hidden");
}

/* ===== Expose globally for inline handlers ===== */
window.showNotes = showNotes;
window.closeNotes = closeNotes;

/* ===== Example: how to add a linked note dynamically (uncomment to use)
notes['CH260'] = notes['CH260'] || { title: 'CH260 – Organic Chemistry', items: [] };
notes['CH260'].items.push({ title: 'Hybridization', href: 'course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/hybridization.html' });
*/
</script>
