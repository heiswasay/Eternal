import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { handleSendOrderEmail } from "./api/send-order-email.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit and parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post("/api/send-order-email", async (req, res) => {
    const result = await handleSendOrderEmail(req.body);
    return res.status(result.status).json(result.body);
  });

  // Serve static assets in production, otherwise mount Vite Dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
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
