import { Link } from "wouter";

const LOGO = "/manus-storage/digital-city-logo_c47ad8cb.jpg";

export default function Terms() {
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
            Terms of <span className="text-glow-cyan">Service</span>
          </h1>
          <p className="text-white/40 text-sm mb-12">Last updated: June 22, 2026</p>

          <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">
            {/* Introduction */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using the website buildyourdigitalcity.com (the "Site") and purchasing digital products offered by The Digital City, operated by Strandway Systems ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Site or purchase our products.
              </p>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">2. Eligibility</h2>
              <p>
                You must be at least 18 years of age to use this Site and purchase products. By using the Site, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into a binding agreement.
              </p>
            </div>

            {/* Products and Services */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">3. Products and Services</h2>
              <p className="mb-4">
                We sell digital products including ebooks, guides, blueprints, assessments, toolkits, and courses (collectively, "Products"). All Products are delivered digitally — there are no physical goods shipped.
              </p>
              <p>
                Product descriptions, pricing, and availability are subject to change without notice. We reserve the right to modify, discontinue, or update any Product at any time.
              </p>
            </div>

            {/* Payment and Pricing */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">4. Payment and Pricing</h2>
              <p className="mb-4">
                All payments for paid Products are processed through Gumroad, Inc., a third-party payment processor. By making a purchase, you also agree to Gumroad's{" "}
                <a href="https://gumroad.com/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  Terms of Service
                </a>.
              </p>
              <p className="mb-4">
                Prices are displayed in USD unless otherwise stated. You are responsible for any applicable taxes, duties, or fees imposed by your jurisdiction.
              </p>
              <p>
                We do not store your payment card information. All payment data is handled securely by Gumroad in accordance with PCI-DSS standards.
              </p>
            </div>

            {/* Digital Product Delivery */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">5. Digital Product Delivery</h2>
              <p className="mb-4">
                Upon successful payment, you will receive immediate access to download your purchased Product. Delivery is handled through Gumroad's platform and/or direct download links on our Site.
              </p>
              <p>
                It is your responsibility to download and save your purchased Products. We make reasonable efforts to keep download links available, but cannot guarantee perpetual access.
              </p>
            </div>

            {/* Refund Policy */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">6. Refund Policy</h2>
              <p className="mb-4">
                Due to the digital nature of our Products, all sales are final once the Product has been delivered or downloaded. However, we want you to be satisfied with your purchase.
              </p>
              <p className="mb-4">
                If you experience a technical issue that prevents you from accessing your purchased Product, contact us within 14 days of purchase and we will resolve the issue or provide a full refund.
              </p>
              <p>
                Refund requests for reasons other than technical issues are evaluated on a case-by-case basis at our sole discretion. To request a refund, email support@buildyourdigitalcity.com within 14 days of purchase.
              </p>
            </div>

            {/* License and Usage */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">7. License and Usage Rights</h2>
              <p className="mb-4">
                Upon purchase, you are granted a personal, non-exclusive, non-transferable license to use the Product for your own personal or business purposes.
              </p>
              <p className="mb-4">You may NOT:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Redistribute, resell, or share the Product with others</li>
                <li>Upload the Product to file-sharing services or public repositories</li>
                <li>Claim authorship of the Product or its contents</li>
                <li>Use the Product to create a competing product that substantially replicates our content</li>
                <li>Remove or alter any copyright notices or attribution</li>
              </ul>
              <p className="mt-4">
                You MAY use insights, frameworks, and strategies from the Product in your own business operations, content, and decision-making.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">8. Intellectual Property</h2>
              <p>
                All content on the Site and within our Products — including text, graphics, logos, designs, frameworks, and methodologies — is the intellectual property of Strandway Systems and is protected by copyright, trademark, and other intellectual property laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
              </p>
            </div>

            {/* Free Products */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">9. Free Products and Lead Magnets</h2>
              <p>
                Certain Products are offered at no cost ("Free Products"). By downloading a Free Product, you agree to these same Terms of Service. Free Products are provided "as is" and the same license restrictions in Section 7 apply. We may require an email address or account registration to access Free Products.
              </p>
            </div>

            {/* Newsletter and Communications */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">10. Newsletter and Communications</h2>
              <p>
                By subscribing to our newsletter or providing your email address, you consent to receive periodic emails from us including product updates, new content, and promotional offers. You may unsubscribe at any time by clicking the unsubscribe link in any email. We will never sell or share your email address with third parties for their marketing purposes.
              </p>
            </div>

            {/* Disclaimers */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">11. Disclaimers</h2>
              <p className="mb-4">
                Our Products are educational and informational in nature. They do not constitute financial advice, legal advice, or professional consulting.
              </p>
              <p className="mb-4">
                We make no guarantees regarding income, business results, or financial outcomes from using our Products. Individual results vary based on effort, market conditions, prior experience, and many other factors beyond our control.
              </p>
              <p>
                The Site and Products are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">12. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, Strandway Systems shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Site or Products. Our total liability for any claim arising from these Terms shall not exceed the amount you paid for the specific Product giving rise to the claim.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">13. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Strandway Systems, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising from your use of the Site or Products, your violation of these Terms, or your violation of any rights of a third party.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Strandway Systems operates, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved through good-faith negotiation, and if unresolved, through binding arbitration or the courts of competent jurisdiction.
              </p>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">15. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Site after any modifications constitutes acceptance of the revised Terms. For material changes, we will make reasonable efforts to notify registered users via email.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">16. Termination</h2>
              <p>
                We may terminate or suspend your access to the Site at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your license to use any purchased Products remains valid, but your access to the Site and any account features may be revoked.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">17. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 glass-card p-6">
                <p className="text-white font-semibold">Strandway Systems</p>
                <p className="text-white/60 mt-1">Email: support@buildyourdigitalcity.com</p>
                <p className="text-white/60">Website: buildyourdigitalcity.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="The Digital City" className="w-6 h-6 rounded-md" />
            <span className="text-sm font-medium text-white/40">Strandway Systems · 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Privacy</Link>
            <Link href="/store" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Store</Link>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
