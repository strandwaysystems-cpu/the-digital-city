/**
 * THE DIGITAL CITY — Home Landing Page
 * Design: Dark Cartographic Minimal
 * Palette: Charcoal (#111318) + Off-white (#F0EDE8) + Amber (#F5A623)
 * Fonts: Space Grotesk (display) + DM Sans (body) + Space Mono (labels)
 * Goal: Email capture → Book sale → Digital products → Affiliate
 */

import { motion, type Transition, type Variants } from "framer-motion";
import { useState } from "react";
import { ArrowRight, BookOpen, Building2, ChevronDown, Map, Zap, TrendingUp, Users, Mail, ExternalLink } from "lucide-react";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663417824304/KVXDge6fvUaWycs2S4xzUy/hero-bg-5qJBjPa479HB3GPPoaxvoc.webp";
const BOOK_COVER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663417824304/KVXDge6fvUaWycs2S4xzUy/book-mockup-bg-mctHpTe5L8Ttdwy2wK24KA.webp";
const DISTRICT_MAP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663417824304/KVXDge6fvUaWycs2S4xzUy/district-map-83uWntFmNF9MUU34zhuUNs.webp";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1 } as Transition,
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } as Transition },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#111318]/80">
      <div className="container flex items-center justify-between h-14">
        <span
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}
          className="text-sm text-white/90 uppercase tracking-widest"
        >
          The Digital City
        </span>
        <div className="flex items-center gap-6">
          <a href="#book" className="text-xs text-white/50 hover:text-white/90 transition-colors hidden sm:block" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
            THE BOOK
          </a>
          <a href="#districts" className="text-xs text-white/50 hover:text-white/90 transition-colors hidden sm:block" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
            DISTRICTS
          </a>
          <a href="#resources" className="text-xs text-white/50 hover:text-white/90 transition-colors hidden sm:block" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
            RESOURCES
          </a>
          <a
            href="#email-capture"
            className="btn-amber px-4 py-1.5 text-xs rounded-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}
          >
            GET THE MAP
          </a>
        </div>
      </div>
    </nav>
  );
}

function EmailCapture({ variant = "hero" }: { variant?: "hero" | "inline" | "footer" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-amber-400">
        <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm">
          You're in. Check your inbox.
        </span>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        <button
          type="submit"
          className="btn-amber px-6 py-3 text-sm rounded-sm whitespace-nowrap"
        >
          Get Free Access
        </button>
      </form>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        <button
          type="submit"
          className="btn-amber px-6 py-3 text-sm rounded-sm whitespace-nowrap"
        >
          Join the City
        </button>
      </form>
    );
  }

  return null;
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111318]/60 via-[#111318]/40 to-[#111318]" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture opacity-40" />

      <div className="relative container pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Coordinate label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="coord-marker mb-8"
          >
            STRANDWAY SYSTEMS · DISTRICT 00 · ENTRY POINT
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, type: "tween" }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, lineHeight: 1.05 }}
            className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6"
          >
            The internet is<br />
            a{" "}
            <span className="text-amber-400">city.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45, type: "tween" }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            className="text-lg sm:text-xl text-white/60 mb-4 max-w-xl leading-relaxed"
          >
            Most people are renters. They scroll, click, and consume — generating wealth for everyone except themselves.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55, type: "tween" }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl leading-relaxed"
          >
            <span className="text-amber-400 font-medium">The Digital City</span> is the map that shows you how to become an owner.
          </motion.p>

          {/* CTA group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            id="email-capture"
            className="mb-6"
          >
            <p className="text-xs text-white/40 mb-3" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
              GET THE FREE FRAMEWORK GUIDE — NO SPAM, EVER
            </p>
            <EmailCapture variant="hero" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a href="#book" className="flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors group">
              <BookOpen size={14} />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Read the book</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#districts" className="flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors group">
              <Map size={14} />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Explore the districts</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="coord-marker">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TwoTypesSection() {
  return (
    <section className="section-rule py-24">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-px bg-white/8 rounded-sm overflow-hidden"
        >
          {/* Consumer side */}
          <motion.div variants={fadeUp} className="bg-[#111318] p-10 md:p-14">
            <div className="coord-marker mb-6">TYPE 01 · CONSUMER</div>
            <h3
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
              className="text-2xl text-white/40 mb-4 line-through decoration-white/20"
            >
              The Renter
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/40 leading-relaxed text-sm">
              Scrolls, clicks, streams, and shares. Generates attention and data that make platforms worth billions. Participates in the economy every day without capturing any of the value they create.
            </p>
            <div className="mt-8 space-y-2">
              {["Trades time for money", "Rents attention to platforms", "Builds nothing that compounds", "Works until they can't"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Builder-owner side */}
          <motion.div variants={fadeUp} className="bg-[#161a20] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl" />
            <div className="coord-marker mb-6 text-amber-400/60">TYPE 02 · BUILDER-OWNER</div>
            <h3
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              className="text-2xl text-amber-400 mb-4"
            >
              The Owner
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/70 leading-relaxed text-sm">
              Creates digital assets — websites, tools, content, communities — that attract and serve consumers. Monetizes through advertising, affiliate commissions, digital product sales, and subscriptions. Builds a portfolio that compounds.
            </p>
            <div className="mt-8 space-y-2">
              {["Builds assets that earn while sleeping", "Owns digital real estate", "Revenue compounds over time", "Designs their own freedom"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-white/70" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
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
          style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}
          className="text-center text-white/40 mt-10 text-base max-w-xl mx-auto"
        >
          "Most people who use the internet are consumers. A small, growing, and increasingly sophisticated population are builder-owners."
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center coord-marker mt-2"
        >
          — THE DIGITAL CITY, CH. 1
        </motion.p>
      </div>
    </section>
  );
}

