let lenisInstance = null;

export const setLenis = (instance) => {
  lenisInstance = instance || null;
};

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const motionOff = document.documentElement.getAttribute("data-motion") === "off";
  if (lenisInstance && !motionOff) {
    lenisInstance.scrollTo(el, { offset: -76, duration: 1.15 });
  } else {
    el.scrollIntoView({ behavior: motionOff ? "auto" : "smooth", block: "start" });
  }
};
