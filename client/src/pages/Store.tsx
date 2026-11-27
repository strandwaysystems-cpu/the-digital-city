/**
 * THE DIGITAL CITY — Store
 *
 * Primary source: the live Gumroad catalog, fetched server-side with the
 * GUMROAD_TOKEN env var and exposed via trpc.gumroad.products. Cards link
 * with class="gumroad-button" + the product's short_url so Gumroad's
 * overlay script (loaded in index.html) opens pop-up checkout in place.
 *
 * Fallbacks (when the token isn't set or the API is unreachable): the
 * site's own DB catalog (trpc.products.list), then a curated static list,
 * so the store never renders empty.
 */

import { Link } from "wouter";
import { ExternalLink, Clock, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SOCIALS } from "@shared/socials";

const LOGO = "/logo.jpg";

// Gumroad product pages by DB catalog slug, used only on the fallback path.
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

/** Shown only if both the Gumroad API and the DB catalog are unavailable. */
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

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card p-8 h-64 animate-pulse">
          <div className="h-3 w-1/4 rounded bg-white/5 mb-6" />
          <div className="h-5 w-2/3 rounded bg-white/10 mb-4" />
          <div className="h-3 w-full rounded bg-white/5 mb-2" />
          <div className="h-3 w-5/6 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

/** Live grid built from the Gumroad API, with overlay pop-up checkout. */
function GumroadGrid({ products }: { products: NonNullable<ReturnType<typeof useGumroadProducts>["data"]> }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.id} className="glass-card overflow-hidden flex flex-col group">
          {p.thumbnailUrl ? (
            <img src={p.thumbnailUrl} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover" />
          ) : (
            <div
              aria-hidden="true"
              className="w-full aspect-[4/3] flex items-center justify-center text-5xl font-extrabold text-white/80 bg-gradient-to-br from-cyan-400/25 via-[#0a0a1a]/60 to-fuchsia-500/25"
              style={{ textShadow: "0 0 24px rgba(34,211,238,0.6)" }}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-bold leading-snug">{p.name}</h3>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ml-3 ${
                  p.isFree ? "bg-cyan-400/10 text-cyan-400" : "bg-purple-400/10 text-purple-400"
                }`}
              >
                {p.formattedPrice}
              </span>
            </div>
            {p.summary && (
              <p className="text-white/40 text-sm leading-relaxed flex-1 mb-6">{p.summary}</p>
            )}
            <a
              className="gumroad-button w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm"
              href={p.shortUrl}
            >
              {p.isFree ? "Get It Free" : `Get It · ${p.formattedPrice}`}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function useGumroadProducts() {
  return trpc.gumroad.products.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export default function Store() {
  const gumroad = useGumroadProducts();
  const catalog = trpc.products.list.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Only needed when the Gumroad catalog comes back empty.
    enabled: gumroad.isSuccess ? gumroad.data.length === 0 : gumroad.isError,
  });

  const liveProducts = gumroad.data ?? [];
  const useLive = liveProducts.length > 0;

  const fallbackProducts: DisplayProduct[] =
    catalog.data && catalog.data.length > 0
      ? [
          ASSESSMENT,
          ...catalog.data.map((p): DisplayProduct => {
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

  const isLoading = gumroad.isLoading || (!useLive && catalog.isLoading);

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
            {/* Plain <a>: /library is server-rendered, not a client route. */}
            <a href="/library" className="text-xs text-white/40 hover:text-white/90 transition-colors hidden sm:block font-medium tracking-wide uppercase">
              Library
            </a>
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
            <SkeletonGrid />
          ) : useLive ? (
            <GumroadGrid products={liveProducts} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackProducts.map((product) => (
                <div
                  key={product.key}
                  className={`glass-card p-8 flex flex-col group ${
                    product.status === "coming-soon" ? "opacity-60" : ""
                  }`}
                >
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

                  <h3 className="text-white text-xl font-bold mb-3">
                    {product.name}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed flex-1 mb-6">
                    {product.description}
                  </p>

                  {product.status === "live" && product.gumroadUrl && (
                    <a
                      href={product.gumroadUrl}
                      className="gumroad-button w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm"
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
          <div className="flex flex-wrap items-center justify-center gap-5">
            {SOCIALS.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium" aria-label={`The Digital City on ${s.name} (${s.handle})`}>
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
