/**
 * Agent-readiness: everything that helps AI agents and crawlers understand
 * and use buildyourdigitalcity.com without running JavaScript.
 *
 *  - Server-side head tags, JSON-LD and readable fallback content for the
 *    React (SPA) pages, and a real 404 status for unknown URLs
 *  - /about and /contact pages
 *  - /llms.txt, Markdown versions of key pages (/index.md, /store.md, ...),
 *    and Accept: text/markdown content negotiation
 *  - RFC 8288 Link headers pointing at those alternates
 *  - A small read-only MCP server at /mcp, described by an MCP Server Card at
 *    /.well-known/mcp/server-card.json (and /.well-known/mcp.json)
 */

import type { Express, Request, Response } from "express";
import { BRAND, ORG_ID, SITE_URL, jsonLdScript, siteGraph, webPageNode } from "./brand";
import { fetchGumroadProducts, type GumroadProduct } from "./gumroad";
import {
  DISTRICTS,
  articleMarkdown,
  esc,
  layout,
  libraryIndexMarkdown,
  sendMarkdown,
  visibleArticles,
} from "./library";

// ─── Site facts used by several outputs ────────────────────────────────────────

export const SITE_DISTRICTS = [
  { name: "The Intelligent & Autonomous District", tagline: "AI and automation that work without you." },
  { name: "The Attention & Media District", tagline: "Audiences, content, and owned distribution." },
  { name: "The E-Commerce & Retail District", tagline: "Selling products at internet scale." },
  { name: "The Financial & Fintech District", tagline: "The money layer underneath everything." },
  { name: "The Software & Enterprise District", tagline: "Tools businesses pay to keep." },
];

const HOME_H1 = "The internet is a city. Most people are renters.";
const HOME_LEDE =
  "They scroll, click, and consume, generating wealth for platforms, not themselves. The Digital City is the map that shows you how to become an owner.";

async function products(): Promise<GumroadProduct[]> {
  try {
    return await fetchGumroadProducts();
  } catch {
    return [];
  }
}

function productLine(p: GumroadProduct): string {
  return `- [${p.name}](${p.shortUrl}): ${p.formattedPrice}${p.summary ? `. ${p.summary}` : ""}`;
}

export function productNode(p: GumroadProduct) {
  return {
    "@type": "Product",
    name: p.name,
    url: p.shortUrl,
    ...(p.summary ? { description: p.summary } : {}),
    ...(p.thumbnailUrl ? { image: p.thumbnailUrl } : {}),
    brand: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      url: p.shortUrl,
      price: (p.priceCents / 100).toFixed(2),
      priceCurrency: p.currency,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };
}

// ─── Markdown documents ───────────────────────────────────────────────────────

export function llmsTxt(prods: GumroadProduct[]): string {
  const articles = visibleArticles();
  const lines = [
    `# ${BRAND.name}`,
    "",
    `> ${BRAND.description}`,
    "",
    `${BRAND.name} is operated by ${BRAND.legalOperator}. Its organising idea: the internet is a city, most people are renters, and the goal is to become an owner of digital assets. Contact: ${BRAND.email}.`,
    "",
    "## Key pages",
    "",
    `- [Home](${SITE_URL}/index.md): What The Digital City is, the five districts framework, and where to start`,
    `- [The Library](${SITE_URL}/library.md): Plain-English guides to making money online`,
    `- [Store](${SITE_URL}/store.md): Digital products (worksheets, toolkits, the e-book), sold through Gumroad`,
    `- [About](${SITE_URL}/about.md): Who runs The Digital City and what it stands for`,
    `- [Contact](${SITE_URL}/contact.md): Email addresses and social profiles`,
    "",
    "## Library",
    "",
    ...(articles.length
      ? articles.map(a => `- [${a.title}](${SITE_URL}/library/${a.slug}.md): ${a.description}`)
      : ["- No articles published yet."]),
    "",
    "## Products",
    "",
    ...(prods.length ? prods.map(productLine) : [`- [Gumroad store](${BRAND.store}): All digital products`]),
    "",
    "## For agents",
    "",
    `- [MCP server card](${SITE_URL}/.well-known/mcp/server-card.json): A read-only MCP server at ${SITE_URL}/mcp to search the Library, read articles and list products`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Every public page`,
    `- Markdown: send \`Accept: text/markdown\` to the home, store, library, about or contact page, or add \`.md\` to their URLs`,
    "",
    "## Optional",
    "",
    `- [Privacy Policy](${SITE_URL}/privacy)`,
    `- [Terms of Service](${SITE_URL}/terms)`,
    ...BRAND.socials.map(s => `- [${s.name} ${s.handle}](${s.url})`),
  ];
  return lines.join("\n") + "\n";
}

