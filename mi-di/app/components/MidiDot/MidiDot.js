export function MidiDot({ activeNotes }) {
  return <div
    className={`absolute left-[40px] bottom-[40px] rounded-lg w-[25px] h-[25px] ${activeNotes.size > 0 ? "bg-accent" : "bg-main"
      }`}
  ></div>

}
