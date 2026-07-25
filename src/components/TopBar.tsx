import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, MessageCircle, Camera, TrendingUp, Landmark, Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/crops", label: "Crop Library", icon: Leaf },
  { to: "/scan", label: "Disease Scan", icon: Camera },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
  { to: "/market", label: "Market", icon: TrendingUp },
  { to: "/schemes", label: "Schemes", icon: Landmark },
] as const;

export function TopBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero shadow-glow">
            <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">Kisan Dost</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Pakistan
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