export function homeMarkdown(prods: GumroadProduct[]): string {
  const articles = visibleArticles().slice(0, 5);
  return [
    `# ${HOME_H1}`,
    "",
    `> ${HOME_LEDE}`,
    "",
    BRAND.description,
    "",
    "## The five districts",
    "",
    "Every digital business belongs to one of five districts, each a distinct economic layer of the internet:",
    "",
    ...SITE_DISTRICTS.map(d => `- **${d.name}**: ${d.tagline}`),
    "",
    "## Latest from the Library",
    "",
    ...(articles.length ? articles.map(a => `- [${a.title}](${SITE_URL}/library/${a.slug}.md): ${a.description}`) : ["- Coming soon."]),
    "",
    "## Products",
    "",
    ...(prods.length ? prods.map(productLine) : [`- [Gumroad store](${BRAND.store})`]),
    "",
    "## Newsletter",
    "",
    `A free weekly email with one clear breakdown of how an online business works. Sign up at ${SITE_URL}/#subscribe.`,
    "",
    "## Contact",
    "",
    `- Email: ${BRAND.email}`,
    ...BRAND.socials.map(s => `- ${s.name}: [${s.handle}](${s.url})`),
    `- [About](${SITE_URL}/about) · [Privacy](${SITE_URL}/privacy) · [Terms](${SITE_URL}/terms)`,
  ].join("\n") + "\n";
}

export function storeMarkdown(prods: GumroadProduct[]): string {
  return [
    "# Digital Products & Guides",
    "",
    "> Frameworks, worksheets and toolkits from The Digital City for moving from consumer to builder-owner. Checkout is handled by Gumroad.",
    "",
    ...(prods.length ? prods.map(productLine) : [`- [Browse the Gumroad store](${BRAND.store})`]),
    "",
    `Questions or refunds: ${BRAND.email}. See the [Terms of Service](${SITE_URL}/terms).`,
  ].join("\n") + "\n";
}

const ABOUT_PARAGRAPHS = [
  `${BRAND.name} explains how the internet economy actually works, for people who want to take part in it as owners and builders, not just users.`,
  "Most people experience the internet as renters: they create value on platforms they don't control. The Digital City maps the alternative. It breaks online business into five districts (Intelligent & Autonomous, Attention & Media, E-Commerce & Retail, Financial & Fintech, and Software & Enterprise) and shows how money moves in each.",
  "Everything here is practical and built in public: the frameworks come from actually building a portfolio of online businesses, not from theory. No hype, no get-rich-quick promises.",
  `${BRAND.name} is operated by ${BRAND.legalOperator}.`,
];

const ABOUT_OFFER = [
  ["The Library", "/library", "Free, plain-English guides to making money online."],
  ["The newsletter", "/#subscribe", "One clear breakdown every week."],
  ["The Store", "/store", "Worksheets, toolkits and the Digital City e-book."],
];

export function aboutMarkdown(): string {
  return [
    `# About ${BRAND.name}`,
    "",
    `> ${BRAND.tagline}`,
    "",
    ...ABOUT_PARAGRAPHS.flatMap(p => [p, ""]),
    "## What we publish",
    "",
    ...ABOUT_OFFER.map(([n, href, d]) => `- [${n}](${SITE_URL}${href}): ${d}`),
    "",
    `Contact: ${BRAND.email} · [Contact page](${SITE_URL}/contact)`,
  ].join("\n") + "\n";
}

export function contactMarkdown(): string {
  return [
    `# Contact ${BRAND.name}`,
    "",
    "> The fastest way to reach us is email.",
    "",
    `Email [${BRAND.email}](mailto:${BRAND.email}) for anything: questions, orders and refunds, privacy and data requests, or partnerships.`,
    "",
    "## Social",
    "",
    ...BRAND.socials.map(s => `- ${s.name}: [${s.handle}](${s.url})`),
    "",
    `Purchases are processed by Gumroad. For order issues, include the email you bought with. Operated by ${BRAND.legalOperator}.`,
  ].join("\n") + "\n";
}

// ─── About and Contact pages (HTML) ───────────────────────────────────────────

function heroBlock(pill: string, title: string, lede: string) {
  return `<div class="hero-band"><div class="wrap">
<header class="hero">
  <div class="crumbs"><span class="pill">${esc(pill)}</span></div>
  <h1>${esc(title)}</h1>
  <p class="lede">${esc(lede)}</p>
</header>
</div></div>`;
}

