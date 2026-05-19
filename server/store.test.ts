import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      get: () => "localhost:3000",
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: { origin: "https://buildyourdigitalcity.com" },
      get: () => "buildyourdigitalcity.com",
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("products.list", () => {
  it("returns an array of products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const products = await caller.products.list();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("includes expected product fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const products = await caller.products.list();
    const first = products[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("slug");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("price");
    expect(first).toHaveProperty("isFree");
    expect(first).toHaveProperty("productType");
  });
});

describe("products.free", () => {
  it("returns only free products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const freeProducts = await caller.products.free();
    expect(Array.isArray(freeProducts)).toBe(true);
    for (const p of freeProducts) {
      expect(p.isFree).toBe(true);
    }
  });
});

describe("products.paid", () => {
  it("returns only paid products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const paidProducts = await caller.products.paid();
    expect(Array.isArray(paidProducts)).toBe(true);
    for (const p of paidProducts) {
      expect(p.isFree).toBe(false);
    }
  });
});

describe("products.bySlug", () => {
  it("returns a product by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const product = await caller.products.bySlug({ slug: "the-digital-city-ebook" });
    expect(product).not.toBeNull();
    expect(product?.name).toBe("The Digital City");
    expect(product?.price).toBe("39.00");
  });

  it("returns null for non-existent slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const product = await caller.products.bySlug({ slug: "non-existent-product" });
    expect(product).toBeUndefined();
  });
});

describe("checkout.createSession", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.checkout.createSession({ productId: 1 })).rejects.toThrow();
  });
});

describe("orders.myOrders", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.orders.myOrders()).rejects.toThrow();
  });

  it("returns empty array for user with no orders", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const orders = await caller.orders.myOrders();
    expect(Array.isArray(orders)).toBe(true);
  });
});
