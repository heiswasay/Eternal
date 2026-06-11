import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Shield, User, HelpCircle, RefreshCw, Eye, Edit3, Settings } from "lucide-react";
import { motion } from "motion/react";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: string;
  image?: string;
}

interface OrderPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes: string;
  items: OrderItem[];
  totalPrice: string;
}

const INITIAL_ORDER: OrderPayload = {
  orderId: "ETN-2026-8804",
  customerName: "Wasey Ahmed",
  customerPhone: "+92 300 1234567",
  customerEmail: "wasey351@gmail.com",
  customerAddress: "House 24-B, Sector H, Phase 5 DHA, Lahore",
  notes: "Please pack with extra tissue layers. Deliver after 2 PM.",
  items: [
    {
      name: "Brown Oxford Leather",
      size: "42",
      quantity: 1,
      price: "PKR 5,950",
      image: "/src/images/bo1.webp"
    },
    {
      name: "Monk Strap",
      size: "43",
      quantity: 1,
      price: "PKR 5,950",
      image: "/src/images/m8.webp"
    }
  ],
  totalPrice: "PKR 11,900"
};

export default function EmailPreviewsPage() {
  const [order, setOrder] = useState<OrderPayload>(INITIAL_ORDER);
  const [activeTab, setActiveTab] = useState<"customer" | "organization">("customer");

  // Helper to update simple values
  const updateField = (field: keyof OrderPayload, value: string) => {
    setOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper to recalculate total when adding or removing items
  const updateItemQuantity = (index: number, qty: number) => {
    if (qty < 1) return;
    const newItems = [...order.items];
    newItems[index].quantity = qty;
    
    // Recalculate totalPrice
    const total = newItems.reduce((acc, item) => {
      const priceVal = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
      return acc + (priceVal * item.quantity);
    }, 0);

    setOrder(prev => ({
      ...prev,
      items: newItems,
      totalPrice: `PKR ${total.toLocaleString()}`
    }));
  };

  const resetData = () => {
    setOrder(INITIAL_ORDER);
  };

  // Get customer facing email template
  const getCustomerHtml = () => {
    const getFullImageUrl = (itemImage?: string) => {
      if (!itemImage) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=250&q=80";
      if (itemImage.startsWith("http")) return itemImage;
      const baseUrl = "https://ais-pre-qlmixii56q7npi2m57pvtv-156965086703.asia-southeast1.run.app";
      const cleanPath = itemImage.startsWith("/") ? itemImage : "/" + itemImage;
      return `${baseUrl}${cleanPath}`;
    };

    return `
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
          <div class="logo">ETERNAL WORKSHOP ATELIER</div>
          <h1 class="heading-title">Your order is confirmed</h1>
          <p class="greeting-text">Thanks for your order, ${order.customerName}!</p>
          
          <div class="section-title">Order Summary</div>
          
          ${order.items.map(item => `
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px;">
            <tr>
              <td width="70" style="vertical-align: top; padding-right: 16px;">
                <img src="${getFullImageUrl(item.image)}" width="70" height="70" style="border-radius: 4px; object-fit: cover; border: 1px solid rgba(255,255,255,0.08); background-color: #121214;" alt="${item.name}" />
              </td>
              <td style="vertical-align: middle; text-align: left;">
                <div style="font-size: 13px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${item.name}</div>
                <div style="font-size: 11px; color: #71717a;">EU Size: ${item.size} &bull; Qty: ${item.quantity}</div>
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
                <td style="color: #ffffff; font-weight: 500;">${order.customerName}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Phone</td>
                <td style="color: #ffffff; font-weight: 500;">${order.customerPhone}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Email</td>
                <td style="color: #ffffff; font-weight: 500;">${order.customerEmail}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Address</td>
                <td style="color: #ffffff; font-weight: 500;">${order.customerAddress}</td>
              </tr>
              ${order.notes ? `
              <tr class="details-row">
                <td style="color: #71717a;">Notes</td>
                <td style="color: #f59e0b; font-style: italic;">${order.notes}</td>
              </tr>` : ""}
            </table>
          </div>

          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-bottom: 32px;">
            <tr>
              <td style="font-size: 13px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: middle;">Total Payable (COD)</td>
              <td style="font-size: 18px; color: #f59e0b; font-weight: 700; text-align: right; vertical-align: middle;">${order.totalPrice}</td>
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
              For Enquiry: <a href="mailto:support@eternal.com.pk" style="color: #f59e0b; text-decoration: none; font-weight: bold;">support@eternal.com.pk</a>
            </p>
            <p style="font-size: 10px; color: #52525b; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">
              &copy; 2026 ETERNAL WORKSHOP ATELIER. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  // Get admin/organization facing email template
  const getOrganizationHtml = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #09090b; color: #fafafa; font-family: sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #27272a; padding: 30px; background: #000; }
    h1 { font-size: 20px; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 0; }
    .field { margin-bottom: 12px; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; }
    .val { color: #fff; font-size: 14px; font-weight: bold; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; background-color: #1c1917; color: #a1a1aa; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 10px; border-bottom: 1px solid #1c1917; color: #e4e4e7; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NEW ATELIER ORDER RECEIVED</h1>
    <div class="field"><div class="label">Order ID</div><div class="val">${order.orderId}</div></div>
    <div class="field"><div class="label">Customer Name</div><div class="val">${order.customerName}</div></div>
    <div class="field"><div class="label">Phone</div><div class="val">${order.customerPhone}</div></div>
    <div class="field"><div class="label">Email</div><div class="val">${order.customerEmail}</div></div>
    <div class="field"><div class="label">Address</div><div class="val">${order.customerAddress}</div></div>
    <div class="field"><div class="label">Notes</div><div class="val">${order.notes || "None"}</div></div>
    <table>
      <thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        ${order.items
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
      <strong style="color: #f59e0b; font-size: 18px;">${order.totalPrice}</strong>
    </div>
  </div>
</body>
</html>`;
  };

  const previewHtml = activeTab === "customer" ? getCustomerHtml() : getOrganizationHtml();

  return (
    <div className="bg-luxury-black text-white min-h-screen pt-24 pb-16 px-4 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb back navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Studio</span>
          </Link>
          <button 
            onClick={resetData}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 px-3 py-1.5 border border-white/5 transition-all duration-300"
          >
            <RefreshCw size={12} />
            <span>Reset Mock Data</span>
          </button>
        </div>

        {/* Hero Title Column */}
        <div className="mb-12 border-b border-white/5 pb-10">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-amber-500 font-mono mb-3">
            <Mail size={14} />
            <span>Operational Correspondence</span>
          </div>
          <h1 className="serif text-3xl md:text-5xl font-light mb-4">
            Atelier Email <span className="italic">Designs</span>
          </h1>
          <p className="max-w-2xl text-zinc-400 text-xs sm:text-sm uppercase tracking-widest leading-relaxed">
            Review of currently dispatched system emails. Switch tabs to inspect responsive designs for client satisfaction receipt or back-of-office notifications. You can edit variables in the editor to see layout scaling.
          </p>
        </div>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left panel: Sample variables editor */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-white/5 bg-zinc-950/60 p-6 md:p-8 rounded-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-500 font-semibold mb-6 pb-3 border-b border-white/10">
                <Settings size={14} />
                <span>Simulation Parameters</span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Order Identification Code</label>
                  <input 
                    type="text" 
                    value={order.orderId}
                    onChange={(e) => updateField("orderId", e.target.value)}
                    className="w-full bg-zinc-900/60 border border-white/10 p-3 text-xs tracking-wider font-mono uppercase text-white placeholder-zinc-700 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Customer Full Name</label>
                  <input 
                    type="text" 
                    value={order.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    className="w-full bg-zinc-900/60 border border-white/10 p-3 text-xs tracking-wider text-white placeholder-zinc-700 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Primary Contact Number</label>
                  <input 
                    type="text" 
                    value={order.customerPhone}
                    onChange={(e) => updateField("customerPhone", e.target.value)}
                    className="w-full bg-zinc-900/60 border border-white/10 p-3 text-xs tracking-wider font-mono text-white placeholder-zinc-700 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Registered Email Address</label>
                  <input 
                    type="email" 
                    value={order.customerEmail}
                    onChange={(e) => updateField("customerEmail", e.target.value)}
                    className="w-full bg-zinc-900/60 border border-white/10 p-3 text-xs tracking-wider text-white placeholder-zinc-700 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Fulfillment Destination</label>
                  <textarea 
                    rows={2}
                    value={order.customerAddress}
                    onChange={(e) => updateField("customerAddress", e.target.value)}
                    className="w-full bg-zinc-900/60 border border-white/10 p-3 text-xs tracking-wider text-white placeholder-zinc-700 focus:border-amber-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Atelier Delivery Instructions (Notes)</label>
                  <textarea 
                    rows={2}
                    value={order.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="w-full bg-zinc-900/60 border border-white/10 p-3 text-xs tracking-wider text-white placeholder-zinc-700 focus:border-amber-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Items quantity quick simulator */}
                <div className="pt-2">
                  <span className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">Item Quantities Controller</span>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-zinc-900/40 border border-white/5">
                        <span className="font-mono text-[10px] uppercase tracking-wide truncate text-zinc-300 max-w-[150px]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => updateItemQuantity(idx, item.quantity - 1)}
                            className="w-6 h-6 border border-white/10 rounded-sm hover:bg-white/5 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-mono text-zinc-200">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateItemQuantity(idx, item.quantity + 1)}
                            className="w-6 h-6 border border-white/10 rounded-sm hover:bg-white/5 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customization guidelines card */}
            <div className="border border-white/5 bg-zinc-950/20 p-6 md:p-8 rounded-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-400 font-semibold mb-4">
                <HelpCircle size={14} />
                <span>Modification Directions</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed uppercase tracking-wider mb-4">
                Review these active structural blocks. If you require styling adjustments, you can directly ask me (the AI coder) to apply them! Examples:
              </p>
              <ul className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>"Incorporate a logo image header banner pointing to a hosted URL"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>"Restyle the total block to be lighter and more aligned to the left"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>"Adjust margins or substitute background hex code values"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>"Expand order rows to include tiny product specifications"</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right panel: Tab controller and Live Sandbox iFrame rendering */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Elegant Segmented Tabs */}
            <div className="flex justify-between items-center bg-zinc-950/80 border border-white/5 p-2 rounded-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("customer")}
                  className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold rounded-sm transition-all focus:outline-none flex items-center gap-2 ${
                    activeTab === "customer" 
                      ? "bg-white text-black" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User size={12} />
                  <span>Customer Acknowledgment</span>
                </button>
                <button
                  onClick={() => setActiveTab("organization")}
                  className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold rounded-sm transition-all focus:outline-none flex items-center gap-2 ${
                    activeTab === "organization" 
                      ? "bg-white text-black" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Shield size={12} />
                  <span>Organization Receipt</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-zinc-500 tracking-widest">
                <Eye size={12} className="text-zinc-500" />
                <span>SANDBOX FRAME ACTIVE</span>
              </div>
            </div>

            {/* Simulated Mail Client Shell wrapped around the iframe */}
            <div className="border border-white/10 rounded-sm overflow-hidden bg-zinc-900 shadow-2xl">
              
              {/* Mail client toolbar mock */}
              <div className="bg-zinc-950 px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full bg-red-500/20" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <span className="w-3 h-3 rounded-full bg-green-500/20" />
                  <span className="text-zinc-600 block pl-2 font-semibold">// MSG HEADER</span>
                  <span className="text-zinc-400 truncate font-light">
                    {activeTab === "customer" 
                      ? `From: Eternal Atelier • To: ${order.customerEmail}` 
                      : `From: Atelier Automation • To: support@eternal.com.pk`
                    }
                  </span>
                </div>
                <div className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-sm">
                  {order.totalPrice}
                </div>
              </div>

              {/* Subject line preview */}
              <div className="bg-zinc-950/40 px-4 py-3 border-b border-white/5 text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                <strong>Subject:</strong> {activeTab === "customer" 
                  ? `Order Recieved [ID: ${order.orderId}] - Eternal Workshop` 
                  : `New Order [ID: ${order.orderId}] - COD - ${order.customerName}`
                }
              </div>

              {/* High-fidelity responsive rendering box */}
              <div className="bg-zinc-950 p-4 md:p-8 flex items-center justify-center min-h-[500px]">
                <iframe 
                  title="email-preview"
                  srcDoc={previewHtml}
                  className="w-full max-w-[620px] h-[650px] border border-white/5 bg-[#09090b] shadow-xl overflow-y-auto"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>
            
            {/* Quick message feedback block */}
            <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-sm flex items-center gap-3 text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              <Edit3 size={16} className="text-amber-500 shrink-0" />
              <span>
                These preview designs are compiled in real-time. Simply prompt me in the chat sidebar to apply edits (e.g., changes in colors, typography, wording, layout, styles, borders, or sections) and I will immediately update both the live sandbox and your actual email endpoint.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
