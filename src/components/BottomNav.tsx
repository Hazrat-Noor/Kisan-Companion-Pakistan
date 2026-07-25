import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Leaf, MessageCircle, Camera, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/crops", label: "Crops", icon: Leaf },
  { to: "/scan", label: "Scan", icon: Camera },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/market", label: "Market", icon: TrendingUp },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-lg md:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {NAV.map((item) => {
          const active =
            item.to === "/" ? path === "/" : path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-all",
                  active
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "drop-shadow-[0_0_6px_var(--primary)]",
                  )}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
