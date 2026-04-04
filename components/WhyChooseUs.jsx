"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    id: 1,
    title: "Smart Predictor",
    desc: "AI-driven rank analysis to find colleges you'll actually get into.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" />
        <path d="M16 19h6M19 16l3 3-3 3" />
        <path d="M7 10h1M7 14h1M11 10h3" />
      </svg>
    ),
    size: "col-span-12 md:col-span-7",
    bg: "bg-white",
    accent: "text-[#2667ff]",
  },
  {
    id: 2,
    title: "1-on-1 Help",
    desc: "Expert counseling for your career.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    size: "col-span-12 md:col-span-5",
    bg: "bg-gradient-to-br from-[#2667ff] to-[#3f8efc]",
    accent: "text-white",
  },
  {
    id: 3,
    title: "Direct Comparison",
    desc: "Compare fees, placements, and campus life side-by-side.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
      </svg>
    ),
    size: "col-span-12 md:col-span-5",
    bg: "bg-white",
    accent: "text-orange-500",
  },
  {
    id: 4,
    title: "Real-time Seat Alerts",
    desc: "Never miss a deadline with instant notifications on seat vacancy.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    size: "col-span-12 md:col-span-7",
    bg: "bg-white",
    accent: "text-green-500",
  },
];

export default function WhyChooseUs() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".section-header", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // Bento Grid Cards Animation
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          delay: i * 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom 10%",
            scrub: 1,
          },
        });

        // Floating hover effect via GSAP
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -10, scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-[#fcfdff]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-16">
          <span className="text-[#2667ff] font-bold text-xs tracking-[0.2em] uppercase bg-indigo-50 px-4 py-2 rounded-full">
            The MedCounsel Advantage
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-950 mt-6 tracking-tight">
            Why Students <span className="text-[#2667ff]">Trust</span> Us
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            We combine data-driven insights with personalized counseling to make your college admission journey stress-free.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`${f.size} ${f.bg === "bg-white" ? "bg-white border border-indigo-100 shadow-[0_10px_30px_rgba(79,70,229,0.08)]" : f.bg + " text-white shadow-[0_20px_40px_rgba(38,103,255,0.3)]"} 
              relative overflow-hidden rounded-[2.5rem] p-8 group cursor-pointer transition-shadow`}
            >
              {/* Decor Circles for the gradient card */}
              {f.id === 2 && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
              )}

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                    ${f.id === 2 ? "bg-white/20" : "bg-indigo-50 " + f.accent}`}>
                    {f.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${f.id === 2 ? "text-white" : "text-indigo-950"}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${f.id === 2 ? "text-white/80" : "text-gray-500"}`}>
                    {f.desc}
                  </p>
                </div>

                <div className="mt-8">
                  <span className={`text-xs font-bold flex items-center gap-2 ${f.id === 2 ? "text-white" : "text-[#2667ff]"}`}>
                    Learn More 
                    <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom Stats or CTA */}
        <div className="mt-16 text-center border-t border-indigo-50 pt-10">
            <p className="text-sm text-gray-400 font-medium italic">
                "Used by over 20,000+ students in Mumbai & Delhi this year alone."
            </p>
        </div>
      </div>
    </section>
  );
}