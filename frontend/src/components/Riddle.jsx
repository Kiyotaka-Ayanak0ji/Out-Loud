import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { matches } from "../lib/hash";

export const Riddle = ({ r, idx, word, onSolve }) => {
  const [guess, setGuess] = useState("");
  const [state, setState] = useState(word ? "solved" : "idle");
  const [hints, setHints] = useState(0);
  const submit = async (e) => {
    e.preventDefault();
    if (!guess.trim()) return setState("empty");
    if (await matches(guess, r.hash)) { const w = guess.toLowerCase().replace(/[^a-z]/g, ""); setState("solved"); onSolve(w[0].toUpperCase() + w.slice(1)); } else setState("wrong");
  };
  return <div className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4" data-testid={`bonus-riddle-${idx + 1}`}>
    <p className="field-label">Riddle {idx + 1}</p>
    <p className="mt-2 text-sm leading-relaxed text-tx">{r.text}</p>
    {state === "solved" ? <p className="mt-3 font-display text-xl font-semibold text-emer-soft" data-testid={`bonus-riddle-${idx + 1}-word`}>{word}</p> : <>
      <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
        <input value={guess} onChange={(e) => { setGuess(e.target.value); setState("idle"); }} aria-label={`Answer to riddle ${idx + 1}`} placeholder="One word" data-testid={`bonus-riddle-${idx + 1}-input`} className="min-w-0 flex-1 rounded-full border border-tan/40 bg-bg/50 px-4 py-2 text-sm" />
        <button type="submit" data-testid={`bonus-riddle-${idx + 1}-submit`} className="rounded-full bg-tan px-4 py-2 text-xs font-bold text-[#2A0F04]">Check</button>
        <button type="button" onClick={() => setHints((h) => Math.min(r.hints.length, h + 1))} aria-disabled={hints >= r.hints.length} data-testid={`bonus-riddle-${idx + 1}-hint`} className="inline-flex items-center gap-1 rounded-full border border-line/15 px-3 py-2 text-xs text-tx-low hover:text-tx-hi aria-disabled:opacity-50"><Lightbulb className="h-3.5 w-3.5" />{hints >= r.hints.length ? "All hints shown" : `Hint ${hints + 1} of ${r.hints.length}`}</button>
      </form>
      <div aria-live="polite" className="mt-2 grid gap-1 text-xs" data-testid={`bonus-riddle-${idx + 1}-feedback`}>
        {state === "empty" && <p className="text-tan-soft">Enter an answer first.</p>}
        {state === "wrong" && <p className="text-tan-soft">Not quite. Try again or take a hint.</p>}
        {r.hints.slice(0, hints).map((h) => <p key={h} className="text-tx-low">{h}</p>)}
      </div>
    </>}
  </div>;
};
