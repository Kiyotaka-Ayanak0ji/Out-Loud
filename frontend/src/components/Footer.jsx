import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-white/5 py-10" data-testid="footer">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <Logo className="h-8 w-8" />
      <p className="font-mono text-[10px] uppercase tracking-widest2 text-slate-500">Out Loud — first demo build</p>
      <p className="text-xs text-slate-600">
        Every personal detail is a placeholder · No accounts, no analytics, nothing stored
      </p>
    </div>
  </footer>
);

export default Footer;
