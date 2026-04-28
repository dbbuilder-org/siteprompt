import type { DistillationAnswers, BrandInfo, InspirationSite } from "../../shared/types";

interface Props {
  distillation: DistillationAnswers;
  brand: BrandInfo;
  sites: InspirationSite[];
  onChange: (d: DistillationAnswers) => void;
}

const AESTHETICS = [
  { value: "minimal", label: "Minimal & Clean", desc: "White space, restraint, clarity" },
  { value: "bold", label: "Bold & Dramatic", desc: "High contrast, strong type, commanding" },
  { value: "warm", label: "Warm & Friendly", desc: "Inviting, approachable, human" },
  { value: "professional", label: "Professional & Corporate", desc: "Trustworthy, authoritative, structured" },
  { value: "playful", label: "Playful & Creative", desc: "Expressive, colorful, unexpected" },
] as const;

export default function Step3Distillation({ distillation, brand, sites, onChange }: Props) {
  const set = (patch: Partial<DistillationAnswers>) => onChange({ ...distillation, ...patch });

  return (
    <div className="p-4 step-scroll">
      <h2 className="font-bold text-gray-900 text-base mb-1">Distill Your Aesthetic</h2>
      <p className="text-xs text-gray-400 mb-4">
        Answer these questions to help us understand your ideal design direction for {brand.name || "your site"}.
      </p>

      <div className="space-y-5">
        {/* Overall aesthetic */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Overall Aesthetic Preference
          </label>
          <div className="space-y-2">
            {AESTHETICS.map((a) => (
              <button
                key={a.value}
                onClick={() => set({ overallAesthetic: a.value })}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition ${
                  distillation.overallAesthetic === a.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold">{a.label}</div>
                <div className="text-gray-400 mt-0.5">{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary audience */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Who is the primary audience?
          </label>
          <p className="text-xs text-gray-400 mb-2">
            {sites.length > 0
              ? `The sites you selected suggest a certain audience. Who are you designing for?`
              : "Who are you designing for?"}
          </p>
          <textarea
            value={distillation.primaryAudience}
            onChange={(e) => set({ primaryAudience: e.target.value })}
            placeholder="e.g. Freelance designers aged 25-40, tech-savvy, value efficiency and aesthetics..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Emotion */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            What emotion should a visitor feel when they land on your site?
          </label>
          <textarea
            value={distillation.emotionToConvey}
            onChange={(e) => set({ emotionToConvey: e.target.value })}
            placeholder="e.g. Instantly reassured they found the right tool. Impressed but not intimidated. Excited to start..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* What to avoid */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            What should the design absolutely NOT look like?
          </label>
          <textarea
            value={distillation.whatToAvoid}
            onChange={(e) => set({ whatToAvoid: e.target.value })}
            placeholder="e.g. No dark patterns, no clipart or stock photos, avoid the 'boring enterprise SaaS' look, nothing too trendy..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Inspiration reflections */}
        {sites.length > 0 && (
          <div className="bg-brand-50 rounded-xl border border-brand-100 p-3">
            <div className="text-xs font-semibold text-brand-700 mb-2">Your inspiration sites</div>
            {sites.map((s, i) => s.whyYouLikeIt && (
              <div key={i} className="mb-2 last:mb-0">
                <span className="text-xs font-medium text-brand-600">{s.name || s.url}: </span>
                <span className="text-xs text-gray-600">{s.whyYouLikeIt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