export function renderAbout(): string {
  const body = `${heroBlock(BRAND.name, `About ${BRAND.name}`, BRAND.tagline)}
<main class="wrap">
<article>
${ABOUT_PARAGRAPHS.map((p, i) => `<p${i === 0 ? ' class="intro"' : ""}>${esc(p)}</p>`).join("\n")}
<h2 id="what-we-publish">What we publish</h2>
<ul>
${ABOUT_OFFER.map(([n, href, d]) => `<li><a href="${href}"><strong>${esc(n)}</strong></a>: ${esc(d)}</li>`).join("\n")}
</ul>
<h2 id="get-in-touch">Get in touch</h2>
<p>Email <a href="mailto:${BRAND.email}">${BRAND.email}</a> or see the <a href="/contact">contact page</a>.</p>
</article>
</main>`;
  return layout({
    title: `About | ${BRAND.name}`,
    description: `What ${BRAND.name} is, who runs it, and what it publishes.`,
    canonicalPath: "/about",
    markdownPath: "/about.md",
    nav: "none",
    graph: [{ ...webPageNode("/about", `About ${BRAND.name}`, BRAND.description, "AboutPage"), "@id": `${SITE_URL}/about#about` }],
    body,
  });
}

export function renderContact(): string {
  const body = `${heroBlock(BRAND.name, `Contact ${BRAND.name}`, "The fastest way to reach us is email.")}
<main class="wrap">
<article>
<p class="intro">Email <a href="mailto:${BRAND.email}"><strong>${BRAND.email}</strong></a> for anything: questions, orders and refunds, privacy and data requests, or partnerships.</p>
<h2 id="social">Social</h2>
<ul>
${BRAND.socials.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ${esc(s.handle)}</a></li>`).join("\n")}
</ul>
<p>Purchases are processed by Gumroad. For order issues, include the email address you bought with. ${esc(BRAND.name)} is operated by ${esc(BRAND.legalOperator)}.</p>
</article>
</main>`;
  return layout({
    title: `Contact | ${BRAND.name}`,
    description: `How to contact ${BRAND.name}: email addresses for support, products, refunds and privacy, plus social profiles.`,
    canonicalPath: "/contact",
    markdownPath: "/contact.md",
    nav: "none",
    graph: [{ ...webPageNode("/contact", `Contact ${BRAND.name}`, "Contact details", "ContactPage"), "@id": `${SITE_URL}/contact#contact` }],
    body,
  });
}

// ─── React (SPA) pages: head tags, JSON-LD, fallback content, 404 ──────────────

interface SpaPage {
  title: string;
  description: string;
  h1: string;
  pageType?: string;
  noindex?: boolean;
  markdownPath?: string;
  /** Readable content for agents and no-JS visitors; React replaces it on load. */
  content: (prods: GumroadProduct[]) => string;
  extraGraph?: (prods: GumroadProduct[]) => object[];
}

const linkList = (items: [string, string][]) =>
  `<ul>${items.map(([label, href]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ul>`;

