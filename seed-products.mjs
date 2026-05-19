import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const products = [
  {
    slug: "the-digital-city-ebook",
    name: "The Digital City",
    description: "The complete guide to understanding the internet economy as a structured system. Learn how to see the digital city, identify where value concentrates, and build assets that generate wealth. 9 chapters covering the full digital economy framework — from understanding the city structure to building your own portfolio of compounding digital assets.",
    shortDescription: "The complete guide to understanding the internet economy and building digital assets that compound.",
    price: "39.00",
    currency: "usd",
    isFree: false,
    productType: "ebook",
    coverImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663417824304/KVXDge6fvUaWycs2S4xzUy/book-mockup-bg-mctHpTe5L8Ttdwy2wK24KA.webp",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "portfolio-blueprint",
    name: "Portfolio Blueprint",
    description: "A step-by-step system for building your first digital asset portfolio — from identifying your knowledge assets to launching your first product and earning your first $1,000/month. Includes templates, checklists, and real examples.",
    shortDescription: "Step-by-step system to build your first digital asset portfolio and earn $1,000/month.",
    price: "17.00",
    currency: "usd",
    isFree: false,
    productType: "blueprint",
    isActive: true,
    sortOrder: 2,
  },
  {
    slug: "sovereign-digital-entrepreneur",
    name: "The Sovereign Digital Entrepreneur",
    description: "Strategic frameworks for online monetization in 2026. Master AI orchestration, Generative Engine Optimization (GEO), and zero-capital business models that scale from a laptop. Three complete business plans included.",
    shortDescription: "Strategic frameworks for zero-capital digital monetization in 2026. Three business plans included.",
    price: "0.00",
    currency: "usd",
    isFree: true,
    productType: "guide",
    isActive: true,
    sortOrder: 3,
  },
  {
    slug: "builders-toolkit",
    name: "The Builder's Toolkit",
    description: "Every tool, platform, and resource you need to build a digital asset portfolio — with honest assessments of what works, what to skip, and what to buy first. Covers hosting, email, design, payments, analytics, and more.",
    shortDescription: "Every tool you need to build a digital asset portfolio — honest assessments included.",
    price: "0.00",
    currency: "usd",
    isFree: true,
    productType: "toolkit",
    isActive: true,
    sortOrder: 4,
  },
];

async function seed() {
  console.log("Seeding products...");
  
  for (const product of products) {
    await db.execute(sql`INSERT INTO products (slug, name, description, shortDescription, price, currency, isFree, productType, coverImageUrl, isActive, sortOrder)
            VALUES (${product.slug}, ${product.name}, ${product.description}, ${product.shortDescription}, ${product.price}, ${product.currency}, ${product.isFree}, ${product.productType}, ${product.coverImageUrl || null}, ${product.isActive}, ${product.sortOrder})
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              description = VALUES(description),
              shortDescription = VALUES(shortDescription),
              price = VALUES(price),
              isFree = VALUES(isFree),
              productType = VALUES(productType),
              coverImageUrl = VALUES(coverImageUrl),
              isActive = VALUES(isActive),
              sortOrder = VALUES(sortOrder)`);
    console.log(`  ✓ ${product.name}`);
  }
  
  console.log("\nDone! Products seeded successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
