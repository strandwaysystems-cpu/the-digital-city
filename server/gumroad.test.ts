import { describe, expect, it } from "vitest";
import { mapGumroadProduct } from "./gumroad";

describe("mapGumroadProduct", () => {
  it("maps a paid product with formatted price and thumbnail", () => {
    const product = mapGumroadProduct({
      id: "abc123",
      name: "Owner vs Renter",
      price: 900,
      formatted_price: "$9",
      short_url: "https://buildyourdigitalcity.gumroad.com/l/owner-vs-renter",
      thumbnail_url: "https://public-files.gumroad.com/thumb.png",
      description: "<p>Discover where you <b>stand</b>.</p>",
      published: true,
    });
    expect(product).not.toBeNull();
    expect(product?.name).toBe("Owner vs Renter");
    expect(product?.formattedPrice).toBe("$9");
    expect(product?.isFree).toBe(false);
    expect(product?.shortUrl).toContain("/l/owner-vs-renter");
    expect(product?.thumbnailUrl).toBe("https://public-files.gumroad.com/thumb.png");
    expect(product?.summary).toBe("Discover where you stand.");
  });

  it("derives price from cents when formatted_price is missing", () => {
    const product = mapGumroadProduct({
      name: "E-Book",
      price: 3900,
      short_url: "https://x.gumroad.com/l/e-book",
    });
    expect(product?.formattedPrice).toBe("$39");
  });

  it("marks zero-price products as free", () => {
    const product = mapGumroadProduct({
      name: "Free Guide",
      price: 0,
      short_url: "https://x.gumroad.com/l/free-guide",
    });
    expect(product?.isFree).toBe(true);
    expect(product?.formattedPrice).toBe("Free");
  });

  it("skips unpublished, deleted, and malformed products", () => {
    expect(mapGumroadProduct({ name: "Draft", short_url: "https://x/l/d", published: false })).toBeNull();
    expect(mapGumroadProduct({ name: "Gone", short_url: "https://x/l/g", deleted: true })).toBeNull();
    expect(mapGumroadProduct({ name: "No URL" })).toBeNull();
  });

  it("prefers custom_summary and truncates long text", () => {
    const long = "x".repeat(400);
    const product = mapGumroadProduct({
      name: "P",
      price: 100,
      short_url: "https://x/l/p",
      custom_summary: long,
    });
    expect(product?.summary.length).toBeLessThanOrEqual(160);
  });
});
