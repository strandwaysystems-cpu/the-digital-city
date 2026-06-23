import { Link } from "wouter";

const LOGO = "/manus-storage/digital-city-logo_c47ad8cb.jpg";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative">
      {/* Ambient glow */}
      <div className="orb-cyan w-[400px] h-[400px] -top-40 -right-40 opacity-10 fixed" />
      <div className="orb-magenta w-[300px] h-[300px] bottom-20 left-0 opacity-8 fixed" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a1a]/70">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={LOGO} alt="The Digital City" className="w-8 h-8 rounded-lg" />
            <span className="text-sm font-semibold text-white/90 tracking-tight">
              The Digital City
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-white/40 hover:text-white/90 transition-colors hidden sm:block font-medium tracking-wide uppercase">
              Home
            </Link>
            <Link href="/store" className="text-xs text-white/40 hover:text-white/90 transition-colors hidden sm:block font-medium tracking-wide uppercase">
              Store
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-24 relative">
        <div className="container max-w-3xl">
          <span className="tag-label mb-4 block">Legal</span>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Privacy <span className="text-glow-cyan">Policy</span>
          </h1>
          <p className="text-white/40 text-sm mb-12">Last updated: June 22, 2026</p>

          <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">
            {/* Introduction */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
              <p>
                The Digital City ("we," "our," or "us") is operated by Strandway Systems. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website buildyourdigitalcity.com (the "Site") and purchase our digital products and services. We are committed to protecting your personal data in compliance with the General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, and applicable privacy laws.
              </p>
            </div>

            {/* Data Controller */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">2. Data Controller</h2>
              <p>
                Strandway Systems is the data controller responsible for your personal data. If you have questions about this Privacy Policy or our data practices, you may contact us at privacy@buildyourdigitalcity.com.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">3. Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, as well as information collected automatically when you use our Site.</p>
              
              <h3 className="text-base font-semibold text-white/90 mb-2">3.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                <li><span className="text-white/90 font-medium">Account Information:</span> Name, email address, and authentication credentials when you create an account.</li>
                <li><span className="text-white/90 font-medium">Payment Information:</span> When you make a purchase, payment details are collected and processed directly by Gumroad, Inc. We do not store your full credit card number, CVV, or card expiration date on our servers.</li>
                <li><span className="text-white/90 font-medium">Email Subscription:</span> Email address when you subscribe to our newsletter or download free resources.</li>
                <li><span className="text-white/90 font-medium">Communications:</span> Any information you provide when contacting us for support.</li>
              </ul>

              <h3 className="text-base font-semibold text-white/90 mb-2">3.2 Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="text-white/90 font-medium">Usage Data:</span> Pages visited, time spent on pages, click patterns, and referral sources.</li>
                <li><span className="text-white/90 font-medium">Device Information:</span> Browser type, operating system, device type, and screen resolution.</li>
                <li><span className="text-white/90 font-medium">IP Address:</span> Used for fraud prevention, analytics, and approximate geolocation.</li>
                <li><span className="text-white/90 font-medium">Cookies:</span> Session cookies for authentication and analytics cookies for site improvement.</li>
              </ul>
            </div>

            {/* Legal Basis */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">4. Legal Basis for Processing (GDPR)</h2>
              <p className="mb-4">We process your personal data under the following legal bases:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="text-white/90 font-medium">Contract Performance:</span> Processing necessary to fulfill your purchase of digital products and deliver your downloads.</li>
                <li><span className="text-white/90 font-medium">Legitimate Interest:</span> Analytics and site improvement, fraud prevention, and business communications.</li>
                <li><span className="text-white/90 font-medium">Consent:</span> Marketing emails and newsletter subscriptions. You may withdraw consent at any time.</li>
                <li><span className="text-white/90 font-medium">Legal Obligation:</span> Tax records and compliance with applicable laws.</li>
              </ul>
            </div>

            {/* How We Use */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">5. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Process and fulfill your digital product purchases</li>
                <li>Provide access to downloadable content you have purchased or claimed</li>
                <li>Send transactional emails (order confirmations, download links, receipts)</li>
                <li>Send marketing communications (only with your consent)</li>
                <li>Improve our website, products, and services</li>
                <li>Prevent fraud and maintain security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Payment Processing */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">6. Payment Processing</h2>
              <p>
                All payment transactions are processed through Gumroad, Inc. When you make a purchase, your payment information is transmitted directly to Gumroad's secure servers. We receive only a confirmation of payment and transaction metadata. We never have access to your full card details. Gumroad's privacy policy is available at{" "}
                <a href="https://gumroad.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  gumroad.com/privacy
                </a>.
              </p>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">7. Data Sharing and Third Parties</h2>
              <p className="mb-4">We do not sell your personal data. We share information only with the following categories of service providers:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="text-white/90 font-medium">Gumroad:</span> Payment processing and digital product delivery</li>
                <li><span className="text-white/90 font-medium">Beehiiv:</span> Email newsletter delivery (when you subscribe)</li>
                <li><span className="text-white/90 font-medium">Cloud Infrastructure:</span> Hosting and content delivery</li>
                <li><span className="text-white/90 font-medium">Analytics:</span> Aggregated, anonymized usage data for site improvement</li>
              </ul>
              <p className="mt-4">
                All third-party processors are bound by data processing agreements and are required to protect your data in accordance with applicable law.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">8. Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary to fulfill the purposes for which it was collected. Purchase records are retained for 7 years for tax and legal compliance. Account data is retained until you request deletion. Marketing data is retained until you unsubscribe or request removal.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">9. Your Rights</h2>
              <p className="mb-4">Under GDPR and applicable data protection laws, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="text-white/90 font-medium">Access:</span> Request a copy of the personal data we hold about you.</li>
                <li><span className="text-white/90 font-medium">Rectification:</span> Request correction of inaccurate or incomplete data.</li>
                <li><span className="text-white/90 font-medium">Erasure:</span> Request deletion of your personal data ("right to be forgotten").</li>
                <li><span className="text-white/90 font-medium">Restriction:</span> Request restriction of processing in certain circumstances.</li>
                <li><span className="text-white/90 font-medium">Portability:</span> Receive your data in a structured, machine-readable format.</li>
                <li><span className="text-white/90 font-medium">Objection:</span> Object to processing based on legitimate interests or direct marketing.</li>
                <li><span className="text-white/90 font-medium">Withdraw Consent:</span> Withdraw consent at any time where processing is based on consent.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, contact us at privacy@buildyourdigitalcity.com. We will respond within 30 days.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">10. Cookies</h2>
              <p className="mb-4">We use the following types of cookies:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="text-white/90 font-medium">Essential Cookies:</span> Required for authentication and site functionality. Cannot be disabled.</li>
                <li><span className="text-white/90 font-medium">Analytics Cookies:</span> Help us understand how visitors use our site. Anonymized and aggregated.</li>
              </ul>
              <p className="mt-4">
                We do not use advertising or tracking cookies. You can control cookies through your browser settings.
              </p>
            </div>

            {/* International Transfers */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">11. International Data Transfers</h2>
              <p>
                Your data may be transferred to and processed in countries outside of your jurisdiction, including the United States. Where such transfers occur, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission or equivalent mechanisms.
              </p>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">12. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These include encryption in transit (TLS/SSL), secure authentication mechanisms, and regular security assessments. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            {/* Children */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">13. Children's Privacy</h2>
              <p>
                Our Site and services are not directed to individuals under the age of 18. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a minor, please contact us immediately.
              </p>
            </div>

            {/* Changes */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">14. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised "Last updated" date. Your continued use of the Site after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">15. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 glass-card p-6">
                <p className="text-white font-semibold">Strandway Systems</p>
                <p className="text-white/60 mt-1">Email: privacy@buildyourdigitalcity.com</p>
                <p className="text-white/60">Website: buildyourdigitalcity.com</p>
              </div>
              <p className="mt-4">
                You also have the right to lodge a complaint with your local data protection supervisory authority if you believe your data has been processed unlawfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="The Digital City" className="w-6 h-6 rounded-md" />
            <span className="text-sm font-medium text-white/40">Strandway Systems · 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Terms</Link>
            <Link href="/store" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Store</Link>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
