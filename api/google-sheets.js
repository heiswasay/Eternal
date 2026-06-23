import { google } from "googleapis";

/**
 * Appends order details to the specified Google Spreadsheet
 * ID: 1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s
 */
export async function appendOrderToSheet(order) {
  let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || "1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s";
  let webappUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL ? process.env.GOOGLE_SHEETS_WEBAPP_URL.trim() : "";

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
    order.paymentMethod || "Cash on Delivery",
    order.status || "new"
  ];

  let webappWarning = null;
  let webappErrorDetails = null;

  // Helper check for placeholders
  const isPlaceholder = (val) => {
    if (!val) return true;
    const clean = String(val).trim();
    if (clean === "") return true;
    const lower = clean.toLowerCase();
    return (
      lower.startsWith("your_") ||
      lower.startsWith("placeholder") ||
      lower === "null" ||
      lower === "undefined" ||
      lower.includes("example.com") ||
      lower.includes("your-client-email") ||
      lower.includes("your-private-key")
    );
  };

  // Auto-heal: If user misconfigured by putting the Google Sheet document URL as the WebApp URL
  if (webappUrl) {
    const sheetUrlMatch = webappUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetUrlMatch) {
      const extractedId = sheetUrlMatch[1];
      console.warn(`[Google Sheets] Auto-detected Google Sheet Document URL instead of Google Apps Script URL. Extracted Spreadsheet ID: ${extractedId}`);
      webappWarning = "GOOGLE_SHEETS_WEBAPP_URL points to a Google Sheet document instead of a published Google Apps Script Web App (which should end in /exec). Automatically extracted Spreadsheet ID.";
      spreadsheetId = extractedId;
      webappUrl = ""; // Bypass calling fetch on a spreadsheet document URL
    }
  }

  // Method 1: Google Sheets Apps Script Web App URL (Highly Popular & Simple)
  if (webappUrl && !isPlaceholder(webappUrl)) {
    try {
      console.log("[Google Sheets] Attempting to append via Web App URL...");
      const response = await fetch(webappUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "append",
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
          status: order.status || "new",
          rowValues: rowValues
        })
      });

      if (response.ok) {
        console.log("[Google Sheets] Successfully appended order via Apps Script Web App.");
        return { success: true, method: "webapp" };
      }

      const responseText = await response.text();
      console.warn("[Google Sheets] Web App returned non-ok status:", response.status, responseText);
      
      let specificWarning = null;
      if (response.status === 401 || responseText.includes("unable to open") || responseText.includes("Page not found")) {
        specificWarning = "WebApp returned 401 / Not Found. This typically means the Apps Script was not deployed with authorization level 'Execute as: Me' and access scope 'Who has access: Anyone' (allowing anonymous submissions).";
      }

      webappErrorDetails = {
        reason: "webapp_non_ok_status",
        status: response.status,
        specificWarning,
        responseText: responseText.substring(0, 300)
      };
    } catch (webappErr) {
      console.error("[Google Sheets] Failed to append via Web App URL:", webappErr);
      webappErrorDetails = {
        reason: "webapp_error",
        error: webappErr.message || String(webappErr)
      };
    }
  }

  // Method 2: Service Account JWT Authentication (Run as fallback if WebApp fails or is bypassed)
  let auth = null;
  const saKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  let effectiveEmail = "";
  let cleanPrivateKey = "";

  // 1. Load from Service Account JSON key if present and not placeholder
  if (saKeyJson && saKeyJson.trim().startsWith("{") && !isPlaceholder(saKeyJson)) {
    try {
      const keys = JSON.parse(saKeyJson.trim());
      effectiveEmail = keys.client_email || "";
      cleanPrivateKey = keys.private_key || "";
    } catch (parseErr) {
      console.error("[Google Sheets] Could not parse GOOGLE_SERVICE_ACCOUNT_KEY JSON:", parseErr);
    }
  }

  // 2. Fallback to direct variables
  if (!effectiveEmail || isPlaceholder(effectiveEmail)) {
    effectiveEmail = clientEmail || "";
  }
  // Auto-detect if saKeyJson contains email format but not curly brace
  if ((!effectiveEmail || isPlaceholder(effectiveEmail)) && saKeyJson && saKeyJson.includes("@") && !saKeyJson.trim().startsWith("{")) {
    effectiveEmail = saKeyJson.trim();
  }

  if (!cleanPrivateKey || isPlaceholder(cleanPrivateKey)) {
    cleanPrivateKey = privateKey || "";
  }

  // 3. Format key formatting cleanly
  if (cleanPrivateKey) {
    cleanPrivateKey = cleanPrivateKey.trim();
    if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
      cleanPrivateKey = cleanPrivateKey.substring(1, cleanPrivateKey.length - 1);
    }
    if (cleanPrivateKey.startsWith("'") && cleanPrivateKey.endsWith("'")) {
      cleanPrivateKey = cleanPrivateKey.substring(1, cleanPrivateKey.length - 1);
    }
    cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, "\n");
  }

  // 4. Validate credentials before trying to create JWT clients to prevent standard credential errors
  const isValidEmail = effectiveEmail && effectiveEmail.includes("@") && !isPlaceholder(effectiveEmail);
  const isValidPrivateKey = cleanPrivateKey && cleanPrivateKey.includes("-----BEGIN PRIVATE KEY-----") && !isPlaceholder(cleanPrivateKey);

  const diagnostics = {
    has_saKeyJson: !!saKeyJson,
    has_clientEmail: !!clientEmail,
    has_privateKey: !!privateKey,
    has_webappUrl: !!process.env.GOOGLE_SHEETS_WEBAPP_URL,
    isValidEmail: !!isValidEmail,
    isValidPrivateKey: !!isValidPrivateKey,
    using_fallback: !isPlaceholder(privateKey) || !isPlaceholder(clientEmail),
    webappWarning,
    webappErrorDetails
  };

  if (isValidEmail && isValidPrivateKey) {
    try {
      auth = new google.auth.JWT(
        effectiveEmail.trim(),
        null,
        cleanPrivateKey,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      clientEmail = effectiveEmail;
      console.log("[Google Sheets] Built Google JWT Auth wrapper successfully.");
    } catch (jwtBuildErr) {
      console.error("[Google Sheets] Invalid keys format for JWT constructor:", jwtBuildErr);
    }
  } else {
    console.log("[Google Sheets] Skipping Service Account API: credentials are placeholders, empty, or missing -----BEGIN PRIVATE KEY----- header.");
  }

  if (auth) {
    try {
      console.log("[Google Sheets] Attempting to append via Service Account JWT auth...");
      const sheets = google.sheets({ version: "v4", auth });
      
      let response;
      try {
        response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Sheet1!A:K",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [rowValues],
          },
        });
      } catch (rangeErr) {
        console.warn("[Google Sheets] Range 'Sheet1!A:K' failed or Sheet1 name unrecognized, attempting generic sheet range 'A:K'...");
        response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "A:K",
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

  // Fallback / Guidance message
  let errorMsg = "Sheets credentials not active. Please configure the GOOGLE_SHEETS_WEBAPP_URL WebApp or provide set up Service Account credentials.";
  
  if (webappWarning) {
    errorMsg = `Spreadsheet ID extracted from GOOGLE_SHEETS_WEBAPP_URL, but no active Service Account setup exists. Detail: ${webappWarning}`;
  } else if (webappErrorDetails) {
    if (webappErrorDetails.specificWarning) {
      errorMsg = webappErrorDetails.specificWarning;
    } else {
      errorMsg = `Google Apps Script returned status ${webappErrorDetails.status || "error"}. Please make sure your Apps Script Web App is redeployed correctly as 'Anyone' can access.`;
    }
  }

  console.log("--------------------------------------------------");
  console.log(`📊 GOOGLE SHEETS LIVE LOG: APPEND_ORDER_DATA`);
  console.log(`SPREADSHEET ID: ${spreadsheetId}`);
  console.log(`ORDER ID: ${order.orderId}`);
  console.log(`DATA ROW: ${JSON.stringify(rowValues)}`);
  console.log(`WARN DETAILS: ${errorMsg}`);
  console.log("--------------------------------------------------");

  return { 
    success: false, 
    reason: (webappWarning || webappErrorDetails?.specificWarning) ? "webapp_misconfiguration" : "credentials_not_configured_or_failed", 
    diagnostics,
    message: errorMsg
  };
}

