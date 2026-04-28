/**
 * Generates the SitePrompt marketing PDF locally.
 * Run: node scripts/generate-marketing-pdf.mjs
 * Output: siteprompt-marketing.pdf
 */

import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import {
  Document, Page, Text, View, StyleSheet, Font, Link, Svg,
  Rect, Circle, Path, G, Defs, LinearGradient, Stop,
} from "@react-pdf/renderer";
import { writeFileSync } from "fs";

// Use built-in Helvetica family — no network fetch needed
Font.registerHyphenationCallback((w) => [w]);

const BRAND = "#6366f1";
const BRAND_DARK = "#4338ca";
const PURPLE = "#8b5cf6";
const CYAN = "#06b6d4";
const DARK = "#0f0a2e";
const GRAY = "#6b7280";

const s = StyleSheet.create({
  page: { backgroundColor: "#fff", padding: 0 },

  // Cover
  cover: { width: "100%", height: "100%", backgroundColor: DARK, padding: 0 },
  coverGrad: { position: "absolute", top: 0, left: 0, right: 0, height: 320, opacity: 0.3 },
  coverContent: { padding: 56, paddingTop: 80 },
  coverEyebrow: { fontSize: 11, letterSpacing: 2, color: "#a5b4fc", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 },
  coverTitle: { fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 16 },
  coverTitleAccent: { color: BRAND },
  coverSub: { fontSize: 16, color: "#c7d2fe", lineHeight: 1.6, maxWidth: 440, marginBottom: 40 },
  coverUrl: { fontSize: 13, color: "#818cf8", fontWeight: 600 },

  // Page sections
  section: { padding: "40px 48px" },
  sectionAlt: { padding: "40px 48px", backgroundColor: "#f8faff" },

  eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: BRAND, textTransform: "uppercase", marginBottom: 8 },
  h2: { fontSize: 26, fontWeight: 800, color: "#1e1b4b", lineHeight: 1.2, marginBottom: 10 },
  h3: { fontSize: 16, fontWeight: 700, color: "#1e1b4b", marginBottom: 6 },
  body: { fontSize: 11, color: GRAY, lineHeight: 1.7 },
  bodyDark: { fontSize: 11, color: "#374151", lineHeight: 1.7 },

  // Problem / Solution
  problemBox: { backgroundColor: "#fef2f2", borderRadius: 10, padding: 20, marginBottom: 12 },
  solutionBox: { backgroundColor: "#f0fdf4", borderRadius: 10, padding: 20, marginBottom: 12 },

  // Steps grid
  stepsRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  stepCard: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e0e7ff" },
  stepNum: { fontSize: 22, fontWeight: 900, color: "#e0e7ff", marginBottom: 6 },
  stepTitle: { fontSize: 12, fontWeight: 700, color: "#1e1b4b", marginBottom: 4 },
  stepDesc: { fontSize: 10, color: GRAY, lineHeight: 1.6 },

  // Feature row
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 18 },
  featureDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: BRAND, marginTop: 4, flexShrink: 0 },
  featureText: { flex: 1 },

  // Output cards
  outputCard: { backgroundColor: DARK, borderRadius: 12, padding: 20, marginBottom: 12 },
  outputLabel: { fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "#818cf8", textTransform: "uppercase", marginBottom: 6 },
  outputTitle: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 },
  outputDesc: { fontSize: 10, color: "#c7d2fe", lineHeight: 1.6 },

  // Pricing
  pricingRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  tierCard: { flex: 1, borderRadius: 12, padding: 20 },
  tierPrice: { fontSize: 26, fontWeight: 900, marginBottom: 4 },
  tierName: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
  tierDesc: { fontSize: 10, lineHeight: 1.6 },
  tierItem: { fontSize: 10, marginBottom: 3, lineHeight: 1.5 },

  // Testimonial
  quoteCard: { backgroundColor: "#fafafa", borderRadius: 12, padding: 24, borderLeft: `4px solid ${BRAND}` },
  quoteText: { fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 12 },
  quoteAuthor: { fontSize: 11, fontWeight: 700, color: "#1e1b4b" },
  quoteRole: { fontSize: 10, color: GRAY },

  // CTA page
  ctaPage: { width: "100%", height: "100%", backgroundColor: DARK, padding: 56, justifyContent: "center" },
  ctaTitle: { fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.15, textAlign: "center", marginBottom: 14 },
  ctaBody: { fontSize: 14, color: "#c7d2fe", textAlign: "center", lineHeight: 1.6, marginBottom: 40 },

  // Footer strip
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, height: 40, backgroundColor: DARK, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 48 },
  footerText: { fontSize: 9, color: "#6366f1" },

  divider: { height: 1, backgroundColor: "#e0e7ff", marginVertical: 24 },
  pill: { backgroundColor: "#e0e7ff", borderRadius: 999, paddingVertical: 4, paddingHorizontal: 12, alignSelf: "flex-start" },
  pillText: { fontSize: 10, fontWeight: 600, color: BRAND_DARK },
});

