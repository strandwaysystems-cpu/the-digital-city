import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ArrowRight, BookOpen, Download, Lock, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

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
    <div className="min-h-screen bg-[#111318] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#111318]/80">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}
              className="text-sm text-white/90 uppercase tracking-widest cursor-pointer"
            >
              The Digital City
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-white/50 hover:text-white/90 transition-colors" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
              HOME
            </Link>
            <Link href="/store" className="text-xs text-amber-400 transition-colors" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
              STORE
            </Link>
            {isAuthenticated ? (
              <Link href="/account" className="text-xs text-white/50 hover:text-white/90 transition-colors" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
                MY ACCOUNT
              </Link>
            ) : (
              <a href={getLoginUrl("/store")} className="btn-amber px-4 py-1.5 text-xs rounded-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                SIGN IN
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16">
        <div className="container">
          <div className="coord-marker mb-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(245,166,35,0.5)" }}>
            THE DIGITAL CITY · STORE
          </div>
          <h1
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            className="text-4xl sm:text-5xl text-white mb-4"
          >
            Digital Products & <span className="text-amber-400">Guides</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/50 max-w-xl leading-relaxed">
            Everything you need to transition from consumer to builder-owner. Frameworks, blueprints, and tools — built from real experience.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/5 border border-white/8 rounded-sm p-8 animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#161a20] border border-white/8 rounded-sm p-8 flex flex-col hover:border-amber-400/30 transition-colors group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em" }}
                      className="text-amber-400/50 uppercase"
                    >
                      {getProductTypeLabel(product.productType)}
                    </span>
                    <span
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                      className={`px-2 py-0.5 rounded-sm ${
                        product.isFree
                          ? "bg-amber-400/15 text-amber-400"
                          : "bg-amber-400/20 text-amber-400 font-bold"
                      }`}
                    >
                      {product.isFree ? "FREE" : `$${product.price}`}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                    className="text-white text-xl mb-3"
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-white/45 text-sm leading-relaxed flex-1 mb-6"
                  >
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
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-sm border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      <Download size={14} />
                      Download Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(product.id)}
                      disabled={checkoutMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-sm bg-amber-400 text-[#111318] font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
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
              <Sparkles size={48} className="text-amber-400/30 mx-auto mb-4" />
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }} className="text-white text-xl mb-2">
                Store Coming Soon
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/40">
                Products are being prepared. Check back shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container flex items-center justify-between">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em" }} className="text-white/25 uppercase">
            © 2026 STRANDWAY SYSTEMS
          </p>
          <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
