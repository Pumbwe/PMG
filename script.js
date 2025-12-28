<script>
// NOTES DATABASE (TEXT BASED FOR NOW – CAN LINK HTML LATER)
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

// SHOW NOTES
function showNotes(subject) {
  const notesSection = document.getElementById("notesSection");
  const notesTitle = document.getElementById("notesTitle");
  const notesContent = document.getElementById("notesContent");

  if (!notes[subject]) {
    notesTitle.innerText = "Notes Not Available";
    notesContent.innerHTML =
      "<p style='color:#f87171;'>Notes for this subject are coming soon.</p>";
  } else {
    notesTitle.innerText = notes[subject].title;

    const list = notes[subject].items
      .map(item => `<li style="margin:8px 0;">${item}</li>`)
      .join("");

    notesContent.innerHTML = `<ul style="text-align:left;">${list}</ul>`;
  }

  notesSection.classList.remove("hidden");
}
</script>