function Footer({ page }) {
  return React.createElement(View, { style: s.footer },
    React.createElement(Text, { style: s.footerText }, "SitePrompt by ServiceVision · siteprompt.servicevision.io"),
    React.createElement(Text, { style: s.footerText }, `Page ${page}`),
  );
}

function FeatureRow({ title, desc }) {
  return React.createElement(View, { style: s.featureRow },
    React.createElement(View, { style: s.featureDot }),
    React.createElement(View, { style: s.featureText },
      React.createElement(Text, { style: { fontSize: 12, fontWeight: 700, color: "#1e1b4b", marginBottom: 2 } }, title),
      React.createElement(Text, { style: s.body }, desc),
    )
  );
}

function MarketingPDF() {
  return React.createElement(Document, { title: "SitePrompt — Design Brief Platform" },

    // ─── PAGE 1: COVER ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: s.cover },

        // Gradient accent bars
        React.createElement(View, { style: { position: "absolute", top: 0, left: 0, width: "60%", height: 6, backgroundColor: BRAND } }),
        React.createElement(View, { style: { position: "absolute", top: 0, left: "60%", width: "25%", height: 6, backgroundColor: PURPLE } }),
        React.createElement(View, { style: { position: "absolute", top: 0, left: "85%", width: "15%", height: 6, backgroundColor: CYAN } }),

        React.createElement(View, { style: s.coverContent },
          React.createElement(View, { style: s.pill },
            React.createElement(Text, { style: s.pillText }, "Design Brief Platform · Chrome Extension · 2026")
          ),

          React.createElement(View, { style: { height: 32 } }),

          React.createElement(Text, { style: s.coverTitle },
            "From inspiration\nto prototype-ready\n",
            React.createElement(Text, { style: { color: BRAND } }, "in 10 minutes")
          ),

          React.createElement(View, { style: { height: 20 } }),
          React.createElement(Text, { style: s.coverSub },
            "SitePrompt is a Chrome extension wizard that walks you through distilling what you love about up to 3 design-inspiration sites into a structured brief — then hands you a PDF and three levels of Claude Design prompts so your prototype looks right from the very first try."
          ),

          // Stats row
          React.createElement(View, { style: { flexDirection: "row", gap: 24, marginBottom: 48 } },
            ...[
              { n: "6", label: "Wizard steps" },
              { n: "3", label: "Prompt levels" },
              { n: "~10", label: "Minutes to complete" },
              { n: "1", label: "Click to PDF" },
            ].map(({ n, label }) =>
              React.createElement(View, { key: label, style: { alignItems: "center" } },
                React.createElement(Text, { style: { fontSize: 28, fontWeight: 900, color: "#fff" } }, n),
                React.createElement(Text, { style: { fontSize: 10, color: "#818cf8", marginTop: 2 } }, label),
              )
            )
          ),

          React.createElement(View, { style: { height: 1, backgroundColor: "#312e81", marginBottom: 24 } }),
          React.createElement(Text, { style: s.coverUrl }, "siteprompt.servicevision.io"),
          React.createElement(Text, { style: { fontSize: 10, color: "#6366f1", marginTop: 4 } }, "A ServiceVision product · © 2026"),
        ),
      )
    ),

    // ─── PAGE 2: THE PROBLEM + SOLUTION ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: s.section },
        React.createElement(Text, { style: s.eyebrow }, "The Challenge"),
        React.createElement(Text, { style: s.h2 }, "Most design briefs miss what actually matters"),
        React.createElement(Text, { style: { ...s.body, marginBottom: 24 } },
          "Designers and founders know exactly what they want their brand to feel like — they can point to other sites and say \"I want something like that.\" But translating that into actionable direction for AI tools or developers is where things fall apart."
        ),

        React.createElement(View, { style: { flexDirection: "row", gap: 14 } },
          React.createElement(View, { style: { ...s.problemBox, flex: 1 } },
            React.createElement(Text, { style: { fontSize: 13, fontWeight: 700, color: "#b91c1c", marginBottom: 8 } }, "❌  Without SitePrompt"),
            ...[
              "\"Make it look like Linear\" gives AI nothing to work with",
              "Vague color references lead to generic palettes",
              "Typography preferences are lost in translation",
              "Multiple revision cycles burn time and budget",
              "AI-generated prototypes miss the mark on first try",
            ].map(p => React.createElement(View, { key: p, style: { flexDirection: "row", gap: 6, marginBottom: 5 } },
              React.createElement(Text, { style: { fontSize: 10, color: "#b91c1c" } }, "•"),
              React.createElement(Text, { style: { fontSize: 10, color: "#7f1d1d", lineHeight: 1.5 } }, p),
            ))
          ),
          React.createElement(View, { style: { ...s.solutionBox, flex: 1 } },
            React.createElement(Text, { style: { fontSize: 13, fontWeight: 700, color: "#15803d", marginBottom: 8 } }, "✓  With SitePrompt"),
            ...[
              "Structured 6-step wizard captures all design intent",
              "Screenshot capture locks in the exact elements you love",
              "Typography, layout, color, motion — all documented",
              "Claude synthesizes it into precise, actionable prompts",
              "First prototype looks right — not 'close enough'",
            ].map(p => React.createElement(View, { key: p, style: { flexDirection: "row", gap: 6, marginBottom: 5 } },
              React.createElement(Text, { style: { fontSize: 10, color: "#15803d" } }, "•"),
              React.createElement(Text, { style: { fontSize: 10, color: "#14532d", lineHeight: 1.5 } }, p),
            ))
          ),
        ),

        React.createElement(View, { style: s.divider }),

        React.createElement(Text, { style: s.eyebrow }, "The Solution"),
        React.createElement(Text, { style: s.h2 }, "A wizard that thinks like a designer"),
        React.createElement(Text, { style: s.body },
          "SitePrompt is a Chrome extension that opens as a side panel on any website. It guides you through a structured interview — capturing exactly what you love about each inspiration site — and then uses Claude to synthesize everything into a PDF design brief and three levels of Claude Design prompts."
        ),
      ),
      React.createElement(Footer, { page: "2" })
    ),

    // ─── PAGE 3: THE 6 STEPS ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: { ...s.section, paddingBottom: 20 } },
        React.createElement(Text, { style: s.eyebrow }, "How It Works"),
        React.createElement(Text, { style: s.h2 }, "Six focused steps — about 10 minutes"),

        React.createElement(View, { style: s.stepsRow },
          ...[
            { n: "01", title: "Your Brand", desc: "Name, purpose, claim to fame, color palette with pickers, logo upload, current site URL." },
            { n: "02", title: "Inspiration Sites", desc: "Add up to 3 URLs. Capture full-page or drag-to-select region screenshots inline." },
            { n: "03", title: "Distill Aesthetic", desc: "Choose your style (minimal/bold/warm/professional/playful), audience, and the emotion to convey." },
          ].map(({ n, title, desc }) =>
            React.createElement(View, { key: n, style: s.stepCard },
              React.createElement(Text, { style: s.stepNum }, n),
              React.createElement(Text, { style: s.stepTitle }, title),
              React.createElement(Text, { style: s.stepDesc }, desc),
            )
          )
        ),

        React.createElement(View, { style: { ...s.stepsRow, marginTop: 12 } },
          ...[
            { n: "04", title: "Deep Dive Analysis", desc: "Per-site checkboxes for typography, layout, colors, imagery & motion — plus notes and region captures." },
            { n: "05", title: "Review Brief", desc: "All collected data assembled into a proof with a readiness check before generation." },
            { n: "06", title: "Get Your Output", desc: "PDF brief + 3 Claude Design prompt levels + consult CTA — all in one final screen." },
          ].map(({ n, title, desc }) =>
            React.createElement(View, { key: n, style: s.stepCard },
              React.createElement(Text, { style: s.stepNum }, n),
              React.createElement(Text, { style: s.stepTitle }, title),
              React.createElement(Text, { style: s.stepDesc }, desc),
            )
          )
        ),

        React.createElement(View, { style: s.divider }),

        React.createElement(Text, { style: s.eyebrow }, "Key Capabilities"),
        React.createElement(View, { style: { flexDirection: "row", gap: 24 } },
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(FeatureRow, { title: "Built-in Screen Grabber", desc: "Drag to select any region of the current page — captures exact elements you love." }),
            React.createElement(FeatureRow, { title: "Smart Color Pickers", desc: "Up to 6 brand colors with native pickers and one-click preset swatches." }),
            React.createElement(FeatureRow, { title: "Session Persistence", desc: "Your wizard progress auto-saves locally — resume where you left off." }),
          ),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(FeatureRow, { title: "Claude-Powered Synthesis", desc: "Sends your brief to Claude Sonnet 4.6 — designed by world-class UX strategists." }),
            React.createElement(FeatureRow, { title: "One-Click PDF Export", desc: "Beautifully formatted PDF with all brief data, palette, and prompts." }),
            React.createElement(FeatureRow, { title: "Clerk Auth + Dashboard", desc: "Sign in to save and revisit past briefs across sessions." }),
          ),
        ),
      ),
      React.createElement(Footer, { page: "3" })
    ),

    // ─── PAGE 4: OUTPUT ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: s.sectionAlt },
        React.createElement(Text, { style: s.eyebrow }, "What You Walk Away With"),
        React.createElement(Text, { style: s.h2 }, "Three ready-to-use deliverables"),
        React.createElement(Text, { style: { ...s.body, marginBottom: 24 } },
          "Every SitePrompt brief generates three distinct outputs — from a shareable document to production-ready AI prompts."
        ),

        React.createElement(View, { style: s.outputCard },
          React.createElement(Text, { style: s.outputLabel }, "Output 1"),
          React.createElement(Text, { style: s.outputTitle }, "📄  PDF Design Brief"),
          React.createElement(Text, { style: s.outputDesc },
            "A polished A4 document capturing your brand identity, design preferences, inspiration site analyses, color palette, and design synthesis. Shareable with any designer, developer, or AI tool. Includes the Claude prompts and the ServiceVision consult offer."
          ),
        ),

        React.createElement(View, { style: s.outputCard },
          React.createElement(Text, { style: s.outputLabel }, "Output 2 — Three Prompt Levels"),
          React.createElement(Text, { style: s.outputTitle }, "✨  Claude Design Prompts"),
          React.createElement(View, { style: { marginTop: 10, gap: 8 } },
            ...[
              { tier: "⚡ Quick Prototype", desc: "200–300 words. Paste into claude.ai/design for a landing page prototype in under 2 minutes." },
              { tier: "🎨 Full Design System", desc: "400–600 words. Comprehensive site prompt with component library direction, spacing, and brand tokens." },
              { tier: "📐 Complete Specification", desc: "600–900 words. Full MVP spec including component states, responsive behavior, design tokens, and interaction patterns." },
            ].map(({ tier, desc }) =>
              React.createElement(View, { key: tier, style: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 12 } },
                React.createElement(Text, { style: { fontSize: 11, fontWeight: 700, color: "#a5b4fc", marginBottom: 4 } }, tier),
                React.createElement(Text, { style: { fontSize: 10, color: "#c7d2fe", lineHeight: 1.5 } }, desc),
              )
            )
          ),
        ),

        React.createElement(View, { style: s.outputCard },
          React.createElement(Text, { style: s.outputLabel }, "Output 3"),
          React.createElement(Text, { style: s.outputTitle }, "🚀  Build-It-For-You Offer"),
          React.createElement(Text, { style: s.outputDesc },
            "Integrated call-to-action to schedule a free 30-minute consultation with ServiceVision — who turns SitePrompt briefs into real, deployed products at three price points."
          ),
        ),
      ),
      React.createElement(Footer, { page: "4" })
    ),

    // ─── PAGE 5: PRICING ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: s.section },
        React.createElement(Text, { style: s.eyebrow }, "ServiceVision Build Packages"),
        React.createElement(Text, { style: s.h2 }, "SitePrompt is free — building is where\nServiceVision comes in"),
        React.createElement(Text, { style: { ...s.body, marginBottom: 8 } },
          "The SitePrompt Chrome extension is completely free. ServiceVision offers three tiers to turn your brief into a live product."
        ),

        React.createElement(View, { style: s.pricingRow },

          // Starter
          React.createElement(View, { style: { ...s.tierCard, backgroundColor: "#f8faff", border: "1.5px solid #e0e7ff" } },
            React.createElement(Text, { style: { ...s.tierPrice, color: BRAND } }, "$999"),
            React.createElement(Text, { style: s.tierName }, "Starter"),
            React.createElement(Text, { style: { ...s.tierDesc, color: GRAY, marginBottom: 12 } }, "Ideal for landing pages, portfolios, and concept validation."),
            ...[
              "1 landing page prototype",
              "Hero + 3 content sections + CTA",
              "Mobile-responsive",
              "Claude Design-generated",
              "Handoff-ready code",
            ].map(i => React.createElement(View, { key: i, style: { flexDirection: "row", gap: 6, marginBottom: 4 } },
              React.createElement(Text, { style: { fontSize: 9, color: BRAND } }, "✓"),
              React.createElement(Text, { style: { fontSize: 9, color: "#374151" } }, i),
            )),
          ),

          // Growth
          React.createElement(View, { style: { ...s.tierCard, backgroundColor: DARK, border: `2px solid ${BRAND}` } },
            React.createElement(View, { style: { backgroundColor: BRAND, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 10, alignSelf: "flex-start", marginBottom: 10 } },
              React.createElement(Text, { style: { fontSize: 9, fontWeight: 700, color: "#fff" } }, "MOST POPULAR"),
            ),
            React.createElement(Text, { style: { ...s.tierPrice, color: "#a5b4fc" } }, "$4,999"),
            React.createElement(Text, { style: { ...s.tierName, color: "#fff" } }, "Growth"),
            React.createElement(Text, { style: { ...s.tierDesc, color: "#c7d2fe", marginBottom: 12 } }, "For startups and businesses needing a full site or app prototype."),
            ...[
              "Multi-page site or app prototype",
              "Full design system + component library",
              "Figma handoff file",
              "Clerk auth integration",
              "2 revision rounds",
              "Deployed on Vercel",
            ].map(i => React.createElement(View, { key: i, style: { flexDirection: "row", gap: 6, marginBottom: 4 } },
              React.createElement(Text, { style: { fontSize: 9, color: "#818cf8" } }, "✓"),
              React.createElement(Text, { style: { fontSize: 9, color: "#e0e7ff" } }, i),
            )),
          ),

          // Enterprise
          React.createElement(View, { style: { ...s.tierCard, backgroundColor: "#1e1b4b", border: "1.5px solid #312e81" } },
            React.createElement(Text, { style: { ...s.tierPrice, color: CYAN } }, "$19,999"),
            React.createElement(Text, { style: { ...s.tierName, color: "#fff" } }, "Enterprise"),
            React.createElement(Text, { style: { ...s.tierDesc, color: "#c7d2fe", marginBottom: 12 } }, "Full-stack MVP — from brief to deployed, investable product."),
            ...[
              "Full-stack MVP build",
              "Database + API + auth",
              "Admin dashboard",
              "CI/CD pipeline",
              "3 months support",
              "Investor-demo ready",
            ].map(i => React.createElement(View, { key: i, style: { flexDirection: "row", gap: 6, marginBottom: 4 } },
              React.createElement(Text, { style: { fontSize: 9, color: CYAN } }, "✓"),
              React.createElement(Text, { style: { fontSize: 9, color: "#e0e7ff" } }, i),
            )),
          ),
        ),

        React.createElement(View, { style: { ...s.divider, marginTop: 28 } }),

        // Testimonial placeholder
        React.createElement(View, { style: s.quoteCard },
          React.createElement(Text, { style: s.quoteText },
            "\"I spent 3 hours trying to describe my vision to an AI. With SitePrompt I was done in 12 minutes and the first Claude prototype was 90% there. The structured analysis of my inspiration sites was the key — I never would have thought to break it down that way.\""
          ),
          React.createElement(Text, { style: s.quoteAuthor }, "Founder, B2B SaaS Startup"),
          React.createElement(Text, { style: s.quoteRole }, "Used the Growth package · Launched in 6 weeks"),
        ),
      ),
      React.createElement(Footer, { page: "5" })
    ),

    // ─── PAGE 6: TECH + INSTALL ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: s.sectionAlt },
        React.createElement(Text, { style: s.eyebrow }, "Under the Hood"),
        React.createElement(Text, { style: s.h2 }, "Built on best-in-class infrastructure"),

        React.createElement(View, { style: { flexDirection: "row", gap: 20, marginBottom: 24 } },
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: s.h3 }, "Chrome Extension"),
            React.createElement(Text, { style: s.body }, "Manifest V3 · React 18 + Vite + Tailwind CSS · Service worker architecture · chrome.storage persistence · Region screen capture · postMessage iframe bridge"),
          ),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: s.h3 }, "Web App & API"),
            React.createElement(Text, { style: s.body }, "Next.js 16 App Router · Clerk authentication · Anthropic SDK (Claude Sonnet 4.6) · @react-pdf/renderer · Vercel Fluid Compute · Cloudflare DNS"),
          ),
        ),

        React.createElement(View, { style: s.divider }),

        React.createElement(Text, { style: s.eyebrow }, "Install in 3 Steps"),
        React.createElement(Text, { style: s.h2 }, "No Chrome Web Store required"),

        React.createElement(View, { style: { flexDirection: "row", gap: 14, marginTop: 16 } },
          ...[
            { n: "1", title: "Download & Unzip", desc: "Get siteprompt-extension-v0.1.0.zip from github.com/dbbuilder-org/siteprompt/releases and unzip to get the dist/ folder." },
            { n: "2", title: "Enable Dev Mode", desc: "Navigate to chrome://extensions and toggle Developer mode ON in the top-right corner." },
            { n: "3", title: "Load Unpacked", desc: "Click Load unpacked → select the dist/ folder. Pin SitePrompt to your toolbar." },
          ].map(({ n, title, desc }) =>
            React.createElement(View, { key: n, style: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e0e7ff" } },
              React.createElement(View, { style: { width: 28, height: 28, borderRadius: 14, backgroundColor: BRAND, alignItems: "center", justifyContent: "center", marginBottom: 10 } },
                React.createElement(Text, { style: { fontSize: 13, fontWeight: 800, color: "#fff" } }, n),
              ),
              React.createElement(Text, { style: { fontSize: 12, fontWeight: 700, color: "#1e1b4b", marginBottom: 6 } }, title),
              React.createElement(Text, { style: { fontSize: 10, color: GRAY, lineHeight: 1.6 } }, desc),
            )
          )
        ),

        React.createElement(View, { style: { marginTop: 24, backgroundColor: "#e0e7ff", borderRadius: 10, padding: 16 } },
          React.createElement(Text, { style: { fontSize: 12, fontWeight: 700, color: "#1e1b4b", marginBottom: 4 } }, "Full install guide"),
          React.createElement(Text, { style: { fontSize: 11, color: "#4338ca" } }, "https://dbbuilder-org.github.io/siteprompt/"),
        ),
      ),
      React.createElement(Footer, { page: "6" })
    ),

    // ─── PAGE 7: CTA ───
    React.createElement(Page, { size: "A4", style: s.page },
      React.createElement(View, { style: s.ctaPage },

        // Top bar
        React.createElement(View, { style: { position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: BRAND } }),

        React.createElement(View, { style: { width: 56, height: 56, borderRadius: 14, backgroundColor: BRAND, marginBottom: 32, alignSelf: "center" } }),

        React.createElement(Text, { style: s.ctaTitle },
          "Turn your vision into\na real product"
        ),
        React.createElement(Text, { style: s.ctaBody },
          "SitePrompt captures what you love.\nServiceVision builds it.\nSchedule a free 30-minute consultation and let's bring your brief to life."
        ),

        // URL box
        React.createElement(View, { style: { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: 12, padding: 20, marginBottom: 32, alignItems: "center" } },
          React.createElement(Text, { style: { fontSize: 11, color: "#818cf8", marginBottom: 8 } }, "Schedule your free consult"),
          React.createElement(Text, { style: { fontSize: 16, fontWeight: 700, color: "#a5b4fc" } }, "calendly.com/servicevision/siteprompt"),
        ),

        // Pricing row
        React.createElement(View, { style: { flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 40 } },
          ...[
            { price: "$999", name: "Starter", sub: "Landing page" },
            { price: "$4,999", name: "Growth", sub: "Full site/app" },
            { price: "$19,999", name: "Enterprise", sub: "Full-stack MVP" },
          ].map(({ price, name, sub }) =>
            React.createElement(View, { key: name, style: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 16, alignItems: "center", minWidth: 110 } },
              React.createElement(Text, { style: { fontSize: 20, fontWeight: 900, color: "#a5b4fc", marginBottom: 4 } }, price),
              React.createElement(Text, { style: { fontSize: 11, fontWeight: 700, color: "#fff" } }, name),
              React.createElement(Text, { style: { fontSize: 9, color: "#818cf8", marginTop: 2 } }, sub),
            )
          )
        ),

        React.createElement(View, { style: { height: 1, backgroundColor: "#312e81", marginBottom: 24 } }),

        React.createElement(Text, { style: { fontSize: 11, color: "#6366f1", textAlign: "center" } },
          "siteprompt.servicevision.io  ·  chris@servicevision.net  ·  servicevision.net"
        ),
      )
    ),
  );
}

const buffer = await renderToBuffer(React.createElement(MarketingPDF));
writeFileSync("siteprompt-marketing.pdf", buffer);
console.log("✓ Written: siteprompt-marketing.pdf");
