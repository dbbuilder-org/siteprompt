import type { PanelMsg } from "../shared/types";

const PANEL_ID = "siteprompt-panel";
const PANEL_URL = chrome.runtime.getURL("panel.html");

let panelFrame: HTMLIFrameElement | null = null;
let isOpen = false;

function postToPanel(msg: PanelMsg) {
  panelFrame?.contentWindow?.postMessage(msg, "*");
}

function openPanel() {
  if (panelFrame && isOpen) return;
  if (!panelFrame) {
    panelFrame = document.createElement("iframe");
    panelFrame.id = PANEL_ID;
    panelFrame.src = PANEL_URL;
    Object.assign(panelFrame.style, {
      position: "fixed",
      top: "0",
      right: "0",
      width: "480px",
      height: "100vh",
      zIndex: "2147483647",
      border: "none",
      boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
      borderRadius: "0",
      transition: "transform 0.3s ease",
      transform: "translateX(100%)",
    });
    document.body.appendChild(panelFrame);
    setTimeout(() => {
      if (panelFrame) panelFrame.style.transform = "translateX(0)";
    }, 50);
  } else {
    panelFrame.style.transform = "translateX(0)";
  }
  isOpen = true;
}

function closePanel() {
  if (panelFrame) {
    panelFrame.style.transform = "translateX(100%)";
  }
  isOpen = false;
}

// Listen to messages from panel iframe
window.addEventListener("message", async (e: MessageEvent<PanelMsg>) => {
  if (!e.data?.type?.startsWith("SP_")) return;

  switch (e.data.type) {
    case "SP_CLOSE":
      closePanel();
      break;

    case "SP_REQUEST_SCREENSHOT": {
      const resp = await chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" });
      postToPanel({ type: "SP_SCREENSHOT", dataUrl: resp.ok ? resp.dataUrl : "" });
      break;
    }

    case "SP_GENERATE": {
      chrome.runtime.sendMessage(
        { type: "GENERATE", session: e.data.session },
        (resp) => {
          if (resp.ok) {
            postToPanel({ type: "SP_GENERATE_OK", result: resp.result });
          } else {
            postToPanel({ type: "SP_GENERATE_ERR", error: resp.error || "Generation failed" });
          }
        }
      );
      break;
    }

    case "SP_DOWNLOAD_PDF": {
      chrome.runtime.sendMessage({
        type: "DOWNLOAD_PDF",
        session: e.data.session,
        generated: e.data.generated,
      });
      break;
    }

    case "SP_OPEN_AUTH": {
      const WEB_URL = "https://siteprompt.servicevision.io";
      chrome.tabs.create({ url: `${WEB_URL}/auth/extension` });
      break;
    }
  }
});

// Listen to messages from background (popup toggle)
chrome.runtime.onMessage.addListener((msg: { type: string }) => {
  if (msg.type === "TOGGLE_PANEL") {
    if (isOpen) closePanel();
    else openPanel();
  }
});

// Handle screen region capture: inject a full-screen overlay for selection
window.addEventListener("message", (e: MessageEvent<{ type: string }>) => {
  if (e.data?.type !== "SP_REQUEST_SCREENSHOT_REGION") return;
  startRegionCapture();
});

function startRegionCapture() {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed", inset: "0", zIndex: "2147483646",
    cursor: "crosshair", userSelect: "none",
    background: "rgba(0,0,0,0.35)",
  });

  let startX = 0, startY = 0;
  let selBox: HTMLDivElement | null = null;

  overlay.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    selBox = document.createElement("div");
    Object.assign(selBox.style, {
      position: "fixed", border: "2px solid #6366f1",
      background: "rgba(99,102,241,0.1)", pointerEvents: "none",
    });
    overlay.appendChild(selBox);
  });

  overlay.addEventListener("mousemove", (e) => {
    if (!selBox) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    Object.assign(selBox.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  });

  overlay.addEventListener("mouseup", async (e) => {
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    document.body.removeChild(overlay);

    if (w < 10 || h < 10) {
      postToPanel({ type: "SP_SCREENSHOT", dataUrl: "" });
      return;
    }

    const resp = await chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" });
    if (!resp.ok) { postToPanel({ type: "SP_SCREENSHOT", dataUrl: "" }); return; }

    // Crop to selection
    const dpr = window.devicePixelRatio || 1;
    const img = new Image();
    img.src = resp.dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, x * dpr, y * dpr, w * dpr, h * dpr, 0, 0, w * dpr, h * dpr);
      postToPanel({ type: "SP_SCREENSHOT", dataUrl: canvas.toDataURL("image/png") });
    };
  });

  document.body.appendChild(overlay);
}
