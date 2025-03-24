"use client"; // Ensure this runs only on the client-side
import { useEffect, useState } from "react";

export default function Debug() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [messages, setMessages] = useState([]); // Stores incoming MIDI data
  const [midiInputs, setMidiInputs] = useState([]);
  
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midi) => {
        setMidiAccess(midi);
        updateMidiInputs(midi);
        midi.onstatechange = () => updateMidiInputs(midi);
        for (let input of midi.inputs.values()) {
          input.onmidimessage = handleMidiMessage;
        }
      }).catch((err) => console.error("MIDI access failed", err));
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
        <>
        <p className="text-green-400">MIDI Access</p>
        <ul className="mt-4">
            {midiInputs.length > 0 ? (
              midiInputs.map((device) => (
                <li key={device.id} className="text-gray-300">
                  {device.name}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No MIDI devices found.</p>
            )}
          </ul></>
      ) : (
        <p className="text-red-500">No MIDI Access </p>
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
