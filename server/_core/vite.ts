import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { renderSpaShell } from "../agent";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // index: false so "/" goes through renderSpaShell like every other page.
  app.use(express.static(distPath, { index: false }));

  // Everything else is the React app. renderSpaShell adds per-page head tags,
  // JSON-LD and readable fallback content, and returns 404 for unknown paths.
  const indexPath = path.resolve(distPath, "index.html");
  let template: string | null = null;
  app.use("*", async (req, res) => {
    try {
      template ??= fs.readFileSync(indexPath, "utf-8");
      const { status, html } = await renderSpaShell(template, req.originalUrl.split("?")[0]);
      res.status(status).type("html").set("Cache-Control", "public, max-age=0").send(html);
    } catch (error) {
      console.error("[spa] render failed, sending plain index.html:", error);
      res.sendFile(indexPath);
    }
  });
}
