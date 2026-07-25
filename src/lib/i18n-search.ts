import { CROPS, type Crop } from "./crops";

// Normalize Urdu/Arabic diacritics and lowercase everything.
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u0652\u0670\u0674\u06D6-\u06ED]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export function searchCrops(query: string): Crop[] {
  const q = normalize(query);
  if (!q) return CROPS;
  return CROPS.filter((c) => {
    const hay = [c.name_en, c.name_ur, c.name_roman, c.scientific, c.category, ...c.aliases]
      .map(normalize)
      .join(" | ");
    return hay.includes(q);
  });
}
