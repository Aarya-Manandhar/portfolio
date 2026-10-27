import { useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

/** Sun/moon button. Put it in your header: <ThemeToggle /> */
export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleThemeFrom } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-theme-toggle=""
      onClick={(event) => {
        // The color change grows outward from the center of this button
        const rect = event.currentTarget.getBoundingClientRect();
        toggleThemeFrom({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 ${className}`}
    >
      {/* Sun: visible in light mode */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`absolute motion-safe:transition-all motion-safe:duration-300 ${
          isDark ? "scale-50 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon: visible in dark mode */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`absolute motion-safe:transition-all motion-safe:duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"
        }`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
