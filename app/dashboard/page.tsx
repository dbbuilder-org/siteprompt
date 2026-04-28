import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand" />
            <span className="font-bold text-lg">SitePrompt</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dbbuilder-org/siteprompt/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Install Extension
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SitePrompt</h1>
          <p className="text-gray-500">Install the Chrome extension to start building your design brief.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">🧩</div>
            <h2 className="font-semibold text-xl text-gray-900 mb-3">Step 1: Install the Extension</h2>
            <p className="text-gray-500 mb-5 leading-relaxed">
              Download the SitePrompt Chrome extension and load it in developer mode to get started.
            </p>
            <a
              href="https://github.com/dbbuilder-org/siteprompt/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Download Extension
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="font-semibold text-xl text-gray-900 mb-3">Step 2: Run the Wizard</h2>
            <p className="text-gray-500 mb-5 leading-relaxed">
              Click the SitePrompt icon on any page to open the design wizard. Follow the 6-step process.
            </p>
            <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-5 py-2.5 rounded-lg text-sm font-medium">
              Via the Chrome extension
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Need help building your prototype?</h2>
          <p className="text-brand-100 mb-6">
            Schedule a free 30-min consult with ServiceVision. We turn SitePrompt briefs into real products.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { tier: "Starter", price: "$999", desc: "Landing page" },
              { tier: "Growth", price: "$4,999", desc: "Full site/app" },
              { tier: "Enterprise", price: "$19,999", desc: "Full-stack MVP" },
            ].map((t) => (
              <div key={t.tier} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
                <div className="text-xl font-black">{t.price}</div>
                <div className="text-sm font-semibold">{t.tier}</div>
                <div className="text-xs text-brand-200">{t.desc}</div>
              </div>
            ))}
          </div>
          <a
            href="https://calendly.com/servicevision/siteprompt"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition"
          >
            Schedule Free Consult
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </main>
    </div>
  );
}
