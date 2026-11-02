import { motion } from "framer-motion";
import { useMotion } from "../context/motion-context";

export const Reveal = ({ children, delay = 0, y = 26, className = "" }) => {
  const { motionOn } = useMotion();
  if (!motionOn) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ACCENTS = {
  indigo: "text-acc-soft",
  emerald: "text-emer-soft",
  tangerine: "text-tan-soft",
  amber: "text-amb-soft",
};

export const SectionHeader = ({ no, kicker, title, desc, accent = "indigo" }) => (
  <Reveal className="max-w-2xl">
    <p className={`font-mono text-xs font-semibold uppercase tracking-widest2 ${ACCENTS[accent] || ACCENTS.indigo}`}>
      {no} · {kicker}
    </p>
    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-tx-hi sm:text-4xl">{title}</h2>
    {desc ? <p className="mt-4 text-sm leading-relaxed text-tx-low sm:text-base">{desc}</p> : null}
  </Reveal>
);
