export interface BrandInfo {
  name: string;
  purpose: string;
  claimToFame: string;
  colors: string[];
  currentSiteUrl: string;
  logoDataUrl?: string;
}

export interface InspirationSite {
  url: string;
  name: string;
  screenshotDataUrl?: string;
  whyYouLikeIt: string;
}

export interface SiteAnalysis {
  siteIndex: number;
  typography: {
    serif: boolean; sansSerif: boolean; display: boolean; monospace: boolean; mixed: boolean;
    notes: string;
  };
  layout: {
    singleColumn: boolean; multiGrid: boolean; heroCentered: boolean; cardBased: boolean;
    asymmetric: boolean; fullWidth: boolean;
    notes: string;
  };
  colors: {
    light: boolean; dark: boolean; vibrant: boolean; muted: boolean; monochrome: boolean;
    notes: string;
  };
  imagery: {
    photography: boolean; illustration: boolean; icons: boolean; geometric: boolean; minimal: boolean;
    notes: string;
  };
  motion: {
    subtleAnimations: boolean; boldTransitions: boolean; parallax: boolean; hoverEffects: boolean; noMotion: boolean;
    notes: string;
  };
  specificElements: string;
  screenshots: string[];
}

export interface DistillationAnswers {
  overallAesthetic: "minimal" | "bold" | "warm" | "professional" | "playful" | "";
  primaryAudience: string;
  emotionToConvey: string;
  whatToAvoid: string;
}

export interface GenerateResponse {
  quickPrompt: string;
  fullPrompt: string;
  specPrompt: string;
  summary: string;
}

export interface WizardSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  brand: BrandInfo;
  inspirationSites: InspirationSite[];
  distillation: DistillationAnswers;
  siteAnalyses: SiteAnalysis[];
  generated?: GenerateResponse;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

// Messages between content script and panel iframe
export type PanelMsg =
  | { type: "SP_OPEN" }
  | { type: "SP_CLOSE" }
  | { type: "SP_REQUEST_SCREENSHOT" }
  | { type: "SP_REQUEST_SCREENSHOT_REGION" }
  | { type: "SP_SCREENSHOT"; dataUrl: string }
  | { type: "SP_GENERATE"; session: WizardSession }
  | { type: "SP_GENERATE_OK"; result: GenerateResponse }
  | { type: "SP_GENERATE_ERR"; error: string }
  | { type: "SP_DOWNLOAD_PDF"; session: WizardSession; generated: GenerateResponse }
  | { type: "SP_OPEN_AUTH" };

// Messages between content script and background
export type BgMsg =
  | { type: "CAPTURE_SCREENSHOT" }
  | { type: "GENERATE"; session: WizardSession; apiUrl: string }
  | { type: "DOWNLOAD_PDF"; session: WizardSession; generated: GenerateResponse; apiUrl: string };

export function makeEmptySession(): WizardSession {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    brand: { name: "", purpose: "", claimToFame: "", colors: ["#6366f1", "#06b6d4", "#f59e0b"], currentSiteUrl: "" },
    inspirationSites: [],
    distillation: { overallAesthetic: "", primaryAudience: "", emotionToConvey: "", whatToAvoid: "" },
    siteAnalyses: [],
  };
}

export function makeEmptyAnalysis(siteIndex: number): SiteAnalysis {
  return {
    siteIndex,
    typography: { serif: false, sansSerif: false, display: false, monospace: false, mixed: false, notes: "" },
    layout: { singleColumn: false, multiGrid: false, heroCentered: false, cardBased: false, asymmetric: false, fullWidth: false, notes: "" },
    colors: { light: false, dark: false, vibrant: false, muted: false, monochrome: false, notes: "" },
    imagery: { photography: false, illustration: false, icons: false, geometric: false, minimal: false, notes: "" },
    motion: { subtleAnimations: false, boldTransitions: false, parallax: false, hoverEffects: false, noMotion: false, notes: "" },
    specificElements: "",
    screenshots: [],
  };
}
