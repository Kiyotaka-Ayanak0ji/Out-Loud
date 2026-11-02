import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme-context";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      data-testid="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      aria-pressed={theme === "light"}
      title={`Switch to ${next} theme`}
      className="flex items-center gap-2 rounded-full border border-line/10 bg-fill/5 px-3 py-1.5 transition-colors hover:border-line/25"
    >
      {theme === "dark" ? (
        <Moon className="h-3.5 w-3.5 text-acc-soft" />
      ) : (
        <Sun className="h-3.5 w-3.5 text-amb" />
      )}
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest2 text-tx-low">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;
