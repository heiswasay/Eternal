import nodemailer from "nodemailer";
import { appendOrderToSheet } from "./google-sheets.js";

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

    const displaySize = (size) => {
      if (!size) return "N/A";
      const str = String(size);
      if (str.includes("US") || str.includes("EU") || str.includes("UK")) return str;
      const num = parseInt(str, 10);
      if (!isNaN(num) && num >= 35) {
        return `EU ${str}`;
      }
      return `US ${str}`;
    };

    const clientEmail = payload.customerEmail;
    const adminEmail = "savortheluxury@gmail.com";

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternal Order Confirmed</title>
  <style>
    body { background-color: #0c0a09; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; min-height: 100vh; }
    .outer-table { background-image: url('https://images.unsplash.com/photo-1592844001374-ba7fbddf2fe2?auto=format&fit=crop&w=1200&q=80&blur=85'); background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%; min-height: 100vh; padding: 40px 10px; background-color: #0c0a09; }
    .glass-card { max-width: 580px; width: 100%; background-color: rgba(9, 9, 11, 0.94); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7); overflow: hidden; padding: 44px 32px; box-sizing: border-box; text-align: left; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
    .logo { font-size: 11px; letter-spacing: 0.45em; color: #f59e0b; text-transform: uppercase; font-weight: 600; text-align: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); padding-bottom: 18px; }
    .heading-title { font-size: 26px; color: #ffffff; text-align: center; font-weight: 300; margin: 0 0 10px 0; letter-spacing: -0.01em; }
    .greeting-text { font-size: 14px; color: #a1a1aa; text-align: center; line-height: 1.6; margin: 0 0 32px 0; }
    .section-title { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #f59e0b; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin: 0 0 16px 0; }
    .details-box { margin-top: 24px; margin-bottom: 24px; padding: 20px; background-color: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 4px; }
    .details-row td { padding: 3px 0; font-size: 12px; line-height: 1.6; vertical-align: top; }
    .footer-section { text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 24px; margin-top: 16px; }
    .social-link { display: inline-block; margin: 0 12px; color: #a1a1aa; text-decoration: none; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
    .social-link img { vertical-align: middle; margin-right: 6px; filter: invert(0.85); display: inline-block; }
  </style>
</head>
<body>
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-table">
    <tr>
      <td align="center" valign="top">
        <div class="glass-card">
          <div class="logo">ETERNAL WORKSHOP</div>
          <h1 class="heading-title">Your order is confirmed</h1>
          <p class="greeting-text">Thanks for your order, ${payload.customerName}!</p>
          
          <div class="section-title">Order Summary</div>
          
          ${payload.items.map(item => `
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px;">
            <tr>
              <td style="vertical-align: middle; text-align: left;">
                <div style="font-size: 13px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${item.name}</div>
                <div style="font-size: 11px; color: #71717a;">${displaySize(item.size)} &bull; Qty: ${item.quantity}</div>
              </td>
              <td width="100" style="vertical-align: middle; text-align: right; font-size: 13px; font-weight: 600; color: #ffffff;">
                ${item.price}
              </td>
            </tr>
          </table>
          `).join("")}

          <div class="details-box">
            <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #a1a1aa; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">Delivery Details</div>
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr class="details-row">
                <td width="30%" style="color: #71717a;">Name</td>
                <td style="color: #ffffff; font-weight: 500;">${payload.customerName}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Phone</td>
                <td style="color: #ffffff; font-weight: 500;">${payload.customerPhone}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Email</td>
                <td style="color: #ffffff; font-weight: 500;">${payload.customerEmail}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Address</td>
                <td style="color: #ffffff; font-weight: 500;">${payload.customerAddress}</td>
              </tr>
              ${payload.notes ? `
              <tr class="details-row">
                <td style="color: #71717a;">Notes</td>
                <td style="color: #f59e0b; font-style: italic;">${payload.notes}</td>
              </tr>` : ""}
            </table>
          </div>

          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-bottom: 32px;">
            <tr>
              <td style="font-size: 13px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: middle;">Total Payable (COD)</td>
              <td style="font-size: 18px; color: #f59e0b; font-weight: 700; text-align: right; vertical-align: middle;">${payload.totalPrice}</td>
            </tr>
          </table>

          <div class="footer-section">
            <div style="margin-bottom: 20px;">
              <a href="https://www.facebook.com/eternal.com.pk" target="_blank" class="social-link">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="14" height="14" alt="Facebook" />
                Facebook
              </a>
              <a href="https://www.instagram.com/eternal.com.pk" target="_blank" class="social-link">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="14" height="14" alt="Instagram" />
                Instagram
              </a>
            </div>
            <p style="font-size: 11px; color: #71717a; margin: 0 0 8px 0; letter-spacing: 0.05em; text-transform: uppercase;">
              For Enquiry: <a href="mailto:savortheluxury@gmail.com" style="color: #f59e0b; text-decoration: none; font-weight: bold;">savortheluxury@gmail.com</a>
            </p>
            <p style="font-size: 10px; color: #52525b; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">
              &copy; 2026 ETERNAL WORKSHOP. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
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
    <h1>NEW ETERNAL ORDER RECEIVED</h1>
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
          <td>${displaySize(item.size)}</td>
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

    let smtpUser = (process.env.SMTP_USER || "savortheluxury@gmail.com").trim();
    let smtpPass = (process.env.SMTP_PASS || "").trim();
    let smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    let smtpPort = Number(process.env.SMTP_PORT) || 465;
    let smtpSecure = process.env.SMTP_SECURE !== "false";
    let smtpSender = (process.env.SMTP_SENDER || smtpUser).trim();

    // Auto-clean: Remove spaces if the user pasted a 16-character Google App Password with spaces
    if (smtpHost.includes("gmail.com") && smtpPass.replace(/\s+/g, "").length === 16) {
      smtpPass = smtpPass.replace(/\s+/g, "");
    }

    const secureSmtpConfigured = !!smtpPass;
    let customerMailSent = false;
    let adminMailSent = false;
    let customerMailError = null;
    let adminMailError = null;
    let sendingMethodsAttempted = [];

    if (secureSmtpConfigured) {
      const strategies = [];

      // Strategy 1: Dedicated Gmail service mode (extremely resilient for @gmail.com accounts)
      if (smtpHost.includes("gmail.com") || smtpUser.includes("@gmail.com")) {
        strategies.push({
          name: "Gmail Service (Direct Integration API)",
          config: {
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          }
        });
      }

      // Strategy 2: Absolute exact user config or 465 SSL Direct Secure
      strategies.push({
        name: `SMTP Standard SSL (Host: ${smtpHost}, Port: 465)`,
        config: {
          host: smtpHost,
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }
      });

      // Strategy 3: SMTP STARTTLS Port 587
      strategies.push({
        name: `SMTP STARTTLS (Host: ${smtpHost}, Port: 587)`,
        config: {
          host: smtpHost,
          port: 587,
          secure: false,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }
      });

      // Strategy 4: Fallback to explicit non-standard ports
      if (smtpPort !== 465 && smtpPort !== 587) {
        strategies.push({
          name: `Explicit Custom SMTP (Host: ${smtpHost}, Port: ${smtpPort}, Secure: ${smtpSecure})`,
          config: {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          }
        });
      }

      // Run connection and dispatch strategies sequentially until both succeed or strategies are exhausted
      for (const strategy of strategies) {
        if (customerMailSent && adminMailSent) {
          break; // Fully complete!
        }

        console.log(`[Email Dispatcher] Attempting delivery using strategy: ${strategy.name}`);
        sendingMethodsAttempted.push(strategy.name);

        try {
          const transporter = nodemailer.createTransport(strategy.config);

          // Force test socket authentication before invoking heavy emails
          await transporter.verify();
          console.log(`[Email Dispatcher] SMTP Socket Verified on strategy: ${strategy.name}`);

          // 1. Dispatch customer email independently so failure here doesn't bypass the administrator
          if (!customerMailSent) {
            try {
              await transporter.sendMail({
                from: `"Eternal" <${smtpSender}>`,
                to: clientEmail,
                subject: `Order Received [ID: ${payload.orderId}] - Eternal Workshop`,
                html: customerEmailHtml,
              });
              customerMailSent = true;
              customerMailError = null;
              console.log(`[Email Dispatcher] Success: Customer email sent to ${clientEmail}`);
            } catch (clientErr) {
              console.error(`[Email Dispatcher] Customer email dispatch failed (${clientEmail}):`, clientErr);
              customerMailError = clientErr.message || String(clientErr);
            }
          }

          // 2. Dispatch store administrator notice independently
          if (!adminMailSent) {
            try {
              await transporter.sendMail({
                from: `"Eternal" <${smtpSender}>`,
                to: adminEmail,
                subject: `New Order [ID: ${payload.orderId}] - COD - ${payload.customerName}`,
                html: adminEmailHtml,
              });
              adminMailSent = true;
              adminMailError = null;
              console.log(`[Email Dispatcher] Success: Admin email sent to ${adminEmail}`);
            } catch (adminErr) {
              console.error(`[Email Dispatcher] Admin email dispatch failed (${adminEmail}):`, adminErr);
              adminMailError = adminErr.message || String(adminErr);
            }
          }

        } catch (connErr) {
          console.warn(`[Email Dispatcher] Connection failure on strategy (${strategy.name}):`, connErr.message || connErr);
          if (!customerMailSent) customerMailError = connErr.message || String(connErr);
          if (!adminMailSent) adminMailError = connErr.message || String(connErr);
        }
      }
    } else {
      console.warn(
        `[Email Dispatcher] Order ${payload.orderId}: SMTP_PASS is empty. Emails bypassed.`
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
        message: (customerMailSent && adminMailSent)
          ? "Order processed and confirmation emails successfully sent."
          : "Order placed. Confirmation emails are pending system authentication.",
        orderId: payload.orderId,
        sheetsSyncStatus: sheetsSyncStatus,
        emailDetails: {
          secureSmtpConfigured,
          customerMailSent,
          adminMailSent,
          customerMailError,
          adminMailError,
          sendingMethodsAttempted
        }
      },
    };
  } catch (e) {
    console.error("[Email Dispatch Error]", e);
    return {
      status: 500,
      body: {
        success: false,
        error:
          "Internal failure dispatching order details. Contact Eternal administrator.",
      },
    };
  }
}

export function getStatusEmailHtml(payload, status) {
  const displaySize = (size) => {
    if (!size) return "N/A";
    const str = String(size);
    if (str.includes("US") || str.includes("EU") || str.includes("UK")) return str;
    const num = parseInt(str, 10);
    if (!isNaN(num) && num >= 35) {
      return `EU ${str}`;
    }
    return `US ${str}`;
  };

  const firstItemName = payload.items && payload.items[0] ? payload.items[0].name : "Premium Footwear";
  const firstItemSize = payload.items && payload.items[0] ? displaySize(payload.items[0].size) : "EU 43";
  const firstItemQty = payload.items && payload.items[0] ? payload.items[0].quantity : 1;

  let statusTitle = "Order Confirmed";
  let statusBadgeClass = "new";
  let statusBadgeLabel = "CONFIRMED";
  let statusMessage = `Thank you for choosing Eternal.<br/><br/>Your order has been successfully received and is now being carefully prepared by our team.`;
  let buttonLabel = "View Order";
  let buttonUrl = "https://eternal.com.pk/dashboard";
  let extraDetailsHtml = "";

  if (status === "under process") {
    statusTitle = "Dispatched";
    statusBadgeClass = "under-process";
    statusBadgeLabel = "ON ITS WAY";
    statusMessage = `Your Eternal order has left our workshop and is now on its journey to you.`;
    buttonLabel = "View Order";
    buttonUrl = "https://eternal.com.pk/dashboard";
    extraDetailsHtml = "";
  } else if (status === "delivered") {
    statusTitle = "Delivered";
    statusBadgeClass = "delivered";
    statusBadgeLabel = "DELIVERED";
    statusMessage = `Your Eternal order has been successfully delivered.<br/><br/>We hope your new pair serves you well on your journey.`;
    buttonLabel = "View Order";
    buttonUrl = "https://eternal.com.pk/dashboard";
    extraDetailsHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; font-size: 13px;">
        <tr class="details-row">
          <td width="40%" style="color: #71717a; padding: 4px 0;">Delivery Status</td>
          <td style="color: #10b981; font-weight: bold; padding: 4px 0;">Completed</td>
        </tr>
        <tr class="details-row">
          <td style="color: #71717a; padding: 4px 0;">Fulfilment Carrier</td>
          <td style="color: #ffffff; font-weight: 500; padding: 4px 0;">Hand Delivered / Courier</td>
        </tr>
      </table>
    `;
  } else if (status === "cancel") {
    statusTitle = "Order Cancelled";
    statusBadgeClass = "cancelled";
    statusBadgeLabel = "CANCELLED";
    statusMessage = `Your Eternal order has been cancelled inside our operational dashboard.<br/><br/>We are sorry we couldn't fulfill your order this time. If you have any queries, feel free to contact us.`;
    buttonLabel = "Continue Shopping";
    buttonUrl = "https://eternal.com.pk";
    extraDetailsHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; font-size: 13px;">
        <tr class="details-row">
          <td width="40%" style="color: #71717a; padding: 4px 0;">Cancellation Status</td>
          <td style="color: #ef4444; font-weight: bold; padding: 4px 0;">Voided</td>
        </tr>
      </table>
    `;
  } else if (status === "refund") {
    statusTitle = "Refund Confirmed";
    statusBadgeClass = "refund";
    statusBadgeLabel = "REFUND PROCESSED";
    statusMessage = `Your refund request has been completed successfully.<br/><br/>The refund amount has been credited back to your original payment method. Thank you for your patience and for choosing Eternal.`;
    buttonLabel = "View Receipt";
    buttonUrl = "https://eternal.com.pk/dashboard";
    extraDetailsHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; font-size: 13px;">
        <tr class="details-row">
          <td width="40%" style="color: #71717a; padding: 4px 0;">Refund Amount</td>
          <td style="color: #a78bfa; font-weight: bold; padding: 4px 0;">${payload.totalPrice}</td>
        </tr>
        <tr class="details-row">
          <td style="color: #71717a; padding: 4px 0;">Refund Method</td>
          <td style="color: #ffffff; font-weight: 500; padding: 4px 0;">Bank Transfer</td>
        </tr>
        <tr class="details-row">
          <td style="color: #71717a; padding: 4px 0;">Processed Date</td>
          <td style="color: #ffffff; font-weight: 500; padding: 4px 0;">${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
      </table>
    `;
  } else if (status === "exchange") {
    statusTitle = "Exchange Confirmed";
    statusBadgeClass = "exchange";
    statusBadgeLabel = "EXCHANGE APPROVED";
    statusMessage = `Your exchange request has been approved and is currently in progress.<br/><br/>Our team is preparing to ship your requested item, and our courier agent will handle a reverse pickup of the original pair. Thank you for choosing Eternal.`;
    buttonLabel = "Track Exchange";
    buttonUrl = "https://eternal.com.pk/dashboard";
    extraDetailsHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; font-size: 13px;">
        <tr class="details-row">
          <td width="40%" style="color: #71717a; padding: 4px 0;">Original product</td>
          <td style="color: #ffffff; font-weight: 500; padding: 4px 0;">${firstItemName}</td>
        </tr>
        <tr class="details-row">
          <td style="color: #71717a; padding: 4px 0;">Original Size</td>
          <td style="color: #71717a; padding: 4px 0;">${firstItemSize}</td>
        </tr>
        <tr class="details-row">
          <td style="color: #71717a; padding: 4px 0;">Requested Size</td>
          <td style="color: #22d3ee; font-weight: bold; padding: 4px 0;">${firstItemSize}</td>
        </tr>
        <tr class="details-row">
          <td style="color: #71717a; padding: 4px 0;">Exchange Status</td>
          <td style="color: #22d3ee; font-weight: bold; padding: 4px 0;">Approved & Preparing</td>
        </tr>
      </table>
    `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternal Order Status Update - Eternal</title>
  <style>
    body { background-color: #0c0a09; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; min-height: 100vh; }
    .outer-table { background-image: url('https://images.unsplash.com/photo-1592844001374-ba7fbddf2fe2?auto=format&fit=crop&w=1200&q=80&blur=85'); background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%; min-height: 100vh; padding: 40px 10px; background-color: #0c0a09; }
    .glass-card { max-width: 580px; width: 100%; background-color: rgba(9, 9, 11, 0.94); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7); overflow: hidden; padding: 44px 32px; box-sizing: border-box; text-align: left; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
    .logo { font-size: 11px; letter-spacing: 0.45em; color: #f59e0b; text-transform: uppercase; font-weight: 600; text-align: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); padding-bottom: 18px; }
    .heading-title { font-size: 26px; color: #ffffff; text-align: center; font-weight: 300; margin: 0 0 10px 0; letter-spacing: -0.01em; }
    .greeting-text { font-size: 14px; color: #a1a1aa; text-align: center; line-height: 1.6; margin: 0 0 28px 0; }
    
    /* Modern status update box */
    .status-card { margin-top: 24px; margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden; background-color: rgba(255, 255, 255, 0.01); }
    .status-header { padding: 22px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .status-badge { display: inline-block; font-size: 10px; font-weight: 600; font-family: monospace; letter-spacing: 0.25em; text-transform: uppercase; padding: 5px 14px; border-radius: 3px; margin-bottom: 10px; }
    .status-badge.new { background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .status-badge.under-process { background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .status-badge.delivered { background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-badge.cancelled { background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; }
    .status-badge.refund { background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); color: #a78bfa; }
    .status-badge.exchange { background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); color: #22d3ee; }
    .status-explanation { font-size: 13px; line-height: 1.6; color: #fafafa; font-weight: 300; margin: 0; }
    
    .status-timeline { padding: 20px 24px; background-color: rgba(0, 0, 0, 0.2); }
    .timeline-step { font-size: 11px; line-height: 1.6; margin-bottom: 10px; color: #71717a; font-family: monospace; }
    .timeline-step.active { color: #ffffff; font-weight: bold; }
    .timeline-bullet { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 12px; vertical-align: middle; background-color: #52525b; }
    .timeline-step.active .timeline-bullet { background-color: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
    .timeline-step.completed .timeline-bullet { background-color: #34d399; }
    
    .section-title { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #f59e0b; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin: 24px 0 16px 0; }
    .details-box { margin-top: 24px; margin-bottom: 24px; padding: 20px; background-color: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 4px; }
    .details-row td { padding: 3px 0; font-size: 12px; line-height: 1.6; vertical-align: top; }
    .footer-section { text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 24px; margin-top: 16px; }
    .social-link { display: inline-block; margin: 0 12px; color: #a1a1aa; text-decoration: none; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
    .social-link img { vertical-align: middle; margin-right: 6px; filter: invert(0.85); display: inline-block; }
    
    .cta-btn { display: inline-block; background-color: #f59e0b; color: #000000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 12px 28px; border-radius: 3px; margin: 24px 0 8px 0; text-align: center; }
    .cta-container { text-align: center; }
  </style>
</head>
<body>
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-table">
    <tr>
      <td align="center" valign="top">
        <div class="glass-card">
          <div class="logo">ETERNAL</div>
          <h1 class="heading-title">${statusTitle}</h1>
          <p class="greeting-text">Hello ${payload.customerName || "Customer"},</p>
          
          <div class="status-card">
            <div class="status-header">
              <span class="status-badge ${statusBadgeClass}">${statusBadgeLabel}</span>
              <p class="status-explanation">${statusMessage}</p>
              ${extraDetailsHtml}
            </div>
            <div class="status-timeline">
              <div class="timeline-step ${status === "new" ? "active" : "completed"}">
                <span class="timeline-bullet"></span> ORDER RECEIVED & PREPARING
              </div>
              <div class="timeline-step ${status === "under process" ? "active" : (status === "delivered" || status === "refund" || status === "exchange" ? "completed" : "")}">
                <span class="timeline-bullet"></span> DISPATCH & IN TRANSIT
              </div>
              <div class="timeline-step ${status === "delivered" ? "active" : (status === "refund" || status === "exchange" ? "completed" : "")}">
                <span class="timeline-bullet"></span> DELIVERED
              </div>
              ${status === "refund" ? `
              <div class="timeline-step active" style="color: #c084fc;">
                <span class="timeline-bullet" style="background-color: #a78bfa; box-shadow: 0 0 8px #a78bfa;"></span> REFUND COMPLETED
              </div>` : ""}
              ${status === "exchange" ? `
              <div class="timeline-step active" style="color: #22d3ee;">
                <span class="timeline-bullet" style="background-color: #22d3ee; box-shadow: 0 0 8px #22d3ee;"></span> EXCHANGE IN PROGRESS
              </div>` : ""}
              ${status === "cancel" ? `
              <div class="timeline-step active" style="color: #f87171;">
                <span class="timeline-bullet" style="background-color: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> ORDER VOIDED & CANCELLED
              </div>` : ""}
            </div>
          </div>
          
          <div class="section-title">Enclosed Specifications</div>
          
          ${payload.items ? payload.items.map(item => `
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px;">
            <tr>
              <td style="vertical-align: middle; text-align: left;">
                <div style="font-size: 13px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${item.name}</div>
                <div style="font-size: 11px; color: #71717a;">${displaySize(item.size)} &bull; Qty: ${item.quantity}</div>
              </td>
              <td width="100" style="vertical-align: middle; text-align: right; font-size: 13px; font-weight: 600; color: #ffffff;">
                ${item.price}
              </td>
            </tr>
          </table>
          `).join("") : ""}

          <div class="details-box">
            <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #a1a1aa; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">Consignment Info</div>
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr class="details-row">
                <td width="30%" style="color: #71717a;">Order ID</td>
                <td style="color: #ffffff; font-weight: bold; font-family: monospace;">${payload.orderId}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Name</td>
                <td style="color: #ffffff; font-weight: 500;">${payload.customerName}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Destination</td>
                <td style="color: #ffffff; font-weight: 500;">${payload.customerAddress}</td>
              </tr>
            </table>
          </div>

          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-bottom: 32px;">
            <tr>
              <td style="font-size: 13px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: middle;">Total Value (COD)</td>
              <td style="font-size: 18px; color: #f59e0b; font-weight: 700; text-align: right; vertical-align: middle;">${payload.totalPrice}</td>
            </tr>
          </table>

          <div class="footer-section">
            <div style="margin-bottom: 20px;">
              <a href="https://www.facebook.com/eternal.com.pk" target="_blank" class="social-link">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="14" height="14" alt="Facebook" />
                Facebook
              </a>
              <a href="https://www.instagram.com/eternal.com.pk" target="_blank" class="social-link">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="14" height="14" alt="Instagram" />
                Instagram
              </a>
            </div>
            <p style="font-size: 11px; color: #71717a; margin: 0 0 8px 0; letter-spacing: 0.05em; text-transform: uppercase;">
              For Enquiry: <a href="mailto:savortheluxury@gmail.com" style="color: #f59e0b; text-decoration: none; font-weight: bold;">savortheluxury@gmail.com</a>
            </p>
            <p style="font-size: 10px; color: #52525b; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">
              &copy; 2026 ETERNAL. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function handleSendStatusEmail(order, status) {
  try {
    const payload = order;
    if (!payload?.customerEmail || !payload?.items) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Incomplete order parameters.",
        },
      };
    }

    const clientEmail = payload.customerEmail;
    const emailHtml = getStatusEmailHtml(payload, status);

    let smtpUser = (process.env.SMTP_USER || "savortheluxury@gmail.com").trim();
    let smtpPass = (process.env.SMTP_PASS || "").trim();
    let smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    let smtpPort = Number(process.env.SMTP_PORT) || 465;
    let smtpSecure = process.env.SMTP_SECURE !== "false";
    let smtpSender = (process.env.SMTP_SENDER || smtpUser).trim();

    if (smtpHost.includes("gmail.com") && smtpPass.replace(/\s+/g, "").length === 16) {
      smtpPass = smtpPass.replace(/\s+/g, "");
    }

    const secureSmtpConfigured = !!smtpPass;
    let clientMailSent = false;
    let clientMailError = null;
    let sendingMethodsAttempted = [];

    if (secureSmtpConfigured) {
      const strategies = [];

      if (smtpHost.includes("gmail.com") || smtpUser.includes("@gmail.com")) {
        strategies.push({
          name: "Gmail Service (Direct Integration API)",
          config: {
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          }
        });
      }

      strategies.push({
        name: `SMTP Standard SSL (Host: ${smtpHost}, Port: 465)`,
        config: {
          host: smtpHost,
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }
      });

      strategies.push({
        name: `SMTP STARTTLS (Host: ${smtpHost}, Port: 587)`,
        config: {
          host: smtpHost,
          port: 587,
          secure: false,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }
      });

      for (const strategy of strategies) {
        if (clientMailSent) {
          break;
        }

        console.log(`[Status Email Dispatcher] Attempting delivery using strategy: ${strategy.name}`);
        sendingMethodsAttempted.push(strategy.name);

        try {
          const transporter = nodemailer.createTransport(strategy.config);
          await transporter.verify();

          try {
            await transporter.sendMail({
              from: `"Eternal" <${smtpSender}>`,
              to: clientEmail,
              subject: `Order Update [ID: ${payload.orderId}] - Eternal`,
              html: emailHtml,
            });
            clientMailSent = true;
            clientMailError = null;
            console.log(`[Status Email Dispatcher] Success: Status email sent to ${clientEmail}`);
          } catch (clientErr) {
            console.error(`[Status Email Dispatcher] Status email dispatch failed (${clientEmail}):`, clientErr);
            clientMailError = clientErr.message || String(clientErr);
          }
        } catch (connErr) {
          console.warn(`[Status Email Dispatcher] Connection failure on strategy (${strategy.name}):`, connErr.message || connErr);
          clientMailError = connErr.message || String(connErr);
        }
      }
    } else {
      console.warn(
        `[Status Email Dispatcher] Order ${payload.orderId}: SMTP_PASS is empty. Status email bypassed.`
      );
    }

    return {
      status: 200,
      body: {
        success: true,
        message: clientMailSent
          ? `Status update email sent to ${clientEmail} successfully.`
          : "Status updated. Delivery email pending system authentication.",
        emailDetails: {
          secureSmtpConfigured,
          clientMailSent,
          clientMailError,
          sendingMethodsAttempted
        }
      }
    };
  } catch (err) {
    console.error("[Status Email Dispatch Error]", err);
    return {
      status: 500,
      body: {
        success: false,
        error: "Internal failure dispatching status email.",
      }
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
