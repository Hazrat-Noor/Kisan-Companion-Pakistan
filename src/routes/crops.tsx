import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X, History as HistoryIcon, Heart } from "lucide-react";
import { CROPS } from "@/lib/crops";
import { searchCrops } from "@/lib/i18n-search";
import { CropCard } from "@/components/CropCard";
import { searchHistory, favorites } from "@/lib/localstore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Library — Kisan Dost" },
      {
        name: "description",
        content:
          "Browse 15+ Pakistani crops with sowing, irrigation, fertiliser, pest and market details. Search in English, اردو or Roman Urdu.",
      },
      { property: "og:title", content: "Crop Library — Kisan Dost" },
      {
        property: "og:description",
        content: "Search Pakistani crops in English, اردو or Roman Urdu.",
      },
    ],
  }),
  component: CropsPage,
});

const CATEGORIES = ["All", "Cereal", "Cash", "Vegetable", "Fruit", "Pulse", "Oilseed"] as const;

function CropsPage() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [history, setHistory] = useState<string[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    setHistory(searchHistory.list());
    setFavs(favorites.list());
  }, []);

  const filtered = useMemo(() => {
    const base = submitted ? searchCrops(submitted) : CROPS;
    const byCat = cat === "All" ? base : base.filter((c) => c.category === cat);
    return showFavs ? byCat.filter((c) => favs.includes(c.id)) : byCat;
  }, [submitted, cat, showFavs, favs]);

  const runSearch = (value?: string) => {
    const term = (value ?? q).trim();
    setSubmitted(term);
    if (term) setHistory(searchHistory.push(term));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:py-8">
      {/* Sticky search bar */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-border/40 bg-background/85 px-4 py-3 backdrop-blur md:top-16">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: Wheat, گندم, Gandum, Kapaas…"
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm shadow-card outline-none transition focus:ring-2 focus:ring-ring"
              aria-label="Search crops"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setSubmitted("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-3 flex flex-wrap gap-1.5 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={
                "rounded-full px-3 py-1 text-xs font-medium transition " +
                (cat === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70")
              }
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setShowFavs((v) => !v)}
            className={
              "ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition " +
              (showFavs
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground hover:bg-muted/70")
            }
          >
            <Heart className={"h-3 w-3 " + (showFavs ? "fill-destructive" : "")} /> Favorites
          </button>
        </div>
      </div>

      {/* Search history */}
      {!submitted && history.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <HistoryIcon className="h-3 w-3" /> Recent searches
            <button
              onClick={() => {
                searchHistory.clear();
                setHistory([]);
              }}
              className="ml-auto text-[10px] uppercase tracking-wider hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h) => (
              <button
                key={h}
                onClick={() => {
                  setQ(h);
                  runSearch(h);
                }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-primary"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        {filtered.length} crop{filtered.length === 1 ? "" : "s"}
        {submitted && ` for "${submitted}"`}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No crops match "{submitted}". Try Wheat / گندم / Gandum.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => (
            <CropCard key={c.id} crop={c} />
          ))}
        </div>
      )}
    </div>
  );
}
