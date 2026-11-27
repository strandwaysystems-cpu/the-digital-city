import { describe, expect, it } from "vitest";
import {
  isVisible,
  loadArticles,
  parseArticle,
  renderArticle,
  renderIndex,
  renderRobots,
  renderSitemap,
} from "./library";

const sample = `---
title: How <Things> Work
description: A "quoted" description.
district: attention-media
date: 2026-01-05
status: published
product_name: Test Product
product_url: https://example.gumroad.com/l/test
---

## Heading

Body text.
`;

describe("library", () => {
  it("parses frontmatter and renders markdown", () => {
    const a = parseArticle("how-things-work", sample)!;
    expect(a.title).toBe("How <Things> Work");
    expect(a.district).toBe("attention-media");
    expect(a.html).toContain("<h2>Heading</h2>");
    expect(a.productUrl).toBe("https://example.gumroad.com/l/test");
  });

  it("rejects bad slugs and missing fields", () => {
    expect(parseArticle("Bad Slug", sample)).toBeNull();
    expect(parseArticle("ok", "---\ntitle: x\n---\nbody")).toBeNull();
  });

  it("falls back to city-planning for unknown districts", () => {
    const a = parseArticle("x", sample.replace("attention-media", "nowhere"))!;
    expect(a.district).toBe("city-planning");
  });

  it("hides drafts and future-dated articles", () => {
    const a = parseArticle("x", sample)!;
    expect(isVisible(a, "2026-01-05")).toBe(true);
    expect(isVisible(a, "2026-01-04")).toBe(false);
    expect(isVisible({ ...a, status: "draft" }, "2027-01-01")).toBe(false);
  });

  it("escapes titles in rendered HTML", () => {
    const html = renderArticle(parseArticle("x", sample)!);
    expect(html).toContain("How &lt;Things&gt; Work");
    expect(html).not.toContain("<title>How <Things>");
    expect(html).toContain('"@type":"Article"');
  });

  it("lists articles in the index and sitemap", () => {
    const a = parseArticle("how-things-work", sample)!;
    expect(renderIndex([a])).toContain('href="/library/how-things-work"');
    const map = renderSitemap([a]);
    expect(map).toContain("/library/how-things-work</loc><lastmod>2026-01-05");
    expect(map).toContain("/store</loc>");
    expect(renderRobots()).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  });

  it("loads the real content folder, skipping underscore files", () => {
    const articles = loadArticles();
    expect(articles.some(a => a.slug === "owner-or-renter-online-income")).toBe(true);
    expect(articles.some(a => a.slug.startsWith("_"))).toBe(false);
  });
});

describe("enhanceHtml", () => {
  it("numbers h2s, builds a toc, wraps tables and styles flows, tips and notes", async () => {
    const { enhanceHtml } = await import("./library");
    const { html, toc } = enhanceHtml(
      "<p>Intro</p><h2>What changed</h2><p><strong>A → B → C</strong></p><p><strong>Tip:</strong> do it</p>" +
        "<blockquote>\n<p>✍️ <strong>Add</strong> this</p>\n</blockquote><table><tr><td>x</td></tr></table>" +
        "<h2>What changed</h2><hr>\n<p><strong>Sources</strong></p>\n<ul><li>s</li></ul>"
    );
    expect(toc.map(t => t.id)).toEqual(["what-changed", "what-changed-x"]);
    expect(html).toContain('<p class="intro">Intro');
    expect(html).toContain('<span class="num">01</span>');
    expect(html).toContain('<span class="step">B</span>');
    expect(html).toContain('<p class="tip">');
    expect(html).toContain('class="author-note"');
    expect(html).toContain('<div class="table-wrap"><table>');
    expect(html).toContain('<section class="sources"><h4>Sources</h4>');
  });
});
