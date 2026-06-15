import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  ArrowLeft, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  Mail, 
  Inbox, 
  Info 
} from "lucide-react";

export default function ShippingReturnsPage() {
  const lastUpdated = "June 16, 2026";

  const sections = [
    {
      id: "philosophy",
      num: "1",
      title: "Our Philosophy",
      icon: <Heart size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-3">
          <p>
            At Eternal, we believe in the <span className="text-white">customer first</span> philosophy. A luxury purchase should feel confident, not anxious. We want you to wear your shoes with absolute peace of mind.
          </p>
          <p>
            We offer a <span className="text-white font-semibold">15-day refund and exchange policy</span> on our three signature articles: <span className="text-zinc-300">Black Oxford</span>, <span className="text-zinc-300">Brown Oxford</span>, and <span className="text-zinc-300">Brown Monk</span>.
          </p>
          <p>
            If you do not love your shoes, you may:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
            <li>Return them for a full refund (less applicable charges), or</li>
            <li>Exchange them for another size or a different article</li>
          </ul>
          <p className="italic font-light text-zinc-300">The choice is yours. Always.</p>
          <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 mt-2">
            Contact: <span className="text-white">support@eternal.com.pk</span>
          </div>
        </div>
      )
    },
    {
      id: "how-to-return",
      num: "2",
      title: "How to Return or Exchange",
      icon: <RefreshCw size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>To initiate a return or exchange, follow our streamlined protocol:</p>
          <div className="space-y-3 font-sans">
            <div className="flex gap-4 items-start p-3 bg-zinc-950/40 border border-white/5 rounded-sm">
              <span className="font-mono text-[9px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded">01</span>
              <div>
                <p className="text-white font-medium text-[11px]">Request Initiation</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Email <span className="text-white">support@eternal.com.pk</span> with your order number.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-3 bg-zinc-950/40 border border-white/5 rounded-sm">
              <span className="font-mono text-[9px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded">02</span>
              <div>
                <p className="text-white font-medium text-[11px]">Form Completion</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">We will send you the authoritative Return & Exchange Form.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-3 bg-zinc-950/40 border border-white/5 rounded-sm">
              <span className="font-mono text-[9px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded">03</span>
              <div>
                <p className="text-white font-medium text-[11px]">Packaging</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Pack the shoes in original condition with all internal packaging, dust bags, and invoice.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-3 bg-zinc-950/40 border border-white/5 rounded-sm">
              <span className="font-mono text-[9px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded">04</span>
              <div>
                <p className="text-white font-medium text-[11px]">Dispatch</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Ship to the precise designated address provided in the form.</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 italic mt-2">
            Our customer service team will guide you through every step. Your satisfaction is our win.
          </p>
        </div>
      )
    },
    {
      id: "return-period",
      num: "3",
      title: "Return Period",
      icon: <Calendar size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>
            You have exactly <span className="text-white">15 days</span> from the date of physical delivery to request a return or exchange.
          </p>
          <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-sm space-y-3">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">Strict Eligibility Conditions:</span>
            <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400 font-sans">
              <li>Shoes must be entirely unused and in pristine original condition.</li>
              <li>No visible wear, scuffs, under-sole friction, or creases on the leather upper.</li>
              <li>Original packaging, branded dust bags, protection sheets, and invoice must be intact.</li>
              <li>Shoes must not have been worn outside (<span className="text-white italic">try on carpet or clean surfaces only</span>).</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "refund-amount",
      num: "4",
      title: "Refund Amount",
      icon: <DollarSign size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>Our refund computations are simple and highly transparent:</p>
          
          <div className="overflow-x-auto border border-white/10 rounded-sm">
            <table className="w-full text-left border-collapse text-[11px] font-mono">
              <thead>
                <tr className="bg-zinc-950 border-b border-white/10 text-zinc-400 uppercase tracking-wider">
                  <th className="p-3 font-semibold">Situation</th>
                  <th className="p-3 font-semibold">Refund Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-zinc-300 font-sans">Full refund (within 15 days, unused condition)</td>
                  <td className="p-3 text-white font-medium">Purchase price minus PKR 500 courier/handling fee</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-zinc-300 font-sans">Refund after sale period</td>
                  <td className="p-3 text-white font-medium">Purchase price minus PKR 500 courier/handling fee</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-[10px] text-zinc-500 font-mono">
            * Note: The PKR 500 deduction comprehensively covers initial courier dispatch, warehouse sorting, and handling charges.
          </p>
        </div>
      )
    },
    {
      id: "exchange-policy",
      num: "5",
      title: "Exchange Policy",
      icon: <RefreshCw size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="border-l border-white/10 pl-4 py-1">
              <p className="text-white uppercase font-mono text-[10px] tracking-wider mb-1">A// Same article, different size</p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                <li>You keep the original purchase price, even if the seasonal sale has ended.</li>
                <li>We ship the requested new size at no extra shipping cost to you.</li>
              </ul>
            </div>

            <div className="border-l border-white/10 pl-4 py-1">
              <p className="text-white uppercase font-mono text-[10px] tracking-wider mb-1">B// Different article exchange (e.g., Black Oxford → Brown Monk)</p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                <li>Exchange values are based comprehensively on the current active price of the new article.</li>
                <li>If the new article is more expensive, you simply pay the variance.</li>
                <li>If it is less expensive, we refund the difference (minus the PKR 500 processing fee).</li>
              </ul>
            </div>

            <div className="border-l border-white/10 pl-4 py-1">
              <p className="text-white uppercase font-mono text-[10px] tracking-wider mb-1">C// Sale items (49% off or more)</p>
              <p className="text-zinc-400 pl-2">
                Eligible for exchange only. No cash or digital refunds are provided on high-discount clearance items.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "refund-time",
      num: "6",
      title: "Refund Time",
      icon: <Clock size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-3">
          <p>After our QA agents successfully receive and audit your returned shoes at our Karachi office:</p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li><span className="text-white">Processing window</span>: Up to 15 working days.</li>
            <li><span className="text-white">Refund mechanisms</span>: Reverted directly to the original payment method (bank account, cards, or mobile digital wallets).</li>
            <li><span className="text-white">Cash on Delivery (COD) refunds</span>: Credited securely to your designated bank account (our coordinators will contact you to request verified account parameters).</li>
          </ul>
        </div>
      )
    },
    {
      id: "faulty-items",
      num: "7",
      title: "Faulty or Wrong Item Received",
      icon: <AlertTriangle size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>
            If you receive a faulty shoe (e.g., stitching defect, sole separation, leather grain flaw), an incorrect article, or an incorrect size:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-left font-light">
            <div className="p-3 border border-white/5 bg-zinc-950/40 rounded">
              <span className="text-white block font-semibold text-[10px] mb-1">SHIPPING COVERAGE</span>
              <p className="text-[10px] text-zinc-400">We will entirely cover all return shipping costs.</p>
            </div>
            <div className="p-3 border border-white/5 bg-zinc-950/40 rounded">
              <span className="text-white block font-semibold text-[10px] mb-1">INSTANT REPLACEMENT</span>
              <p className="text-[10px] text-zinc-400">We dispatch the correct replacement immediately.</p>
            </div>
            <div className="p-3 border border-white/5 bg-zinc-950/40 rounded">
              <span className="text-white block font-semibold text-[10px] mb-1">COMPREHENSIVE RETURN</span>
              <p className="text-[10px] text-zinc-400">We offer a full revert option if the exact stock is unavailable.</p>
            </div>
          </div>
          <p className="text-zinc-400 pt-1">
            Simply email <span className="text-white">support@eternal.com.pk</span> with visible photographic evidence of the issue along with your official Order Number.
          </p>
        </div>
      )
    },
    {
      id: "undelivered-parcels",
      num: "8",
      title: "Undelivered Parcel",
      icon: <Inbox size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-3">
          <p>
            If a parcel returns back to our fulfillment center as undelivered due to customer negligence (e.g., incorrect address parameters, repeated failure to respond to courier coordination calls, or unprovoked refusal to accept):
          </p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li>The associated customer profile account will be placed on temporary administrative hold.</li>
            <li>Future orders will require mandatory advance digital settlement (COD services will be deactivated).</li>
          </ul>
          <p className="text-[10px] text-zinc-500 italic">
            Note: We will always notify you comprehensively by email prior to enacting any profile hold.
          </p>
        </div>
      )
    },
    {
      id: "ineligible-items",
      num: "9",
      title: "What Is Not Eligible for Refund",
      icon: <Info size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-3">
          <p>The following categories are strictly excluded from our standard return, exchange, or refund pipelines:</p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400 font-sans">
            <li>Shoes that have been worn outside or showcase visible sole scuffs, leather creases, or dirt.</li>
            <li>Shoes constructed with exclusive custom adjustments or bespoke modifications.</li>
            <li>Digital gift cards.</li>
            <li>Items damaged consciously or casually by the customer (separate from manufacturing issues).</li>
            <li>Leather bags and complimentary accessories (unless an explicit production defect is verified on arrival).</li>
          </ul>
        </div>
      )
    },
    {
      id: "shipping-info",
      num: "10",
      title: "Shipping Information",
      icon: <Truck size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-white/5 bg-zinc-950/40 rounded-sm">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-white mb-1">Free Delivery Threshold</span>
              <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                Orders of <span className="text-white font-medium">PKR 2,500</span> or more are dispatched and delivered absolutely free across Pakistan.
              </p>
            </div>
            <div className="p-4 border border-white/5 bg-zinc-950/40 rounded-sm">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-white mb-1">Standard Delivery Timeline</span>
              <ul className="text-zinc-400 font-sans text-[11px] space-y-1">
                <li><span className="text-white">Major Cities</span> (Karachi, Lahore, Islamabad, Rawalpindi): 3–5 working days.</li>
                <li><span className="text-white">Other Cities</span>: 4–7 working days region-wide.</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2 text-zinc-400">
            <p>
              <span className="text-white font-medium">Order Dispatch Cut-off:</span> Orders received after 5:00 PM will be processed and dispatched on the subsequent business day. Weekend and national public holiday orders are executed on the immediate subsequent working day.
            </p>
            <p>
              <span className="text-white font-medium">Cash on Delivery (COD):</span> Fully available at checkout for all addresses across Pakistan. Take delivery and pay comfortably when the parcel arrives at your door.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "your-rights",
      num: "11",
      title: "Your Rights as an Eternal Customer",
      icon: <ShieldCheck size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>As a valued Eternal customer, you possess clear, uncompromised rights regarding the personal parameters you provide details on:</p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400 font-sans">
            <li>The right to be informed of any personal data we hold or process about you.</li>
            <li>The right to request access to your personal data.</li>
            <li>The right to require us to correct any inaccuracies in your data free of charge.</li>
            <li>The right to ask us to stop using your personal data for direct marketing purposes.</li>
            <li>The right to ask us to erase your personal data or restrict its processing.</li>
            <li>The right to lodge a formal query or complaint with the Eternal team.</li>
          </ul>
          <p className="text-[11px] leading-relaxed">
            To query, adjust, or exercise any of these structural rights, email us at <span className="text-white">support@eternal.com.pk</span>.
          </p>
        </div>
      )
    },
    {
      id: "contact-us",
      num: "12",
      title: "Contact Us",
      icon: <Mail size={14} className="text-zinc-400" />,
      content: (
        <div className="bg-zinc-950/60 p-6 rounded-sm border border-white/5 space-y-4 font-mono">
          <p className="text-zinc-400 font-sans text-[11px] tracking-wider leading-relaxed">
            For rapid customer coordination, size updates, or return requests:
          </p>
          <div className="space-y-2 text-[10px] text-zinc-400 tracking-wider">
            <div className="flex">
              <span className="w-24 text-zinc-600">EMAIL:</span>
              <span className="text-white">support@eternal.com.pk</span>
            </div>
            <div className="flex">
              <span className="w-24 text-zinc-600">SUPPORT:</span>
              <span className="text-white">Please include your order number for accelerated dispatch support</span>
            </div>
            <div className="flex">
              <span className="w-24 text-zinc-600">TAGLINE:</span>
              <span className="text-zinc-300">Savor the Luxury</span>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-white/5 font-sans italic text-white text-[12px] opacity-80">
            Eternal — Savor the Luxury
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-luxury-black text-luxury-white min-h-screen">
      {/* Visual Header / Hero Accent */}
      <div className="relative pt-32 pb-16 md:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-transparent to-transparent opacity-40 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[9px] font-mono tracking-[0.3em] text-zinc-500 hover:text-white transition-colors duration-300 uppercase mb-8"
          >
            <ArrowLeft size={10} /> Back to Atelier
          </Link>
          
          <span className="text-[9px] uppercase tracking-[0.6em] text-zinc-500 block font-mono mb-4">
            Confidence & Service
          </span>
          <h1 className="serif text-4xl sm:text-5xl md:text-6xl text-white leading-none tracking-tight font-light mb-6">
            Shipping & <span className="italic font-light">Returns</span>
          </h1>
          <p className="text-zinc-400 font-mono text-[9px] uppercase tracking-widest leading-relaxed">
            Last Revised // {lastUpdated}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20"
        >
          {/* Sidebar Navigation Info */}
          <div className="md:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 border border-white/5 bg-black/40 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <Truck size={16} className="text-zinc-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-semibold">Nationwide Logistics</span>
                </div>
                <p className="text-zinc-400 font-light text-[11px] leading-relaxed uppercase tracking-wider">
                  Our shipment processes are executed by reliable premium partners ensuring safe, prompt, and convenient handling.
                </p>
              </div>

              {/* Navigation Index to Policy Sections */}
              <div className="border-l border-white/10 pl-4 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500 space-y-3 hidden md:block">
                <div className="text-zinc-400 text-[10px] mb-2 font-semibold">Policy Sections</div>
                {sections.map((sec) => (
                  <a 
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2 hover:text-white transition-colors block text-left"
                  >
                    <span className="text-zinc-700">{sec.num.padStart(2, '0')}</span>
                    <span>{sec.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="md:col-span-8 space-y-16">
            {sections.map((sec) => (
              <section 
                key={sec.id} 
                id={sec.id}
                className="space-y-4 scroll-mt-28"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                  {sec.icon}
                  <h3 className="text-[12px] uppercase tracking-[0.3em] font-semibold text-white font-mono">
                    {sec.num}. {sec.title}
                  </h3>
                </div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-widest leading-relaxed font-light font-sans space-y-3">
                  {sec.content}
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
