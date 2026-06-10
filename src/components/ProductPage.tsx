import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { COLLECTIONS } from "../data/collections";
import { useCart } from "../context/CartContext";
import { ProductStory } from "./ProductStory";

// Import fallback images
import heroImage from "../images/hero3.webp";
import img1 from "../images/1.webp";
import img2 from "../images/2.webp";
import img3 from "../images/3.webp";

export const ProductPage = () => {
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
