import { ShieldCheck } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { OWNER_NAME } from "../lib/content";

const ROWS = [
  { label: "Name", value: `[${OWNER_NAME}]` },
  { label: "Email", value: "[you@example.com]" },
  { label: "Location", value: "[City, Country]" },
  { label: "Profiles", value: "[LinkedIn] · [GitHub] · [X]" },
];

const ContactMe = () => (
  <section id="contact" className="py-16 sm:py-24" data-testid="contact-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        no="07"
        kicker="Contact Me"
        title="Say it back."
        desc="[Placeholder details below — real links land here when supplied. Nothing on this page is collected or stored.]"
      />
      <Reveal className="mt-8">
        <div className="glass rounded-3xl p-6 sm:p-8" data-testid="contact-card">
          <div className="grid divide-y divide-line/10">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="flex flex-wrap items-baseline justify-between gap-2 py-4"
                data-testid={`contact-row-${r.label.toLowerCase()}`}
              >
                <span className="field-label">{r.label}</span>
                <span className="text-sm font-medium text-tx">{r.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-tx-faint" data-testid="privacy-note">
            <ShieldCheck className="h-4 w-4 text-emer-soft" />
            No data collected — this page stores nothing about you.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

export default ContactMe;
