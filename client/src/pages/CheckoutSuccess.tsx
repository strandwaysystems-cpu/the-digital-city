import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-[#111318] text-white flex items-center justify-center">
      <div className="container max-w-lg text-center py-20">
        <div className="w-16 h-16 rounded-full bg-green-400/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-400" />
        </div>

        <h1
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          className="text-3xl text-white mb-3"
        >
          Purchase Complete
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/50 mb-8 leading-relaxed">
          Your digital product is now available in your account. You can download it immediately from your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-sm bg-amber-400 text-[#111318] font-semibold hover:bg-amber-300 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
            >
              <Download size={14} />
              Go to Downloads
            </button>
          </Link>
          <Link href="/store">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
            >
              Continue Shopping
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/25 text-xs mt-12">
          A receipt has been sent to your email. If you have any issues, contact support.
        </p>
      </div>
    </div>
  );
}
