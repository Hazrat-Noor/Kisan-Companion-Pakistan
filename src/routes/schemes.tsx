import { createFileRoute } from "@tanstack/react-router";
import { SCHEMES } from "@/lib/schemes";
import { Landmark, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes — Kisan Dost" },
      {
        name: "description",
        content:
          "Pakistani government schemes for farmers: Kisan Card, Green Tractor, solar tubewell subsidy, wheat support price and more.",
      },
      { property: "og:title", content: "Government Agriculture Schemes" },
      { property: "og:description", content: "Federal and provincial farmer welfare schemes." },
    ],
  }),
  component: Schemes,
});

function Schemes() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold">Government Schemes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Federal and provincial programmes that support Pakistani farmers.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {SCHEMES.map((s) => (
          <article
            key={s.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">{s.title}</h2>
                <div className="text-xs text-muted-foreground">{s.agency}</div>
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.description}</p>
            {s.link && (
              <a
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Official page <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
