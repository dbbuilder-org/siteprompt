export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm text-gray-600 space-y-4">
        <p><strong>SitePrompt</strong> by ServiceVision collects minimal data to provide the design brief service.</p>
        <h2 className="text-lg font-semibold text-gray-900">What we collect</h2>
        <ul className="list-disc ml-4 space-y-1">
          <li>Account information via Clerk (email, name)</li>
          <li>Wizard session data you provide (brand info, site URLs, design preferences)</li>
          <li>Screenshots you capture or upload — stored locally in your browser extension only</li>
        </ul>
        <h2 className="text-lg font-semibold text-gray-900">What we don&apos;t collect</h2>
        <ul className="list-disc ml-4 space-y-1">
          <li>Browsing history</li>
          <li>Personal data from third-party sites</li>
          <li>Payment information (handled by third parties)</li>
        </ul>
        <h2 className="text-lg font-semibold text-gray-900">Data usage</h2>
        <p>Session data is sent to our API to generate design prompts via the Anthropic Claude API. We do not store session content permanently unless you explicitly save it.</p>
        <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        <p>Questions? <a href="mailto:chris@servicevision.net" className="text-brand-600 underline">chris@servicevision.net</a></p>
      </div>
    </div>
  );
}
