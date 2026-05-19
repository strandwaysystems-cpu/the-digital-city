import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Download, LogOut, Package, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

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
      <div className="min-h-screen bg-[#111318] flex items-center justify-center">
        <div className="animate-pulse text-white/30" style={{ fontFamily: "'Space Mono', monospace" }}>Loading...</div>
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
            <Link href="/store" className="text-xs text-white/50 hover:text-white/90 transition-colors" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
              STORE
            </Link>
            <Link href="/account" className="text-xs text-amber-400 transition-colors" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
              MY ACCOUNT
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <div className="coord-marker mb-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(245,166,35,0.5)" }}>
                ACCOUNT · DASHBOARD
              </div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} className="text-3xl text-white mb-2">
                Welcome back, <span className="text-amber-400">{user?.name || "Builder"}</span>
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/40 text-sm">
                {user?.email}
              </p>
            </div>
            <button
              onClick={() => { logout(); setLocation("/"); }}
              className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="pb-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Download size={18} className="text-amber-400" />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }} className="text-xl text-white">
              My Downloads
            </h2>
          </div>

          {downloadsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-sm animate-pulse" />)}
            </div>
          ) : myDownloads && myDownloads.length > 0 ? (
            <div className="space-y-3">
              {myDownloads.map((dl) => (
                <div key={dl.id} className="flex items-center justify-between bg-[#161a20] border border-white/8 rounded-sm p-4">
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }} className="text-white text-sm">
                      {getProductName(dl.productId)}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/30 text-xs mt-1">
                      Downloaded {dl.downloadCount} time{dl.downloadCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(dl.productId)}
                    disabled={downloadMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-xs rounded-sm border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#161a20] border border-white/8 rounded-sm">
              <Package size={32} className="text-white/20 mx-auto mb-3" />
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/30 text-sm">
                No downloads yet.{" "}
                <Link href="/store" className="text-amber-400 hover:underline">
                  Browse the store
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Orders Section */}
      <section className="pb-24">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag size={18} className="text-amber-400" />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }} className="text-xl text-white">
              Purchase History
            </h2>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-sm animate-pulse" />)}
            </div>
          ) : myOrders && myOrders.length > 0 ? (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between bg-[#161a20] border border-white/8 rounded-sm p-4">
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }} className="text-white text-sm">
                      {getProductName(order.productId)}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/30 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} · ${order.amount}
                    </p>
                  </div>
                  <span
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em" }}
                    className="px-2 py-1 rounded-sm bg-green-400/15 text-green-400 uppercase"
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#161a20] border border-white/8 rounded-sm">
              <ShoppingBag size={32} className="text-white/20 mx-auto mb-3" />
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/30 text-sm">
                No purchases yet.{" "}
                <Link href="/store" className="text-amber-400 hover:underline">
                  Browse the store
                </Link>
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
