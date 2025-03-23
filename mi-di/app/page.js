"use client"; // Ensure this runs only on the client-side
import { useEffect, useState } from "react";

export default function Home() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [messages, setMessages] = useState([]); // Stores incoming MIDI data

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midi) => {
        setMidiAccess(midi);
        for (let input of midi.inputs.values()) {
          input.onmidimessage = handleMidiMessage;
        }
      }).catch((err) => console.error("MIDI access failed", err));
    }
  }, []);

  const handleMidiMessage = (message) => {
    const [command, note, velocity] = message.data;
    
    let type = "Unknown";
    if (command >= 144 && command < 160) {
      type = velocity > 0 ? "Note On" : "Note Off";
    } else if (command >= 128 && command < 144) {
      type = "Note Off";
    } else if (command >= 176 && command < 192) {
      type = "Control Change";
    }

    const newMessage = {
      type,
      note,
      velocity,
      timestamp: message.timeStamp.toFixed(2),
    };

    setMessages((prev) => [...prev.slice(-9), newMessage]); // Keep only the last 10 messages
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold">MIDI Debugger</h1>
      {midiAccess ? (
        <p className="text-green-400">MIDI Connected ✅</p>
      ) : (
        <p className="text-red-500">No MIDI device detected ❌</p>
      )}
      <div className="mt-4 p-2 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold">MIDI Messages:</h2>
        <ul className="text-sm mt-2">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <li key={index} className="text-gray-300">
                {msg.timestamp}ms | {msg.type} | Note: {msg.note} | Velocity: {msg.velocity}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Waiting for MIDI input...</p>
          )}
        </ul>
      </div>
    </div>
  );
}
