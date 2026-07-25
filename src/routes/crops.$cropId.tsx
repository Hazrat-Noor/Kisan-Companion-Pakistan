import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin, Sprout } from "lucide-react";
import { cropById } from "@/lib/crops";
import { favorites, recentCrops } from "@/lib/localstore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crops/$cropId")({
  loader: ({ params }) => {
    const crop = cropById(params.cropId);
    if (!crop) throw notFound();
    return { crop };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.crop;
    return {
      meta: [
        { title: `${c?.name_en ?? "Crop"} (${c?.name_ur ?? ""}) — Kisan Dost` },
        {
          name: "description",
          content: c
            ? `Complete guide to ${c.name_en} (${c.name_ur}, ${c.name_roman}) — sowing, irrigation, fertiliser, pest and market details for Pakistan.`
            : "Crop details",
        },
        { property: "og:title", content: `${c?.name_en ?? "Crop"} — Kisan Dost` },
        { property: "og:description", content: `Complete crop guide for ${c?.name_en}` },
        ...(c?.image
          ? [
              { property: "og:image", content: c.image },
              { name: "twitter:image", content: c.image },
            ]
          : []),
      ],
    };
  },
  component: CropDetail,
});

const SECTIONS: { key: keyof ReturnType<typeof cropById> & string; label: string }[] = [
  { key: "sowing", label: "Sowing time" },
  { key: "harvest", label: "Harvesting time" },
  { key: "temperature", label: "Temperature" },
  { key: "rainfall", label: "Rainfall" },
  { key: "soil", label: "Soil type" },
  { key: "fertilizer", label: "Fertilizer schedule" },
  { key: "irrigation", label: "Irrigation schedule" },
  { key: "weed", label: "Weed management" },
  { key: "pest", label: "Pest management" },
  { key: "disease", label: "Disease management" },
  { key: "yield", label: "Expected yield" },
  { key: "storage", label: "Storage" },
  { key: "market", label: "Market demand" },
];

function CropDetail() {
  const { crop } = Route.useLoaderData();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(favorites.has(crop.id));
    recentCrops.push(crop.id);
  }, [crop.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 md:py-8">
      <Link
        to="/crops"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="relative aspect-[16/7] overflow-hidden bg-muted">
          <img src={crop.image} alt={crop.name_en} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80">{crop.category}</div>
              <h1 className="mt-1 text-3xl font-bold drop-shadow md:text-4xl">
                {crop.emoji} {crop.name_en}
              </h1>
              <div className="mt-1 text-sm opacity-90">
                <span dir="rtl" className="font-semibold">
                  {crop.name_ur}
                </span>{" "}
                • {crop.name_roman} • <em>{crop.scientific}</em>
              </div>
            </div>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setFav(favorites.toggle(crop.id).includes(crop.id))}
              className="rounded-full"
              aria-label="Toggle favorite"
            >
              <Heart className={cn("h-4 w-4", fav && "fill-destructive text-destructive")} />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded-xl bg-muted/60 p-4">
            <div className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
              <MapPin className="h-3 w-3" /> Suitable provinces
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {crop.provinces.map((p) => (
                <span key={p} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-muted/60 p-4">
            <div className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
              <Sprout className="h-3 w-3" /> Key districts
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {crop.districts.map((d) => (
                <span key={d} className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent-foreground">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <section key={s.key} className="rounded-2xl border border-border bg-card p-4 shadow-card animate-float-in">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {s.label}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
              {String((crop as Record<string, unknown>)[s.key] ?? "—")}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm">
        Need specific advice? Ask the{" "}
        <Link to="/chat" className="font-semibold text-primary hover:underline">
          Kisan Dost AI
        </Link>{" "}
        about <strong>{crop.name_en}</strong>.
      </div>
    </div>
  );
}
