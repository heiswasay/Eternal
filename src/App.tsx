/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown, Instagram, Twitter, Menu, X, Search, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, Sliders, Sparkles, Check, Compass, Clock, Activity } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ProductStory } from "./components/ProductStory";
import AtelierPage from "./components/AtelierPage";
import { CartProvider, useCart } from "./context/CartContext";
import { CartSlideOver } from "./components/CartSlideOver";
import { MenuSlideOver } from "./components/MenuSlideOver";
import { CheckoutPage } from "./components/CheckoutPage";
import { ThankYouPage } from "./components/ThankYouPage";
import heroImage from "./images/hero3.jpeg";
import hero1Image from "./images/hero1-1.jpeg";
import hero2Image from "./images/hero2.jpeg";
import heritageImage from "./images/blackoxford.jpg";
import img1 from "./images/1.jpg";
import img2 from "./images/2.jpg";
import img3 from "./images/3.jpg";
import img4 from "./images/4.jpg";
import bo1Image from "./images/bo1.jpeg";
import bo2Image from "./images/bo2.jpeg";
import bo3Image from "./images/bo3.jpeg";
import bo4Image from "./images/bo4.jpeg";
import bo5Image from "./images/bo5.jpeg";
import bo6Image from "./images/bo6.jpeg";
import bo7Image from "./images/bo7.jpeg";
import bo8Image from "./images/bo8.jpeg";
import footerImg from "./images/footer.jpg";
import box1Image from "./images/box1.jpeg";
import bo9Image from "./images/bo9.jpeg";
import boo1Image from "./images/boo1.jpeg";
import boo3Image from "./images/boo3.jpeg";
import boo4Image from "./images/boo4.jpeg";
import boo5Image from "./images/boo5.jpeg";
import boo6Image from "./images/boo6.jpeg";
import boo8Image from "./images/boo8.jpeg";
import boo9Image from "./images/boo9.jpeg";
import boo10Image from "./images/boo10.jpeg";
import boo11Image from "./images/boo11.jpeg";
import layersbooImage from "./images/layersboo.png";

import m1Image from "./images/m1.jpeg";
import m2Image from "./images/m2.jpeg";
import m3Image from "./images/m3.jpeg";
import m4Image from "./images/m4.jpeg";
import m5Image from "./images/m5.jpeg";
import m6Image from "./images/m6.jpeg";
import m7Image from "./images/m7.jpeg";
import m8Image from "./images/m8.jpeg";
import m9Image from "./images/m9.jpeg";
import m10Image from "./images/m10.jpeg";
import m11Image from "./images/m11.jpeg";

interface SpecType {
  type: string;
  leather: string;
  leatherDetail: string;
  sole: string;
  soleDetail: string;
  laces: string;
  lacesDetail: string;
  lining: string;
  construction: string;
  leatherImage?: string;
  soleImage?: string;
  lacesImage?: string;
  anatomyImage?: string;
  layersImage?: string;
}

interface CollectionItemInfo {
  id: number;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  slug: string;
  description: string;
  specs: SpecType;
}

