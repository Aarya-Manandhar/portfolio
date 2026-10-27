import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** A screen position (in pixels) that the circular reveal grows from, usually the center of the toggle button. */
export interface RevealOrigin {
  x: number;
  y: number;
}

const STORAGE_KEY = "theme";
const FADE_CLASS = "theme-transition"; // fallback fade, see the CSS snippet in the setup notes
const REVEAL_MS = 550;
const THEME_COLOR: Record<Theme, string> = { light: "#ffffff", dark: "#0a0a0a" }; // browser toolbar color on phones

// One shared store, so the toggle button, the chatbot and anything else that calls useTheme() always agree.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
let fadeTimer: number | undefined;
let initialized = false;

interface ViewTransitionLike {
  ready: Promise<unknown>;
}
type StartViewTransition = (update: () => void) => ViewTransitionLike;

function matches(query: string): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}
const systemPrefersDark = () => matches("(prefers-color-scheme: dark)");
const prefersReducedMotion = () => matches("(prefers-reduced-motion: reduce)");

/** The visitor's saved choice, or null if they haven't made one (or storage is blocked). */
function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null; // private mode / blocked storage: fall back to the system setting
  }
}

function resolveTheme(): Theme {
  return readStored() ?? (systemPrefersDark() ? "dark" : "light");
}

function applyTheme(theme: Theme, fade: boolean) {
  const root = document.documentElement;
  if (fade && !prefersReducedMotion()) {
    root.classList.add(FADE_CLASS);
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(() => root.classList.remove(FADE_CLASS), 350);
  }
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme; // makes scrollbars and form controls match
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

/** Center of the first visible ThemeToggle on the page, or the middle of the screen if there is none. */
function findOrigin(): RevealOrigin {
  for (const el of document.querySelectorAll<HTMLElement>("[data-theme-toggle]")) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

/** Save the choice and switch. Uses a circular reveal from `origin` when supported. */
function switchTheme(next: Theme, origin?: RevealOrigin) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage blocked: the theme still changes for this visit */
  }

  const start = (document as unknown as { startViewTransition?: StartViewTransition }).startViewTransition;
  if (typeof start !== "function" || prefersReducedMotion()) {
    applyTheme(next, true); // simple fade (skipped automatically for reduced motion)
    notify();
    return;
  }

  const { x, y } = origin ?? findOrigin();
  // Radius that reaches the corner farthest from the origin, so the circle always covers the whole screen
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = start.call(document, () => {
    applyTheme(next, false);
    notify();
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: REVEAL_MS, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {
      // The browser skipped the transition; the theme update has already been applied.
    });
}

/** Re-read the saved choice (or system setting) and apply it. Used for system and other-tab changes. */
export function applyStoredTheme() {
  applyTheme(resolveTheme(), true);
  notify();
}

/** Registers the system-theme and other-tab listeners once. Called automatically by useTheme. */
export function initTheme() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  applyTheme(resolveTheme(), false);

  // Follow the operating system's light/dark switch, but only until the visitor picks a side themselves
  window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", () => {
    if (readStored() === null) applyStoredTheme();
  });

  // Keep several open tabs in sync
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key === STORAGE_KEY) applyStoredTheme();
  });
}

function subscribe(listener: () => void) {
  initTheme();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");
const getServerSnapshot = (): Theme => "light";

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = useCallback((next: Theme) => switchTheme(next), []);
  /** Flip the theme. The reveal grows from the page's theme toggle button (safe to pass as an onClick-free callback, e.g. to the chatbot). */
  const toggleTheme = useCallback(() => switchTheme(getSnapshot() === "dark" ? "light" : "dark"), []);
  /** Flip the theme with the reveal growing from a specific point (the ThemeToggle button uses this). */
  const toggleThemeFrom = useCallback(
    (origin: RevealOrigin) => switchTheme(getSnapshot() === "dark" ? "light" : "dark", origin),
    [],
  );
  return { theme, setTheme, toggleTheme, toggleThemeFrom };
}
