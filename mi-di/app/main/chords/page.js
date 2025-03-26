"use client"
import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

export default function Chords() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [midiInputs, setMidiInputs] = useState([]);
  const synthRef = useRef(null); // ✅ Use useRef for persistent synth instance

  useEffect(() => {
    // ✅ Initialize synth once
    synthRef.current = new Tone.PolySynth().toDestination();

    return () => {
      synthRef.current.dispose(); // ✅ Clean up on unmount
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
            if (!input.onmidimessage) {  // ✅ Prevent duplicate event listeners
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
        synthRef.current.triggerAttack(Tone.Frequency(note, "midi").toNote()); // ✅ Use synthRef.current
        newNotes.add(note);
      } else if (type === "Note Off") {
        synthRef.current.triggerRelease(Tone.Frequency(note, "midi").toNote()); // ✅ Use synthRef.current
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
          Mi-di Chords
        </h1>
      </div>
      <div
        className={`absolute left-[40px] bottom-[40px] rounded-lg w-[25px] h-[25px] ${
          activeNotes.size > 0 ? "bg-accent" : "bg-main"
        }`}
      ></div>
    </div>
  );
}
