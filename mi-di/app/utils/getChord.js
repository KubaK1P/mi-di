export const getChord = (activeNotesMod12, activeNotesArray, noteLetters) => {
  if (activeNotesMod12.length === 0) return "N/C"; // No notes played

  let slashNote = noteLetters[activeNotesArray[0] % 12]; // Bass note
  let rootNote = activeNotesMod12[0]; // Default to first note as root
  let intervals = new Set();

  // Calculate intervals from each note assuming it is the root
  let possibleRoots = activeNotesMod12.map(root => ({
    root,
    intervals: activeNotesMod12.map(note => (note - root + 12) % 12),
  }));

  // Sort roots by common chord structures (favor triads, sevenths, etc.)
  possibleRoots.sort((a, b) => {
    const triadA = a.intervals.filter(i => [3, 4, 7].includes(i)).length;
    const triadB = b.intervals.filter(i => [3, 4, 7].includes(i)).length;
    return triadB - triadA; // Prefer roots with more triadic structure
  });

  rootNote = possibleRoots[0].root;
  intervals = new Set(possibleRoots[0].intervals);

  let rootName = noteLetters[rootNote];
  let chordQuality = "";

  // Determine chord quality
  if (intervals.has(4) && intervals.has(7)) {
    chordQuality = ""; // Major
  } else if (intervals.has(3) && intervals.has(7)) {
    chordQuality = "m"; // Minor
  } else if (intervals.has(3) && intervals.has(6)) {
    chordQuality = "dim"; // Diminished
  } else if (intervals.has(4) && intervals.has(8)) {
    chordQuality = "aug"; // Augmented
  } else if (intervals.has(5) && intervals.has(7)) {
    chordQuality = "sus4"; // Suspended 4
  } else if (intervals.has(2) && intervals.has(7)) {
    chordQuality = "sus2"; // Suspended 2
  }

  // Add sixths and sevenths
  let has6 = intervals.has(9);
  let has7 = intervals.has(10);
  let hasMaj7 = intervals.has(11);

  if (has6 && !has7 && !hasMaj7) {
    chordQuality += "6"; // Major or Minor 6
  } else if (has7) {
    chordQuality += "7"; // Dominant 7
  } else if (hasMaj7) {
    chordQuality += "maj7"; // Major 7
  }

  // Add extensions and color notes
  let extensions = [];
  if (intervals.has(2) && !chordQuality.includes("sus2")) extensions.push("add9");
  if (intervals.has(5) && !chordQuality.includes("sus4")) extensions.push("add4");
  if (intervals.has(1)) extensions.push("#9");
  if (intervals.has(6)) extensions.push("b13");
  if (intervals.has(8)) extensions.push("#5");
  if (intervals.has(11) && !chordQuality.includes("maj7")) extensions.push("11");

  // Final chord name formatting
  let chordName = rootName + chordQuality + (extensions.length ? "(" + extensions.join("") + ")" : "");
  if (slashNote !== rootName) {
    chordName += ` / ${slashNote}`;
  }

  return chordName;
};


