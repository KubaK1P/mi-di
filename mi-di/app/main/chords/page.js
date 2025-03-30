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
  const synthRef = useRef(null);
  const [envel, setEnvel] = useState({
    "attack": 0.10,
    "decay": 0.30,
    "sustain": 1.00,
    "release": 1.00
  });

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

  const getChord = (activeNotes) => {
    return "G#b country ahh chord"; // temporary
  }
  const detectedChord = useMemo(() => getChord(activeNotesModulo12), [activeNotesModulo12]);

  
  const noteLetters = {
    "0": "C",
    "1": "C#/Db",
    "2": "D",
    "3": "D#/Eb",
    "4": "E",
    "5": "F",
    "6": "F#/Gb",
    "7": "G",
    "8": "G#/Ab",
    "9": "A",
    "10": "A#/Bb",
    "11": "B"
  };
  
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
            </form>
        </div>
        <Popup></Popup>
    </div>
  );
}