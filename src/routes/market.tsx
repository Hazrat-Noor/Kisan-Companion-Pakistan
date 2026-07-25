import { createFileRoute } from "@tanstack/react-router";
import { MARKET_PRICES } from "@/lib/market-prices";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Prices — Kisan Dost" },
      {
        name: "description",
        content:
          "Indicative wholesale prices for major Pakistani crops — wheat, cotton, rice, sugarcane, potato and more (PKR per 40 kg maund).",
      },
      { property: "og:title", content: "Market Prices — Kisan Dost" },
      { property: "og:description", content: "Wholesale crop prices across Pakistan." },
    ],
  }),
  component: Market,
});

function Market() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold">Market Prices</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Indicative wholesale rates from major Pakistani mandis. Contact your local <em>arhati</em>{" "}
        for real-time quotes.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Crop</th>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3 text-right">Range (PKR)</th>
              <th className="px-4 py-3 text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {MARKET_PRICES.map((p) => {
              const TrendIcon =
                p.trend === "up" ? TrendingUp : p.trend === "down" ? TrendingDown : Minus;
              return (
                <tr key={p.cropId} className="border-t border-border/60 hover:bg-muted/40">
                  <td className="px-4 py-3 font-semibold">{p.crop}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.market}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.unit}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {p.lowPKR.toLocaleString()}–{p.highPKR.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={
                        "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium " +
                        (p.trend === "up"
                          ? "bg-primary/10 text-primary"
                          : p.trend === "down"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground")
                      }
                    >
                      <TrendIcon className="h-3 w-3" /> {p.trend}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
