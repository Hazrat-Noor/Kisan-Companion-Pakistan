import { useEffect, useState } from "react";
import { Cloud, CloudRain, Droplets, Sun, Wind, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Weather = {
  city: string;
  country: string;
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  condition: string;
  description: string;
  icon: string;
  error?: string;
};

const iconFor = (cond: string) => {
  const c = cond.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return CloudRain;
  if (c.includes("cloud")) return Cloud;
  return Sun;
};

export function WeatherCard({ city = "Lahore,PK" }: { city?: string }) {
  const [data, setData] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <div className="mb-1 font-semibold text-foreground">Weather unavailable</div>
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-3 h-10 w-24" />
        <Skeleton className="mt-3 h-4 w-full" />
      </div>
    );
  }

  const Icon = iconFor(data.condition);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--sky)" }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {data.city}, {data.country}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">{data.temp}</span>
            <span className="text-lg text-muted-foreground">°C</span>
          </div>
          <div className="text-sm capitalize text-muted-foreground">{data.description}</div>
        </div>
        <Icon className="h-14 w-14 text-primary" strokeWidth={1.6} />
      </div>
      <div className="relative mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Droplets className="h-3 w-3" /> Humidity
          </div>
          <div className="mt-0.5 font-semibold">{data.humidity}%</div>
        </div>
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wind className="h-3 w-3" /> Wind
          </div>
          <div className="mt-0.5 font-semibold">{data.wind} km/h</div>
        </div>
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="text-muted-foreground">Feels</div>
          <div className="mt-0.5 font-semibold">{data.feels}°C</div>
        </div>
      </div>
    </div>
  );
}
