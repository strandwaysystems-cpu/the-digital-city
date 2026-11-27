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
