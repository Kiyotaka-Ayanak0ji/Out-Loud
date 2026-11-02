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
      className="flex h-9 w-9 flex-none items-center justify-center gap-2 rounded-full border border-line/10 bg-fill/5 transition-colors hover:border-line/25 sm:w-auto sm:px-3"
    >
      {theme === "dark" ? (
        <Moon className="h-3.5 w-3.5 text-acc-soft" />
      ) : (
        <Sun className="h-3.5 w-3.5 text-amb" />
      )}
      <span className="hidden font-mono text-[10px] font-semibold uppercase text-tx-low sm:inline">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;