const COLLECTIONS: CollectionItemInfo[] = [
  {
    id: 1,
    name: "Brown Oxford Leather",
    price: "PKR 5,950",
    image: bo1Image,
    images: [bo1Image, bo2Image, bo3Image, bo4Image, bo5Image, bo6Image, bo7Image, bo8Image],
    category: "Hand Made",
    slug: "brown-oxford-leather",
    description: "The height of sartorial elegance, featuring hand-burnished leather and artisanal buckle detailing.",
    specs: {
      type: "Semi-Brogue Captoe Oxford",
      leather: "Mahogany Burnished Alpine Calfskin",
      leatherDetail: "Full-grain textured French Box-Calf leather featuring a magnificent, deep mahogany burnish. Selected for its highly resilient, dense grain structure that holds up wonderfully to moist weather.",
      sole: "Double-Leather Oak Bark Outsole with Brass Pin Protection",
      soleDetail: "Ultra-durable double-thickness sole, constructed of genuine oak-bark bend leather. Reinforced with 15 hand-driven solid brass pegs on the shank and a beautiful flush gold-plated steel toe-cap protection.",
      laces: "Round-Braided Corded Egyptian Cotton Waxed Laces",
      lacesDetail: "Meticulously braided round Egyptian cotton laces, deeply impregnated with natural wax. Slides smoothly and cleanly through nickel-plated metal eyelets without binding.",
      lining: "Butter-Soft Full-Grain Tan Calf Lining",
      construction: "270-Degree Goodyear Welt"
    }
  },
  {
    id: 2,
    name: "Monk Strap",
    price: "PKR 5,950",
    image: m8Image,
    images: [m8Image, m1Image, m3Image, m2Image, m4Image, m5Image],
    category: "Hand Made",
    slug: "monk-strap",
    description: "A timeless classic in a rich cognac hue, featuring a hand-welted sole for unparalleled durability.",
    specs: {
      type: "Double Monk Strap Dress Shoe",
      leather: "Aniline-Dyed Museum Calfskin (Cognac Brown Patina)",
      leatherDetail: "Individually hand-burnished aniline-dyed calfskin with a distinctive marbleized museum effect. Prepared using organic tree bark extracts and finished with countless hand-applied layers of mineral cream wax.",
      sole: "Hand-Welted Italian Oak-Bark Outsole with Stacked Specialty Heel",
      soleDetail: "Double-tanned dense oak-bark outsole that offers exceptional shock absorption and orthopedic flexibility. Hand-cut and polished edges with subtle hand-stamped decorative detailing on the waist.",
      laces: "Double Brass Buckle Straps with Hidden Elastic Anchor Guards",
      lacesDetail: "Instead of standard laces, this masterpiece is secured with two adjustable solid brass buckles individually cast in Florence, held securely by soft, heavy-grade hidden elastic segments to optimize standard flex.",
      lining: "Hand-Selected Glove-Grade Milled Sheepskin Lining",
      construction: "Rapid Blake stitch",
      leatherImage: m10Image,
      soleImage: m11Image,
      lacesImage: m6Image
    }
  },
  {
    id: 3,
    name: "Black Oxford Leather",
    price: "PKR 5,950",
    image: boo1Image,
    images: [boo1Image, boo3Image, boo4Image, boo5Image, boo8Image, boo9Image],
    category: "Hand Made",
    slug: "black-oxford-leather",
    description: "Our signature piece, hand-stitched over 48 hours using the finest full-grain Italian calfskin.",
    specs: {
      type: "Wholecut Bespoke Oxford",
      leather: "Ultra-Premium Full-Grain Italian Box-Calf (Tuscan Tannery)",
      leatherDetail: "Sourced from an antique artisan tannery in Tuscany, Italy. We select only the top 3% of unblemished aniline skins. Naturally supple and highly breathable, this pristine box-calf develops a beautiful deep mirror-like glaze with age.",
      sole: "Hand-Stitched Closed-Channel Goodyear Welt Outsole with Fiddleback Waist",
      soleDetail: "A multi-layered oak-bark tanned leather outsole with a traditional 270-degree hand-sewn welt. Features a hand-carved, highly defined fiddleback waist and a stacked solid leather heel for maximum stability.",
      laces: "Flat-Braided Waxed Giza Cotton Laces",
      lacesDetail: "Tightly-braided, extra-long-staple Egyptian Giza cotton fibres treated with an ultra-thin coating of natural organic beeswax for high tensile strength, fray prevention, and an enduring secure knot.",
      lining: "Hand-Dyed Glove-Grade Italian Calf-Lining",
      construction: "Handwelted Goodyear",
      leatherImage: boo6Image,
      soleImage: boo11Image,
      lacesImage: boo10Image,
      anatomyImage: boo9Image,
      layersImage: layersbooImage
    }
  }
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Nav = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { totalCount, setCartOpen, setMenuOpen } = useCart();
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 md:py-6 flex items-center bg-black/80 backdrop-blur-lg border-b border-white/5 transition-all">
      {/* Search Overlay for Mobile */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-lg z-[120] flex items-center px-6"
          >
            <div className="relative w-full flex items-center max-w-lg mx-auto">
              <Search size={18} className="text-zinc-400 mr-4" strokeWidth={1.5} />
              <input 
                type="text"
                placeholder="SEARCH FOR ARTISANAL PIECES..."
                className="bg-transparent border-b border-white/30 text-xs tracking-widest outline-none w-full pb-2 uppercase text-white"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="ml-4 p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: Hamburger Menu (Mobile) / Left Links (Desktop) */}
      <div className="flex-1 flex justify-start items-center">
        {/* Toggle mobile menu */}
        <button 
          onClick={() => setMenuOpen(true)} 
          className="md:hidden p-1 hover:opacity-50 transition-opacity text-white flex items-center justify-center outline-none"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Left Links */}
        <div className={`hidden md:flex gap-8 text-[10px] uppercase tracking-[0.3em] font-semibold ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex gap-8 relative">
            <div 
              className="relative py-2 group"
              onMouseEnter={() => setIsCollectionsHovered(true)}
              onMouseLeave={() => setIsCollectionsHovered(false)}
            >
              <Link to={isHomePage ? "#collection" : "/#collection"} className="hover:opacity-50 transition-opacity flex items-center gap-2 text-white">
                Collections <ChevronDown size={10} className={`transition-transform duration-300 ${isCollectionsHovered ? 'rotate-180' : ''}`} />
              </Link>
              
              <AnimatePresence>
                {isCollectionsHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 pt-4"
                  >
                    <div className="bg-black/95 border border-soft p-6 w-64 backdrop-blur-xl shadow-2xl">
                      <div className="flex flex-col gap-4">
                        {COLLECTIONS.map((item) => (
                          <Link 
                            key={item.id} 
                            to={`/product/${item.slug}`} 
                            className="group/item flex flex-col"
                            onClick={() => setIsCollectionsHovered(false)}
                          >
                            <span className="text-[9px] text-zinc-500 mb-1 opacity-60 font-mono">0{item.id}</span>
                            <span className="hover:text-zinc-400 text-white transition-colors tracking-[0.2em]">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/#heritage" className="hover:opacity-50 transition-opacity py-2 text-white">Bespoke</Link>
            <Link to="/atelier" className="hover:opacity-50 transition-opacity py-2 text-white">The Atelier</Link>
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Perfectly Centered Brand Name Logo */}
      <div className="flex-none flex justify-center items-center">
        <Link to="/" className="text-xl md:text-3xl serif font-bold tracking-tighter text-center text-white hover:opacity-85 transition-all">
          ETERNAL
        </Link>
      </div>

      {/* RIGHT COLUMN: Controls (Search and Bag) Together side-by-side */}
      <div className="flex-1 flex gap-4 md:gap-8 justify-end items-center text-[10px] uppercase tracking-[0.3em] font-semibold text-white">
        {/* Search trigger */}
        <div className="relative hidden md:flex items-center">
          <motion.div
            animate={{ x: (isSearchOpen && window.innerWidth > 768) ? -170 : 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex items-center"
          >
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-50 transition-opacity cursor-pointer flex items-center z-10 p-1 text-white"
              aria-label="Search items"
            >
              {isSearchOpen ? <X size={14} className="hidden md:block" /> : <Search size={18} strokeWidth={1.5} />}
            </button>
            
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 150, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden ml-4 hidden md:block"
                >
                  <input 
                    type="text"
                    placeholder="SEARCH..."
                    className="bg-transparent border-b border-white/30 text-[10px] tracking-[0.2em] outline-none w-full pb-1 uppercase text-white font-semibold"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Bag/Cart Trigger */}
        <button 
          onClick={() => setCartOpen(true)}
          className="cursor-pointer flex items-center gap-2 hover:opacity-75 transition-all outline-none font-semibold text-[10px] uppercase tracking-[0.3em] bg-transparent text-white border-none p-1"
        >
          Bag <span className="opacity-40 italic">({totalCount})</span>
        </button>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const slides = [
    { src: hero2Image, fallback: heroImage, alt: "Savor The Luxury - Master Craftsmanship" },
    { src: hero1Image, fallback: heroImage, alt: "Savor The Luxury - Artisanal Shoemaking" },
    { src: heroImage, fallback: hero1Image, alt: "Savor The Luxury - The Atelier Collection" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full">
      <header className="relative h-[100dvh] md:h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Background Image Carousel: Only images slide/fade, content remains static */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 1.05 }}
              animate={{ opacity: 1, x: 0, scale: 1.02 }}
              exit={{ opacity: 0, x: -50, scale: 1.0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ y }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={slides[currentIndex].src} 
                alt={slides[currentIndex].alt}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Graceful fallback
                  e.currentTarget.src = slides[currentIndex].fallback;
                }}
                className="w-full h-full object-cover opacity-80"
              />
            </motion.div>
          </AnimatePresence>
          {/* Deep, rich, multi-stop dark overlay for extreme luxury look and solid text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-zinc-950 z-[1] pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)) z-[1] pointer-events-none" />
        </div>

        {/* Floating atelier location parameters */}
        <div className="absolute top-24 right-6 md:right-12 font-mono text-[8px] sm:text-[9px] tracking-[0.4em] text-zinc-400 uppercase z-10 hidden sm:block">
          BY INVITATION ONLY
        </div>

        {/* Center main immersive layout with left alignment - completely static */}
        <main className="flex-1 flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 xl:px-32 relative z-10 text-left max-w-4xl mr-auto space-y-6 md:space-y-8 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="space-y-4"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.8em] text-zinc-500 block font-mono">
              ESTABLISHED 2020, LAHORE
            </span>
            <h1 className="serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none tracking-tight font-light">
              Savor The <br />
              <span className="italic font-light text-zinc-300">Luxury</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-16 h-px bg-white/20 ml-0 mr-auto"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-zinc-400 max-w-md mr-auto font-light text-[11px] sm:text-xs uppercase tracking-[0.25em] leading-relaxed"
          >
            <span className="hidden sm:inline">
              An uncompromising commitment to bespoke shoemaking. Crafted solely by hand, single-needle stitched, finished with organic bee wax.
            </span>
            <span className="inline sm:hidden">
              Hand-crafted bespoke shoemaking. Finished with organic wax.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="pt-6"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("collection");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="border border-white/40 bg-zinc-950/20 backdrop-blur-md text-white hover:bg-white hover:text-black py-3 sm:py-4 px-7 sm:px-10 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-semibold transition-all duration-300 rounded-sm cursor-pointer"
            >
              Explore The Craft
            </button>
          </motion.div>
        </main>

        {/* Manual Slider Navigation Panel */}
        <div className="absolute right-6 md:right-12 bottom-8 sm:bottom-12 md:bottom-28 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/5 px-4 py-2 rounded-sm">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <div className="flex gap-1.5 px-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-4" : "bg-white/20 hover:bg-white/45"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Footer layout as separate responsive element: absolute on desktop, relative flow on mobile */}
      <footer className="w-full relative md:absolute md:bottom-0 md:left-0 z-10 px-6 md:px-12 pb-8 sm:pb-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 bg-zinc-950 md:bg-zinc-950/15 md:backdrop-blur-sm">
        {/* Left: Minimal studio contact details */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
          <div className="space-y-1">
            <span className="block text-[8px] font-mono tracking-widest text-zinc-600 uppercase">ATELIER CONTACTS</span>
            <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              +92 (042) 111-2020-01 &bull; support@eternal.com.pk
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/10" />
          <div className="space-y-1">
            <span className="block text-[8px] font-mono tracking-widest text-zinc-600 uppercase">LOCATION</span>
            <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              LAHORE &bull; KARACHI &bull; ISLAMABAD
            </span>
          </div>
        </div>

        {/* Center: Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
          onClick={() => {
            const el = document.getElementById("collection");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-mono">explore</span>
          <ChevronDown size={12} strokeWidth={1} className="text-white" />
        </motion.div>

        {/* Right: Copyright info */}
        <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-mono">
          © 2026 ETERNAL ARTISANS
        </div>
      </footer>
    </div>
  );
};

// Visual Tickers & Trust Highlights (replaces the old Marquee)
const SartorialPledgeTicker = () => {
  return (
    <div className="bg-luxury-black border-y border-white/5">
      {/* Seamless Floating Values Marquee */}
      <div className="py-6 overflow-hidden bg-zinc-950/40 relative flex items-center select-none">
        <div className="flex animate-scroll whitespace-nowrap gap-16 items-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-16 items-center shrink-0">
              <span className="serif italic text-base md:text-lg text-zinc-400 opacity-60">Traditional Handsewn Goodyear Welt</span>
              <div className="w-1 h-1 rounded-full bg-white opacity-25" />
              <span className="serif italic text-base md:text-lg text-zinc-400 opacity-60">100% Vegetable-Tanned Full-Grain Hides</span>
              <div className="w-1 h-1 rounded-full bg-white opacity-25" />
              <span className="serif italic text-base md:text-lg text-zinc-400 opacity-60">Custom Cork Bed Cushioning</span>
              <div className="w-1 h-1 rounded-full bg-white opacity-25" />
              <span className="serif italic text-base md:text-lg text-zinc-400 opacity-60">Anatomical Walnut Wood Lasting</span>
              <div className="w-1 h-1 rounded-full bg-white opacity-25" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Redesigned Collections Display
const Collection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "oxford" | "monk">("all");
  const { addToCart } = useCart();

  const filteredItems = COLLECTIONS.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "oxford") return item.slug.includes("oxford");
    if (selectedCategory === "monk") return item.slug.includes("monk");
    return true;
  });

  return (
    <section id="collection" className="bg-luxury-black text-white pt-20 pb-24 md:pt-32 md:pb-40 relative overflow-hidden">
      {/* Dynamic Background Title Grid */}
      <div className="absolute top-0 left-0 w-full text-center opacity-[0.015] pointer-events-none select-none">
        <span className="serif text-[35vw] leading-none uppercase italic block font-bold">LEGACY</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Dynamic Header Block */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-500 mb-4 block font-mono">CURATED SERIES</span>
          <h2 className="serif text-4xl sm:text-6xl md:text-7.5xl tracking-tight leading-none mb-4">
            The <span className="italic font-light">Editions</span>
          </h2>
          <p className="text-zinc-500 max-w-sm font-light text-[11px] sm:text-xs uppercase tracking-widest leading-relaxed mb-10">
            A precise trilogy of shoemaking silhouettes. Each pair holds a legacy and matures distinctively according to your journey.
          </p>

          {/* Clean Segmented Category Tabs with solid touch areas */}
          <div className="flex gap-2 sm:gap-4 p-1 border border-white/5 bg-zinc-950/80 rounded-sm">
            {[
              { id: "all", label: "All Works" },
              { id: "oxford", label: "Classic Oxfords" },
              { id: "monk", label: "Monk Straps" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-bold rounded-sm transition-all focus:outline-none ${
                  selectedCategory === tab.id 
                    ? "bg-white text-black" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetrical Rich Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const mainStyle = item.specs?.type || "Bespoke Cut";
              const firstClassWord = item.name.split(" ")[0];
              const restClassWord = item.name.split(" ").slice(1).join(" ");
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col border border-white/5 bg-zinc-950/20 p-4 sm:p-5 hover:border-white/15 transition-all duration-500 rounded-sm relative cursor-pointer"
                  onClick={() => navigate(`/product/${item.slug}`)}
                >
                  {/* Floating index */}
                  <div className="absolute top-6 right-6 font-mono text-[9px] text-zinc-600 tracking-wider font-bold">
                    [0{item.id} // SEC]
                  </div>

                  {/* Image Plate */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 border border-white/5 mb-6 rounded-sm select-none">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (item.slug === 'monk-strap') {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800";
                        } else {
                          e.currentTarget.src = heroImage;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
                    
                    {/* Bottom overlay inside image */}
                    <div className="absolute bottom-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-white/5">
                      <span className="text-[8px] font-mono tracking-widest text-zinc-300 block uppercase">
                        {mainStyle.split(" ")[0]} SYSTEM
                      </span>
                    </div>
                  </div>

                  {/* Footwear Name Card */}
                  <div className="mb-4">
                    <h3 className="serif text-xl sm:text-2xl text-white group-hover:text-zinc-300 transition-colors leading-tight">
                      {firstClassWord} <span className="italic font-light text-zinc-400 block">{restClassWord}</span>
                    </h3>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed uppercase tracking-wider mb-6 min-h-[3.25rem] line-clamp-2 md:line-clamp-none">
                    {item.description}
                  </p>

                  {/* Size Preview Indicator */}
                  <div className="flex border-t border-white/5 pt-4 mb-6 justify-between items-center text-[8px] font-mono tracking-widest text-zinc-500">
                    <span>SIZES REQUIRED:</span>
                    <span className="text-zinc-300">EU 40 - 45 (PK 6 - 11)</span>
                  </div>

                  {/* Direct Link Anchor */}
                  <div className="mt-auto flex flex-col gap-3 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="serif text-base sm:text-lg text-white font-light">{item.price}</span>
                      <Link 
                        to={`/product/${item.slug}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 group/link hover:text-white text-zinc-400 transition-colors py-2"
                      >
                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold pb-0.5">Explore Details</span>
                        <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black transition-all">
                          <ArrowRight size={10} strokeWidth={1.5} />
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, "42");
                      }}
                      className="w-full border border-white/10 hover:border-white text-center py-2.5 text-[8px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-white hover:text-black select-none cursor-pointer"
                    >
                      Quick Add to Bag <span className="opacity-40 font-mono text-[7px] font-normal pl-1">(EU 42)</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

