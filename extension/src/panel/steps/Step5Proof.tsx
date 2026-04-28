import type { WizardSession, WizardStep } from "../../shared/types";

interface Props {
  session: WizardSession;
  onEdit: (step: WizardStep) => void;
  onGenerate: () => void;
  generating: boolean;
  genError: string;
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="mb-1.5">
      <span className="text-xs font-medium text-gray-500">{label}: </span>
      <span className="text-xs text-gray-800">{value}</span>
    </div>
  );
}

function Card({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">{title}</span>
        <button onClick={onEdit} className="text-xs text-gray-400 hover:text-brand-500 transition">Edit →</button>
      </div>
      {children}
    </div>
  );
}

export default function Step5Proof({ session, onEdit, onGenerate, generating, genError }: Props) {
  const { brand, inspirationSites, distillation, siteAnalyses } = session;

  return (
    <div className="p-4 step-scroll">
      <h2 className="font-bold text-gray-900 text-base mb-1">Review Your Brief</h2>
      <p className="text-xs text-gray-400 mb-4">
        Here's everything we've gathered. Review and edit before generating your prompts.
      </p>

      {/* Brand */}
      <Card title="Your Brand" onEdit={() => onEdit(1)}>
        <Row label="Name" value={brand.name} />
        <Row label="Purpose" value={brand.purpose} />
        <Row label="Claim to Fame" value={brand.claimToFame} />
        {brand.currentSiteUrl && <Row label="Current Site" value={brand.currentSiteUrl} />}
        {brand.colors.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-500">Colors: </span>
            <div className="inline-flex gap-1.5 mt-1">
              {brand.colors.map((c, i) => (
                <span key={i} className="inline-block w-5 h-5 rounded border border-gray-200" style={{ background: c }} title={c} />
              ))}
              <span className="text-xs text-gray-400 ml-1">{brand.colors.join(" · ")}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Aesthetic */}
      <Card title="Aesthetic Preferences" onEdit={() => onEdit(3)}>
        <Row label="Style" value={distillation.overallAesthetic} />
        <Row label="Audience" value={distillation.primaryAudience} />
        <Row label="Emotion" value={distillation.emotionToConvey} />
        <Row label="Avoid" value={distillation.whatToAvoid} />
        {!distillation.overallAesthetic && !distillation.primaryAudience && (
          <p className="text-xs text-amber-600">No preferences set yet.</p>
        )}
      </Card>

      {/* Inspiration sites */}
      <Card title="Inspiration Sites" onEdit={() => onEdit(2)}>
        {inspirationSites.length === 0 ? (
          <p className="text-xs text-amber-600">No sites added.</p>
        ) : (
          <div className="space-y-3">
            {inspirationSites.map((site, i) => {
              const a = siteAnalyses[i];
              return (
                <div key={i} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  {site.screenshotDataUrl && (
                    <img src={site.screenshotDataUrl} alt={site.name} className="w-full rounded mb-1.5 max-h-16 object-cover border border-gray-100" />
                  )}
                  <div className="text-xs font-medium text-gray-800">{site.name || `Site ${i + 1}`}</div>
                  {site.url && <div className="text-xs text-gray-400 truncate">{site.url}</div>}
                  {site.whyYouLikeIt && <div className="text-xs text-gray-600 mt-0.5 italic">"{site.whyYouLikeIt}"</div>}
                  {a && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(a.typography).filter(([k, v]) => v === true).map(([k]) => (
                        <span key={k} className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                      {Object.entries(a.colors).filter(([k, v]) => v === true).map(([k]) => (
                        <span key={k} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                      {Object.entries(a.layout).filter(([k, v]) => v === true).map(([k]) => (
                        <span key={k} className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Deep dive summary */}
      {siteAnalyses.some((a) => a.specificElements) && (
        <Card title="Specific Elements" onEdit={() => onEdit(4)}>
          {siteAnalyses.map((a, i) => a.specificElements && (
            <div key={i} className="mb-2">
              <span className="text-xs font-medium text-gray-500">{inspirationSites[i]?.name || `Site ${i + 1}`}: </span>
              <span className="text-xs text-gray-600">{a.specificElements}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Readiness check */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 mb-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">Readiness Check</div>
        {[
          { ok: !!brand.name, label: "Brand name" },
          { ok: !!brand.purpose, label: "Purpose / description" },
          { ok: brand.colors.length > 0, label: "Color palette" },
          { ok: inspirationSites.length > 0, label: "At least one inspiration site" },
          { ok: !!distillation.overallAesthetic, label: "Aesthetic preference" },
        ].map(({ ok, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs py-0.5">
            <span className={ok ? "text-green-500" : "text-gray-300"}>
              {ok ? "✓" : "○"}
            </span>
            <span className={ok ? "text-gray-700" : "text-gray-400"}>{label}</span>
          </div>
        ))}
      </div>

      {genError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 text-xs text-red-600">
          {genError}
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={generating || !brand.name || inspirationSites.length === 0}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:from-brand-700 hover:to-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {generating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generating with Claude…
          </>
        ) : (
          <>✨ Generate Design Prompts</>
        )}
      </button>
      <p className="text-xs text-gray-400 text-center mt-2">
        Claude will synthesize your brief and write 3 levels of Claude Design prompts.
      </p>
    </div>
  );
}
