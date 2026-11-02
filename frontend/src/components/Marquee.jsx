const ITEMS = [
  "Built by voice",
  "Out Loud",
  "Listen first",
  "Say it back",
  "Decisions, opened up",
  "Proof over promises",
];

const Seq = ({ hidden }) => (
  <div aria-hidden={hidden || undefined} className="flex flex-none items-center">
    {ITEMS.map((t, i) => (
      <span
        key={i}
        className="mx-7 flex items-center gap-7 font-display text-sm font-bold uppercase tracking-[0.25em] text-slate-500"
      >
        {t}
        <span className="text-acc">&#9670;</span>
      </span>
    ))}
  </div>
);

const Marquee = () => (
  <div className="relative z-10 border-y border-white/5 bg-surface/40 py-4" data-testid="marquee">
    <div className="mq-track flex w-max">
      <Seq />
      <Seq hidden />
    </div>
  </div>
);

export default Marquee;
