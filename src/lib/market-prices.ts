// Indicative wholesale market rates (PKR/maund) — updated seasonally.
// These are static reference values; live prices need a paid market feed.
export type MarketPrice = {
  cropId: string;
  crop: string;
  unit: string;
  lowPKR: number;
  highPKR: number;
  trend: "up" | "down" | "flat";
  market: string;
};

export const MARKET_PRICES: MarketPrice[] = [
  { cropId: "wheat", crop: "Wheat", unit: "40 kg", lowPKR: 3800, highPKR: 4200, trend: "up", market: "Lahore" },
  { cropId: "rice", crop: "Basmati Rice (Paddy)", unit: "40 kg", lowPKR: 4500, highPKR: 5500, trend: "up", market: "Gujranwala" },
  { cropId: "cotton", crop: "Cotton (Phutti)", unit: "40 kg", lowPKR: 8500, highPKR: 9500, trend: "flat", market: "Multan" },
  { cropId: "maize", crop: "Maize", unit: "40 kg", lowPKR: 2400, highPKR: 2800, trend: "down", market: "Okara" },
  { cropId: "sugarcane", crop: "Sugarcane", unit: "40 kg", lowPKR: 425, highPKR: 500, trend: "flat", market: "Faisalabad" },
  { cropId: "potato", crop: "Potato", unit: "40 kg", lowPKR: 1800, highPKR: 2600, trend: "up", market: "Sahiwal" },
  { cropId: "tomato", crop: "Tomato", unit: "40 kg", lowPKR: 2200, highPKR: 4500, trend: "up", market: "Karachi" },
  { cropId: "onion", crop: "Onion", unit: "40 kg", lowPKR: 2500, highPKR: 3800, trend: "up", market: "Hyderabad" },
  { cropId: "chili", crop: "Red Chili (dry)", unit: "40 kg", lowPKR: 22000, highPKR: 28000, trend: "flat", market: "Kunri" },
  { cropId: "mango", crop: "Mango (Chaunsa)", unit: "40 kg", lowPKR: 3500, highPKR: 6500, trend: "up", market: "Multan" },
  { cropId: "citrus", crop: "Kinnow", unit: "40 kg", lowPKR: 1600, highPKR: 2400, trend: "flat", market: "Sargodha" },
  { cropId: "gram", crop: "Gram (Chana)", unit: "40 kg", lowPKR: 12000, highPKR: 15000, trend: "up", market: "Bhakkar" },
];
