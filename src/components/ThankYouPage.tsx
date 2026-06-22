import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Truck, 
  Receipt, 
  Home, 
  Calendar, 
  Clipboard,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Lock
} from "lucide-react";

interface OrderedItem {
  name: string;
  size: string;
  quantity: number;
  price: string;
  image: string;
}

interface OrderSummary {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderedItem[];
  totalPrice: string;
  paymentMethod: string;
  notes?: string;
  sheetsSyncStatus?: {
    success: boolean;
    method?: string;
    reason?: string;
    error?: string;
    details?: any;
    clientEmailUsed?: string;
    diagnostics?: {
      has_saKeyJson: boolean;
      saKeyJson_is_raw_email: boolean;
      saKeyJson_startsWith_curly: boolean;
      has_clientEmail: boolean;
      has_privateKey: boolean;
      has_webappUrl: boolean;
      using_fallback: boolean;
    };
  } | null;
}

export const ThankYouPage: React.FC = () => {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const navigate = useNavigate();

  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("latest_eternal_order");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrder(parsed);
        if (parsed.sheetsSyncStatus) {
          setSyncStatus(parsed.sheetsSyncStatus);
        }
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const handleRetrySync = async () => {
    if (!order) return;
    setIsRetrying(true);
    try {
      const resp = await fetch("/api/test-sheets-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (resp.ok) {
        const result = await resp.json();
        setSyncStatus(result);
        
        // Save back to localStorage so the state persists nicely
        const updatedOrder = {
          ...order,
          sheetsSyncStatus: result
        };
        localStorage.setItem("latest_eternal_order", JSON.stringify(updatedOrder));
        setOrder(updatedOrder);
      } else {
        const errText = await resp.text();
        setSyncStatus({
          success: false,
          reason: "connection_error",
          error: `HTTP ${resp.status}: ${errText}`
        });
      }
    } catch (err: any) {
      setSyncStatus({
        success: false,
        reason: "fetch_thrown_exception",
        error: err.message || String(err)
      });
    } finally {
      setIsRetrying(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
        <span className="text-sm text-zinc-500 animate-pulse">
          Loading order receipt...
        </span>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    alert(`Order ID copied: ${order.orderId}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20 px-6 md:px-12 lg:px-24">
      {/* Background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Section */}
        <div className="text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center text-emerald-400 mb-4"
          >
            <ShieldCheck size={28} />
          </motion.div>

          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-semibold">
            Order Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-normal text-white mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-lg font-light leading-relaxed">
            We have received your order and we are starting to process it now. Below are your order info and details.
          </p>
        </div>

        {/* SECTION 1: ORDER DETAILS GIVEN FIRST */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-white border-b border-white/10 pb-2">
            Order Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Information Summary card */}
            <div className="border border-white/10 bg-zinc-900/10 p-6 rounded-md space-y-4">
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider border-b border-white/5 pb-2">
                Your Shipping Info
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-xs font-medium">Order Number</span>
                  <div className="flex items-center justify-between text-white font-mono">
                    <span>{order.orderId}</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-1 border border-white/10 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Order ID"
                    >
                      <Clipboard size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 border-t border-white/5 pt-2">
                  <span className="text-zinc-500 text-xs">Name</span>
                  <span className="text-white font-medium">{order.customerName}</span>
                </div>

                <div className="flex flex-col gap-0.5 border-t border-white/5 pt-2">
                  <span className="text-zinc-500 text-xs">Phone Number</span>
                  <span className="text-white font-medium">{order.customerPhone}</span>
                </div>

                <div className="flex flex-col gap-0.5 border-t border-white/5 pt-2">
                  <span className="text-zinc-500 text-xs">Email Address</span>
                  <span className="text-white font-medium">{order.customerEmail}</span>
                </div>

                <div className="flex flex-col gap-0.5 border-t border-white/5 pt-2">
                  <span className="text-zinc-500 text-xs">Delivery Address</span>
                  <span className="text-white leading-relaxed">{order.customerAddress}</span>
                </div>

                {order.notes && (
                  <div className="flex flex-col gap-0.5 border-t border-white/5 pt-2">
                    <span className="text-zinc-500 text-xs">Your Notes</span>
                    <span className="text-zinc-300 italic">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Statement item sheet */}
            <div className="border border-white/10 bg-zinc-900/10 p-6 rounded-md flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider border-b border-white/5 pb-2 mb-4">
                  Items Ordered
                </h3>

                <div className="divide-y divide-white/5 space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {order.items.map((item, index) => (
                    <div key={index} className={`flex gap-3 pt-3 ${index === 0 ? "pt-0" : ""}`}>
                      <div className="w-12 h-16 bg-zinc-950 border border-white/10 shrink-0 overflow-hidden rounded">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="text-sm text-white font-medium leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-zinc-500">
                            Size: {(() => {
                              const num = parseInt(item.size, 10);
                              if (!isNaN(num) && num >= 35) {
                                return `EU ${item.size}`;
                              }
                              return `US ${item.size}`;
                            })()} &times; {item.quantity}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-300 font-medium text-right mt-1 font-mono">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Price of Items</span>
                  <span className="text-zinc-200">{order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="h-px bg-white/5 my-1" />
                <div className="flex justify-between items-end font-bold pt-1">
                  <span className="text-white text-sm">Total Amount to Pay</span>
                  <span className="text-white text-base font-mono">{order.totalPrice}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* GOOGLE SHEETS INTEGRATION CONTROL HUB */}
        <div className="border border-white/10 bg-zinc-900/40 p-6 md:p-8 rounded-md space-y-4 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-white/10 bg-zinc-950 rounded text-amber-500">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-base font-medium text-white">Google Sheets Integration Panel</h3>
                <p className="text-xs text-zinc-400">Atelier's secure order logging ledger diagnostics</p>
              </div>
            </div>

            <button
              onClick={handleRetrySync}
              disabled={isRetrying}
              className="px-4 py-2 border border-white/10 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all text-xs font-medium rounded flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
              <span>{isRetrying ? "Syncing..." : "Test & Retry Sync"}</span>
            </button>
          </div>

          {/* Sync Status Badge details */}
          <div className="space-y-4 text-sm">
            {(!syncStatus || !syncStatus.success) ? (
              <div className="p-4 bg-amber-950/10 border border-amber-500/20 rounded flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 w-full">
                  <span className="font-medium text-amber-400">Sync Status: Failed / Verification Required</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    The automated Google Sheets logging script failed or was skipped. Because of this, this order has not been written to your Google Spreadsheet.
                  </p>
                  
                  {syncStatus && (
                    <div className="mt-3 bg-black/60 p-3 rounded font-mono text-xs text-zinc-400 border border-white/5 max-h-[160px] overflow-auto w-full">
                      <div className="text-amber-500 font-semibold mb-1">Reason: {syncStatus.reason || "unknown"}</div>
                      {syncStatus.message && (
                        <div className="text-zinc-300 mb-2 font-sans text-xs leading-normal bg-zinc-950/40 p-2 rounded border border-white/5 whitespace-pre-line">{syncStatus.message}</div>
                      )}
                      {syncStatus.error && <div className="mb-1 text-rose-400">Error Message: {syncStatus.error}</div>}
                      {syncStatus.details && <div className="mb-1">Details: {JSON.stringify(syncStatus.details)}</div>}
                      {syncStatus.diagnostics && (
                        <div className="mt-2 pt-2 border-t border-white/5 text-[10px] space-y-0.5">
                          <div className="text-zinc-500">DIAGNOSTICS STATE:</div>
                          <div>- has_webappUrl: {syncStatus.diagnostics.has_webappUrl ? "Yes" : "No"}</div>
                          <div>- isValidEmail: {syncStatus.diagnostics.isValidEmail ? "Yes" : "No"}</div>
                          <div>- isValidPrivateKey: {syncStatus.diagnostics.isValidPrivateKey ? "Yes" : "No"}</div>
                          {syncStatus.diagnostics.webappWarning && <div className="text-amber-500">- WebApp Warning: {syncStatus.diagnostics.webappWarning}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded flex items-start gap-3 animate-fade-in">
                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-medium text-emerald-400">Sync Status: Active & Secured</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    This order has been successfully appended to your centralized Google Sheet via standard {syncStatus.method === "webapp" ? "Apps Script WebApp API" : "Google Cloud Service Account API"}.
                  </p>
                  {syncStatus.clientEmail && (
                    <span className="text-[11px] font-mono text-zinc-500 block">Authenticated client: {syncStatus.clientEmail}</span>
                  )}
                </div>
              </div>
            )}

            {/* Instruction Toggle & Panel */}
            <div className="border border-white/5 rounded overflow-hidden">
              <button
                onClick={() => setShowConfigGuide(!showConfigGuide)}
                className="w-full px-4 py-3 bg-zinc-950 hover:bg-zinc-900/60 transition-colors flex items-center justify-between text-xs font-semibold text-zinc-300 uppercase tracking-wider cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info size={14} className="text-amber-500" />
                  <span>How to connect your private Google Sheet</span>
                </span>
                {showConfigGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showConfigGuide && (
                <div className="p-5 md:p-6 bg-zinc-950/40 border-t border-white/5 space-y-6 text-xs text-zinc-300 leading-relaxed max-h-[450px] overflow-y-auto">
                  
                  {/* Option 1 */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5 uppercase tracking-wide border-b border-white/5 pb-1">
                      <span className="w-5 h-5 bg-amber-500/10 text-amber-400 font-mono rounded flex items-center justify-center text-xs">A</span>
                      <span>Easiest Method: Google Apps Script Web App</span>
                    </h4>
                    <p className="font-light">
                      Apps Script acts as a public proxy webhook that appends incoming posts automatically.
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 font-light text-zinc-400">
                      <li>Open your target Google Sheet in your web browser.</li>
                      <li>In the top menu bar, click <strong>Extensions &gt; Apps Script</strong>.</li>
                      <li>Erase any existing code and paste the following snippet precisely:
                        <pre className="bg-black/80 p-3 rounded font-mono text-[10px] text-zinc-300 overflow-auto mt-1.5 border border-white/5 select-all">
{`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var doc = SpreadsheetApp.openById(data.spreadsheetId);
    var sheet = doc.getSheets()[0];
    sheet.appendRow(data.rowValues);
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                        </pre>
                      </li>
                      <li>Click the <strong>Save</strong> disk icon, then click <strong>Deploy &gt; New Deployment</strong> (top right).</li>
                      <li>Click the gear icon next to "Select type", and select <strong>Web App</strong>.</li>
                      <li>Configure exactly as follows:
                        <ul className="list-disc pl-5 mt-1 text-zinc-300 space-y-0.5 font-medium">
                          <li>Execute as: <span className="text-amber-400">Me</span></li>
                          <li>Who has access: <span className="text-amber-400">Anyone</span></li>
                        </ul>
                      </li>
                      <li>Click <strong>Deploy</strong>, authorize permissions, and copy the generated <strong>Web App URL</strong> (which ends in /exec).</li>
                      <li>Paste this URL as your secret environment variable <code className="font-mono bg-zinc-900 px-1 border border-white/10">GOOGLE_SHEETS_WEBAPP_URL</code> using the Secrets/Settings menu in the AI Studio editor sidebar.</li>
                    </ol>
                  </div>

                  {/* Option 2 */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5 uppercase tracking-wide border-b border-white/5 pb-1">
                      <span className="w-5 h-5 bg-amber-500/10 text-amber-400 font-mono rounded flex items-center justify-center text-xs">B</span>
                      <span>Alternative Method: Google Cloud Service Account API</span>
                    </h4>
                    <p className="font-light">
                      Writes directly to your Spreadsheet using an official Google Service Account.
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 font-light text-zinc-400">
                      <li>Create a project in the Google Cloud Console, enable the <strong>Google Sheets API</strong>, and create a Service Account.</li>
                      <li>Generate a new <strong>JSON Key file</strong> for the Service Account.</li>
                      <li>Copy the entire JSON string from the key file and set it as <code className="font-mono text-zinc-300">GOOGLE_SERVICE_ACCOUNT_KEY</code> in your environment parameters.
                        <br /><em>Or set <code className="font-mono text-zinc-300">GOOGLE_CLIENT_EMAIL</code> and <code className="font-mono text-zinc-300">GOOGLE_PRIVATE_KEY</code> individually.</em>
                      </li>
                      <li className="text-zinc-200 font-medium">
                        <strong>CRITICAL FINAL STEP:</strong> Open your Google Sheet, click the blue <strong>"Share"</strong> button in the top-right corner, and add your Service Account's email address (ending in <code className="font-mono bg-zinc-900">.gserviceaccount.com</code>) as an <strong>Editor</strong>.
                      </li>
                    </ol>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 3: DELIVERY PROTOCOLS SHOWN AT THE END OF THE PAGE */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white border-b border-white/10 pb-2">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Card 1: Timeframe */}
            <div className="border border-white/5 bg-zinc-900/5 p-5 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <Calendar size={18} />
                <h4 className="text-sm font-medium">When will it arrive?</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-normal font-light">
                Your package will arrive at your address in 2 to 4 working days. We will send you an SMS notification with tracking details soon.
              </p>
            </div>

            {/* Quick Card 2: Cash On Delivery Inspection */}
            <div className="border border-white/5 bg-zinc-900/5 p-5 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <Receipt size={18} />
                <h4 className="text-sm font-medium">Cash on Delivery</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-normal font-light">
                You can pay with cash when the package arrives. You are welcome to open the box and check your shoes before you pay the rider.
              </p>
            </div>

            {/* Quick Card 3: Free Support */}
            <div className="border border-white/5 bg-zinc-900/5 p-5 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <Truck size={18} />
                <h4 className="text-sm font-medium">Free & Easy Shipping</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-normal font-light">
                Standard delivery is always 100% free. If you have any questions or need help, email us anytime at savortheluxury@gmail.com.
              </p>
            </div>

          </div>
        </div>

        {/* Navigation Return */}
        <div className="pt-6 flex justify-center">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors rounded flex items-center justify-center gap-2 shadow-sm"
          >
            <Home size={14} />
            <span>Go Back To Store</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
