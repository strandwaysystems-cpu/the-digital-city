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

/**
 * Post-processes rendered Markdown so articles read well without the writer
 * needing any special syntax:
 *  - h2s get ids, a section number, and feed the "In this article" list
 *  - tables are wrapped so they scroll sideways on phones
 *  - a paragraph that is only bold text with arrows ("**A → B → C**") becomes
 *    a step-by-step flow
 *  - paragraphs starting "**Tip:**" become tip callouts
 *  - blockquotes starting with ✍️ become author-note boxes
 *  - everything after a horizontal rule followed by "**Sources**" becomes a
 *    quieter sources section
 *  - the first paragraph becomes a larger intro paragraph
 */
export function enhanceHtml(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();
  let n = 0;
  let out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = text.toLowerCase().replace(/&[a-z#0-9]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    while (used.has(id)) id += "-x";
    used.add(id);
    n += 1;
    toc.push({ id, text });
    return `<h2 id="${id}"><span class="num">${String(n).padStart(2, "0")}</span>${inner}</h2>`;
  });
  out = out.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrap"><table>$1</table></div>');
  out = out.replace(/<p><strong>([^<]*?→[^<]*?)<\/strong><\/p>/g, (_m, inner: string) => {
    const steps = inner.split("→").map(x => `<span class="step">${x.trim()}</span>`);
    return `<p class="flow">${steps.join('<span class="arrow" aria-hidden="true">→</span>')}</p>`;
  });
  out = out.replace(/<p><strong>Tip:<\/strong>\s*/g, '<p class="tip"><span class="tip-label">Tip</span>');
  out = out.replace(/<blockquote>\s*<p>✍️\s*/g, '<blockquote class="author-note"><p>');
  out = out.replace(/<hr>\s*<p><strong>Sources<\/strong><\/p>([\s\S]*)$/, '<section class="sources"><h4>Sources</h4>$1</section>');
  out = out.replace(/<p>/, '<p class="intro">');
  return { html: out, toc };
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
:root{--bg:#0a0a1a;--bg2:#0e0e22;--panel:rgba(255,255,255,.035);--line:rgba(255,255,255,.09);--text:rgba(255,255,255,.9);--body:#c9cde0;--muted:rgba(255,255,255,.55);--cyan:#22d3ee;--magenta:#e040fb;--amber:#fbbf24}
*{box-sizing:border-box}
html{background:var(--bg);scroll-behavior:smooth;scroll-padding-top:88px}
body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--cyan);text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{text-decoration-color:var(--magenta)}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
.wide{max-width:1040px}
nav{position:sticky;top:0;z-index:10;border-bottom:1px solid var(--line);background:rgba(10,10,26,.85);backdrop-filter:blur(16px)}
nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;max-width:1040px}
.progress{position:fixed;top:0;left:0;height:2px;width:0;z-index:20;background:linear-gradient(90deg,var(--cyan),var(--magenta));transition:width .1s linear}
.brand{display:flex;align-items:center;gap:10px;color:var(--text);text-decoration:none;font-weight:600;font-size:14px}
.brand img{width:32px;height:32px;border-radius:8px}
.links{display:flex;gap:24px;align-items:center}
.links a{color:var(--muted);text-decoration:none;font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
.links a.on,.links a:hover{color:var(--cyan)}
.btn{display:inline-block;padding:11px 22px;border-radius:999px;border:1px solid rgba(34,211,238,.5);background:rgba(34,211,238,.1);color:var(--cyan);text-decoration:none;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit;transition:background .2s,box-shadow .2s}
.btn:hover{background:rgba(34,211,238,.2);box-shadow:0 0 24px rgba(34,211,238,.25)}
.btn.solid{background:linear-gradient(90deg,var(--cyan),#3b82f6);color:#06121a;border:0}
.btn.solid:hover{box-shadow:0 0 32px rgba(34,211,238,.4)}
.tag{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan)}

/* Hero */
.hero-band{position:relative;overflow:hidden;border-bottom:1px solid var(--line);background:
  radial-gradient(600px 300px at 15% 0%,rgba(34,211,238,.14),transparent 70%),
  radial-gradient(500px 300px at 90% 20%,rgba(224,64,251,.12),transparent 70%),var(--bg2)}
.hero-band:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(#000,transparent 85%);-webkit-mask-image:linear-gradient(#000,transparent 85%)}
header.hero{position:relative;padding:72px 0 48px}
.crumbs{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.pill{display:inline-block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:999px;border:1px solid rgba(34,211,238,.35);background:rgba(34,211,238,.08);color:var(--cyan);text-decoration:none}
.pill.alt{border-color:rgba(224,64,251,.35);background:rgba(224,64,251,.08);color:#f0abfc}
h1{font-size:clamp(32px,5.2vw,52px);line-height:1.1;letter-spacing:-.025em;margin:18px 0 18px;color:#fff;font-weight:700}
.lede{font-size:19px;line-height:1.6;color:rgba(255,255,255,.65);margin:0}
.meta{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--muted);margin-top:24px}
.meta span:before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--cyan);margin-right:8px;vertical-align:middle;opacity:.8}

/* Table of contents */
.toc{margin:40px 0 8px;padding:22px 24px;border:1px solid var(--line);border-radius:16px;background:var(--panel)}
.toc summary{cursor:pointer;list-style:none;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.toc summary::-webkit-details-marker{display:none}
.toc summary:after{content:" +";color:var(--cyan)}
.toc[open] summary:after{content:" −"}
.toc ol{list-style:none;margin:14px 0 0;padding:0;counter-reset:toc}
.toc li{counter-increment:toc;padding:6px 0;border-top:1px solid rgba(255,255,255,.05);font-size:15px}
.toc li:first-child{border-top:0}
.toc li:before{content:counter(toc,decimal-leading-zero);font-family:"JetBrains Mono",monospace;font-size:12px;color:var(--cyan);margin-right:12px}
.toc a{color:var(--text);text-decoration:none}
.toc a:hover{color:var(--cyan)}

/* Article body */
article{padding:16px 0 24px;color:var(--body)}
article p,article li{font-size:18px;line-height:1.78}
article p{margin:0 0 22px}
article p.intro{font-size:21px;line-height:1.65;color:rgba(255,255,255,.88)}
article strong{color:#fff;font-weight:600}
article h2{position:relative;font-size:clamp(25px,3.4vw,31px);line-height:1.25;margin:72px 0 20px;padding-top:30px;color:#fff;letter-spacing:-.02em;border-top:1px solid var(--line)}
article h2 .num{display:block;font-family:"JetBrains Mono",monospace;font-size:12px;font-weight:500;letter-spacing:.14em;margin-bottom:10px;background:linear-gradient(90deg,var(--cyan),var(--magenta));-webkit-background-clip:text;background-clip:text;color:transparent}
article h3{font-size:21px;line-height:1.35;margin:44px 0 12px;color:#fff;padding-left:16px;border-left:3px solid var(--cyan)}
article ul,article ol{padding-left:0;margin:0 0 24px;list-style:none}
article ul li{position:relative;padding-left:28px;margin:10px 0}
article ul li:before{content:"";position:absolute;left:6px;top:.72em;width:7px;height:7px;border-radius:2px;background:var(--cyan);transform:rotate(45deg)}
article ol{counter-reset:item}
article ol li{position:relative;padding-left:44px;margin:16px 0;counter-increment:item}
article ol li:before{content:counter(item);position:absolute;left:0;top:.15em;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:600;color:var(--cyan);border:1px solid rgba(34,211,238,.4);background:rgba(34,211,238,.08)}
article code{font-family:"JetBrains Mono",monospace;font-size:.88em;background:rgba(255,255,255,.06);padding:2px 6px;border-radius:5px}
article blockquote{margin:28px 0;padding:18px 22px;border-radius:14px;border:1px solid rgba(224,64,251,.25);background:rgba(224,64,251,.06);color:var(--body)}
article blockquote p:last-child{margin-bottom:0}
article blockquote.author-note{border:1px dashed rgba(251,191,36,.55);background:rgba(251,191,36,.06)}
article blockquote.author-note:before{content:"✍️ Author note";display:block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--amber);margin-bottom:8px}
p.tip{position:relative;padding:16px 20px 16px 20px;border-radius:14px;background:rgba(34,211,238,.06);border:1px solid rgba(34,211,238,.22);font-size:16.5px}
.tip-label{display:inline-block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#06121a;background:var(--cyan);border-radius:6px;padding:2px 8px;margin-right:10px;vertical-align:2px;font-weight:600}
p.flow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0 22px}
p.flow .step{font-size:14px;font-weight:600;color:#fff;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02))}
p.flow .arrow{color:var(--cyan);font-size:16px}
.table-wrap{margin:28px 0 32px;overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:var(--panel);-webkit-overflow-scrolling:touch}
article table{border-collapse:collapse;width:100%;min-width:560px;font-size:15px;line-height:1.55}
article th{text-align:left;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan);background:rgba(34,211,238,.06);padding:14px 16px;border-bottom:1px solid var(--line)}
article td{padding:14px 16px;vertical-align:top;border-bottom:1px solid rgba(255,255,255,.05)}
article tr:last-child td{border-bottom:0}
article tbody tr:nth-child(even) td{background:rgba(255,255,255,.015)}
article td:first-child{color:#fff;font-weight:600}
article hr{border:0;height:1px;background:var(--line);margin:56px 0}
.sources{margin-top:64px;padding-top:24px;border-top:1px solid var(--line)}
.sources h4{margin:0 0 12px;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.sources li,.sources p{font-size:14px;line-height:1.6;color:var(--muted)}
.sources ul li:before{background:var(--muted)}

/* Cards */
.card{border:1px solid var(--line);background:var(--panel);border-radius:20px;padding:30px;margin:32px 0}
.card h2,.card h3{margin-top:0}
.card.product{position:relative;border:1px solid transparent;background:linear-gradient(var(--bg2),var(--bg2)) padding-box,linear-gradient(135deg,rgba(224,64,251,.7),rgba(34,211,238,.7)) border-box;box-shadow:0 20px 60px -30px rgba(224,64,251,.45)}
.card.product h3{font-size:24px;color:#fff}
form.signup{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
form.signup input{flex:1 1 220px;min-width:0;padding:13px 18px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:#fff;font:inherit;font-size:15px}
form.signup input:focus{outline:none;border-color:rgba(34,211,238,.6);box-shadow:0 0 0 3px rgba(34,211,238,.15)}
.signup-msg{font-size:14px;margin-top:10px;color:var(--muted);min-height:1em}
.back{display:inline-block;margin:8px 0 24px;font-size:15px;text-decoration:none}

/* Index */
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 32px}
.filters a{font-size:13px;padding:6px 14px;border-radius:999px;border:1px solid var(--line);color:var(--muted);text-decoration:none}
.filters a.on{border-color:var(--cyan);color:var(--cyan)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;padding:8px 0 48px}
.entry{display:block;border:1px solid var(--line);background:var(--panel);border-radius:18px;padding:26px;text-decoration:none;color:var(--text);transition:border-color .2s,transform .2s,box-shadow .2s}
.entry:hover{border-color:rgba(34,211,238,.4);transform:translateY(-2px);box-shadow:0 18px 40px -24px rgba(34,211,238,.4)}
.entry h2{font-size:21px;line-height:1.35;margin:12px 0 8px;color:#fff}
.entry p{margin:0;color:var(--muted);font-size:15px}
.empty{color:var(--muted);padding:24px 0 64px}

footer{border-top:1px solid var(--line);padding:32px 0;margin-top:48px;font-size:13px;color:var(--muted)}
footer .wrap{display:flex;gap:20px;flex-wrap:wrap;justify-content:space-between;max-width:1040px}
footer a{color:var(--muted);text-decoration:none;margin-right:16px}
footer .social{flex-basis:100%}
footer .social a{margin-right:0}
.follow{font-size:14px;color:var(--muted);margin:14px 0 0}
.brand,.links a{white-space:nowrap}
@media (max-width:600px){.links{gap:14px}.links .hide-sm{display:none}.links .btn{padding:8px 14px;font-size:11px}.brand span{display:none}header.hero{padding:44px 0 32px}article p,article li{font-size:17px}article p.intro{font-size:19px}article h2{margin-top:56px}.card{padding:24px}}
`;

const SIGNUP_SCRIPT = `
(function(){var bar=document.querySelector('.progress'),art=document.querySelector('article');
if(bar&&art){var f=function(){var r=art.getBoundingClientRect(),t=r.height-window.innerHeight;
bar.style.width=Math.max(0,Math.min(1,t>0?-r.top/t:1))*100+'%';};window.addEventListener('scroll',f,{passive:true});f();}})();
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
  <h3 style="margin:12px 0 8px">${esc(a.productName)}</h3>
  ${a.productPitch ? `<p style="margin:0 0 16px;color:var(--muted)">${esc(a.productPitch)}</p>` : ""}
  <a class="btn solid gumroad-button" href="${esc(a.productUrl)}">Get ${esc(a.productName)} →</a>
</section>`
      : "";

  const { html, toc } = enhanceHtml(a.html);
  const tocHtml =
    toc.length >= 3
      ? `<details class="toc" open>
  <summary>In this article</summary>
  <ol>${toc.map(t => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ol>
</details>`
      : "";

  const body = `<div class="progress" aria-hidden="true"></div>
<div class="hero-band"><div class="wrap">
<header class="hero">
  <div class="crumbs">
    <a class="pill" href="/library">The Library</a>
    <a class="pill alt" href="/library?district=${a.district}">${esc(district)}</a>
  </div>
  <h1>${esc(a.title)}</h1>
  <p class="lede">${esc(a.description)}</p>
  <div class="meta"><span>${formatDate(a.date)}</span><span>${a.readingMinutes} min read</span><span>The Digital City</span></div>
</header>
</div></div>
<main class="wrap">
${tocHtml}
<article>
${html}
</article>
${product}
${signupCard(`library:${a.slug}`)}
<a class="back" href="/library">← Back to The Library</a>
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

  const body = `<div class="hero-band"><div class="wrap wide">
<header class="hero" style="max-width:720px">
  <div class="crumbs"><span class="pill">The Digital City · The Library</span></div>
  <h1>How online businesses actually work</h1>
  <p class="lede">Plain-English guides to making money online: affiliate marketing, semi-passive business ideas, and the tools and platforms worth using. No hype, just the mechanics.</p>
</header>
</div></div>
<main class="wrap wide">
<div style="height:28px"></div>
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
