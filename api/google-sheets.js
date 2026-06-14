import { google } from "googleapis";

/**
 * Appends order details to the specified Google Spreadsheet
 * ID: 1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s
 */
export async function appendOrderToSheet(order) {
  const spreadsheetId = "1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s";

  // Format timestamp (GMT +0/UTC)
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

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

  // Format items ordered cleanly
  const itemsList = order.items
    .map(item => `${item.name} (${displaySize(item.size)}) x${item.quantity}`)
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
      const responseText = await response.text();
      console.warn("[Google Sheets] Web App returned non-ok status:", response.status, responseText);
      return { success: false, reason: "webapp_non_ok_status", status: response.status, responseText };
    } catch (webappErr) {
      console.error("[Google Sheets] Failed to append via Web App URL:", webappErr);
      return { success: false, reason: "webapp_error", error: webappErr.message || String(webappErr) };
    }
  }

  // Method 2: Service Account JWT Authentication
  let auth;
  const saKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Track the configuration states for diagnostics
  const diagnostics = {
    has_saKeyJson: !!saKeyJson,
    saKeyJson_is_raw_email: !!(saKeyJson && saKeyJson.includes("@") && !saKeyJson.trim().startsWith("{")),
    saKeyJson_startsWith_curly: !!(saKeyJson && saKeyJson.trim().startsWith("{")),
    has_clientEmail: !!clientEmail,
    has_privateKey: !!privateKey,
    has_webappUrl: !!process.env.GOOGLE_SHEETS_WEBAPP_URL,
    using_fallback: false
  };

  if (saKeyJson && saKeyJson.trim().startsWith("{")) {
    try {
      const keys = JSON.parse(saKeyJson.trim());
      let pk = keys.private_key;
      if (pk) {
        // Clean and prepare the private key
        pk = pk.trim();
        if (pk.startsWith('"') && pk.endsWith('"')) {
          pk = pk.substring(1, pk.length - 1);
        }
        pk = pk.replace(/\\n/g, "\n");
      }
      auth = new google.auth.JWT(
        keys.client_email,
        null,
        pk,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      clientEmail = keys.client_email;
    } catch (parseErr) {
      console.error("[Google Sheets] Could not parse GOOGLE_SERVICE_ACCOUNT_KEY JSON:", parseErr);
      return { success: false, reason: "json_parse_error", error: parseErr.message || String(parseErr), diagnostics };
    }
  }

  // Fallback: If JWT wasn't loaded from JSON block, try using separate GOOGLE_CLIENT_EMAIL / Client Email in saKeyJson and GOOGLE_PRIVATE_KEY
  if (!auth) {
    let effectiveEmail = clientEmail;
    
    // Auto-detect if saKey = email address
    if (saKeyJson && saKeyJson.includes("@") && !saKeyJson.trim().startsWith("{")) {
      console.log("[Google Sheets] GOOGLE_SERVICE_ACCOUNT_KEY does not appear to be JSON, but contains '@'. Treating as service account email.");
      effectiveEmail = saKeyJson.trim();
    }

    if (effectiveEmail && privateKey) {
      try {
        diagnostics.using_fallback = true;
        // Clean up private key (handle wrapped quotes, raw \n, literal \n, etc.)
        let formattedPrivateKey = privateKey.trim();
        if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
          formattedPrivateKey = formattedPrivateKey.substring(1, formattedPrivateKey.length - 1);
        }
        if (formattedPrivateKey.startsWith("'") && formattedPrivateKey.endsWith("'")) {
          formattedPrivateKey = formattedPrivateKey.substring(1, formattedPrivateKey.length - 1);
        }
        formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, "\n");

        auth = new google.auth.JWT(
          effectiveEmail.trim(),
          null,
          formattedPrivateKey,
          ["https://www.googleapis.com/auth/spreadsheets"]
        );
        clientEmail = effectiveEmail;
        console.log("[Google Sheets] Setup JWT authentication using fallback email/private-key combination.");
      } catch (authErr) {
        console.error("[Google Sheets] Could not build JWT Auth with Client Email & Private Key:", authErr);
        return { success: false, reason: "auth_build_error", error: authErr.message || String(authErr), diagnostics };
      }
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
        return { success: true, method: "service_account", clientEmail };
      }
    } catch (saErr) {
      console.error("[Google Sheets] Failed to append via Service Account:", saErr);
      return {
        success: false,
        reason: "google_api_rejection",
        error: saErr.message || String(saErr),
        details: saErr.response?.data?.error || null,
        clientEmailUsed: clientEmail || "not_found",
        diagnostics
      };
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

  return { success: false, reason: "credentials_not_configured", diagnostics };
}
