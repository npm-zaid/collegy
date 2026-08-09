"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sparkles, Star, MapPin } from 'lucide-react';


const AWARDS = [
  {
    id: 1,
    title: "Times Education Icons",
    region: "India 2024",
    image: "https://www.go.study/assets/times-edu.webp",
    badgeBg: "conic-gradient(from 0deg, #2a2000, #4a3800, #7a5c00, #c8960a, #f0c030, #c8960a, #7a5c00, #4a3800, #2a2000)",
    badgeShadow: "0 0 0 1px rgba(200,150,10,0.3), inset 0 1px 0 rgba(255,220,80,0.15), 0 8px 32px rgba(0,0,0,0.8)",
    specular: "conic-gradient(from 120deg, rgba(255,240,120,0.35) 0%, transparent 15%, transparent 45%, rgba(255,200,60,0.2) 50%, transparent 60%, transparent 90%, rgba(255,240,120,0.25) 100%)",
    dividerColor: "linear-gradient(90deg, #c8960a, #f0c030, #c8960a)",
    regionColor: "#c8960a",
    ambientColor: "#d4a020",
  },
  {
    id: 2,
    title: "Great Place To Work",
    region: "Certified 2024–25",
    image: null,
    badgeBg: "conic-gradient(from 0deg, #1a0000, #380000, #680000, #a01010, #d42020, #a01010, #680000, #380000, #1a0000)",
    badgeShadow: "0 0 0 1px rgba(180,30,30,0.3), inset 0 1px 0 rgba(255,80,80,0.12), 0 8px 32px rgba(0,0,0,0.8)",
    specular: "conic-gradient(from 120deg, rgba(255,140,140,0.3) 0%, transparent 15%, transparent 45%, rgba(220,80,80,0.18) 50%, transparent 60%, transparent 90%, rgba(255,140,140,0.22) 100%)",
    dividerColor: "linear-gradient(90deg, #a01010, #e03030, #a01010)",
    regionColor: "#e03030",
    ambientColor: "#c0392b",
    fallbackLabel: "GREAT\nPLACE\nTO WORK",
  },
  {
    id: 3,
    title: "Global Education Award",
    region: "Winner 2024",
    image: null,
    badgeBg: "conic-gradient(from 0deg, #000818, #001030, #001c58, #082878, #1040a0, #082878, #001c58, #001030, #000818)",
    badgeShadow: "0 0 0 1px rgba(30,60,180,0.3), inset 0 1px 0 rgba(80,120,255,0.12), 0 8px 32px rgba(0,0,0,0.8)",
    specular: "conic-gradient(from 120deg, rgba(120,170,255,0.3) 0%, transparent 15%, transparent 45%, rgba(60,100,220,0.18) 50%, transparent 60%, transparent 90%, rgba(120,170,255,0.22) 100%)",
    dividerColor: "linear-gradient(90deg, #1040a0, #3060e0, #1040a0)",
    regionColor: "#4a80e8",
    ambientColor: "#1a3a8a",
    fallbackEmoji: "🌐",
  },
  {
    id: 4,
    title: "ICEF Accredited",
    region: "Trusted Agency",
    image: null,
    badgeBg: "conic-gradient(from 0deg, #111, #1e1e1e, #333, #555, #888, #aaa, #888, #555, #333, #1e1e1e, #111)",
    badgeShadow: "0 0 0 1px rgba(180,180,180,0.2), inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.8)",
    specular: "conic-gradient(from 120deg, rgba(255,255,255,0.28) 0%, transparent 15%, transparent 45%, rgba(200,200,200,0.14) 50%, transparent 60%, transparent 90%, rgba(255,255,255,0.2) 100%)",
    dividerColor: "linear-gradient(90deg, #555, #aaa, #555)",
    regionColor: "#888",
    ambientColor: "#2a2a2a",
    fallbackLabel: "ICEF",
  },
];

