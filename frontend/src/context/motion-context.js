import { createContext, useContext, useCallback, useEffect, useState } from "react";

const MotionContext = createContext({ motionOn: true, toggleMotion: () => {} });

export const MotionProvider = ({ children }) => {
  const [motionOn, setMotionOn] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const toggleMotion = useCallback(() => setMotionOn((v) => !v), []);

  useEffect(() => {
    const root = document.documentElement;
    if (motionOn) root.removeAttribute("data-motion");
    else root.setAttribute("data-motion", "off");
  }, [motionOn]);

  return (
    <MotionContext.Provider value={{ motionOn, toggleMotion }}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => useContext(MotionContext);
