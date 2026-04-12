"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowUpRight, GraduationCap, Quote, Sparkles } from "lucide-react";
import SecIntro from "../common/SecIntro";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STUDENT_REVIEWS = [
  { name: "Rahul Verma", text: "Collegy helped me find the perfect B.Tech program. The AI predictor is 100% accurate!", college: "IIT Delhi", logo: "R", color: "#3D6BE8" },
  { name: "Sneha Kapoor", text: "The financial aid guidance saved my career. Highly recommend to all aspirants.", college: "BITS Pilani", logo: "S", color: "#3D6BE8" },
  { name: "Ishaan Malhotra", text: "Comparing 100+ universities was never this easy. Got into my dream college!", college: "DU North Campus", logo: "I", color: "#3D6BE8" },
  { name: "Priya Das", text: "Direct application through Collegy was seamless. Zero friction, total transparency.", college: "VIT Vellore", logo: "P", color: "#3D6BE8" },
  { name: "Ananya Singh", text: "The mentorship program is elite. My counsellor was available 24/7 for my queries.", college: "SRM University", logo: "A", color: "#3D6BE8" },
  { name: "Vikram Rathore", text: "Found a scholarship I didn't even know existed. Saved nearly 4 Lakhs!", college: "LPU", logo: "V", color: "#3D6BE8" },
];

export default function StudentWallOfProof() {
  const containerRef = useRef(null);
  const rows = [useRef(null), useRef(null)];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      rows.forEach((row, i) => {
        const isEven = i % 2 === 0;

        gsap.fromTo(row.current, 
          { 
            xPercent: isEven ? 0 : -30 
          },
          {
            xPercent: isEven ? -30 : 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              scrub: 1.2,
              start: "top bottom",
              end: "bottom top",
            },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const ReviewCard = ({ item }) => (
    <div className="flex-shrink-0 w-[420px] bg-[#3D6BE8]/10  border-2 border-zinc-100 shadow-2xl shadow-black/20 rounded-[2.5rem] p-8 transition-all duration-500 group hover:border-[#3D6BE8]/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#3D6BE8]/30"
            style={{ backgroundColor: "#3D6BE8" }}
          >
            {item.logo}
          </div>
          <div>
            <h4 className="text-[14px] font-black text-zinc-900 uppercase tracking-tight leading-none mb-1">
              {item.name}
            </h4>
            <div className="flex items-center gap-1.5">
                <GraduationCap size={12} className="text-[#3D6BE8]" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {item.college}
                </span>
            </div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#3D6BE8] transition-colors duration-300">
            <Quote size={18} className="text-zinc-300 group-hover:text-white transition-colors" />
        </div>
      </div>

      <p className="text-lg font-bold text-zinc-800 leading-snug tracking-tight text-wrap italic">
        "{item.text}"
      </p>
    </div>
  );
  
  return (
    <section ref={containerRef} className="py-20 pb-24  overflow-hidden">
  
      <div className="flex flex-col gap-8">
        {rows.map((ref, idx) => (
          <div 
            key={idx} 
            ref={ref} 
            className="flex gap-8 whitespace-nowrap px-10"
            style={{ width: "max-content" }}
          >
            {[...STUDENT_REVIEWS, ...STUDENT_REVIEWS, ...STUDENT_REVIEWS].map((item, i) => (
              <ReviewCard key={`${idx}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}