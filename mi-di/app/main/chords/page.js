"use client"
import { useEffect, useState, useRef } from "react";
import Popup from "@/app/components/Popup/Popup";
import * as Tone from "tone";
import { useMemo } from "react";
import ADSR_Editor from "@/app/components/ADSR_Editor/ADSR_Editor";
import note_names from "./note_names.json"

export default function Chords() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [midiInputs, setMidiInputs] = useState([]);
  const [accidental, setAccidental] = useState("_")
  const [synth, setSynth] = useState(null);
  const [analyser, setAnalyser] = useState(null)
  const canvasRef = useRef(null);
  const noteLetters = useMemo(() => {
    return note_names[accidental]
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
    const new_synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
    const new_analyser = new Tone.Analyser("fft", 2048);
    new_synth.connect(new_analyser);

    setSynth(new_synth)
    setAnalyser(new_analyser)

    Tone.context.lookAhead = 0;

    if (typeof navigator !== "undefined" && navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((midi) => {
          setMidiAccess(midi);
          updateMidiInputs(midi);
          midi.onstatechange = () => updateMidiInputs(midi);
          for (let input of midi.inputs.values()) {
            input.onmidimessage = (m) => handleMidiMessage(m, new_synth);
          }
        })
        .catch((err) => console.error("MIDI access failed", err));
    }

    return () => {
      new_synth.dispose();
      new_analyser.dispose();
    };
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;
    const draw = () => {
      if (analyser) {
        const spectrum = analyser.getValue();
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = "black"; // reset background
        ctx.fillRect(0, 0, width, height);

        const minFreq = 20;
        const maxFreq = 2000;

        spectrum.forEach((value, i) => {
          const freq = (i * Tone.context.sampleRate) / (2 * spectrum.length);

          if (freq >= minFreq && freq <= maxFreq) {
            const normX = (freq - minFreq) / (maxFreq - minFreq);
            const x = normX * width;

            const magnitude = Math.max(0, (value + 100) / 100);
            const barHeight = magnitude * height;

            ctx.fillStyle = "limegreen";
            ctx.fillRect(x, height - barHeight, 2, barHeight);
          }
        });
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
    }
  }, [])

  const updateMidiInputs = (midi) => {
    const inputs = Array.from(midi.inputs.values()).map((input) => ({
      id: input.id,
      name: input.name,
    }));
    setMidiInputs(inputs);
  };

  const handleMidiMessage = (message, synth) => {
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
        synth.triggerAttack(Tone.Frequency(note, "midi").toNote());
        newNotes.add(note);
      } else if (type === "Note Off") {
        synth.triggerRelease(Tone.Frequency(note, "midi").toNote());
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

  return (
    <div className="pt-[96px] h-[100svh] relative">
      <div>
        <h1 className="absolute top-[137px] left-[40px] chords font-bold text-7xl tracking-widest">
          Mi-di Chords: {detectedChord}
        </h1>
      </div>
      <div className="absolute top-[30%] left-[40px] transform">
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          className="bg-black rounded-lg shadow-lg"
        />
      </div>
      <div className="transition-all absolute bottom-[40px] left-[50%] transform -translate-x-1/2">
        <ul className="flex gap-6 bg-main p-4 rounded-lg text-lighter text-xl font-semibold">
          {(activeNotesArray.length) ?
            activeNotesArray.map((note) => (
              <li key={note}>{noteLetters[note % 12]}{Math.floor(note / 12) - 1}</li>
            )) : (<li>##</li>)}
        </ul>
      </div>
      <div
        className={`absolute left-[40px] bottom-[40px] rounded-lg w-[25px] h-[25px] ${activeNotes.size > 0 ? "bg-accent" : "bg-main"
          }`}
      ></div>
      <div className="absolute bottom-[40px] right-[40px] bg-main text-lighter-children p-4 rounded-lg z-998">
        <h3 className="text-3xl font-semibold">Envelope Generator</h3>
        <form>
          <ADSR_Editor synth={synth} />
          <h4 className="text-2xl font-semibold" htmlFor="accidentals">
            b/# :
          </h4>

          <div className="flex gap-4 items-center">
            <input className="" type="radio" value="b" name="accidentals" id="accidentalsb" onChange={() => setAccidental("b")}></input>
            <label htmlFor="accidentalsb" className="font-semibold text-xl">b</label>
            <input className="" type="radio" value="#" name="accidentals" id="accidentals#" onChange={() => setAccidental("#")}></input>
            <label htmlFor="accidentals#" className="font-semibold text-xl">#</label>
            <input className="" type="radio" value="_" name="accidentals" id="accidentals_" onChange={() => setAccidental("_")}></input>
            <label htmlFor="accidentals_" className="font-semibold text-xl">b/#</label>
          </div>
        </form>
      </div>
      <Popup></Popup>
    </div>
  );
}