const SITE_LINKS: [string, string][] = [
  ["The Library", "/library"],
  ["Store", "/store"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy Policy", "/privacy"],
  ["Terms of Service", "/terms"],
];

const productList = (prods: GumroadProduct[]) =>
  prods.length
    ? `<ul>${prods
        .map(p => `<li><a href="${esc(p.shortUrl)}">${esc(p.name)}</a> (${esc(p.formattedPrice)})${p.summary ? `: ${esc(p.summary)}` : ""}</li>`)
        .join("")}</ul>`
    : `<p><a href="${BRAND.store}">Browse all products on Gumroad</a></p>`;

export const SPA_PAGES: Record<string, SpaPage> = {
  "/": {
    title: "The Digital City | How the Internet Economy Really Works",
    description:
      "The internet is a city. Most people are renters. Learn how to become an owner with The Digital City's guides, frameworks and digital products.",
    h1: HOME_H1,
    markdownPath: "/index.md",
    content: prods => `<p>${esc(HOME_LEDE)}</p>
<h2>The five districts</h2>
<ul>${SITE_DISTRICTS.map(d => `<li><strong>${esc(d.name)}</strong>: ${esc(d.tagline)}</li>`).join("")}</ul>
<h2>Latest from the Library</h2>
${linkList(visibleArticles().slice(0, 5).map(a => [a.title, `/library/${a.slug}`] as [string, string]))}
<h2>Products</h2>
${productList(prods)}`,
    extraGraph: prods => [
      {
        "@type": "ItemList",
        name: "The Digital City products",
        itemListElement: prods.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: productNode(p) })),
      },
    ],
  },
  "/store": {
    title: "Store: Digital Products & Guides | The Digital City",
    description:
      "Worksheets, toolkits and the Digital City e-book: frameworks for moving from consumer to builder-owner. Checkout via Gumroad.",
    h1: "Digital Products & Guides",
    pageType: "CollectionPage",
    markdownPath: "/store.md",
    content: prods => `<p>Everything you need to transition from consumer to builder-owner. Frameworks, blueprints, and tools, built from real experience.</p>${productList(prods)}`,
    extraGraph: prods => [
      {
        "@type": "ItemList",
        name: "Digital Products & Guides",
        itemListElement: prods.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: productNode(p) })),
      },
    ],
  },
  "/privacy": {
    title: "Privacy Policy | The Digital City",
    description: "How The Digital City collects, uses and protects your personal data.",
    h1: "Privacy Policy",
    content: () =>
      `<p>How The Digital City, operated by ${esc(BRAND.legalOperator)}, collects, uses and protects your personal data. Questions: <a href="mailto:${BRAND.email}">${BRAND.email}</a>.</p>`,
  },
  "/terms": {
    title: "Terms of Service | The Digital City",
    description: "The terms for using buildyourdigitalcity.com and buying The Digital City's digital products.",
    h1: "Terms of Service",
    content: () =>
      `<p>The terms for using this site and buying our digital products, including refunds. Questions: <a href="mailto:${BRAND.email}">${BRAND.email}</a>.</p>`,
  },
  "/checkout/success": {
    title: "Thank you | The Digital City",
    description: "Your purchase is complete.",
    h1: "Thank you for your purchase",
    noindex: true,
    content: () => `<p>Your purchase is complete. Check your email for your download.</p>`,
  },
};

const NOT_FOUND: SpaPage = {
  title: "Page not found | The Digital City",
  description: "This page doesn't exist.",
  h1: "Page not found",
  noindex: true,
  content: () => `<p>This page doesn't exist. Try one of these instead:</p>`,
};

export async function renderSpaShell(template: string, reqPath: string): Promise<{ status: number; html: string }> {
  const path = reqPath.length > 1 ? reqPath.replace(/\/+$/, "") : reqPath;
  const page = SPA_PAGES[path];
  const status = page ? 200 : 404;
  const p = page || NOT_FOUND;
  const prods = page && (path === "/" || path === "/store") ? await products() : [];
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;

  const head = [
    page && !p.noindex ? `<link rel="canonical" href="${esc(url)}">` : "",
    p.noindex ? `<meta name="robots" content="noindex">` : "",
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(BRAND.name)}">`,
    `<meta property="og:title" content="${esc(p.title)}">`,
    `<meta property="og:description" content="${esc(p.description)}">`,
    page ? `<meta property="og:url" content="${esc(url)}">` : "",
    `<meta property="og:image" content="${BRAND.logo}">`,
    `<meta name="twitter:card" content="summary">`,
    p.markdownPath ? `<link rel="alternate" type="text/markdown" href="${p.markdownPath}">` : "",
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">`,
    jsonLdScript(
      siteGraph(page ? [webPageNode(path === "/" ? "/" : path, p.title, p.description, p.pageType), ...(p.extraGraph?.(prods) || [])] : [])
    ),
  ]
    .filter(Boolean)
    .join("\n    ");

  const fallback = `<div style="max-width:760px;margin:0 auto;padding:64px 20px;color:#e5e7f0;font-family:Inter,system-ui,sans-serif;line-height:1.6">
<p><a href="/" style="color:#22d3ee">${esc(BRAND.name)}</a></p>
<h1>${esc(p.h1)}</h1>
${p.content(prods)}
<nav aria-label="Site">${linkList(SITE_LINKS)}</nav>
<p>Contact: <a href="mailto:${BRAND.email}">${BRAND.email}</a> · ${BRAND.socials.map(s => `<a href="${s.url}">${esc(s.name)}</a>`).join(" · ")}</p>
</div>`;

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${esc(p.description)}" />`)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace(/<div id="root"><\/div>/, `<div id="root">${fallback}</div>`);
  return { status, html };
}

// ─── MCP server (read-only, stateless Streamable HTTP, JSON responses) ─────────

