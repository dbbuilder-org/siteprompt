import { useState, useEffect, useCallback } from "react";
import type { WizardSession, WizardStep, PanelMsg, GenerateResponse } from "../shared/types";
import { makeEmptySession } from "../shared/types";
import Step1Brand from "./steps/Step1Brand";
import Step2Examples from "./steps/Step2Examples";
import Step3Distillation from "./steps/Step3Distillation";
import Step4Analysis from "./steps/Step4Analysis";
import Step5Proof from "./steps/Step5Proof";
import Step6Final from "./steps/Step6Final";

const STORAGE_KEY = "sp_session";

const STEP_LABELS = ["Brand", "Inspiration", "Aesthetic", "Deep Dive", "Review", "Output"];

export default function App() {
  const [step, setStep] = useState<WizardStep>(1);
  const [session, setSession] = useState<WizardSession>(makeEmptySession);
  const [pendingScreenshot, setPendingScreenshot] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);

  // Load persisted session
  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (stored) => {
      if (stored[STORAGE_KEY]) {
        const s = stored[STORAGE_KEY] as WizardSession;
        setSession(s);
        if (s.generated) setGenerated(s.generated);
      }
    });
  }, []);

  // Persist session on change
  useEffect(() => {
    chrome.storage.local.set({ [STORAGE_KEY]: session });
  }, [session]);

  // Listen to messages from content script
  useEffect(() => {
    const handler = (e: MessageEvent<PanelMsg>) => {
      if (!e.data?.type?.startsWith("SP_")) return;
      if (e.data.type === "SP_SCREENSHOT") {
        setPendingScreenshot(e.data.dataUrl);
      }
      if (e.data.type === "SP_GENERATE_OK") {
        setGenerating(false);
        setGenError("");
        setGenerated(e.data.result);
        setSession((s) => ({ ...s, generated: e.data.result }));
        setStep(6);
      }
      if (e.data.type === "SP_GENERATE_ERR") {
        setGenerating(false);
        setGenError(e.data.error);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const updateSession = useCallback((patch: Partial<WizardSession>) => {
    setSession((s) => ({ ...s, ...patch, updatedAt: new Date().toISOString() }));
  }, []);

  const closePanel = () => window.parent.postMessage({ type: "SP_CLOSE" }, "*");
  const requestScreenshot = () => window.parent.postMessage({ type: "SP_REQUEST_SCREENSHOT" }, "*");
  const requestRegionCapture = () => window.parent.postMessage({ type: "SP_REQUEST_SCREENSHOT_REGION" }, "*");

  const generate = () => {
    setGenerating(true);
    setGenError("");
    window.parent.postMessage({ type: "SP_GENERATE", session }, "*");
  };

  const downloadPdf = () => {
    if (!generated) return;
    window.parent.postMessage({ type: "SP_DOWNLOAD_PDF", session, generated }, "*");
  };

  const resetWizard = () => {
    const fresh = makeEmptySession();
    setSession(fresh);
    setGenerated(null);
    setStep(1);
    chrome.storage.local.remove([STORAGE_KEY]);
  };

  const canGoNext = () => {
    if (step === 1) return session.brand.name.trim().length > 0;
    if (step === 2) return session.inspirationSites.length > 0;
    return true;
  };

  const go = (s: WizardStep) => setStep(s);
  const next = () => { if (step < 6) go((step + 1) as WizardStep); };
  const prev = () => { if (step > 1) go((step - 1) as WizardStep); };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-purple-600" />
            <span className="font-bold text-gray-900 text-sm">SitePrompt</span>
          </div>
          <button onClick={closePanel} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1">
          {STEP_LABELS.map((label, i) => {
            const n = (i + 1) as WizardStep;
            const active = n === step;
            const done = n < step;
            return (
              <button
                key={n}
                onClick={() => go(n)}
                className={`flex-1 py-1 rounded text-xs font-medium transition ${
                  active ? "bg-brand-600 text-white" :
                  done ? "bg-brand-100 text-brand-700" :
                  "bg-gray-100 text-gray-400"
                }`}
                title={label}
              >
                {done ? "✓" : n}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          {STEP_LABELS.map((l, i) => (
            <span key={i} className="text-xs text-gray-400" style={{ width: `${100 / 6}%`, textAlign: "center" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden step-scroll">
        {step === 1 && (
          <Step1Brand
            brand={session.brand}
            onChange={(brand) => updateSession({ brand })}
          />
        )}
        {step === 2 && (
          <Step2Examples
            sites={session.inspirationSites}
            onChange={(inspirationSites) => updateSession({ inspirationSites })}
            onRequestScreenshot={requestScreenshot}
            pendingScreenshot={pendingScreenshot}
            onScreenshotConsumed={() => setPendingScreenshot("")}
          />
        )}
        {step === 3 && (
          <Step3Distillation
            distillation={session.distillation}
            brand={session.brand}
            sites={session.inspirationSites}
            onChange={(distillation) => updateSession({ distillation })}
          />
        )}
        {step === 4 && (
          <Step4Analysis
            sites={session.inspirationSites}
            analyses={session.siteAnalyses}
            onChange={(siteAnalyses) => updateSession({ siteAnalyses })}
            onRequestRegionCapture={requestRegionCapture}
            pendingScreenshot={pendingScreenshot}
            onScreenshotConsumed={() => setPendingScreenshot("")}
          />
        )}
        {step === 5 && (
          <Step5Proof
            session={session}
            onEdit={(s) => go(s)}
            onGenerate={generate}
            generating={generating}
            genError={genError}
          />
        )}
        {step === 6 && generated && (
          <Step6Final
            session={session}
            generated={generated}
            onDownloadPdf={downloadPdf}
            onReset={resetWizard}
          />
        )}
      </div>

      {/* Footer nav */}
      {step < 6 && (
        <div className="flex-none border-t border-gray-100 p-3 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={step === 1}
            className="px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={resetWizard}
            className="text-xs text-gray-400 hover:text-red-500 transition"
          >
            Reset
          </button>
          {step < 5 ? (
            <button
              onClick={next}
              disabled={!canGoNext()}
              className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={generate}
              disabled={generating}
              className="px-4 py-2 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-40"
            >
              {generating ? "Generating…" : "Generate ✨"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
