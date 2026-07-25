import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/weather")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const city = url.searchParams.get("city") ?? "Lahore,PK";
        const key = process.env.OPENWEATHER_API_KEY;
        if (!key) {
          return Response.json({ error: "OPENWEATHER_API_KEY missing" }, { status: 500 });
        }
        try {
          const r = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              city,
            )}&units=metric&appid=${key}`,
          );
          if (!r.ok) {
            const text = await r.text();
            return Response.json({ error: text || "weather fetch failed" }, { status: r.status });
          }
          const data = await r.json();
          return Response.json(
            {
              city: data.name,
              country: data.sys?.country,
              temp: Math.round(data.main?.temp),
              feels: Math.round(data.main?.feels_like),
              humidity: data.main?.humidity,
              wind: Math.round((data.wind?.speed ?? 0) * 3.6),
              condition: data.weather?.[0]?.main ?? "Clear",
              description: data.weather?.[0]?.description ?? "",
              icon: data.weather?.[0]?.icon ?? "01d",
            },
            { headers: { "cache-control": "public, max-age=600" } },
          );
        } catch (e) {
          return Response.json({ error: (e as Error).message }, { status: 502 });
        }
      },
    },
  },
});
