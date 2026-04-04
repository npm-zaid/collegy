"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Calendar, 
  Clock, 
  Video, 
  UserCheck, 
  ChevronRight, 
  Sparkles,
  Award,
  Check
} from "lucide-react";

const EXPERTS = [
  { id: "e1", name: "Dr. Arpit V.", role: "IIT Admissions Specialist", exp: "12+ Yrs" },
  { id: "e2", name: "Sanya Malhotra", role: "Study Abroad Head", exp: "8+ Yrs" },
];

export default function page() {
  const containerRef = useRef(null);
  const [selectedExpert, setSelectedExpert] = useState("e1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".consult-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
      
      gsap.to(".float-icon", {
        y: -10,
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
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2667ff]/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT: The Value Prop */}
        <div className="lg:col-span-5 flex flex-col justify-center consult-reveal">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 w-fit mb-6">
            <Video size={14} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              1-on-1 Video Session
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-6">
            Expert advice. <br />
            <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic pr-2">
              Zero confusion.
            </span>
          </h2>
          
          <p className="text-zinc-500 font-medium text-lg mb-10 max-w-sm">
            Book a 30-minute deep dive with our top-tier counselors to finalize your college list.
          </p>

          <div className="space-y-4">
            <div className="p-5 bg-white border border-zinc-100 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#2667ff] group-hover:scale-110 transition-transform">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Flexibility</p>
                <p className="font-bold text-zinc-900">Pick your own slot</p>
              </div>
            </div>
            
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center gap-4 shadow-xl hover:scale-[1.02] transition-all group">
              <div className="w-12 h-12 bg-[#2667ff] rounded-2xl flex items-center justify-center text-white">
                <Award size={20} className="float-icon" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Certified</p>
                <p className="font-bold text-white">Top 1% Counselors Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: The Booking Form Bento */}
        <div className="lg:col-span-7 consult-reveal">
          <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-[0_40px_80px_-15px_rgba(38,103,255,0.08)] border border-zinc-100 relative">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Expert Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Choose your expert</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXPERTS.map((expert) => (
                    <div 
                      key={expert.id}
                      onClick={() => setSelectedExpert(expert.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        selectedExpert === expert.id 
                        ? "border-[#2667ff] bg-[#2667ff]/5 shadow-lg" 
                        : "border-zinc-50 bg-zinc-50 hover:border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedExpert === expert.id ? "bg-[#2667ff] text-white" : "bg-zinc-200 text-zinc-500"}`}>
                          {expert.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900">{expert.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">{expert.role}</p>
                        </div>
                      </div>
                      {selectedExpert === expert.id && <Check size={16} className="text-[#2667ff]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Student Email</label>
                  <input required type="email" placeholder="name@email.com" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Mobile Number</label>
                  <input required type="tel" placeholder="+91 00000 00000" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm" />
                </div>
              </div>

              {/* Date & Time Bento Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" size={18} />
                    <input type="date" className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm appearance-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Pre-set Slot</label>
                  <div className="relative">
                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" size={18} />
                    <select className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] p-5 rounded-2xl outline-none font-bold transition-all shadow-sm appearance-none cursor-pointer">
                      <option>10:00 AM - 10:30 AM</option>
                      <option>02:00 PM - 02:30 PM</option>
                      <option>05:30 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-zinc-900 overflow-hidden p-6 rounded-3xl transition-all hover:shadow-[0_25px_50px_-12px_rgba(38,103,255,0.3)] mt-4"
              >
                <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#2667ff] to-[#3f8efc] transition-all duration-500 group-hover:w-full" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase tracking-[0.3em] text-[10px] group-hover:text-white">
                  {isSubmitting ? "Syncing Calendar..." : "Confirm Booking"}
                  <Sparkles size={16} />
                </span>
              </button>

              <div className="pt-6 border-t border-zinc-100 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 opacity-40 grayscale group hover:grayscale-0 transition-all cursor-default">
                  <UserCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Advisors</span>
                </div>
                <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                <div className="flex items-center gap-2 opacity-40 grayscale group hover:grayscale-0 transition-all cursor-default">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">30 Min Session</span>
                </div>
              </div>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}