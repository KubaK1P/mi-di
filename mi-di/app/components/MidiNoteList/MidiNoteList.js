export function MidiNoteList({ activeNotesArray, noteLetters }) {
  return <div className="transition-all absolute bottom-[40px] left-[50%] transform -translate-x-1/2">
    <ul className="flex gap-6 bg-main p-4 rounded-lg text-lighter text-xl font-semibold">
      {(activeNotesArray.length) ?
        activeNotesArray.map((note) => (
          <li key={note}>{noteLetters[note % 12]}{Math.floor(note / 12) - 1}</li>
        )) : (<li>##</li>)}
    </ul>
  </div>

}
