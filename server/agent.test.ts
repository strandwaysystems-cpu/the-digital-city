import { describe, expect, it } from "vitest";
import {
  handleMcpMessage,
  llmsTxt,
  markdownAlternate,
  renderAbout,
  renderContact,
  renderSpaShell,
  serverCard,
} from "./agent";
import { renderRobots } from "./library";

const TEMPLATE = `<!doctype html><html><head><title>Old</title>
<meta name="description" content="old" /></head><body><div id="root"></div></body></html>`;

function jsonLdTypes(html: string): string[] {
  const types: string[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(m[1]);
    for (const node of data["@graph"] || [data]) types.push(node["@type"]);
  }
  return types;
}

describe("renderSpaShell", () => {
  it("gives the homepage a title, description, canonical, one h1 and Organization JSON-LD", async () => {
    const { status, html } = await renderSpaShell(TEMPLATE, "/");
    expect(status).toBe(200);
    expect(html).toContain('<link rel="canonical" href="https://buildyourdigitalcity.com/">');
    expect(html).not.toContain("<title>Old</title>");
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html).toContain("mailto:support@buildyourdigitalcity.com");
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="/terms"');
    const types = jsonLdTypes(html);
    expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "WebPage"]));
    const org = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1])["@graph"][0];
    expect(org.sameAs).toContain("https://www.tiktok.com/@thedigitalcity");
    expect(org.email).toBe("support@buildyourdigitalcity.com");
  });

  it("returns 404 with noindex for unknown paths", async () => {
    const { status, html } = await renderSpaShell(TEMPLATE, "/no-such-page");
    expect(status).toBe(404);
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).not.toContain('rel="canonical"');
  });

  it("treats a trailing slash as the same page", async () => {
    expect((await renderSpaShell(TEMPLATE, "/store/")).status).toBe(200);
  });
});

describe("about and contact pages", () => {
  it("render with h1, canonical and contact details", () => {
    for (const html of [renderAbout(), renderContact()]) {
      expect(html.match(/<h1>/g)).toHaveLength(1);
      expect(html).toMatch(/<link rel="canonical" href="https:\/\/buildyourdigitalcity\.com\/(about|contact)">/);
      expect(html).toContain("mailto:support@buildyourdigitalcity.com");
    }
    expect(jsonLdTypes(renderContact())).toContain("ContactPage");
  });
});

describe("robots and llms.txt", () => {
  it("declares Content-Signal and the sitemap", () => {
    const robots = renderRobots();
    expect(robots).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=no");
    expect(robots).toContain("Sitemap: https://buildyourdigitalcity.com/sitemap.xml");
  });

  it("follows the llms.txt format", () => {
    const txt = llmsTxt([]);
    expect(txt.startsWith("# The Digital City\n\n> ")).toBe(true);
    expect(txt).toMatch(/^## Key pages$/m);
    expect(txt).toContain("](https://buildyourdigitalcity.com/library.md)");
  });

  it("maps pages to their Markdown alternates", () => {
    expect(markdownAlternate("/")).toBe("/index.md");
    expect(markdownAlternate("/library/some-slug")).toBe("/library/some-slug.md");
    expect(markdownAlternate("/privacy")).toBeNull();
  });
});

describe("MCP server", () => {
  it("initializes, lists tools and runs a search", async () => {
    const init = (await handleMcpMessage({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } })) as any;
    expect(init.result.protocolVersion).toBe("2025-06-18");
    expect(init.result.capabilities.tools).toBeDefined();

    const list = (await handleMcpMessage({ jsonrpc: "2.0", id: 2, method: "tools/list" })) as any;
    expect(list.result.tools.map((t: any) => t.name)).toEqual(["search_library", "get_article", "list_products", "get_site_info"]);

    const call = (await handleMcpMessage({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "search_library", arguments: { query: "owner" } },
    })) as any;
    expect(call.result.content[0].text).toContain("owner-or-renter-online-income");
  });

  it("returns nothing for notifications and errors for unknown methods", async () => {
    expect(await handleMcpMessage({ jsonrpc: "2.0", method: "notifications/initialized" })).toBeNull();
    const bad = (await handleMcpMessage({ jsonrpc: "2.0", id: 9, method: "nope" })) as any;
    expect(bad.error.code).toBe(-32601);
  });

  it("publishes a server card pointing at the endpoint", () => {
    const card = serverCard();
    expect(card.serverInfo.name).toBeTruthy();
    expect(card.transport.endpoint).toBe("https://buildyourdigitalcity.com/mcp");
    expect(card.capabilities.tools).toBeDefined();
  });
});
