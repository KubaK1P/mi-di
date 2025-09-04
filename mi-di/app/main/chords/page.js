"use client"
import { useState, useRef } from "react";
import Popup from "@/app/components/Popup/Popup";
import ADSR_Editor from "@/app/components/ADSR_Editor/ADSR_Editor";
import { getChord } from "@/app/utils/getChord";
import note_names from "./note_names.json"
import { useSynth } from "@/app/hooks/useSynth";
import { useMidi } from "@/app/hooks/useMidi";
import { useSpectrum } from "@/app/hooks/useSpectrum";
import { AccidentalSelector } from "@/app/components/AccidentalSelector/AccidentalSelector";
import { MidiDot } from "@/app/components/MidiDot/MidiDot";
import { MidiNoteList } from "@/app/components/MidiNoteList/MidiNoteList";

export default function Chords() {
  const [accidental, setAccidental] = useState("_")
  const canvasRef = useRef(null);

  const [{ synth }, { analyser }] = useSynth()
  const [messages, activeNotes, midiInputs] = useMidi(synth)
  useSpectrum(analyser, canvasRef)

  const noteLetters = note_names[accidental];
  const activeNotesArray = Array.from(activeNotes).sort();
  const activeNotesModulo12 = Array.from(new Set(activeNotesArray.map(note => note % 12))).sort()

  const detectedChord = getChord(activeNotesModulo12, activeNotesArray, noteLetters);

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
      <MidiNoteList activeNotesArray={activeNotesArray} noteLetters={noteLetters} />
      <MidiDot activeNotes={activeNotes} />
      <div className="absolute bottom-[40px] right-[40px] bg-main text-lighter-children p-4 rounded-lg z-998">
        <form>
          <ADSR_Editor synth={synth} />
          <AccidentalSelector accidental={accidental} setAccidental={setAccidental} />
        </form>
      </div>
      <Popup />
    </div>
  );
}
