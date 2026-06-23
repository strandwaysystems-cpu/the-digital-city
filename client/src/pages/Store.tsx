import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Download, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const LOGO = "/manus-storage/digital-city-logo_c47ad8cb.jpg";

export default function Store() {
  const { user, isAuthenticated } = useAuth();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const checkoutMutation = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handlePurchase = (productId: number) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase");
      window.location.href = getLoginUrl("/store");
      return;
    }
    checkoutMutation.mutate({ productId });
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "ebook": return "EBOOK";
      case "guide": return "STRATEGIC GUIDE";
      case "blueprint": return "BLUEPRINT";
      case "toolkit": return "TOOLKIT";
      case "course": return "COURSE";
      default: return "PRODUCT";
    }
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
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-8 animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="glass-card p-8 flex flex-col group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="tag-label text-white/30">
                      {getProductTypeLabel(product.productType)}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      product.isFree
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "bg-purple-400/10 text-purple-400"
                    }`}>
                      {product.isFree ? "FREE" : `$${product.price}`}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-white text-xl font-bold mb-3">
                    {product.name}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed flex-1 mb-6">
                    {product.shortDescription || product.description}
                  </p>

                  {/* CTA */}
                  {product.isFree ? (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          window.location.href = getLoginUrl("/store");
                          return;
                        }
                        toast.info("Downloading...");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all font-medium"
                    >
                      <Download size={14} />
                      Download Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(product.id)}
                      disabled={checkoutMutation.isPending}
                      className="w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-50"
                    >
                      <ShoppingCart size={14} />
                      {checkoutMutation.isPending ? "Processing..." : `Buy · $${product.price}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && (!products || products.length === 0) && (
            <div className="text-center py-20">
              <Sparkles size={48} className="text-cyan-400/30 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">
                Store Coming Soon
              </h3>
              <p className="text-white/40">
                Products are being prepared. Check back shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="The Digital City" className="w-6 h-6 rounded-md" />
            <span className="text-sm font-medium text-white/40">Strandway Systems · 2026</span>
          </div>
          <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
