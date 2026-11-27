/**
 * The Library — server-rendered articles on how online businesses work.
 *
 * Articles are Markdown files in content/library/*.md. They are rendered on
 * the server as plain HTML (not through the React app) so search engines get
 * the full text on the first request.
 *
 * Also serves /robots.txt and /sitemap.xml, which previously fell through to
 * the SPA's index.html.
 *
 * Frontmatter (between --- lines at the top of each file):
 *   title:        required
 *   description:  required, ~150 characters, used for search snippets
 *   district:     one of the DISTRICTS keys below
 *   date:         YYYY-MM-DD. Articles dated in the future stay hidden until
 *                 that day, so you can queue them up.
 *   status:       "published" or "draft" (drafts never show)
 *   product_name: optional, product to recommend at the end of the article
 *   product_url:  optional, its Gumroad link
 *   product_pitch: optional, one sentence on why the reader wants it
 */

import fs from "node:fs";
import path from "node:path";
import type { Express, Response } from "express";
import { marked } from "marked";
import { SOCIALS } from "../shared/socials";

export const SITE_URL = (process.env.SITE_URL || "https://buildyourdigitalcity.com").replace(/\/$/, "");

export const DISTRICTS: Record<string, string> = {
  "intelligent-autonomous": "Intelligent & Autonomous",
  "attention-media": "Attention & Media",
  "ecommerce-retail": "E-Commerce & Retail",
  "financial-fintech": "Financial & Fintech",
  "software-enterprise": "Software & Enterprise",
  "city-planning": "City Planning",
};

