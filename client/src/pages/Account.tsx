import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Download, LogOut, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

const LOGO = "/manus-storage/digital-city-logo_c47ad8cb.jpg";

export default function Account() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: myOrders, isLoading: ordersLoading } = trpc.orders.myOrders.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myDownloads, isLoading: downloadsLoading } = trpc.downloads.myDownloads.useQuery(undefined, { enabled: isAuthenticated });
  const { data: allProducts } = trpc.products.list.useQuery();

  const downloadMutation = trpc.downloads.getLink.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast.success(`Downloading ${data.productName}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl("/account");
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-pulse text-white/30 font-mono text-sm">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const getProductName = (productId: number) => {
    const product = allProducts?.find(p => p.id === productId);
    return product?.name || `Product #${productId}`;
  };

  const handleDownload = (productId: number) => {
    downloadMutation.mutate({ productId });
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative">
      {/* Ambient glow */}
      <div className="orb-cyan w-[400px] h-[400px] -top-40 -right-40 opacity-15 fixed" />
      <div className="orb-magenta w-[300px] h-[300px] bottom-20 left-0 opacity-10 fixed" />

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
            <Link href="/account" className="text-xs text-cyan-400 transition-colors font-medium tracking-wide uppercase">
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-8 relative">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <span className="tag-label mb-4 block">Account · Dashboard</span>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                Welcome back, <span className="text-glow-cyan">{user?.name || "Builder"}</span>
              </h1>
              <p className="text-white/40 text-sm">
                {user?.email}
              </p>
            </div>
            <button
              onClick={() => { logout(); setLocation("/"); }}
              className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors font-mono"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="pb-12 relative">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Download size={18} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              My Downloads
            </h2>
          </div>

          {downloadsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 glass-card animate-pulse" />)}
            </div>
          ) : myDownloads && myDownloads.length > 0 ? (
            <div className="space-y-3">
              {myDownloads.map((dl) => (
                <div key={dl.id} className="flex items-center justify-between glass-card p-5">
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {getProductName(dl.productId)}
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      Downloaded {dl.downloadCount} time{dl.downloadCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(dl.productId)}
                    disabled={downloadMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all font-medium"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card">
              <Package size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                No downloads yet.{" "}
                <Link href="/store" className="text-cyan-400 hover:underline">
                  Browse the store
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Orders Section */}
      <section className="pb-24 relative">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag size={18} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Purchase History
            </h2>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 glass-card animate-pulse" />)}
            </div>
          ) : myOrders && myOrders.length > 0 ? (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between glass-card p-5">
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {getProductName(order.productId)}
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} · ${order.amount}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-400/10 text-emerald-400 uppercase font-mono">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card">
              <ShoppingBag size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                No purchases yet.{" "}
                <Link href="/store" className="text-cyan-400 hover:underline">
                  Browse the store
                </Link>
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
