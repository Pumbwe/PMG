// Shared UI functions and manifest-driven portal for PMG
(function(){
  const MANIFEST = 'course_manifest.json';
  const DEFAULT_MANIFEST = {
    "groups": [
      {
        "title": "INDUSTRIAL CHEMISTRY SECOND YEAR",
        "courses": [
          { "code": "CH260", "title": "CH260 — Organic Chemistry", "path": "course/INDUSTRIAL CHEMISTRY SECOND YEAR/CH260.html" },
          { "code": "AnalyticalChem", "title": "Analytical Chemistry", "path": "course/INDUSTRIAL CHEMISTRY SECOND YEAR/AnalyticalChem.html" },
          { "code": "IndustrialChem", "title": "Industrial Chemistry", "path": "course/INDUSTRIAL CHEMISTRY SECOND YEAR/IndustrialChem.html" },
          { "code": "IndustrialPhys", "title": "Industrial Physics", "path": "course/INDUSTRIAL CHEMISTRY SECOND YEAR/IndustrialPhys.html" },
          { "code": "IndustrialMath", "title": "Industrial Mathematics", "path": "course/INDUSTRIAL CHEMISTRY SECOND YEAR/IndustrialMath.html" },
          { "code": "MA210", "title": "MA210 — Mathematics (Industrial)", "path": "course/INDUSTRIAL CHEMISTRY SECOND YEAR/MA210.html" }
        ]
      },
      {
        "title": "FIRST YEAR NQ",
        "courses": [
          { "code": "CH110", "title": "CH110 — Chemistry", "path": "course/FIRST YEAR NQ/CH110.html" },
          { "code": "PH110", "title": "PH110 — Physics", "path": "course/FIRST YEAR NQ/PH110.html" },
          { "code": "BI10", "title": "BI10 — Biology", "path": "course/FIRST YEAR NQ/BI10.html" },
          { "code": "CS110", "title": "CS110 — Computer Studies", "path": "course/FIRST YEAR NQ/CS110.html" },
          { "code": "MA110", "title": "MA110 — Mathematics", "path": "course/FIRST YEAR NQ/MA110.html" }
        ]
      }
    ]
  };

  const notesDB = {
    MA110: { title: "MA110 – Mathematics Notes", items: ["Algebra: Linear equations, Quadratics, Polynomials","Functions: Types, Domain & Range, Composition","Trigonometry: Identities, Equations, Graphs","Sequences & Series: AP, GP","Calculus: Limits, Differentiation, Integration"] },
    PH110: { title: "PH110 – Physics Notes", items: ["Mechanics: Newton’s Laws, Kinematics","Work, Energy & Power","Waves & Oscillations","Optics: Reflection, Refraction","Electricity: Ohm’s Law, Circuits"] },
    CH110: { title: "CH110 – Chemistry Notes", items: ["Atomic Structure & Periodic Trends","Chemical Bonding","Stoichiometry","States of Matter"] },
    CH260: { title: "CH260 – Organic Chemistry Notes", items: ["Structure and Bonding","Hybridization","Inductive Effect"] }
  };

  function safeId(s){ return String(s||'').replace(/\s+/g,'_').replace(/[^\w\-]/g,''); }

  async function loadManifest(force=false){
    const status = document.getElementById('status');
    status.textContent = 'Loading courses...';
    let manifest;
    try{
      const r = await fetch(MANIFEST, {cache:'no-store'});
      if(!r.ok) throw new Error('manifest not found');
      manifest = await r.json();
    }catch(e){
      manifest = DEFAULT_MANIFEST;
    }
    renderGroups(manifest.groups || []);
    status.textContent = '';
  }

  function renderGroups(groups){
    const container = document.getElementById('groups');
    container.innerHTML = '';
    groups.forEach(group=>{
      const col = document.createElement('div');
      col.className = 'card';
      const h = document.createElement('h2');
      h.textContent = group.title;
      col.appendChild(h);

      const list = document.createElement('div');
      list.className = 'course-list';
      (group.courses || []).forEach(course=>{
        const a = document.createElement('a');
        a.className = 'course-item';
        a.href = course.path;
        a.onclick = (ev)=> { ev.preventDefault(); openCourse(course); };
        a.innerHTML = `<span><strong>${course.code}</strong> — ${course.title.replace(/^.*—\s*/,'')}</span><span class="meta">Open →</span>`;
        list.appendChild(a);
      });

      col.appendChild(list);
      container.appendChild(col);
    });
    window._pmg_current_groups = groups;
  }

  function openCourse(course){
    window.location.href = course.path;
  }

  function filterCourses(q){
    q = String(q||'').trim().toLowerCase();
    const groups = window._pmg_current_groups || [];
    const container = document.getElementById('groups');
    container.innerHTML = '';
    groups.forEach(group=>{
      const matches = (group.courses || []).filter(c=>{
        return c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || group.title.toLowerCase().includes(q);
      });
      if(matches.length){
        const col = document.createElement('div');
        col.className = 'card';
        const h = document.createElement('h2');
        h.textContent = group.title;
        col.appendChild(h);
        const list = document.createElement('div');
        list.className = 'course-list';
        matches.forEach(course=>{
          const a = document.createElement('a');
          a.className = 'course-item';
          a.href = course.path;
          a.onclick = (ev)=> { ev.preventDefault(); openCourse(course); };
          a.innerHTML = `<span><strong>${course.code}</strong> — ${course.title.replace(/^.*—\s*/,'')}</span><span class="meta">Open →</span>`;
          list.appendChild(a);
        });
        col.appendChild(list);
        container.appendChild(col);
      }
    });
  }

  function showNotes(code){
    const key = String(code||'').replace(/\s+/g,'').toUpperCase();
    const entry = notesDBLookup(key);
    const notesSection = document.getElementById('notesSection');
    const notesTitle = document.getElementById('notesTitle');
    const notesContent = document.getElementById('notesContent');
    if(!notesSection || !notesTitle || !notesContent) return;
    notesTitle.innerHTML = `<span style="font-weight:800;color:var(--gold)">${entry ? entry.title : 'Notes Not Available'}</span><button class="close-btn" onclick="closeNotes()" style="background:#0b1220;color:var(--gold);border-radius:8px;padding:6px 10px;border:1px solid rgba(255,215,0,0.08);">Close</button>`;
    if(!entry){
      notesContent.innerHTML = `<p class="pmg-note-empty">Notes for ${escapeHtml(code)} are coming soon.</p>`;
    } else {
      notesContent.innerHTML = `<ul>${entry.items.map(i=>`<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
    }
    notesSection.classList.remove('hidden');
    notesSection.scrollIntoView({behavior:'smooth'});
  }

  function closeNotes(){
    const notesSection = document.getElementById('notesSection');
    if(notesSection) notesSection.classList.add('hidden');
  }

  function notesDBLookup(k){
    if(!k) return null;
    if(notesDB[k]) return notesDB[k];
    for(const kk of Object.keys(notesDB)) if(kk.toUpperCase() === k) return notesDB[kk];
    return null;
  }

  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  window.loadManifest = loadManifest;
  window.filterCourses = filterCourses;
  window.showNotes = showNotes;
  window.closeNotes = closeNotes;

  window.addEventListener('DOMContentLoaded', ()=> loadManifest(false));
})();
