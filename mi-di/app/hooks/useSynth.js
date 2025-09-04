import * as Tone from "tone";
import { useEffect, useState } from "react";

export const useSynth = () => {
  const [synth, setSynth] = useState(null);
  const [analyser, setAnalyser] = useState(null)

  useEffect(() => {
    const new_synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
    const new_analyser = new Tone.Analyser("fft", 2048);
    new_synth.connect(new_analyser);

    setSynth(new_synth)
    setAnalyser(new_analyser)

    Tone.context.lookAhead = 0;


    return () => {
      new_synth.dispose();
      new_analyser.dispose();
    };
  }, []);

  return [{ synth, setSynth }, { analyser, setAnalyser }]
}
