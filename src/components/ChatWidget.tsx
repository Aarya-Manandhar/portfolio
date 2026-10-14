import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MAX_INPUT_CHARS, useChat } from "../hooks/useChat";
import { canListen, canSpeak, useListen, useSpeak } from "../hooks/useSpeech";
import type { ChatMessage } from "../types/chat";
import AssistantMark from "./AssistantMark";

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

/** Animated equalizer wave bars indicating active speech playback */
function AudioEqualizer() {
  return (
    <span className="inline-flex items-center gap-[2px] h-3.5 px-0.5" aria-hidden="true">
      <span className="w-[2px] h-3 bg-emerald-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
      <span className="w-[2px] h-4 bg-emerald-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s]" />
      <span className="w-[2px] h-2.5 bg-emerald-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s]" />
      <span className="w-[2px] h-3.5 bg-emerald-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s]" />
    </span>
  );
}

function SpeakerButton({
  isSpeaking,
  onToggle,
}: {
  isSpeaking: boolean;
  onToggle: () => void;
}) {
  if (!canSpeak) return null;
  return (
    <button
      type="button"
      aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
      onClick={onToggle}
      className={`mt-1 inline-flex items-center gap-1.5 self-start rounded-full px-2 py-0.5 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${isSpeaking
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
        : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        }`}
    >
      {isSpeaking ? (
        <>
          <AudioEqualizer />
          <span className="text-[10px]">Playing</span>
        </>
      ) : (
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
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}

function Bubble({
  message,
  isSpeaking,
  onToggleSpeak,
}: {
  message: ChatMessage;
  isSpeaking: boolean;
  onToggleSpeak: () => void;
}) {
  const isUser = message.role === "user";
  const isSavedAnswer =
    message.source === "retrieval" ||
    message.source === "static" ||
    message.source === "fallback" ||
    message.source === "no-match";
  const style = isUser ? ui.userBubble : message.isError ? ui.errorBubble : ui.botBubble;

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${style}`}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {isSavedAnswer && (
          <p className="mt-1 text-[11px] opacity-60">
            AI is offline • Showing related info
          </p>
        )}
      </div>

      {/* Speaker button — only on bot messages */}
      {!isUser && !message.isError && (
        <SpeakerButton isSpeaking={isSpeaking} onToggle={onToggleSpeak} />
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

export default function ChatWidget({ onToggleDarkMode }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [nudge, setNudge] = useState(false); // the small "Ask me..." bubble next to the launcher
  const { messages, isLoading, send, reset } = useChat();

  // Central speech synthesis manager
  const { speakingId, isSpeaking, speak, cancel: cancelSpeak } = useSpeak();

  // Voice input (Microphone speech-to-text)
  const handleTranscript = useCallback((text: string) => {
    setDraft(text);
  }, []);
  const { listening, error: speechError, start: startListening, stop: stopListening } = useListen(handleTranscript);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const lastSpokenMessageIdRef = useRef<string | null>(null);

  const hasAsked = messages.some((m) => m.role === "user");

  // Auto-speak incoming assistant responses if voice mode is enabled
  useEffect(() => {
    if (!voiceModeActive) return;
    const latest = messages[messages.length - 1];
    if (
      latest &&
      latest.role === "assistant" &&
      !latest.isError &&
      latest.id !== "welcome" &&
      latest.id !== lastSpokenMessageIdRef.current
    ) {
      lastSpokenMessageIdRef.current = latest.id;
      speak(latest.id, latest.content);
    }
  }, [messages, voiceModeActive, speak]);

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

  // Escape closes the panel and returns focus to the launcher button
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancelSpeak();
        if (listening) stopListening();
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, cancelSpeak, listening, stopListening]);


  const handleClose = () => {
    cancelSpeak();
    if (listening) stopListening();
    setOpen(false);
    launcherRef.current?.focus();
  };

  const handleReset = () => {
    cancelSpeak();
    if (listening) stopListening();
    reset();
  };

  // One place that sends the draft: used by the form and by the Enter key
  const submit = () => {
    if (!draft.trim() || isLoading) return;
    if (listening) stopListening();
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
              {/* Voice Mode Toggle (Auto-read responses) */}
              {canSpeak && (
                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceModeActive;
                    setVoiceModeActive(next);
                    if (!next) cancelSpeak();
                  }}
                  title={
                    voiceModeActive
                      ? "Voice Mode is ON: AI answers are read aloud"
                      : "Turn on Voice Mode to auto-read answers"
                  }
                  aria-pressed={voiceModeActive}
                  aria-label="Toggle Voice Mode auto-read"
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${voiceModeActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>Voice</span>
                  {voiceModeActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              )}

              {/* Stop Audio Button if speaking */}
              {isSpeaking && (
                <button
                  type="button"
                  onClick={cancelSpeak}
                  className="rounded-md bg-neutral-200 px-2 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Stop audio"
                  title="Stop reading aloud"
                >
                  Stop ⏹
                </button>
              )}

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
                isSpeaking={speakingId === message.id}
                onToggleSpeak={() => speak(message.id, message.content)}
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

          {/* Active Listening / Mic Status Bar */}
          {listening && (
            <div className="flex items-center justify-between border-t border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2 truncate">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-medium">Listening to your voice...</span>
                <AudioEqualizer />
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="text-[11px] underline hover:text-emerald-950 dark:hover:text-white"
              >
                Done
              </button>
            </div>
          )}

          {/* Microphone permission or error message */}
          {speechError && (
            <div className="border-t border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200 flex justify-between items-center">
              <span>{speechError}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="border-t border-neutral-200 p-3 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2">
              {/* Mic button — only shown if browser supports SpeechRecognition (shortcut: Alt+M) */}
              {canListen && (
                <button
                  type="button"
                  aria-label={listening ? "Stop recording voice" : "Speak question"}
                  aria-pressed={listening}
                  title={listening ? "Stop recording voice" : "Speak question"}
                  onClick={() => (listening ? stopListening() : startListening())}
                  className={`flex-shrink-0 rounded-lg p-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${listening
                    ? "bg-red-500 text-white shadow-md ring-2 ring-red-400 animate-pulse"
                    : "border border-neutral-300 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                >
                  {listening ? (
                    // Stop square
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  ) : (
                    // Microphone icon
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                </button>
              )}

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
                placeholder={listening ? "Listening to your voice…" : "Ask about Aarya's work…"}
                aria-label="Your question"
                autoComplete="off"
                className={`${ui.input} ${listening ? "border-emerald-500 dark:border-emerald-500" : ""}`}
              />

              <button
                type="submit"
                disabled={!draft.trim() || isLoading}
                className={ui.sendButton}
              >
                Send
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="opacity-70">
                {voiceModeActive ? "🎙️ Voice Mode ON" : "Mic & Speaker ready"}
              </span>

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