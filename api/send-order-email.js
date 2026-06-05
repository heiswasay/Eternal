import { createRequire } from "node:module";
import { appendOrderToSheet } from "./google-sheets.js";

const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");

export async function handleSendOrderEmail(order) {
  try {
    const payload = order;
    if (!payload?.customerEmail || !payload?.items) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Incomplete order parameters. All fields are required.",
        },
      };
    }

    const clientEmail = payload.customerEmail;
    const adminEmail = "support@eternal.com.pk";

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternal Order Confirmed</title>
  <style>
    body { background-color: #09090b; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 4px; overflow: hidden; }
    .header { background-color: #09090b; padding: 40px 30px; text-align: center; border-bottom: 1px solid #18181b; }
    .logo { font-size: 11px; letter-spacing: 0.4em; color: #f59e0b; text-transform: uppercase; font-weight: 600; }
    .title { font-size: 24px; color: #ffffff; margin-top: 15px; margin-bottom: 5px; font-weight: 300; }
    .subtitle { font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.15em; }
    .content { padding: 40px 30px; }
    .card { background-color: #121214; border: 1px solid #1e1e21; padding: 24px; border-radius: 2px; margin-bottom: 30px; }
    .card-title { font-size: 11px; letter-spacing: 0.2em; color: #f59e0b; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #27272a; padding-bottom: 8px; }
    .item-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .item-table th { text-align: left; font-size: 10px; letter-spacing: 0.15em; color: #a1a1aa; text-transform: uppercase; padding-bottom: 12px; border-bottom: 1px solid #27272a; }
    .item-table td { padding: 16px 0; border-bottom: 1px solid #18181b; vertical-align: middle; }
    .item-name { font-size: 14px; color: #ffffff; font-weight: 550; text-transform: uppercase; }
    .item-meta { font-size: 11px; color: #71717a; margin-top: 4px; }
    .item-price { font-size: 14px; color: #ffffff; text-align: right; }
    .totals-section { width: 100%; margin-top: 20px; border-top: 1px solid #27272a; padding-top: 15px; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; }
    .grand-total { font-size: 18px; color: #ffffff; font-weight: 600; border-top: 1px solid #27272a; padding-top: 12px; margin-top: 6px; }
    .footer { background-color: #09090b; padding: 30px; text-align: center; border-top: 1px solid #18181b; font-size: 11px; color: #71717a; }
    .footer a { color: #f59e0b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">ETERNAL WORKSHOP ATELIER</div>
      <div class="title">Bespoke Order Acknowledged</div>
      <div class="subtitle">Order ID: ${payload.orderId}</div>
    </div>
    <div class="content">
      <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
        Dear ${payload.customerName || "Customer"}, thank you for your order. Below is your transaction overview:
      </p>
      <div class="card">
        <div class="card-title">Delivery Parameters</div>
        <div style="font-size: 13px; line-height: 1.6; color: #fafafa;">
          <strong>Consignee Name:</strong> ${payload.customerName}<br>
          <strong>Contact Number:</strong> ${payload.customerPhone}<br>
          <strong>Destination:</strong> ${payload.customerAddress}<br>
          <strong>Payment Mode:</strong> Cash on Delivery<br>
          ${payload.notes ? `<strong>Notes:</strong> ${payload.notes}` : ""}
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
          ${payload.items
            .map(
              (item) => `
          <tr>
            <td>
              <div class="item-name">${item.name}</div>
              <div class="item-meta">Size: EU ${item.size} • Qty: ${item.quantity}</div>
            </td>
            <td class="item-price">${item.price}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="totals-section">
        <div class="total-row grand-total">
          <span>Amount collectable on COD</span>
          <span>${payload.totalPrice}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      For enquiries: <a href="mailto:support@eternal.com.pk">support@eternal.com.pk</a>
    </div>
  </div>
</body>
</html>`;

    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #09090b; color: #fafafa; font-family: sans-serif; }
    .container { max-width: 600px; margin: 20px auto; border: 1px solid #27272a; padding: 30px; background: #000; }
    h1 { font-size: 20px; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
    .field { margin-bottom: 12px; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; }
    .val { color: #fff; font-size: 14px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; background-color: #1c1917; color: #a1a1aa; padding: 10px; font-size: 11px; }
    td { padding: 10px; border-bottom: 1px solid #1c1917; color: #e4e4e7; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NEW ATELIER ORDER RECEIVED</h1>
    <div class="field"><div class="label">Order ID</div><div class="val">${payload.orderId}</div></div>
    <div class="field"><div class="label">Customer Name</div><div class="val">${payload.customerName}</div></div>
    <div class="field"><div class="label">Phone</div><div class="val">${payload.customerPhone}</div></div>
    <div class="field"><div class="label">Email</div><div class="val">${payload.customerEmail}</div></div>
    <div class="field"><div class="label">Address</div><div class="val">${payload.customerAddress}</div></div>
    <div class="field"><div class="label">Notes</div><div class="val">${payload.notes || "None"}</div></div>
    <table>
      <thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        ${payload.items
          .map(
            (item) => `
        <tr>
          <td>${item.name}</td>
          <td>EU ${item.size}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div style="margin-top: 20px; text-align: right;">
      <strong style="color: #f59e0b;">${payload.totalPrice}</strong>
    </div>
  </div>
</body>
</html>`;

    const secureSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (secureSmtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== "false",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Eternal Atelier" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
        to: clientEmail,
        subject: `Order Recieved [ID: ${payload.orderId}] - Eternal Workshop`,
        html: customerEmailHtml,
      });

      await transporter.sendMail({
        from: `"Eternal Atelier" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Order [ID: ${payload.orderId}] - COD - ${payload.customerName}`,
        html: adminEmailHtml,
      });
    } else {
      console.log(
        `[Email] Order ${payload.orderId}: SMTP_USER/SMTP_PASS not set — emails not sent.`
      );
    }

    // Sync to Google Spreadsheet
    let sheetsSyncStatus = { success: false, reason: "execution_not_called" };
    try {
      sheetsSyncStatus = await appendOrderToSheet(payload);
    } catch (sheetErr) {
      console.error("[Sheets Error] Silently caught spreadsheet append failure:", sheetErr);
      sheetsSyncStatus = { success: false, reason: "exception_raised", error: sheetErr.message || String(sheetErr) };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Order email processed successfully.",
        orderId: payload.orderId,
        sheetsSyncStatus: sheetsSyncStatus
      },
    };
  } catch (e) {
    console.error("[Email Dispatch Error]", e);
    return {
      status: 500,
      body: {
        success: false,
        error:
          "Internal failure dispatching order details. Contact atelier administrator.",
      },
    };
  }
}

export async function POST(request) {
  try {
    const order = await request.json();
    const result = await handleSendOrderEmail(order);
    return Response.json(result.body, { status: result.status });
  } catch (err) {
    console.error("[api/send-order-email] Unhandled error:", err);
    return Response.json(
      { success: false, error: "Server error processing order email." },
      { status: 500 }
    );
  }
}