const MCP_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const MCP_SERVER_INFO = { name: "buildyourdigitalcity", title: BRAND.name, version: "1.0.0" };

export const MCP_TOOLS = [
  {
    name: "search_library",
    title: "Search The Digital City Library",
    description:
      "Search The Digital City's Library of plain-English guides on making money online (affiliate marketing, semi-passive business ideas, tools and platforms). Returns matching articles with title, summary, date and URLs. Leave query empty to list everything.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Words to look for in titles and summaries, e.g. 'affiliate'" },
        limit: { type: "integer", minimum: 1, maximum: 50, description: "Maximum results (default 10)" },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "get_article",
    title: "Read a Library article",
    description: "Get the full text of one Library article as Markdown, by its slug (from search_library).",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Article slug, e.g. 'affiliate-marketing-2027'" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "list_products",
    title: "List The Digital City products",
    description:
      "List The Digital City's digital products (worksheets, toolkits, e-book) with prices, summaries and Gumroad purchase links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "get_site_info",
    title: "About The Digital City",
    description: "What The Digital City is, who operates it, and how to contact it.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];

type ToolResult = { content: { type: "text"; text: string }[]; structuredContent?: unknown; isError?: boolean };

async function callTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  const text = (t: string, structuredContent?: unknown): ToolResult => ({
    content: [{ type: "text", text: t }],
    ...(structuredContent !== undefined ? { structuredContent } : {}),
  });
  switch (name) {
    case "search_library": {
      const q = typeof args.query === "string" ? args.query.toLowerCase().trim() : "";
      const limit = Math.min(50, Math.max(1, Number(args.limit) || 10));
      const words = q.split(/\s+/).filter(Boolean);
      const hits = visibleArticles()
        .filter(a => !words.length || words.every(w => `${a.title} ${a.description} ${DISTRICTS[a.district]}`.toLowerCase().includes(w)))
        .slice(0, limit)
        .map(a => ({
          slug: a.slug,
          title: a.title,
          description: a.description,
          district: DISTRICTS[a.district],
          date: a.date,
          url: `${SITE_URL}/library/${a.slug}`,
          markdownUrl: `${SITE_URL}/library/${a.slug}.md`,
        }));
      return text(hits.length ? JSON.stringify(hits, null, 2) : "No matching articles.", { articles: hits });
    }
    case "get_article": {
      const a = visibleArticles().find(x => x.slug === args.slug);
      if (!a) return { ...text(`No published article with slug "${String(args.slug)}". Use search_library to find slugs.`), isError: true };
      return text(articleMarkdown(a));
    }
    case "list_products": {
      const prods = await products();
      const list = prods.map(p => ({ name: p.name, price: p.formattedPrice, currency: p.currency, summary: p.summary, url: p.shortUrl }));
      return text(list.length ? JSON.stringify(list, null, 2) : `Products are listed at ${BRAND.store}`, { products: list });
    }
    case "get_site_info":
      return text(aboutMarkdown() + "\n" + contactMarkdown());
    default:
      return { ...text(`Unknown tool: ${name}`), isError: true };
  }
}

type JsonRpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

