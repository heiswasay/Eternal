import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart, formatPrice, parsePrice } from "../context/CartContext";

export const CartSlideOver: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    formattedSubtotal,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckoutInit = () => {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-[100] cursor-pointer"
          />

          {/* Cart Panel Sliding from the Right */}
          <motion.div
            id="cart-drawer-container"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-zinc-950 border-l border-white/10 z-[110] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header section */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-zinc-400 font-light" strokeWidth={1.5} />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white">
                  Sartorial Bag
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors cursor-pointer outline-none"
                aria-label="Close panel"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* MAIN CONTENT WORKFLOW */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 scrollbar-none">
              <div className="flex flex-col h-full justify-between">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center my-auto">
                    <ShoppingBag size={48} className="text-zinc-800 mb-6 font-thin" strokeWidth={1} />
                    <h3 className="serif text-xl mb-2 text-zinc-300">Your Bag is Empty</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-xs mb-8">
                      No bespoke pieces have been selected yet. Add the finest shoes to continue.
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-8 py-3 bg-white text-black text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-200 transition-all rounded-sm uppercase cursor-pointer"
                    >
                      Keep Exploring
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-white/5 bg-zinc-900/30 rounded-sm hover:border-white/10 transition-colors"
                      >
                        {/* Product mini-plate */}
                        <div className="w-20 h-24 bg-zinc-950 border border-white/10 shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Product info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="serif text-sm text-white font-medium uppercase leading-tight">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-zinc-600 hover:text-white transition-colors cursor-pointer p-1"
                                aria-label="Remove item"
                              >
                                <Trash2 size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                            <span className="inline-block mt-1 px-2.5 py-0.5 border border-white/10 bg-white/5 rounded-sm font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-400">
                              Size: EU {item.size}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Tweak controls */}
                            <div className="flex items-center border border-white/10 bg-zinc-950 rounded-sm">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1.5 px-2.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={10} strokeWidth={2} />
                              </button>
                              <span className="font-mono text-[10px] text-white px-2 min-w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1.5 px-2.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={10} strokeWidth={2} />
                              </button>
                            </div>

                            {/* Sum price */}
                            <span className="serif text-xs text-white">
                              {formatPrice(parsePrice(item.price) * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom aggregate section (Cart subtotal triggers) */}
            {cartItems.length > 0 && (
              <div className="p-6 md:p-8 bg-zinc-950 border-t border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Curated Delivery</span>
                    <span className="text-[11px] font-mono text-white tracking-[0.1em] mt-1 font-semibold">Complimentary Express</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Subtotal</span>
                    <span className="serif text-xl text-white font-semibold mt-1">{formattedSubtotal}</span>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2" />

                <button
                  onClick={handleCheckoutInit}
                  className="w-full bg-white text-black py-4.5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight size={12} strokeWidth={2} />
                </button>

                <div className="flex items-center justify-center gap-2 mt-2 opacity-50">
                  <ShieldCheck size={11} className="text-zinc-400" />
                  <span className="text-[8px] uppercase tracking-[0.25em] text-zinc-400">10-Year Lifetime Repair Warranty Included</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
