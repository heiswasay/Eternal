import { syncOrderStatusToSheet } from "./google-sheets.js";

export async function POST(request) {
  try {
    const { orderId, status } = await request.json();
    const result = await syncOrderStatusToSheet(orderId, status);
    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error("[api/sync-sheets-status] Unhandled error:", err);
    return Response.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
