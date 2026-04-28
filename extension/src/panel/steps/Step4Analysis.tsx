import { useState, useEffect } from "react";
import type { InspirationSite, SiteAnalysis } from "../../shared/types";
import { makeEmptyAnalysis } from "../../shared/types";

interface Props {
  sites: InspirationSite[];
  analyses: SiteAnalysis[];
  onChange: (a: SiteAnalysis[]) => void;
  onRequestRegionCapture: () => void;
  pendingScreenshot: string;
  onScreenshotConsumed: () => void;
}

function Checks<T extends Record<string, boolean | string>>({
  data,
  fields,
  onChange,
}: {
  data: T;
  fields: { key: keyof T; label: string }[];
  onChange: (patch: Partial<T>) => void;
}) {
  return (
    <div className="checkbox-row space-y-0.5">
      {fields.map(({ key, label }) => (
        <label key={String(key)} className="flex items-center gap-2 cursor-pointer py-0.5">
          <input
            type="checkbox"
            checked={!!data[key]}
            onChange={(e) => onChange({ [key]: e.target.checked } as Partial<T>)}
          />
          <span className="text-xs text-gray-600">{label}</span>
        </label>
      ))}
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
function Section({ title, children }: SectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-lg mb-2">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-3 pb-3 pt-1">{children}</div>}
    </div>
  );
}

