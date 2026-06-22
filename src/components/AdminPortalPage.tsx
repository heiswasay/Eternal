import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCw,
  Database,
  Grid,
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
  AlertCircle
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
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Load Auth State from SessionStorage to support fluid refreshes
  useEffect(() => {
    const isAuthed = sessionStorage.getItem("atelier_admin_auth") === "true";
    if (isAuthed) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders from database helper
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrdersFromDb();
      setOrders(data);
      if (data.length > 0 && !selectedOrder) {
        setSelectedOrder(data[0]);
      } else if (selectedOrder) {
        // Keeps selected reference updated
        const updatedSelected = data.find((o) => (o.id === selectedOrder.id || o.orderId === selectedOrder.orderId));
        if (updatedSelected) {
          setSelectedOrder(updatedSelected);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
    if (username.trim() === "abbas" && password === "abbas") {
      sessionStorage.setItem("atelier_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid administrator credentials. Access denied.");
    }
  };

  // Handle Log Out
  const handleLogOut = () => {
    sessionStorage.removeItem("atelier_admin_auth");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Handle status updates
  const handleUpdateStatus = async (orderId: string, newStatus: "new" | "under process" | "delivered" | "cancel") => {
    if (!orderId) return;
    setUpdatingOrderId(orderId);
    setSyncMessage(null);
    try {
      const success = await updateOrderStatusInDb(orderId, newStatus);
      if (success) {
        setSyncMessage(`Order status securely updated to "${newStatus}"`);
        
        // Optimistically mutate order list state to prevent lagging
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id === orderId) {
              return { ...o, status: newStatus };
            }
            return o;
          })
        );

        // Update selected order view
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }

        // Auto clean message feedback
        setTimeout(() => setSyncMessage(null), 3000);
      } else {
        setSyncMessage("Error: Sync failed. Stored locally.");
      }
    } catch (err: any) {
      console.error(err);
      setSyncMessage("Sync failure on Firestore. Reverting to safe buffers.");
    } finally {
      setUpdatingOrderId(null);
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

  // Calculate quick metrics
  const stats = {
    total: orders.length,
    newCount: orders.filter((o) => o.status === "new").length,
    processing: orders.filter((o) => o.status === "under process").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancel").length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/25";
      case "under process":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/25";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
      case "cancel":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/25";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25";
    }
  };

  const displaySize = (size: any) => {
    if (!size) return "N/A";
    const str = String(size);
    if (str.includes("US") || str.includes("EU") || str.includes("UK")) return str;
    return `EU ${str}`;
  };

  // -------------------------------------------------------------
  // RENDERING THE SECURE ADMINISTRATOR LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 relative overflow-hidden text-white font-sans selection:bg-amber-500 selection:text-black">
        {/* Decorative backdrop mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm relative z-10 space-y-8">
          {/* Brand/Heading block */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-[0.4em] font-mono block">
              Atelier Workshop
            </span>
            <h1 className="text-3xl font-light tracking-tight text-white uppercase">
              Secure Ledger Status
            </h1>
            <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
              Please declare credentials to access central master customer orders.
            </p>
          </div>

          {/* Form Card */}
          <div className="border border-white/10 bg-zinc-900/40 p-8 rounded-lg backdrop-blur-md shadow-2xl relative">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Administrative Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (abbas)"
                    className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500/60 rounded px-4 py-3 text-sm outline-none transition-all placeholder-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Private Access Password
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-3.5 text-zinc-600">
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500/60 rounded px-4 py-3 text-sm outline-none transition-all placeholder-zinc-700 font-mono"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 hover:text-black font-semibold text-xs text-amber-400 uppercase tracking-widest transition-all rounded shadow-lg shadow-amber-500/5 cursor-pointer"
              >
                Request Authorization
              </button>
            </form>
          </div>

          <p className="text-[10px] text-zinc-650 font-mono text-center tracking-wider text-zinc-600">
            SECURE PORT PORTAL // 2026 ETERNAL SHOP
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDERING THE COMPLETE ORDERS MANAGEMENT HUB
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans pt-24 pb-20 px-4 md:px-8 selection:bg-amber-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header controller */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-mono text-xs font-semibold">
                ADMIN CONSOLE
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                Live Ledger Pipeline
              </span>
            </div>
            <h1 className="text-3xl font-light text-white uppercase tracking-tight">
              Order Dispatch Dashboard
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl font-light">
              Connected live via Cloud Firestore. View, organize, search, and update placed client ledger records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="px-4 py-2 bg-zinc-900 border border-white/10 hover:border-white/20 text-xs font-medium rounded flex items-center gap-2 cursor-pointer transition-colors text-white disabled:opacity-40"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "Refreshing..." : "Reload Orders"}</span>
            </button>

            <button
              onClick={handleLogOut}
              className="px-4 py-2 bg-rose-950/10 border border-rose-900/30 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 text-xs font-medium rounded flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* METRIC PILLS BOARD */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="border border-white/10 bg-zinc-900/10 p-4 rounded-md">
            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">Total placed</span>
            <div className="text-2xl font-normal text-white mt-1">{stats.total}</div>
          </div>
          <div className="border border-blue-500/10 bg-blue-500/5 p-4 rounded-md">
            <span className="text-[10px] text-blue-400 uppercase font-mono tracking-widest block flex items-center gap-1">
              <Clock size={10} />
              <span>New</span>
            </span>
            <div className="text-2xl font-normal text-white mt-1">{stats.newCount}</div>
          </div>
          <div className="border border-amber-500/10 bg-amber-500/5 p-4 rounded-md">
            <span className="text-[10px] text-amber-400 uppercase font-mono tracking-widest block flex items-center gap-1">
              <RotateCw size={10} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>Under Process</span>
            </span>
            <div className="text-2xl font-normal text-white mt-1">{stats.processing}</div>
          </div>
          <div className="border border-emerald-500/10 bg-emerald-500/5 p-4 rounded-md">
            <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest block flex items-center gap-1">
              <CheckCircle2 size={10} />
              <span>Delivered</span>
            </span>
            <div className="text-2xl font-normal text-white mt-1">{stats.delivered}</div>
          </div>
          <div className="border border-rose-500/10 bg-rose-500/5 col-span-2 lg:col-span-1 p-4 rounded-md">
            <span className="text-[10px] text-rose-400 uppercase font-mono tracking-widest block flex items-center gap-1">
              <Ban size={10} />
              <span>Cancelled</span>
            </span>
            <div className="text-2xl font-normal text-white mt-1">{stats.cancelled}</div>
          </div>
        </div>

        {/* FILTERING AND SEARCH HUB */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border border-white/5 bg-zinc-900/20 p-4 rounded-md">
          {/* Left search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-zinc-500">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, email, phone, city..."
              className="w-full bg-zinc-950/80 border border-white/10 rounded pl-10 pr-4 py-2.5 text-xs outline-none focus:border-amber-500/40 text-white placeholder-zinc-650"
            />
          </div>

          {/* Status filter selection tabs */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-zinc-500 flex items-center gap-1 mr-1">
              <ListFilter size={13} />
              <span>Workflow Stage:</span>
            </span>
            {["all", "new", "under process", "delivered", "cancel"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium tracking-wide rounded border uppercase cursor-pointer transition-colors ${
                  filterStatus === st
                    ? "bg-amber-400 text-black border-amber-400"
                    : "bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* FEEDBACK STRIP */}
        <AnimatePresence>
          {syncMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3 bg-amber-500/10 border border-amber-500/20 rounded font-medium text-xs text-amber-400 text-center"
            >
              {syncMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN LEDGER INTERACTIVE SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ORDERS DIRECTORY COLUMN - 5 Columns span */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
                Placed Registers ({filteredOrders.length})
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">
                Sorted by Recency
              </span>
            </div>

            {isLoading ? (
              <div className="border border-white/5 bg-zinc-900/10 p-12 text-center rounded-md space-y-4">
                <RotateCw size={24} className="animate-spin text-amber-500 mx-auto" />
                <p className="text-xs text-zinc-500">Querying live Secure Cloud Ledger...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 text-center rounded-md">
                <span className="text-xs text-zinc-500 block mb-1">No customer orders matching query found</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest block font-mono">0 matching traces</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredOrders.map((ord) => (
                  <button
                    key={ord.id || ord.orderId}
                    onClick={() => setSelectedOrder(ord)}
                    className={`w-full text-left p-4 rounded border transition-all relative overflow-hidden block cursor-pointer ${
                      selectedOrder?.orderId === ord.orderId
                        ? "bg-zinc-900/90 border-amber-500/40 text-white"
                        : "bg-zinc-950 hover:bg-zinc-900/50 border-white/5 hover:border-white/10 text-zinc-400"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-amber-500">
                          {ord.orderId}
                        </span>
                        <h4 className="text-xs font-semibold text-white mt-1">
                          {ord.customerName}
                        </h4>
                        <span className="text-[10px] font-light text-zinc-400 block mt-0.5">
                          {ord.customerPhone} &bull; {ord.totalPrice}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-medium ${getStatusStyle(ord.status)}`}>
                          {ord.status}
                        </span>
                        <span className="text-[9px] text-zinc-600 font-mono flex items-center gap-1">
                          <Calendar size={10} />
                          <span>
                            {new Date(ord.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW DETAILED CONTROLS BOARD - 7 Columns span */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="border border-white/10 bg-zinc-900/45 p-6 md:p-8 rounded-lg space-y-6 relative overflow-hidden backdrop-blur-md">
                {/* Decorative spotlight blur */}
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badge bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      Inspect Record Trace
                    </span>
                    <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                      <span className="text-amber-500">{selectedOrder.orderId}</span>
                      {selectedOrder.id?.startsWith("local_") && (
                        <span className="text-[9px] font-sans px-1.5 py-0.3 uppercase tracking-wider font-normal bg-zinc-850 text-amber-500 border border-white/5 rounded">Local Fallback</span>
                      )}
                    </h3>
                  </div>

                  {/* Active workflow pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">CURRENT STATE:</span>
                    <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded ${getStatusStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* STAGE MUTATION BUTTON CONTROLLER - USER EXPLICIT REQUEST */}
                <div className="p-4 bg-zinc-950 border border-white/5 rounded-md space-y-3">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">
                    Mutate Order Status Flow
                  </span>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {[
                      { key: "new", label: "New Stage", color: "hover:bg-blue-500 hover:text-white border-blue-500/20 text-blue-400" },
                      { key: "under process", label: "Processing", color: "hover:bg-amber-500 hover:text-black border-amber-500/20 text-amber-400" },
                      { key: "delivered", label: "Delivered", color: "hover:bg-emerald-500 hover:text-white border-emerald-500/20 text-emerald-400" },
                      { key: "cancel", label: "Cancel order", color: "hover:bg-rose-500 hover:text-white border-rose-500/20 text-rose-400" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        disabled={updatingOrderId !== null}
                        onClick={() => handleUpdateStatus(selectedOrder.id || "", btn.key as any)}
                        className={`px-2 py-2 border text-2xs font-semibold uppercase tracking-wider rounded cursor-pointer transition-all disabled:opacity-30 ${btn.color} ${
                          selectedOrder.status === btn.key
                            ? "bg-zinc-900 border-white/30 text-white font-black"
                            : "bg-zinc-950 bg-opacity-70"
                        }`}
                      >
                        {updatingOrderId === selectedOrder.id ? (
                          <RotateCw size={10} className="animate-spin mx-auto" />
                        ) : (
                          <span>{btn.label}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CUSTOMER CONTACT DOSSIER CARD */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block border-b border-white/5 pb-1">
                    Customer Dossier
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light space-y-2 md:space-y-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 shrink-0">
                          <ChevronRight size={13} className="text-amber-500" />
                        </span>
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Full name</span>
                          <span className="text-white font-medium text-sm">{selectedOrder.customerName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 shrink-0">
                          <Phone size={13} />
                        </span>
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Phone number</span>
                          <a href={`tel:${selectedOrder.customerPhone}`} className="text-zinc-300 hover:text-amber-400 transition-colors font-medium">
                            {selectedOrder.customerPhone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 shrink-0">
                          <Mail size={13} />
                        </span>
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Email Address</span>
                          <a href={`mailto:${selectedOrder.customerEmail}`} className="text-zinc-300 hover:text-amber-400 transition-colors font-mono">
                            {selectedOrder.customerEmail}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <MapPin size={13} />
                        </span>
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Postal address</span>
                          <span className="text-zinc-300 leading-normal block">{selectedOrder.customerAddress}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-zinc-500 shrink-0 mt-0.5">
                          <FileText size={13} />
                        </span>
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Customer Notes</span>
                          <span className="text-amber-500 leading-normal font-light italic block">
                            {selectedOrder.notes || "No special instructions provided."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTWEAR ORDER LINES TABLE */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block border-b border-white/5 pb-1">
                    Acquired Articles Inventory
                  </span>

                  <div className="border border-white/5 rounded overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-950 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                        <tr>
                          <th className="p-3">Article details</th>
                          <th className="p-3 text-center">Selected Size</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <tr key={index} className="hover:bg-zinc-950/20">
                            <td className="p-3 font-medium text-white flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} className="w-8 h-8 object-cover rounded border border-white/10 shrink-0" alt="" />
                              )}
                              <span>{item.name}</span>
                            </td>
                            <td className="p-3 text-center font-mono text-zinc-300">
                              {displaySize(item.size)}
                            </td>
                            <td className="p-3 text-center text-zinc-400">
                              {item.quantity}
                            </td>
                            <td className="p-3 text-right font-mono text-white">
                              {item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pricing Total block */}
                  <div className="flex items-center justify-between p-4 bg-zinc-950 rounded border border-white/5 font-mono text-xs">
                    <span className="text-zinc-500 uppercase tracking-wider">Payment Method: {selectedOrder.paymentMethod || "COD"}</span>
                    <div className="text-right">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] mr-2">Grand Total:</span>
                      <strong className="text-amber-500 text-sm font-bold">{selectedOrder.totalPrice}</strong>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="border border-white/5 bg-zinc-900/10 p-16 text-center rounded-lg space-y-4">
                <Database size={40} className="text-zinc-700 animate-pulse mx-auto font-thin" strokeWidth={1} />
                <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-mono">Select Order Trace</h3>
                <p className="text-xs text-zinc-500 font-light max-w-sm mx-auto leading-relaxed">
                  Click on any customer order record from the side ledger panel directories to load and inspect their billing dossier details.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
