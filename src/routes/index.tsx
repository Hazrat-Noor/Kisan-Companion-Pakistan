import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Camera,
  Leaf,
  MessageCircle,
  Newspaper,
  Sparkles,
  TrendingUp,
  Landmark,
} from "lucide-react";
import { WeatherCard } from "@/components/WeatherCard";
import { CROPS, cropById } from "@/lib/crops";
import { MARKET_PRICES } from "@/lib/market-prices";
import { recentCrops } from "@/lib/localstore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kisan Dost Pakistan — Home" },
      {
        name: "description",
        content:
          "Live weather, market prices, crop library and AI advice — everything a Pakistani farmer needs, in English, Urdu and Roman Urdu.",
      },
      { property: "og:title", content: "Kisan Dost Pakistan — Home" },
      {
        property: "og:description",
        content: "Live weather, market prices, crop library and AI advice for Pakistani farmers.",
      },
    ],
  }),
  component: Home,
});

const QUICK = [
  { to: "/crops", icon: Leaf, label: "Crop Library", color: "from-emerald-500 to-green-600" },
  { to: "/scan", icon: Camera, label: "Disease Scan", color: "from-lime-500 to-emerald-600" },
  { to: "/chat", icon: MessageCircle, label: "AI Chat", color: "from-teal-500 to-emerald-600" },
  { to: "/market", icon: TrendingUp, label: "Market", color: "from-amber-500 to-orange-600" },
  { to: "/schemes", icon: Landmark, label: "Govt Schemes", color: "from-sky-500 to-indigo-600" },
] as const;

const TIPS = [
  "Water wheat early morning to reduce evaporation and improve absorption.",
  "Rotate cotton with pulses to break the pink bollworm cycle and boost soil nitrogen.",
  "Test soil every two years — a Rs. 500 test can save Rs. 5,000 in fertilizer.",
  "Use pheromone traps in mango orchards to monitor fruit fly before spraying.",
];
const NEWS = [
  "Federal wheat support price expected to be revised ahead of Rabi season.",
  "Punjab launches new solar-tubewell subsidy round — 60% cost share for small farmers.",
  "Basmati rice exports up 12% year-on-year; new EU MRL rules effective next quarter.",
];

function seasonalSuggestions(): string[] {
  const m = new Date().getMonth() + 1;
  if (m >= 4 && m <= 7) return ["cotton", "rice", "maize", "sugarcane"];
  if (m >= 10 || m <= 2) return ["wheat", "gram", "mustard", "potato"];
  return ["tomato", "onion", "sunflower", "chili"];
}

function Home() {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(recentCrops.list()), []);

  const seasonal = useMemo(() => seasonalSuggestions().map(cropById).filter(Boolean), []);
  const featured = CROPS.slice(0, 6);
  const tip = TIPS[new Date().getDate() % TIPS.length];
  const news = NEWS[new Date().getDate() % NEWS.length];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:py-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-primary-foreground shadow-glow md:p-10">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3 w-3" /> AI Farming Assistant
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
            Grow smarter with <span className="text-accent">Kisan Dost</span>
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/85 md:text-base">
            Weather, market prices, crop guides and AI advice in English, اردو &amp; Roman Urdu.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/crops">
                Explore crops <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"
            >
              <Link to="/chat">Ask AI</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-5">
        {QUICK.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.to}
              to={q.to}
              className={`group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center text-xs font-medium shadow-card transition hover:-translate-y-0.5 hover:shadow-glow animate-float-in`}
            >
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${q.color} text-white shadow-md`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {q.label}
            </Link>
          );
        })}
      </section>

      {/* Weather + Tip + News */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <WeatherCard city="Lahore,PK" />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-accent" /> Tip of the day
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{tip}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Newspaper className="h-4 w-4 text-primary" /> Agri news
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{news}</p>
        </div>
      </section>

      {/* Recently viewed */}
      {recent.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Recently viewed</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recent
              .map(cropById)
              .filter(Boolean)
              .map((c) => (
                <Link
                  key={c!.id}
                  to="/crops/$cropId"
                  params={{ cropId: c!.id }}
                  className="shrink-0 rounded-2xl border border-border bg-card px-4 py-3 shadow-card transition hover:shadow-glow"
                >
                  <div className="text-2xl">{c!.emoji}</div>
                  <div className="mt-1 text-sm font-semibold">{c!.name_en}</div>
                  <div className="text-xs text-muted-foreground" dir="rtl">
                    {c!.name_ur}
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Seasonal */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">In season now</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {seasonal.map(
            (c) =>
              c && (
                <Link
                  key={c.id}
                  to="/crops/$cropId"
                  params={{ cropId: c.id }}
                  className="rounded-2xl border border-border bg-card p-4 shadow-card transition hover:shadow-glow"
                >
                  <div className="text-3xl">{c.emoji}</div>
                  <div className="mt-2 font-semibold">{c.name_en}</div>
                  <div className="text-xs text-muted-foreground">{c.sowing}</div>
                </Link>
              ),
          )}
        </div>
      </section>

      {/* Market snapshot */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Market snapshot</h2>
          <Link to="/market" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {MARKET_PRICES.slice(0, 6).map((p) => (
            <div
              key={p.cropId}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-card"
            >
              <div>
                <div className="text-sm font-semibold">{p.crop}</div>
                <div className="text-xs text-muted-foreground">
                  {p.market} • per {p.unit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">
                  Rs {p.lowPKR.toLocaleString()}–{p.highPKR.toLocaleString()}
                </div>
                <div
                  className={
                    p.trend === "up"
                      ? "text-xs font-medium text-primary"
                      : p.trend === "down"
                        ? "text-xs font-medium text-destructive"
                        : "text-xs font-medium text-muted-foreground"
                  }
                >
                  {p.trend === "up" ? "▲ Rising" : p.trend === "down" ? "▼ Falling" : "◼ Stable"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured crops */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured crops</h2>
          <Link to="/crops" className="text-sm text-primary hover:underline">
            Browse library →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {featured.map((c) => (
            <Link
              key={c.id}
              to="/crops/$cropId"
              params={{ cropId: c.id }}
              className="rounded-2xl border border-border bg-card p-4 shadow-card transition hover:shadow-glow"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-2 font-semibold">{c.name_en}</div>
              <div className="text-xs text-muted-foreground" dir="rtl">
                {c.name_ur}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
