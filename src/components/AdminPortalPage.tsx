import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCw,
  Database,
  ListFilter,
  CheckCircle2,
  Ban,
  Clock,
  LogOut,
  Lock,
  Search,
  RefreshCw,
  Phone,
  MapPin,
  Mail,
  ChevronRight,
  FileText,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Copy,
  Check,
  Truck,
  User,
  ExternalLink
} from "lucide-react";
import { fetchOrdersFromDb, updateOrderStatusInDb, OrderData } from "../firebase";

export const AdminPortalPage: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // Orders State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  // Copy-To-Clipboard states
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Load Auth State from SessionStorage to support fluid refreshes
  useEffect(() => {
    const isAuthed = sessionStorage.getItem("atelier_admin_auth") === "true";
    if (isAuthed) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders helper
  const loadOrders = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchOrdersFromDb();
      setOrders(data);
      
      // Auto-select the first order if none is selected
      if (data.length > 0) {
        if (!selectedOrder) {
          setSelectedOrder(data[0]);
        } else {
          const updated = data.find((o) => o.id === selectedOrder.id || o.orderId === selectedOrder.orderId);
          if (updated) {
            setSelectedOrder(updated);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setSyncMessage({
        text: "Failed to connect to order ledger backend. Please retry.",
        type: "error"
      });
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Handle Login Check
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "abbas" && password === "abbas") {
      sessionStorage.setItem("atelier_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid administrator credentials. Please check and try again.");
    }
  };

  // Handle Log Out
  const handleLogOut = () => {
    sessionStorage.removeItem("atelier_admin_auth");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setSelectedOrder(null);
  };

  // Trigger clipboard copy with visual feedback
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Handle status updates and real-time backend synchronization
  const handleUpdateStatus = async (docId: string, newStatus: "new" | "under process" | "delivered" | "cancel" | "refund" | "exchange") => {
    if (!docId) return;
    setUpdatingOrderId(docId);
    setSyncMessage({
      text: `Syncing status change with Cloud Firestore...`,
      type: "info"
    });

    try {
      const success = await updateOrderStatusInDb(docId, newStatus);
      if (success) {
        setSyncMessage({
          text: `Successfully synced status updated to "${newStatus.toUpperCase()}" on Firebase Database`,
          type: "success"
        });
        
        // Mutate order list state instantly to prevent UI delays
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id === docId) {
              return { ...o, status: newStatus };
            }
            return o;
          })
        );

        // Mutate currently selected order representation
        if (selectedOrder && selectedOrder.id === docId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }

        // Synchronize with Google Spreadsheet
        const matchingOrder = orders.find((o) => o.id === docId || o.orderId === selectedOrder?.orderId);
        if (matchingOrder) {
          try {
            const sheetsResp = await fetch("/api/sync-sheets-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: matchingOrder.orderId,
                status: newStatus
              })
            });
            if (sheetsResp.ok) {
              const resJson = await sheetsResp.json();
              if (resJson.success) {
                console.log("[Google Sheets Sync] Successfully updated status on Google Sheets:", resJson);
                setSyncMessage({
                  text: `Successfully updated status to "${newStatus.toUpperCase()}" on Firebase & Google Sheet`,
                  type: "success"
                });
              } else {
                console.warn("[Google Sheets Sync] Sheet update bypassed/skipped:", resJson.reason || resJson);
              }
            }
          } catch (sheetsErr) {
            console.error("[Google Sheets Sync] Fail:", sheetsErr);
          }
        }

        // Clean feedback message after 4s
        setTimeout(() => setSyncMessage(null), 4000);
      } else {
        setSyncMessage({
          text: "Sync completed to local cache, but online cloud handshake failed.",
          type: "error"
        });
      }
    } catch (err: any) {
      console.error("Database status write failed:", err);
      let errorDetail = "";
      try {
        const parsed = JSON.parse(err.message);
        if (parsed && parsed.error) {
          errorDetail = `: ${parsed.error}`;
        }
      } catch (e) {
        errorDetail = err?.message ? `: ${err.message}` : "";
      }
      setSyncMessage({
        text: `Security verification or Firestore write rejected your update${errorDetail}`,
        type: "error"
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleNotifyCustomer = async (order: OrderData) => {
    if (!order) return;
    setIsSendingEmail(true);
    setSyncMessage({
      text: "Preparing modern status update template...",
      type: "info"
    });

    try {
      const response = await fetch("/api/send-status-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: order,
          status: order.status
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setSyncMessage({
          text: `Successfully dispatched "${order.status.toUpperCase()}" status email notification to customer.`,
          type: "success"
        });
      } else {
        setSyncMessage({
          text: resData.error || "Email bypassed or failed standard validation.",
          type: "error"
        });
      }
    } catch (err: any) {
      console.error(err);
      setSyncMessage({
        text: "Incomplete network connection or endpoint error.",
        type: "error"
      });
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query) ||
      order.customerPhone.toLowerCase().includes(query) ||
      order.customerAddress.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Calculate high level stats from current state
  const stats = {
    total: orders.length,
    newCount: orders.filter((o) => o.status === "new").length,
    processing: orders.filter((o) => o.status === "under process").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancel").length,
    refunded: orders.filter((o) => o.status === "refund").length,
    exchanged: orders.filter((o) => o.status === "exchange").length,
  };

  // Tailwind aesthetics mapper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "under process":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "cancel":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "refund":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "exchange":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-400";
      case "under process":
        return "bg-amber-400";
      case "delivered":
        return "bg-emerald-400";
      case "cancel":
        return "bg-rose-400";
      case "refund":
        return "bg-purple-400";
      case "exchange":
        return "bg-cyan-400";
      default:
        return "bg-zinc-400";
    }
  };

  // Return formatted display size
  const displaySize = (size: any) => {
    if (!size) return "N/A";
    const str = String(size);
    if (str.includes("US") || str.includes("EU") || str.includes("UK")) return str;
    return `EU ${str}`;
  };

  // -------------------------------------------------------------
  // RENDER INTERACTIVE SECURE SIGN-IN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 relative overflow-hidden text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
        {/* Subtle glowing focal ambient circle */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-8">
          
          {/* Logo & Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/10 rounded-full font-mono text-[10px] uppercase text-zinc-400 tracking-[0.2em] mb-1">
              <ShieldCheck size={11} className="text-amber-500" />
              <span>Security Officer Access</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-white uppercase">
              Order Ledger Hub
            </h1>
            <p className="text-sm text-zinc-400 font-light max-w-xs mx-auto leading-relaxed">
              Login to inspect, manage, and process central store customer database records.
            </p>
          </div>

          {/* Login Card */}
          <div className="border border-white/10 bg-zinc-900/40 p-10 rounded-xl backdrop-blur-md shadow-2xl space-y-6">

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Store Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  autoComplete="username"
                  className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500/50 rounded px-4 py-3 text-sm outline-none transition-all placeholder-zinc-700 font-mono text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Private Password
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-3.5 text-zinc-600">
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500/50 rounded px-4 py-3 text-sm outline-none transition-all placeholder-zinc-700 font-mono text-white"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded text-xs text-rose-400 flex items-center gap-2.5">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-widest transition-all rounded shadow-lg shadow-amber-500/10 cursor-pointer text-center"
              >
                Access Ledger Terminal
              </button>
            </form>
          </div>

          <div className="text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Eternal Executive Control Zone // Secure SSL
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER COMPLETE RESPONSIVE ORDERS CONTROL HUD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans pt-28 pb-24 px-4 sm:px-6 md:px-8 selection:bg-amber-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP STATUS CONTROL BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[10px] font-mono font-semibold tracking-wider">
                ADMIN SECURER PORTAL
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded text-[10px] font-mono text-emerald-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYNC ACTIVE</span>
              </div>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white uppercase">
              Operations Center
            </h1>
            <p className="text-xs text-zinc-400 font-light max-w-2xl leading-relaxed">
              Connected to Cloud Firestore live database. Access client specifications, verify products, process shipping coordinates, and mutate order status codes.
            </p>
          </div>

          {/* Quick global controls */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={() => loadOrders(false)}
              disabled={isLoading}
              className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-850 text-xs text-white font-semibold rounded flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-40"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "Querying Backend..." : "Pull Live Refresh"}</span>
            </button>

            <button
              onClick={handleLogOut}
              className="px-4 py-2.5 bg-rose-950/20 border border-rose-900/30 hover:border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-900/30 text-xs font-semibold rounded flex items-center gap-2 cursor-pointer transition-all"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* WORKFLOW METRICS PILLS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          
          <div className="border border-white/10 bg-zinc-900/30 p-5 rounded-lg flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block font-medium">TOTAL RECEIVED</span>
            <div className="text-3xl font-light text-white mt-2">{stats.total}</div>
          </div>

          <button 
            onClick={() => setFilterStatus("new")}
            className={`border p-5 rounded-lg flex flex-col justify-between text-left transition-all ${
              filterStatus === "new" ? "border-blue-500/40 bg-blue-500/5 shadow-md shadow-blue-500/5 scale-102" : "border-white/14 hover:border-white/20 hover:bg-zinc-900/50"
            }`}
          >
            <span className="text-[10px] text-blue-400 uppercase font-mono tracking-widest block flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>New</span>
            </span>
            <div className="text-3xl font-light text-white mt-2">{stats.newCount}</div>
          </button>

          <button 
            onClick={() => setFilterStatus("under process")}
            className={`border p-5 rounded-lg flex flex-col justify-between text-left transition-all ${
              filterStatus === "under process" ? "border-amber-500/40 bg-amber-500/5 shadow-md shadow-amber-500/5 scale-102" : "border-white/14 hover:border-white/20 hover:bg-zinc-900/50"
            }`}
          >
            <span className="text-[10px] text-amber-400 uppercase font-mono tracking-widest block flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>In Process</span>
            </span>
            <div className="text-3xl font-light text-white mt-2">{stats.processing}</div>
          </button>

          <button 
            onClick={() => setFilterStatus("delivered")}
            className={`border p-5 rounded-lg flex flex-col justify-between text-left transition-all ${
              filterStatus === "delivered" ? "border-emerald-500/40 bg-emerald-500/5 shadow-md shadow-emerald-500/5 scale-102" : "border-white/14 hover:border-white/20 hover:bg-zinc-900/50"
            }`}
          >
            <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest block flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Delivered</span>
            </span>
            <div className="text-3xl font-light text-white mt-2">{stats.delivered}</div>
          </button>

          <button 
            onClick={() => setFilterStatus("cancel")}
            className={`border p-5 rounded-lg flex flex-col justify-between text-left transition-all ${
              filterStatus === "cancel" ? "border-rose-500/40 bg-rose-500/5 shadow-md shadow-rose-500/5 scale-102" : "border-white/14 hover:border-white/20 hover:bg-zinc-900/50"
            }`}
          >
            <span className="text-[10px] text-rose-400 uppercase font-mono tracking-widest block flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>Cancelled</span>
            </span>
            <div className="text-3xl font-light text-white mt-2">{stats.cancelled}</div>
          </button>

          <button 
            onClick={() => setFilterStatus("refund")}
            className={`border p-5 rounded-lg flex flex-col justify-between text-left transition-all ${
              filterStatus === "refund" ? "border-purple-500/40 bg-purple-500/5 shadow-md shadow-purple-500/5 scale-102" : "border-white/14 hover:border-white/20 hover:bg-zinc-900/50"
            }`}
          >
            <span className="text-[10px] text-purple-400 uppercase font-mono tracking-widest block flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>Refunded</span>
            </span>
            <div className="text-3xl font-light text-white mt-2">{stats.refunded}</div>
          </button>

          <button 
            onClick={() => setFilterStatus("exchange")}
            className={`border p-5 rounded-lg flex flex-col justify-between text-left transition-all ${
              filterStatus === "exchange" ? "border-cyan-500/40 bg-cyan-500/5 shadow-md shadow-cyan-500/5 scale-102" : "border-white/14 hover:border-white/20 hover:bg-zinc-900/50"
            }`}
          >
            <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-widest block flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>Exchanged</span>
            </span>
            <div className="text-3xl font-light text-white mt-2">{stats.exchanged}</div>
          </button>

        </div>

        {/* SEARCH AND INTERACTIVE FILTERS BLOCK */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border border-white/5 bg-zinc-900/30 p-5 rounded-lg">
          
          {/* Realtime Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3.5 text-zinc-500">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by customer name, order number, city, or phone..."
              className="w-full bg-zinc-950 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-xs outline-none focus:border-amber-500/40 text-white placeholder-zinc-600 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Directory Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 mr-1.5">
              <ListFilter size={13} />
              <span>CURRENT FILTER:</span>
            </span>
            
            {["all", "new", "under process", "delivered", "cancel", "refund", "exchange"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-[11px] font-mono font-medium tracking-wide rounded-md border uppercase cursor-pointer transition-all ${
                  filterStatus === st
                    ? "bg-amber-400 text-black border-amber-400 font-bold"
                    : "bg-zinc-950 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* LIVE SYNC STATUS TOAST STRIP */}
        <AnimatePresence>
          {syncMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className={`p-4 rounded-lg font-mono text-xs text-center border font-semibold flex items-center justify-center gap-3 shadow-lg ${
                syncMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : syncMessage.type === "info"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-400"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current animate-ping shrink-0" />
              <span>{syncMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN EXECUTIVE SPLIT CONTROLLER PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ORDERS DIRECTORY LEFT COLUMN (5 of 12 columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono tracking-widest text-zinc-505 uppercase block">
                Order Registers ({filteredOrders.length})
              </span>
              {filterStatus !== "all" && (
                <button
                  onClick={() => setFilterStatus("all")}
                  className="text-[10px] text-amber-500 hover:underline hover:text-amber-400 font-mono"
                >
                  View All Stages
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="border border-white/5 bg-zinc-900/10 p-16 text-center rounded-lg space-y-4">
                <RotateCw size={28} className="animate-spin text-amber-500 mx-auto" />
                <p className="text-xs text-zinc-500 font-light">Loading orders live from Cloud Firestore database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="border border-dashed border-white/10 p-16 text-center rounded-lg space-y-3">
                <div className="text-zinc-600 block text-2xl">⚡</div>
                <p className="text-xs text-zinc-400">No orders currently match your query.</p>
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setSearchQuery("");
                  }}
                  className="text-2xs text-amber-400 underline font-mono cursor-pointer"
                >
                  Reset filters and search query
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.orderId === ord.orderId;
                  const itemNames = ord.items?.map(i => i.name).join(", ") || "No items";
                  
                  return (
                    <button
                      key={ord.id || ord.orderId}
                      onClick={() => setSelectedOrder(ord)}
                      className={`w-full text-left p-4.5 rounded-lg border transition-all relative overflow-hidden block cursor-pointer group ${
                        isSelected
                          ? "bg-zinc-900 border-amber-500/40 hover:border-amber-500/50 text-white shadow-lg"
                          : "bg-zinc-950 border-white/5 hover:border-white/10 hover:bg-zinc-900/40 text-zinc-400"
                      }`}
                    >
                      {/* Left glowing border accent for selected items */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 shadow shadow-amber-500" />
                      )}

                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1 items-stretch flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-amber-400">
                              {ord.orderId}
                            </span>
                            {ord.id?.startsWith("local_") && (
                              <span className="text-[8px] font-mono px-1 py-0.2 uppercase bg-zinc-800 text-amber-500/80 rounded border border-amber-500/10 shrink-0">Offline</span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {ord.customerName}
                          </h4>
                          <span className="text-[10px] text-zinc-500 line-clamp-1">
                            {itemNames}
                          </span>
                          <span className="text-[10px] text-zinc-400 block pt-1">
                            {ord.totalPrice} &bull; <span className="font-mono text-xs">{ord.paymentMethod || "COD"}</span>
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-2.5 shrink-0 text-right">
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${getStatusBadgeStyle(ord.status)}`}>
                            {ord.status}
                          </span>
                          
                          <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                            <Calendar size={10} />
                            <span>
                              {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                              })}
                            </span>
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PREVIEW CONTAINER RIGHT COLUMN (7 of 12 columns) */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div id="inspector-board" className="border border-white/10 bg-zinc-900/45 p-6 md:p-8 rounded-xl space-y-8 relative overflow-hidden backdrop-blur-md">
                
                {/* Visual glow backdrop inside the inspect panel */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Inspect Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                      Inspect Selected Order Record
                    </span>
                    <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2 flex-wrap">
                      <span>Order:</span>
                      <span className="text-amber-500 select-all">{selectedOrder.orderId}</span>
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar size={10} />
                      <span>Received on {new Date(selectedOrder.createdAt).toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}</span>
                    </p>
                  </div>

                  {/* Highlight current state */}
                  <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-lg border border-white/5 shrink-0">
                    <span className="text-[9px] text-zinc-500 font-mono">FLOW:</span>
                    <span className={`text-xs font-mono font-black uppercase px-2.5 py-1 rounded ${getStatusBadgeStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* VISUAL WORKFLOW TIMELINE STEPPER - INCREDIBLY UNIQUE & INTUITIVE */}
                <div className="space-y-3 p-5 bg-zinc-950 border border-white/10 rounded-xl">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-black block">
                      Interactive Drag-Free Stepper
                    </span>
                    <span className="text-[9px] text-amber-500 font-mono">Click step to sync database</span>
                  </div>

                  {/* Stepper graphics */}
                  <div className="grid grid-cols-6 items-center relative pt-4 pb-2">
                    
                    {/* Linear progress line in background */}
                    <div className="absolute left-[8%] right-[8%] top-[25px] h-0.5 bg-zinc-800 z-0" />

                    {/* Timeline Nodes */}
                    {[
                      { key: "new", label: "NEW", desc: "Awaiting Processing", icon: Clock },
                      { key: "under process", label: "PROCESSING", desc: "Workshop Dispatch", icon: Truck },
                      { key: "delivered", label: "DELIVERED", desc: "Client Received", icon: CheckCircle2 },
                      { key: "exchange", label: "EXCHANGE", desc: "Exchange Approved", icon: RefreshCw },
                      { key: "refund", label: "REFUND", desc: "Refund Processed", icon: RotateCw },
                      { key: "cancel", label: "CANCELLED", desc: "Void Transaction", icon: Ban }
                    ].map((step, idx) => {
                      const isActive = selectedOrder.status === step.key;
                      const IconComp = step.icon;
                      
                      return (
                        <button
                          key={step.key}
                          disabled={updatingOrderId !== null}
                          onClick={() => handleUpdateStatus(selectedOrder.id || "", step.key as any)}
                          className="flex flex-col items-center text-center relative z-10 cursor-pointer focus:outline-none focus:ring-0 group select-none animate-fade-in"
                        >
                          {/* Circle indicator */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                            isActive
                              ? "bg-amber-400 border-amber-400 text-black shadow-lg shadow-amber-400/5 scale-110"
                              : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:border-zinc-500"
                          }`}>
                            <IconComp size={14} />
                          </div>
                          
                          {/* Step Tag */}
                          <span className={`text-[9px] font-bold tracking-wider mt-2.5 transition-colors uppercase ${
                            isActive ? "text-amber-400 block" : "text-zinc-500 group-hover:text-zinc-350"
                          }`}>
                            {step.label}
                          </span>
                          
                          {/* Tiny state label */}
                          <span className="text-[8px] text-zinc-600 hidden md:block mt-0.5 font-light font-mono">
                            {step.desc}
                          </span>
                        </button>
                      );
                    })}

                  </div>
                </div>

                {/* DISPATCH CORRESPONDENCE NOTIFICATION ACTION */}
                <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                      Status Communication Hub
                    </span>
                    <p className="text-xs text-zinc-300">
                      Send the modern and sophisticated status update email for stage: <span className="font-mono bg-zinc-900 px-2 py-0.5 border border-white/5 rounded text-amber-500 text-[10px] font-black uppercase font-mono">{selectedOrder.status}</span>
                    </p>
                  </div>
                  
                  <button
                    disabled={isSendingEmail}
                    onClick={() => handleNotifyCustomer(selectedOrder)}
                    className="cursor-pointer select-none bg-amber-500 hover:bg-amber-400 text-black px-5 py-3 rounded text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-all shrink-0 hover:shadow-lg hover:shadow-amber-500/10 min-w-[200px]"
                  >
                    {isSendingEmail ? (
                      <>
                        <RotateCw size={13} className="animate-spin" />
                        <span>Sending Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={13} />
                        <span>Send Status Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* CUSTOMER CONTACT DOSSIER PANEL */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold block">
                      Customer Dossier
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Click data icon to copy instantly</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    
                    {/* Left contacts list */}
                    <div className="space-y-4.5">
                      
                      {/* Name Row */}
                      <div className="flex items-start gap-3">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <User size={15} className="text-amber-500" />
                        </span>
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">Recipient Name</span>
                          <span className="text-white font-semibold text-sm">{selectedOrder.customerName}</span>
                        </div>
                      </div>

                      {/* Phone Row */}
                      <div className="flex items-start gap-3 group">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <Phone size={15} />
                        </span>
                        <div className="flex-1">
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">Contact Phone</span>
                          <div className="flex items-center gap-2">
                            <a href={`tel:${selectedOrder.customerPhone}`} className="text-zinc-100 hover:text-amber-400 transition-colors font-mono font-bold">
                              {selectedOrder.customerPhone}
                            </a>
                            <button
                              onClick={() => handleCopy(selectedOrder.customerPhone, "phone")}
                              className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 rounded transition-colors cursor-pointer"
                              title="Copy Phone Number"
                            >
                              {copiedText === "phone" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Email Row */}
                      <div className="flex items-start gap-3">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <Mail size={15} />
                        </span>
                        <div className="flex-1">
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">Email Address</span>
                          <div className="flex items-center gap-2">
                            <a href={`mailto:${selectedOrder.customerEmail}`} className="text-zinc-300 hover:text-amber-400 transition-colors font-mono select-all">
                              {selectedOrder.customerEmail}
                            </a>
                            <button
                              onClick={() => handleCopy(selectedOrder.customerEmail, "email")}
                              className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 rounded transition-colors cursor-pointer"
                              title="Copy Email"
                            >
                              {copiedText === "email" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right address and notes list */}
                    <div className="space-y-4.5">
                      
                      {/* Shipping address Row */}
                      <div className="flex items-start gap-3">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <MapPin size={15} />
                        </span>
                        <div className="flex-1">
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">Shipping Destination</span>
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-zinc-200 leading-relaxed block text-xs">{selectedOrder.customerAddress}</span>
                            <button
                              onClick={() => handleCopy(selectedOrder.customerAddress, "address")}
                              className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 rounded transition-colors cursor-pointer shrink-0 ml-1.5"
                              title="Copy Address"
                            >
                              {copiedText === "address" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notes block */}
                      <div className="flex items-start gap-3">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <FileText size={15} />
                        </span>
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">Delivery Instructions & Sizes</span>
                          <div className="p-3 bg-zinc-950 border border-white/5 rounded text-xs text-amber-500/95 italic leading-relaxed font-light">
                            {selectedOrder.notes ? `"${selectedOrder.notes}"` : "No custom client instructions logged."}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* INVENTORY FOOTWEAR TABLE */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold block border-b border-white/5 pb-1">
                    Acquired Footwear Articles Details ({selectedOrder.items?.length || 0})
                  </span>

                  <div className="border border-white/5 bg-zinc-950/60 rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-950 text-[10px] uppercase font-mono tracking-wider text-zinc-500 border-b border-white/5">
                        <tr>
                          <th className="p-4">Item Details</th>
                          <th className="p-4 text-center">Selected Size</th>
                          <th className="p-4 text-center">Qty</th>
                          <th className="p-4 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <tr key={index} className="hover:bg-zinc-900/20 transition-colors">
                            <td className="p-4 font-semibold text-white">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    className="w-10 h-10 object-cover rounded border border-white/10 shrink-0 bg-zinc-900" 
                                    alt="" 
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="space-y-0.5">
                                  <span className="block">{item.name}</span>
                                  {item.slug && (
                                    <span className="text-[9px] font-mono text-zinc-500 select-all font-normal">slug: {item.slug}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center font-mono font-bold text-amber-400">
                              {displaySize(item.size)}
                            </td>
                            <td className="p-4 text-center text-zinc-400 font-mono">
                              {item.quantity}
                            </td>
                            <td className="p-4 text-right font-mono text-white">
                              {item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PRICE SUMMARY TICKET */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-950 rounded-xl border border-white/5 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">PAYMENT INSTRUMENT:</span>
                      <strong className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                        {selectedOrder.paymentMethod || "CASH ON DELIVERY (COD)"}
                      </strong>
                    </div>
                    <div className="text-right flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Grand Net Total:</span>
                      <strong className="text-amber-400 text-lg font-bold select-all bg-amber-500/5 px-3 py-1 rounded border border-amber-500/15">
                        {selectedOrder.totalPrice}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* HELP LEGEND BLOCK TO HELP FIRST TIME USERS REMEMBER THE WORKFLOW */}
                <div className="p-4.5 bg-zinc-900/20 border border-white/5 rounded-lg text-2xs space-y-1 text-zinc-500">
                  <span className="font-mono uppercase font-black tracking-wider text-zinc-450 text-zinc-400 block mb-1">
                    💡 Workshop Operational Status Rules
                  </span>
                  <p>&bull; <strong className="text-blue-400 font-mono">NEW</strong>: Directly logged customer requests. Dispatch officer must verify address accuracy prior to workshop packaging.</p>
                  <p>&bull; <strong className="text-amber-400 font-mono">UNDER PROCESS</strong>: Active craftsmanship, artisan hand-assembling, or parcel in active postal transit.</p>
                  <p>&bull; <strong className="text-emerald-400 font-mono">DELIVERED</strong>: Successful physical delivery authenticated. No further amendments are typically requested.</p>
                  <p>&bull; <strong className="text-rose-400 font-mono">CANCEL</strong>: Order voided due to phone verification cancellation or client retracting order trace.</p>
                </div>

              </div>
            ) : (
              <div className="border border-white/5 bg-zinc-900/10 p-24 text-center rounded-xl space-y-5">
                <Database size={44} className="text-zinc-700 animate-pulse mx-auto" strokeWidth={1} />
                <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-mono font-bold">Select Order Trace</h3>
                <p className="text-xs text-zinc-500 font-light max-w-sm mx-auto leading-relaxed">
                  Click on any client catalog order from the left-hand directory list to load, inspect, update database status, and process custom measurements.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
