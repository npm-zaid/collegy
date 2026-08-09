"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Database, 
  Search, 
  Lightbulb, 
  Share2,
  Cpu,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";

export default function WhyChooseUs() {
  const containerRef = useRef(null);
  const centerRef = useRef(null);

  const reasons = [
    { 
      name: "AI Predictor", 
      desc: "Get 99% accurate college recommendations powered by real-time data trends.", 
      icon: <Cpu size={20} />,
      pos: "lg:top-0 lg:left-0",
      color: "border-blue-500/30",
      glow: "shadow-[0_0_20px_rgba(61,107,232,0.2)]"
    },
    { 
      name: "500+ Experts", 
      desc: "Personalized guidance from senior mentors with years of academic expertise.", 
      icon: <Users size={20} />,
      pos: "lg:top-0 lg:right-0",
      color: "border-[#E39F4A]/30",
      glow: "shadow-[0_0_20px_rgba(227,159,74,0.2)]"
    },
    { 
      name: "Verified Data", 
      desc: "Structured insights converted from raw official notifications daily.", 
      icon: <Database size={20} />,
      pos: "lg:bottom-0 lg:left-0",
      color: "border-indigo-500/30",
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]"
    },
    { 
      name: "Smart Search", 
      desc: "Filter through thousands of colleges and courses with surgical precision.", 
      icon: <Search size={20} />,
      pos: "lg:bottom-0 lg:right-0",
      color: "border-emerald-500/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]"
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for modules
      gsap.to(".reason-module", {
        y: -12,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut"
      });
      
      // Animated Nexus Lines
      gsap.to(".nexus-line", {
        strokeDashoffset: 0,
        duration: 4,
        repeat: -1,
        ease: "none"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen w-full bg-zinc-950 flex items-center justify-center overflow-hidden relative p-6 md:p-10">
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#3D6BE8 2px, transparent 2px), linear-gradient(90deg, #3D6BE8 2px, transparent 2px)`, backgroundSize: '50px 50px' ,height:"100%", width:"100vw"}} />

      <div className="max-w-6xl w-full relative flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center mb-16 lg:mb-20 space-y-4 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-[#3D6BE8] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20">
            <Zap size={12} /> Why Choose Us
          </div>
          <h2 className="text-4xl md:text-6xl  font-black text-white tracking-tighter leading-none">
            The Intelligence <br />
            <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic">Behind Your Success.</span>
          </h2>
           <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2 m-auto" />
          {/* <p className="text-zinc-500 font-bold text-xs md:text-sm max-w-md mx-auto leading-relaxed px-4">
            We bridge the gap between raw information and your dream college through a specialized ecosystem of data and human expertise.
          </p> */}
        </div>

        {/* ECOSYSTEM VISUAL WRAPPER */}
        <div className="relative w-full min-h-fit lg:h-[600px] flex flex-col lg:block">
          
          {/* CENTRAL NEXUS (Leadership/App Preview) */}
          <div ref={centerRef} className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group items-center justify-center">
            <div className="w-44 h-44 xl:w-56 xl:h-56 rounded-[50px] xl:rounded-[64px] bg-zinc-900 border-[10px] border-zinc-800 shadow-[0_0_50px_rgba(61,107,232,0.1)] flex items-center justify-center relative overflow-hidden transition-all group-hover:scale-105 group-hover:border-zinc-700 duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3D6BE8]/20 to-transparent" />
              {/* Image from your student success screenshots */}
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
                alt="Student Success" 
              />
              <div className="absolute bottom-0 w-full py-3 bg-black/80 backdrop-blur-md text-center">
                <p className="text-[9px] font-black text-[#E39F4A] uppercase tracking-widest">Finale Beacon</p>
              </div>
            </div>
            {/* Pulsing Ring */}
            <div className="absolute inset-[-20px] border-2 border-[#3D6BE8]/20 rounded-[80px] animate-ping opacity-20" />
          </div>

          {/* REASON MODULES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:block gap-6 w-full h-full">
            {reasons.map((item, i) => (
              <div 
                key={i} 
                className={`reason-module relative lg:absolute ${item.pos} w-full lg:w-[280px] p-6 bg-zinc-900/40 backdrop-blur-2xl border ${item.color} ${item.glow} rounded-[32px] transition-all duration-500 z-20 group hover:bg-zinc-800/60`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#3D6BE8] text-white shadow-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.name}</h4>
                </div>
                <p className="text-[11px] font-bold text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* SVG CONNECTIONS */}
          <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none opacity-40">
             <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#3D6BE8', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#E39F4A', stopOpacity:1}} />
              </linearGradient>
            </defs>
            {/* Calibrated paths for the Dark Luxe ecosystem */}
            <path d="M 300,120 Q 450,150 500,300" stroke="url(#grad1)" strokeWidth="1.5" fill="none" className="nexus-line" strokeDasharray="8 8" strokeDashoffset="100" />
            <path d="M 820,120 Q 650,150 640,300" stroke="url(#grad1)" strokeWidth="1.5" fill="none" className="nexus-line" strokeDasharray="8 8" strokeDashoffset="100" />
            <path d="M 300,480 Q 450,450 500,300" stroke="url(#grad1)" strokeWidth="1.5" fill="none" className="nexus-line" strokeDasharray="8 8" strokeDashoffset="100" />
            <path d="M 820,480 Q 650,450 640,300" stroke="url(#grad1)" strokeWidth="1.5" fill="none" className="nexus-line" strokeDasharray="8 8" strokeDashoffset="100" />
          </svg>
        </div>

     

      </div>
    </section>
  );
}

const Users = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);