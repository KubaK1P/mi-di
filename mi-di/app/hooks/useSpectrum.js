import * as Tone from "tone";
import { useEffect } from "react";

export const useSpectrum = (analyser, canvasRef) => {
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
  }, [analyser])
}