export default function AwardsSection() {
  const cardsRef = useRef([]);
  const badgesRef = useRef([]);

  useEffect(() => {
    // Entry animations
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.15 * i + 0.3, ease: "power3.out" }
      );
    });

    // Continuous gentle float per badge
    badgesRef.current.forEach((badge, i) => {
      if (!badge) return;
      gsap.to(badge, {
        y: -6,
        duration: 2.2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4,
      });
    });

    // 3D tilt + specular on mousemove
    const cleanups = [];

    cardsRef.current.forEach((card) => {
      if (!card) return;
      const inner = card.querySelector(".award-card-inner");
      const shine = card.querySelector(".card-shine");
      const specular = card.querySelector(".specular-ring");

      const onMove = (e) => {
        if (!inner) return;
        const rect = inner.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        gsap.to(card, {
          rotateX: -ny * 8,
          rotateY: nx * 8,
          transformPerspective: 800,
          duration: 0.25,
          ease: "power2.out",
        });

        if (shine) {
          const px = Math.round(((e.clientX - rect.left) / rect.width) * 100);
          const py = Math.round(((e.clientY - rect.top) / rect.height) * 100);
          shine.style.setProperty("--mx", `${px}%`);
          shine.style.setProperty("--my", `${py}%`);
          shine.style.opacity = "1";
        }

        if (specular) {
          const angle = Math.atan2(ny, nx) * (180 / Math.PI) + 180;
          gsap.to(specular, { rotation: angle * 0.15, duration: 0.4, ease: "power1.out" });
        }
      };

      const onLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.7)" });
        if (shine) shine.style.opacity = "0";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      className="relative py-24 overflow-hidden bg-zinc-950" 
      
    >
  
  

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="relative mb-16 flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 mb-4">
          <Sparkles size={14} className="text-[#2667ff]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
            Recognized Excellence
          </span>
        </div>
        <h1 className="sm:text-6xl text-4xl font-black tracking-tighter text-center leading-[1.2] mb-4">
          <span className="text-zinc-200">Our </span>
          <span className="bg-gradient-to-r from-[#2667ff] via-[#818CF8] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
            Global Awards
          </span>
        </h1>
        <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2" />
      </div>




        {/* Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {AWARDS.map((award, index) => (
            <div
              key={award.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              style={{ position:"relative", cursor:"pointer", transformStyle:"preserve-3d" }}
            >
              {/* Ambient floor glow */}
              <div
                className="card-ambient"
                style={{
                  position:"absolute", bottom:-30, left:"50%", transform:"translateX(-50%)",
                  width:"70%", height:60, borderRadius:"50%",
                  background:`radial-gradient(circle, ${award.ambientColor}, transparent)`,
                  filter:"blur(20px)", opacity:0, pointerEvents:"none",
                  transition:"opacity 0.5s",
                }}
              />

              <div
                className="award-card-inner"
                style={{
                  position:"relative", borderRadius:20, overflow:"hidden",
                  background:"#111", border:"1px solid rgba(255,255,255,0.06)",
                  padding:"28px 16px 24px",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:20,
                  transition:"border-color 0.4s",
                }}
              >
                {/* Shine layer (moves with cursor) */}
                <div
                  className="card-shine"
                  style={{
                    position:"absolute", inset:0, borderRadius:20, pointerEvents:"none",
                    background:"radial-gradient(ellipse at var(--mx,50%) var(--my,30%), rgba(255,255,255,0.07) 0%, transparent 60%)",
                    opacity:0, transition:"opacity 0.3s", zIndex:5,
                  }}
                />

                {/* Badge */}
                <div
                  ref={(el) => { badgesRef.current[index] = el; }}
                  style={{ width:110, height:110, borderRadius:"50%", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                >
                  {/* Metallic disc */}
                  <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:award.badgeBg, boxShadow:award.badgeShadow }} />
                  {/* Specular arc */}
                  <div className="specular-ring" style={{ position:"absolute", inset:0, borderRadius:"50%", background:award.specular, zIndex:3, pointerEvents:"none" }} />
                  {/* Top dome highlight */}
                  <div style={{ position:"absolute", top:5, left:"15%", width:"70%", height:"45%", borderRadius:"50%", background:"radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.18) 0%, transparent 75%)", zIndex:4, pointerEvents:"none" }} />

                  {/* Badge content */}
                  {award.image ? (
                    <img
                      src={award.image}
                      alt={award.title}
                      style={{ width:68, height:68, objectFit:"contain", position:"relative", zIndex:2, filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.7))", transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
                    />
                  ) : (
                    <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                      {award.fallbackEmoji && (
                        <span style={{ fontSize:24, filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }}>{award.fallbackEmoji}</span>
                      )}
                      {award.fallbackLabel && (
                        <div style={{ fontSize: award.id === 4 ? 11 : 7, fontWeight:800, color:"#fff", letterSpacing:"0.18em", textAlign:"center", lineHeight:1.3, textShadow:"0 1px 4px rgba(0,0,0,0.9)", whiteSpace:"pre-line" }}>
                          {award.fallbackLabel}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#d0ccc5", marginBottom:4, lineHeight:1.3 }}>
                    {award.title}
                  </div>
                  <div
                    className="award-divider"
                    style={{ height:1.5, width:0, margin:"5px auto", borderRadius:2, background:award.dividerColor, transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:award.regionColor }}>
                    {award.region}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decorative rule */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div style={{ height:1, width:100, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
          ))}
          <div style={{ height:1, width:100, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
        </div>
      </div>

      {/* Global hover CSS */}
      <style>{`
        .award-card-inner:hover { border-color: rgba(255,255,255,0.14) !important; }
        .award-card-inner:hover .award-divider { width: 28px !important; }
        .award-card-inner:hover img { transform: scale(1.1) translateY(-2px); }
        .award-card-inner:hover .card-ambient { opacity: 0.5 !important; }
      `}</style>
    </section>
  );
}