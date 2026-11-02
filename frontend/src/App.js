import React, { useEffect } from "react";
import Lenis from "lenis";
import { MotionProvider, useMotion } from "./context/motion-context";
import { ThemeProvider } from "./context/theme-context";
import { setLenis } from "./lib/scroll";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Autopsy from "./components/Autopsy";
import BharatDemo from "./components/BharatDemo";
import SecretLayer from "./components/SecretLayer";
import Receipts from "./components/Receipts";
import ProjectsSkills from "./components/ProjectsSkills";
import AboutMe from "./components/AboutMe";
import ContactMe from "./components/ContactMe";
import Footer from "./components/Footer";
import "./App.css";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-bg p-8 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-tx-hi">Something broke.</p>
            <p className="mt-2 text-sm text-tx-low">Reload the page to keep exploring Out Loud.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Divider = () => (
  <div aria-hidden className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="h-px bg-gradient-to-r from-transparent via-line/15 to-transparent" />
  </div>
);

const Page = () => {
  const { motionOn } = useMotion();

  useEffect(() => {
    if (!motionOn) {
      setLenis(null);
      return;
    }
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(lenis);
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [motionOn]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg font-body text-tx">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{ backgroundImage: `url("${NOISE}")` }}
      />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Divider />
        <Autopsy />
        <Divider />
        <BharatDemo />
        <Divider />
        <SecretLayer />
        <Divider />
        <Receipts />
        <Divider />
        <ProjectsSkills />
        <Divider />
        <AboutMe />
        <Divider />
        <ContactMe />
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <MotionProvider>
    <ThemeProvider>
      <ErrorBoundary>
        <Page />
      </ErrorBoundary>
    </ThemeProvider>
  </MotionProvider>
);

export default App;
