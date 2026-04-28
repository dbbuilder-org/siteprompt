export interface BrandInfo {
  name: string;
  purpose: string;
  claimToFame: string;
  colors: string[]; // hex values
  currentSiteUrl?: string;
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
  screenshots: string[]; // dataUrls of additional grabbed screenshots
}

export interface DistillationAnswers {
  overallAesthetic: "minimal" | "bold" | "warm" | "professional" | "playful" | "";
  primaryAudience: string;
  emotionToConvey: string;
  whatToAvoid: string;
}

export interface WizardSession {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  brand: BrandInfo;
  inspirationSites: InspirationSite[];
  distillation: DistillationAnswers;
  siteAnalyses: SiteAnalysis[];
}

export interface GenerateRequest {
  session: WizardSession;
}

export interface GenerateResponse {
  quickPrompt: string;
  fullPrompt: string;
  specPrompt: string;
  summary: string;
}
