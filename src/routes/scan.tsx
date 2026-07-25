import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Loader2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Plant Disease Scanner — Kisan Dost" },
      {
        name: "description",
        content:
          "Upload a leaf photo (camera or gallery) and get an instant AI diagnosis plus treatment plan in English, اردو or Roman Urdu.",
      },
      { property: "og:title", content: "Plant Disease Scanner" },
      { property: "og:description", content: "AI-powered plant disease diagnosis for farmers." },
    ],
  }),
  component: Scan,
});

function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [lang, setLang] = useState("English");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Image is too large (max 6 MB)");
      return;
    }
    // Downscale before base64
    const dataUrl = await downscale(file, 1024);
    setPreview(dataUrl);
    setResult(null);
  };

  const scan = async () => {
    if (!preview) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: preview, note, lang }),
      });
      const data = (await r.json()) as { result?: string; error?: string };
      if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
      setResult(data.result ?? "No response");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Plant Disease Scanner</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Take or upload a clear photo of the affected leaf. AI will suggest the likely disease and
        treatment.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-border bg-card p-4 shadow-card">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-xl object-cover" />
              <button
                onClick={() => {
                  setPreview(null);
                  setResult(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-background/85 p-1"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" />
              <div className="text-sm">Choose a plant photo</div>
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button variant="outline" onClick={() => cameraRef.current?.click()}>
              <Camera className="mr-1 h-4 w-4" /> Camera
            </Button>
            <Button variant="outline" onClick={() => galleryRef.current?.click()}>
              <ImageIcon className="mr-1 h-4 w-4" /> Gallery
            </Button>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note (crop name, symptoms)"
            rows={2}
            className="mt-3 w-full resize-none rounded-lg border border-border bg-background p-2 text-sm"
          />
          <div className="mt-2 flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Answer language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded border border-border bg-background px-2 py-1 text-xs"
            >
              <option>English</option>
              <option>Urdu</option>
              <option>Roman Urdu</option>
            </select>
          </div>
          <Button
            disabled={!preview || loading}
            onClick={scan}
            className="mt-3 w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Analysing…
              </>
            ) : (
              "Diagnose"
            )}
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            AI Diagnosis
          </div>
          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Reading leaves…
            </div>
          ) : result ? (
            <div className="prose prose-sm mt-2 max-w-none dark:prose-invert">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Upload a photo and press <strong>Diagnose</strong> to see AI recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

async function downscale(file: File, maxDim: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}
