import { Link } from "wouter";
import { ExternalLink, Clock, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const LOGO = "/manus-storage/digital-city-logo_c47ad8cb.jpg";
const GUMROAD_ASSESSMENT_URL = "https://buildyourdigitalcity.gumroad.com/l/owner-vs-renter";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  type: string;
  status: "live" | "coming-soon" | "free";
  gumroadUrl?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "owner-vs-renter",
    name: "Owner vs Renter Assessment",
    description: "Discover where you stand in the digital economy. This assessment reveals whether you're building assets that compound — or renting attention from platforms that do.",
    price: "$9",
    type: "ASSESSMENT",
    status: "live",
    gumroadUrl: GUMROAD_ASSESSMENT_URL,
  },
  {
    id: "digital-city-ebook",
    name: "The Digital City",
    description: "The complete guide to understanding the internet economy and building digital assets that compound. Five districts, one framework, unlimited upside.",
    price: "$39",
    type: "EBOOK",
    status: "coming-soon",
  },
  {
    id: "portfolio-blueprint",
    name: "Portfolio Blueprint",
    description: "Step-by-step system to build your first digital asset portfolio. From zero to $1,000/month in recurring revenue.",
    price: "$17",
    type: "BLUEPRINT",
    status: "coming-soon",
  },
  {
    id: "sovereign-entrepreneur",
    name: "The Sovereign Digital Entrepreneur",
    description: "Strategic frameworks for zero-capital digital monetization in 2026. Three complete business plans included.",
    price: "Free",
    type: "STRATEGIC GUIDE",
    status: "free",
  },
  {
    id: "builders-toolkit",
    name: "The Builder's Toolkit",
    description: "Every tool you need to build a digital asset portfolio — honest assessments, real recommendations, no affiliate fluff.",
    price: "Free",
    type: "TOOLKIT",
    status: "free",
  },
];

export default function Store() {
  const { isAuthenticated } = useAuth();

  const handleFreeDownload = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to download");
      window.location.href = getLoginUrl("/store");
      return;
    }
    toast.info("Downloading...");
  };

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
            {isAuthenticated ? (
              <Link href="/account" className="text-xs text-white/40 hover:text-white/90 transition-colors font-medium tracking-wide uppercase">
                Account
              </Link>
            ) : (
              <a href={getLoginUrl("/store")} className="btn-neon px-5 py-2 text-xs font-semibold">
                Sign In
              </a>
            )}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className={`glass-card p-8 flex flex-col group ${
                  product.status === "coming-soon" ? "opacity-60" : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="tag-label text-white/30">
                    {product.type}
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
                  <button
                    onClick={handleFreeDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all font-medium"
                  >
                    <Download size={14} />
                    Download Free
                  </button>
                )}
              </div>
            ))}
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
