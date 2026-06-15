import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  Eye, 
  User, 
  Share2, 
  Lock, 
  Calendar, 
  HelpCircle, 
  Scale, 
  Mail, 
  CheckCircle,
  AlertTriangle,
  FileCheck
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 16, 2026";

  const sections = [
    {
      id: "introduction",
      num: "1",
      title: "Introduction",
      icon: <HelpCircle size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-3">
          <p>
            Welcome to Eternal (<span className="text-white">"Eternal," "we," "us," "our"</span>), a luxury handmade footwear brand operating from Pakistan with the tagline <span className="italic font-light text-zinc-300">Savor the Luxury</span>.
          </p>
          <p>
            We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website <span className="text-zinc-300">eternal.com.pk</span> or make a purchase.
          </p>
          <p>
            By using our Site, you agree to the collection and use of information in accordance with this policy.
          </p>
          <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 mt-2">
            Contact: <span className="text-white">support@eternal.com.pk</span>
          </div>
        </div>
      )
    },
    {
      id: "information-we-collect",
      num: "2",
      title: "What Information We Collect",
      icon: <User size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We collect the following categories of personal data:</p>
          <div className="space-y-3 pl-2 border-l border-white/5 font-sans">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Identity Data</span>
              <span className="text-zinc-400 text-[11px] block">Full name</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Contact Data</span>
              <span className="text-zinc-400 text-[11px] block">Shipping address, email address</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Financial Data</span>
              <span className="text-zinc-400 text-[11px] block">Payment card details (processed by our payment partners – we do not store full card numbers)</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Transaction Data</span>
              <span className="text-zinc-400 text-[11px] block">Order history, product preferences (Black Oxford, Brown Oxford, Brown Monk)</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Technical Data</span>
              <span className="text-zinc-400 text-[11px] block">IP address, browser type, device information</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Marketing Data</span>
              <span className="text-zinc-400 text-[11px] block">Email preferences, open rates</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "how-we-collect",
      num: "3",
      title: "How We Collect Your Data",
      icon: <FileText size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We collect data in three ways:</p>
          <div className="space-y-3 font-sans">
            <div className="flex gap-3">
              <span className="font-mono text-[9px] text-zinc-600 mt-1">A//</span>
              <p><span className="text-white">Direct interactions</span> – You provide data when you place an order, sign up for our newsletter ("The Circle"), or contact customer service.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-[9px] text-zinc-600 mt-1">B//</span>
              <p><span className="text-white">Automated technologies</span> – When you browse our Site, we automatically collect Technical Data using cookies.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-[9px] text-zinc-600 mt-1">C//</span>
              <p><span className="text-white">Third-party sources</span> – Payment processors, shipping carriers, and analytics providers.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "how-we-use",
      num: "4",
      title: "How We Use Your Information",
      icon: <FileCheck size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li>Process and fulfill your orders (including payment and delivery)</li>
            <li>Communicate order updates (confirmation, shipping, delivery)</li>
            <li>Send marketing communications (only if you opt in via "The Circle")</li>
            <li>Improve our website, products, and customer experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with tax and legal record-keeping requirements</li>
          </ul>
          <div className="p-3 border border-white/5 bg-zinc-950/60 rounded-sm font-mono text-[9px] tracking-wider text-zinc-500">
            NOTE: WE DO NOT SELL YOUR PERSONAL DATA TO THIRD PARTIES. EVER.
          </div>
        </div>
      )
    },
    {
      id: "sharing",
      num: "5",
      title: "Sharing Your Information",
      icon: <Share2 size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We share your data only with necessary service providers to operate our brand legacy:</p>
          <div className="space-y-3 pl-2 border-l border-white/5">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Payment processors</span>
              <span className="text-zinc-400 text-[11px] block">To process credit card payments securely</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Shipping carriers</span>
              <span className="text-zinc-400 text-[11px] block">TCS, Leopards, Call Courier – to deliver your shoes within Pakistan</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Email marketing platform</span>
              <span className="text-zinc-400 text-[11px] block">To send "The Circle" newsletters (only if you opted in)</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Hosting provider</span>
              <span className="text-zinc-400 text-[11px] block">Vercel – to host and maintain our website servers</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Legal authorities</span>
              <span className="text-zinc-400 text-[11px] block">Legal and regulatory authorities – when required by law</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 italic mt-2">
            All third parties are contractually obligated to keep your data secure and use it only for the specific service they provide.
          </p>
        </div>
      )
    },
    {
      id: "data-security",
      num: "6",
      title: "Data Security",
      icon: <Lock size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li>SSL/TLS encryption for all data transmitted between your browser and our Site</li>
            <li>No storage of full credit card numbers (payment data is tokenized)</li>
            <li>Access limited to authorized Eternal team members only</li>
            <li>Regular security reviews</li>
          </ul>
          <p className="text-[10px] text-zinc-500 italic">
            While we strive to protect your data, no method of transmission over the Internet is 100% secure.
          </p>
        </div>
      )
    },
    {
      id: "data-retention",
      num: "7",
      title: "Data Retention",
      icon: <Calendar size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We retain your personal data only as long as necessary for custom manufacturing and operations:</p>
          <div className="space-y-3 font-sans">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Order and transaction data</span>
              <span className="text-zinc-400 text-[11px] block">6 years (for Pakistan tax law compliance)</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Customer account information</span>
              <span className="text-zinc-400 text-[11px] block">Until you delete your account</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Marketing data (email opt-in)</span>
              <span className="text-zinc-400 text-[11px] block">Until you unsubscribe</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white">Technical and analytics data</span>
              <span className="text-zinc-400 text-[11px] block">26 months</span>
            </div>
          </div>
          <p className="text-zinc-500 uppercase font-mono text-[9px] tracking-wider">
            After the retention period ends, your data is securely deleted or anonymized.
          </p>
        </div>
      )
    },
    {
      id: "your-rights",
      num: "8",
      title: "Your Rights (Pakistan)",
      icon: <Scale size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>As a customer in Pakistan, you have the following rights over your fit profiles and data logs:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-left mt-2">
            <div className="p-3 border border-white/5 bg-black/40 rounded-sm">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-1">Right to Access</span>
              <p className="text-zinc-400 text-[11px] uppercase tracking-wider leading-relaxed">Request a copy of all data we hold about you</p>
            </div>
            <div className="p-3 border border-white/5 bg-black/40 rounded-sm">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-1">Right to Rectification</span>
              <p className="text-zinc-400 text-[11px] uppercase tracking-wider leading-relaxed">Correct inaccurate or incomplete data</p>
            </div>
            <div className="p-3 border border-white/5 bg-black/40 rounded-sm">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-1">Right to Erasure</span>
              <p className="text-zinc-400 text-[11px] uppercase tracking-wider leading-relaxed">Request deletion of your database entries</p>
            </div>
            <div className="p-3 border border-white/5 bg-black/40 rounded-sm">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-1">Right to Withdraw Consent</span>
              <p className="text-zinc-400 text-[11px] uppercase tracking-wider leading-relaxed">Unsubscribe from marketing any time</p>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed pt-2">
            To exercise any of these rights, email us at <span className="text-white">support@eternal.com.pk</span>. We will respond within 30 days.
          </p>
        </div>
      )
    },
    {
      id: "cookies",
      num: "9",
      title: "Cookies and Tracking Technologies",
      icon: <Eye size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>We use cookies to enhance your digital experience on our platform:</p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li>Remember your cart and login status</li>
            <li>Understand how you navigate our Site (to improve design)</li>
            <li>Serve relevant ads (only if you have consented)</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Disabling cookies may affect functionality (e.g., cart may not persist across visits).
          </p>
        </div>
      )
    },
    {
      id: "childrens-privacy",
      num: "10",
      title: "Children's Privacy",
      icon: <AlertTriangle size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>
            Our Site is not intended for individuals under the age of 18. We do not knowingly collect data from children.
          </p>
          <p>
            If you believe a child has provided us with personal information, please contact us immediately at <span className="text-white">support@eternal.com.pk</span> so we can delete it without delay.
          </p>
        </div>
      )
    },
    {
      id: "legal-compliance",
      num: "11",
      title: "Pakistan Legal Compliance",
      icon: <CheckCircle size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>
            Eternal operates in compliance with the <span className="text-white">Prevention of Electronic Crimes Act (PECA) 2016</span> and regulations set by the <span className="text-white">Pakistan Telecommunication Authority (PTA)</span>.
          </p>
          <p>
            We adhere strictly to Pakistani consumer protection laws regarding data privacy, security, and e-commerce transactions to guarantee absolute procedural peace of mind.
          </p>
        </div>
      )
    },
    {
      id: "complaints",
      num: "12",
      title: "Complaints",
      icon: <AlertTriangle size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>
            If you are not satisfied with our response to any privacy-related concern, please contact us directly at <span className="text-white font-medium">support@eternal.com.pk</span> first. We will attempt to resolve your issue directly.
          </p>
          <p>
            If unresolved, you have the right to lodge an regulatory complaint directly with the <span className="text-white">Pakistan Telecommunication Authority (PTA)</span>.
          </p>
        </div>
      )
    },
    {
      id: "changes",
      num: "13",
      title: "Changes to This Privacy Policy",
      icon: <FileText size={14} className="text-zinc-400" />,
      content: (
        <div className="space-y-4">
          <p>
            We may update this privacy policy from time to time. The "Last Updated" date at the top will reflect the most recent changes.
          </p>
          <p>
            Material changes will be notified to you by email (if we have your email address) or via a notice on our Site. Continued use of the Site after changes constitutes acceptance of the updated policy.
          </p>
        </div>
      )
    },
    {
      id: "contact-us",
      num: "14",
      title: "Contact Us",
      icon: <Mail size={14} className="text-zinc-400" />,
      content: (
        <div className="bg-zinc-950/60 p-6 rounded-sm border border-white/5 space-y-4 font-mono">
          <p className="text-zinc-400 font-sans text-[11px] tracking-wider leading-relaxed">
            For any privacy-related questions, complaints, or to exercise your legal rights over your custom fit logs:
          </p>
          <div className="space-y-2 text-[10px] text-zinc-400 tracking-wider">
            <div className="flex">
              <span className="w-24 text-zinc-600">EMAIL:</span>
              <span className="text-white">support@eternal.com.pk</span>
            </div>
            <div className="flex">
              <span className="w-24 text-zinc-600">TAGLINE:</span>
              <span className="text-white">Savor the Luxury</span>
            </div>
            <div className="flex">
              <span className="w-24 text-zinc-600">WORKSHOP:</span>
              <span className="text-zinc-300">Karachi Atelier, Pakistan</span>
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
            Security & Compliance
          </span>
          <h1 className="serif text-4xl sm:text-5xl md:text-6xl text-white leading-none tracking-tight font-light mb-6">
            Privacy <span className="italic font-light">Policy</span>
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
                  <ShieldCheck size={16} className="text-zinc-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-semibold">Uncompromising Trust</span>
                </div>
                <p className="text-zinc-400 font-light text-[11px] leading-relaxed uppercase tracking-wider">
                  Our dedication to premium craftsmanship is mirrored by our respect for your personal data. We maintain rigorous standards of discretion with every custom order.
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