export interface Article {
  slug: string;
  title: string;
  description: string;
  district: string;
  date: string;
  status: string;
  productName?: string;
  productUrl?: string;
  productPitch?: string;
  html: string;
  readingMinutes: number;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    data[kv[1]] = kv[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return { data, body: match[2] };
}

export function parseArticle(slug: string, source: string): Article | null {
  const { data, body } = parseFrontmatter(source);
  if (!SLUG_RE.test(slug) || !data.title || !data.description || !data.date) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return null;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    description: data.description,
    district: DISTRICTS[data.district] ? data.district : "city-planning",
    date: data.date,
    status: data.status || "draft",
    productName: data.product_name || undefined,
    productUrl: data.product_url || undefined,
    productPitch: data.product_pitch || undefined,
    html: marked.parse(body, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export function isVisible(article: Article, today = new Date().toISOString().slice(0, 10)): boolean {
  return article.status === "published" && article.date <= today;
}

function contentDir(): string {
  const candidates = [
    path.resolve(import.meta.dirname, "..", "content", "library"),
    path.resolve(process.cwd(), "content", "library"),
  ];
  return candidates.find(dir => fs.existsSync(dir)) ?? candidates[0];
}

let cache: { at: number; articles: Article[] } | null = null;
const CACHE_TTL_MS = process.env.NODE_ENV === "development" ? 0 : 5 * 60 * 1000;

export function loadArticles(): Article[] {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.articles;
  const dir = contentDir();
  let articles: Article[] = [];
  if (fs.existsSync(dir)) {
    articles = fs
      .readdirSync(dir)
      .filter(f => f.endsWith(".md") && !f.startsWith("_"))
      .map(f => parseArticle(f.replace(/\.md$/, ""), fs.readFileSync(path.join(dir, f), "utf-8")))
      .filter((a): a is Article => a !== null);
  }
  articles.sort((a, b) => b.date.localeCompare(a.date));
  cache = { at: Date.now(), articles };
  return articles;
}

export function visibleArticles(): Article[] {
  return loadArticles().filter(a => isVisible(a));
}

// ─── HTML ─────────────────────────────────────────────────────────────────────

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

const STYLES = `
:root{--bg:#0a0a1a;--panel:rgba(255,255,255,.03);--line:rgba(255,255,255,.08);--text:rgba(255,255,255,.88);--muted:rgba(255,255,255,.55);--cyan:#22d3ee;--magenta:#e040fb}
*{box-sizing:border-box}
html{background:var(--bg)}
body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--cyan)}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
.wide{max-width:1040px}
nav{position:sticky;top:0;z-index:10;border-bottom:1px solid var(--line);background:rgba(10,10,26,.85);backdrop-filter:blur(16px)}
nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;max-width:1040px}
.brand{display:flex;align-items:center;gap:10px;color:var(--text);text-decoration:none;font-weight:600;font-size:14px}
.brand img{width:32px;height:32px;border-radius:8px}
.links{display:flex;gap:24px;align-items:center}
.links a{color:var(--muted);text-decoration:none;font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
.links a.on,.links a:hover{color:var(--cyan)}
.btn{display:inline-block;padding:10px 20px;border-radius:999px;border:1px solid rgba(34,211,238,.5);background:rgba(34,211,238,.1);color:var(--cyan);text-decoration:none;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit}
.btn:hover{background:rgba(34,211,238,.2)}
.tag{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan)}
header.hero{padding:72px 0 32px}
h1{font-size:clamp(32px,5vw,48px);line-height:1.15;letter-spacing:-.02em;margin:12px 0 16px;color:#fff}
.lede{font-size:18px;color:var(--muted);margin:0}
.meta{font-size:13px;color:var(--muted);margin-top:20px}
article{padding-bottom:24px}
article h2{font-size:26px;line-height:1.3;margin:48px 0 12px;color:#fff;letter-spacing:-.01em}
article h3{font-size:20px;margin:32px 0 8px;color:#fff}
article p,article li{font-size:17px}
article blockquote{margin:24px 0;padding:4px 20px;border-left:3px solid var(--magenta);color:var(--muted)}
article code{font-family:"JetBrains Mono",monospace;font-size:.9em;background:var(--panel);padding:2px 6px;border-radius:4px}
article table{border-collapse:collapse;width:100%;margin:24px 0;font-size:15px}
article th,article td{border:1px solid var(--line);padding:8px 12px;text-align:left}
.card{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:28px;margin:32px 0}
.card h2,.card h3{margin-top:0}
.card.product{border-color:rgba(224,64,251,.35)}
form.signup{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
form.signup input{flex:1 1 220px;min-width:0;padding:12px 16px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:#fff;font:inherit;font-size:15px}
.signup-msg{font-size:14px;margin-top:10px;color:var(--muted);min-height:1em}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 32px}
.filters a{font-size:13px;padding:6px 14px;border-radius:999px;border:1px solid var(--line);color:var(--muted);text-decoration:none}
.filters a.on{border-color:var(--cyan);color:var(--cyan)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;padding-bottom:48px}
.entry{display:block;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:24px;text-decoration:none;color:var(--text)}
.entry:hover{border-color:rgba(34,211,238,.4)}
.entry h2{font-size:20px;line-height:1.35;margin:10px 0 8px;color:#fff}
.entry p{margin:0;color:var(--muted);font-size:15px}
.empty{color:var(--muted);padding:24px 0 64px}
footer{border-top:1px solid var(--line);padding:32px 0;margin-top:48px;font-size:13px;color:var(--muted)}
footer .wrap{display:flex;gap:20px;flex-wrap:wrap;justify-content:space-between;max-width:1040px}
footer a{color:var(--muted);text-decoration:none;margin-right:16px}
footer .social{flex-basis:100%}
footer .social a{margin-right:0}
.follow{font-size:14px;color:var(--muted);margin:14px 0 0}
.brand,.links a{white-space:nowrap}
@media (max-width:600px){.links{gap:14px}.links .hide-sm{display:none}.links .btn{padding:8px 14px;font-size:11px}.brand span{display:none}header.hero{padding:48px 0 24px}}
`;

const SIGNUP_SCRIPT = `
document.querySelectorAll('form.signup').forEach(function(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var msg = form.parentNode.querySelector('.signup-msg');
    var email = form.querySelector('input[type=email]').value;
    var btn = form.querySelector('button'); btn.disabled = true;
    fetch('/api/trpc/subscribe.join', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({json:{email: email, source: form.dataset.source || 'library'}})})
      .then(function(r){ if(!r.ok) throw new Error(); msg.textContent = "You're in. Check your inbox to confirm."; form.reset(); })
      .catch(function(){ msg.textContent = 'Something went wrong. Please try again.'; })
      .finally(function(){ btn.disabled = false; });
  });
});
`;

function socialLinks(): string {
  return SOCIALS.map(
    x => `<a href="${x.url}" target="_blank" rel="noopener noreferrer" aria-label="The Digital City on ${x.name} (${x.handle})">${x.name}</a>`
  ).join(" · ");
}

function signupCard(source: string): string {
  return `<section class="card">
  <h3>Get the next one in your inbox</h3>
  <p style="margin:0;color:var(--muted)">One clear breakdown of how an online business really works, every week. No hype. Unsubscribe anytime.</p>
  <form class="signup" data-source="${esc(source)}">
    <input type="email" name="email" placeholder="you@example.com" required aria-label="Email address">
    <button class="btn" type="submit">Subscribe</button>
  </form>
  <div class="signup-msg" role="status"></div>
  <p class="follow">Or follow along: ${socialLinks()}</p>
</section>`;
}

function layout(opts: {
  title: string;
  description: string;
  canonicalPath: string;
  body: string;
  ogType?: string;
  jsonLd?: object;
}): string {
  const url = `${SITE_URL}${opts.canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${opts.ogType || "website"}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="The Digital City">
<meta property="og:image" content="${SITE_URL}/logo.jpg">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0a0a1a">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${STYLES}</style>
${opts.jsonLd ? `<script type="application/ld+json">${JSON.stringify(opts.jsonLd).replace(/</g, "\\u003c")}</script>` : ""}
</head>
<body>
<nav><div class="wrap">
  <a class="brand" href="/" aria-label="The Digital City home"><img src="/logo.jpg" alt=""><span>The Digital City</span></a>
  <div class="links">
    <a class="on" href="/library">Library</a>
    <a class="hide-sm" href="/store">Store</a>
    <a class="btn" href="/#subscribe">Get Started</a>
  </div>
</div></nav>
${opts.body}
<footer><div class="wrap">
  <div>© ${new Date().getFullYear()} The Digital City</div>
  <div><a href="/library">Library</a><a href="/store">Store</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
  <div class="social">${socialLinks()}</div>
</div></footer>
<script>${SIGNUP_SCRIPT}</script>
<script defer src="https://gumroad.com/js/gumroad.js"></script>
</body>
</html>`;
}

export function renderArticle(a: Article): string {
  const district = DISTRICTS[a.district];
  const product =
    a.productName && a.productUrl
      ? `<section class="card product">
  <span class="tag">Take the next step</span>
  <h3 style="margin:10px 0 8px">${esc(a.productName)}</h3>
  ${a.productPitch ? `<p style="margin:0 0 16px;color:var(--muted)">${esc(a.productPitch)}</p>` : ""}
  <a class="btn gumroad-button" href="${esc(a.productUrl)}">Get ${esc(a.productName)}</a>
</section>`
      : "";

  const body = `<main class="wrap">
<header class="hero">
  <a class="tag" href="/library?district=${a.district}" style="text-decoration:none">The Library · ${esc(district)}</a>
  <h1>${esc(a.title)}</h1>
  <p class="lede">${esc(a.description)}</p>
  <div class="meta">${formatDate(a.date)} · ${a.readingMinutes} min read</div>
</header>
<article>
${a.html}
</article>
${product}
${signupCard(`library:${a.slug}`)}
<p><a href="/library">← Back to The Library</a></p>
</main>`;

  return layout({
    title: `${a.title} | The Digital City Library`,
    description: a.description,
    canonicalPath: `/library/${a.slug}`,
    ogType: "article",
    body,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.date,
      articleSection: district,
      mainEntityOfPage: `${SITE_URL}/library/${a.slug}`,
      image: `${SITE_URL}/logo.jpg`,
      author: { "@type": "Organization", name: "The Digital City", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "The Digital City",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.jpg` },
        sameAs: SOCIALS.map(x => x.url),
      },
    },
  });
}

export function renderIndex(articles: Article[], district?: string): string {
  const active = district && DISTRICTS[district] ? district : undefined;
  const shown = active ? articles.filter(a => a.district === active) : articles;
  const usedDistricts = Object.keys(DISTRICTS).filter(k => articles.some(a => a.district === k));

  const filters =
    usedDistricts.length > 1
      ? `<div class="filters">
  <a href="/library"${active ? "" : ' class="on"'}>All</a>
  ${usedDistricts
    .map(k => `<a href="/library?district=${k}"${k === active ? ' class="on"' : ""}>${esc(DISTRICTS[k])}</a>`)
    .join("\n  ")}
</div>`
      : "";

  const cards = shown.length
    ? `<div class="grid">
${shown
  .map(
    a => `<a class="entry" href="/library/${a.slug}">
  <span class="tag">${esc(DISTRICTS[a.district])}</span>
  <h2>${esc(a.title)}</h2>
  <p>${esc(a.description)}</p>
  <div class="meta" style="margin-top:14px">${formatDate(a.date)} · ${a.readingMinutes} min read</div>
</a>`
  )
  .join("\n")}
</div>`
    : `<p class="empty">New breakdowns are on the way. Subscribe below to get the first one.</p>`;

  const body = `<main class="wrap wide">
<header class="hero" style="max-width:720px">
  <span class="tag">The Digital City · The Library</span>
  <h1>How online businesses actually work</h1>
  <p class="lede">Plain-English breakdowns of how money moves on the internet: lead generation, content and affiliate sites, digital products, services and automation. No hype, just the mechanics.</p>
</header>
${filters}
${cards}
<div style="max-width:720px">${signupCard("library:index")}</div>
</main>`;

  return layout({
    title: active
      ? `${DISTRICTS[active]} | The Digital City Library`
      : "The Library: How Online Businesses Actually Work | The Digital City",
    description:
      "Plain-English breakdowns of how online businesses make money: lead generation, affiliate and content sites, digital products, services and automation.",
    canonicalPath: active ? `/library?district=${active}` : "/library",
    body,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "The Digital City Library",
      url: `${SITE_URL}/library`,
      hasPart: shown.map(a => ({ "@type": "Article", headline: a.title, url: `${SITE_URL}/library/${a.slug}` })),
    },
  });
}

// ─── robots.txt + sitemap.xml ─────────────────────────────────────────────────

const STATIC_PAGES = ["/", "/store", "/library", "/privacy", "/terms"];

export function renderSitemap(articles: Article[]): string {
  const urls = [
    ...STATIC_PAGES.map(p => `  <url><loc>${SITE_URL}${p === "/" ? "/" : p}</loc></url>`),
    ...articles.map(a => `  <url><loc>${SITE_URL}/library/${a.slug}</loc><lastmod>${a.date}</lastmod></url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export function renderRobots(): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function sendHtml(res: Response, html: string, status = 200) {
  res.status(status).type("html").set("Cache-Control", "public, max-age=300").send(html);
}

export function registerLibraryRoutes(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(renderRobots());
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(renderSitemap(visibleArticles()));
  });

  app.get(["/library", "/library/"], (req, res) => {
    const district = typeof req.query.district === "string" ? req.query.district : undefined;
    sendHtml(res, renderIndex(visibleArticles(), district));
  });

  app.get("/library/:slug", (req, res) => {
    const article = visibleArticles().find(a => a.slug === req.params.slug);
    // Unknown or not-yet-published slug: real 404 status, with the index so
    // the visitor still has somewhere to go.
    if (!article) return sendHtml(res, renderIndex(visibleArticles()), 404);
    sendHtml(res, renderArticle(article));
  });
}
