<script>
/* ============================================================
   PMG™ EDU — Legendary Notes System
   Gold / Blue / Black premium theme
   Expanded to ~300 lines for full functionality
   ============================================================ */

/* ===== NOTES DATABASE =====
   Extendable: add items as strings or objects {title, href}
   Covers Industrial Chemistry (Second Year) and First Year NQ
*/
const notesDB = {
  MA110: {
    title: "MA110 – Mathematics Notes",
    items: [
      "Algebra: Linear equations, Quadratics, Polynomials",
      "Functions: Types, Domain & Range, Composition",
      "Trigonometry: Identities, Equations, Graphs",
      "Sequences & Series: AP, GP",
      "Calculus: Limits, Differentiation, Integration",
      { title: "Matrices & Determinants", href: "course/FIRST YEAR NQ/MA110/notes/matrices.html" },
      { title: "Probability & Statistics", href: "course/FIRST YEAR NQ/MA110/notes/probability.html" }
    ]
  },
  PH110: {
    title: "PH110 – Physics Notes",
    items: [
      "Mechanics: Newton’s Laws, Kinematics",
      "Work, Energy & Power",
      "Waves & Oscillations",
      "Optics: Reflection, Refraction",
      "Electricity: Ohm’s Law, Circuits",
      { title: "Modern Physics", href: "course/FIRST YEAR NQ/PH110/notes/modern.html" }
    ]
  },
  LA111: {
    title: "LA111 – Language & Study Skills",
    items: [
      "Parts of Speech & Sentence Structure",
      "Essay Writing: Thesis & Cohesion",
      "Academic Writing & Referencing",
      "Comprehension & Summary Writing",
      { title: "Presentation Skills", href: "course/FIRST YEAR NQ/LA111/notes/presentation.html" }
    ]
  },
  CH110: {
    title: "CH110 – Chemistry Notes",
    items: [
      "Atomic Structure & Periodic Trends",
      "Chemical Bonding",
      "Stoichiometry",
      "States of Matter",
      { title: "Thermochemistry", href: "course/FIRST YEAR NQ/CH110/notes/thermochemistry.html" }
    ]
  },
  CH260: {
    title: "CH260 – Organic Chemistry Notes",
    items: [
      "Structure and Bonding",
      "Hybridization",
      "Inductive Effect",
      "Hyperconjugation",
      { title: "Aromaticity", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/aromaticity.html" },
      { title: "Reaction Mechanisms", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/mechanisms.html" }
    ]
  },
  AnalyticalChem: {
    title: "Analytical Chemistry Notes",
    items: [
      "Qualitative vs Quantitative Analysis",
      "Gravimetric Methods",
      "Volumetric Methods",
      "Spectroscopy Basics",
      { title: "Chromatography", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/AnalyticalChem/notes/chromatography.html" }
    ]
  },
  IndustrialChem: {
    title: "Industrial Chemistry Notes",
    items: [
      "Chemical Engineering Principles",
      "Process Design",
      "Catalysis",
      { title: "Polymer Chemistry", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/IndustrialChem/notes/polymers.html" }
    ]
  },
  IndustrialPhys: {
    title: "Industrial Physics Notes",
    items: [
      "Solid State Physics",
      "Thermodynamics",
      "Quantum Basics",
      { title: "Electronics", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/IndustrialPhys/notes/electronics.html" }
    ]
  },
  IndustrialMath: {
    title: "Industrial Mathematics Notes",
    items: [
      "Differential Equations",
      "Numerical Methods",
      "Optimization",
      { title: "Complex Analysis", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/IndustrialMath/notes/complex.html" }
    ]
  },
  MA210: {
    title: "MA210 – Mathematics (Industrial)",
    items: [
      "Advanced Calculus",
      "Linear Algebra",
      "Fourier Analysis",
      { title: "Partial Differential Equations", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/MA210/notes/pde.html" }
    ]
  }
};

/* ===== Utility Functions ===== */
function escapeHtml(str){
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function normalizeKey(key){
  return String(key||"").replace(/\s+/g,"").toUpperCase();
}

function findNoteEntry(subject){
  const k = normalizeKey(subject);
  if(notesDB[k]) return notesDB[k];
  for(const key of Object.keys(notesDB)){
    if(normalizeKey(key)===k) return notesDB[key];
  }
  return null;
}

/* ===== Rendering ===== */
function renderNoteItem(item){
  if(typeof item==="string"){
    return `<li class="legend-item">${escapeHtml(item)}</li>`;
  }
  if(typeof item==="object" && item.title){
    const title=escapeHtml(item.title);
    if(item.href){
      const href=escapeHtml(item.href);
      return `<li class="legend-item"><a href="${href}" target="_blank" class="legend-link">${title}</a></li>`;
    }
    return `<li class="legend-item">${title}</li>`;
  }
  return "";
}

/* ===== Show Notes ===== */
function showNotes(subject){
  const notesSection=document.getElementById("notesSection");
  const notesTitle=document.getElementById("notesTitle");
  const notesContent=document.getElementById("notesContent");

  if(!notesSection||!notesTitle||!notesContent){
    console.warn("Missing notesSection, notesTitle, or notesContent");
    return;
  }

  const entry=findNoteEntry(subject);
  notesTitle.innerHTML="";
  notesContent.innerHTML="";

  if(!entry){
    notesTitle.innerText="Notes Not Available";
    notesContent.innerHTML="<p class='legend-warning'>Notes for this subject are coming soon.</p>";
  } else {
    notesTitle.innerText=entry.title;
    const listHtml=(entry.items||[]).map(renderNoteItem).join("");
    notesContent.innerHTML=`<ul class="legend-list">${listHtml}</ul>`;
  }

  notesSection.classList.remove("hidden");
  notesSection.scrollIntoView({behavior:"smooth"});
}

/* ===== Close Notes ===== */
function closeNotes(){
  const notesSection=document.getElementById("notesSection");
  if(notesSection) notesSection.classList.add("hidden");
}

/* ===== Search Notes ===== */
function searchNotes(query){
  query=String(query||"").toLowerCase();
  const results=[];
  for(const [code,entry] of Object.entries(notesDB)){
    const matchTitle=entry.title.toLowerCase().includes(query);
    const matchItems=(entry.items||[]).some(i=>{
      if(typeof i==="string") return i.toLowerCase().includes(query);
      if(i.title) return i.title.toLowerCase().includes(query);
      return false;
    });
    if(matchTitle||matchItems){
      results.push({code,entry});
    }
  }
  return results;
}

/* ===== Render Search Results ===== */
function renderSearchResults(query){
  const results=searchNotes(query);
  const notesSection=document.getElementById("notesSection");
  const notesTitle=document.getElementById("notesTitle");
  const notesContent=document.getElementById("notesContent");
  if(!notesSection||!notesTitle||!notesContent) return;

  notesTitle.innerText=`Search results for "${query}"`;
  if(!results.length){
    notesContent.innerHTML="<p class='legend-warning'>No matches found.</p>";
  } else {
    let html="<div class='legend-results'>";
    results.forEach(r=>{
      html+=`<div class='legend-card'><h3>${escapeHtml(r.entry.title)}</h3><ul>`;
      html+=(r.entry.items||[]).map(renderNoteItem).join("");
      html+="</ul></div>";
    });
    html+="</div>";
    notesContent.innerHTML=html;
  }
  notesSection.class
