import { CircleCheck, CircleDashed, Clock3 } from "lucide-react";
import { VoiceNote } from "./VoiceNote";

const CHIP = {
  complete: { cls: "border-emer/45 bg-emer/10 text-emer-soft", icon: CircleCheck, label: "Complete" },
  verified: { cls: "border-emer/45 bg-emer/10 text-emer-soft", icon: CircleCheck, label: "Evidence attached" },
  awaiting: { cls: "border-amb/45 bg-amb/10 text-amb-soft", icon: Clock3, label: "Awaiting evidence" },
  missing: { cls: "border-line/15 bg-fill/5 text-tx-faint", icon: CircleDashed, label: "Missing" },
};

export const StatusChip = ({ status }) => {
  const c = CHIP[status] || CHIP.missing;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex flex-none items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest2 ${c.cls}`}
      data-testid={`status-${status}`}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
};

export const QuestionField = ({ q, value, evidenceValue, onChange, onEvidenceChange }) => {
  const id = `setup-${q.path.replace(/[^a-z0-9]+/gi, "-")}`;
  return (
    <div className="rounded-2xl border border-line/10 bg-fill/[0.02] p-4 sm:p-5" data-testid={id}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="font-display text-sm font-bold text-tx-hi">
          {q.label}
        </label>
        <StatusChip status={statusOfLocal(q, value, evidenceValue)} />
      </div>
      <p className="mt-1.5 text-xs italic leading-relaxed text-tx-faint">{q.example}</p>
      {q.type === "textarea" ? (
        <textarea
          id={id}
          data-testid={`${id}-input`}
          value={value || ""}
          onChange={(e) => onChange(q.path, e.target.value)}
          rows={q.rows || 3}
          placeholder="[Your answer — kept private to this setup]"
          className="mt-3 w-full resize-y rounded-xl border border-line/15 bg-bg/50 p-3 text-sm leading-relaxed text-tx placeholder:text-tx-faint"
        />
      ) : (
        <input
          id={id}
          data-testid={`${id}-input`}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(q.path, e.target.value)}
          placeholder="[Your answer — kept private to this setup]"
          className="mt-3 w-full rounded-xl border border-line/15 bg-bg/50 px-3 py-2.5 text-sm text-tx placeholder:text-tx-faint"
        />
      )}
      {q.evidencePath && (
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-tx-low">
          <input
            type="checkbox"
            checked={!!evidenceValue}
            onChange={(e) => onEvidenceChange(q.evidencePath, e.target.checked)}
            data-testid={`${id}-evidence-check`}
            className="h-4 w-4 accent-acc"
          />
          Evidence supplied and checked (link, screenshot or document reference added)
        </label>
      )}
      {q.voice !== false && value !== undefined && <VoiceNote id={id} />}
    </div>
  );
};

const statusOfLocal = (q, value, evidenceValue) => {
  if (!value || !value.toString().trim()) return "missing";
  if (q.evidencePath) return evidenceValue ? "verified" : "awaiting";
  return "complete";
};
