"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const steps = [
  { n: "01", title: "Describe Your Brand", desc: "Name, purpose, colors, and what makes you unique." },
  { n: "02", title: "Add Inspiration Sites", desc: "Up to 3 sites whose design you love." },
  { n: "03", title: "Analyze Each Site", desc: "Checkboxes + notes on typography, layout, color, art, and motion." },
  { n: "04", title: "Capture Details", desc: "Built-in screen grabber to capture exact sections you love." },
  { n: "05", title: "Review Your Synthesis", desc: "See everything assembled into a coherent design brief." },
  { n: "06", title: "Get Your Prompts", desc: "Receive a PDF report + ready-to-paste Claude Design prompts." },
];

const tiers = [
  { price: "$999", name: "Starter", desc: "Landing page prototype — one hero, three sections, CTA." },
  { price: "$4,999", name: "Growth", desc: "Full multi-page site or app prototype with design system." },
  { price: "$19,999", name: "Enterprise", desc: "Full-stack MVP — design, code, deploy, iterate." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand" />
            <span className="font-bold text-lg">SitePrompt</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-gray-900 transition">How It Works</a>
            <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link href="/sign-up" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition">
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition">
                Dashboard
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6">
        <div className="absolute inset-0 gradient-brand opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            Chrome Extension + AI-Powered Design Brief
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Turn design inspiration into<br />
            <span className="text-transparent bg-clip-text gradient-brand">prototype-ready prompts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            SitePrompt walks you through a structured wizard to distill what you love about up to 3 sites into a PDF design brief and Claude Design prompts — so your prototype looks exactly right from the first try.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/dbbuilder-org/siteprompt/releases"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Install Extension
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
              See how it works
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">A wizard that thinks like a designer</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Six focused steps turn your raw inspiration into an actionable design brief.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <span className="text-4xl font-black text-gray-100 block mb-3">{s.n}</span>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What you walk away with</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📄", title: "PDF Design Brief", desc: "A polished document capturing your brand essence, design preferences, and synthesis — shareable with any designer or developer." },
              { icon: "✨", title: "Claude Design Prompts", desc: "Three levels of prompts — quick prototype, full design system, and complete specification — ready to paste into Claude Design." },
              { icon: "🚀", title: "Build It With Us", desc: "Optional: schedule a consult and let ServiceVision turn your brief into a real prototype or full product." },
            ].map((o) => (
              <div key={o.title} className="text-center p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">{o.icon}</div>
                <h3 className="font-semibold text-xl text-gray-900 mb-3">{o.title}</h3>
                <p className="text-gray-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" className="py-24 px-6 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
          <p className="text-gray-400 text-lg">ServiceVision turns your SitePrompt brief into a real product.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {tiers.map((t) => (
            <div key={t.name} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-brand-500 transition">
              <div className="text-3xl font-black text-brand-400 mb-2">{t.price}</div>
              <div className="font-semibold text-xl text-white mb-3">{t.name}</div>
              <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="https://calendly.com/servicevision/siteprompt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition"
          >
            Schedule a Free 30-min Consult
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <p className="text-gray-500 text-sm mt-4">No commitment. Just a conversation about your vision.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>© 2026 ServiceVision · <a href="https://servicevision.net" className="hover:text-gray-600">servicevision.net</a> · <Link href="/privacy" className="hover:text-gray-600">Privacy</Link></p>
      </footer>
    </div>
  );
}
