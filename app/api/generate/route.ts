import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { WizardSession, GenerateResponse } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPromptContext(session: WizardSession): string {
  const { brand, inspirationSites, distillation, siteAnalyses } = session;

  const colorList = brand.colors.join(", ");
  const siteSummaries = inspirationSites.map((site, i) => {
    const analysis = siteAnalyses[i];
    if (!analysis) return `- ${site.name} (${site.url}): ${site.whyYouLikeIt}`;
    const typo = Object.entries(analysis.typography)
      .filter(([k, v]) => v === true)
      .map(([k]) => k).join(", ");
    const layout = Object.entries(analysis.layout)
      .filter(([k, v]) => v === true)
      .map(([k]) => k).join(", ");
    const colorStyle = Object.entries(analysis.colors)
      .filter(([k, v]) => v === true)
      .map(([k]) => k).join(", ");
    return `- ${site.name} (${site.url}):
    Why they love it: ${site.whyYouLikeIt}
    Typography: ${typo}${analysis.typography.notes ? ` — ${analysis.typography.notes}` : ""}
    Layout: ${layout}${analysis.layout.notes ? ` — ${analysis.layout.notes}` : ""}
    Colors: ${colorStyle}${analysis.colors.notes ? ` — ${analysis.colors.notes}` : ""}
    Specific elements: ${analysis.specificElements}`;
  }).join("\n\n");

  return `BRAND BRIEF:
Name: ${brand.name}
Purpose: ${brand.purpose}
Claim to fame / unique value: ${brand.claimToFame}
Brand colors: ${colorList}
${brand.currentSiteUrl ? `Current site: ${brand.currentSiteUrl}` : ""}

AESTHETIC PREFERENCES:
Overall aesthetic: ${distillation.overallAesthetic}
Primary audience: ${distillation.primaryAudience}
Emotion to convey: ${distillation.emotionToConvey}
What to avoid: ${distillation.whatToAvoid}

DESIGN INSPIRATION SITES:
${siteSummaries}`;
}

const SYSTEM = `You are a world-class UI/UX designer and brand strategist. Given a detailed design brief, you write precise, actionable prompts for Claude Design (an AI tool that generates full site prototypes). Your prompts are vivid, specific, and reference real design principles. Always include: color palette, typography direction, layout approach, emotional tone, and specific UI components.`;

export async function POST(req: NextRequest) {
  try {
    const { session } = await req.json() as { session: WizardSession };
    const context = buildPromptContext(session);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Based on this design brief, generate three Claude Design prompts at different levels of depth. Also write a 2-3 sentence design synthesis summary.

${context}

Respond in this exact JSON format (no markdown, just JSON):
{
  "summary": "2-3 sentence synthesis of the design direction",
  "quickPrompt": "A concise 200-300 word Claude Design prompt for a landing page prototype",
  "fullPrompt": "A detailed 400-600 word Claude Design prompt for a full multi-page site with design system",
  "specPrompt": "A comprehensive 600-900 word Claude Design prompt with complete specifications for a full-stack prototype including component specs, design tokens, interaction states, and responsive behavior"
}`,
        },
      ],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    let parsed: GenerateResponse;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON from the response
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse Claude response");
      parsed = JSON.parse(match[0]);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
