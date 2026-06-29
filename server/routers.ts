import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductBySlug, getProductById, getFreeProducts, getPaidProducts, createProduct, getUserOrders, getUserDownloads, hasDownloadAccess, incrementDownloadCount, createSubscriber } from "./db";
import { storageGet } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Products ────────────────────────────────────────────────────────────────
  products: router({
    list: publicProcedure.query(async () => {
      return getAllProducts();
    }),
    free: publicProcedure.query(async () => {
      return getFreeProducts();
    }),
    paid: publicProcedure.query(async () => {
      return getPaidProducts();
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getProductBySlug(input.slug);
      }),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),
  }),

  // ─── Orders & Downloads ──────────────────────────────────────────────────────
  orders: router({
    myOrders: protectedProcedure.query(async ({ ctx }) => {
      return getUserOrders(ctx.user.id);
    }),
  }),

  downloads: router({
    myDownloads: protectedProcedure.query(async ({ ctx }) => {
      return getUserDownloads(ctx.user.id);
    }),
    getLink: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check access
        const product = await getProductById(input.productId);
        if (!product) throw new Error("Product not found");

        // Free products are accessible to all authenticated users
        if (!product.isFree) {
          const access = await hasDownloadAccess(ctx.user.id, input.productId);
          if (!access) throw new Error("No download access. Please purchase this product first.");
        }

        // Get download URL — prefer fileUrl (CDN), fallback to storageGet(fileKey)
        let url: string;
        if (product.fileUrl) {
          url = product.fileUrl;
        } else if (product.fileKey) {
          const result = await storageGet(product.fileKey);
          url = result.url;
        } else {
          throw new Error("Product file not available yet");
        }

        // Track download
        await incrementDownloadCount(ctx.user.id, input.productId);

        return { url, productName: product.name };
      }),
  }),

  // ─── Subscribers (lead magnet) ───────────────────────────────────────────────
  subscribe: router({
    join: publicProcedure
      .input(z.object({
        email: z.string().email(),
        source: z.string().optional(),
        leadMagnetId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createSubscriber({
          email: input.email,
          source: input.source || "website",
          leadMagnetId: input.leadMagnetId,
        });

        try {
          const { execSync } = require('child_process');
          const kitFormId = 9625620; // Clare form (024b6c4ac2)
          const mcpInput = JSON.stringify({
            form_id: kitFormId,
            email_address: input.email,
            user_goal: "connect_my_tools",
            session_id: "web-form-signup",
          });
          
          execSync(`manus-mcp-cli tool call add_subscriber_to_form --server kit --input '${mcpInput.replace(/'/g, "'\\\\''")}' 2>&1`, {
            stdio: 'pipe',
          });
        } catch (error) {
          console.error('[Kit MCP] Failed to add subscriber:', error);
        }

        return { success: true, isNew: result };
      }),
  }),

  // ─── Admin ───────────────────────────────────────────────────────────────────
  admin: router({
    createProduct: adminProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().default("0.00"),
        isFree: z.boolean().default(false),
        productType: z.enum(["ebook", "guide", "blueprint", "toolkit", "course"]),
        fileKey: z.string().optional(),
        fileUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await createProduct(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
