const TONES = {
  slate: "border-white/15 bg-white/5 text-slate-300",
  indigo: "border-acc/40 bg-acc/10 text-acc-soft",
  tangerine: "border-tangerine/45 bg-tangerine/10 text-orange-300",
  emerald: "border-emeraldx/45 bg-emeraldx/10 text-emerald-300",
  amber: "border-amberx/45 bg-amberx/10 text-amber-300",
};

export const Tag = ({ tone = "slate", children, className = "", ...rest }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest2 ${TONES[tone] || TONES.slate} ${className}`}
    {...rest}
  >
    {children}
  </span>
);

export const EvidenceTag = (props) => (
  <Tag tone="slate" {...props}>
    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
    Evidence needed
  </Tag>
);

export const PlaceholderTag = (props) => (
  <Tag tone="amber" {...props}>
    <span className="h-1.5 w-1.5 rounded-full bg-amberx" />
    Placeholder
  </Tag>
);

export const ProposalTag = (props) => (
  <Tag tone="tangerine" {...props}>
    <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />
    Proposal
  </Tag>
);

export const SampleTag = (props) => (
  <Tag tone="emerald" {...props}>
    <span className="h-1.5 w-1.5 rounded-full bg-emeraldx" />
    Sample
  </Tag>
);
