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

const displaySize = (size: string) => {
  if (!size) return "N/A";
  const num = parseInt(size, 10);
  if (!isNaN(num) && num >= 35) {
    return `EU ${size}`;
  }
  return `US ${size}`;
};

const INITIAL_ORDER: OrderPayload = {
  orderId: "ETN-2026-8804",
  customerName: "Wasey Ahmed",
  customerPhone: "+92 318 0105860",
  customerEmail: "wasey351@gmail.com",
  customerAddress: "House 24-B, Sector H, Phase 5 DHA, Karachi",
  notes: "Please pack with extra tissue layers. Deliver after 2 PM.",
  items: [
    {
      name: "Brown Oxford Leather",
      size: "9",
      quantity: 1,
      price: "PKR 5,950",
      image: "/src/images/bo1.webp"
    },
    {
      name: "Monk Strap",
      size: "10",
      quantity: 1,
      price: "PKR 5,950",
      image: "/src/images/m8.webp"
    }
  ],
  totalPrice: "PKR 11,900"
};

export default function EmailPreviewsPage() {
  const [order, setOrder] = useState<OrderPayload>(INITIAL_ORDER);
  const [activeTab, setActiveTab] = useState<
    | "confirmation"
    | "status_new"
    | "status_process"
    | "status_delivered"
    | "status_cancel"
    | "status_refund"
    | "status_exchange"
    | "organization"
  >("confirmation");

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

  // 1. Confirmation Receipt
  const getCustomerConfirmationHtml = () => {
    return `<!DOCTYPE html>
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
          <div class="logo">ETERNAL</div>
          <h1 class="heading-title">Your order is confirmed</h1>
          <p class="greeting-text">Thanks for your order, ${order.customerName}!</p>
          
          <div class="section-title">Order Summary</div>
          
           ${order.items.map(item => `
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
  };

  // 2. Status Updates Previews
  const getStatusEmailHtml = (status: "new" | "under process" | "delivered" | "cancel" | "refund" | "exchange") => {
    const firstItemName = order.items && order.items[0] ? order.items[0].name : "Premium Footwear";
    const firstItemSize = order.items && order.items[0] ? displaySize(order.items[0].size) : "EU 43";
    const firstItemQty = order.items && order.items[0] ? order.items[0].quantity : 1;

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
            <td style="color: #a78bfa; font-weight: bold; padding: 4px 0;">${order.totalPrice}</td>
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
          <p class="greeting-text">Hello ${order.customerName || "Customer"},</p>
          
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
          
          ${order.items ? order.items.map(item => `
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
                <td style="color: #ffffff; font-weight: bold; font-family: monospace;">${order.orderId}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Name</td>
                <td style="color: #ffffff; font-weight: 500;">${order.customerName}</td>
              </tr>
              <tr class="details-row">
                <td style="color: #71717a;">Destination</td>
                <td style="color: #ffffff; font-weight: 500;">${order.customerAddress}</td>
              </tr>
            </table>
          </div>

          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-bottom: 32px;">
            <tr>
              <td style="font-size: 13px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: middle;">Total Value (COD)</td>
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
  };

  // 3. Organization Notice
  const getOrganizationHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #0c0a09; color: #fafafa; font-family: sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #27272a; padding: 30px; background: #000; }
    h1 { font-size: 20px; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 0; }
    .field { margin-bottom: 12px; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; }
    .val { color: #fff; font-size: 14px; font-weight: bold; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; background-color: #1a1513; color: #a1a1aa; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 10px; border-bottom: 1px solid #1a1513; color: #e4e4e7; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NEW ETERNAL ORDER RECEIVED</h1>
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
          <td>${displaySize(item.size)}</td>
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

  const getPreviewHtml = () => {
    switch(activeTab) {
      case "confirmation":
        return getCustomerConfirmationHtml();
      case "status_new":
        return getStatusEmailHtml("new");
      case "status_process":
        return getStatusEmailHtml("under process");
      case "status_delivered":
        return getStatusEmailHtml("delivered");
      case "status_refund":
        return getStatusEmailHtml("refund");
      case "status_exchange":
        return getStatusEmailHtml("exchange");
      case "status_cancel":
        return getStatusEmailHtml("cancel");
      case "organization":
        return getOrganizationHtml();
      default:
        return getCustomerConfirmationHtml();
    }
  };

  const activeSubject = () => {
    switch (activeTab) {
      case "confirmation":
        return `Order Received [ID: ${order.orderId}] - Eternal Workshop`;
      case "status_new":
        return `Order Update [ID: ${order.orderId}] - Logged & Verified - Eternal`;
      case "status_process":
        return `Order Update [ID: ${order.orderId}] - Under Craftsmanship - Eternal`;
      case "status_delivered":
        return `Order Update [ID: ${order.orderId}] - Dispatched & Delivered - Eternal`;
      case "status_refund":
        return `Your Refund Has Been Processed [ID: ${order.orderId}] - Eternal`;
      case "status_exchange":
        return `Your Exchange Has Been Processed [ID: ${order.orderId}] - Eternal`;
      case "status_cancel":
        return `Order Update [ID: ${order.orderId}] - Voided & Cancelled - Eternal`;
      case "organization":
        return `New Order [ID: ${order.orderId}] - COD - ${order.customerName}`;
    }
  };

  const activeSender = () => {
    switch (activeTab) {
      case "organization":
        return `From: Eternal Automation • To: savortheluxury@gmail.com`;
      default:
        return `From: Eternal Workshop • To: ${order.customerEmail}`;
    }
  };

  return (
    <div className="bg-luxury-black text-white min-h-screen pt-24 pb-16 px-4 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb back navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-semibold text-zinc-400 hover:text-white transition-colors animate-pulse"
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
            <span>Operational Correspondence Overview</span>
          </div>
          <h1 className="serif text-3xl md:text-5xl font-light mb-4">
            Eternal Email <span className="italic">Designs</span>
          </h1>
          <p className="max-w-2xl text-zinc-400 text-xs sm:text-sm uppercase tracking-widest leading-relaxed">
            Review of currently dispatched system emails. Switch tabs to inspect responsive designs for client satisfaction receipt, live order status updates, or back-of-office notifications. You can edit variables in the editor to see layout scaling.
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
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Eternal Delivery Instructions (Notes)</label>
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
                Review these active structural blocks. All templates automatically conform to Eternal brand standards and guidelines. Ask me to adjust layout, borders, backgrounds or custom sections anytime.
              </p>
            </div>
          </div>

          {/* Right panel: Tab controller and Live Sandbox iFrame rendering */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Elegant Segmented Tabs */}
            <div className="flex flex-col gap-2 bg-zinc-950/85 border border-white/5 p-3 rounded-md">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1 block">Selected Correspondence Template Code:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
                <button
                  onClick={() => setActiveTab("confirmation")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "confirmation" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User size={10} />
                  <span>Receipt</span>
                </button>
                <button
                  onClick={() => setActiveTab("status_new")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "status_new" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail size={10} />
                  <span>Status: New</span>
                </button>
                <button
                  onClick={() => setActiveTab("status_process")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "status_process" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail size={10} />
                  <span>Status: Process</span>
                </button>
                <button
                  onClick={() => setActiveTab("status_delivered")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "status_delivered" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail size={10} />
                  <span>Status: Sent</span>
                </button>
                <button
                  onClick={() => setActiveTab("status_cancel")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "status_cancel" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail size={10} />
                  <span>Status: Void</span>
                </button>
                <button
                  onClick={() => setActiveTab("status_refund")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "status_refund" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail size={10} />
                  <span>Status: Refund</span>
                </button>
                <button
                  onClick={() => setActiveTab("status_exchange")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "status_exchange" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail size={10} />
                  <span>Status: Exchange</span>
                </button>
                <button
                  onClick={() => setActiveTab("organization")}
                  className={`px-3 py-2 text-[9px] uppercase tracking-wider font-bold rounded-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 border ${
                    activeTab === "organization" 
                      ? "bg-amber-500 border-amber-500 text-black font-black" 
                      : "text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Shield size={10} />
                  <span>Admin Receipt</span>
                </button>
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
                  <span className="text-zinc-650 block pl-2 font-semibold">// MSG HEADER</span>
                  <span className="text-zinc-400 truncate font-light">
                    {activeSender()}
                  </span>
                </div>
                <div className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-sm">
                  {order.totalPrice}
                </div>
              </div>

              {/* Subject line preview */}
              <div className="bg-zinc-950/40 px-4 py-3 border-b border-white/5 text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                <strong>Subject:</strong> {activeSubject()}
              </div>

              {/* High-fidelity responsive rendering box */}
              <div className="bg-zinc-950 p-4 md:p-8 flex items-center justify-center min-h-[500px]">
                <iframe 
                  title="email-preview"
                  srcDoc={getPreviewHtml()}
                  className="w-full max-w-[620px] h-[650px] border border-white/5 bg-[#09090b] shadow-xl overflow-y-auto"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>
            
            {/* Quick message feedback block */}
            <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-sm flex items-center gap-3 text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              <Edit3 size={16} className="text-amber-500 shrink-0" />
              <span>
                These preview designs represent the exact output parsed during live user updates. You can preview all five customer status variations instantly.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
