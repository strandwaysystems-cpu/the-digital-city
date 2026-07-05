/**
 * THE DIGITAL CITY — Store
 *
 * Renders the full catalog from trpc.products.list so it stays current as
 * products are added or removed, with a curated fallback covering every
 * known product when the catalog is empty or unreachable. The Owner vs
 * Renter Assessment lives on Gumroad (not in the DB) so it is always
 * appended as a static entry. Paid products link to their Gumroad page
 * when one is known (GUMROAD_LINKS) and show "Coming soon" otherwise;
 * free products funnel to the Kit email opt-in on the home page.
 */

import { Link } from "wouter";
import { ExternalLink, Clock, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

const LOGO = "/logo.jpg";

// Gumroad product pages by catalog slug. Add entries here as products go
// live on Gumroad and the store buttons activate automatically.
const GUMROAD_LINKS: Record<string, string> = {
  "owner-vs-renter": "https://buildyourdigitalcity.gumroad.com/l/owner-vs-renter",
};

const TYPE_LABELS: Record<string, string> = {
  ebook: "EBOOK",
  guide: "STRATEGIC GUIDE",
  blueprint: "BLUEPRINT",
  toolkit: "TOOLKIT",
  course: "COURSE",
};

interface DisplayProduct {
  key: string;
  name: string;
  typeLabel: string;
  price: string;
  description: string;
  status: "live" | "coming-soon" | "free";
  gumroadUrl?: string;
}

/** The assessment is sold on Gumroad and isn't in the site catalog. */
const ASSESSMENT: DisplayProduct = {
  key: "owner-vs-renter",
  name: "Owner vs Renter Assessment",
  typeLabel: "ASSESSMENT",
  price: "$9",
  description:
    "Discover where you stand in the digital economy. This assessment reveals whether you're building assets that compound — or renting attention from platforms that do.",
  status: "live",
  gumroadUrl: GUMROAD_LINKS["owner-vs-renter"],
};

/** Shown while the catalog loads, or if it's empty/unreachable. */
const FALLBACK_PRODUCTS: DisplayProduct[] = [
  ASSESSMENT,
  {
    key: "the-digital-city-ebook",
    name: "The Digital City",
    typeLabel: "EBOOK",
    price: "$39",
    description:
      "The complete guide to understanding the internet economy and building digital assets that compound. Five districts, one framework, unlimited upside.",
    status: "coming-soon",
  },
  {
    key: "portfolio-blueprint",
    name: "Portfolio Blueprint",
    typeLabel: "BLUEPRINT",
    price: "$17",
    description:
      "Step-by-step system to build your first digital asset portfolio. From zero to $1,000/month in recurring revenue.",
    status: "coming-soon",
  },
  {
    key: "sovereign-digital-entrepreneur",
    name: "The Sovereign Digital Entrepreneur",
    typeLabel: "STRATEGIC GUIDE",
    price: "Free",
    description:
      "Strategic frameworks for zero-capital digital monetization in 2026. Three complete business plans included.",
    status: "free",
  },
  {
    key: "builders-toolkit",
    name: "The Builder's Toolkit",
    typeLabel: "TOOLKIT",
    price: "Free",
    description:
      "Every tool you need to build a digital asset portfolio — honest assessments, real recommendations, no affiliate fluff.",
    status: "free",
  },
];

function formatPrice(price: string): string {
  const value = Number.parseFloat(price);
  if (!Number.isFinite(value) || value <= 0) return "Free";
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

export default function Store() {
  const { data: catalog, isLoading } = trpc.products.list.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const products: DisplayProduct[] =
    catalog && catalog.length > 0
      ? [
          ASSESSMENT,
          ...catalog.map((p): DisplayProduct => {
            const isFree = p.isFree || Number.parseFloat(p.price) <= 0;
            const gumroadUrl = GUMROAD_LINKS[p.slug];
            return {
              key: p.slug,
              name: p.name,
              typeLabel: TYPE_LABELS[p.productType] ?? "DIGITAL PRODUCT",
              price: isFree ? "Free" : formatPrice(p.price),
              description: p.description || p.shortDescription || "",
              status: isFree ? "free" : gumroadUrl ? "live" : "coming-soon",
              gumroadUrl,
            };
          }),
        ]
      : FALLBACK_PRODUCTS;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative">
      {/* Ambient glow */}
      <div className="orb-cyan w-[500px] h-[500px] -top-40 -right-40 opacity-20 fixed" />
      <div className="orb-magenta w-[400px] h-[400px] bottom-0 left-0 opacity-10 fixed" />

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
            <Link href="/store" className="text-xs text-cyan-400 transition-colors hidden sm:block font-medium tracking-wide uppercase">
              Store
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container">
          <span className="tag-label mb-4 block">The Digital City · Store</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Digital Products & <span className="text-glow-cyan">Guides</span>
          </h1>
          <p className="text-white/45 max-w-xl leading-relaxed">
            Everything you need to transition from consumer to builder-owner. Frameworks, blueprints, and tools — built from real experience.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 relative">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass-card p-8 h-64 animate-pulse">
                  <div className="h-3 w-1/4 rounded bg-white/5 mb-6" />
                  <div className="h-5 w-2/3 rounded bg-white/10 mb-4" />
                  <div className="h-3 w-full rounded bg-white/5 mb-2" />
                  <div className="h-3 w-5/6 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.key}
                  className={`glass-card p-8 flex flex-col group ${
                    product.status === "coming-soon" ? "opacity-60" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="tag-label text-white/30">
                      {product.typeLabel}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      product.status === "coming-soon"
                        ? "bg-white/5 text-white/30"
                        : product.status === "free"
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "bg-purple-400/10 text-purple-400"
                    }`}>
                      {product.status === "coming-soon" ? "COMING SOON" : product.price}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-white text-xl font-bold mb-3">
                    {product.name}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed flex-1 mb-6">
                    {product.description}
                  </p>

                  {/* CTA */}
                  {product.status === "live" && product.gumroadUrl && (
                    <a
                      href={product.gumroadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm"
                    >
                      <ExternalLink size={14} />
                      Get It · {product.price}
                    </a>
                  )}
                  {product.status === "coming-soon" && (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-lg border border-white/10 text-white/30 cursor-not-allowed"
                    >
                      <Clock size={14} />
                      Coming Soon
                    </button>
                  )}
                  {product.status === "free" && (
                    <a
                      href="/#subscribe"
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all font-medium"
                    >
                      <Download size={14} />
                      Get It Free by Email
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
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
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
              Terms
            </Link>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