export default function Step4Analysis({ sites, analyses, onChange, onRequestRegionCapture, pendingScreenshot, onScreenshotConsumed }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [capturingFor, setCapturingFor] = useState<number | null>(null);

  // Ensure we have an analysis for each site
  useEffect(() => {
    if (analyses.length < sites.length) {
      const filled = [...analyses];
      while (filled.length < sites.length) {
        filled.push(makeEmptyAnalysis(filled.length));
      }
      onChange(filled);
    }
  }, [sites.length]);

  // Receive screenshot for region capture
  useEffect(() => {
    if (pendingScreenshot && capturingFor !== null) {
      const updated = analyses.map((a, i) =>
        i === capturingFor ? { ...a, screenshots: [...a.screenshots, pendingScreenshot] } : a
      );
      onChange(updated);
      setCapturingFor(null);
      onScreenshotConsumed();
    }
  }, [pendingScreenshot]);

  if (sites.length === 0) {
    return (
      <div className="p-4">
        <p className="text-xs text-gray-400 text-center py-8">No inspiration sites added yet. Go back to step 2.</p>
      </div>
    );
  }

  const analysis = analyses[activeTab] || makeEmptyAnalysis(activeTab);
  const updateAnalysis = (patch: Partial<SiteAnalysis>) => {
    const updated = [...analyses];
    while (updated.length <= activeTab) updated.push(makeEmptyAnalysis(updated.length));
    updated[activeTab] = { ...updated[activeTab], ...patch };
    onChange(updated);
  };

  const captureRegion = () => {
    setCapturingFor(activeTab);
    onRequestRegionCapture();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateAnalysis({ screenshots: [...analysis.screenshots, reader.result as string] });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeScreenshot = (idx: number) => {
    updateAnalysis({ screenshots: analysis.screenshots.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Site tabs */}
      <div className="flex-none px-4 pt-3 pb-2">
        <h2 className="font-bold text-gray-900 text-base mb-1">Deep Dive Analysis</h2>
        <p className="text-xs text-gray-400 mb-3">For each site, check what you like and add notes.</p>
        <div className="flex gap-1">
          {sites.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition truncate ${
                activeTab === i ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s.name || `Site ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Site screenshot preview */}
        {sites[activeTab]?.screenshotDataUrl && (
          <img
            src={sites[activeTab].screenshotDataUrl}
            alt="Site preview"
            className="w-full rounded-lg border border-gray-200 max-h-28 object-cover mb-3"
          />
        )}

        {/* Typography */}
        <Section title="Typography">
          <Checks
            data={analysis.typography}
            fields={[
              { key: "serif", label: "Serif / Classic (Georgia, Playfair)" },
              { key: "sansSerif", label: "Sans-serif / Modern (Inter, Helvetica)" },
              { key: "display", label: "Display / Decorative / Script" },
              { key: "monospace", label: "Monospace / Technical" },
              { key: "mixed", label: "Mixed — uses multiple type styles" },
            ]}
            onChange={(p) => updateAnalysis({ typography: { ...analysis.typography, ...p } })}
          />
          <textarea
            value={analysis.typography.notes}
            onChange={(e) => updateAnalysis({ typography: { ...analysis.typography, notes: e.target.value } })}
            placeholder="Notes on fonts, sizing, hierarchy, weight contrast…"
            rows={2}
            className="w-full mt-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
          />
        </Section>

        {/* Layout */}
        <Section title="Layout">
          <Checks
            data={analysis.layout}
            fields={[
              { key: "singleColumn", label: "Single column / editorial" },
              { key: "multiGrid", label: "Multi-column grid" },
              { key: "heroCentered", label: "Large hero / centered focus" },
              { key: "cardBased", label: "Card-based sections" },
              { key: "asymmetric", label: "Asymmetric / dynamic" },
              { key: "fullWidth", label: "Full-width sections" },
            ]}
            onChange={(p) => updateAnalysis({ layout: { ...analysis.layout, ...p } })}
          />
          <textarea
            value={analysis.layout.notes}
            onChange={(e) => updateAnalysis({ layout: { ...analysis.layout, notes: e.target.value } })}
            placeholder="Notes on spacing, grid, section structure…"
            rows={2}
            className="w-full mt-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
          />
        </Section>

        {/* Colors */}
        <Section title="Colors">
          <Checks
            data={analysis.colors}
            fields={[
              { key: "light", label: "Light / airy" },
              { key: "dark", label: "Dark / moody" },
              { key: "vibrant", label: "Vibrant / bold" },
              { key: "muted", label: "Muted / earthy / pastel" },
              { key: "monochrome", label: "Monochrome / minimal palette" },
            ]}
            onChange={(p) => updateAnalysis({ colors: { ...analysis.colors, ...p } })}
          />
          <textarea
            value={analysis.colors.notes}
            onChange={(e) => updateAnalysis({ colors: { ...analysis.colors, notes: e.target.value } })}
            placeholder="Notes on specific colors, gradients, contrast…"
            rows={2}
            className="w-full mt-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
          />
        </Section>

        {/* Imagery */}
        <Section title="Imagery & Art">
          <Checks
            data={analysis.imagery}
            fields={[
              { key: "photography", label: "Photography / real images" },
              { key: "illustration", label: "Illustration / hand-drawn" },
              { key: "icons", label: "Icon-driven / pictograms" },
              { key: "geometric", label: "Geometric / abstract shapes" },
              { key: "minimal", label: "Minimal / mostly text" },
            ]}
            onChange={(p) => updateAnalysis({ imagery: { ...analysis.imagery, ...p } })}
          />
          <textarea
            value={analysis.imagery.notes}
            onChange={(e) => updateAnalysis({ imagery: { ...analysis.imagery, notes: e.target.value } })}
            placeholder="Notes on style, quality, composition…"
            rows={2}
            className="w-full mt-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
          />
        </Section>

        {/* Motion */}
        <Section title="Motion & Interaction">
          <Checks
            data={analysis.motion}
            fields={[
              { key: "subtleAnimations", label: "Subtle fade/slide animations" },
              { key: "boldTransitions", label: "Bold page/section transitions" },
              { key: "parallax", label: "Parallax / depth effects" },
              { key: "hoverEffects", label: "Rich hover states" },
              { key: "noMotion", label: "No animation / static" },
            ]}
            onChange={(p) => updateAnalysis({ motion: { ...analysis.motion, ...p } })}
          />
          <textarea
            value={analysis.motion.notes}
            onChange={(e) => updateAnalysis({ motion: { ...analysis.motion, notes: e.target.value } })}
            placeholder="Notes on specific interactions you love…"
            rows={2}
            className="w-full mt-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
          />
        </Section>

        {/* Specific elements */}
        <Section title="Specific Elements You Love">
          <textarea
            value={analysis.specificElements}
            onChange={(e) => updateAnalysis({ specificElements: e.target.value })}
            placeholder="e.g. The way the nav collapses into a floating pill on scroll, the bold section dividers, the gradient mesh background in the hero…"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
          />
        </Section>

        {/* Screenshots */}
        <Section title="Captured Screenshots / Details">
          <div className="flex gap-2 mb-2">
            <button
              onClick={captureRegion}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition ${
                capturingFor === activeTab
                  ? "border-brand-400 bg-brand-50 text-brand-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"
              }`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              {capturingFor === activeTab ? "Select region…" : "Grab Region"}
            </button>
            <label className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-300 transition cursor-pointer">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>
          {capturingFor === activeTab && (
            <p className="text-xs text-brand-600 bg-brand-50 rounded px-2 py-1 mb-2">
              Drag to select a region on the page. Click outside this panel.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {analysis.screenshots.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`Capture ${idx + 1}`} className="w-full rounded border border-gray-200 max-h-20 object-cover" />
                <button
                  onClick={() => removeScreenshot(idx)}
                  className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
