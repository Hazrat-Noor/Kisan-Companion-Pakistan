import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Mic, MicOff, RotateCw, Send, Share2, Sparkles, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatStore, type ChatMessage } from "@/lib/localstore";
import { useSpeechInput } from "@/hooks/use-speech";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Kisan Dost" },
      {
        name: "description",
        content:
          "Chat with the Kisan Dost AI in English, اردو or Roman Urdu. Voice input, image reference, and instant farming advice.",
      },
      { property: "og:title", content: "AI Farming Chat — Kisan Dost" },
      { property: "og:description", content: "Ask crop, pest, weather and market questions." },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "کپاس کی پیداوار کیسے بہتر کروں؟",
  "Gandum ke liye best fertilizer kaunsa hai?",
  "Wheat rust — how to control?",
  "Sugarcane ka rate Faisalabad mein?",
  "Tomato pe leaf curl virus ka ilaj",
];

function textFromParts(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function toUI(msgs: ChatMessage[]): UIMessage[] {
  return msgs.map((m) => ({
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: m.content }],
  })) as UIMessage[];
}
function fromUI(msgs: UIMessage[]): ChatMessage[] {
  return msgs.map((m) => ({
    id: m.id,
    role: m.role === "assistant" ? "assistant" : "user",
    content: textFromParts(m),
  }));
}

function ChatPage() {
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [lang, setLang] = useState<"en-US" | "ur-PK">("en-US");

  useEffect(() => {
    setInitial(toUI(chatStore.list()));
  }, []);

  if (!initial) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted-foreground">Loading…</div>
    );
  }
  return <Chat initial={initial} lang={lang} setLang={setLang} />;
}

function Chat({
  initial,
  lang,
  setLang,
}: {
  initial: UIMessage[];
  lang: "en-US" | "ur-PK";
  setLang: (l: "en-US" | "ur-PK") => void;
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, regenerate, setMessages } = useChat({
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message ?? "AI request failed"),
  });

  const speech = useSpeechInput(lang);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist
  useEffect(() => {
    chatStore.save(fromUI(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Auto-focus after mount and after a message finishes streaming
  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  const loading = status === "submitted" || status === "streaming";

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    void sendMessage({ text: value });
    setInput("");
  };

  const clearAll = () => {
    setMessages([]);
    chatStore.clear();
    toast.success("Conversation cleared");
  };

  const download = () => {
    const md = messages
      .map((m) => `**${m.role === "user" ? "You" : "Kisan Dost"}:**\n\n${textFromParts(m)}\n`)
      .join("\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kisan-dost-chat.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 py-4 md:h-[calc(100vh-6rem)] md:py-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" /> Kisan Dost AI
          </h1>
          <p className="text-xs text-muted-foreground">
            English • اردو • Roman Urdu — powered by Lovable AI
          </p>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "en-US" | "ur-PK")}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs"
            title="Voice language"
          >
            <option value="en-US">EN</option>
            <option value="ur-PK">اردو</option>
          </select>
          <Button size="icon" variant="ghost" onClick={clearAll} aria-label="Clear chat">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={download} aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4 shadow-card"
      >
        {messages.length === 0 && (
          <div className="mx-auto max-w-md py-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-hero shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="mt-3 font-semibold">How can I help you farm today?</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Ask about a crop, pest, fertilizer, weather or market price.
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = textFromParts(m);
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={cn("flex gap-3 animate-float-in", isUser && "justify-end")}
            >
              {!isUser && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-hero text-primary-foreground shadow">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] space-y-1",
                  isUser ? "text-right" : "text-left",
                )}
              >
                <div
                  className={cn(
                    "inline-block rounded-2xl px-4 py-2.5 text-sm",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{text}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-1 prose-headings:mt-2 prose-p:my-1">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {!isUser && text && (
                  <div className="flex gap-1 opacity-70">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        toast.success("Copied");
                      }}
                      className="rounded p-1 text-xs hover:bg-muted"
                      aria-label="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={async () => {
                        if (navigator.share) {
                          try {
                            await navigator.share({ text });
                          } catch {
                            /* cancelled */
                          }
                        } else {
                          navigator.clipboard.writeText(text);
                          toast.success("Copied to clipboard");
                        }
                      }}
                      className="rounded p-1 text-xs hover:bg-muted"
                      aria-label="Share"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => regenerate()}
                      className="rounded p-1 text-xs hover:bg-muted"
                      aria-label="Regenerate"
                    >
                      <RotateCw className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full gradient-hero text-primary-foreground animate-pulse-ring">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <div className="font-semibold text-destructive">Something went wrong</div>
            <div className="text-destructive/80">{error.message}</div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => regenerate()}>
              <RotateCw className="mr-1 h-3 w-3" /> Retry
            </Button>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-3 flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-card"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type in English, اردو or Roman Urdu…"
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none max-h-32"
          autoFocus
        />
        {speech.supported && (
          <Button
            type="button"
            size="icon"
            variant={speech.listening ? "destructive" : "ghost"}
            onClick={() =>
              speech.listening
                ? speech.stop()
                : speech.start((t) => {
                    setInput((prev) => (prev ? prev + " " : "") + t);
                    setTimeout(() => submit(t), 300);
                  })
            }
            aria-label={speech.listening ? "Stop" : "Voice input"}
            className={speech.listening ? "animate-pulse-ring" : ""}
          >
            {speech.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Button
          type="submit"
          size="icon"
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {speech.error && (
        <p className="mt-1 text-xs text-destructive">{speech.error}</p>
      )}
    </div>
  );
}
