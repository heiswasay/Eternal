import React, { useState } from "react";
import { motion } from "motion/react";
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
                  src={images[1] || images[0]} 
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
                  src={product.slug === 'monk-strap' ? layersmImage : layersboImage} 
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

      {/* 3. The 48-Hour Bespoke Journey Steps */}
      <section className="border-t border-white/5 pt-12 md:pt-16 pb-10 md:pb-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14">
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
              desc: product.slug === 'monk-strap'
                ? "Before any stitch is applied, the hand-cut upper skin is thoroughly moistened and pulled with specialized pincers over heavy solid-beechwood lasts, remaining locked in place for full 24-hour cycles to preserve architectural form permanently."
                : "Before any stitch is applied, the hand-cut leather upper is thoroughly moistened and pulled with specialized pincers over heavy solid-beechwood lasts, remaining locked in place for full 24-hour cycles to preserve architectural form permanently."
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
              desc: product.slug === 'monk-strap'
                ? "Each product undergoes multi-stage manual burnishing procedures. Tanners apply pigment creams, following up with a deep coat of natural organic beeswax rubbed manually to foster a mirror-like dimensional lasting shine."
                : "Each product undergoes multi-stage manual burnishing procedures. Tanners apply pigment creams, following up with a deep coat of natural organic beeswax rubbed manually to foster a mirror-like dimensional leather shine."
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col border-t border-white/5 pt-8 group cursor-default">
              <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-4 sm:mb-6">
                <span className="serif text-lg italic text-zinc-600 group-hover:text-white transition-colors duration-500">{item.step} // {item.title}</span>
                <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase tracking-wider">{item.caption}</span>
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
      <section className="bg-white/5 border border-white/10 p-6 sm:p-10 md:p-12 mt-12 md:mt-16 relative overflow-hidden rounded-sm">
        <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] bg-gradient-to-l from-white/[0.02] to-transparent rounded-full rotate-45 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="flex gap-4 items-center mb-5">
              <ShieldCheck className="text-white opacity-80" size={20} strokeWidth={1} />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-medium">Eternal Studio Pledge</span>
            </div>
            <h3 className="serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none mb-4">
              Lifetime <span className="italic font-light">Recrafting</span>
            </h3>
            <p className="text-zinc-400 max-w-xl leading-relaxed font-light text-[11px] uppercase tracking-wider">
              {product.slug === 'monk-strap'
                ? "We pledge to preserve the legacy of your purchase. Bring back your worn down soles to our atelier in the future; our shoemakers will seamlessly strip, rebuild, and re-last the upper using original techniques."
                : "We pledge to preserve the legacy of your purchase. Bring back your worn down soles to our atelier in the future; our shoemakers will seamlessly strip, rebuild, and re-last the leather using original techniques."}
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end w-full">
            <button className="flex items-center justify-between sm:justify-start gap-6 group hover:text-white text-zinc-400 border border-white/10 px-6 py-4 transition-all hover:bg-white hover:text-black w-full sm:w-auto">
              <span className="text-[10px] uppercase tracking-[0.4em] font-semibold">Learn Atelier Service</span>
              <ArrowRight size={14} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
