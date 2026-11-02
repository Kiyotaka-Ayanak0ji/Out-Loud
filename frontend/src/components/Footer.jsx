import { Printer, Settings2 } from "lucide-react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-line/10 py-10" data-testid="footer">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <Logo className="h-8 w-8" />
      <p className="font-mono text-[10px] uppercase tracking-widest2 text-tx-faint">Out Loud — first demo build</p>
      <p className="text-xs text-tx-faint">
        Every personal detail is a placeholder · No accounts, no analytics, nothing stored
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#/setup"
          data-testid="footer-setup-link"
          className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold text-tx-low transition-colors hover:text-tx-hi"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Content Setup — private
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          data-testid="footer-print-btn"
          className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold text-tx-low transition-colors hover:text-tx-hi"
        >
          <Printer className="h-3.5 w-3.5" />
          Print summary
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
