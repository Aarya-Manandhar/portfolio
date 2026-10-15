import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FileDown, Mail, Copy, Check, ArrowUpRight } from "lucide-react";
import { MAX_INPUT_CHARS, useChat } from "../hooks/useChat";
import type { ChatMessage } from "../types/chat";
import AssistantMark from "./AssistantMark";

interface ChatWidgetProps {
  onToggleDarkMode?: () => void;
}

// Shown before the visitor's first message. Covers all sections with automatic scroll navigation.
const SUGGESTIONS = [
  "Take me to his projects",
  "What is his tech stack?",
  "Tell me about Aarya",
  "How can I contact him?",
];

// All colors live here so you can match your site's theme in one place.
const ui = {
  launcher:
    "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-neutral-900 bg-white p-1 text-neutral-900 shadow-lg transition-transform motion-safe:hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:border-white dark:bg-neutral-900 dark:text-white",
  panel:
    "fixed bottom-24 left-3 right-3 z-50 flex h-[min(70dvh,560px)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl sm:left-auto sm:right-5 sm:w-96 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100",
  header: "flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800",
  iconButton:
    "rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors",
  userBubble: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  botBubble: "bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100",
  errorBubble: "border border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
  chip: "rounded-full border border-neutral-300 px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors",
  input:
    "min-w-0 flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-700",
  sendButton:
    "rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:bg-white dark:text-neutral-900 transition-colors",
};

/**
 * Parses markdown links, emails, resume files, bold text and URLs into interactive React elements.
 */
function parseFormattedText(text: string): React.ReactNode[] {
  const pattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s)]+|\/resume\.pdf)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Markdown link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isFile = url.endsWith(".pdf") || url.includes("resume.pdf");
      const isMail = url.startsWith("mailto:");

      return (
        <a
          key={index}
          href={url}
          target={isMail ? undefined : "_blank"}
          rel={isMail ? undefined : "noopener noreferrer"}
          download={isFile ? "Aarya_Manandhar_Resume.pdf" : undefined}
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {isFile && <FileDown className="inline h-3.5 w-3.5" />}
          {isMail && <Mail className="inline h-3.5 w-3.5" />}
          <span>{label}</span>
          {!isFile && !isMail && <ArrowUpRight className="inline h-3 w-3" />}
        </a>
      );
    }

    // Bold text: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={index} className="font-semibold text-inherit">
          {boldMatch[1]}
        </strong>
      );
    }

    // Standalone email
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          <Mail className="inline h-3.5 w-3.5" />
          <span>{part}</span>
        </a>
      );
    }

    // Standalone /resume.pdf
    if (part === "/resume.pdf") {
      return (
        <a
          key={index}
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download="Aarya_Manandhar_Resume.pdf"
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          <FileDown className="inline h-3.5 w-3.5" />
          <span>resume.pdf</span>
        </a>
      );
    }

    // Standalone URL
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity break-all"
        >
          <span>{part}</span>
          <ArrowUpRight className="inline h-3 w-3" />
        </a>
      );
    }

    return part;
  });
}

