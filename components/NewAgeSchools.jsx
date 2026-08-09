"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  BrainCircuit,
  TrendingUp,
  GraduationCap,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import SoundWrapper from "./SoundWrapper";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ───────────────────────────────────────────────────────────────────

const categories = [
  {
    id: "coding",
    label: "Coding Bootcamps",
    icon: <Code2 size={16} />,
    accent: "#3D6BE8",
    accentBg: "rgba(61,107,232,0.08)",
    accentBorder: "rgba(61,107,232,0.25)",
    accentGlow: "rgba(61,107,232,0.15)",
    tag: "#1 Trending",
    tagColor: "#3D6BE8",
    tagBg: "rgba(61,107,232,0.1)",
    tagBorder: "rgba(61,107,232,0.2)",
    schools: [
      "Scaler Academy",
      "Newton School",
      "Masai School",
      "AlmaBetter",
      "Crio.Do",
      "UpGrad IIIT Bangalore",
      "Coding Ninjas",
      "GrowthSchool",
      "OdinSchool",
      "Pesto Tech",
      "NxtWave",
      "GUVI",
    ],
  },
  {
    id: "ai",
    label: "AI / Data Science Schools",
    icon: <BrainCircuit size={16} />,
    accent: "#a855f7",
    accentBg: "rgba(168,85,247,0.08)",
    accentBorder: "rgba(168,85,247,0.25)",
    accentGlow: "rgba(168,85,247,0.15)",
    tag: "Fastest Growing",
    tagColor: "#a855f7",
    tagBg: "rgba(168,85,247,0.1)",
    tagBorder: "rgba(168,85,247,0.2)",
    schools: [
      "Scaler AI",
      "Newton AI",
      "AlmaBetter AI",
      "Crio.Do Data Track",
      "Skill-Lync",
      "OdinSchool",
      "NxtWave",
      "GUVI",
      "Kalvium",
      "PW School of AI",
      "Mirai School of Technology",
      "Coding Ninjas AI Programs",
    ],
  },
  {
    id: "business",
    label: "Business + Tech Schools",
    icon: <TrendingUp size={16} />,
    accent: "#E39F4A",
    accentBg: "rgba(227,159,74,0.08)",
    accentBorder: "rgba(227,159,74,0.25)",
    accentGlow: "rgba(227,159,74,0.15)",
    tag: "High ROI",
    tagColor: "#E39F4A",
    tagBg: "rgba(227,159,74,0.1)",
    tagBorder: "rgba(227,159,74,0.2)",
    schools: [
      "Newton School of Business",
      "Scaler School of Business",
      "Alta",
      "upGrad Campus",
      "GrowthSchool",
      "ISB Executive Digital Programs",
      "Masters' Union",
      "Hero Vired",
    ],
  },
  {
    id: "degree",
    label: "Industry Degree Programs",
    icon: <GraduationCap size={16} />,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
    accentGlow: "rgba(16,185,129,0.15)",
    tag: "UGC Recognised",
    tagColor: "#10b981",
    tagBg: "rgba(16,185,129,0.1)",
    tagBorder: "rgba(16,185,129,0.2)",
    schools: [
      "Sunstone",
      "Mirai",
      "PW IOI",
      "Newton School of Technology",
      "Scaler School of Technology",
      "Kalvium",
      "NxtWave",
      "upGrad Campus",
      "Coding Ninjas Campus Programs",
    ],
  },
  {
    id: "design",
    label: "Design & Creative Tech",
    icon: <Layers size={16} />,
    accent: "#f43f5e",
    accentBg: "rgba(244,63,94,0.08)",
    accentBorder: "rgba(244,63,94,0.25)",
    accentGlow: "rgba(244,63,94,0.15)",
    tag: "Niche & Rising",
    tagColor: "#f43f5e",
    tagBg: "rgba(244,63,94,0.1)",
    tagBorder: "rgba(244,63,94,0.2)",
    schools: [
      "Srishti Manipal Institute",
      "MAAC",
      "Arena Animation",
      "Whistling Woods",
      "DSK Supinfocom",
      "Frameboxx",
      "Image Institute",
      "ZICA",
    ],
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function NewAgeSchools() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  // Entrance animation on scroll
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header slide + fade
      gsap.fromTo(
        ".nas-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Tab bar slide in
      gsap.fromTo(
        ".nas-tabs",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // School pills stagger in
      gsap.fromTo(
        ".school-pill",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Floating badge
      gsap.to(".nas-badge", {
        y: -5,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle ambient orb pulse
      gsap.to(".nas-orb", {
        scale: 1.15,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Re-animate pills when tab changes
  const handleTabChange = (idx) => {
    setActiveTab(idx);
    gsap.fromTo(
      ".school-pill",
      { scale: 0.88, opacity: 0, y: 10 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.035,
        ease: "back.out(1.3)",
      }
    );
  };

  const active = categories[activeTab];

  return (
    <section
      ref={sectionRef}
      className="min-h-fit w-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden relative py-24 px-6 md:px-10"
    >
      {/* ── Background micro-grid (matches WhyChooseUs / YouTubeShowcase) ── */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#3D6BE8 2px, transparent 2px), linear-gradient(90deg, #3D6BE8 2px, transparent 2px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── Ambient orbs ── */}
      <div
        className="nas-orb absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${active.accentGlow} 0%, transparent 70%)`,
          transition: "background 0.6s ease",
        }}
      />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Content wrapper ── */}
      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center">

        {/* HEADER */}
        <div className="nas-header text-center mb-14 space-y-4 max-w-3xl">
          <div
            className="nas-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border"
            style={{
              background: "rgba(61,107,232,0.08)",
              color: "#3D6BE8",
              borderColor: "rgba(61,107,232,0.2)",
            }}
          >
            <Sparkles size={11} />
            New Age Schools
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
            Beyond Traditional
            <br />
            <span className="bg-gradient-to-r from-[#2667ff] to-[#a855f7] bg-clip-text text-transparent italic">
              Education.
            </span>
          </h2>
           <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2 m-auto" />

          {/* <p className="text-zinc-500 font-bold text-xs md:text-sm max-w-xl mx-auto leading-relaxed px-4">
            India's fastest-growing new-age institutions — bootcamps, AI
            schools, industry-integrated degrees, and more. Find the one built
            for the future.
          </p> */}
        </div>

        {/* TAB BAR */}
        <style>{`
          .nas-tabs-bar::-webkit-scrollbar {
            display: none;
          }
          .nas-tabs-bar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="nas-tabs w-full flex justify-center mb-10 px-4">
          {/* Rounded Outer Container Box (Shrink-wrapped with inline-flex) */}
          <div className="inline-flex max-w-full items-center p-1.5 md:p-2 rounded-2xl md:rounded-[22px] bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Inner Scrollable Tab Items */}
            <div className="nas-tabs-bar overflow-x-auto flex items-center gap-1 sm:gap-2 px-1 py-0.5 max-w-full">
              {categories.map((cat, idx) => {
                const isActive = activeTab === idx;
                return (
                  <SoundWrapper key={cat.id}>
                    <button
                      onClick={() => handleTabChange(idx)}
                      className="relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0"
                      style={{
                        background: isActive ? cat.accentBg : "transparent",
                        color: isActive ? cat.accent : "#a1a1aa",
                        border: isActive
                          ? `1px solid ${cat.accentBorder}`
                          : "1px solid transparent",
                        boxShadow: isActive
                          ? `0 0 16px ${cat.accentGlow}`
                          : "none",
                      }}
                    >
                      <span
                        style={{ color: isActive ? cat.accent : "#a1a1aa" }}
                        className="transition-colors duration-300"
                      >
                        {cat.icon}
                      </span>
                      {cat.label}
                    </button>
                  </SoundWrapper>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div
          className="w-full rounded-[36px] border backdrop-blur-2xl overflow-hidden transition-all duration-500"
          style={{
            background: "rgba(9,9,11,0.7)",
            borderColor: active.accentBorder,
            boxShadow: `0 0 60px ${active.accentGlow}, 0 0 0 1px ${active.accentBorder}`,
          }}
        >
          {/* Card header stripe */}
          <div
            className="flex items-center justify-between px-8 py-5 border-b"
            style={{ borderColor: active.accentBorder }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: active.accentBg, color: active.accent }}
              >
                {active.icon}
              </div>
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.25em]"
                  style={{ color: active.accent }}
                >
                  {active.label}
                </p>
                <p className="text-[10px] text-zinc-600 font-bold mt-0.5">
                  {active.schools.length} institutions listed
                </p>
              </div>
            </div>

            {/* Tag pill */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border"
              style={{
                color: active.tagColor,
                background: active.tagBg,
                borderColor: active.tagBorder,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: active.accent }}
              />
              {active.tag}
            </span>
          </div>

          {/* Schools grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {active.schools.map((school, i) => (
                <div
                  key={school}
                  className="school-pill group flex items-center gap-3 px-5 py-3.5 rounded-2xl border cursor-default transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(24,24,27,0.5)",
                    borderColor: "rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = active.accentBorder;
                    e.currentTarget.style.background = active.accentBg;
                    e.currentTarget.style.boxShadow = `0 0 14px ${active.accentGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.background = "rgba(24,24,27,0.5)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Index number */}
                  <span
                    className="text-[9px] font-black w-5 text-right shrink-0"
                    style={{ color: active.accent + "60" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[11px] md:text-xs font-black text-white tracking-tight group-hover:text-white/90 transition-colors">
                    {school}
                  </span>
                  <ChevronRight
                    size={12}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: active.accent }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card footer */}
          <div
            className="flex items-center justify-between px-8 py-4 border-t"
            style={{ borderColor: active.accentBorder }}
          >
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Collegy verified listings
            </p>
            <span
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
              style={{ color: active.accent }}
            >
              <ExternalLink size={11} />
              Explore all →
            </span>
          </div>
        </div>

        {/* BOTTOM STAT ROW */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {categories.map((cat, idx) => (
            <SoundWrapper key={cat.id}>
              <button
                onClick={() => handleTabChange(idx)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border bg-zinc-900/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                style={{
                  borderColor:
                    activeTab === idx ? cat.accentBorder : "rgba(255,255,255,0.05)",
                  boxShadow: activeTab === idx ? `0 0 14px ${cat.accentGlow}` : "none",
                }}
              >
                <span style={{ color: cat.accent }}>{cat.icon}</span>
                <span
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: activeTab === idx ? "#fff" : "#52525b" }}
                >
                  {cat.schools.length} schools
                </span>
              </button>
            </SoundWrapper>
          ))}
        </div>

      </div>
    </section>
  );
}
