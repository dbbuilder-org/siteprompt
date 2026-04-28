import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "SitePrompt — Design Inspiration to Claude Prototype",
  description: "Distill design inspiration from up to 3 sites into prompts that build your brand prototype in Claude Design.",
  openGraph: {
    title: "SitePrompt",
    description: "From design inspiration to prototype-ready prompts.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased bg-white text-gray-900">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
