import { google } from "googleapis";

/**
 * Appends order details to the specified Google Spreadsheet
 * ID: 1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s
 */
export async function appendOrderToSheet(order) {
  const spreadsheetId = "1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s";

  // Format timestamp (GMT +0/UTC)
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  // Format items ordered cleanly
  const itemsList = order.items
    .map(item => `${item.name} (${item.size ? "EU " + item.size : "N/A"}) x${item.quantity}`)
    .join(", ");

  const rowValues = [
    timestamp,
    order.orderId || "",
    order.customerName || "",
    order.customerEmail || "",
    order.customerPhone || "",
    order.customerAddress || "",
    itemsList,
    order.totalPrice || "",
    order.notes || "",
    order.paymentMethod || "Cash on Delivery"
  ];

  // Method 1: Google Sheets Apps Script Web App URL (Highly Popular & Simple)
  if (process.env.GOOGLE_SHEETS_WEBAPP_URL) {
    try {
      console.log("[Google Sheets] Attempting to append via Web App URL...");
      const response = await fetch(process.env.GOOGLE_SHEETS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId,
          timestamp,
          orderId: order.orderId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          items: itemsList,
          totalPrice: order.totalPrice,
          notes: order.notes,
          paymentMethod: order.paymentMethod || "Cash on Delivery",
          rowValues: rowValues
        })
      });
      if (response.ok) {
        console.log("[Google Sheets] Successfully appended order via Apps Script Web App.");
        return { success: true, method: "webapp" };
      }
      console.warn("[Google Sheets] Web App returned non-ok status:", response.status);
    } catch (webappErr) {
      console.error("[Google Sheets] Failed to append via Web App URL:", webappErr);
    }
  }

  // Method 2: Service Account JWT Authentication
  let auth;
  const saKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (saKeyJson) {
    try {
      const keys = JSON.parse(saKeyJson);
      auth = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
    } catch (parseErr) {
      console.error("[Google Sheets] Could not parse GOOGLE_SERVICE_ACCOUNT_KEY JSON:", parseErr);
    }
  } else if (clientEmail && privateKey) {
    try {
      const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
      auth = new google.auth.JWT(
        clientEmail,
        null,
        formattedPrivateKey,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
    } catch (authErr) {
      console.error("[Google Sheets] Could not build JWT Auth with Client Email & Private Key:", authErr);
    }
  }

  if (auth) {
    try {
      console.log("[Google Sheets] Attempting to append via Service Account JWT auth...");
      const sheets = google.sheets({ version: "v4", auth });
      
      let response;
      try {
        // Appending to Sheet1 by default
        response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Sheet1!A:J",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [rowValues],
          },
        });
      } catch (rangeErr) {
        // Fallback to default generic append range in case 'Sheet1' does not exist by that name
        console.warn("[Google Sheets] Range 'Sheet1!A:J' failed, attempting generic range 'A:J'...");
        response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "A:J",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [rowValues],
          },
        });
      }

      if (response && response.status === 200) {
        console.log("[Google Sheets] Successfully appended order via Service Account values.append API.");
        return { success: true, method: "service_account" };
      }
    } catch (saErr) {
      console.error("[Google Sheets] Failed to append via Service Account:", saErr);
    }
  }

  // Fallback Console Log for Local Execution / Verification without credentials
  console.log("--------------------------------------------------");
  console.log(`📊 GOOGLE SHEETS LIVE LOG: APPEND_ORDER_DATA`);
  console.log(`SPREADSHEET ID: ${spreadsheetId}`);
  console.log(`ORDER ID: ${order.orderId}`);
  console.log(`DATA ROW: ${JSON.stringify(rowValues)}`);
  console.log(`STATUS: Service credentials not specified in .env yet.`);
  console.log("--------------------------------------------------");

  return { success: false, reason: "credentials_not_configured" };
}
