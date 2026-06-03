"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Handshake, 
  TrendingUp, 
  Globe, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Briefcase
} from "lucide-react";

export default function page() {
  const containerRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    experience: "1-3 Years",
    studentVolume: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".partner-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://finale-beacon-backend.vercel.app/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setStep(3); // Success state
        setFormData({ fullName: "", email: "", companyName: "", experience: "1-3 Years", studentVolume: "" });
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
    <section ref={containerRef} className="py-24 bg-[#FDFDFD] relative overflow-hidden px-6">
      {/* Brand Glow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#2667ff]/5 blur-[140px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT: The Pitch */}
          <div className="lg:col-span-5 flex flex-col justify-center partner-reveal">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 w-fit mb-6">
              <Handshake size={14} className="text-[#2667ff]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
                B2B Partnership
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8">
              Grow your <br />
              <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic">
                reach with us.
              </span>
            </h2>

            <div className="space-y-8 mb-12">
              <div className="flex gap-5 group">
                <div className="w-12 h-12 shrink-0 bg-white shadow-lg rounded-2xl flex items-center justify-center text-[#2667ff] group-hover:bg-[#2667ff] group-hover:text-white transition-all duration-500">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">High Commissions</h4>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">Earn up to 15-20% on successful premium admissions and counseling referrals.</p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="w-12 h-12 shrink-0 bg-white shadow-lg rounded-2xl flex items-center justify-center text-[#2667ff] group-hover:bg-[#2667ff] group-hover:text-white transition-all duration-500">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Global Network</h4>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">Access 1000+ top-tier universities across India, UK, USA, and Canada.</p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="w-12 h-12 shrink-0 bg-white shadow-lg rounded-2xl flex items-center justify-center text-[#2667ff] group-hover:bg-[#2667ff] group-hover:text-white transition-all duration-500">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Partner Support</h4>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">Dedicated regional managers and real-time dashboard for lead tracking.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#2667ff]/20 blur-3xl" />
               <p className="text-xs font-bold text-zinc-400 mb-2 italic">Trusted by</p>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black italic">500+</span>
                 <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#3f8efc]">Active Agents</span>
               </div>
            </div>
          </div>

          {/* RIGHT: The Form Bento */}
          <div className="lg:col-span-7 partner-reveal">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-indigo-100/50 border border-zinc-100 relative h-full flex flex-col">
              
              {step === 3 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                   <div className="w-24 h-24 bg-gradient-to-tr from-[#2667ff] to-[#3f8efc] rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-200 rotate-3">
                     <CheckCircle2 size={48} />
                   </div>
                   <h3 className="text-3xl font-black italic uppercase mb-3">Application Sent</h3>
                   <p className="text-zinc-500 font-medium max-w-sm mb-10">Our Partnership Team will review your credentials and contact you within 24-48 hours.</p>
                   <button 
                    onClick={() => setStep(1)}
                    className="px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                   >
                     Done
                   </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight italic uppercase">Join the Network</h3>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Step {step} of 2</p>
                    </div>
                    <div className="flex gap-1">
                      <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 1 ? "bg-[#2667ff]" : "bg-zinc-100"}`} />
                      <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 2 ? "bg-[#2667ff]" : "bg-zinc-100"}`} />
                    </div>
                  </div>

                  <form onSubmit={handleApply} className="space-y-6 flex-1">
                    {step === 1 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Full Name</label>
                            <div className="relative">
                              <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Alex Rivera" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Work Email</label>
                            <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="alex@company.com" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Company Name / Freelance Profile</label>
                          <div className="relative">
                            <Building2 className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                            <input name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Elite Consultants LLP" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm" />
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setStep(2)}
                          className="w-full p-6 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 group"
                        >
                          Next Step <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Years of Experience</label>
                          <select name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm appearance-none cursor-pointer">
                            <option value="1-3 Years">1-3 Years</option>
                            <option value="3-5 Years">3-5 Years</option>
                            <option value="5+ Years">5+ Years</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Current Student Volume (Monthly)</label>
                          <div className="relative">
                            <Briefcase className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                            <input name="studentVolume" value={formData.studentVolume} onChange={handleChange} required placeholder="e.g. 50+ students" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="p-6 bg-zinc-100 text-zinc-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition-all"
                          >
                            Back
                          </button>
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="p-6 bg-[#2667ff] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#3f8efc] transition-all shadow-xl shadow-blue-100"
                          >
                            {isSubmitting ? "Verifying..." : "Submit Proposal"}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </>
              )}

              <p className="mt-8 text-center text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                By submitting, you agree to the Collegy B2B Terms.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}