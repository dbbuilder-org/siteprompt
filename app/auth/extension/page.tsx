"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ExtensionAuthPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      window.location.href = "/sign-in?redirect_url=/auth/extension";
      return;
    }
    (async () => {
      const token = await getToken();
      // Post token back to extension via chrome messaging (only in extension context)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cr = (window as any).chrome;
      if (cr && cr.runtime) {
        cr.runtime.sendMessage(
          process.env.NEXT_PUBLIC_EXTENSION_ID || "",
          { type: "AUTH_TOKEN", token }
        );
      }
      // Also store in localStorage for extension to read
      localStorage.setItem("siteprompt_token", token || "");
      window.close();
    })();
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl gradient-brand mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600 font-medium">Connecting to SitePrompt extension…</p>
        <p className="text-gray-400 text-sm mt-2">This window will close automatically.</p>
      </div>
    </div>
  );
}
