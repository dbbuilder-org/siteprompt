import { useEffect, useState } from "react";

export default function Popup() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  function openPanel() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: "TOGGLE_PANEL" });
      window.close();
    });
  }

  return (
    <div className="p-5 flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">SitePrompt</div>
          <div className="text-xs text-gray-400">Design Brief Wizard</div>
        </div>
      </div>

      <button
        onClick={openPanel}
        disabled={!ready}
        className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-50"
      >
        Open Wizard
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Click to open the SitePrompt wizard on the current page. Navigate to an inspiration site first.
      </p>

      <div className="w-full pt-2 border-t border-gray-100 flex justify-between">
        <a
          href="https://siteprompt.servicevision.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-600 hover:underline"
        >
          Dashboard
        </a>
        <span className="text-xs text-gray-300">v0.1.0</span>
      </div>
    </div>
  );
}
