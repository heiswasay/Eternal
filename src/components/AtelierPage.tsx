import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Clock, 
  MapPin, 
  Sliders, 
  Calendar, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Users, 
  Activity,
  Heart,
  CornerDownRight
} from "lucide-react";

// Local image imports corresponding to the blank files
import work1 from "../images/work1.webp";
import work2 from "../images/work2.webp";
import work3 from "../images/work3.webp";

// Beautiful, high-end fallbacks in case local files are empty or unrendered
const IMAGES = {
  cutting: "https://images.unsplash.com/photo-1590534247854-e97d5e3feef6?auto=format&fit=crop&w=1200&q=80",
  shaping: "https://images.unsplash.com/photo-1556905200-279565513a2d?auto=format&fit=crop&w=1200&q=80",
  showroom: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
};

interface MaterialOption {
  id: string;
  name: string;
  origin: string;
  patina: string;
  resilience: string;
  details: string;
  color: string;
}

const LEATHER_BENCH: MaterialOption[] = [
  {
    id: "aniline",
    name: "Tuscan Aniline Box-Calf",
    origin: "Tuscany, Italy (top 3% select)",
    patina: "Extremely rich / Glossy mirror shine",
    resilience: "High tensile / Naturally breathable",
    details: "Tanned with organic oak bark extracts over 45 days. Shows unblemished natural hides that enrich with daily conditioning.",
    color: "bg-amber-950"
  },
  {
    id: "suede",
    name: "Sartorial Royal Suede",
    origin: "Leeds, United Kingdom",
    patina: "Velvety matte / Deep rich dye",
    resilience: "Supple / Extremely comfortable",
    details: "Finished with double-shaved nap fibers. Water-repellent treated and ideal for softer bespoke tailoring silhouettes.",
    color: "bg-zinc-800"
  },
  {
    id: "cordovan",
    name: "Genuine Waxed Shell Cordovan",
    origin: "Horween Tannery, USA",
    patina: "Uncreased roll / Deep mahogany lustre",
    resilience: "Indestructible / Water-resistant",
    details: "Drawn from a flat muscle layer under the horse hide. Hand-greased with natural oils, aging over decades into a legendary patina.",
    color: "bg-red-950"
  }
];

