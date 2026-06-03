"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Rocket, 
  Briefcase, 
  Zap, 
  Star, 
  Terminal, 
  Layers, 
  CheckCircle,
  Cpu,
  Globe,
  Award
} from "lucide-react";

const DOMAINS = [
  "Technology", 
  "Design", 
  "Marketing", 
  "Management", 
  "Medical", 
  "Finance", 
  "Law"
];

export default function page() {
  const containerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDomain, setActiveDomain] = useState("Technology");
  
  const [formData, setFormData] = useState({
    fullName: "",
    skill: "",
    portfolio: "",
    projectDescription: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".intern-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.to(".icon-float", {
        y: -8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stream: activeDomain,
          ...formData
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Application Submitted Successfully!");
        setFormData({ fullName: "", skill: "", portfolio: "", projectDescription: "" });
      } else {
        alert("Failed to submit application");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#FDFDFD] px-6 relative overflow-hidden">
      {/* Brand Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2667ff]/5 blur-[140px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3f8efc]/10 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-20 text-center intern-reveal">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 mb-4">
            <Rocket size={14} className="text-[#2667ff] icon-float" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              Career Accelerator
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-4">
            Bridge the <br />
            <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
              Skill Gap.
            </span>
          </h1>
          <div className="w-32 h-1.5 bg-zinc-900 rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: The "Why" Bento Column */}
          <div className="lg:col-span-5 space-y-6 intern-reveal">
            
            {/* Dark Experience Card */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Terminal size={140} className="rotate-12" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#3f8efc] mb-6 italic">Core Experience</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#2667ff] rounded-xl text-white shadow-lg shadow-blue-900/20">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-white font-black italic uppercase text-xs tracking-wider">Live Ecosystems</p>
                    <p className="text-zinc-400 text-xs font-medium leading-relaxed mt-1">Don't just code. Build real modules for platforms like Buzzar and Zilla Cricket.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#3f8efc] rounded-xl text-white shadow-lg shadow-blue-400/10">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-white font-black italic uppercase text-xs tracking-wider">Direct Mentorship</p>
                    <p className="text-zinc-400 text-xs font-medium leading-relaxed mt-1">Weekly code reviews and strategy syncs with industry veterans.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunity Banner */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-indigo-100/30 flex items-center justify-between group hover:shadow-2xl transition-all">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-zinc-50 rounded-2xl text-[#2667ff] group-hover:bg-[#2667ff] group-hover:text-white transition-all">
                  <Layers size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 italic">Career Track</p>
                  <p className="text-xl font-black italic text-zinc-900 leading-none">PPO Eligibility</p>
                </div>
              </div>
              <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                Active
              </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-zinc-100 p-8 rounded-[2.5rem] border border-zinc-200/50 flex flex-col justify-center group hover:bg-white transition-colors">
                 <div className="flex items-center gap-2 mb-1">
                    <Globe size={14} className="text-[#2667ff]" />
                    <p className="text-3xl font-black italic text-[#2667ff]">40+</p>
                 </div>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Partners</p>
              </div>
              <div className="bg-zinc-100 p-8 rounded-[2.5rem] border border-zinc-200/50 flex flex-col justify-center group hover:bg-white transition-colors">
                 <div className="flex items-center gap-2 mb-1">
                    <Award size={14} className="text-zinc-900" />
                    <p className="text-3xl font-black italic text-zinc-900">2.5k</p>
                 </div>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Successful Alumni</p>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Conversion Form */}
          <div className="lg:col-span-7 intern-reveal">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-[0_40px_80px_-15px_rgba(38,103,255,0.08)] border border-zinc-100 relative">
              
              <div className="mb-10">
                <h3 className="text-3xl font-black tracking-tighter italic uppercase mb-6">Apply Now</h3>
                
                {/* COMPREHENSIVE STREAM SELECTION */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Select Your Stream</label>
                  <div className="flex flex-wrap gap-2 bg-zinc-50/80 p-2 rounded-[2rem] border border-zinc-100 shadow-inner">
                    {DOMAINS.map((domain) => (
                      <button 
                        key={domain}
                        type="button"
                        onClick={() => setActiveDomain(domain)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          activeDomain === domain 
                          ? "bg-white text-[#2667ff] shadow-md shadow-blue-100 scale-105" 
                          : "text-zinc-400 hover:text-zinc-600"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Jane Doe" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none font-bold shadow-sm transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Primary Expert Skill</label>
                    <input name="skill" value={formData.skill} onChange={handleChange} required placeholder="React / Figma / Java" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none font-bold shadow-sm transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Portfolio / LinkedIn / GitHub</label>
                  <div className="relative">
                    <Briefcase className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                    <input name="portfolio" value={formData.portfolio} onChange={handleChange} required type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none font-bold shadow-sm transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Describe your best project</label>
                  <textarea name="projectDescription" value={formData.projectDescription} onChange={handleChange} rows={4} placeholder="Briefly explain the problem you solved..." className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none font-bold shadow-sm transition-all resize-none" />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-zinc-900 overflow-hidden p-6 rounded-3xl transition-all hover:shadow-[0_25px_50px_-12px_rgba(38,103,255,0.3)] mt-4"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#2667ff] to-[#3f8efc] transition-all duration-500 group-hover:w-full" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase tracking-[0.3em] text-[10px] group-hover:text-white">
                    {isSubmitting ? "Syncing Profile..." : "Initiate Application"}
                    <CheckCircle size={16} />
                  </span>
                </button>

                <div className="flex items-center justify-center gap-8 pt-4">
                  <div className="flex items-center gap-2 opacity-30 grayscale group-hover:grayscale-0 transition-all">
                    <Cpu size={14} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Verified Domain</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-30 grayscale group-hover:grayscale-0 transition-all">
                    <CheckCircle size={14} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Priority Review</span>
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