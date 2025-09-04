"use client"
import { useEffect, useState, useRef } from "react";
import Popup from "@/app/components/Popup/Popup";
import { useMemo } from "react";
import ADSR_Editor from "@/app/components/ADSR_Editor/ADSR_Editor";
import { getChord } from "@/app/utils/getChord";
import note_names from "./note_names.json"
import { useSynth } from "@/app/hooks/useSynth";
import { useMidi } from "@/app/hooks/useMidi";
import { useSpectrum } from "@/app/hooks/useSpectrum";

export default function Chords() {
  const [accidental, setAccidental] = useState("_")
  const canvasRef = useRef(null);

  const [{ synth }, { analyser }] = useSynth()
  const [messages, activeNotes, midiInputs] = useMidi(synth)
  useSpectrum(analyser, canvasRef)

  const noteLetters = note_names[accidental];
  const activeNotesArray = Array.from(activeNotes).sort((a, b) => a - b);
  const activeNotesModulo12 =
    Array.from(new Set(
      activeNotesArray
        .map(note => note % 12)
    ))
      .sort((a, b) => a - b)

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
            <input className="" type="radio" value="_" name="accidentals" id="accidentals_" checked onChange={() => setAccidental("_")}></input>
            <label htmlFor="accidentals_" className="font-semibold text-xl">b/#</label>
          </div>
        </form>
      </div>
      <Popup></Popup>
    </div>
  );
}
