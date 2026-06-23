/**
 * THE DIGITAL CITY — Home Landing Page v2
 * Design: Premium Glassmorphism / Neon City
 * Palette: Deep navy (#0a0a1a) + Cyan neon + Magenta neon
 * Font: Inter (display + body) + JetBrains Mono (labels)
 * Goal: Email capture → Book sale → Digital products → Affiliate
 */

import { motion, type Transition, type Variants } from "framer-motion";
import { useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, Cpu, Radio, ShoppingCart, Landmark, Code2, Sparkles, Mail, Download } from "lucide-react";
import { Link } from "wouter";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const LOGO = "/manus-storage/digital-city-logo_c47ad8cb.jpg";

// ─── Beehiiv Integration ──────────────────────────────────────────────────────
const BEEHIIV_SUBSCRIBE_URL = "https://digitalcity-newsletter-e176d1.beehiiv.com/subscribe";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } as Transition },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a1a]/70">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <img src={LOGO} alt="The Digital City" className="w-8 h-8 rounded-lg" />
          <span className="text-sm font-semibold text-white/90 tracking-tight">
            The Digital City
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <a href="#districts" className="text-xs text-white/40 hover:text-white/90 transition-colors hidden sm:block font-medium tracking-wide uppercase">
            Districts
          </a>
          <a href="#book" className="text-xs text-white/40 hover:text-white/90 transition-colors hidden sm:block font-medium tracking-wide uppercase">
            Book
          </a>
          <Link href="/store" className="text-xs text-white/40 hover:text-white/90 transition-colors hidden sm:block font-medium tracking-wide uppercase">
            Store
          </Link>
          <a
            href="#subscribe"
            className="btn-neon px-5 py-2 text-xs font-semibold"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

