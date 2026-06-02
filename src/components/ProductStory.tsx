import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Layers, ShieldCheck, Compass, Eye } from "lucide-react";

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

interface ProductStoryProps {
  product: CollectionItemInfo;
  images: string[];
}

export const ProductStory: React.FC<ProductStoryProps> = ({ product, images }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const anatomyPoints = [
    {
      id: 1,
      title: "Full-Grain Leather Upper",
      coord: { x: "25%", y: "30%" },
      desc: "Selected from the upper 3% of Tuscan box-calf or museum calf skins. Kept completely uncorrected to ensure natural grain retention, breathability, and an exquisite organic patina development over its lifetime."
    },
    {
      id: 2,
      title: `${product.specs.construction} Welt Chamber`,
      coord: { x: "40%", y: "65%" },
      desc: `Our signature ${product.specs.construction.toLowerCase()} construction. Uses an ultra-dense flax thread fully saturated with pitch pine tar to form an impermeable organic barrier preventing moisture from breaching the interior.`
    },
    {
      id: 3,
      title: "Natural Cork Filling & Steel Shank",
      coord: { x: "65%", y: "45%" },
      desc: "A hand-packed cavity of premium granulated Portuguese cork that slowly compresses under warmth and pressure to conform exactly to your foot’s unique orthopaedic profile, supported by a tempered steel alignment shank."
    },
    {
      id: 4,
      title: "Stacked Leather Heel & Oak Outsole",
      coord: { x: "85%", y: "75%" },
      desc: "A heavy-grade dense oak-bark-tanned outsole. Every lift of the heel is individually hand-stacked, aligned, nailed with high-tensile brass pegs, and edge-shaved to a pristine, dense, glass-smooth editorial gleam."
    }
  ];

  return (
    <div className="mt-24 md:mt-48">
      {/* 1. Visual Structural Anatomy Panel */}
      <section className="border-t border-white/5 pt-0 pb-16 md:pb-24">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-4 block">Engineered Anatomy</span>
          <h2 className="serif text-3.5xl md:text-5xl tracking-tight leading-none mb-4">
            Structural <span className="italic opacity-60">Anatomy</span>
          </h2>
          <div className="w-16 h-[1px] bg-white/25 mx-auto mt-6"></div>
        </div>

        {/* Dynamic Interactive Anatomy Map & Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Detailed Specifications Column (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-8 md:gap-10">
            <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 border-l border-white/20 pl-4 block">Visual Schematic Indicators</span>
            
            <div className="flex flex-col gap-6">
              {anatomyPoints.map((point, index) => (
                <div 
                  key={point.id}
                  onMouseEnter={() => setHoveredPoint(point.id)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className={`p-6 border transition-all duration-300 cursor-pointer ${hoveredPoint === point.id ? 'border-white bg-white/5 scale-[1.02]' : 'border-white/5 hover:border-white/20 bg-transparent'}`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[9px] px-2 py-0.5 border border-white/20 text-zinc-400">0{index + 1}</span>
                    <h4 className="serif text-base text-white tracking-wide">{point.title}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed uppercase tracking-widest">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Artwork Chassis Frame (Right/Center) */}
          <div className="lg:col-span-12 xl:col-span-7 relative flex justify-center items-center">
            <div className="relative w-full aspect-[4/3] bg-zinc-950/80 border border-soft p-6 overflow-hidden flex items-center justify-center rounded-sm">
              
              {/* Decorative Tech Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4vw_4vw]" />
              
              {/* Outline Circular Accents */}
              <div className="absolute w-[80%] h-[80%] rounded-full border border-white/[0.01] pointer-events-none" />
              <div className="absolute w-[50%] h-[50%] rounded-full border border-dashed border-white/[0.02] pointer-events-none" />

              {/* Central Shoe Image under Tech Blueprint Overlay */}
              <div className="relative z-10 w-full max-w-lg h-auto aspect-[4/3] overflow-hidden flex items-center justify-center select-none">
                <img 
                  src={images[1] || images[0]} 
                  alt="Anatomy Overlay" 
                  className="w-full h-full object-contain ease-out transition-transform duration-700 hover:scale-105" 
                />
                
                {/* Overlay Lines Connecting Points */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                  {hoveredPoint === 1 && (
                    <motion.path 
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }} 
                      d="M 125 150 L 190 120" 
                      stroke="white" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" 
                      fill="none" 
                    />
                  )}
                  {hoveredPoint === 2 && (
                    <motion.path 
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }} 
                      d="M 195 240 L 260 210" 
                      stroke="white" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" 
                      fill="none" 
                    />
                  )}
                  {hoveredPoint === 3 && (
                    <motion.path 
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }} 
                      d="M 315 180 L 370 170" 
                      stroke="white" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" 
                      fill="none" 
                    />
                  )}
                  {hoveredPoint === 4 && (
                    <motion.path 
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }} 
                      d="M 400 270 L 415 230" 
                      stroke="white" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" 
                      fill="none" 
                    />
                  )}
                </svg>

                {/* Hotspot Pins */}
                {anatomyPoints.map((point) => (
                  <button
                    key={point.id}
                    onMouseEnter={() => setHoveredPoint(point.id)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ left: point.coord.x, top: point.coord.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
                  >
                    <span className="absolute inline-flex h-6 w-6 rounded-full bg-white/20 animate-ping opacity-75"></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 items-center justify-center transition-all ${hoveredPoint === point.id ? 'bg-white scale-125' : 'bg-white/60'}`} />
                  </button>
                ))}
              </div>

              {/* Technical Spec Labels in Corner */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-1 z-20 pointer-events-none">
                <span className="text-[7px] font-mono tracking-[0.3em] uppercase opacity-35">Chassis Calibration</span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-400">REF: ETN-SH-{product.id}-D99</span>
              </div>
              <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                <Eye size={10} className="text-zinc-500 animate-pulse" />
                <span className="text-[7px] font-mono tracking-[0.3em] uppercase opacity-35">Interactive Wireframe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Deep Dive: Material Origins with Parallax Image Cards */}
      <section className="border-t border-white/5 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-28">
          <span className="text-[10px] uppercase tracking-[0.7em] text-zinc-500 mb-6 block">Sourcing & Pedigree</span>
          <h2 className="serif text-4xl md:text-5xl leading-tight mb-8">
            Pristine <span className="italic font-light">Materials</span>
          </h2>
          <p className="text-[12px] uppercase tracking-widest text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Beautiful creations are born of nature's premium masterpieces. We select only pristine elements containing natural characteristics and unmatched structural resilience.
          </p>
        </div>

        {/* Long Editorial Story Blocks with dynamic product specs & big descriptive illustrations */}
        <div className="flex flex-col gap-24 md:gap-40">
          
          {/* Leather Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image (Left on Desktop) */}
            <div className="order-1 lg:order-1 relative group overflow-hidden border border-soft shadow-xl">
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                <img 
                  src={images[2] || images[0]} 
                  alt="Leather Tannery Crafting" 
                  className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110" 
                />
              </div>
              <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-300">TUSCAN ARTISANAL PROCESS</span>
              </div>
            </div>

            {/* Content (Right on Desktop) */}
            <div className="order-2 lg:order-2 flex flex-col md:pl-6">
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500 uppercase mb-4">SPEC COMPONENT // LEATHER</span>
              <h3 className="serif text-3xl md:text-4xl mb-6 tracking-tight leading-none text-white">Calf Skin Leather</h3>
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
              <h3 className="serif text-3xl md:text-4xl mb-6 tracking-tight leading-none text-white">The Leather Sole</h3>
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
                  src={images[7] || images[3] || images[1]} 
                  alt="Sole Cutting & Stitching" 
                  className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110" 
                />
              </div>
              <div className="absolute top-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
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
                  src={images[6] || images[4] || images[0]} 
                  alt="Sartorial Trims Finishing" 
                  className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110" 
                />
              </div>
              <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-300">AUTHENTIC TRIMS OR FABRIC</span>
              </div>
            </div>

            {/* Content (Right on Desktop) */}
            <div className="order-2 lg:order-2 flex flex-col md:pl-6">
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500 uppercase mb-4">SPEC COMPONENT // THE TRIMS</span>
              <h3 className="serif text-3xl md:text-4xl mb-6 tracking-tight leading-none text-white">The Premium Laces</h3>
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

      {/* 3. The 48-Hour Bespoke Journey Steps */}
      <section className="border-t border-white/5 pt-20 md:pt-32 pb-12 md:pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-4 block">Chronicles Of Devotion</span>
            <h2 className="serif text-4xl md:text-6xl tracking-tight leading-none">
              The <span className="italic opacity-60">Hand-Build Story</span>
            </h2>
          </div>
          <div className="mt-6 md:mt-0 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Est. Period: 48 Collective Hours / 200+ Hand Interventions 
          </div>
        </div>

        {/* Triple horizontal block row layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              step: "01",
              title: "Lasting Over Wood",
              caption: "Molding curves via heat & tension",
              desc: "Before any stitch is applied, the hand-cut leather upper is thoroughly moistened and pulled with specialized pincers over heavy solid-beechwood lasts, remaining locked in place for full 24-hour cycles to preserve architectural form permanently."
            },
            {
              step: "02",
              title: "The Welted Stitch",
              caption: "Goodyear handwelted joinery",
              desc: "We perform a robust stitch run fusing sole, upper skin, and lining together through a continuous horizontal band. Designed with a custom double-density channel, it keeps uppers completely separate in order to facilitate infinite resoling."
            },
            {
              step: "03",
              title: "Patina Glaze Finish",
              caption: "Layered natural beeswax glaze",
              desc: "Each product undergoes multi-stage manual burnishing procedures. Tanners apply pigment creams, following up with a deep coat of natural organic beeswax rubbed manually to foster a mirror-like dimensional leather shine."
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col border-t border-white/5 pt-8 group cursor-default">
              <div className="flex justify-between items-baseline mb-6">
                <span className="serif text-lg italic text-zinc-600 group-hover:text-white transition-colors duration-500">{item.step} // {item.title}</span>
                <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase">{item.caption}</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed uppercase tracking-widest mb-6">
                "{item.desc}"
              </p>
              <div className="mt-auto flex items-center gap-3 text-zinc-500 group-hover:text-white transition-all space-x-1">
                <span className="text-[8px] font-mono uppercase tracking-[0.3em] font-bold">Standard Metrology Check</span>
                <Compass size={11} className="transition-transform duration-[1s] group-hover:rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Atelier Legacy Credentials / Guarantees Banner */}
      <section className="bg-white/5 border border-white/10 p-8 md:p-16 mt-20 md:mt-32 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] bg-gradient-to-l from-white/[0.02] to-transparent rounded-full rotate-45 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="flex gap-4 items-center mb-6">
              <ShieldCheck className="text-white opacity-80" size={24} strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-medium">Eternal Studio Pledge</span>
            </div>
            <h3 className="serif text-3xl md:text-5xl tracking-tight leading-none mb-4">
              Lifetime <span className="italic font-light">Recrafting</span>
            </h3>
            <p className="text-zinc-400 max-w-xl leading-relaxed font-light text-[11px] uppercase tracking-wider">
              We pledge to preserve the legacy of your purchase. Bring back your worn down soles to our atelier in the future; our shoemakers will seamlessly strip, rebuild, and re-last the leather using original techniques.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <button className="flex items-center gap-6 group hover:text-white text-zinc-400 border border-white/10 px-6 py-4 transition-all hover:bg-white hover:text-black">
              <span className="text-[10px] uppercase tracking-[0.4em] font-semibold">Learn Atelier Service</span>
              <ArrowRight size={14} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
