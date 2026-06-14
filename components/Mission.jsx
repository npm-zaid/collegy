"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { CheckCircle2, GraduationCap, Sparkles, Star, MapPin } from 'lucide-react';

const Mission = () => {
  const containerRef = useRef(null);
  const leftCardRef  = useRef(null);
  const rightCardRef = useRef(null);
  const badgeRefs    = useRef([]);
  const whatsappBtnRef = useRef(null);

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

    // WhatsApp button ScrollTrigger
    const btn = whatsappBtnRef.current;
    gsap.set(btn, { autoAlpha: 0, x: 80, scale: 0.6 });

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      end: 'bottom 10%',
      onEnter: () => {
        gsap.to(btn, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        });
      },
      onLeave: () => {
        gsap.to(btn, {
          autoAlpha: 0,
          x: 80,
          scale: 0.6,
          duration: 0.4,
          ease: 'power2.in',
        });
      },
      onEnterBack: () => {
        gsap.to(btn, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        });
      },
      onLeaveBack: () => {
        gsap.to(btn, {
          autoAlpha: 0,
          x: 80,
          scale: 0.6,
          duration: 0.4,
          ease: 'power2.in',
        });
      },
    });

    return () => {
      ctx.revert();
      st.kill();
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !badgeRefs.current.includes(el)) {
      badgeRefs.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className=" min-h-screen relative py-10 px-6 md:px-20 flex flex-col items-center"
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
              src="/assets/vikas.jpeg"
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
                src="/assets/vikas.jpeg"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                alt="Student"
              />
              <span className="text-white font-semibold flex items-center gap-1">
                Vikas
                <CheckCircle2 size={16} className="fill-[#2667ff] text-white" />
              </span>
            </div>
          </div>

          {/* Secondary Card — campus */}
          <div ref={rightCardRef} className="relative w-[45%] h-[75%] rounded-[3rem]">
            <img
              src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg"
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
            Finalebeacon is where students find their perfect college — with AI-powered matching, real data, and a community that guides every step of the journey.
          </h2>

           <button className="flex btn items-center bg-gradient-to-br from-[#2667ff] to-[#3f8efc] gap-2 px-5 py-2.5 rounded-3xl text-sm font-bold text-white cursor-pointer border-0 shadow-[0_4px_18px_rgba(79,70,229,0.38)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.55)]">
            Find my college
           
          </button>
        </div>

      </div>

      {/* WhatsApp floating button — fixed, appears on Mission scroll */}
      <a
        ref={whatsappBtnRef}
        href="https://wa.me/916266637374?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Finale%20Beacon!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          right: '-5px',
          bottom: '20px',
          zIndex: 9999,
          visibility: 'hidden',
        }}
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm px-4 py-3 rounded-l-full shadow-[0_6px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_40px_rgba(37,211,102,0.65)] transition-all duration-300"
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          className="w-5 h-5 shrink-0"
        >
          <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.04 7.8L.5 31.5l7.9-2.07A15.43 15.43 0 0016 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.3a13.2 13.2 0 01-6.73-1.84l-.48-.29-4.69 1.23 1.25-4.56-.32-.5A13.26 13.26 0 012.7 16C2.7 9.16 8.16 3.7 16 3.7S29.3 9.16 29.3 16 23.84 28.8 16 28.8zm7.28-9.9c-.4-.2-2.35-1.16-2.72-1.29-.36-.13-.62-.2-.88.2s-1.01 1.29-1.24 1.55c-.23.27-.45.3-.84.1-.4-.2-1.67-.62-3.18-1.97-1.18-1.05-1.97-2.34-2.2-2.74-.23-.4-.02-.61.17-.81.18-.18.4-.46.6-.7.2-.23.27-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.88-2.12-1.2-2.9-.32-.76-.64-.66-.88-.67h-.75c-.26 0-.68.1-1.04.5s-1.36 1.33-1.36 3.24 1.39 3.76 1.59 4.02c.19.26 2.74 4.18 6.63 5.86.93.4 1.65.64 2.22.82.93.3 1.78.25 2.45.15.75-.11 2.35-.96 2.68-1.89.33-.93.33-1.73.23-1.89-.09-.17-.35-.27-.74-.46z" />
        </svg>
        <span className="hidden sm:inline">Chat with us</span>
      </a>


    </section>
  );
};

export default Mission;