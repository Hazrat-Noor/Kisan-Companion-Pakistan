import { useEffect, useRef, useState, useCallback } from "react";

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getRecognizer(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechInput(lang = "en-US") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(!!getRecognizer());
  }, []);

  const start = useCallback(
    (onText: (text: string) => void) => {
      const Ctor = getRecognizer();
      if (!Ctor) {
        setError("Voice input isn't supported in this browser. Please type instead.");
        return;
      }
      try {
        const rec = new Ctor();
        rec.lang = lang;
        rec.continuous = false;
        rec.interimResults = false;
        rec.onresult = (e) => {
          const t = e.results?.[0]?.[0]?.transcript ?? "";
          if (t) onText(t);
        };
        rec.onerror = () => {
          setError("Microphone unavailable. Please type your message.");
          setListening(false);
        };
        rec.onend = () => setListening(false);
        recRef.current = rec;
        setError(null);
        setListening(true);
        rec.start();
      } catch {
        setError("Could not start voice input. Please type instead.");
        setListening(false);
      }
    },
    [lang],
  );

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
}
