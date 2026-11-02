import Logo from "./Logo";
export default function Footer() {
  return <footer className="border-t border-line/10 py-8" data-testid="footer"><div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8"><Logo className="h-6 w-6" /><p className="text-sm text-tx-low">Out Loud · Ansik Aryan Samal</p></div></footer>;
}