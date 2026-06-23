import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="orb-cyan w-[400px] h-[400px] top-1/4 left-1/4 opacity-15" />
      <div className="orb-magenta w-[300px] h-[300px] bottom-1/4 right-1/4 opacity-10" />

      <div className="container max-w-lg text-center py-20 relative">
        <div className="w-16 h-16 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-400/20">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
          Purchase Complete
        </h1>

        <p className="text-white/50 mb-8 leading-relaxed">
          Your digital product is now available in your account. You can download it immediately from your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <button className="btn-neon flex items-center justify-center gap-2 px-6 py-3 text-sm">
              <Download size={14} />
              Go to Downloads
            </button>
          </Link>
          <Link href="/store">
            <button className="btn-ghost flex items-center justify-center gap-2 px-6 py-3 text-sm">
              Continue Shopping
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        <p className="text-white/25 text-xs mt-12">
          A receipt has been sent to your email. If you have any issues, contact support.
        </p>

        <div className="flex items-center justify-center gap-6 mt-8">
          <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Privacy</Link>
          <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Terms</Link>
        </div>
      </div>
    </div>
  );
}
