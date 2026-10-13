import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MAX_INPUT_CHARS, useChat } from "../hooks/useChat";
import type { ChatMessage } from "../types/chat";

interface ChatWidgetProps {
  onToggleDarkMode?: () => void;
}

// Shown before the visitor's first message. Includes Copilot actions.
const SUGGESTIONS = [
  "Take me to his projects",
  "Show me SpecSense AI",
  "Where is his internship?",
  "Toggle dark mode",
];

// All colors live here so you can match your site's theme in one place.
const ui = {
  launcher:
    "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900 text-white shadow-lg transition-transform motion-safe:hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-white dark:text-neutral-900",
  panel:
    "fixed bottom-24 left-3 right-3 z-50 flex h-[min(70dvh,560px)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl sm:left-auto sm:right-5 sm:w-96 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100",
  header: "flex items-start justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800",
  iconButton:
    "rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white",
  userBubble: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  botBubble: "bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100",
  errorBubble: "border border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
  chip: "rounded-full border border-neutral-300 px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
  input:
    "min-w-0 flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-700",
  sendButton:
    "rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:bg-white dark:text-neutral-900",
};

function Bubble({
  message,
  onTriggerScroll,
  onToggleTheme,
}: {
  message: ChatMessage;
  onTriggerScroll: (target: string) => void;
  onToggleTheme?: () => void;
}) {
  const isUser = message.role === "user";
  const isSavedAnswer = message.source === "retrieval" || message.source === "static";
  const style = isUser ? ui.userBubble : message.isError ? ui.errorBubble : ui.botBubble;

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${style}`}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {isSavedAnswer && <p className="mt-1 text-[11px] opacity-60">Saved answer (the AI is busy right now)</p>}
      </div>

      {/* Copilot Action Indicator (Clickable button) */}
      {message.action && (
        <button
          type="button"
          onClick={() => {
            if (message.action?.type === "navigate") {
              onTriggerScroll(message.action.target);
            } else if (message.action?.type === "theme") {
              onToggleTheme?.();
            }
          }}
          className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {message.action.type === "navigate"
              ? `🚀 Copilot jumped to #${message.action.target}`
              : "🌓 Copilot toggled site theme"}
          </span>
        </button>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" role="status" aria-label="Assistant is typing">
      <div className={`flex gap-1 rounded-2xl px-3 py-3 ${ui.botBubble}`}>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 rounded-full bg-current opacity-50 motion-safe:animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWidget({ onToggleDarkMode }: ChatWidgetProps = {}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, isLoading, send, reset } = useChat();

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const hasAsked = messages.some((m) => m.role === "user");

  // Robust scroll with navbar offset so section header is never covered
  const triggerScroll = (target: string) => {
    const element = document.getElementById(target);
    if (!element) return;

    const navOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth",
    });

    // Glowing highlight pulse
    element.classList.add("ring-2", "ring-emerald-500", "ring-offset-4", "transition-all", "duration-500");
    setTimeout(() => {
      element.classList.remove("ring-2", "ring-emerald-500", "ring-offset-4");
    }, 2400);
  };

  const executedActionsRef = useRef<Set<string>>(new Set());

  // Copilot Action Execution: smoothly scrolls to section or toggles dark mode
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant" || !lastMsg.action) return;

    // Strict guard: Execute each action strictly ONCE per message ID
    if (executedActionsRef.current.has(lastMsg.id)) return;
    executedActionsRef.current.add(lastMsg.id);

    const { type, target } = lastMsg.action;
    if (type === "navigate" && target) {
      const timer = setTimeout(() => {
        triggerScroll(target);
      }, 100);
      return () => clearTimeout(timer);
    } else if (type === "theme") {
      onToggleDarkMode?.();
    }
  }, [messages, onToggleDarkMode]);

  const handleSuggestion = (question: string) => {
    if (/projects/i.test(question)) {
      triggerScroll("projects");
    } else if (/specsense/i.test(question)) {
      triggerScroll("case-study");
    }
    void send(question);
  };

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, open]);

  // Focus the input when the panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel and returns focus to the launcher button
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim() || isLoading) return;
    void send(draft);
    setDraft("");
  };

  return (
    <>
      {open && (
        <section id="chat-panel" role="dialog" aria-label="Chat with Aarya's AI assistant" className={ui.panel}>
          <header className={ui.header}>
            <div>
              <h2 className="text-sm font-semibold">Ask about Aarya</h2>
              <p className="text-xs text-neutral-500">AI assistant · answers from his portfolio</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={reset} className={ui.iconButton} aria-label="Clear conversation">
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                className={ui.iconButton}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </header>

          <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message) => (
              <Bubble
                key={message.id}
                message={message}
                onTriggerScroll={triggerScroll}
                onToggleTheme={onToggleDarkMode}
              />
            ))}

            {!hasAsked && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((question) => (
                  <button key={question} type="button" className={ui.chip} onClick={() => handleSuggestion(question)}>
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && <TypingIndicator />}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-neutral-200 p-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={MAX_INPUT_CHARS}
                placeholder="Ask about Aarya's work…"
                aria-label="Your question"
                autoComplete="off"
                className={ui.input}
              />
              <button type="submit" disabled={!draft.trim() || isLoading} className={ui.sendButton}>
                Send
              </button>
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">
              {draft.length > 240 && (
                <span className="mr-2">
                  {draft.length}/{MAX_INPUT_CHARS}
                </span>
              )}
              AI can make mistakes. For anything important, use the Contact section.
            </p>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={ui.launcher}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
        </svg>
      </button>
    </>
  );
}
