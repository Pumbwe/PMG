
<!-- Add this where you want notes to appear -->
<div id="notesSection" class="section hidden">
  <h3 id="notesTitle"></h3>
  <div id="notesContent"></div>
</div>

<script>
// All notes stored as arrays (can add more content easily)
const notes = {
  MA110: [
    "Algebra: Linear equations, Quadratics, Polynomials",
    "Calculus: Limits, Differentiation, Integration",
    "Functions: Types, Domain & Range, Composition"
  ],
  PH110: [
    "Mechanics: Newton's Laws, Kinematics, Work & Energy",
    "Optics: Reflection, Refraction, Lenses",
    "Electricity: Ohm's Law, Circuits, Capacitance"
  ],
  LA111: [
    "English Grammar: Parts of speech, Tenses, Sentence structure",
    "Essay Writing: Structure, Thesis, Cohesion"
  ],
  CH110: [
    "Atomic Structure: Electron configuration, Quantum numbers",
    "Chemical Bonding: Ionic, Covalent, Metallic, Lewis structures"
  ]
};

// Function to show notes dynamically
function showNotes(subject) {
  const notesTitle = document.getElementById('notesTitle');
  const notesContent = document.getElementById('notesContent');
  const notesSection = document.getElementById('notesSection');

  if (!notes[subject]) {
    notesTitle.innerText = "No Notes Found";
    notesContent.innerHTML = "<p>Notes for this subject are not available yet.</p>";
  } else {
    notesTitle.innerText = `${subject} Notes`;
    // Convert array to HTML list
    const htmlList = notes[subject].map(item => `<li>${item}</li>`).join('');
    notesContent.innerHTML = `<ul>${htmlList}</ul>`;
  }

  // Show the notes section
  notesSection.classList.remove('hidden');
}
</script>
