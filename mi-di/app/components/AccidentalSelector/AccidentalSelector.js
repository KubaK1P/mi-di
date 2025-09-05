export function AccidentalSelector({ accidental, setAccidental }) {

  return <>
    <h4 className="text-2xl font-semibold" htmlFor="accidentals">
      b/# :
    </h4>
    <div className="flex gap-4 items-center">
      <input className="" type="radio" value="b" name="accidentals" id="accidentalsb" onChange={() => setAccidental("b")}></input>
      <label htmlFor="accidentalsb" className="font-semibold text-xl">b</label>
      <input className="" type="radio" value="#" name="accidentals" id="accidentals#" onChange={() => setAccidental("#")}></input>
      <label htmlFor="accidentals#" className="font-semibold text-xl">#</label>
      <input className="" type="radio" value="_" name="accidentals" id="accidentals_" defaultChecked onChange={() => setAccidental("_")}></input>
      <label htmlFor="accidentals_" className="font-semibold text-xl">b/#</label>
    </div>
  </>
}
