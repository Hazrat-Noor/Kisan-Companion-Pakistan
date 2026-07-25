import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `You are Kisan Dost — a friendly, expert agriculture assistant for Pakistani farmers.

Rules:
1. Answer in the SAME LANGUAGE the user used. Support English, Urdu (اردو script) and Roman Urdu (Urdu written with English letters). If unsure of the language, mirror the last user message.
2. Be precise. If the user names a specific crop (e.g. "cotton" / "کپاس" / "kapaas"), ONLY answer about that crop — do not mix in other crops.
3. If the user's question or crop name is unclear, ask ONE short clarifying question in the same language before answering.
4. Prefer practical Pakistan-specific advice: local varieties, provinces (Punjab, Sindh, KPK, Balochistan), Rabi/Kharif seasons, PKR prices per 40 kg maund, and inputs available at Pakistani dealers.
5. Keep answers concise, use short bullet points and headings, and give clear next steps.
6. Warn about pesticide safety and recommend consulting the local Agriculture Extension Officer for major decisions.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Missing messages", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("openai/gpt-5.5"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});
