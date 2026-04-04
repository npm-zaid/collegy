"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ShieldCheck, Cpu, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: "Partner Colleges", value: 800, suffix: "+" },
  { label: "Success Stories", value: 25, suffix: "k+" },
  { label: "Expert Counselors", value: 150, suffix: "+" },
  { label: "States Covered", value: 28, suffix: "" },
];

const VALUES = [
  {
    title: "Transparency",
    desc: "No hidden agendas. We show you the real data, fees, and placement stats.",
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-50",
  },
  {
    title: "AI-Precision",
    desc: "Our algorithms predict seat availability with 98% historical accuracy.",
    icon: <Cpu className="w-6 h-6 text-indigo-600" />,
    color: "bg-indigo-50",
  },
  {
    title: "Student First",
    desc: "We prioritize your career goals over college commissions, always.",
    icon: <Heart className="w-6 h-6 text-rose-600" />,
    color: "bg-rose-50",
  },
];

export default function AboutPage() {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth Heading Reveal
      // gsap.from(".about-reveal", {
      //   y: 50,
      //   opacity: 0,
      //   stagger: 0.15,
      //   duration: 1.2,
      //   ease: "power4.out",
      //   scrollTrigger: {
      //     trigger: sectionRef.current,
      //     start: "top 75%",
      //   },
      // });

      // Number Counting Animation
      const stats = gsap.utils.toArray(".stat-number");
      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target"));
        gsap.to(stat, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
          },
        });
      });

      // Image Parallax/Scale
      gsap.from(".about-image", {
        scale: 1.2,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-image",
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#fcfdff] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: THE MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="relative">
            {/* Background Accent */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px] -z-10" />
            
            <div className="about-reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#2667ff]" />
                <span className="text-[#2667ff] font-bold text-[10px] tracking-widest uppercase">Our Evolution</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] mb-8 tracking-tighter">
                Redefining How <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2667ff] to-[#3f8efc]">
                  India Finds Excellence.
                </span>
              </h2>
              
              <div className="space-y-6 text-gray-500 text-lg leading-relaxed max-w-xl">
                <p>
                  We noticed a pattern: students were choosing careers based on rumors. We decided to change the narrative.
                </p>
                <p className="font-medium text-indigo-900/80">
                  By combining high-end AI analytics with human empathy, we’ve built a bridge between aspiration and reality.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <button className="bg-indigo-950 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  Our Journey
                </button>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">+2M</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Image Frame */}
          <div className="relative about-reveal">
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(79,70,229,0.2)] bg-indigo-100">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                alt="Vision"
                className="about-image w-full h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-transparent" />
              
              {/* Floating Glass Tag */}
              <div className="absolute bottom-10 left-10 right-10 bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-2xl">
                 <p className="text-indigo-950 font-bold text-xl">The Gold Standard</p>
                 <p className="text-indigo-800/60 text-sm">Verified placements across 800+ campuses.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE NUMBERS */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {STATS.map((stat, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-10 rounded-[2.5rem] border border-indigo-50 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:border-indigo-200 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-[5rem] -z-10 group-hover:bg-indigo-100 transition-colors" />
              <h3 className="text-5xl font-black text-indigo-950 mb-3 tracking-tighter">
                <span className="stat-number" data-target={stat.value}>0</span>
                <span className="text-[#2667ff]">{stat.suffix}</span>
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* SECTION 3: THE VALUES */}
        <div className="relative bg-indigo-950 rounded-[4rem] p-12 md:p-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#2667ff33,transparent_50%)]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 about-reveal">
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our DNA</h2>
               <p className="text-indigo-200/60 leading-relaxed mb-8">
                 We don't just guide; we architect futures. These core values are baked into every line of code we write.
               </p>
               <div className="h-1 w-20 bg-gradient-to-r from-[#2667ff] to-blue-400 rounded-full" />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {VALUES.map((v, i) => (
                <div key={i} className="about-reveal group p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                    {v.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{v.title}</h4>
                  <p className="text-indigo-100/50 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}