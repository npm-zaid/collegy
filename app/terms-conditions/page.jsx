"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  Lock, 
  AlertCircle,
  ChevronRight,
  ArrowRight
} from "lucide-react";

const SECTIONS = [
  { id: "acceptance", title: "Acceptance of Terms", icon: <ShieldCheck size={18} /> },
  { id: "services", title: "Our Counseling Services", icon: <GraduationCap size={18} /> },
  { id: "user-data", title: "Data & Privacy", icon: <Lock size={18} /> },
  { id: "payments", title: "Fees & Refunds", icon: <Scale size={18} /> },
  { id: "liability", title: "Limitation of Liability", icon: <AlertCircle size={18} /> },
];

export default function page() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".terms-reveal", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-zinc-900 pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Brand Accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2667ff]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#3f8efc]/5 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-20 text-center terms-reveal">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 mb-4">
            <FileText size={14} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-4">
            Terms & <br />
            <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
              Conditions.
            </span>
          </h1>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mt-4">Last Updated: March 2026</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Sidebar Navigation (Fixed on Desktop) */}
          <div className="lg:col-span-4 space-y-4 terms-reveal">
            <div className="sticky top-32 bg-zinc-100 rounded-[2.5rem] p-8 border border-zinc-200/50 shadow-xl shadow-indigo-100/20">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2667ff] mb-6 italic">Quick Navigation</h3>
              <nav className="space-y-2">
                {SECTIONS.map((item) => (
                  <a 
                    key={item.id} 
                    href={`#${item.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 group-hover:text-[#2667ff] transition-colors">{item.icon}</span>
                      <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">{item.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-[#2667ff]" />
                  </a>
                ))}
              </nav>

              <div className="mt-10 p-6 bg-[#2667ff] rounded-3xl text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Need Clarity?</p>
                <p className="text-sm font-bold mb-4">Read our simple FAQ for a non-legal summary.</p>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* RIGHT: Content Area */}
          <div className="lg:col-span-8 space-y-8 terms-reveal">
            
            {/* Acceptance Section */}
            <section id="acceptance" className="bg-white rounded-[3rem] p-10 md:p-14 border border-zinc-100 shadow-sm">
              <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3 italic">
                <span className="text-[#2667ff]">01.</span> Acceptance
              </h2>
              <div className="space-y-4 text-zinc-500 leading-relaxed font-medium">
                <p>
                  By accessing and using the **Collegy** platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. 
                </p>
                <p>
                  Our services are designed for students and parents seeking educational guidance in India. If you do not agree with any part of these terms, please discontinue use of our AI-predictor and counseling services immediately.
                </p>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-zinc-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#2667ff]/10 blur-[100px]" />
              <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3 italic">
                <span className="text-[#3f8efc]">02.</span> Our Services
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  Collegy provides data-driven insights into college admissions. While our **AI-Rank Predictor** uses historical data with high precision (approx. 98%), it is an estimation tool and does not guarantee admission into any specific institution.
                </p>
                <p className="border-l-4 border-[#2667ff] pl-6 italic">
                  Admission decisions rest solely with the respective colleges and universities. Collegy is an advisory platform, not a placement agency.
                </p>
              </div>
            </section>

            {/* Data Section */}
            <section id="user-data" className="bg-white rounded-[3rem] p-10 md:p-14 border border-zinc-100 shadow-sm">
              <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3 italic">
                <span className="text-[#2667ff]">03.</span> User Data
              </h2>
              <div className="space-y-4 text-zinc-500 leading-relaxed font-medium">
                <p>
                  To provide accurate predictions, we collect academic scores, preferences, and contact details. We prioritize your privacy and do not sell your data to third-party marketing agencies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 font-bold text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2667ff]" /> Secure SSL Encryption
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 font-bold text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2667ff]" /> GDPR Compliant Logic
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Section */}
            <section id="payments" className="bg-zinc-100 rounded-[3rem] p-10 md:p-14 border border-zinc-200/50">
              <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3 italic">
                <span className="text-[#2667ff]">04.</span> Fees & Refunds
              </h2>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Premium counseling sessions are subject to pre-payment. Cancellations made within 24 hours of the scheduled session are not eligible for a refund. 
              </p>
              <button className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#2667ff] transition-all">
                View Refund Policy
              </button>
            </section>

          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center terms-reveal">
           <p className="text-zinc-300 font-bold text-xs uppercase tracking-widest">
             © 2026 Collegy Education Pvt Ltd. All rights reserved.
           </p>
        </div>
      </div>
    </div>
  );
}

// Sub-component for icons used in SECTIONS array
function GraduationCap({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}