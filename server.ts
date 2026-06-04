import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit and parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Send Order Email
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const order = req.body;
      if (!order || !order.customerEmail || !order.items) {
        return res.status(400).json({
          success: false,
          error: "Incomplete order parameters. All fields are required.",
        });
      }

      const clientEmail = order.customerEmail;
      const adminEmail = "savortheluxury@gmail.com";

      // 1. Generate Beautiful HTML Email for Customer
      const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternal Order Confirmed</title>
  <style>
    body {
      background-color: #09090b;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #09090b;
      border: 1px solid #27272a;
      border-radius: 4px;
      overflow: hidden;
    }
    .header {
      background-color: #09090b;
      padding: 40px 30px;
      text-align: center;
      border-bottom: 1px solid #18181b;
    }
    .logo {
      font-size: 11px;
      letter-spacing: 0.4em;
      color: #f59e0b;
      text-transform: uppercase;
      font-weight: 600;
    }
    .title {
      font-size: 24px;
      color: #ffffff;
      margin-top: 15px;
      margin-bottom: 5px;
      font-weight: 300;
    }
    .subtitle {
      font-size: 12px;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }
    .content {
      padding: 40px 30px;
    }
    .card {
      background-color: #121214;
      border: 1px solid #1e1e21;
      padding: 24px;
      border-radius: 2px;
      margin-bottom: 30px;
    }
    .card-title {
      font-size: 11px;
      letter-spacing: 0.2em;
      color: #f59e0b;
      text-transform: uppercase;
      margin-top: 0;
      margin-bottom: 15px;
      border-bottom: 1px solid #27272a;
      padding-bottom: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 8px 0;
      border-bottom: 1px dashed #1e1e21;
    }
    .detail-label {
      color: #a1a1aa;
    }
    .detail-value {
      color: #ffffff;
      font-weight: 500;
    }
    .item-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .item-table th {
      text-align: left;
      font-size: 10px;
      letter-spacing: 0.15em;
      color: #a1a1aa;
      text-transform: uppercase;
      padding-bottom: 12px;
      border-bottom: 1px solid #27272a;
    }
    .item-table td {
      padding: 16px 0;
      border-bottom: 1px solid #18181b;
      vertical-align: middle;
    }
    .item-name {
      font-size: 14px;
      color: #ffffff;
      font-weight: 550;
      text-transform: uppercase;
    }
    .item-meta {
      font-size: 11px;
      color: #71717a;
      margin-top: 4px;
    }
    .item-price {
      font-size: 14px;
      color: #ffffff;
      text-align: right;
    }
    .totals-section {
      width: 100%;
      margin-top: 20px;
      border-top: 1px solid #27272a;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 6px 0;
    }
    .grand-total {
      font-size: 18px;
      color: #ffffff;
      font-weight: 600;
      border-top: 1px solid #27272a;
      padding-top: 12px;
      margin-top: 6px;
    }
    .footer {
      background-color: #09090b;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #18181b;
      font-size: 11px;
      color: #71717a;
      letter-spacing: 0.05em;
      line-height: 1.6;
    }
    .footer a {
      color: #f59e0b;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">ETERNAL WORKSHOP ATELIER</div>
      <div class="title">Bespoke Order Acknowledged</div>
      <div class="subtitle">Order ID: ${order.orderId}</div>
    </div>
    <div class="content">
      <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; font-weight: 300; margin-top: 0; margin-bottom: 25px;">
        Dear ${order.customerName || "Customer"}, thank you for your sartorial trust. We have successfully registered your custom order details. Below is your transaction overview:
      </p>

      <div class="card">
        <div class="card-title">Delivery Parameters</div>
        <div style="font-size: 13px; line-height: 1.6; color: #fafafa;">
          <strong>Consignee Name:</strong> ${order.customerName}<br>
          <strong>Contact Number:</strong> ${order.customerPhone}<br>
          <strong>Destination:</strong> ${order.customerAddress}<br>
          <strong>Payment Mode:</strong> Cash on Delivery (Complimentary Priority Shipping)<br>
          ${order.notes ? `<strong>Notes:</strong> ${order.notes}` : ""}
        </div>
      </div>

      <table class="item-table">
        <thead>
          <tr>
            <th>Bespoke Item</th>
            <th style="text-align: right;">Valuation</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item: any) => `
          <tr>
            <td>
              <div class="item-name">${item.name}</div>
              <div class="item-meta">Size: EU ${item.size} • Qty: ${item.quantity}</div>
            </td>
            <td class="item-price">${item.price}</td>
          </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row" style="color: #a1a1aa;">
          <span>Gross Subtotal</span>
          <span>${order.totalPrice}</span>
        </div>
        <div class="total-row" style="color: #10b981;">
          <span>Express Courier Dispatch</span>
          <span>COMPLIMENTARY</span>
        </div>
        <div class="total-row grand-total">
          <span>Amount collectable on COD</span>
          <span style="color: #ffffff;">${order.totalPrice}</span>
        </div>
      </div>
      
      <p style="font-size: 12px; color: #f59e0b; margin-top: 30px; margin-bottom: 0; line-height: 1.5; font-weight: 500;">
        🛡️ COMPLIMENTARY COURIER PROTECTION AND 10-YEAR LIFETIME REPAIR WARRANTY ACTIVED IMMEDIATELY.
      </p>
    </div>
    <div class="footer">
      This is a secure automated receipt generated from Eternal Atelier transaction systems.<br>
      For special enquiries, reply to this mail or contact our desk: <a href="mailto:savortheluxury@gmail.com">savortheluxury@gmail.com</a>.
    </div>
  </div>
</body>
</html>
`;

      // 2. Generate Beautiful HTML Email for Store Owner (Admin Notification)
      const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #09090b; color: #fafafa; font-family: sans-serif; }
    .container { max-width: 600px; margin: 20px auto; border: 1px solid #27272a; padding: 30px; background: #000; }
    h1 { font-size: 20px; font-weight: bold; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-bottom: 20px; }
    .field { margin-bottom: 12px; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; }
    .val { color: #fff; font-size: 14px; font-weight: bold; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; background-color: #1c1917; color: #a1a1aa; padding: 10px; font-size: 11px; }
    td { padding: 10px; border-bottom: 1px solid #1c1917; color: #e4e4e7; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔔 NEW ATELIER ORDER RECEIVED</h1>
    <div class="field">
      <div class="label">Order ID</div>
      <div class="val" style="color:#f59e0b">${order.orderId}</div>
    </div>
    <div class="field">
      <div class="label">Customer Name</div>
      <div class="val">${order.customerName}</div>
    </div>
    <div class="field">
      <div class="label">Phone Number</div>
      <div class="val" style="color: #22d3ee">${order.customerPhone}</div>
    </div>
    <div class="field">
      <div class="label">Email Address</div>
      <div class="val">${order.customerEmail}</div>
    </div>
    <div class="field">
      <div class="label">Shipping Address</div>
      <div class="val">${order.customerAddress}</div>
    </div>
    <div class="field">
      <div class="label">Customer Notes</div>
      <div class="val" style="font-style: italic; color:#d4d4d8">${order.notes || "None"}</div>
    </div>

    <h2>CONSIGNMENT ITEMS</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Size</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item: any) => `
        <tr>
          <td>${item.name}</td>
          <td>EU ${item.size}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div style="margin-top: 20px; text-align: right; font-size: 16px;">
      <span style="color: #888;">Collectable Cash On Delivery Balance: </span>
      <strong style="color: #f59e0b; padding-left: 10px;">${order.totalPrice}</strong>
    </div>
  </div>
</body>
</html>
`;

      // 3. Initiate Nodemailer Transport configuration
      // We checks if credentials are provided in env.
      const secureSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

      if (secureSmtpConfigured) {
        // Build SMTP transporter securely
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: process.env.SMTP_SECURE !== "false", // true for 465, false for 587
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Send to Customer
        await transporter.sendMail({
          from: `"Eternal Atelier" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
          to: clientEmail,
          subject: `Order Recieved ✓ [ID: ${order.orderId}] - Eternal Workshop`,
          html: customerEmailHtml,
        });

        // Send to Shop Owner
        await transporter.sendMail({
          from: `"Eternal Atelier" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `🔔 New Order [ID: ${order.orderId}] - COD - ${order.customerName}`,
          html: adminEmailHtml,
        });

        console.log(`[Email System] Successfully sent order emails [Order ID: ${order.orderId}] to ${clientEmail} and ${adminEmail} via SMTP.`);
      } else {
        // Live fallback log printer - prints beautiful verification logs in server CLI console
        console.log("--------------------------------------------------");
        console.log(`📬 SERVER LIVE LOG ACTION: SEND_ORDER_EMAILS`);
        console.log(`ORDER ID: ${order.orderId}`);
        console.log(`TO CUSTOMER EMAIL: ${clientEmail}`);
        console.log(`TO ADMIN EMAIL: ${adminEmail}`);
        console.log(`STATUS: SMTP Credentials not configured in .env yet.`);
        console.log(`PROMPT FOR DEVELOPER: To activate actual mail dispatch, supply SMTP_USER and SMTP_PASS environment variables.`);
        console.log("--------------------------------------------------");
      }

      return res.status(200).json({
        success: true,
        message: "Order email processed successfully.",
        orderId: order.orderId,
      });

    } catch (e: any) {
      console.error("[Email Dispatch Error]", e);
      return res.status(500).json({
        success: false,
        error: "Internal failure dispatching order details. Contact atelier administrator.",
      });
    }
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
