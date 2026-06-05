import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layers, ShieldCheck, Compass, Eye } from "lucide-react";
import layersboImage from "../images/layersbo.png";
import layersmImage from "../images/layersm.png";

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

interface ProductStoryProps {
  product: CollectionItemInfo;
  images: string[];
}

export const ProductStory: React.FC<ProductStoryProps> = ({ product, images }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const [reviewsList, setReviewsList] = useState<Array<{
    initials: string;
    city: string;
    rating: string;
    desc: string;
    orderNo: string;
    date?: string;
  }>>(() => {
    const saved = localStorage.getItem(`reviews_${product.slug}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    
    // Default reviews mapped by slug
    const defaultReviewsMap: Record<string, Array<{ initials: string; city: string; rating: string; desc: string; orderNo: string }>> = {
      "black-oxford-leather": [
        {
          initials: "K. HASHMI",
          city: "Karachi",
          rating: "★★★★★",
          desc: "My first pair from them and I am completely blown away. The leather aroma, the precise unboxing presentation, and the snug fit of this single pair are of international caliber. Wore them to an executive dinner and felt a class apart.",
          orderNo: "1 PAIR PURCHASED // ORDER #1042"
        },
        {
          initials: "Z. AHMED",
          city: "Lahore",
          rating: "★★★★★",
          desc: "Acquired this pair after hearing about their Lahore workshop. The handwelted classic leather sole has a beautiful, rich resonance and feels wonderfully broken-in after just two wears. A phenomenal purchase.",
          orderNo: "1 PAIR PURCHASED // ORDER #2180"
        },
        {
          initials: "A. REHMAN",
          city: "Islamabad",
          rating: "★★★★★",
          desc: "Incredible attention to detail on this single pair. From the heavy felted box and micro-fibre dust bags to the high-density cork bed cushioning. This is easily the most superior dress shoe in my wardrobe.",
          orderNo: "1 PAIR PURCHASED // ORDER #3095"
        }
      ]
    };

    return defaultReviewsMap[product.slug] || [
      {
        initials: "K. HASHMI",
        city: "Karachi",
        rating: "★★★★★",
        desc: "My first pair from them and I am completely blown away. The leather aroma, the precise unboxing presentation, and the snug fit of this single pair are of international caliber. Wore them to an executive dinner and felt a class apart.",
        orderNo: "1 PAIR PURCHASED // ORDER #1042"
      },
      {
        initials: "Z. AHMED",
        city: "Lahore",
        rating: "★★★★★",
        desc: "Acquired this pair after hearing about their Lahore workshop. The handwelted classic leather sole has a beautiful, rich resonance and feels wonderfully broken-in after just two wears. A phenomenal purchase.",
        orderNo: "1 PAIR PURCHASED // ORDER #2180"
      },
      {
        initials: "A. REHMAN",
        city: "Islamabad",
        rating: "★★★★★",
        desc: "Incredible attention to detail on this single pair. From the heavy felted box and micro-fibre dust bags to the high-density cork bed cushioning. This is easily the most superior dress shoe in my wardrobe.",
        orderNo: "1 PAIR PURCHASED // ORDER #3095"
      }
    ];
  });

  const [formInitials, setFormInitials] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formDesc, setFormDesc] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInitials.trim() || !formCity.trim() || !formDesc.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    
    const stars = "★".repeat(formRating) + "☆".repeat(5 - formRating);
    const orderNum = Math.floor(Math.random() * 8999) + 1000;
    const newReview = {
      initials: formInitials.toUpperCase().trim(),
      city: formCity.trim(),
      rating: stars,
      desc: formDesc.trim(),
      orderNo: `1 PAIR PURCHASED // ORDER #${orderNum}`
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem(`reviews_${product.slug}`, JSON.stringify(updated));

    // Reset Form
    setFormInitials("");
    setFormCity("");
    setFormRating(5);
    setFormDesc("");
    setErrorMsg("");
    setSuccessMsg("Your feedback has been published securely.");
    setTimeout(() => {
      setSuccessMsg("");
    }, 5000);
  };

  const anatomyPoints = [
    {
      id: 1,
      title: "Aniline Full-Grain Upper",
      coord: { x: "25%", y: "30%" },
      desc: "Selected from the premium 3% of French skins, left uncorrected to breathe and patina gracefully with age."
    },
    {
      id: 2,
      title: `${product.specs.construction} Welt`,
      coord: { x: "40%", y: "65%" },
      desc: "Stitched with wax-infused flax thread to form an enduring, moisture-resistant barrier."
    },
    {
      id: 3,
      title: "Granulated Oak Cork Bed",
      coord: { x: "65%", y: "45%" },
      desc: "A pure organic cork midfill that custom-molds perfectly to your footprint over time."
    },
    {
      id: 4,
      title: product.slug === 'monk-strap' ? "Stacked Solid Heel" : "Stacked Solid Leather Heel",
      coord: { x: "85%", y: "75%" },
      desc: product.slug === 'monk-strap' 
        ? "Individually hand-stacked lifts anchored securely with solid high-tensile brass pegs."
        : "Individually hand-stacked leather lifts anchored securely with solid high-tensile brass pegs."
    }
  ];

  return (
    <div className="mt-12 md:mt-20">
      {/* 1. Visual Structural Anatomy Panel */}
      <section className="border-t border-white/5 pt-0 pb-10 md:pb-14">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-4 block">Engineered Anatomy</span>
          <h2 className="serif text-3.5xl md:text-5xl tracking-tight leading-none mb-4">
            Structural <span className="italic opacity-60">Anatomy</span>
          </h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6"></div>
        </div>

        {/* Dynamic Interactive Anatomy Map & Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Detailed Specifications Column (Left) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
            <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 border-l border-white/20 pl-4 block font-mono">Visual Schematic Indicators</span>
            
            <div className="flex flex-col gap-4">
              {anatomyPoints.map((point, index) => (
                <div 
                  key={point.id}
                  onMouseEnter={() => setHoveredPoint(point.id)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className={`p-5 border rounded-sm transition-all duration-300 cursor-pointer ${hoveredPoint === point.id ? 'border-white/30 bg-white/[0.03]' : 'border-white/5 hover:border-white/10 bg-transparent'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[8px] px-2 py-0.5 border border-white/10 text-zinc-500 font-bold uppercase">0{index + 1}</span>
                    <h4 className="serif text-sm text-zinc-200 tracking-wide font-medium">{point.title}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 tracking-wide leading-relaxed font-light pl-9">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Artwork Chassis Frame (Right/Center) */}
          <div className="lg:col-span-12 xl:col-span-7 relative flex justify-center items-center">
            <div className="relative w-full aspect-[4/3] bg-zinc-950/80 border border-soft p-4 sm:p-6 overflow-hidden flex items-center justify-center rounded-sm">
              
              {/* Decorative Tech Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4vw_4vw]" />
              
              {/* Outline Circular Accents */}
              <div className="absolute w-[80%] h-[80%] rounded-full border border-white/[0.01] pointer-events-none" />
              <div className="absolute w-[50%] h-[50%] rounded-full border border-dashed border-white/[0.02] pointer-events-none" />

              {/* Central Shoe Image under Tech Blueprint Overlay */}
              <div className="relative z-10 w-full max-w-lg h-auto aspect-[4/3] overflow-hidden flex items-center justify-center select-none">
                <img 
                  src={product.specs.anatomyImage || images[1] || images[0]} 
                  alt="Anatomy Overlay" 
                  onError={(e) => {
                    if (product.slug === 'monk-strap') {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800";
                    } else {
                      e.currentTarget.src = images[0];
                    }
                  }}
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Technical Spec Labels in Corner */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-col gap-1 z-20 pointer-events-none">
                <span className="text-[7px] font-mono tracking-[0.3em] uppercase opacity-35">Chassis Calibration</span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-400">REF: ETN-SH-{product.id}-D99</span>
              </div>
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
                <span className="text-[7px] font-mono tracking-[0.3em] uppercase opacity-35">Visual Schematic Chamber</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Deep Dive: Material Origins with Parallax Image Cards */}
      <section className="border-t border-white/5 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-14">
          <span className="text-[10px] uppercase tracking-[0.7em] text-zinc-500 mb-4 block">Sourcing & Pedigree</span>
          <h2 className="serif text-4xl md:text-5xl leading-tight mb-4">
            Pristine <span className="italic font-light">Materials</span>
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Beautiful creations are born of nature's premium masterpieces. We select only pristine elements containing natural characteristics and unmatched structural resilience.
          </p>
        </div>

        {/* Long Editorial Story Blocks with dynamic product specs & big descriptive illustrations */}
        <div className="flex flex-col gap-12 md:gap-16">
          
          {/* Leather Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image (Left on Desktop) */}
            <div className="order-1 lg:order-1 relative group overflow-hidden border border-soft shadow-xl">
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                <img 
                  src={product.specs.leatherImage || images[2] || images[0]} 
                  alt="Leather Tannery Crafting" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1524275514187-3d16e7fbe605?q=80&w=1000";
                  }}
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-4 left-4 p-3 md:top-6 md:left-6 md:p-4 bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-300">TUSCAN ARTISANAL PROCESS</span>
              </div>
            </div>

            {/* Content (Right on Desktop) */}
            <div className="order-2 lg:order-2 flex flex-col md:pl-6">
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500 uppercase mb-4">
                {product.slug === 'monk-strap' ? "SPEC COMPONENT // COGNAC SPECIALTY" : "SPEC COMPONENT // LEATHER"}
              </span>
              <h3 className="serif text-3xl md:text-4xl mb-6 tracking-tight leading-none text-white">
                {product.slug === 'monk-strap' ? "Signature Museum Calfskin" : "Calf Skin Leather"}
              </h3>
              <div className="w-12 h-px bg-white/20 mb-8" />
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed uppercase tracking-[0.2em] mb-6">
                {product.specs.leather}
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                {product.specs.leatherDetail}
              </p>
            </div>
          </div>

          {/* Sole Crafting Section (ZIGZAG - Image right on Desktop, Text left) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Content (Left on Desktop, Right on Mobile) */}
            <div className="order-2 lg:order-1 flex flex-col md:pr-6">
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500 uppercase mb-4">SPEC COMPONENT // THE SOLE</span>
              <h3 className="serif text-3xl md:text-4xl mb-6 tracking-tight leading-none text-white">
                {product.slug === 'monk-strap' ? "The Hand-Welted Sole" : "The Leather Sole"}
              </h3>
              <div className="w-12 h-px bg-white/20 mb-8" />
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed uppercase tracking-[0.2em] mb-6">
                {product.specs.sole}
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                {product.specs.soleDetail}
              </p>
            </div>

            {/* Image (Right on Desktop, Left on Mobile) */}
            <div className="order-1 lg:order-2 relative group overflow-hidden border border-soft shadow-xl">
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                <img 
                  src={product.specs.soleImage || images[7] || images[3] || images[1]} 
                  alt="Sole Cutting & Stitching" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000";
                  }}
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-4 right-4 p-3 md:top-6 md:right-6 md:p-4 bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-300">DOUBLE OAK-BARK EMBOSSING</span>
              </div>
            </div>
          </div>

          {/* Lacing and Fastening Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image (Left on Desktop) */}
            <div className="order-1 lg:order-1 relative group overflow-hidden border border-soft shadow-xl">
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                <img 
                  src={product.specs.lacesImage || images[6] || images[4] || images[0]} 
                  alt="Sartorial Trims Finishing" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1589782182703-e869260b8b09?q=80&w=1000";
                  }}
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-4 left-4 p-3 md:top-6 md:left-6 md:p-4 bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-300">
                  {product.slug === 'monk-strap' ? "FLORENTINE BRASS CASTINGS" : "AUTHENTIC TRIMS OR FABRIC"}
                </span>
              </div>
            </div>

            {/* Content (Right on Desktop) */}
            <div className="order-2 lg:order-2 flex flex-col md:pl-6">
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500 uppercase mb-4">
                {product.slug === 'monk-strap' ? "SPEC COMPONENT // THE BUCKLES" : "SPEC COMPONENT // THE TRIMS"}
              </span>
              <h3 className="serif text-3xl md:text-4xl mb-6 tracking-tight leading-none text-white">
                {product.slug === 'monk-strap' ? "The Brass Buckles" : "The Premium Laces"}
              </h3>
              <div className="w-12 h-px bg-white/20 mb-8" />
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed uppercase tracking-[0.2em] mb-6">
                {product.specs.laces}
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                {product.specs.lacesDetail}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Exploded Construction Layers Exhibition */}
      <section className="border-t border-white/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-14">
            <span className="text-[10px] uppercase tracking-[0.7em] text-zinc-500 mb-6 block">Structural Composition</span>
            <h2 className="serif text-4xl md:text-5xl leading-tight text-white mb-6">
              The <span className="italic font-light">Layers of Excellence</span>
            </h2>
            <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
              Every millimeter is carefully modeled, layered, and stitched. Explore the architecture of our masterpiece.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
            
            {/* Left Column: Majestic Exploded Image Display */}
            <div className="lg:col-span-6 flex justify-center items-center w-full">
              <div className="relative border border-white/5 bg-zinc-950/50 p-4 sm:p-6 md:p-12 overflow-hidden rounded-sm w-full flex justify-center items-center group">
                {/* Subtle blueprint grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                
                {/* Visual architectural framing details */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10" />

                <motion.img 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  src={product.specs.layersImage || (product.slug === 'monk-strap' ? layersmImage : layersboImage)} 
                  alt="Bespoke Shoe Structured Layers" 
                  className="max-h-[380px] md:max-h-[500px] w-auto h-auto object-contain select-none transition-all duration-700 relative z-10"
                />

                {/* Vertical blueprint measurements */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-25 z-0 pointer-events-none text-right hidden sm:flex">
                  <span className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase rotate-90 my-12">Y-AXIS STACK</span>
                  <div className="w-px h-24 bg-white/20" />
                </div>
              </div>
            </div>

            {/* Right Column: Layer Specs / Exploded Stack details */}
            <div className="lg:col-span-6 flex flex-col gap-6 w-full">
              <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 border-l border-white/20 pl-4 block mb-2 font-mono">Structural Composition Callout</span>
              
              <div className="flex flex-col border-t border-white/5">
                {[
                  {
                    level: "Level 1",
                    name: "Aniline Box-Calf Upper Skin",
                    desc: "Sourced from premier European tanneries, left entirely uncorrected to age with natural elegance and deep patina."
                  },
                  {
                    level: "Level 2",
                    name: product.slug === 'monk-strap' ? "Curried Double-Calf Insole" : "Curried Double-Leather Insole",
                    desc: product.slug === 'monk-strap' 
                      ? "An organic 5mm vegetable-tanned shoulder that channels moisture and anchors the entire welt."
                      : "An organic 5mm vegetable-tanned leather shoulder that channels moisture and anchors the entire welt."
                  },
                  {
                    level: "Level 3",
                    name: "Granulated Portuguese Cork Fill",
                    desc: "A hand-packed cavity formulation that dynamically heat-molds to your foot contour for natural padding."
                  },
                  {
                    level: "Level 4",
                    name: product.slug === 'monk-strap' ? "Oak-Bark Tanned Outsole" : "Oak-Bark Tanned Leather Outsole",
                    desc: product.slug === 'monk-strap'
                      ? "Pressed and wax-infused ground-contact surface pit-tanned for 12 months. Incredible resilience and flexibility."
                      : "Pressed and wax-infused ground-contact leather pit-tanned for 12 months. Incredible resilience and flexibility."
                  }
                ].map((layer, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group flex flex-col py-5 border-b border-white/5 hover:border-white/20 transition-all cursor-default"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1 sm:gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[8px] text-zinc-600 tracking-wider font-bold shrink-0">{layer.level}</span>
                        <h4 className="serif text-sm text-zinc-300 group-hover:text-white transition-colors duration-300 font-medium">
                          {layer.name}
                        </h4>
                      </div>
                      <span className="text-[7px] font-mono tracking-widest text-zinc-600 uppercase whitespace-nowrap pl-8 sm:pl-0">100% Bespoke</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-light leading-relaxed pl-8 sm:pl-11">
                      {layer.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Patron Testimonials / Reviews Section */}
      <section className="border-t border-white/5 pt-12 md:pt-16 pb-10 md:pb-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 border-b border-white/5 pb-8">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-4 block">Patron Testimonials</span>
            <h2 className="serif text-4xl md:text-6xl tracking-tight leading-none">
              Reflections of <span className="italic opacity-60 font-light">The Discerning</span>
            </h2>
          </div>
          <div className="mt-6 md:mt-0 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Verified Footwear Ownership // 1 Pair Purchases
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-10">
            {reviewsList.length === 0 ? (
              <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest py-10">
                // No testimonials registered on the ledger yet.
              </div>
            ) : (
              reviewsList.map((item, idx) => (
                <div key={idx} className="flex flex-col border-b border-white/5 pb-8 last:border-b-0 last:pb-0 group cursor-default">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-3">
                    <span className="serif text-lg italic text-zinc-300 group-hover:text-white transition-colors duration-500">
                      {item.initials} — <span className="text-sm not-italic opacity-60 font-light">{item.city}</span>
                    </span>
                    <span className="text-xs text-yellow-500/90 font-bold select-none tracking-normal">
                      {item.rating}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed mb-4">
                    "{item.desc}"
                  </p>
                  <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-400 transition-all">
                    <span className="text-[9px] font-mono uppercase tracking-wider font-medium">{item.orderNo}</span>
                    <ShieldCheck size={11} className="text-emerald-500/70" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Post Review Form */}
          <div className="lg:col-span-5 bg-zinc-900/40 border border-white/5 rounded-sm p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 block uppercase mb-1">Customer Voice</span>
              <h4 className="serif text-xl text-white">Record Your <span className="italic font-light">Testimonial</span></h4>
              <p className="text-xs text-zinc-500 font-light mt-1">We value the authentic feedback of our local patrons.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-950/25 border border-red-900/30 text-red-300 text-xs font-mono rounded-sm">
                  {errorMsg}
                </div>
              )}
              
              {successMsg && (
                <div className="p-3 bg-emerald-950/25 border border-emerald-900/30 text-emerald-300 text-xs font-mono rounded-sm">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-zinc-400 mb-1.5">Initials / Name</label>
                  <input
                    type="text"
                    value={formInitials}
                    onChange={(e) => setFormInitials(e.target.value)}
                    placeholder="e.g. A. Khan"
                    required
                    maxLength={30}
                    className="border border-white/10 focus:border-white/40 rounded-sm bg-black/40 px-3 py-2 text-sm text-white focus:outline-none transition-colors duration-300 placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-zinc-400 mb-1.5">City</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Lahore"
                    required
                    maxLength={35}
                    className="border border-white/10 focus:border-white/40 rounded-sm bg-black/40 px-3 py-2 text-sm text-white focus:outline-none transition-colors duration-300 placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-zinc-400 mb-1">Your Rating</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormRating(num)}
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-lg focus:outline-none transition-transform duration-100 hover:scale-110"
                      >
                        <span className={num <= (hoverRating || formRating) ? "text-yellow-500 select-none mr-0.5" : "text-zinc-700 select-none mr-0.5"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    ({formRating} out of 5 stars)
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-zinc-400 mb-1.5">Your Experience</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Share details about the quality, premium unboxing, comfort, or leather of your Eternal shoes..."
                  required
                  maxLength={500}
                  className="border border-white/10 focus:border-white/40 rounded-sm bg-black/40 p-3 text-sm text-zinc-300 h-28 focus:outline-none transition-colors duration-300 placeholder:text-zinc-600 leading-relaxed font-light"
                />
              </div>

              <div className="flex items-center gap-3 bg-zinc-950/20 border border-white/5 rounded-sm p-3">
                <input 
                  type="checkbox" 
                  id="verified-buyer" 
                  defaultChecked 
                  disabled
                  className="rounded bg-black border-white/10 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-default" 
                />
                <label htmlFor="verified-buyer" className="text-[10px] text-zinc-500 select-none leading-none uppercase tracking-wider">
                  Authenticate verified purchase of 1 Pair
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-between gap-6 group hover:text-black text-white border border-white/20 px-6 py-3.5 transition-all hover:bg-white cursor-pointer rounded-sm"
              >
                <span className="text-xs uppercase tracking-widest font-semibold">Publish Testimonial</span>
                <ArrowRight size={14} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Atelier Legacy Credentials / Guarantees Banner */}
      <section className="bg-white/5 border border-white/10 p-6 sm:p-10 md:p-12 mt-12 md:mt-16 relative overflow-hidden rounded-sm">
        <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] bg-gradient-to-l from-white/[0.02] to-transparent rounded-full rotate-45 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="flex gap-4 items-center mb-5">
              <ShieldCheck className="text-white opacity-80" size={20} strokeWidth={1} />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-medium">The Atelier Legacy</span>
            </div>
            <h3 className="serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none mb-4">
              Visit The <span className="italic font-light">Atelier</span>
            </h3>
            <p className="text-zinc-400 max-w-xl leading-relaxed font-light text-[11px] uppercase tracking-wider">
              We invite you to experience the birthplace of true shoemaking. Visit our atelier to witness our master artisans' dedication, explore our heritage of design, and see how our signature footwear is formed.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end w-full">
            <Link to="/atelier" className="flex items-center justify-between sm:justify-start gap-6 group hover:text-white text-zinc-400 border border-white/10 px-6 py-4 transition-all hover:bg-white hover:text-black w-full sm:w-auto text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] font-semibold">Explore The Atelier</span>
              <ArrowRight size={14} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
