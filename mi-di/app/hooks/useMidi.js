import * as Tone from "tone";
import { useEffect, useState } from "react";
export const useMidi = (synth) => {
  const [messages, setMessages] = useState([]);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [midiInputs, setMidiInputs] = useState([]);

  useEffect(() => {
    if (synth)
      if (typeof navigator !== "undefined" && navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
          .then((midi) => {
            updateMidiInputs(midi);
            midi.onstatechange = () => updateMidiInputs(midi);
            for (let input of midi.inputs.values()) {
              input.onmidimessage = (m) => handleMidiMessage(m, synth);
            }
          })
          .catch((err) => console.error("MIDI access failed", err));
      }
  }, [synth])


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

  return [messages, activeNotes, midiInputs]
}
