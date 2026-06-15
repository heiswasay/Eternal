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

export default function AtelierPage() {
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
              Crafted in the historic heart of Karachi, our master craftsmen construct individual expressions of lasting design over rigorous timelines. Here, compromise has no home.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[9px] uppercase tracking-widest text-zinc-500 border-l border-white/10 pl-6 lg:pl-8 py-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <MapPin size={10} className="text-zinc-400" />
              <span>24.861° N, 67.001° E</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Compass size={10} className="text-zinc-400" />
              <span>EST. 2020, KARACHI</span>
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
                alt="Leather Cutting Selection"
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
              The leather is drawn taut across solid beechwood lasts. Our shoemakers tension the welt with wax-dipped biological linen cords using specialized hand awls.
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

      {/* Brand Story Section */}
      <div className="max-w-4xl mx-auto mb-20 md:mb-32 border-t border-white/5 pt-20 px-6">
        <div className="mb-16 text-center">
          <span className="text-[9px] font-mono uppercase tracking-[0.6em] text-zinc-500 block mb-3">Our Manifesto</span>
          <h2 className="serif text-3xl sm:text-5xl tracking-normal text-white">
            Brand <span className="italic text-zinc-400">Story</span>
          </h2>
        </div>

        <div className="space-y-16 md:space-y-24">
          {/* Section 1 & 2: Our Beginning & Our Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">01 // Our Beginning</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Karachi, 2020</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                Eternal was founded in Karachi in 2020 with a simple but audacious belief: Pakistani gentlemen deserve world-class footwear without leaving the country.
              </p>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                For too long, luxury shoes meant traveling abroad or settling for mass-produced imports that cracked, creased, and fell apart within months. The local court offered quantity over quality, fast fashion instead of lasting heirlooms. We decided to change that forever.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">02 // Our Vision</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Pakistan's Handmade Legacy</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                To become Pakistan's first true luxury handmade footwear house — one that stands shoulder to shoulder with English, Italian, and French shoemakers, but rooted entirely in Karachi.
              </p>
              <div className="space-y-3 font-mono text-[9px] uppercase tracking-widest text-zinc-500 border-l border-white/10 pl-4 py-1 mt-2">
                <p className="text-zinc-400 font-sans normal-case text-[11px] mb-2">We envision a future where:</p>
                <div className="flex gap-2">
                  <span className="text-zinc-600">→</span>
                  <span>Pride over compromise in every boardroom</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-zinc-600">→</span>
                  <span>Passing hand-sewn heirlooms down to the son</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-zinc-600">→</span>
                  <span>"Made in Pakistan" represents absolute excellence</span>
                </div>
              </div>
              <p className="text-[11px] font-mono tracking-wider text-white uppercase font-bold mt-4">
                We are not building a shoe brand. We are building a legacy.
              </p>
            </div>
          </div>

          {/* Section 3: The Challenge We Saw */}
          <div className="space-y-6 border-t border-white/5 pt-12 md:pt-16">
            <div className="max-w-2xl">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">03 // The Challenge We Saw</span>
              <h3 className="serif text-2xl sm:text-3xl text-white font-light mb-4">Integrity Over Compromise</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                When we studied the Pakistani market in 2020, we saw an opportunity to stand out not by competing on price, but by maintaining uncompromised integrity against standard commercial shortcuts:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4 text-left">
              <div className="p-4 border border-white/5 bg-zinc-950/40 rounded-sm">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Leather Quality</span>
                <p className="text-zinc-400 font-light text-[11px] leading-relaxed">Corrected grains or plastic coatings replaced by top-tier genuine hides.</p>
              </div>
              <div className="p-4 border border-white/5 bg-zinc-950/40 rounded-sm">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Construction</span>
                <p className="text-zinc-400 font-light text-[11px] leading-relaxed">Glued soles and plastic counters replaced by authentic hand-welting.</p>
              </div>
              <div className="p-4 border border-white/5 bg-zinc-950/40 rounded-sm">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Durability & Shape</span>
                <p className="text-zinc-400 font-light text-[11px] leading-relaxed">Crafted to last years, modeled strictly on custom-mapped regional feet shapes.</p>
              </div>
              <div className="p-4 border border-white/5 bg-zinc-950/40 rounded-sm">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Transparency</span>
                <p className="text-zinc-400 font-light text-[11px] leading-relaxed">Open disclosure of exact materials — cork filling, shank, and pegs.</p>
              </div>
            </div>
          </div>

          {/* Section 4 & 5: Our Promise & The Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 border-t border-white/5 pt-12 md:pt-16">
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">04 // Our Promise</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Uncompromising Craftsmanship</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                Every pair of Eternal shoes is handmade, incorporating full-grain leather from the top 3% of selected hides. We employ the traditional Goodyear welted mechanism — the same robust construction found in $1,500 international classics.
              </p>
              <p className="text-zinc-500 font-light text-[13px] md:text-sm leading-relaxed italic">
                We do not cut corners. We show you exactly what is inside our shoes — cork filling, steel shank, brass pegs, oak-bark sole — because we are proud of it.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">05 // The Eternal Customer</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Discerning Choices</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                Our customer refuses to confuse price with value. You understand that true handmade craftsmanship takes time, and you choose to invest once and invest well while supporting local masters of the craft.
              </p>
              <p className="text-[11px] font-mono tracking-wider text-zinc-300 uppercase font-semibold">
                Slow luxury, made right here in Karachi.
              </p>
            </div>
          </div>

          {/* Section 6 & 7: Three Articles & Karachi Atelier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 border-t border-white/5 pt-12 md:pt-16">
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">06 // Essential Collection</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Three Articles. Zero Compromises.</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                We launched with only three quintessential silhouettes: the Black Oxford, the Brown Oxford, and the Brown Monk. No seasonal drops or chasing trend cycles. Just three perfect shoes, made relentlessly well. We will add more only when we can maintain this exact standard.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">07 // Our Atelier in Karachi</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Meet the Makers</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                Behind our shoes is a dedicated small team of master craftsmen in Karachi. They hand-cut each hide, hand-stitch the welts, hand-polish the soles to a glass-smooth finish, and personally sign every box that leaves the workshop.
              </p>
              <p className="text-zinc-500 font-light text-[12px] leading-relaxed italic">
                We know their names, and you will find their handwritten initials inscribed inside your shoes.
              </p>
            </div>
          </div>

          {/* Section 8 & 9: Savor the luxury / From 2020 to forever */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 border-t border-white/5 pt-12 md:pt-16">
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">08 // What "Savor the Luxury" Means</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">Our Tagline Philosophy</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                Savor means to slow down, appreciate the unique grain, and notice the immaculate stitch. The luxury is not about loud logos or status — it is the quiet confidence of knowing you are wearing something made with absolute integrity.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">09 // The Journey</span>
              <h3 className="serif text-xl sm:text-2xl text-white font-light">From Karachi To Forever</h3>
              <p className="text-zinc-400 font-light text-[13px] md:text-sm leading-relaxed">
                We started in 2020 with one last, one hide, and one belief. Today, we ship across Pakistan. Tomorrow, we hope to show the world that Pakistani craftsmanship belongs in the global conversation about luxury.
              </p>
            </div>
          </div>

          {/* Section 10: Call to Join */}
          <div className="text-center bg-zinc-950/40 border border-white/5 p-8 md:p-12 rounded-sm space-y-4 max-w-2xl mx-auto rounded">
            <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-500 uppercase block">Join the Journey</span>
            <p className="text-zinc-300 font-light text-[13px] sm:text-sm max-w-xl mx-auto leading-relaxed">
              Whether you choose the Black Oxford, the Brown Oxford, or the Brown Monk — you are supporting a movement to make "made in Pakistan" mean something truly extraordinary.
            </p>
            <div className="border-t border-white/5 pt-4 inline-block px-10">
              <p className="serif text-lg italic text-white font-light">Eternal — Savor the Luxury</p>
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
            Direct coordination with a master fitter setup in-person in Karachi, or live via custom visual digital walkthroughs. Enter your preferences to reserve.
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
                    <option value="Tuscan Aniline Box-Calf">Tuscan Aniline Box-Calf</option>
                    <option value="Sartorial Royal Suede">Sartorial Royal Suede</option>
                    <option value="Genuine Waxed Shell Cordovan">Genuine Waxed Shell Cordovan</option>
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
                Your specifications have been logged securely. An Atelier manager from Karachi will coordinate your fit review within 24 working hours.
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
                  <span className="text-zinc-300">Karachi Standard, ID #{Math.floor(Math.random() * 9000 + 1000)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
