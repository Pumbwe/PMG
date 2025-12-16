const notes = {
    MA110: "MA110 Notes: Algebra, Calculus, Functions...",
    PH110: "PH110 Notes: Mechanics, Optics, Electricity...",
    LA111: "LA111 Notes: English grammar, Essay writing...",
    CH110: "CH110 Notes: Atomic structure, Chemical bonding..."
};

function showNotes(subject) {
    document.getElementById('notes').innerText = notes[subject];
}