function BookSection() {
  return (
    <section id="book" className="section-rule py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Book cover */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "tween" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-amber-400/5 rounded-sm blur-2xl" />
            <img
              src={BOOK_COVER}
              alt="The Digital City book cover"
              className="relative w-full max-w-xs mx-auto lg:mx-0 rounded-sm shadow-2xl shadow-black/60"
              style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-amber-400/20 rounded-sm" />
          </motion.div>

          {/* Book info */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="coord-marker mb-4">STRANDWAY SYSTEMS · 2026</motion.div>
            <motion.h2
              variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              className="text-4xl text-white mb-2"
            >
              The Digital City
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}
              className="text-xl text-amber-400 mb-6"
            >
              How the Internet Economy Really Works
            </motion.p>
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-white/60 leading-relaxed mb-4"
            >
              The internet is not a communication tool. It is not an information network. It is an economy — a massive, largely invisible economy that generates trillions of dollars in value every year.
            </motion.p>
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-white/60 leading-relaxed mb-8"
            >
              This book gives you the mental map to see it, understand it, and build within it — the same way property owners, infrastructure builders, and capital allocators have always built wealth in physical cities.
            </motion.p>

            {/* What you'll learn */}
            <motion.div variants={fadeUp} className="space-y-3 mb-10">
              {[
                { icon: Map, text: "Why the internet is structured exactly like a city — and how to use that map" },
                { icon: Building2, text: "The difference between digital renters and digital owners" },
                { icon: TrendingUp, text: "How to build assets that compound: content, tools, communities, products" },
                { icon: Zap, text: "The revenue models that power the internet economy" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={14} className="text-amber-400 mt-1 shrink-0" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-white/70">{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById("email-capture")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-amber px-6 py-3 text-sm rounded-sm flex items-center gap-2"
              >
                Get Free Chapter
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => alert("Book purchase coming soon — join the email list to be notified.")}
                className="btn-ghost-amber px-6 py-3 text-sm rounded-sm"
              >
                Pre-order the Book
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DistrictsSection() {
  const districts = [
    {
      num: "01",
      name: "Foundation",
      tagline: "Understand the Digital Economy",
      desc: "How the digital economy works, what digital assets are, and why this model produces freedom where traditional employment does not.",
    },
    {
      num: "02",
      name: "Architecture",
      tagline: "Design Your Portfolio",
      desc: "How to think about a digital asset portfolio at the system level — asset categories, portfolio construction, and compounding mechanics.",
    },
    {
      num: "03",
      name: "Build",
      tagline: "Create Digital Assets",
      desc: "The mechanics of building specific digital asset types — content properties, digital products, email assets, and automated systems.",
    },
    {
      num: "04",
      name: "Systems",
      tagline: "Automate and Scale",
      desc: "How to build operational systems that allow your portfolio to scale without proportional increases in active management.",
    },
    {
      num: "05",
      name: "Market",
      tagline: "Distribution and Audience",
      desc: "How to grow an audience, build owned distribution channels, and create the trust infrastructure that makes all digital assets easier to monetize.",
    },
    {
      num: "06",
      name: "Capital",
      tagline: "Revenue and Reinvestment",
      desc: "How to manage the financial architecture of a digital asset portfolio — revenue tracking, capital allocation, and reinvestment strategy.",
    },
  ];

  return (
    <section id="districts" className="section-rule py-24">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp} className="coord-marker mb-4">THE CURRICULUM · SIX DISTRICTS</motion.div>
          <motion.h2
            variants={fadeUp}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            className="text-4xl text-white mb-4"
          >
            Navigate the City
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-white/50 max-w-xl mb-12 leading-relaxed"
          >
            The Digital City curriculum is organized into six Districts — each representing a foundational area of knowledge that a digital asset builder must master.
          </motion.p>

          {/* District map image */}
          <motion.div
            variants={fadeUp}
            className="mb-12 rounded-sm overflow-hidden border border-white/8"
          >
            <img
              src={DISTRICT_MAP}
              alt="The Digital City District Map"
              className="w-full object-cover"
            />
          </motion.div>

          {/* District cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {districts.map((d, i) => (
              <motion.div
                key={d.num}
                variants={fadeUp}
                custom={i * 0.5}
                className="district-card p-6 rounded-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
                    className="text-3xl text-amber-400/30"
                  >
                    {d.num}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 mt-2" />
                </div>
                <h3
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                  className="text-white text-lg mb-1"
                >
                  {d.name}
                </h3>
                <p
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}
                  className="text-amber-400/70 text-xs mb-3 uppercase tracking-wider"
                >
                  {d.tagline}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/45 text-sm leading-relaxed">
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-10 text-center">
            <button
              onClick={() => document.getElementById("email-capture-bottom")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-amber px-8 py-3 text-sm rounded-sm inline-flex items-center gap-2"
            >
              Access the Full Curriculum
              <ArrowRight size={14} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  const resources = [
    {
      type: "DIGITAL GUIDE · FREE",
      title: "The Builder's Toolkit",
      desc: "Every tool, platform, and resource you need to build a digital asset portfolio — with honest assessments of what works, what to skip, and what to buy first.",
      cta: "Download Free",
      badge: "FREE",
      price: null,
      href: "#email-capture-bottom",
    },
    {
      type: "DIGITAL PRODUCT · $17",
      title: "Portfolio Blueprint",
      desc: "A step-by-step system for building your first digital asset portfolio — from identifying your knowledge assets to launching your first product and earning your first $1,000/month.",
      cta: "Get the Blueprint",
      badge: "$17",
      price: "$17",
      href: "https://gumroad.com",
    },
    {
      type: "AFFILIATE TOOLS · CURATED",
      title: "Recommended Stack",
      desc: "The exact tools the studio uses: Beehiiv for email, Hostinger for hosting, Canva for design, Gumroad for products. Every link is affiliate — every tool is genuine.",
      cta: "View the Stack",
      badge: "CURATED",
      price: null,
      href: "#email-capture-bottom",
    },
  ];

  return (
    <section id="resources" className="section-rule py-24">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp} className="coord-marker mb-4">RESOURCES · TOOLS · GUIDES</motion.div>
          <motion.h2
            variants={fadeUp}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            className="text-4xl text-white mb-4"
          >
            Build Your Stack
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-white/50 max-w-xl mb-12 leading-relaxed"
          >
            Guides, frameworks, and tools to accelerate your move from consumer to builder-owner. Only what the studio actually uses.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-4">
            {resources.map((r, i) => (
              <motion.div
                key={r.title}
                variants={fadeUp}
                custom={i * 0.5}
                className="district-card p-8 rounded-sm flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="coord-marker">{r.type}</span>
                  <span
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em" }}
                    className={`px-2 py-0.5 rounded-sm ${
                      r.badge === "FREE" ? "bg-amber-400/15 text-amber-400" :
                      r.badge === "CURATED" ? "bg-amber-400/10 text-amber-400/70" :
                      "bg-amber-400/20 text-amber-400 font-bold"
                    }`}
                  >
                    {r.badge}
                  </span>
                </div>
                <h3
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                  className="text-white text-xl mb-3"
                >
                  {r.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/45 text-sm leading-relaxed flex-1 mb-6">
                  {r.desc}
                </p>
                <a
                  href={r.href}
                  onClick={r.href.startsWith("#") ? (e) => {
                    e.preventDefault();
                    document.getElementById(r.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                  } : undefined}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-sm flex items-center gap-2 transition-colors text-amber-400 hover:text-amber-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
                >
                  {r.cta}
                  <ExternalLink size={12} />
                </a>
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
    <section id="email-capture-bottom" className="py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-amber-400/6 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="coord-marker mb-6 justify-center flex">
            <Mail size={12} className="mr-2 text-amber-400/60" />
            THE DIGITAL CITY · DISPATCH
          </motion.div>

          <motion.h2
            variants={fadeUp}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            className="text-4xl sm:text-5xl text-white mb-4"
          >
            Get your plot in<br />
            <span className="text-amber-400">the city.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-white/50 mb-3 leading-relaxed"
          >
            Join the builders who are learning to see the digital economy for what it is — and building their stake in it.
          </motion.p>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-white/70 mb-10 leading-relaxed"
          >
            Get the free Framework Guide, early access to new Districts, and the tools the studio actually uses.
          </motion.p>

          <motion.div variants={fadeUp} className="flex justify-center">
            <EmailCapture variant="footer" />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-6">
            {[
              { icon: BookOpen, label: "Free Framework Guide" },
              { icon: Map, label: "District Map Access" },
              { icon: Users, label: "Builder Community" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-white/35" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Icon size={12} className="text-amber-400/50" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="section-rule py-12">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}
              className="text-sm text-white/70 uppercase tracking-widest mb-1"
            >
              The Digital City
            </p>
            <p className="coord-marker">AN ENTITY OF STRANDWAY SYSTEMS</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "The Book", href: "#book" },
              { label: "Districts", href: "#districts" },
              { label: "Resources", href: "#resources" },
              { label: "Join", href: "#email-capture-bottom" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="coord-marker">© 2026 STRANDWAY SYSTEMS · ALL RIGHTS RESERVED</p>
          <p className="text-xs text-white/20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Affiliate links may be present. We only recommend what we use.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111318] text-white">
      <NavBar />
      <HeroSection />
      <TwoTypesSection />
      <BookSection />
      <DistrictsSection />
      <ResourcesSection />
      <EmailCaptureSection />
      <FooterSection />
    </div>
  );
}
