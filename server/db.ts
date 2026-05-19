import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, orders, downloads, subscribers, type InsertProduct, type InsertOrder, type InsertDownload, type InsertSubscriber } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}

// ─── Product Queries ─────────────────────────────────────────────────────────

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, true)).orderBy(products.sortOrder);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(products).values(product);
}

export async function getFreeProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(and(eq(products.isFree, true), eq(products.isActive, true))).orderBy(products.sortOrder);
}

export async function getPaidProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(and(eq(products.isFree, false), eq(products.isActive, true))).orderBy(products.sortOrder);
}

// ─── Order Queries ───────────────────────────────────────────────────────────

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result[0].insertId;
}

export async function getOrderByStripeSession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateOrderStatus(orderId: number, status: "pending" | "completed" | "failed" | "refunded", paymentIntentId?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: Record<string, unknown> = { status };
  if (paymentIntentId) updateData.stripePaymentIntentId = paymentIntentId;
  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(and(eq(orders.userId, userId), eq(orders.status, "completed"))).orderBy(desc(orders.createdAt));
}

// ─── Download Queries ────────────────────────────────────────────────────────

export async function grantDownloadAccess(download: InsertDownload) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(downloads).values(download);
}

export async function getUserDownloads(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(downloads).where(eq(downloads.userId, userId));
}

export async function hasDownloadAccess(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(downloads).where(and(eq(downloads.userId, userId), eq(downloads.productId, productId))).limit(1);
  return result.length > 0;
}

export async function incrementDownloadCount(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(downloads).where(and(eq(downloads.userId, userId), eq(downloads.productId, productId))).limit(1);
  if (existing.length > 0) {
    await db.update(downloads).set({
      downloadCount: existing[0].downloadCount + 1,
      lastDownloadedAt: new Date(),
    }).where(eq(downloads.id, existing[0].id));
  }
}

// ─── Subscriber Queries ──────────────────────────────────────────────────────

export async function createSubscriber(subscriber: InsertSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(subscribers).values(subscriber);
    return true;
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") return false;
    throw error;
  }
}

export async function getSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
