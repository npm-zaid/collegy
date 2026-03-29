'use client'
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const UPDATES = [
  "🔴 NEW  JEE Main 2025 Session 2 Registration Now Open",
  "🔴 NEW  NEET-UG 2025 Admit Card Released — Download Now",
  "🔴 NEW  CUET (UG) 2026 Important Update for Aspirants",
  "🔴 NEW  Download Model Answer Key for JEE Main Jan Session",
  "🔴 NEW  NIRF Rankings 2025 — IIT Bombay Retains #1 Spot",
  "🔴 NEW  CAT 2025 Registration Begins — Apply Before Deadline",
  "🔴 NEW  Scholarship Portal Now Open for SC/ST Students",
];

export default function NewsBanner() {
  const trackRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (trackRef.current) {
      gsap.to(trackRef.current, { timeScale: 0, duration: 0.4, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      gsap.to(trackRef.current, { timeScale: 1, duration: 0.4, ease: "power2.in" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700&display=swap');

        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        ref={bannerRef}
        className="relative overflow-hidden py-2 bg-[rgb(38,103,255)]"
        
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(38,103,255,1), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(38,103,255,1), transparent)" }}
        />

        <div ref={trackRef} className="marquee-track cursor-pointer select-none">
          {[...UPDATES, ...UPDATES].map((text, i) => (
            <div key={i} className="flex items-center gap-3 px-8 whitespace-nowrap">
              <span
                className="text-white text-xs font-semibold tracking-wide"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {text}
              </span>
              <span className="text-white/30 text-sm">|</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}