import type { BgMsg } from "../shared/types";

const WEB_URL = (typeof process !== "undefined" && (process.env as Record<string, string>).VITE_WEB_URL) || "https://siteprompt.servicevision.io";

chrome.runtime.onMessage.addListener((msg: BgMsg, sender, sendResponse) => {
  if (msg.type === "CAPTURE_SCREENSHOT") {
    const windowId = sender.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT;
    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ ok: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ ok: true, dataUrl });
      }
    });
    return true;
  }

  if (msg.type === "GENERATE") {
    fetch(`${WEB_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: msg.session }),
    })
      .then((r) => r.json())
      .then((result) => sendResponse({ ok: true, result }))
      .catch((e) => sendResponse({ ok: false, error: e.message }));
    return true;
  }

  if (msg.type === "DOWNLOAD_PDF") {
    fetch(`${WEB_URL}/api/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: msg.session, generated: msg.generated }),
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
          url,
          filename: `siteprompt-brief-${msg.session.brand.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        });
        sendResponse({ ok: true });
      })
      .catch((e) => sendResponse({ ok: false, error: e.message }));
    return true;
  }
});
