import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-line/10 py-10" data-testid="footer">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <Logo className="h-8 w-8" />
      <p className="font-mono text-[10px] uppercase tracking-widest2 text-tx-faint">Out Loud — first demo build</p>
      <p className="text-xs text-tx-faint">
        Every personal detail is a placeholder · No accounts, no analytics, nothing stored
      </p>
    </div>
  </footer>
);

export default Footer;
