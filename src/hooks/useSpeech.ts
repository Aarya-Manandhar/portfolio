// src/hooks/useSpeech.ts
// Wraps Web Speech API (SpeechRecognition + SpeechSynthesis) with natural voice tuning,
// markdown cleaning for clean audio, and voice selection handling.

import { useCallback, useEffect, useRef, useState } from "react";

// ── Types for Web Speech Recognition ─────────────────────────────────────────
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEventLike) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

// ── Browser capability detection ──────────────────────────────────────────────
const SpeechRecognitionCtor: SpeechRecognitionConstructor | null =
  typeof window !== "undefined"
    ? ((window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition ??
      null)
    : null;

export const canListen = SpeechRecognitionCtor !== null;
export const canSpeak =
  typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";

/**
 * Strips markdown symbols, code blocks, and URLs so speech synthesis sounds natural
 * and avoids reading punctuation like asterisks, hash signs, and full web links.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";

  return text
    // Remove copilot action tags if present
    .replace(/\[ACTION:[^\]]+\]/gi, "")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "code snippet omitted")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Replace markdown links [Label](url) with just Label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove raw URLs
    .replace(/https?:\/\/\S+/gi, "link")
    // Remove bold/italics
    .replace(/[*_~]{1,3}(.*?)[*_~]{1,3}/g, "$1")
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove blockquotes and list bullets
    .replace(/^\s*[-*+>]\s+/gm, "")
    // Remove emoji and extra symbols that sound robotic
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    // Clean up excessive whitespace
    .replace(/\s+/g, " ")
    .trim();
}

// ── Voice Cache & Loader ──────────────────────────────────────────────────────
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (!canSpeak) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && canSpeak) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (voices.length === 0) return null;

  // Prioritize premium, natural sounding English voices
  const preferred =
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google US English") ||
          v.name.includes("Samantha") ||
          v.name.includes("Jenny") ||
          v.name.includes("Guy") ||
          v.name.includes("Microsoft Aria"))
    ) ??
    voices.find((v) => v.lang.startsWith("en") && v.localService) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ??
    null;

  return preferred;
}

// ── useListen: microphone → transcript ───────────────────────────────────────
export function useListen(onTranscript: (text: string, isFinal: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  const start = useCallback(() => {
    if (!SpeechRecognitionCtor || listening) return;
    setError(null);

    try {
      const rec = new SpeechRecognitionCtor();
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = false; // automatically finalizes after a natural pause

      rec.onstart = () => {
        setListening(true);
      };

      rec.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const transcript = final || interim;
        if (transcript) {
          onTranscript(transcript, Boolean(final));
        }
      };

      rec.onend = () => {
        setListening(false);
        recRef.current = null;
      };

      rec.onerror = (event: SpeechRecognitionErrorEventLike) => {
        if (event.error !== "aborted" && event.error !== "no-speech") {
          console.warn("[useListen] SpeechRecognition error:", event.error);
          setError(event.error === "not-allowed" ? "Microphone access blocked" : "Speech recognition error");
        }
        setListening(false);
        recRef.current = null;
      };

      recRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn("[useListen] Failed to start recognition:", err);
      setListening(false);
    }
  }, [listening, onTranscript]);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  return { listening, error, start, stop };
}

// ── useSpeak: global text → speech manager ───────────────────────────────────
export function useSpeak() {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    if (!canSpeak) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    setCurrentId(null);
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!canSpeak) return;

      // If already speaking this exact message, toggle to stop
      if (currentId === id && isSpeaking) {
        cancel();
        return;
      }

      // Stop any active speech before starting new one
      cancel();

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voice = getBestVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setCurrentId(id);
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setCurrentId(null);
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        // Cancelled errors are normal when switching or closing
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("[useSpeak] Speech error:", e.error);
        }
        setCurrentId(null);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [cancel, currentId, isSpeaking]
  );

  useEffect(() => {
    return () => {
      if (canSpeak) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    speakingId: isSpeaking ? currentId : null,
    isSpeaking,
    speak,
    cancel,
  };
}
