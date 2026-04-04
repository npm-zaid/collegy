"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Banknote, 
  Percent, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  CircleDollarSign,
  Landmark,
  HandCoins
} from "lucide-react";

export default function page() {
  const containerRef = useRef(null);
  const [loanAmount, setLoanAmount] = useState(1500000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".loan-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out"
      });

      // Subtle pulse for the floating rate badge
      gsap.to(".rate-pulse", {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#FDFDFD] px-6 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#2667ff]/5 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3f8efc]/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center loan-reveal">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 mb-4">
            <Landmark size={14} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              Financial Empowerment
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-4">
            Fund your <br />
            <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
              future career.
            </span>
          </h1>
          <div className="w-40 h-1.5 bg-gradient-to-r from-zinc-900 to-[#3f8efc] rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Info Bento Grid */}
          <div className="lg:col-span-5 space-y-6 loan-reveal">
            
            {/* Rate Card */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 border-2 border-[#2667ff]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className="rate-pulse w-20 h-20 bg-[#2667ff] rounded-full flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(38,103,255,0.4)]">
                  <span className="text-[10px] font-black uppercase leading-none">From</span>
                  <span className="text-xl font-black italic">8.5%</span>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#3f8efc] mb-2">Prime Interest</h3>
                <p className="text-3xl font-black text-white italic mb-4">Unsecured Loans</p>
                <ul className="space-y-3">
                  {["Zero Collateral required", "Fast-track 48hr approval", "Tax benefits U/S 80E"].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm font-bold">
                      <ShieldCheck size={16} className="text-[#2667ff]" /> {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature Bento Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/40 hover:scale-[1.03] transition-transform group">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#2667ff] mb-4 group-hover:bg-[#2667ff] group-hover:text-white transition-colors">
                  <HandCoins size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Max Tenure</p>
                <p className="text-xl font-black italic text-zinc-900">15 Years</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/40 hover:scale-[1.03] transition-transform group">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#2667ff] mb-4 group-hover:bg-[#2667ff] group-hover:text-white transition-colors">
                  <Calculator size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Moratorium</p>
                <p className="text-xl font-black italic text-zinc-900">Course + 1yr</p>
              </div>
            </div>
          </div>

          {/* Right: Loan Application Form */}
          <div className="lg:col-span-7 loan-reveal">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-indigo-100/40 border border-zinc-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2667ff]/5 to-transparent rounded-bl-[100px]" />
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Required Amount</label>
                    <span className="text-2xl font-black italic text-[#2667ff]">₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
                  </div>
                  <input 
                    type="range" 
                    min="100000" 
                    max="5000000" 
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#2667ff]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-zinc-300 uppercase px-1">
                    <span>1L</span>
                    <span>50L</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Full Name (As per Pan)</label>
                    <input required placeholder="Siddharth Sharma" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Mobile Number</label>
                    <input required type="tel" placeholder="+91 00000 00000" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold shadow-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Target Country</label>
                    <select className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold shadow-sm appearance-none cursor-pointer">
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>Canada</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Course Category</label>
                    <select className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold shadow-sm appearance-none cursor-pointer">
                      <option>Engineering (B.Tech/M.Tech)</option>
                      <option>Management (MBA)</option>
                      <option>Medical (MBBS)</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-zinc-900 overflow-hidden p-6 rounded-3xl transition-all hover:shadow-[0_25px_50px_-12px_rgba(38,103,255,0.3)] mt-4"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#2667ff] to-[#3f8efc] transition-all duration-500 group-hover:w-full" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase tracking-[0.3em] text-[10px] group-hover:text-white">
                    {isSubmitting ? "Calculating Eligibility..." : "Check Loan Eligibility"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="flex items-center justify-center gap-8 pt-4">
                  <div className="flex items-center gap-2 opacity-30">
                    <Banknote size={16} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">RBI Regulated</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-30">
                    <CircleDollarSign size={16} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">No Hidden Fees</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}