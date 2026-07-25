// Client-only localStorage helpers. Every reader must be called after mount.

const KEYS = {
  favorites: "kdp:favorites",
  history: "kdp:search-history",
  recent: "kdp:recent-crops",
  theme: "kdp:theme",
  chat: "kdp:chat-messages",
  lang: "kdp:lang",
} as const;

const safe = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!safe()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  if (!safe()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota exceeded */
  }
}

export const favorites = {
  list: () => read<string[]>(KEYS.favorites, []),
  toggle: (id: string) => {
    const cur = favorites.list();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(KEYS.favorites, next);
    return next;
  },
  has: (id: string) => favorites.list().includes(id),
};

export const searchHistory = {
  list: () => read<string[]>(KEYS.history, []),
  push: (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return searchHistory.list();
    const cur = searchHistory.list().filter((x) => x.toLowerCase() !== trimmed.toLowerCase());
    const next = [trimmed, ...cur].slice(0, 10);
    write(KEYS.history, next);
    return next;
  },
  clear: () => write(KEYS.history, []),
};

export const recentCrops = {
  list: () => read<string[]>(KEYS.recent, []),
  push: (id: string) => {
    const cur = recentCrops.list().filter((x) => x !== id);
    const next = [id, ...cur].slice(0, 8);
    write(KEYS.recent, next);
    return next;
  },
};

export const themeStore = {
  get: () => read<"light" | "dark">(KEYS.theme, "light"),
  set: (t: "light" | "dark") => write(KEYS.theme, t),
};

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string };
export const chatStore = {
  list: () => read<ChatMessage[]>(KEYS.chat, []),
  save: (messages: ChatMessage[]) => write(KEYS.chat, messages),
  clear: () => write(KEYS.chat, []),
};
