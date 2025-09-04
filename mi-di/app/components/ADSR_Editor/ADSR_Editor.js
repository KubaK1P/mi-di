import { useEffect, useState } from "react";

export default function ADSR_Editor({ synth }) {
  const [envelop, setEnvelop] = useState({
    "attack": 0.10,
    "decay": 0.30,
    "sustain": 1.00,
    "release": 1.00
  });

  useEffect(() => {
    if (synth)
      synth.set({
        envelope: {
          ...envelop
        },
      });
  }, [envelop, synth])

  return <>{Object.keys(envelop).map((key) => (
    <div key={key} className="flex justify-between items-center gap-4 p-2">
      <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {envelop[key].toFixed(2)}</label>
      <input
        type="range"
        id={key}
        name={key}
        min="0"
        max={(key === "sustain") ? "1" : "5"}
        step="0.01"
        value={envelop[key]}
        onChange={(e) => {
          setEnvelop(envelop => ({
            ...envelop,
            [key]: parseFloat(e.target.value)
          }));
        }}
      />
    </div>
  ))}</>
}
