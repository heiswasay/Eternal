import { handleSendStatusEmail } from "./send-order-email.js";

export async function POST(request) {
  try {
    const { order, status } = await request.json();
    const result = await handleSendStatusEmail(order, status);
    return Response.json(result.body, { status: result.status });
  } catch (err) {
    console.error("[api/send-status-email] Unhandled error:", err);
    return Response.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
