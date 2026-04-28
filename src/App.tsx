/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown, Instagram, Twitter, Menu, X, Search, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import heroImage from "./images/hero.jpg";
import heritageImage from "./images/blackoxford.jpg";
import img1 from "./images/1.jpg";
import img2 from "./images/2.jpg";
import img3 from "./images/3.jpg";
import img4 from "./images/4.jpg";
import footerImg from "./images/footer.jpg";

const COLLECTIONS = [
  {
    id: 1,
    name: "Black Oxford Leather",
    price: "PKR 5,950",
    image: heritageImage,
    category: "Hand Made",
    slug: "black-oxford-leather",
    description: "Our signature piece, hand-stitched over 48 hours using the finest full-grain Italian calfskin."
  },
  {
    id: 2,
    name: "Monk Strap",
    price: "PKR 5,950",
    image: img2,
    category: "Hand Made",
    slug: "monk-strap",
    description: "A timeless classic in a rich cognac hue, featuring a hand-welted sole for unparalleled durability."
  },
  {
    id: 3,
    name: "Brown Oxford Leather",
    price: "PKR 5,950",
    image: img4,
    category: "Hand Made",
    slug: "brown-oxford-leather",
    description: "The height of sartorial elegance, featuring hand-burnished leather and artisanal buckle detailing."
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
      <div className={`flex-1 flex gap-8 text-[10px] uppercase tracking-[0.3em] font-semibold justify-end items-center ${isSearchOpen && !window.innerWidth < 768 ? '' : ''}`}>
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

const Collection = () => {
  return (
    <section id="collection" className="bg-luxury-black text-luxury-white py-32 md:py-48 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 md:mb-64">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-6 block font-mono"
            >
              Master-Works Series // 01-03
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="serif text-5xl md:text-[8rem] leading-[0.85] tracking-tighter"
            >
              Curated <br />
              <span className="italic opacity-30 ml-[0.1em]">Originals</span>
            </motion.h2>
          </div>
          <div className="hidden md:block pb-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 vertical-text origin-bottom-right rotate-90 translate-y-full">Scroll to Explore / Eternal Studio</p>
          </div>
        </div>

        <div className="flex flex-col gap-48 md:gap-96">
          {COLLECTIONS.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 relative`}
            >
              {/* Technical Indicator */}
              <div className={`absolute top-0 ${idx % 2 === 0 ? 'left-0' : 'right-0'} hidden xl:block -translate-y-full mb-8`}>
                <div className="flex flex-col gap-2 opacity-20">
                    <span className="text-[8px] font-mono uppercase tracking-widest">Model: Ref.{item.id}00X</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest">Origin: Florence, IT</span>
                </div>
              </div>

              {/* Main Image Plate */}
              <div className="w-full md:w-[60%] lg:w-[50%] relative group">
                <motion.div 
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                  transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                  className="aspect-[3/4] bg-zinc-900 overflow-hidden border border-white/5"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                  />
                </motion.div>
                
                {/* Image Overlay Label */}
                <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md px-6 py-4 border border-white/10 hidden md:block group-hover:bg-white group-hover:text-black transition-all">
                   <span className="text-[9px] uppercase tracking-[0.4em] font-bold">In Detail</span>
                </div>
              </div>

              {/* Editorial Content */}
              <div className="w-full md:w-[40%] flex flex-col justify-center relative translate-y-8 md:translate-y-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[60px] serif italic opacity-5 leading-none">0{item.id}</span>
                    <div className="h-[1px] flex-1 bg-white/10"></div>
                  </div>
                  
                  <h3 className="serif text-4xl md:text-7xl mb-8 leading-[0.9] tracking-tight">
                    {item.name.split(' ').slice(0, 1)} <br />
                    <span className="italic text-zinc-600 block pl-[0.5em]">{item.name.split(' ').slice(1).join(' ')}</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-8 mb-12 border-l border-white/10 pl-8">
                    <div className="flex flex-col gap-2">
                       <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">Artisinal Cost</span>
                       <span className="serif text-xl">{item.price}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">Series</span>
                       <span className="serif text-xl italic">Originals</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm font-light text-zinc-400 leading-relaxed mb-12 italic max-w-sm">
                    "{item.description}"
                  </p>
                  
                  <Link to={`/product/${item.slug}`}>
                    <button className="flex items-center gap-6 group">
                      <span className="text-[10px] uppercase tracking-[0.6em] font-semibold">Discovery Series</span>
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:text-black transition-all duration-500">
                        <ArrowRight size={16} strokeWidth={1} />
                      </div>
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
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
  const product = COLLECTIONS[0];
  const [activeImg, setActiveImg] = useState(0);
  const images = [product.image, img1, img2, img3];
  
  return (
    <div className="bg-luxury-black text-luxury-white min-h-screen">
      <div className="pt-24 md:pt-32 pb-20 md:pb-32 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Product Image Slider Side */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden border border-soft">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImg}
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
                {images.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeImg === i ? 'bg-white w-6' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 md:gap-4">
               {images.map((img, i) => (
                 <button 
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square border transition-all overflow-hidden ${activeImg === i ? 'border-white' : 'border-soft opacity-50'}`}
                 >
                    <img src={img} className="w-full h-full object-cover" />
                 </button>
               ))}
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
                <span className="text-white">Black Oxford</span>
              </nav>

              <h1 className="serif text-5xl md:text-7xl leading-none mb-6 tracking-tighter">
                Black <br />
                <span className="italic text-zinc-500">Oxford</span>
              </h1>
              
              <div className="flex items-center gap-6 md:gap-8 mb-8 md:mb-10">
                 <span className="serif text-2xl md:text-3xl font-light text-white">{product.price}</span>
                 <div className="h-[1px] flex-1 bg-white/10"></div>
                 <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-mono">SKU: ET-OX-001</div>
              </div>

              <div className="mb-10 md:mb-12">
                <p className="text-[13px] md:text-sm font-light text-zinc-300 leading-relaxed mb-6 italic max-w-md">
                  {product.description}
                </p>
                <p className="text-[10px] md:text-[11px] text-zinc-500 leading-relaxed font-light max-w-sm">
                  Precision-engineered with a traditional Goodyear-welted sole and crafted from a single piece of premium calfskin. A masterclass in artisanal integrity.
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
                        <button key={size.eu} className="group border border-soft py-3 px-2 flex flex-col items-center justify-center hover:border-white transition-all">
                          <span className="text-[10px] text-white">EU {size.eu}</span>
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

              {/* Details Toggles Style */}
              <div className="flex flex-col border-t border-soft">
                 {['Sartorial Specs', 'Shipping & Returns', 'Maintenance'].map((tab) => (
                   <div key={tab} className="border-b border-soft py-5 md:py-6 flex justify-between items-center cursor-pointer group">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-zinc-400 group-hover:text-white transition-colors">{tab}</span>
                      <ChevronDown size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="mt-40 md:mt-64 pt-20 md:pt-32 border-t border-soft">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-24 md:mb-48">
             <div className="flex flex-col justify-center order-2 md:order-1">
                <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-6 font-mono">Process No. 01</span>
                <h2 className="serif text-4xl md:text-7xl mb-8 md:mb-10 leading-tight">
                  The Art of the <br />
                  <span className="italic opacity-60">Wholecut Upper</span>
                </h2>
                <div className="w-20 h-[1px] bg-white opacity-20 mb-8 md:mb-10"></div>
                <p className="font-light text-zinc-400 leading-relaxed mb-6 md:mb-8 text-[13px] md:text-sm italic">
                  Unlike conventional footwear that utilizes multiple panels of leather, each Eternal Oxford is cut from a single, unblemished piece of hide. This "Wholecut" process requires an extraordinary level of skill and significantly higher leather wastage to ensure absolute structural perfection.
                </p>
                <p className="font-light text-zinc-400 leading-relaxed text-[13px] md:text-sm">
                  Our master cutters spend years learning to identify the invisible grain flow of the skin, ensuring that every pair responds perfectly to the heat and pressure of the hand-lasting process.
                </p>
             </div>
             <div className="aspect-[4/5] bg-zinc-900 border border-soft overflow-hidden grayscale opacity-80 order-1 md:order-2">
                <img src={heritageImage} className="w-full h-full object-cover scale-110" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
             <div className="flex flex-col gap-4 md:gap-6">
                <span className="serif text-2xl italic opacity-80">01. Selection</span>
                <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed font-light">Only the top 3% of available calfskins from our Tuscan tannery are deemed suitable for the Eternal collection.</p>
             </div>
             <div className="flex flex-col gap-4 md:gap-6">
                <span className="serif text-2xl italic opacity-80">02. Hand-Welt</span>
                <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed font-light">A meticulous 270-degree Goodyear welt, stitched entirely by hand, allowing for indefinite resoling over the product's lifetime.</p>
             </div>
             <div className="flex flex-col gap-4 md:gap-6">
                <span className="serif text-2xl italic opacity-80">03. Finishing</span>
                <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed font-light">Each pair is finished with seven layers of hand-burnished wax, creating a deep, dimensional patina that matures exquisitely with age.</p>
             </div>
          </div>
        </div>
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
          <Route path="/product/black-oxford-leather" element={<ProductPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
