import type { BrandInfo } from "../../shared/types";

interface Props {
  brand: BrandInfo;
  onChange: (b: BrandInfo) => void;
}

const PRESET_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#0ea5e9", "#f97316", "#14b8a6"];

export default function Step1Brand({ brand, onChange }: Props) {
  const set = (patch: Partial<BrandInfo>) => onChange({ ...brand, ...patch });

  const addColor = () => {
    if (brand.colors.length < 6) {
      set({ colors: [...brand.colors, "#6366f1"] });
    }
  };

  const removeColor = (i: number) => {
    set({ colors: brand.colors.filter((_, idx) => idx !== i) });
  };

  const updateColor = (i: number, val: string) => {
    const c = [...brand.colors];
    c[i] = val;
    set({ colors: c });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 step-scroll">
      <h2 className="font-bold text-gray-900 text-base mb-1">Tell us about your brand</h2>
      <p className="text-xs text-gray-400 mb-4">This forms the foundation of your design brief.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Brand / Site Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={brand.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Acme Studio"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Purpose / What does it do?</label>
          <textarea
            value={brand.purpose}
            onChange={(e) => set({ purpose: e.target.value })}
            placeholder="e.g. A SaaS platform for freelance designers to manage client projects..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Claim to Fame / Unique Value</label>
          <textarea
            value={brand.claimToFame}
            onChange={(e) => set({ claimToFame: e.target.value })}
            placeholder="e.g. The only tool that automatically generates client-ready proposals in under 60 seconds..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Current Site URL (optional)</label>
          <input
            type="url"
            value={brand.currentSiteUrl}
            onChange={(e) => set({ currentSiteUrl: e.target.value })}
            placeholder="https://yourdomain.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Brand Color Palette
            <span className="ml-2 text-gray-400 font-normal">(up to 6 colors)</span>
          </label>

          {/* Preset chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  if (!brand.colors.includes(c) && brand.colors.length < 6) {
                    set({ colors: [...brand.colors, c] });
                  }
                }}
                className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>

          {/* Active colors */}
          <div className="flex flex-wrap gap-2">
            {brand.colors.map((color, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-600">{color}</span>
                <button
                  onClick={() => removeColor(i)}
                  className="text-gray-300 hover:text-red-400 ml-1 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            {brand.colors.length < 6 && (
              <button
                onClick={addColor}
                className="flex items-center gap-1 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition"
              >
                + Add
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Logo (optional)</label>
          {brand.logoDataUrl ? (
            <div className="flex items-center gap-2">
              <img src={brand.logoDataUrl} alt="Logo" className="h-10 rounded border border-gray-200" />
              <button
                onClick={() => set({ logoDataUrl: undefined })}
                className="text-xs text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2 hover:border-brand-400 transition">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-400">Upload logo image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
