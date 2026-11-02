import { motion } from "framer-motion";
import { useMotion } from "../context/motion-context";

export const Reveal = ({ children, delay = 0, y = 26, className = "" }) => {
  const { motionOn } = useMotion();
  return (
    <motion.div
      className={className}
      initial={motionOn ? { opacity: 0, y } : false}
      animate={motionOn ? undefined : { opacity: 1, y: 0 }}
      whileInView={motionOn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: motionOn ? 0.6 : 0, delay: motionOn ? delay : 0, ease: [0.2, 0.7, 0.2, 1] }}
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
    <p data-testid={`section-label-${no}`} className={`font-mono text-xs font-semibold uppercase ${ACCENTS[accent] || ACCENTS.indigo}`}>
      {kicker}
    </p>
    <h2 data-testid={`section-title-${no}`} className="mt-3 font-display text-3xl font-semibold text-tx-hi sm:text-4xl">{title}</h2>
    {desc ? <p className="mt-4 text-sm leading-relaxed text-tx-low sm:text-base">{desc}</p> : null}
  </Reveal>
);