/**
 * Searches the Sheet's column B for a matching orderId and updates column K with the new status
 */
export async function syncOrderStatusToSheet(orderId, status) {
  if (!orderId) {
    console.error("[Google Sheets Update] Missing Order ID.");
    return { success: false, reason: "missing_order_id" };
  }

  let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || "1ertgMyPoqyMSwv2Zj9xA-MoaCCP1ry-XGncK-5X5q9s";
  let webappUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL ? process.env.GOOGLE_SHEETS_WEBAPP_URL.trim() : "";

  // Helper check for placeholders
  const isPlaceholder = (val) => {
    if (!val) return true;
    const clean = String(val).trim();
    if (clean === "") return true;
    const lower = clean.toLowerCase();
    return (
      lower.startsWith("your_") ||
      lower.startsWith("placeholder") ||
      lower === "null" ||
      lower === "undefined" ||
      lower.includes("example.com") ||
      lower.includes("your-client-email") ||
      lower.includes("your-private-key")
    );
  };

  if (webappUrl) {
    const sheetUrlMatch = webappUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetUrlMatch) {
      spreadsheetId = sheetUrlMatch[1];
      webappUrl = "";
    }
  }

  // Method 1: Web App URL update trigger
  if (webappUrl && !isPlaceholder(webappUrl)) {
    try {
      console.log("[Google Sheets Update] Signaling status change via Web App URL...");
      const response = await fetch(webappUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          spreadsheetId,
          orderId,
          status
        })
      });

      if (response.ok) {
        console.log("[Google Sheets Update] Successfully sent status update via Apps Script Web App.");
        return { success: true, method: "webapp" };
      }
    } catch (webappErr) {
      console.error("[Google Sheets Update] Web App status call failed:", webappErr);
    }
  }

  // Method 2: Service Account direct values.update API call
  let auth = null;
  const saKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  let effectiveEmail = "";
  let cleanPrivateKey = "";

  if (saKeyJson && saKeyJson.trim().startsWith("{") && !isPlaceholder(saKeyJson)) {
    try {
      const keys = JSON.parse(saKeyJson.trim());
      effectiveEmail = keys.client_email || "";
      cleanPrivateKey = keys.private_key || "";
    } catch (parseErr) {
      console.error("[Google Sheets Update] Error parsing GOOGLE_SERVICE_ACCOUNT_KEY:", parseErr);
    }
  }

  if (!effectiveEmail || isPlaceholder(effectiveEmail)) {
    effectiveEmail = clientEmail || "";
  }
  if ((!effectiveEmail || isPlaceholder(effectiveEmail)) && saKeyJson && saKeyJson.includes("@") && !saKeyJson.trim().startsWith("{")) {
    effectiveEmail = saKeyJson.trim();
  }

  if (!cleanPrivateKey || isPlaceholder(cleanPrivateKey)) {
    cleanPrivateKey = privateKey || "";
  }

  if (cleanPrivateKey) {
    cleanPrivateKey = cleanPrivateKey.trim();
    if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
      cleanPrivateKey = cleanPrivateKey.substring(1, cleanPrivateKey.length - 1);
    }
    if (cleanPrivateKey.startsWith("'") && cleanPrivateKey.endsWith("'")) {
      cleanPrivateKey = cleanPrivateKey.substring(1, cleanPrivateKey.length - 1);
    }
    cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, "\n");
  }

  const isValidEmail = effectiveEmail && effectiveEmail.includes("@") && !isPlaceholder(effectiveEmail);
  const isValidPrivateKey = cleanPrivateKey && cleanPrivateKey.includes("-----BEGIN PRIVATE KEY-----") && !isPlaceholder(cleanPrivateKey);

  if (isValidEmail && isValidPrivateKey) {
    try {
      auth = new google.auth.JWT(
        effectiveEmail.trim(),
        null,
        cleanPrivateKey,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      clientEmail = effectiveEmail;
    } catch (jwtBuildErr) {
      console.error("[Google Sheets Update] Invalid JWT constructor config:", jwtBuildErr);
    }
  }

  if (auth) {
    try {
      console.log(`[Google Sheets Update] Locating Row for ID "${orderId}" using Service Account...`);
      const sheets = google.sheets({ version: "v4", auth });
      
      let rows = [];
      try {
        const getResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "Sheet1!A:K"
        });
        rows = getResponse.data.values || [];
      } catch (getErr) {
        console.warn("[Google Sheets Update] Sheet1 range failed, reading direct A:K...");
        const getResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "A:K"
        });
        rows = getResponse.data.values || [];
      }

      if (rows && rows.length > 0) {
        let rowIndex = -1;
        // Search Column B (index 1) for Order ID match
        for (let i = 0; i < rows.length; i++) {
          if (rows[i] && rows[i][1] && String(rows[i][1]).trim() === String(orderId).trim()) {
            rowIndex = i + 1; // Convert to 1-based Row coordinate
            break;
          }
        }

        if (rowIndex !== -1) {
          console.log(`[Google Sheets Update] Sheet order match at row ${rowIndex}. Mutating Column K to: "${status}".`);
          
          let rangeToUse = `Sheet1!K${rowIndex}`;
          try {
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: rangeToUse,
              valueInputOption: "RAW",
              requestBody: {
                values: [[status]]
              }
            });
          } catch (updateErr) {
            console.warn(`[Google Sheets Update] Standard range failed, writing cell K${rowIndex}...`);
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `K${rowIndex}`,
              valueInputOption: "RAW",
              requestBody: {
                values: [[status]]
              }
            });
          }

          console.log(`[Google Sheets Update] Row ${rowIndex} successfully synchronized to status: "${status}"`);
          return { success: true, method: "service_account", row: rowIndex };
        } else {
          console.warn(`[Google Sheets Update] Order ID "${orderId}" has no matching row found in the connected sheet.`);
          return { success: false, reason: "order_not_found_in_sheet" };
        }
      } else {
        return { success: false, reason: "spreadsheet_empty" };
      }
    } catch (saErr) {
      console.error("[Google Sheets Update] Sync rejected by Google API:", saErr);
      return {
        success: false,
        reason: "credentials_rejected",
        error: saErr.message || String(saErr)
      };
    }
  }

  console.log(`📊 [Google Sheets Offline Run] Status synced locally. Please link Service Account JSON credential or Google WebApp to sync directly to Spreadsheet. Order: ${orderId} -> ${status}`);
  return { success: false, reason: "offline_fallback_active" };
}