export async function handleMcpMessage(msg: JsonRpc): Promise<object | null> {
  const ok = (result: object) => ({ jsonrpc: "2.0", id: msg.id, result });
  const fail = (code: number, message: string) => ({ jsonrpc: "2.0", id: msg.id ?? null, error: { code, message } });
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return fail(-32600, "Invalid Request");
  if (msg.id === undefined || msg.id === null) return null; // notification: no response body

  switch (msg.method) {
    case "initialize": {
      const requested = String(msg.params?.protocolVersion || "");
      return ok({
        protocolVersion: MCP_PROTOCOL_VERSIONS.includes(requested) ? requested : MCP_PROTOCOL_VERSIONS[1],
        capabilities: { tools: { listChanged: false } },
        serverInfo: MCP_SERVER_INFO,
        instructions: `Read-only access to ${BRAND.name}: search and read Library articles, list digital products, and get site and contact information.`,
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: MCP_TOOLS });
    case "tools/call": {
      const name = String(msg.params?.name || "");
      if (!MCP_TOOLS.some(t => t.name === name)) return fail(-32602, `Unknown tool: ${name}`);
      const args = (msg.params?.arguments as Record<string, unknown>) || {};
      return ok(await callTool(name, args));
    }
    default:
      return fail(-32601, `Method not found: ${msg.method}`);
  }
}

export function serverCard() {
  return {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: MCP_PROTOCOL_VERSIONS[1],
    serverInfo: MCP_SERVER_INFO,
    description: `Read-only MCP server for ${BRAND.name}: search and read Library articles on making money online, list digital products, and get contact information.`,
    websiteUrl: `${SITE_URL}/`,
    documentationUrl: `${SITE_URL}/llms.txt`,
    transport: { type: "streamable-http", endpoint: `${SITE_URL}/mcp` },
    remotes: [{ type: "streamable-http", url: `${SITE_URL}/mcp` }],
    capabilities: { tools: { listChanged: false } },
    authentication: { required: false, schemes: [] },
    tools: MCP_TOOLS.map(({ name, title, description, inputSchema }) => ({ name, title, description, inputSchema })),
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/** HTML page path → its Markdown alternate, or null. */
export function markdownAlternate(path: string): string | null {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const fixed: Record<string, string> = {
    "/": "/index.md",
    "/store": "/store.md",
    "/library": "/library.md",
    "/about": "/about.md",
    "/contact": "/contact.md",
  };
  if (fixed[p]) return fixed[p];
  const m = p.match(/^\/library\/([a-z0-9-]+)$/);
  return m ? `/library/${m[1]}.md` : null;
}

function cors(res: Response) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version");
}

export function registerAgentRoutes(app: Express) {
  // Link headers + Accept: text/markdown negotiation for pages with a Markdown version.
  app.use((req: Request, res: Response, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const md = markdownAlternate(req.path);
    if (!md) return next();
    res.append("Link", `<${md}>; rel="alternate"; type="text/markdown"`);
    res.append("Link", `</llms.txt>; rel="describedby"; type="text/plain"`);
    res.append("Link", `</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"`);
    res.vary("Accept");
    if (req.accepts(["text/html", "text/markdown"]) === "text/markdown") {
      // Don't let a shared cache hand this Markdown to a browser asking for HTML.
      res.set("Cache-Control", "private, no-store");
      req.url = md;
    }
    next();
  });

  app.get("/llms.txt", async (_req, res) => {
    cors(res);
    res.type("text/plain; charset=utf-8").send(llmsTxt(await products()));
  });

  app.get("/index.md", async (_req, res) => sendMarkdown(res, homeMarkdown(await products())));
  app.get("/store.md", async (_req, res) => sendMarkdown(res, storeMarkdown(await products())));
  app.get("/about.md", (_req, res) => sendMarkdown(res, aboutMarkdown()));
  app.get("/contact.md", (_req, res) => sendMarkdown(res, contactMarkdown()));

  app.get("/library.json", (_req, res) => {
    cors(res);
    res.json(
      visibleArticles().map(a => ({
        slug: a.slug,
        title: a.title,
        description: a.description,
        district: DISTRICTS[a.district],
        date: a.date,
        url: `${SITE_URL}/library/${a.slug}`,
        markdownUrl: `${SITE_URL}/library/${a.slug}.md`,
      }))
    );
  });

  const sendHtml = (res: Response, html: string) =>
    res.status(200).type("html").set("Cache-Control", "public, max-age=300").send(html);
  app.get(["/about", "/about/"], (_req, res) => sendHtml(res, renderAbout()));
  app.get(["/contact", "/contact/"], (_req, res) => sendHtml(res, renderContact()));

  app.get(["/.well-known/mcp/server-card.json", "/.well-known/mcp.json"], (_req, res) => {
    cors(res);
    res.type("application/json").send(JSON.stringify(serverCard(), null, 2));
  });

  app.options("/mcp", (_req, res) => {
    cors(res);
    res.status(204).end();
  });
  app.get("/mcp", (_req, res) => {
    cors(res);
    res.set("Allow", "POST, OPTIONS").status(405).type("text/plain").send("This MCP server accepts JSON-RPC over POST only.\n");
  });
  app.delete("/mcp", (_req, res) => {
    cors(res);
    res.status(405).end();
  });
  app.post("/mcp", async (req, res) => {
    cors(res);
    if (Array.isArray(req.body)) {
      return res.status(400).json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Batch requests are not supported" } });
    }
    try {
      const reply = await handleMcpMessage(req.body);
      if (reply === null) return res.status(202).end();
      res.status("error" in reply && (reply as { id?: unknown }).id === null ? 400 : 200).json(reply);
    } catch (error) {
      console.error("[MCP] error:", error);
      res.status(500).json({ jsonrpc: "2.0", id: req.body?.id ?? null, error: { code: -32603, message: "Internal error" } });
    }
  });
}
