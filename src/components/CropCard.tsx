import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import { favorites } from "@/lib/localstore";
import type { Crop } from "@/lib/crops";
import { cn } from "@/lib/utils";

export function CropCard({ crop }: { crop: Crop }) {
  const [fav, setFav] = useState(false);
  // hydrate after mount
  useState(() => {
    if (typeof window !== "undefined") {
      queueMicrotask(() => setFav(favorites.has(crop.id)));
    }
  });

  return (
    <Link
      to="/crops/$cropId"
      params={{ cropId: crop.id }}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow animate-float-in"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={crop.image}
          alt={crop.name_en}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
        <div className="absolute left-3 top-3 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
          {crop.category}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFav(favorites.toggle(crop.id).includes(crop.id));
          }}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur transition hover:scale-110"
          aria-label="Toggle favorite"
        >
          <Heart
            className={cn("h-4 w-4", fav ? "fill-destructive text-destructive" : "text-foreground")}
          />
        </button>
        <div className="absolute bottom-2 left-3 right-3 flex items-baseline justify-between text-white">
          <div className="text-lg font-bold drop-shadow">
            {crop.emoji} {crop.name_en}
          </div>
          <div className="text-sm font-semibold" dir="rtl">
            {crop.name_ur}
          </div>
        </div>
      </div>
      <div className="p-3 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{crop.name_roman}</div>
        <div className="mt-0.5 truncate italic">{crop.scientific}</div>
      </div>
    </Link>
  );
}
