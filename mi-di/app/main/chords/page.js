"use client"
import { useEffect, useState, useRef } from "react";
import Popup from "@/app/components/Popup/Popup";
import * as Tone from "tone";
import { useMemo } from "react";

export default function Chords() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [midiInputs, setMidiInputs] = useState([]);
  const [accidental, setAccidental] = useState("_")
  const synthRef = useRef(null);
  const [envel, setEnvel] = useState({
    "attack": 0.10,
    "decay": 0.30,
    "sustain": 1.00,
    "release": 1.00
  });
  const noteLetters = useMemo(() => {
    switch (accidental) {
      case "b":
        return {
          "0": "C", "1": "Db", "2": "D", "3": "Eb", "4": "E", "5": "F", "6": "Gb", "7": "G", "8": "Ab", "9": "A", "10": "B", "11": "H"
        };
      case "#":
        return {
          "0": "C", "1": "C#", "2": "D", "3": "D#", "4": "E", "5": "F", "6": "F#", "7": "G", "8": "G#", "9": "A", "10": "A#", "11": "B"
        };
      default:
        return {
          "0": "C", "1": "C#/Db", "2": "D", "3": "D#/Eb", "4": "E", "5": "F", "6": "F#/Gb", "7": "G", "8": "G#/Ab", "9": "A", "10": "A#/B", "11": "B"
        };
    }
  }, [accidental]);

  const activeNotesArray = useMemo(() => 
    Array.from(activeNotes).sort((a, b) => a - b), 
    [activeNotes]
  );

  const activeNotesModulo12 = useMemo(() => 
    Array.from(new Set(
      activeNotesArray
        .map(note => note % 12)
    ))
    .sort((a, b) => a - b),  
    [activeNotesArray]
  );
  const getChord = (activeNotesMod12, activeNotesArray) => {
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
  
  const detectedChord = useMemo(() => getChord(activeNotesModulo12, activeNotesArray), [activeNotesModulo12, activeNotesArray]);
  

  
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.AMSynth).toDestination();
    Tone.context.lookAhead = 0;
    return () => {
      synthRef.current.dispose(); 
    };
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((midi) => {
          setMidiAccess(midi);
          updateMidiInputs(midi);
          midi.onstatechange = () => updateMidiInputs(midi);
          for (let input of midi.inputs.values()) {
            if (!input.onmidimessage) {  
              input.onmidimessage = handleMidiMessage;
            }
          }
        })
        .catch((err) => console.error("MIDI access failed", err));
    }
  }, []);

  const updateMidiInputs = (midi) => {
    const inputs = Array.from(midi.inputs.values()).map((input) => ({
      id: input.id,
      name: input.name,
    }));
    setMidiInputs(inputs);
  };

  const handleMidiMessage = (message) => {
    const [command, note, velocity] = message.data;
    let type = "Unknown";

    if (command >= 144 && command < 160) {
      type = velocity > 0 ? "Note On" : "Note Off";
    } else if (command >= 128 && command < 144) {
      type = "Note Off";
    }

    setActiveNotes((prevNotes) => {
      const newNotes = new Set(prevNotes);
      if (type === "Note On") {
        synthRef.current.triggerAttack(Tone.Frequency(note, "midi").toNote()); 
        newNotes.add(note);
      } else if (type === "Note Off") {
        synthRef.current.triggerRelease(Tone.Frequency(note, "midi").toNote()); 
        newNotes.delete(note);
      }
      return newNotes;
    });

    const newMessage = {
      type,
      note,
      velocity,
      timestamp: message.timeStamp.toFixed(2),
    };

    setMessages((prev) => [...prev.slice(-9), newMessage]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnvel((prev) => ({
      ...prev,
      [name]: parseFloat(value)
    }));
    if (synthRef?.current) {
        synthRef.current.set({
            envelope: {
                [name]: parseFloat(value),
            },
        });
    }
};

  return (
    <div className="pt-[96px] h-[100svh] relative">
      <div>
        <h1 className="absolute top-[137px] left-[40px] chords font-bold text-7xl tracking-widest">
          Mi-di Chords: {detectedChord}
        </h1>
      </div>
      <div className="transition-all absolute bottom-[40px] left-[50%] transform -translate-x-1/2">
        <ul className="flex gap-6 bg-main p-4 rounded-lg text-lighter text-xl font-semibold">
          {(activeNotesArray.length)?
          activeNotesArray.map((note) => (
            <li key={note}>{noteLetters[note % 12]}{Math.floor(note / 12) - 1}</li>
          )):(<li>##</li>)}
        </ul>
      </div>
      <div
        className={`absolute left-[40px] bottom-[40px] rounded-lg w-[25px] h-[25px] ${
          activeNotes.size > 0 ? "bg-accent" : "bg-main"
        }`}
      ></div>
              <div className="absolute bottom-[40px] right-[40px] bg-main text-lighter-children p-4 rounded-lg z-998">
            <h3 className="text-3xl font-semibold">Envelope Generator</h3>
            <form>
                {["attack", "decay", "sustain", "release"].map((param) => (
                    <div key={param} className="flex justify-between items-center gap-4 p-2">
                        <label htmlFor={param}>{param.charAt(0).toUpperCase() + param.slice(1)}: {envel[param].toFixed(2)}</label>
                        <input
                            type="range"
                            id={param}
                            name={param}
                            min="0"
                            max={(param === "sustain")? "1" : "5"}
                            step="0.01"
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <h4 className="text-2xl font-semibold" htmlFor="accidentals">
                  b/# : 
                </h4>

                <div className="flex gap-4 items-center">
                  <input className="" type="radio" value="b" name="accidentals" id="accidentalsb"onChange={() => setAccidental("b")}></input>
                  <label htmlFor="accidentalsb" className="font-semibold text-xl">b</label>
                  <input className="" type="radio" value="#" name="accidentals" id="accidentals#"onChange={() => setAccidental("#")}></input>
                  <label htmlFor="accidentals#" className="font-semibold text-xl">#</label>
                  <input className="" type="radio" value="_" name="accidentals" id="accidentals_"onChange={() => setAccidental("_")}></input>
                  <label htmlFor="accidentals_" className="font-semibold text-xl">b/#</label>
                </div>
            </form>
        </div>
        <Popup></Popup>
    </div>
  );
}