// NEW SECTION: Bento visual showcase on Anatomy
const AnatomyBento = () => {
  return (
    <section className="bg-luxury-black text-white pb-24 md:pb-32 px-4 sm:px-6 md:px-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16 mt-16 md:mt-24">
          <span className="text-[9px] font-mono uppercase tracking-[0.6em] text-zinc-500 block mb-3">Structural Sincerity</span>
          <h2 className="serif text-3xl sm:text-5xl leading-tight text-white m-0">
            The Anatomy of <span className="italic font-light">Pure Form</span>
          </h2>
          <p className="text-zinc-500 max-w-sm text-[11px] uppercase tracking-widest font-light leading-relaxed mt-4">
            Under the visible calfskin lies a system of hand-lasted biological parts designed to serve your anatomy.
          </p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="border border-white/5 bg-zinc-950/40 p-6 sm:p-8 flex flex-col justify-between rounded-sm min-h-[110px] sm:min-h-[220px]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[8px] text-zinc-600 block">[PART 01 // INNER]</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
            </div>
            <div>
              <h3 className="serif text-xl sm:text-2xl text-white mb-2">Natural Cork Inlay</h3>
              <p className="text-[11px] text-zinc-400 font-light uppercase tracking-widest leading-relaxed hidden sm:block">
                A thick bed of biological shredded cork is hot-pressed beneath the insole. Over two weeks, it settles and mirrors your foot arch for standard orthotics.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-white/5 bg-zinc-950/40 p-6 sm:p-8 flex flex-col justify-between rounded-sm min-h-[110px] sm:min-h-[220px]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[8px] text-zinc-600 block">[PART 02 // STABILITY]</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
            </div>
            <div>
              <h3 className="serif text-xl sm:text-2xl text-white mb-2">Oak-Bark Sole Protection</h3>
              <p className="text-[11px] text-zinc-400 font-light uppercase tracking-widest leading-relaxed hidden sm:block">
                Tanned in traditional pits over nine months. Extremely dense, lightweight, and reinforced with 15 solid brass pegs for enduring posture stability.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-white/5 bg-zinc-950/40 p-6 sm:p-8 flex flex-col justify-between rounded-sm min-h-[110px] sm:min-h-[220px] md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[8px] text-zinc-600 block">[PART 03 // CRAFT]</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
            </div>
            <div>
              <h3 className="serif text-xl sm:text-2xl text-white mb-2">Wood Last Stretching</h3>
              <p className="text-[11px] text-zinc-400 font-light uppercase tracking-widest leading-relaxed hidden sm:block">
                The upper is tensioned over solid beechwood molds for three full weeks. This guarantees the leather fibers memorize their shape and prevent creasing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// NEW SECTION: Full-width, high-impact immersive image banner
const FullImageBanner = () => {
  return (
    <section className="relative h-[80vh] sm:h-[90vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with elegant darkness overlay for contrast */}
      <div className="absolute inset-0">
        <img 
          src={img3} 
          alt="Artisanal shoemaking craftsmanship in the atelier"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale brightness-[0.35] transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />
      </div>

      {/* Floating details */}
      <div className="absolute top-10 left-6 md:left-12 font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-zinc-500 uppercase">
        LOC: Lahore Atelier // 31.5204° N, 74.3587° E
      </div>
      <div className="absolute top-10 right-6 md:right-12 font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-zinc-500 uppercase">
        SPECIFICATION ID // BO-2020
      </div>

      {/* Main minimal impact content */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6 sm:space-y-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.8em] text-zinc-400 block font-mono">INSIDE THE LANDSCAPE</span>
        <h2 className="serif text-4xl sm:text-6xl md:text-8xl text-white leading-none tracking-tight">
          Where Time <br />
          <span className="italic font-light text-zinc-300">Stands Still</span>
        </h2>
        
        <div className="w-12 h-px bg-white/30 mx-auto" />
        
        <p className="text-zinc-400 max-w-lg mx-auto font-light text-[11px] sm:text-xs uppercase tracking-[0.25em] leading-relaxed">
          <span className="hidden sm:inline">
            Every wrinkle in our full-grain boxcalf leather represents a choice. No electric heaters, no synthetic glues. Just two hands, pure flax thread, and thirty days of silent devotion.
          </span>
          <span className="inline sm:hidden">
            Handcrafted with flax thread and thirty days of silent devotion.
          </span>
        </p>
        
        <div className="pt-4">
          <Link 
            to="/atelier" 
            className="inline-flex items-center gap-2.5 sm:gap-4 bg-white text-black hover:bg-zinc-200 py-2.5 sm:py-3.5 px-5 sm:px-8 uppercase text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-bold rounded-sm transition-all whitespace-nowrap"
          >
            <span>Explore The Atelier</span>
            <ArrowRight size={10} className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Bottom overlay parameters */}
      <div className="absolute bottom-10 left-6 md:left-12 font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-zinc-500 uppercase hidden sm:block">
        AUTHENTIC GOODYEAR WELTING PROCESS
      </div>
      <div className="absolute bottom-10 right-6 md:right-12 font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-zinc-500 uppercase hidden sm:block">
        SINCE 2020 ESTABLISHED
      </div>
    </section>
  );
};

// NEW SECTION: Editorial Reviews wall
const EditorialReviews = () => {
  return (
    <section className="bg-luxury-black text-white py-16 md:py-24 px-4 sm:px-6 md:px-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <span className="block text-[9px] font-mono tracking-[0.4em] text-zinc-500 uppercase text-center mb-10">Editorial Reviews</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="text-center p-4 md:p-6 first:pl-0">
            <p className="serif text-lg sm:text-xl italic text-zinc-300 leading-relaxed mb-6">
              "The last of a disappearing discipline in bespoke Pakistani handcrafting. An indestructible pair built to serve you for thirty years."
            </p>
            <span className="text-[8px] font-mono tracking-widest uppercase text-zinc-500">// SARTORIAL PAKISTAN</span>
          </div>

          <div className="text-center p-4 md:p-6 hidden md:block">
            <p className="serif text-lg sm:text-xl italic text-zinc-300 leading-relaxed mb-6">
              "An flawless, solid heel design. The shred-cork bedding molds itself cleanly to your specific foot geometry inside two weeks of wear."
            </p>
            <span className="text-[8px] font-mono tracking-widest uppercase text-zinc-500">// SARTORIAL MONTHLY</span>
          </div>

          <div className="text-center p-4 md:p-6 last:pr-0 hidden md:block">
            <p className="serif text-lg sm:text-xl italic text-zinc-300 leading-relaxed mb-6">
              "These are not simply classic dress shoes. They are comfortable posture-stabilizing masterpieces that redefine standard design parameters."
            </p>
            <span className="text-[8px] font-mono tracking-widest uppercase text-zinc-500">// THE DENTON CHRONICLE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// NEW SECTION: The Unboxing experience
const Unboxing = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [unboxingSlideIndex, setUnboxingSlideIndex] = useState(0);

  const unboxingSlides = [
    {
      src: box1Image,
      alt: "FSC certified heavy-milled box, handmade in Italy"
    },
    {
      src: bo9Image,
      alt: "Heavy-gauge organic cotton dust bags tied with single beeswax strings"
    },
    {
      src: img2,
      alt: "Genuine jar of Saphir Médaille d'Or leather wax restoration"
    },
    {
      src: img3,
      alt: "Individual shoe profile card, hand-signed with carbon ink by your welter"
    }
  ];

  return (
    <section className="bg-zinc-950 text-white py-20 md:py-28 px-4 sm:px-6 md:px-10 border-t border-white/5 relative overflow-hidden">
      {/* Decorative ambient lighting background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.015] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          {/* Mobile-only Heading (shows above image on mobile) */}
          <div className="lg:hidden">
            <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-3 block font-mono">THE COMPLEMENT</span>
            <h2 className="serif text-4xl sm:text-6xl leading-tight tracking-tight m-0">
              What arrives <br />
              <span className="italic font-light text-zinc-400">is not a box.</span>
            </h2>
          </div>
          
          {/* Narrative blocks */}
          <div className="lg:col-span-5 space-y-8 order-3 lg:order-1">
            <div className="hidden lg:block">
              <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-3 block font-mono">THE COMPLEMENT</span>
              <h2 className="serif text-4xl sm:text-6xl lg:text-7.5xl leading-tight tracking-tight m-0">
                What arrives <br />
                <span className="italic font-light text-zinc-400">is not a box.</span>
              </h2>
            </div>

            <p className="text-zinc-400 font-light text-[11px] sm:text-xs uppercase tracking-widest leading-relaxed">
              Cotton flannel bags. A vial of Saphir polish. A hand-signed note from the welter who stitched your pair. And zero plastic.
            </p>

            <div className="pt-2">
              <button 
                onClick={() => {
                  setUnboxingSlideIndex(0);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2.5 sm:gap-4 bg-white text-black hover:bg-zinc-200 py-2.5 sm:py-3.5 px-5 sm:px-8 uppercase text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-bold rounded-sm transition-all focus:outline-none cursor-pointer whitespace-nowrap"
              >
                <span>Witness the unboxing</span>
                <ArrowRight size={10} className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Image presentation block */}
          <div className="lg:col-span-7 order-2 lg:order-2 flex justify-center lg:justify-end w-full">
            <div className="group relative overflow-hidden bg-zinc-900 border border-white/5 rounded-sm aspect-[4/3] w-full select-none">
              <img 
                src={box1Image} 
                alt="Premium luxury shoe packaging unboxing flat lay showing cotton flannel bags, Saphir polish, and a handwritten note"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1400";
                }}
                className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              
              {/* Overlay labels */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase">SARTORIAL UNBOXING FLAT-LAY</span>
                <span className="text-[11px] font-mono tracking-widest text-white uppercase font-bold">100% RECYCLABLE COMPOSITION</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Elegant minimalist video / showcase overlay modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-4xl p-5 sm:p-8 md:p-10 relative rounded-sm max-h-[92dvh] overflow-y-auto"
            >
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-zinc-400 hover:text-white transition-colors z-30 bg-black/40 p-1.5 sm:p-0 rounded-full"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center pt-4 sm:pt-2">
                {/* Image Slider: Renders FIRST on mobile naturally */}
                <div className="md:col-span-7 overflow-hidden rounded-sm aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] relative group/slider border border-white/5 bg-zinc-900">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={unboxingSlideIndex}
                      src={unboxingSlides[unboxingSlideIndex].src}
                      alt={unboxingSlides[unboxingSlideIndex].alt}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Left & Right Chevron Handles */}
                  <button
                    onClick={() => setUnboxingSlideIndex((prev) => (prev - 1 + unboxingSlides.length) % unboxingSlides.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-white hover:text-black text-white p-2 sm:p-2.5 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 cursor-pointer border border-white/10"
                    aria-label="Previous Unboxing image"
                  >
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setUnboxingSlideIndex((prev) => (prev + 1) % unboxingSlides.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-white hover:text-black text-white p-2 sm:p-2.5 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 cursor-pointer border border-white/10"
                    aria-label="Next Unboxing image"
                  >
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>

                  {/* Aesthetic Slide Label Caption Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-15 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-sm border border-white/5">
                    <span className="text-[7.5px] sm:text-[8px] font-mono tracking-widest text-zinc-300 uppercase truncate max-w-[70%]">
                      {unboxingSlides[unboxingSlideIndex].alt}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] font-mono tracking-widest text-zinc-400 whitespace-nowrap">
                      {unboxingSlideIndex + 1} / {unboxingSlides.length}
                    </span>
                  </div>
                </div>

                {/* Narrative Information Section */}
                <div className="md:col-span-5 space-y-3 md:space-y-5">
                  <div>
                    <span className="text-[7.5px] sm:text-[8px] font-mono tracking-widest text-zinc-500 uppercase block mb-0.5">UNBOXING SEQUENCE</span>
                    <h3 className="serif text-lg sm:text-xl md:text-2xl text-white font-normal leading-tight">
                      A Quiet <span className="italic font-light">Unveiling</span>
                    </h3>
                  </div>

                  <div className="space-y-1.5 md:space-y-3.5 text-[8px] sm:text-[9px] md:text-[10px] text-zinc-400 font-light uppercase tracking-[0.12em] sm:tracking-[0.18em] leading-relaxed">
                    <p className={unboxingSlideIndex === 0 ? "text-white font-medium border-l border-white/40 pl-2 transition-all" : "opacity-60 transition-all pl-2 border-l border-transparent"}>
                      1. Open heavy-milled box, handmade in Italy from FSC certified fibers.
                    </p>
                    <p className={unboxingSlideIndex === 1 ? "text-white font-medium border-l border-white/40 pl-2 transition-all" : "opacity-60 transition-all pl-2 border-l border-transparent"}>
                      2. Discover heavy-gauge organic cotton dust bags tied with single beeswax strings.
                    </p>
                    <p className={unboxingSlideIndex === 2 ? "text-white font-medium border-l border-white/40 pl-2 transition-all" : "opacity-60 transition-all pl-2 border-l border-transparent"}>
                      3. Uncover a genuine jar of Saphir Médaille d'Or leather restoration wax.
                    </p>
                    <p className={unboxingSlideIndex === 3 ? "text-white font-medium border-l border-white/40 pl-2 transition-all" : "opacity-60 transition-all pl-2 border-l border-transparent"}>
                      4. Read your individual shoe profile card, hand-signed with carbon ink by your welter.
                    </p>
                  </div>

                  <div className="pt-1">
                    <button 
                      onClick={() => setModalOpen(false)}
                      className="w-full py-2 border border-white/10 hover:border-white text-[7.5px] sm:text-[8px] uppercase tracking-[0.3em] font-bold transition-all rounded-sm"
                    >
                      Close Sequence
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-luxury-black text-white pt-20 md:pt-32 pb-12 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-20 md:mb-32">
        <div className="col-span-1 md:col-span-2">
          <h2 className="serif text-3xl md:text-4xl mb-6 md:mb-8 tracking-wider">ETERNAL</h2>
          <p className="max-w-sm opacity-50 font-light leading-relaxed mb-8 italic text-sm">
            Join our private circle for early releases and invitations to our trunk shows across Europe and the Americas.
          </p>
          <div className="flex max-w-sm border-b border-white/20 pb-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border-none outline-none flex-1 font-light text-sm p-2 uppercase tracking-widest"
            />
            <button className="px-4 opacity-50 hover:opacity-100 transition-opacity">
              <ArrowRight size={20} strokeWidth={1} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:col-span-1">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-6 md:mb-8 opacity-40">Navigation</h4>
            <ul className="flex flex-col gap-4 text-sm font-light">
              <li><Link to="/#collection" className="hover:opacity-50 transition-opacity">Size Guide</Link></li>
              <li><Link to="/#collection" className="hover:opacity-50 transition-opacity">Care Instructions</Link></li>
              <li><Link to="/#collection" className="hover:opacity-50 transition-opacity">Repairs</Link></li>
              <li><Link to="/#collection" className="hover:opacity-50 transition-opacity">Shipping</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-6 md:mb-8 opacity-40">Connect</h4>
            <div className="flex gap-6 items-center">
              <a href="#" className="hover:opacity-50 transition-opacity"><Instagram size={20} strokeWidth={1} /></a>
              <a href="#" className="hover:opacity-50 transition-opacity"><Twitter size={20} strokeWidth={1} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center pt-8 border-t border-white/5 text-[9px] uppercase tracking-[0.4em] opacity-30 text-center md:text-left">
        <p>© 2024 Eternal. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Privacy / Terms / Accessibility</p>
      </div>
    </footer>
  );
};

const ProductPage = () => {
  const { slug } = useParams();
  const product = COLLECTIONS.find(p => p.slug === slug) || COLLECTIONS[0];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { addToCart, setCartOpen } = useCart();
  
  // Dynamic images based on selected product
  const images = product.images || [product.image, img1, img2, img3];
  const galleryImages = images.slice(0, 6);

  // Reset image view on product change
  useEffect(() => {
    setActiveImg(0);
    setSelectedSize(null);
  }, [slug]);

  const handlePrevImg = () => {
    setActiveImg((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setActiveImg((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-luxury-black text-luxury-white min-h-screen">
      <div className="pt-24 md:pt-32 pb-20 md:pb-32 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Product Image Slider Side */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Thumbnail Slide Gallery (Left on Desktop, Bottom on Mobile) */}
            <div className="order-2 lg:order-1 flex lg:flex-col gap-3 w-full lg:w-16 xl:w-20 max-h-[580px] overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 pr-0 lg:pr-1 shrink-0 scrollbar-none select-none">
               {galleryImages.map((img, i) => (
                 <button 
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square w-14 sm:w-16 md:w-20 lg:w-full border transition-all duration-300 overflow-hidden shrink-0 bg-zinc-950 ${activeImg === i ? 'border-white ring-1 ring-white/20' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                 >
                    <img 
                      src={img} 
                      onError={(e) => {
                        if (product.slug === 'monk-strap') {
                          const fallbacks = [
                            "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800",
                            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800",
                            "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=800",
                            "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
                            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800",
                            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800"
                          ];
                          e.currentTarget.src = fallbacks[i % fallbacks.length];
                        } else {
                          e.currentTarget.src = heroImage;
                        }
                      }}
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                 </button>
               ))}
            </div>

            {/* Main Product Display Image */}
            <div className="order-1 lg:order-2 relative flex-1 w-full aspect-[3/4] bg-zinc-900 overflow-hidden border border-soft">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${slug}-${activeImg}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={images[activeImg]} 
                  alt={product.name} 
                  onError={(e) => {
                    if (product.slug === 'monk-strap') {
                      const fallbacks = [
                        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800",
                        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800",
                        "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=800",
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
                        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800",
                        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800"
                      ];
                      e.currentTarget.src = fallbacks[activeImg % fallbacks.length];
                    } else {
                      e.currentTarget.src = heroImage;
                    }
                  }}
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-6 flex gap-3 z-20">
                {galleryImages.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeImg === i ? 'bg-white w-6' : 'bg-white/30'}`}
                  />
                ))}
              </div>

              {/* Slider Navigation Buttons */}
              <div className="absolute bottom-5 right-6 flex gap-2 z-20">
                <button 
                  onClick={handlePrevImg}
                  className="w-8 h-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all group duration-300"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={16} strokeWidth={1} />
                </button>
                <button 
                  onClick={handleNextImg}
                  className="w-8 h-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all group duration-300"
                  aria-label="Next Image"
                >
                  <ChevronRight size={16} strokeWidth={1} />
                </button>
              </div>
            </div>

          </div>

          {/* Product Detail Content Side */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <nav className="flex gap-4 text-[9px] uppercase tracking-widest text-zinc-500 mb-6 md:mb-8 items-center font-mono overflow-x-auto whitespace-nowrap">
                <Link to="/">Home</Link>
                <ChevronDown size={8} className="-rotate-90 flex-shrink-0" />
                <Link to="/#collection">Collections</Link>
                <ChevronDown size={8} className="-rotate-90 flex-shrink-0" />
                <span className="text-white">{product.name}</span>
              </nav>

              <h1 className="serif text-4xl md:text-6xl leading-none mb-6 tracking-tighter uppercase">
                {product.name.split(' ')[0]} <br />
                <span className="italic text-zinc-500 pl-4 md:pl-8 block normal-case">{product.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <div className="flex items-center gap-6 md:gap-8 mb-8 md:mb-10">
                 <span className="serif text-2xl md:text-3xl font-light text-white">{product.price}</span>
                 <div className="h-[1px] flex-1 bg-white/10"></div>
                 <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-mono">SKU: ET-SH-{product.id}0{product.id}</div>
              </div>

              <div className="mb-10 md:mb-12">
                <p className="text-[13px] md:text-sm font-light text-zinc-300 leading-relaxed mb-6 italic max-w-md">
                  "{product.description}"
                </p>
                <p className="text-[10px] md:text-[11px] text-zinc-500 leading-relaxed font-light max-w-sm">
                  Lovingly hand-crafted over forty-eight hours with a {product.specs.construction} system. Every design element represents an uncompromising dedication to bespoke luxury shoemaking.
                </p>
              </div>

              {/* Enhanced Size Selection */}
              <div className="flex flex-col gap-6 md:gap-8 mb-10 md:mb-12">
                <div>
                   <div className="flex justify-between items-end mb-4">
                     <span className="text-[10px] uppercase tracking-widest text-zinc-400">Select Size</span>
                     <span className="text-[8px] uppercase tracking-widest text-zinc-600 border-b border-soft pb-1 cursor-pointer hover:text-white transition-colors">Size Guide</span>
                   </div>
                   <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                      {[
                        { eu: '40', pk: '6' },
                        { eu: '41', pk: '7' },
                        { eu: '42', pk: '8' },
                        { eu: '43', pk: '9' },
                        { eu: '44', pk: '10' },
                        { eu: '45', pk: '11' }
                      ].map(size => (
                        <button 
                          key={size.eu} 
                          onClick={() => setSelectedSize(size.eu)}
                          className={`group border py-3 px-2 flex flex-col items-center justify-center transition-all ${selectedSize === size.eu ? 'border-white bg-white/10' : 'border-soft hover:border-white/50 bg-transparent'}`}
                        >
                          <span className="text-[11px] text-white">EU {size.eu}</span>
                          <span className="text-[8px] text-zinc-500 group-hover:text-zinc-300">PK {size.pk}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mb-12 md:mb-16">
                <button 
                  onClick={() => addToCart(product, selectedSize || "42")}
                  className="w-full bg-white text-black py-4 md:py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all select-none cursor-pointer"
                >
                  Add to Bag {selectedSize ? `(EU ${selectedSize})` : "(EU 42)"}
                </button>
                <button 
                  onClick={() => {
                    addToCart(product, selectedSize || "42");
                    setCartOpen(true);
                  }}
                  className="w-full border border-white/20 py-4 md:py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black transition-all select-none cursor-pointer"
                >
                  Buy Now {selectedSize ? `(EU ${selectedSize})` : "(EU 42)"}
                </button>
              </div>

              {/* Interactive Details Accordions with detailed spec items */}
              <div className="flex flex-col border-t border-soft">
                 {['Sartorial Specs', 'Shipping & Returns', 'Maintenance'].map((tab) => {
                   const isExpanded = activeTab === tab;
                   return (
                     <div key={tab} className="border-b border-soft">
                       <button 
                         onClick={() => setActiveTab(isExpanded ? null : tab)}
                         className="w-full py-5 md:py-6 flex justify-between items-center cursor-pointer group text-left outline-none"
                       >
                         <span className={`text-[10px] uppercase tracking-[0.3em] font-semibold transition-colors ${isExpanded ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>{tab}</span>
                         <ChevronDown size={14} className={`opacity-40 group-hover:opacity-100 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                       </button>

                       {isExpanded && (
                         <motion.div 
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: "auto" }}
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.3 }}
                           className="overflow-hidden pb-6"
                         >
                           {tab === 'Sartorial Specs' && (
                             <div className="flex flex-col gap-6 text-xs font-light tracking-wide text-zinc-300">
                               <div className="border-l border-white/10 pl-4 py-1">
                                 <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Leather Selection & Quality</span>
                                 <h4 className="font-semibold text-white text-[11px] mb-2">{product.specs.leather}</h4>
                                 <p className="text-zinc-400 leading-relaxed text-[10px] uppercase tracking-wider">{product.specs.leatherDetail}</p>
                               </div>

                               <div className="border-l border-white/10 pl-4 py-1">
                                 <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Sole & Edge Finishing</span>
                                 <h4 className="font-semibold text-white text-[11px] mb-2">{product.specs.sole}</h4>
                                 <p className="text-zinc-400 leading-relaxed text-[10px] uppercase tracking-wider">{product.specs.soleDetail}</p>
                               </div>

                               <div className="border-l border-white/10 pl-4 py-1">
                                 <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Functional Trims & Fastening</span>
                                 <h4 className="font-semibold text-white text-[11px] mb-2">{product.specs.laces}</h4>
                                 <p className="text-zinc-400 leading-relaxed text-[10px] uppercase tracking-wider">{product.specs.lacesDetail}</p>
                               </div>

                               <div className="border-l border-white/10 pl-4 py-1">
                                 <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Interior Specification</span>
                                 <p className="text-zinc-400 leading-relaxed text-[10px] uppercase tracking-wider">{product.specs.lining}</p>
                               </div>
                             </div>
                           )}

                           {tab === 'Shipping & Returns' && (
                             <div className="text-[11px] leading-relaxed text-zinc-400 uppercase tracking-widest">
                               <p className="mb-4">Complimentary express shipping across Europe, the Americas, and Asia. Hand-delivered via private courier with full parcel tracking.</p>
                               <p>Returns accepted within fourteen days of receipt. All protective outsole adhesives and stickers must remain entirely undisturbed for refund eligibility.</p>
                             </div>
                           )}

                           {tab === 'Maintenance' && (
                             <div className="text-[11px] leading-relaxed text-zinc-400 uppercase tracking-widest">
                               <p className="mb-4">We advise brushing with a premium natural horsehair brush after every wear. Always store immediately in tailored solid-cedar shoe trees to preserve leather contours.</p>
                               <p>Re-wax using organic beeswax creams thrice-annually to elevate the beautiful, hand-burnished depth of tone.</p>
                             </div>
                           )}
                         </motion.div>
                       )}
                     </div>
                   );
                 })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Long Detailed Editorial Product Story */}
        <ProductStory product={product} images={images} />
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <SartorialPledgeTicker />
      <Collection />
      <AnatomyBento />
      <FullImageBanner />
      <EditorialReviews />
      <Unboxing />
      <div className="h-[60vh] bg-luxury-black relative overflow-hidden">
        <img 
          src={bo9Image}
          alt="Luxury Studio"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = footerImg;
          }}
          className="w-full h-full object-cover opacity-45 brightness-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="serif text-5xl md:text-8xl italic mb-8">Uncompromising.</h2>
            <Link to="/atelier">
              <button className="px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-transparent hover:text-white border border-white transition-all">
                Discover the Atelier
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-luxury-black">
          <ScrollToTop />
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/atelier" element={<AtelierPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
          <Footer />
          <CartSlideOver />
          <MenuSlideOver />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}