export default function AtelierPage() {
  const [activeMaterial, setActiveMaterial] = useState<MaterialOption>(LEATHER_BENCH[0]);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "Bespoke Footwear Fitting",
    leatherPref: "Tuscan Aniline Box-Calf",
    date: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Persist appointment locally
      localStorage.setItem("atelier_appointment", JSON.stringify(formData));
    }, 1500);
  };

  return (
    <div className="bg-luxury-black text-white min-h-screen pt-24 md:pt-32 pb-20 px-4 sm:px-6 md:px-10 overflow-hidden font-sans">
      
      {/* 1. Atelier Header Frame */}
      <div className="max-w-7xl mx-auto border-b border-white/5 pb-10 md:pb-16 mb-12 md:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-4 block font-mono">
              TEMPLE OF SARTORIAL INTEGRITY
            </span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="serif text-4xl sm:text-6xl md:text-8xl tracking-tight leading-none mb-6"
            >
              The <span className="italic font-light">Atelier</span>
            </motion.h1>
            <p className="text-zinc-400 font-light max-w-xl text-[12px] sm:text-[13px] uppercase tracking-widest leading-relaxed">
              Crafted in the historic heart of Lahore, our master craftsmen construct individual expressions of lasting design over rigorous timelines. Here, compromise has no home.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[9px] uppercase tracking-widest text-zinc-500 border-l border-white/10 pl-6 lg:pl-8 py-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <MapPin size={10} className="text-zinc-400" />
              <span>31.520° N, 74.359° E</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Compass size={10} className="text-zinc-400" />
              <span>EST. 2020, LAHORE</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Clock size={10} className="text-zinc-400" />
              <span>128 STEPS // 48 HOURS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Photo Chronicles / Process Timeline */}
      <div className="max-w-7xl mx-auto mb-20 md:mb-32">
        <div className="mb-10 md:mb-16">
          <span className="text-[9px] font-mono uppercase tracking-[0.6em] text-zinc-500 block mb-2">Visual Chronicles</span>
          <h2 className="serif text-2xl sm:text-3.5xl tracking-normal text-white">
            Daily <span className="italic text-zinc-400">Atelier Flow</span>
          </h2>
        </div>

        {/* 3 Step Interactive Card Array */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          
          {/* Step 1: Cutting with work1.webp */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col border border-white/5 bg-zinc-950/40 p-4 sm:p-6 hover:border-white/15 transition-all duration-500 rounded-sm"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-zinc-900 border border-white/5 rounded-sm">
              <img 
                src={work1}
                alt="Artisan Cutting Selection"
                onError={(e) => {
                  // Fallback for empty image
                  (e.target as HTMLImageElement).src = IMAGES.cutting;
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-white/15">
                <span className="text-[8px] font-mono tracking-widest text-zinc-400">08:00 AM // STEP 1</span>
              </div>
            </div>
            <h3 className="serif text-xl sm:text-2xl mb-3 tracking-wide">
              Selecting & <span className="italic font-light text-zinc-400">Dividing Hides</span>
            </h3>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-light leading-relaxed mb-6">
              A careful evaluation occurs at morning light. Hides are manually scrutinized for millimeter-level density variations. No electric cutters or lasers are permitted.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono tracking-widest text-zinc-600">
              <span>SPI: N/A (CUT PHASE)</span>
              <span>CALIBRATION: 20°C</span>
            </div>
          </motion.div>

          {/* Step 2: Lasting with work2.webp */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group flex flex-col border border-white/5 bg-zinc-950/40 p-4 sm:p-6 hover:border-white/15 transition-all duration-500 rounded-sm"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-zinc-900 border border-white/5 rounded-sm">
              <img 
                src={work2}
                alt="Wood Last Calibration"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGES.shaping;
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-white/15">
                <span className="text-[8px] font-mono tracking-widest text-zinc-400">02:00 PM // STEP 2</span>
              </div>
            </div>
            <h3 className="serif text-xl sm:text-2xl mb-3 tracking-wide">
              The Tension <span className="italic font-light text-zinc-400">of Wood & Cord</span>
            </h3>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-light leading-relaxed mb-6">
              The leather is drawn taut across solid beechwood lasts. An artisan tensions the welt with wax-dipped biological linen cords using specialized hand awls.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono tracking-widest text-zinc-600">
              <span>9-11 SPI STITCHING</span>
              <span>PRESSURE: HIGH</span>
            </div>
          </motion.div>

          {/* Step 3: Finished Shoes with work3.webp */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group flex flex-col border border-white/5 bg-zinc-950/40 p-4 sm:p-6 hover:border-white/15 transition-all duration-500 rounded-sm"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-zinc-900 border border-white/5 rounded-sm">
              <img 
                src={work3}
                alt="The Mirror Polish"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGES.showroom;
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-white/15">
                <span className="text-[8px] font-mono tracking-widest text-zinc-400">05:00 PM // STEP  3</span>
              </div>
            </div>
            <h3 className="serif text-xl sm:text-2xl mb-3 tracking-wide">
              Beeswax <span className="italic font-light text-zinc-400">Mirror Finish</span>
            </h3>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-light leading-relaxed mb-6">
              Layer upon layer of champagne and mineral distillates are massaged with fine alpaca cloths onto the toe cap. This slowly develops a glossy, deeply refractive shell.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono tracking-widest text-zinc-600">
              <span>100% BEESWAX PATINA</span>
              <span>STABILITY: ETERNAL</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 3. Interactive Feature: Virtual Leather Bench (Extremely unique and premium) */}
      <div className="max-w-7xl mx-auto mb-20 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Selector */}
          <div className="lg:col-span-5">
            <span className="text-[9px] font-mono uppercase tracking-[0.6em] text-zinc-500 block mb-2">Tactile Diagnostics</span>
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              Virtual <span className="italic text-zinc-400">Leather Bench</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed text-[11px] uppercase tracking-wider mb-8">
              Atelier shoes feel like custom extensions of your body because we choose character-forming hide types. Select a material below to explore its structural specifications.
            </p>

            {/* Selection Buttons */}
            <div className="flex flex-col gap-4">
              {LEATHER_BENCH.map((mat) => {
                const isSelected = activeMaterial.id === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setActiveMaterial(mat)}
                    className={`flex items-center justify-between text-left p-4 border transition-all text-sm rounded-sm ${
                      isSelected 
                        ? "border-white bg-white/5" 
                        : "border-white/5 bg-transparent hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 ${mat.color} border border-white/20`} />
                      <span className={`font-mono text-xs uppercase tracking-wider ${isSelected ? "text-white" : "text-zinc-400"}`}>
                        {mat.name}
                      </span>
                    </div>
                    <ArrowRight size={12} className={`transition-transform duration-300 ${isSelected ? "translate-x-1 opacity-100" : "opacity-0"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Spec Deck */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-zinc-950/80 p-6 sm:p-10 relative overflow-hidden rounded-sm min-h-[380px] flex flex-col justify-between">
              {/* Subtle design block aesthetic */}
              <div className="absolute top-0 right-0 h-20 w-20 border-b border-l border-white/5 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMaterial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Decorative corner tag */}
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] font-semibold text-zinc-600">CALIBRATION SPEC</span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 bg-white/5 px-2 py-1">CERTIFIED RAW</span>
                  </div>

                  <div>
                    <h3 className="serif text-2xl sm:text-3xl text-white mb-2">{activeMaterial.name}</h3>
                    <p className="text-[11px] text-zinc-400 tracking-wide block uppercase font-light">Origin: {activeMaterial.origin}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                    <div>
                      <span className="block text-[8px] font-mono tracking-widest text-zinc-600 uppercase mb-1">Aging & Patina Profile</span>
                      <p className="text-xs text-zinc-300 font-light uppercase tracking-wider">{activeMaterial.patina}</p>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono tracking-widest text-zinc-600 uppercase mb-1">Structural Elasticity</span>
                      <p className="text-xs text-zinc-300 font-light uppercase tracking-wider">{activeMaterial.resilience}</p>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-4 mt-4 rounded-sm">
                    <span className="block text-[8px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Micro-Structure & Tanning</span>
                    <p className="text-[10px] text-zinc-400 font-light uppercase tracking-widest leading-relaxed">
                      "{activeMaterial.details}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Technical disclaimer */}
              <div className="mt-8 flex items-center gap-3 font-mono text-[8px] tracking-widest text-zinc-600">
                <Activity size={10} className="text-zinc-500 animate-pulse" />
                <span>100% TRACEABLE AND BIOLOGICALLY ETHICAL LIVESTOCK</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bespoke Private Consultation Form */}
      <div className="max-w-4xl mx-auto border border-white/10 bg-white/[0.02] p-6 sm:p-10 md:p-14 rounded-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-sm" />
        
        <div className="text-center mb-10 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-4 block font-mono">Bespoke Inquiries</span>
          <h2 className="serif text-3xl sm:text-5xl leading-tight text-white mb-4">
            Request an <span className="italic font-light">Atelier Consultation</span>
          </h2>
          <p className="text-zinc-400 font-light max-w-lg mx-auto text-[11px] uppercase tracking-widest leading-relaxed">
            Direct coordination with a master fitter setup in-person in Lahore, or live via custom visual digital walkthroughs. Enter your preferences to reserve.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 mb-2">Sartorial Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.G. GIOVANNI ROSSI"
                    className="w-full bg-black/60 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono tracking-widest focus:border-white focus:outline-none uppercase text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 mb-2">Digital Post (Email)</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="G.ROSSI@STUDIO.COM"
                    className="w-full bg-black/60 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono tracking-widest focus:border-white focus:outline-none uppercase text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 mb-2">Primary Consultation Service</label>
                  <select 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono tracking-widest focus:border-white focus:outline-none uppercase text-white"
                  >
                    <option value="Bespoke Footwear Fitting">Bespoke Footwear Fitting</option>
                    <option value="Virtual Material Selection">Virtual Material Selection</option>
                    <option value="Legacy Restoration Inquiry">Legacy Restoration Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 mb-2">Desired Leather Profile</label>
                  <select 
                    name="leatherPref"
                    value={formData.leatherPref}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono tracking-widest focus:border-white focus:outline-none uppercase text-white"
                  >
                    {LEATHER_BENCH.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 mb-2">Preferential Week / Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono tracking-widest focus:border-white focus:outline-none text-white" 
                />
              </div>

              <div>
                <label className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 mb-2">Footwear Specification Notes</label>
                <textarea 
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="SPECIFY WIDE LAST, ARCH ARCHITECTURE, OR DESIRED PATINA GRADIENTS..."
                  className="w-full bg-black/60 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono tracking-widest focus:border-white focus:outline-none uppercase text-white h-24 resize-none"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-4 bg-white text-black hover:bg-transparent hover:text-white border border-white px-8 py-4 w-full transition-all text-[10px] uppercase font-bold tracking-[0.4em]"
                >
                  <span>{isSubmitting ? "TRANSMITTING..." : "TRANSMIT INQUIRY REQUEST"}</span>
                  {!isSubmitting && <ArrowRight size={12} />}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 relative z-10"
            >
              <div className="w-16 h-16 bg-white/[0.04] border border-white/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-zinc-200" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="serif text-3xl mb-4 text-white">Inquiry Received</h3>
              <p className="text-zinc-400 font-light uppercase tracking-widest text-[11px] max-w-md mx-auto leading-relaxed mb-8">
                Your specifications have been logged securely. An Atelier manager from Lahore will coordinate your fit review within 24 working hours.
              </p>
              
              <div className="border border-white/5 bg-black/40 rounded-sm max-w-sm mx-auto p-4 font-mono text-[9px] uppercase tracking-wider text-zinc-500 space-y-1 text-left">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Inquirer:</span>
                  <span className="text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Service:</span>
                  <span className="text-white">{formData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Atelier:</span>
                  <span className="text-zinc-300">Lahore Standard, ID #{Math.floor(Math.random() * 9000 + 1000)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
