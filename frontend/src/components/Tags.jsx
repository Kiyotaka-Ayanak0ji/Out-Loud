const TONES = {
  slate: "border-line/15 bg-fill/5 text-tx-low",
  indigo: "border-acc/40 bg-acc/10 text-acc-soft",
  tangerine: "border-tan/45 bg-tan/10 text-tan-soft",
  emerald: "border-emer/45 bg-emer/10 text-emer-soft",
  amber: "border-amb/45 bg-amb/10 text-amb-soft",
};

const DOTS = {
  slate: "bg-tx-faint",
  indigo: "bg-acc",
  tangerine: "bg-tan",
  emerald: "bg-emer",
  amber: "bg-amb",
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
    <span className="h-1.5 w-1.5 rounded-full bg-tx-faint" />
    Evidence needed
  </Tag>
);

export const PlaceholderTag = (props) => (
  <Tag tone="amber" {...props}>
    <span className={`h-1.5 w-1.5 rounded-full ${DOTS.amber}`} />
    Placeholder
  </Tag>
);

export const ProposalTag = (props) => (
  <Tag tone="tangerine" {...props}>
    <span className={`h-1.5 w-1.5 rounded-full ${DOTS.tangerine}`} />
    Proposal
  </Tag>
);

export const SampleTag = (props) => (
  <Tag tone="emerald" {...props}>
    <span className={`h-1.5 w-1.5 rounded-full ${DOTS.emerald}`} />
    Sample
  </Tag>
);
