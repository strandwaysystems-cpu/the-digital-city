/**
 * Server-side Gumroad catalog fetch.
 *
 * Uses the GUMROAD_TOKEN env var (set in Hostinger's Node.js app manager)
 * to call the Gumroad API and expose a clean product list to the client.
 * The token never leaves the server. Results are cached in memory so we
 * don't hit Gumroad on every page view.
 */

const GUMROAD_PRODUCTS_URL = "https://api.gumroad.com/v2/products";
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface GumroadProduct {
  id: string;
  name: string;
  formattedPrice: string;
  priceCents: number;
  isFree: boolean;
  shortUrl: string;
  thumbnailUrl: string | null;
  summary: string;
}

interface RawGumroadProduct {
  id?: string;
  name?: string;
  price?: number;
  formatted_price?: string;
  currency?: string;
  short_url?: string;
  thumbnail_url?: string | null;
  preview_url?: string | null;
  custom_summary?: string | null;
  description?: string | null;
  published?: boolean;
  deleted?: boolean;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

export function mapGumroadProduct(raw: RawGumroadProduct): GumroadProduct | null {
  if (!raw.name || !raw.short_url) return null;
  if (raw.published === false || raw.deleted === true) return null;

  const priceCents = typeof raw.price === "number" ? raw.price : 0;
  const isFree = priceCents <= 0;

  let formattedPrice: string;
  if (isFree) {
    formattedPrice = "Free";
  } else if (raw.formatted_price) {
    formattedPrice = raw.formatted_price.startsWith("$")
      ? raw.formatted_price
      : `$${raw.formatted_price}`;
  } else {
    const dollars = priceCents / 100;
    formattedPrice = Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
  }

  let summary = raw.custom_summary?.trim() || "";
  if (!summary && raw.description) summary = stripHtml(raw.description);
  if (summary.length > 160) summary = summary.slice(0, 157) + "…";

  return {
    id: raw.id || raw.short_url,
    name: raw.name,
    formattedPrice,
    priceCents,
    isFree,
    shortUrl: raw.short_url,
    thumbnailUrl: raw.thumbnail_url || raw.preview_url || null,
    summary,
  };
}

let cache: { products: GumroadProduct[]; fetchedAt: number } | null = null;

export async function fetchGumroadProducts(): Promise<GumroadProduct[]> {
  const token = process.env.GUMROAD_TOKEN;
  if (!token) return [];

  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.products;
  }

  try {
    const resp = await fetch(GUMROAD_PRODUCTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!resp.ok) {
      console.error(`[Gumroad] products fetch failed: ${resp.status} ${await resp.text().catch(() => "")}`);
      return cache?.products ?? [];
    }
    const body = (await resp.json()) as { success?: boolean; products?: RawGumroadProduct[] };
    if (!body.success || !Array.isArray(body.products)) {
      console.error("[Gumroad] unexpected products response shape");
      return cache?.products ?? [];
    }
    const products = body.products
      .map(mapGumroadProduct)
      .filter((p): p is GumroadProduct => p !== null);
    cache = { products, fetchedAt: Date.now() };
    return products;
  } catch (error) {
    console.error("[Gumroad] products fetch error:", error);
    return cache?.products ?? [];
  }
}
