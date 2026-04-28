import { useState } from "react";
import type { WizardSession, GenerateResponse } from "../../shared/types";

interface Props {
  session: WizardSession;
  generated: GenerateResponse;
  onDownloadPdf: () => void;
  onReset: () => void;
}

const TIERS = [
  { price: "$999", name: "Starter", desc: "Landing page prototype", highlight: false },
  { price: "$4,999", name: "Growth", desc: "Full site or app prototype + design system", highlight: true },
  { price: "$19,999", name: "Enterprise", desc: "Full-stack MVP — design, code, deploy", highlight: false },
];

function PromptBox({ label, text, color }: { label: string; text: string; color: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={`border rounded-xl mb-3 overflow-hidden ${color}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/60 hover:bg-white/90 transition font-medium"
        >
          {copied ? "✓ Copied!" : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="px-3 py-2.5 max-h-40 overflow-y-auto">
        <p className="text-xs leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

export default function Step6Final({ session, generated, onDownloadPdf, onReset }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    onDownloadPdf();
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="p-4 step-scroll">
      {/* Success header */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="font-bold text-gray-900 text-base">Your Design Brief is Ready!</h2>
        <p className="text-xs text-gray-400 mt-1">Claude has synthesized your inspiration into actionable prompts.</p>
      </div>

      {/* Design synthesis */}
      <div className="bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-xl p-3 mb-4">
        <div className="text-xs font-semibold text-brand-700 mb-1">Design Synthesis</div>
        <p className="text-xs text-gray-700 leading-relaxed">{generated.summary}</p>
      </div>

      {/* PDF download */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-brand-200 text-brand-700 font-semibold text-xs hover:bg-brand-50 transition mb-4 disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        {downloading ? "Preparing PDF…" : "Download PDF Report"}
      </button>

      {/* Claude Design Prompts */}
      <div className="mb-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">Claude Design Prompts</div>
        <p className="text-xs text-gray-400 mb-3">
          Paste any of these into{" "}
          <a href="https://claude.ai/design" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
            claude.ai/design
          </a>{" "}
          to generate your prototype.
        </p>

        <PromptBox
          label="⚡ Quick Prototype"
          text={generated.quickPrompt}
          color="border-green-200 bg-green-50 text-green-700"
        />
        <PromptBox
          label="🎨 Full Design System"
          text={generated.fullPrompt}
          color="border-blue-200 bg-blue-50 text-blue-700"
        />
        <PromptBox
          label="📐 Complete Specification"
          text={generated.specPrompt}
          color="border-purple-200 bg-purple-50 text-purple-700"
        />
      </div>

      {/* CTA */}
      <div className="bg-gray-900 rounded-xl p-4 mt-4">
        <div className="text-sm font-bold text-white mb-1">Ready to build for real?</div>
        <p className="text-xs text-gray-400 mb-3">ServiceVision turns your SitePrompt brief into a real product.</p>
        <div className="space-y-2 mb-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                t.highlight ? "bg-brand-600 text-white" : "bg-gray-800 text-gray-200"
              }`}
            >
              <div>
                <span className="text-xs font-bold">{t.name}</span>
                <span className="text-xs ml-2 opacity-70">{t.desc}</span>
              </div>
              <span className="text-sm font-black">{t.price}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendly.com/servicevision/siteprompt"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2.5 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
        >
          Schedule a Free 30-min Consult →
        </a>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition py-1"
      >
        Start a new brief
      </button>
    </div>
  );
}
