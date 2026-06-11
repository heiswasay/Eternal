import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, Instagram, Twitter, ArrowRight, Sparkles, Compass, Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../App";

export const MenuSlideOver: React.FC = () => {
  const { isMenuOpen, setMenuOpen } = useCart();
  const [isCollectionsCollapsed, setIsCollectionsCollapsed] = useState(false);
  const { products } = useProducts();

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black z-[100] cursor-pointer"
          />

          {/* Menu Panel sliding from Left to Right */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 260 }}
            className="fixed top-0 left-0 h-full w-full sm:w-[380px] bg-zinc-950 border-r border-white/10 z-[110] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header section with centered brand logo identical in styling to the main page */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
              {/* Left empty spacer to keep ETERNAL perfectly centered */}
              <div className="flex-1 min-w-[80px]" />
              
              <div className="flex-none text-center">
                <Link 
                  onClick={() => setMenuOpen(false)} 
                  to="/" 
                  className="text-lg serif font-bold tracking-tighter text-white hover:opacity-85 transition-all block"
                >
                  ETERNAL
                </Link>
              </div>

              <div className="flex-1 flex justify-end min-w-[80px]">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors cursor-pointer outline-none"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-none flex flex-col justify-between">
              <div className="flex flex-col gap-8">
                {/* Search Bar */}
                <div className="relative flex items-center bg-zinc-900/60 border border-white/5 rounded-sm px-3.5 py-2.5 mb-2 focus-within:border-white/20 transition-all">
                  <Search size={14} className="text-zinc-400 mr-2.5 animate-pulse" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="SEARCH ARTISANAL PIECES..."
                    className="bg-transparent text-[9px] tracking-[0.25em] outline-none w-full uppercase text-white font-medium placeholder-zinc-600 focus:placeholder-zinc-400 transition-colors"
                  />
                </div>

                {/* Home option */}
                <div className="border-b border-white/5 pb-4">
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/"
                    className="text-xs uppercase tracking-[0.4em] font-medium text-white hover:text-zinc-400 transition-all block py-2"
                  >
                    Home
                  </Link>
                </div>

                {/* Collections Option identical to desktop layout */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setIsCollectionsCollapsed(!isCollectionsCollapsed)}
                    className="flex justify-between items-center w-full py-2 text-left outline-none group"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-zinc-400 group-hover:text-white transition-colors">
                      Collections
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-zinc-500 group-hover:text-white transition-transform duration-300 ${
                        isCollectionsCollapsed ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {!isCollectionsCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col gap-4 pl-4 border-l border-white/10 py-1"
                      >
                        {products.map((item, idx) => (
                          <Link
                            key={item.id || item.slug}
                            to={`/product/${item.slug}`}
                            className="group flex flex-col"
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="text-[8px] text-zinc-500 mb-0.5 font-mono">0{idx + 1}</span>
                            <span className="text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-all font-light">
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bespoke Option */}
                <div className="border-t border-white/5 pt-4">
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/#heritage"
                    className="text-xs uppercase tracking-[0.4em] font-medium text-zinc-300 hover:text-white transition-all block py-2"
                  >
                    Bespoke
                  </Link>
                </div>

                {/* Atelier Option */}
                <div className="border-t border-white/5 pt-4">
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/atelier"
                    className="text-xs uppercase tracking-[0.4em] font-medium text-zinc-300 hover:text-white transition-all block py-2"
                  >
                    The Atelier
                  </Link>
                </div>
              </div>

              {/* Footer details inside Drawer */}
              <div className="border-t border-white/5 pt-8 mt-auto">
                <div className="flex gap-6 mb-6">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} strokeWidth={1.5} />
                  </a>
                </div>
                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                  © 2026 ETERNAL ARTISANS
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
