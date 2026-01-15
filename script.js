// Shared UI functions and notes database for PMG portal
(function(){
  /* ===== Notes database (editable) =====
     Each course key maps to { title, items: [string | {title, href}] }
     Add or edit entries to populate showNotes behavior.
  */
  const notesDB = {
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
    CH110: {
      title: "CH110 – Chemistry Notes",
      items: [
        "Atomic Structure & Periodic Trends",
        "Chemical Bonding",
        "Stoichiometry",
        "States of Matter"
      ]
    },
    CH260: {
      title: "CH260 – Organic Chemistry Notes",
      items: [
        { title: "Structure and Bonding", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/structure.html" },
        { title: "Hybridization", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/hybridization.html" },
        { title: "Inductive Effect", href: "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260/notes/inductive.html" }
      ]
    }
  };

  /* ===== Utility helpers ===== */
  function safeId(id){ return String(id || '').replace(/\s+/g,'').replace(/[^\w\-]/g,''); }

  function openPaper(url){
    const viewer = document.getElementById('viewer');
    const frame = document.getElementById('viewerFrame');
    if(!frame) return window.open(url, '_blank');
    frame.src = url;
    viewer.style.display = 'block';
    frame.focus();
  }

  function renderPill(text, onClick){
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
  }

  /* ===== showYears: populate a container with year pills
     containerId: DOM id where pills will be appended
     basePath: path to course folder that contains tests (e.g., "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260")
     years: array of years or default [2019..2024]
  */
  function showYears(containerId, basePath, years){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    const list = years && years.length ? years : [2019,2020,2021,2022,2023,2024];
    list.forEach(y=>{
      const pill = renderPill(y, ()=> openPaper(`${basePath}/tests/${basePath.split('/').pop()}-${y}.pdf`));
      container.appendChild(pill);
    });
  }

  /* ===== showNotes: populate a container with topic pills from notesDB
     containerId: DOM id where notes will be shown
     courseKey: key used in notesDB (e.g., "CH260")
  */
  function showNotes(containerId, courseKey){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    const entry = notesDB[courseKey];
    if(!entry){
      container.innerHTML = '<p class="small">Notes not available yet for this course.</p>';
      return;
    }
    const title = document.createElement('h3');
    title.textContent = entry.title;
    container.appendChild(title);

    const topicsDiv = document.createElement('div');
    topicsDiv.className = 'topics';
    (entry.items || []).forEach(item=>{
      if(typeof item === 'string'){
        const pill = renderPill(item, ()=>{ /* no link */ });
        topicsDiv.appendChild(pill);
      } else if(item && item.title){
        const pill = renderPill(item.title, ()=> openPaper(item.href));
        topicsDiv.appendChild(pill);
      }
    });
    container.appendChild(topicsDiv);
  }

  /* ===== initCourse: helper to initialize a course page
     courseId: short id like "CH260"
     basePath: full path to course folder (no trailing slash)
     opts: { years: [...], topics: [...] } optional
     Expected DOM ids on course page:
       - `${courseId}-years` (container for year pills)
       - `${courseId}-notes` (container for notes/topics)
  */
  function initCourse(courseId, basePath, opts){
    const yearsId = `${courseId}-years`;
    const notesId = `${courseId}-notes`;
    if(document.getElementById(yearsId)) showYears(yearsId, basePath, (opts && opts.years) || undefined);
    if(document.getElementById(notesId)) showNotes(notesId, courseId);
  }

  /* ===== Expose functions globally ===== */
  window.openPaper = openPaper;
  window.showYears = showYears;
  window.showNotes = showNotes;
  window.initCourse = initCourse;
  window.notesDB = notesDB;

})();
