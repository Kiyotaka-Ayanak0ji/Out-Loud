import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useMotion } from "../context/motion-context";
import { scrollToSection } from "../lib/scroll";
import { CHAPTERS } from "../lib/content";

export const MotionToggle = ({ withLabel = true }) => {
  const { motionOn, toggleMotion } = useMotion();
  return (
    <button
      data-testid="motion-toggle-btn"
      onClick={toggleMotion}
      aria-pressed={motionOn}
      title="Turn animations on or off"
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-white/25"
    >
      <span
        className={`relative h-4 w-7 flex-none rounded-full transition-colors duration-200 ${motionOn ? "bg-acc" : "bg-slate-600"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all duration-200 ${motionOn ? "left-3.5" : "left-0.5"}`}
        />
      </span>
      {withLabel && (
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest2 text-slate-300">
          {motionOn ? "Motion on" : "Motion off"}
        </span>
      )}
    </button>
  );
};

const MenuList = ({ go }) => (
  <nav aria-label="All chapters" className="flex h-full flex-col justify-center gap-1 px-8 pt-24 pb-10">
    {CHAPTERS.slice(1).map((c) => (
      <button
        key={c.id}
        data-testid={`menu-link-${c.id}`}
        onClick={() => go(c.id)}
        className="flex items-baseline gap-4 border-b border-white/5 py-4 text-left"
      >
        <span className="font-mono text-xs text-acc-soft">{c.no}</span>
        <span className="font-display text-2xl font-bold text-slate-100">{c.full}</span>
      </button>
    ))}
  </nav>
);

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { motionOn } = useMotion();

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#autopsy"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-acc focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="glass mt-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <button data-testid="nav-home-btn" onClick={() => go("hero")} className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="font-display text-lg font-bold tracking-tight text-white">Out Loud</span>
            </button>
            <nav aria-label="Chapters" className="hidden items-center gap-1 lg:flex">
              {CHAPTERS.slice(1).map((c) => (
                <button
                  key={c.id}
                  data-testid={`nav-link-${c.id}`}
                  onClick={() => go(c.id)}
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {c.short}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <MotionToggle />
              <button
                data-testid="nav-menu-btn"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open &&
          (motionOn ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
              data-testid="nav-overlay"
            >
              <MenuList go={go} />
            </motion.div>
          ) : (
            <div className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden" data-testid="nav-overlay">
              <MenuList go={go} />
            </div>
          ))}
      </AnimatePresence>
    </>
  );
};

export default Nav;
