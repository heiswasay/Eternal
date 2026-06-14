import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, Truck, Receipt, Home, Calendar, Clipboard } from "lucide-react";

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("latest_eternal_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [navigate]);

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
