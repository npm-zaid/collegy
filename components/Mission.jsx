"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, GraduationCap, Sparkles, Star, MapPin } from 'lucide-react';

const Mission = () => {
  const containerRef = useRef(null);
  const leftCardRef  = useRef(null);
  const rightCardRef = useRef(null);
  const badgeRefs    = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for stat badges
      badgeRefs.current.forEach((badge, index) => {
        gsap.to(badge, {
          y: index % 2 === 0 ? -25 : 25,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !badgeRefs.current.includes(el)) {
      badgeRefs.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className=" min-h-screen py-10 px-6 md:px-20 flex flex-col items-center"
    >
      {/* ── Header ── */}
      <div className="relative mb-5 flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 mb-4">
          <Sparkles size={14} className="text-[#2667ff]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
            Students · Colleges · Dreams
          </span>
        </div>
        <h1 className="sm:text-6xl text-5xl font-black tracking-tighter text-center leading-[0.8] mb-4">
          <span className="text-zinc-900">Our </span>
          <span className="bg-gradient-to-r from-[#2667ff] via-[#818CF8] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
            Mission
          </span>
        </h1>
        <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ══ LEFT SIDE: VISUAL STACK ══ */}
        <div className="relative flex items-end gap-6 h-[500px] md:h-[80vh]">

          {/* Main Card — happy student */}
          <div ref={leftCardRef} className="relative flex-1 h-full">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl shadow-black/50"
              alt="Student at college"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-[3rem]" />

            {/* Floating badge — AI match score */}
            <div
              ref={addToRefs}
              className="absolute top-[25%] -right-12 bg-white/80 backdrop-blur-xl border-2 border-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 z-20"
            >
              <Star size={14} className="text-[#2667ff] fill-[#2667ff]" />
              <span className="text-zinc-900 font-bold text-sm">98% AI match</span>
            </div>

            {/* Floating badge — colleges listed */}
            <div
              ref={addToRefs}
              className="absolute bottom-[20%] -left-10 bg-white/80 backdrop-blur-xl border-2 border-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 z-20"
            >
              <GraduationCap size={14} className="text-[#2667ff]" />
              <span className="text-zinc-900 font-bold text-sm">10,000+ Colleges</span>
            </div>

            {/* Bottom profile strip */}
            <div className="absolute bottom-8 sm:left-8 left-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                alt="Student"
              />
              <span className="text-white font-semibold flex items-center gap-1">
                Priya S. &nbsp;
                <CheckCircle2 size={16} className="fill-[#2667ff] text-white" />
              </span>
            </div>
          </div>

          {/* Secondary Card — campus */}
          <div ref={rightCardRef} className="relative w-[45%] h-[75%] rounded-[3rem]">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl shadow-black/50"
              alt="College campus"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-[3rem]" />

            {/* Floating badge — city/location */}
            <div
              ref={addToRefs}
              className="absolute bottom-[35%] -right-8 bg-white/80 backdrop-blur-xl border-2 border-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 z-20"
            >
              <MapPin size={14} className="text-zinc-400" />
              <span className="text-zinc-900 font-bold text-sm">500+ Cities</span>
            </div>

            {/* Bottom profile strip */}
            <div className="absolute bottom-8 sm:left-8 left-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=50&h=50&fit=crop"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                alt="Campus"
              />
              <span className="text-white font-semibold flex items-center gap-1">
                IIT Bombay &nbsp;
                <CheckCircle2 size={16} className="fill-[#2667ff] text-white" />
              </span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT SIDE: COPY ══ */}
        <div className="flex flex-col items-start lg:pl-10">
          <h2 className="text-2xl md:text-4xl font-semibold text-zinc-900 leading-[1.1] tracking-tight mb-8">
            Collegy is where students find their perfect college — with AI-powered matching, real data, and a community that guides every step of the journey.
          </h2>

          {/* CTA button — same expanding-pill animation */}
          <button
            onClick={() => { window.location.href = '/find/ai-search'; }}
            type="button"
            className="relative h-12 px-6 pr-14 rounded-full bg-[#2667ff]/20 overflow-hidden text-white font-semibold text-sm cursor-pointer group"
          >
            {/* Expanding pill */}
            <span className="absolute top-1 right-1 h-10 w-10 rounded-full bg-[#2667ff] flex items-center justify-center z-20 transition-all duration-500 ease-out group-hover:w-[calc(100%-8px)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className="w-5 h-5">
                <path d="M800 512H160a32 32 0 0 1 0-64h640a32 32 0 1 1 0 64z" fill="#ffffff" />
                <path d="m786.752 512-265.408-265.344a32 32 0 0 1 45.312-45.312l288 288a32 32 0 0 1 0 45.312l-288 288a32 32 0 1 1-45.312-45.312L786.752 512z" fill="#ffffff" />
              </svg>
            </span>
            {/* Label */}
            <span className="relative z-10  transition-colors duration-300 group-hover:text-white">
              Find my college
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Mission;