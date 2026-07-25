import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

// Plant disease detection — accepts a base64 data URL and returns a diagnosis.
export const Route = createFileRoute("/api/scan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          image?: string;
          note?: string;
          lang?: string;
        };
        if (!body.image || !body.image.startsWith("data:image/")) {
          return Response.json({ error: "Send a data:image/* base64 URL" }, { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "Missing LOVABLE_API_KEY" }, { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        try {
          const { text } = await generateText({
            model: gateway("openai/gpt-5.5"),
            messages: [
              {
                role: "system",
                content: `You are a Pakistani agriculture pathologist. Look at the plant photo and answer in the requested language (English / Urdu / Roman Urdu). Structure your answer with these EXACT markdown headings:
### 🌱 Plant / Crop
### 🦠 Likely Problem
### 🔍 Confidence
### 💊 Recommended Treatment
### 🛡️ Prevention
If the photo is not a plant or is too blurry, say so clearly and ask for another photo.`,
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text:
                      `Language: ${body.lang ?? "English"}. ` +
                      (body.note ? `Farmer note: ${body.note}` : "Diagnose this plant."),
                  },
                  { type: "image", image: body.image },
                ],
              },
            ],
          });
          return Response.json({ result: text });
        } catch (e) {
          return Response.json({ error: (e as Error).message }, { status: 502 });
        }
      },
    },
  },
});
