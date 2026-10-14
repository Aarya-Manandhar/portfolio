import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatApiResponse, ChatMessage } from "../types/chat";
import { getClientFallbackReply } from "../data/fallbackQA";

export const MAX_INPUT_CHARS = 1500; // keep in sync with MAX_INPUT_CHARS in api/chat.js
const HISTORY_LIMIT = 6; // keep in sync with MAX_HISTORY in api/chat.js
const REQUEST_TIMEOUT_MS = 20_000;
const WELCOME_ID = "welcome";

export const WELCOME_MESSAGE: ChatMessage = {
  id: WELCOME_ID,
  role: "assistant",
  content:
    "Hi! I'm Aarya's AI assistant. Ask about his work at Nabil Bank, projects, or screen a Job Description against his skills.",
};

class ChatRequestError extends Error { }

function describeFailure(err: unknown, timedOut: boolean): string {
  if (err instanceof ChatRequestError) return err.message;
  if (timedOut) return "That took too long. Please try again in a moment.";
  return "I couldn't reach the assistant. Please try again, or use the Contact section to reach Aarya directly.";
}

/** The messages we send to the server: no welcome text, no errors, no question that never got an answer. */
function buildHistory(messages: ChatMessage[], latest: ChatMessage) {
  const all = [...messages, latest];
  return all
    .filter((m, i) => {
      if (m.id === WELCOME_ID || m.isError) return false;
      if (m.role === "user" && all[i + 1]?.isError) return false;
      return true;
    })
    .slice(-HISTORY_LIMIT)
    .map(({ role, content }) => ({ role, content }));
}

function inferActionFromText(userText: string, assistantText: string): { type: "navigate" | "theme"; target: string } | undefined {
  const user = userText.toLowerCase();
  const assistant = assistantText.toLowerCase();

  if (/toggle\s*(dark|light|theme)|switch\s*(theme|to\s*dark|to\s*light)/i.test(user)) {
    return { type: "theme", target: "toggle" };
  }
  if (/(take|show|view|scroll|navigate|go).*(projects|work|apps)/i.test(user) || /(scrolling|navigating|take you).*(projects)/i.test(assistant)) {
    return { type: "navigate", target: "projects" };
  }
  if (/(specsense|case\s*study)/i.test(user) && /(show|take|view|open|scroll|navigate|tell)/i.test(user)) {
    return { type: "navigate", target: "case-study" };
  }
  if (/(education|degree|university|college)/i.test(user) && /(take|show|view|scroll|navigate|where)/i.test(user)) {
    return { type: "navigate", target: "education" };
  }
  if (/(contact|email|reach|hire)/i.test(user) && /(take|show|how|reach|contact)/i.test(user)) {
    return { type: "navigate", target: "contact" };
  }
  if (/(about\s*me|bio|background)/i.test(user) && /(take|show|view|scroll)/i.test(user)) {
    return { type: "navigate", target: "about" };
  }
  return undefined;
}

function parseAction(text: string, userPrompt = ""): { cleanedText: string; action?: { type: "navigate" | "theme"; target: string } } {
  const match = text.match(/\[ACTION:(navigate|theme):?([^\]]*)\]/i);
  if (match) {
    const type = match[1].toLowerCase() as "navigate" | "theme";
    const target = match[2]?.trim() || "";
    const cleanedText = text.replace(/\[ACTION:[^\]]+\]/gi, "").trim();
    return { cleanedText, action: { type, target } };
  }

  // Fallback: Infer intent if server didn't emit tag
  const inferred = inferActionFromText(userPrompt, text);
  return { cleanedText: text, action: inferred };
}

export function useChat(endpoint = "/api/chat") {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const counter = useRef(0);
  const session = useRef(0); // bumped by reset() so late responses from an old chat are ignored
  const controllerRef = useRef<AbortController | null>(null);
  const unmounted = useRef(false);

  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
      controllerRef.current?.abort();
    };
  }, []);

  const nextId = () => `m${++counter.current}`;

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_INPUT_CHARS);
      if (!text || isLoading) return;

      const userMessage: ChatMessage = { id: nextId(), role: "user", content: text };
      const history = buildHistory(messages, userMessage);
      const mySession = session.current;

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const controller = new AbortController();
      controllerRef.current = controller;
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, REQUEST_TIMEOUT_MS);

      const stale = () => unmounted.current || session.current !== mySession;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (response.status === 429) {
          throw new ChatRequestError("Lots of questions at once. Please wait a minute and try again.");
        }
        if (!response.ok) {
          throw new ChatRequestError("Something went wrong on my side. Please try again in a moment.");
        }

        const data = (await response.json()) as Partial<ChatApiResponse>;
        if (typeof data.reply !== "string" || data.reply.trim() === "") {
          throw new ChatRequestError("I got an empty answer. Please try rephrasing your question.");
        }
        if (stale()) return;

        const { cleanedText, action } = parseAction(data.reply, text);
        const source = typeof data.source === "string" ? data.source : undefined;
        const topScore = typeof data.topScore === "number" ? data.topScore : undefined;
        const topId = typeof data.topId === "string" ? data.topId : undefined;

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content: cleanedText,
            source,
            topScore,
            topId,
            action,
          },
        ]);
      } catch (err) {
        if (stale()) return;
        const fallback = getClientFallbackReply(text);
        if (fallback) {
          const { cleanedText, action } = parseAction(fallback, text);
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: cleanedText,
              source: "retrieval",
              action,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "assistant", content: describeFailure(err, timedOut), isError: true },
          ]);
        }
      } finally {
        clearTimeout(timer);
        if (!stale()) setIsLoading(false);
      }
    },
    [endpoint, isLoading, messages],
  );

  const reset = useCallback(() => {
    session.current += 1;
    controllerRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, send, reset };
}
