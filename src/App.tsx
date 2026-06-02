/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown, Instagram, Twitter, Menu, X, Search, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import { ProductStory } from "./components/ProductStory";
import heroImage from "./images/hero.jpg";
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
    name: "Black Oxford Leather",
    price: "PKR 5,950",
    image: heritageImage,
    images: [heritageImage, img1, img3, heroImage],
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
      construction: "Handwelted Goodyear"
    }
  },
  {
    id: 2,
    name: "Monk Strap",
    price: "PKR 5,950",
    image: img2,
    images: [img2, img1, img3, img4],
    category: "Hand Made",
    slug: "monk-strap",
    description: "A timeless classic in a rich cognac hue, featuring a hand-welted sole for unparalleled durability.",
    specs: {
      type: "Double Monk Strap Dress Shoe",
      leather: "Aniline-Dyed Museum Calfskin (Cognac Brown Patina)",
      leatherDetail: "Individually hand-burnished aniline-dyed calfskin with a distinctive marbleized museum effect. Prepared using organic tree bark extracts and finished with countless hand-applied layers of mineral cream wax.",
      sole: "Hand-Welted Italian Oak-Bark Outsole with Stacked Leather Heel",
      soleDetail: "Double-tanned dense oak-bark leather outsole that offers exceptional shock absorption and orthopedic flexibility. Hand-cut and polished edges with subtle hand-stamped decorative detailing on the waist.",
      laces: "Double Brass Buckle Straps with Hidden Elastic Anchor Guards",
      lacesDetail: "Instead of standard laces, this masterpiece is secured with two adjustable solid brass buckles individually cast in Florence, held securely by soft, heavy-grade hidden elastic segments to optimize standard flex.",
      lining: "Hand-Selected Glove-Grade Milled Sheepskin Lining",
      construction: "Rapid Blake stitch"
    }
  },
  {
    id: 3,
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
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 md:py-6 flex items-center bg-black/80 backdrop-blur-lg border-b border-white/5 transition-all">
      {/* Search Overlay for Mobile */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-lg z-[70] flex items-center px-6 md:hidden"
          >
            <div className="relative w-full flex items-center">
              <Search size={18} className="text-zinc-500 mr-4" strokeWidth={1} />
              <input 
                type="text"
                placeholder="SEARCH FOR ARTISANAL PIECES..."
                className="bg-transparent border-b border-white/30 text-xs tracking-widest outline-none w-full pb-2 uppercase text-white"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="ml-4 p-2"
              >
                <X size={20} strokeWidth={1} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Links (Desktop) */}
      <div className={`flex-1 flex gap-8 text-[10px] uppercase tracking-[0.3em] font-semibold hidden md:flex ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex gap-8 relative">
          <div 
            className="relative py-2 group"
            onMouseEnter={() => setIsCollectionsHovered(true)}
            onMouseLeave={() => setIsCollectionsHovered(false)}
          >
            <Link to={isHomePage ? "#collection" : "/#collection"} className="hover:opacity-50 transition-opacity flex items-center gap-2">
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
                  <div className="bg-black/80 border border-soft p-6 w-64 backdrop-blur-xl shadow-2xl">
                    <div className="flex flex-col gap-4">
                      {COLLECTIONS.map((item) => (
                        <Link 
                          key={item.id} 
                          to={`/product/${item.slug}`} 
                          className="group/item flex flex-col"
                          onClick={() => setIsCollectionsHovered(false)}
                        >
                          <span className="text-[9px] text-zinc-500 mb-1 opacity-60 font-mono">0{item.id}</span>
                          <span className="hover:text-zinc-400 transition-colors tracking-[0.2em]">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/#heritage" className="hover:opacity-50 transition-opacity py-2">Bespoke</Link>
          <Link to="/#contact" className="hover:opacity-50 transition-opacity py-2">The Atelier</Link>
        </div>
      </div>

      {/* Mobile Menu Trigger */}
      <div className={`flex-1 md:hidden flex items-center ${isSearchOpen ? 'opacity-100' : 'opacity-100'}`}>
        <button onClick={() => setIsOpen(true)} className="hover:opacity-50 transition-opacity">
          <Menu size={24} />
        </button>
      </div>

      {/* Centered Brand Name */}
      <Link to="/" className={`flex-none text-2xl md:text-3xl serif font-bold tracking-tighter text-center transition-opacity ${isSearchOpen ? 'md:opacity-100 opacity-0' : 'opacity-100'}`}>
        ETERNAL
      </Link>
      
      {/* Right Links and Controls */}
      <div className="flex-1 flex gap-8 text-[10px] uppercase tracking-[0.3em] font-semibold justify-end items-center">
        <div className="relative flex items-center">
          <motion.div
            animate={{ x: isSearchOpen ? -170 : 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex items-center"
          >
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-50 transition-opacity cursor-pointer flex items-center z-10"
            >
              {isSearchOpen ? <X size={14} strokeWidth={1} className="hidden md:block" /> : <Search size={16} strokeWidth={1} />}
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
                    className="bg-transparent border-b border-white/30 text-[10px] tracking-[0.2em] outline-none w-full pb-1 uppercase text-white"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        <div className={`cursor-pointer ml-4 flex items-center gap-2 ${isSearchOpen ? 'opacity-0 md:opacity-100 pointer-events-none' : 'opacity-100'}`}>
          Bag <span className="opacity-40 italic">(0)</span>
        </div>
      </div>

      {/* Mobile Menu Overlay - Right Slide */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[50%] md:w-[30%] bg-black/80 backdrop-blur-xl z-[90] flex flex-col p-8 md:p-12 shadow-2xl border-r border-white/10"
            >
              <button onClick={() => setIsOpen(false)} className="self-start mb-16 text-zinc-500 hover:text-white transition-colors">
                <X size={28} strokeWidth={1} />
              </button>
              
              <div className="flex flex-col gap-10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-2 block">Navigation</span>
                <Link onClick={() => setIsOpen(false)} to="/" className="text-xs uppercase tracking-[0.4em] hover:text-zinc-400 transition-all">Home</Link>
                <Link onClick={() => setIsOpen(false)} to="/#collection" className="text-xs uppercase tracking-[0.4em] hover:text-zinc-400 transition-all">Collections</Link>
                <Link onClick={() => setIsOpen(false)} to="/#heritage" className="text-xs uppercase tracking-[0.4em] hover:text-zinc-400 transition-all">Heritage</Link>
                <Link onClick={() => setIsOpen(false)} to="/#contact" className="text-xs uppercase tracking-[0.4em] hover:text-zinc-400 transition-all">Atelier</Link>
              </div>

              <div className="mt-auto pt-10 border-t border-soft">
                <div className="flex gap-6">
                  <Instagram size={20} strokeWidth={1} className="opacity-50" />
                  <Twitter size={20} strokeWidth={1} className="opacity-50" />
                </div>
                <p className="mt-6 text-[8px] uppercase tracking-widest opacity-30">© 2024 Eternal Artisans</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <header className="relative min-h-screen w-full px-6 md:px-12 py-12 flex flex-col justify-between overflow-hidden">
      <div className="absolute top-0 right-0 p-8 flex flex-col items-end opacity-5 md:opacity-10 pointer-events-none z-0">
        <span className="serif text-[40vw] md:text-[28vw] leading-none -mr-8 md:-mr-12 -mt-8 md:-mt-12">E</span>
      </div>

      <main className="flex-1 flex flex-col md:flex-row mt-12 relative z-10">
        <div className="w-full md:w-1/3 flex flex-col justify-end pb-12 order-2 md:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2 block">Hand-Stitched</span>
            <h2 className="serif text-5xl md:text-6xl leading-tight">The Oxford <br /><span className="italic">Heritage</span></h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs text-zinc-400 leading-relaxed max-w-[240px] mb-8 font-light"
          >
            Meticulously crafted over forty-eight hours. Using only the finest full-grain calfskin from the heart of Tuscany.
          </motion.p>
          <Link to="/#collection" className="w-fit">
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full border border-white py-4 px-10 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors duration-300"
            >
              View Collection
            </motion.button>
          </Link>
        </div>

        <div className="md:absolute left-1/2 top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[500px] h-[350px] md:h-[600px] border border-soft p-4 flex items-center justify-center order-1 md:order-2 mb-12 md:mb-0">
          <div className="w-full h-full bg-zinc-900/50 flex items-center justify-center relative overflow-hidden">
            <motion.div 
              style={{ y }}
              className="absolute inset-0 opacity-40 grayscale pointer-events-none"
            >
              <img 
                src={heroImage} 
                alt="Luxury Shoemaking"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="z-10 flex flex-col items-center text-center">
              <div className="w-48 md:w-64 h-[1px] bg-white opacity-20 mb-4"></div>
              <span className="serif italic text-2xl md:text-3xl opacity-80">EST. 1924</span>
              <div className="w-48 md:w-64 h-[1px] bg-white opacity-20 mt-4"></div>
            </div>
            <div className="absolute bottom-6 right-6 text-right">
              <span className="text-[40px] md:text-[60px] serif leading-none opacity-10">Nº 01</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-end justify-start pt-12 md:pt-24 hidden md:flex order-3">
          <div className="vertical-text text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-8 opacity-60">
            Handmade in Florence, Italy
          </div>
          <div className="flex flex-col gap-12 mt-auto pb-12">
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Material</span>
              <span className="block text-xs serif">Cognac Box-Calf</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Waitlist</span>
              <span className="block text-xs serif">Est. 6 Months</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex justify-between items-end border-t border-soft pt-6 hidden md:flex">
        <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 opacity-60">© 2024 ETERNAL CALZOLAI S.R.L.</div>
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer opacity-30"
        >
          <span className="text-[8px] uppercase tracking-[0.2em]">Explore</span>
          <ChevronDown size={12} strokeWidth={1} />
        </motion.div>
        <div className="flex gap-12 text-[9px] uppercase tracking-[0.3em] text-zinc-500 opacity-60">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Instagram</span>
        </div>
      </footer>
    </header>
  );
};

const CollectionItem = ({ item, index }: { item: CollectionItemInfo; index: number; key?: any }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity }}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-32 items-center relative mb-32 md:mb-64`}
    >
      {/* Parallax Image Plate */}
      <div className="w-full md:w-[55%] relative group overflow-hidden border border-soft shadow-2xl">
        <div className="aspect-[4/5] overflow-hidden relative">
          <motion.img 
            style={{ y, scale: 1.1 }}
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-125"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
        </div>
        
        {/* Floating ID Label */}
        <div className={`absolute top-8 ${index % 2 === 0 ? 'right-8' : 'left-8'} mix-blend-difference`}>
          <span className="text-[40px] md:text-[60px] serif italic leading-none opacity-40">0{index + 1}</span>
        </div>
      </div>

      {/* Narrative Content */}
      <div className="w-full md:w-[35%] flex flex-col pt-8 md:pt-0">
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-white/30" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-500 font-medium">Original Series</span>
          </div>
          
          <h3 className="serif text-4xl md:text-6xl mb-8 leading-tight tracking-tight">
            {item.name.split(' ').slice(0, 1)} <br />
            <span className="italic opacity-50 block pl-4 md:pl-8">{item.name.split(' ').slice(1).join(' ')}</span>
          </h3>

          <div className="h-24 md:h-32 border-l border-white/10 ml-2 mb-8 relative">
            <div className="absolute top-0 left-0 p-4">
              <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-[280px]">
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 group cursor-pointer w-fit">
            <Link to={`/product/${item.slug}`} className="flex items-center gap-6">
               <div className="w-10 h-10 rounded-full border border-soft flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <ArrowRight size={14} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
               </div>
               <span className="text-[10px] uppercase tracking-[0.4em] font-semibold border-b border-transparent group-hover:border-white transition-all pb-1">Enter Detail</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Collection = () => {
  return (
    <section id="collection" className="bg-luxury-black text-luxury-white pt-20 pb-32 md:pt-32 md:pb-64 relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 w-full text-center opacity-[0.02] pointer-events-none select-none -translate-y-1/2">
        <span className="serif text-[40vw] leading-none uppercase italic">Artisanal</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="mb-32 md:mb-56">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-500 mb-8 block">Selected Works</span>
            <h2 className="serif text-6xl md:text-[9rem] leading-[0.85] tracking-tighter">
              Curated <br />
              <span className="italic opacity-20">Originals</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mt-24 md:mt-40 max-w-5xl w-full">
              {[
                { title: "Pure Material", desc: "Sourced from the heart of Tuscany, our leathers represent the pinnacle of organic luxury.", code: "MAT-01" },
                { title: "Time-Lost Process", desc: "A singular devotion to slow-craft methods that have remained unchanged for generations.", code: "PRC-44" },
                { title: "Eternal Craft", desc: "Each piece is hand-lasted and finished with a unique signature that breathes life into form.", code: "CRT-99" }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center md:items-start group relative"
                >
                  <div className="absolute -top-8 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-px h-6 bg-white/10 group-hover:h-12 group-hover:bg-white/30 transition-all duration-700" />
                  <span className="text-[8px] font-mono text-zinc-600 mb-6 tracking-[0.5em] uppercase">{value.code}</span>
                  <h4 className="serif text-xl md:text-2xl mb-5 group-hover:italic transition-all duration-500 tracking-tight">{value.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-loose uppercase tracking-[0.25em] max-w-[240px] opacity-80 group-hover:opacity-100 transition-opacity">
                    {value.desc}
                  </p>
                  <div className="w-8 group-hover:w-full h-[1px] bg-white/10 mt-8 transition-all duration-1000 ease-in-out"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center">
          {COLLECTIONS.map((item, idx) => (
            <CollectionItem key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};


const Heritage = () => {
  return (
    <section id="heritage" className="py-20 md:py-32 px-6 md:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <h2 className="serif text-4xl md:text-6xl mb-8 md:mb-10 leading-tight">
            A Century of <br />
            <span className="italic opacity-60">Sartorial Integrity</span>
          </h2>
          <p className="font-light leading-relaxed opacity-70 mb-6 md:mb-8 md:max-w-md text-sm">
            Our atelier was founded on the rugged landscapes of Northern Italy, where the mountains met the master leatherworkers. We haven't changed our process in over a hundred years.
          </p>
          <p className="font-light leading-relaxed opacity-70 mb-10 md:mb-12 md:max-w-md text-sm">
            Each pair undergoes 128 individual steps, from the initial hand-cutting of the hide to the final wax polish. It's not just a shoe; it's a legacy you wear.
          </p>
          <div className="flex gap-12 md:gap-16 border-t border-white/10 pt-10">
            <div>
              <span className="block serif text-3xl mb-1 italic">12k+</span>
              <span className="text-[10px] uppercase tracking-widest opacity-40">Pairs Crafted</span>
            </div>
            <div>
              <span className="block serif text-3xl mb-1 italic">98%</span>
              <span className="text-[10px] uppercase tracking-widest opacity-40">Life Retention</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="order-1 md:order-2 h-[400px] md:h-[600px] overflow-hidden grayscale"
        >
          <img 
            src={heritageImage} 
            alt="Artisan Hands"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="absolute -bottom-10 md:-bottom-20 left-1/2 -translate-x-1/2 luxury-outline-text text-[20vw] md:text-[15vw] font-bold whitespace-nowrap opacity-5 md:opacity-10 pointer-events-none select-none serif">
        HERITAGE — 1924 — HERITAGE
      </div>
    </section>
  );
};

const Marquee = () => {
  return (
    <div className="py-12 border-y border-white/10 overflow-hidden bg-luxury-black relative flex items-center">
      <div className="flex animate-scroll whitespace-nowrap gap-20 items-center">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex gap-20 items-center">
            <span className="serif italic text-3xl opacity-60">Full Grain Leather</span>
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
            <span className="serif italic text-3xl opacity-60">Hand-Welted Soles</span>
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
            <span className="serif italic text-3xl opacity-60">Italian Craftsmanship</span>
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
          </div>
        ))}
      </div>
    </div>
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
  const [activeTab, setActiveTab] = useState<string | null>("Sartorial Specs");
  
  // Dynamic images based on selected product
  const images = product.images || [product.image, img1, img2, img3];
  const galleryImages = images.slice(0, 6);

  // Reset image view on product change
  useEffect(() => {
    setActiveImg(0);
    setSelectedSize(null);
  }, [slug]);

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
                    <img src={img} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>

            {/* Main Product Display Image */}
            <div className="order-1 lg:order-2 relative flex-1 w-full aspect-square bg-zinc-900 overflow-hidden border border-soft">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${slug}-${activeImg}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={images[activeImg]} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
              <div className="absolute bottom-6 left-6 flex gap-3">
                {galleryImages.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeImg === i ? 'bg-white w-6' : 'bg-white/30'}`}
                  />
                ))}
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
                <button className="w-full bg-white text-black py-4 md:py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all">
                  Add to Bag
                </button>
                <button className="w-full border border-white/20 py-4 md:py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black transition-all">
                  Buy Now
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
      <Marquee />
      <Collection />
      <Heritage />
      <div className="h-[60vh] bg-luxury-black relative overflow-hidden">
        <img 
          src={footerImg}
          alt="Luxury Studio"
          className="w-full h-full object-cover opacity-30 grayscale saturate-0"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="serif text-5xl md:text-8xl italic mb-8">Uncompromising.</h2>
            <button className="px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-transparent hover:text-white border border-white transition-all">
              Discover the Atelier
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-luxury-black">
        <ScrollToTop />
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}