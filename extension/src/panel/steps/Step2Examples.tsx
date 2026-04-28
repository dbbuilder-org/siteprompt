import { useState, useEffect } from "react";
import type { InspirationSite } from "../../shared/types";

interface Props {
  sites: InspirationSite[];
  onChange: (s: InspirationSite[]) => void;
  onRequestScreenshot: () => void;
  pendingScreenshot: string;
  onScreenshotConsumed: () => void;
}

const EMPTY_SITE: InspirationSite = { url: "", name: "", whyYouLikeIt: "", screenshotDataUrl: "" };

export default function Step2Examples({ sites, onChange, onRequestScreenshot, pendingScreenshot, onScreenshotConsumed }: Props) {
  const [capturingFor, setCapturingFor] = useState<number | null>(null);

  // Receive screenshot
  useEffect(() => {
    if (pendingScreenshot && capturingFor !== null) {
      const updated = sites.map((s, i) =>
        i === capturingFor ? { ...s, screenshotDataUrl: pendingScreenshot } : s
      );
      onChange(updated);
      setCapturingFor(null);
      onScreenshotConsumed();
    }
  }, [pendingScreenshot]);

  const add = () => {
    if (sites.length < 3) onChange([...sites, { ...EMPTY_SITE }]);
  };

  const remove = (i: number) => onChange(sites.filter((_, idx) => idx !== i));

  const update = (i: number, patch: Partial<InspirationSite>) => {
    onChange(sites.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  };

  const capture = (i: number) => {
    setCapturingFor(i);
    onRequestScreenshot();
  };

  const handleImageUpload = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(i, { screenshotDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 step-scroll">
      <h2 className="font-bold text-gray-900 text-base mb-1">Design Inspiration</h2>
      <p className="text-xs text-gray-400 mb-4">
        Add up to 3 sites whose design you love. Navigate to a site in the browser, then capture a screenshot.
      </p>

      <div className="space-y-4">
        {sites.map((site, i) => (
          <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Site {i + 1}</span>
              <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 text-sm">× Remove</button>
            </div>

            <div className="space-y-2">
              <input
                type="url"
                value={site.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="https://example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="text"
                value={site.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="Nickname (e.g. 'Linear' or 'That clean SaaS site')"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <textarea
                value={site.whyYouLikeIt}
                onChange={(e) => update(i, { whyYouLikeIt: e.target.value })}
                placeholder="What do you love about this site's design? (layout, colors, vibe, typography...)"
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />

              {/* Screenshot */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => capture(i)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition ${
                    capturingFor === i
                      ? "border-brand-400 bg-brand-50 text-brand-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {capturingFor === i ? "Capturing…" : "Capture Screenshot"}
                </button>
                <label className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-300 transition cursor-pointer">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(i, e)} />
                </label>
              </div>

              {site.screenshotDataUrl && (
                <div className="relative mt-2">
                  <img
                    src={site.screenshotDataUrl}
                    alt={`Screenshot of ${site.name}`}
                    className="w-full rounded-lg border border-gray-200 max-h-32 object-cover"
                  />
                  <button
                    onClick={() => update(i, { screenshotDataUrl: "" })}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {sites.length < 3 && (
          <button
            onClick={add}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-400 hover:border-brand-300 hover:text-brand-500 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add inspiration site {sites.length + 1} of 3
          </button>
        )}

        {sites.length === 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Add at least one inspiration site to continue.
          </p>
        )}
      </div>
    </div>
  );
}