function EmailCapture({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const url = new URL(BEEHIIV_SUBSCRIBE_URL);
    url.searchParams.set("email", email);
    url.searchParams.set("utm_source", "website");
    url.searchParams.set("utm_medium", "organic");
    url.searchParams.set("utm_campaign", variant === "footer" ? "footer_form" : "hero_form");
    window.open(url.toString(), "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
        />
        <button
          type="submit"
          disabled={submitted}
          className="btn-neon px-6 py-3 text-sm whitespace-nowrap disabled:opacity-50"
        >
          {submitted ? "Sent!" : "Join Free"}
        </button>
      </form>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="orb-cyan w-[600px] h-[600px] -top-40 -left-40 opacity-30" />
      <div className="orb-magenta w-[500px] h-[500px] -bottom-20 -right-20 opacity-20" />
      <div className="orb-cyan w-[300px] h-[300px] top-1/2 right-1/4 opacity-15" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative container pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
          >
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-xs font-medium text-white/60">The framework for digital asset builders</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]"
          >
            The internet is a{" "}
            <span className="text-glow-cyan">city.</span>
            <br />
            <span className="text-white/60 text-4xl sm:text-5xl lg:text-6xl font-bold">
              Most people are renters.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            They scroll, click, and consume — generating wealth for platforms, not themselves.{" "}
            <span className="text-white/80 font-medium">The Digital City</span> is the map that shows you how to become an owner.
          </motion.p>

          {/* CTA group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            id="subscribe"
            className="flex flex-col items-center gap-4 mb-10"
          >
            <EmailCapture variant="hero" />
            <p className="text-xs text-white/25 font-medium">
              Free framework guide. No spam, ever.
            </p>
          </motion.div>

          {/* Logo showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-12"
          >
            <img
              src={LOGO}
              alt="The Digital City"
              className="w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-2xl shadow-2xl shadow-cyan-500/20 border border-white/10"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="tag-label text-white/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TwoTypesSection() {
  return (
    <section className="section-divider py-28 relative">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Consumer side */}
          <motion.div variants={fadeUp} className="glass-card p-10 md:p-12 relative overflow-hidden">
            <div className="tag-label mb-6 text-white/30">Type 01 · Consumer</div>
            <h3 className="text-2xl font-bold text-white/30 mb-4 line-through decoration-white/15">
              The Renter
            </h3>
            <p className="text-white/35 leading-relaxed text-sm mb-8">
              Scrolls, clicks, streams, and shares. Generates attention and data that make platforms worth billions. Participates in the economy every day without capturing any of the value they create.
            </p>
            <div className="space-y-2.5">
              {["Trades time for money", "Rents attention to platforms", "Builds nothing that compounds", "Works until they can't"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-white/25">
                  <div className="w-1 h-1 rounded-full bg-white/15" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Builder-owner side */}
          <motion.div variants={fadeUp} className="gradient-border p-10 md:p-12 relative overflow-hidden">
            <div className="orb-cyan w-40 h-40 -top-10 -right-10 opacity-20" />
            <div className="tag-label mb-6">Type 02 · Builder-Owner</div>
            <h3 className="text-2xl font-bold text-glow-cyan mb-4">
              The Owner
            </h3>
            <p className="text-white/65 leading-relaxed text-sm mb-8">
              Creates digital assets — websites, tools, content, communities — that attract and serve consumers. Monetizes through advertising, affiliate commissions, digital product sales, and subscriptions.
            </p>
            <div className="space-y-2.5">
              {["Builds assets that earn while sleeping", "Owns digital real estate", "Revenue compounds over time", "Designs their own freedom"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-white/65">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-white/35 mt-12 text-base max-w-xl mx-auto italic leading-relaxed"
        >
          "Most people who use the internet are consumers. A small, growing, and increasingly sophisticated population are builder-owners."
        </motion.p>
      </div>
    </section>
  );
}

function DistrictsSection() {
  const districts = [
    {
      num: "01",
      icon: Cpu,
      name: "The Intelligent & Autonomous District",
      tagline: "AI and automation that work without you.",
      color: "from-cyan-400/20 to-blue-500/10",
      glow: "cyan",
    },
    {
      num: "02",
      icon: Radio,
      name: "The Attention & Media District",
      tagline: "Audiences, content, and owned distribution.",
      color: "from-purple-400/20 to-magenta-500/10",
      glow: "magenta",
    },
    {
      num: "03",
      icon: ShoppingCart,
      name: "The E-Commerce & Retail District",
      tagline: "Selling products at internet scale.",
      color: "from-emerald-400/20 to-cyan-500/10",
      glow: "cyan",
    },
    {
      num: "04",
      icon: Landmark,
      name: "The Financial & Fintech District",
      tagline: "The money layer underneath everything.",
      color: "from-amber-400/20 to-orange-500/10",
      glow: "magenta",
    },
    {
      num: "05",
      icon: Code2,
      name: "The Software & Enterprise District",
      tagline: "Tools businesses pay to keep.",
      color: "from-blue-400/20 to-indigo-500/10",
      glow: "cyan",
    },
  ];

  return (
    <section id="districts" className="section-divider py-28 relative">
      <div className="orb-magenta w-[400px] h-[400px] top-0 left-0 opacity-10" />
      <div className="container relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag-label mb-4 block">Five Districts · One Economy</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Navigate the City
            </h2>
            <p className="text-white/45 max-w-xl mx-auto leading-relaxed">
              Every digital business belongs to one of five districts. Each represents a distinct economic layer of the internet.
            </p>
          </motion.div>

          {/* District cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {districts.map((d, i) => (
              <motion.div
                key={d.num}
                variants={scaleIn}
                className={`glass-card p-8 relative overflow-hidden ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-50`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <d.icon size={24} className={d.glow === "cyan" ? "text-cyan-400" : "text-purple-400"} />
                    <span className="tag-label text-white/20">{d.num}</span>
                  </div>
                  <h3 className="text-white text-lg font-bold mb-2 leading-tight">
                    {d.name}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {d.tagline}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BookSection() {
  return (
    <section id="book" className="section-divider py-28 relative">
      <div className="orb-cyan w-[500px] h-[500px] top-1/2 -right-40 opacity-10" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Book visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex justify-center"
          >
            <div className="gradient-border p-1 rounded-2xl">
              <img
                src={LOGO}
                alt="The Digital City Book"
                className="w-full max-w-sm rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Book info */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeUp} className="tag-label mb-4 block">The Book · Digital Economy Guide</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              The Digital City
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-cyan-400 font-medium mb-6">
              How the Internet Economy Really Works
            </motion.p>
            <motion.p variants={fadeUp} className="text-white/50 leading-relaxed mb-4">
              The internet is not a communication tool. It is an economy — a massive, largely invisible economy that generates trillions of dollars in value every year.
            </motion.p>
            <motion.p variants={fadeUp} className="text-white/50 leading-relaxed mb-8">
              This book gives you the mental map to see it, understand it, and build within it — the same way property owners and capital allocators have always built wealth in physical cities.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-3 mb-10">
              {[
                "Why the internet is structured exactly like a city",
                "The difference between digital renters and digital owners",
                "How to build assets that compound over time",
                "The revenue models that power the internet economy",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span className="text-sm text-white/60">{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/store"
                className="btn-neon px-6 py-3 text-sm flex items-center gap-2"
              >
                Buy the Ebook · $39
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-ghost px-6 py-3 text-sm flex items-center gap-2"
              >
                Get Free Chapter
                <Download size={14} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  const resources = [
    {
      title: "The Digital City",
      type: "Ebook",
      price: "$39",
      desc: "The complete guide to understanding the internet economy as a structured system.",
      cta: "Buy the Book",
      href: "/store",
      icon: BookOpen,
    },
    {
      title: "The Sovereign Digital Entrepreneur",
      type: "Strategic Guide",
      price: "Free",
      desc: "Strategic frameworks for online monetization in 2026. Master AI orchestration and zero-capital business models.",
      cta: "Download Free",
      href: "#subscribe",
      icon: Sparkles,
    },
    {
      title: "The Builder's Toolkit",
      type: "Resource Guide",
      price: "Free",
      desc: "Every tool, platform, and resource you need to build a digital asset portfolio.",
      cta: "Download Free",
      href: "#subscribe",
      icon: Code2,
    },
    {
      title: "Portfolio Blueprint",
      type: "Digital Product",
      price: "$17",
      desc: "A step-by-step system for building your first digital asset portfolio.",
      cta: "Get Blueprint",
      href: "/store",
      icon: Landmark,
    },
  ];

  return (
    <section className="section-divider py-28 relative">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag-label mb-4 block">Resources · Guides · Tools</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Build Your Stack
            </h2>
            <p className="text-white/45 max-w-xl mx-auto leading-relaxed">
              Guides, frameworks, and tools to accelerate your move from consumer to builder-owner.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {resources.map((r, i) => (
              <motion.div
                key={r.title}
                variants={scaleIn}
                className="glass-card p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <r.icon size={20} className="text-cyan-400" />
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    r.price === "Free"
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "bg-purple-400/10 text-purple-400"
                  }`}>
                    {r.price}
                  </span>
                </div>
                <span className="tag-label text-white/30 mb-2">{r.type}</span>
                <h3 className="text-white text-base font-bold mb-2">{r.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed flex-1 mb-5">{r.desc}</p>
                {r.href.startsWith("#") ? (
                  <button
                    onClick={() => document.getElementById(r.href.slice(1))?.scrollIntoView({ behavior: "smooth" })}
                    className="text-sm flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                  >
                    {r.cta}
                    <ArrowRight size={12} />
                  </button>
                ) : (
                  <Link
                    href={r.href}
                    className="text-sm flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                  >
                    {r.cta}
                    <ArrowRight size={12} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EmailCaptureSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="orb-cyan w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />
      <div className="orb-magenta w-[400px] h-[400px] bottom-0 left-0 opacity-10" />

      <div className="container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <Mail size={12} className="text-cyan-400" />
            <span className="text-xs font-medium text-white/60">The Digital City Dispatch</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Get your plot in<br />
            <span className="text-glow-cyan">the city.</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-white/45 mb-10 leading-relaxed max-w-lg mx-auto">
            Join the builders who are learning to see the digital economy for what it is — and building their stake in it.
          </motion.p>

          <motion.div variants={fadeUp} className="flex justify-center">
            <EmailCapture variant="footer" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="The Digital City" className="w-6 h-6 rounded-md" />
            <span className="text-sm font-medium text-white/40">Strandway Systems · 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Home</Link>
            <Link href="/store" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Store</Link>
            <a href="#districts" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Districts</a>
            <a href="#book" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">Book</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative">
      <NavBar />
      <HeroSection />
      <TwoTypesSection />
      <DistrictsSection />
      <BookSection />
      <ResourcesSection />
      <EmailCaptureSection />
      <Footer />
    </div>
  );
}
