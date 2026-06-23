import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { handleSendOrderEmail, handleSendStatusEmail } from "./api/send-order-email.js";
import { appendOrderToSheet, syncOrderStatusToSheet } from "./api/google-sheets.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit and parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post("/api/send-order-email", async (req, res) => {
    try {
      const result = await handleSendOrderEmail(req.body);
      return res.status(result.status).json(result.body);
    } catch (err: any) {
      console.error("[POST /api/send-order-email Error]:", err);
      return res.status(500).json({
        success: false,
        error: err.message || String(err),
      });
    }
  });

  app.post("/api/send-status-email", async (req, res) => {
    try {
      const { order, status } = req.body;
      const result = await handleSendStatusEmail(order, status);
      return res.status(result.status).json(result.body);
    } catch (err: any) {
      console.error("[POST /api/send-status-email Error]:", err);
      return res.status(500).json({
        success: false,
        error: err.message || String(err),
      });
    }
  });

  app.post("/api/test-sheets-sync", async (req, res) => {
    try {
      const order = req.body;
      const result = await appendOrderToSheet(order);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  app.post("/api/sync-sheets-status", async (req, res) => {
    try {
      const { orderId, status } = req.body;
      const result = await syncOrderStatusToSheet(orderId, status);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  // Serve static assets in production, otherwise mount Vite Dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Dev-mode SPA Fallback: Serve transformed index.html for non-asset routing
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // Read raw entry template
        let template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        // Apply Vite HTML transformations (injecting clients, setting correct bundles)
        template = await vite.transformIndexHtml(url, template);
        return res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        return next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully engaged on port ${PORT}`);
  });
}

startServer();