function Bubble({
  message,
}: {
  message: ChatMessage;
}) {
  const isUser = message.role === "user";
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isSavedAnswer =
    message.source === "retrieval" ||
    message.source === "static" ||
    message.source === "fallback" ||
    message.source === "no-match";
  const style = isUser ? ui.userBubble : message.isError ? ui.errorBubble : ui.botBubble;

  // Detect resume file provided in the answer
  const hasResume =
    !isUser &&
    (/resume\.pdf/i.test(message.content) ||
      /download\s*(aarya's|the|his)?\s*(full\s*)?(cv|resume)/i.test(message.content) ||
      /\[download resume/i.test(message.content));

  // Detect email provided in the answer
  const emailMatch = !isUser ? message.content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) : null;
  const email = emailMatch ? emailMatch[0] : null;

  const handleCopyEmail = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${style}`}>
        <div className="whitespace-pre-wrap break-words">{parseFormattedText(message.content)}</div>

        {/* Quick action card: Resume PDF Download */}
        {hasResume && (
          <div className="mt-2.5 pt-2 border-t border-neutral-300/40 dark:border-neutral-700/60">
            <a
              href="/resume.pdf"
              download="Aarya_Manandhar_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2.5 rounded-xl border border-neutral-300/80 bg-white/95 p-2 text-xs text-neutral-900 shadow-sm transition-all hover:border-neutral-500 hover:bg-white dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-neutral-100 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                  <FileDown className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="truncate font-semibold text-neutral-900 dark:text-white">
                    Aarya_Manandhar_Resume.pdf
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    PDF Document • 128 KB
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white transition-colors group-hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:group-hover:bg-neutral-100 shrink-0">
                Download
              </span>
            </a>
          </div>
        )}

        {/* Quick action buttons: Email */}
        {email && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white/95 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm hover:bg-white hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span>Send Email</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopyEmail(email)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white/95 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm hover:bg-white hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Copy email to clipboard"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        {isSavedAnswer && (
          <p className="mt-1 text-[11px] opacity-60">
            AI is offline • Showing related info
          </p>
        )}
      </div>
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

export default function ChatWidget({ onToggleDarkMode }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [nudge, setNudge] = useState(false); // the small "Ask me..." bubble next to the launcher
  const { messages, isLoading, send, reset } = useChat();

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

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
  };

  const executedActionsRef = useRef<Set<string>>(new Set());

  // Copilot Action Execution: smoothly scrolls to section or toggles dark mode
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant" || !lastMsg.action) return;

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
    } else if (/specsense|case\s*study/i.test(question)) {
      triggerScroll("case-study");
    } else if (/stack|skill|tech|tools/i.test(question)) {
      triggerScroll("skills");
    } else if (/study|education|degree|university/i.test(question)) {
      triggerScroll("education");
    } else if (/deployment|live/i.test(question)) {
      triggerScroll("deployments");
    } else if (/about|who\s*is/i.test(question)) {
      triggerScroll("about");
    } else if (/contact|email|reach|hire/i.test(question)) {
      triggerScroll("contact");
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

  // Hint bubble: shows once per visit, a few seconds after the page loads
  const dismissNudge = useCallback(() => {
    setNudge(false);
    try {
      sessionStorage.setItem("chat-nudge-seen", "1");
    } catch {
      /* storage blocked: the bubble may show again on reload, which is fine */
    }
  }, []);

  useEffect(() => {
    if (open) {
      dismissNudge();
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem("chat-nudge-seen") === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    const timer = setTimeout(() => setNudge(true), 4000);
    return () => clearTimeout(timer);
  }, [open, dismissNudge]);

  // It hides itself after 12 seconds
  useEffect(() => {
    if (!nudge) return;
    const timer = setTimeout(dismissNudge, 12000);
    return () => clearTimeout(timer);
  }, [nudge, dismissNudge]);

  const hasAsked = messages.some((m) => m.role === "user");

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

  const handleClose = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  const handleReset = () => {
    reset();
  };

  // One place that sends the draft: used by the form and by the Enter key
  const submit = () => {
    if (!draft.trim() || isLoading) return;
    void send(draft);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <>
      {open && (
        <section
          id="chat-panel"
          role="dialog"
          aria-label="Chat with Aarya's AI assistant"
          className={ui.panel}
        >
          <header className={ui.header}>
            <div className="flex min-w-0 items-center gap-2.5 pr-1">
              {/* Assistant avatar: the A mark */}
              <span className="relative h-9 w-9 shrink-0">
                <AssistantMark />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">Ask about Aarya</h2>
                <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                  AI assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className={ui.iconButton}
                aria-label="Clear conversation"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={ui.iconButton}
                aria-label="Close chat"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((message) => (
              <Bubble
                key={message.id}
                message={message}
              />
            ))}

            {!hasAsked && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className={ui.chip}
                    onClick={() => handleSuggestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && <TypingIndicator />}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-neutral-200 p-3 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  // Enter sends. (Ignored while an input method is composing text.)
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    submit();
                  }
                }}
                maxLength={MAX_INPUT_CHARS}
                placeholder="Ask about Aarya's work…"
                aria-label="Your question"
                autoComplete="off"
                className={ui.input}
              />

              <button
                type="submit"
                disabled={!draft.trim() || isLoading}
                className={ui.sendButton}
              >
                Send
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
              <span>Ask anything about skills or experience</span>
              <span className="hidden sm:inline">
                Enter to send
              </span>
            </div>
          </form>
        </section>
      )}

      {nudge && !open && (
        <div
          role="status"
          className="fixed bottom-[1.6rem] right-[5.25rem] z-50 max-w-[min(220px,calc(100vw-7rem))]"
        >
          <div className="relative rounded-2xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-sm leading-snug text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
            <button
              type="button"
              onClick={() => {
                dismissNudge();
                setOpen(true);
              }}
              className="text-left focus:outline-none focus-visible:underline"
            >
              Hi! Ask me about Aarya&apos;s projects or experience.
            </button>
            <button
              type="button"
              onClick={dismissNudge}
              aria-label="Dismiss hint"
              className="absolute right-1 top-1 rounded p-1 text-neutral-400 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:hover:text-neutral-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            {/* little tail pointing at the launcher */}
            <span
              className="absolute -right-1.5 bottom-4 h-3 w-3 rotate-45 border-r border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
              aria-hidden="true"
            />
          </div>
        </div>
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
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <AssistantMark />
            <span
              className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900"
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </>
  );
}