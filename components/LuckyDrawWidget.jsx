"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { X, Gift, Sparkles, Ticket } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  NOTE ON INTEGRATION                                                */
/*  ScrollTrigger needs two anchor points in your real page to know    */
/*  when to show/hide the button. The safest way (works regardless of  */
/*  each section's internal markup) is to drop two empty marker divs   */
/*  around the section range in Home.js:                               */
/*                                                                      */
/*    <div id="lucky-draw-start" />                                    */
/*    <StudentWallOfProof />                                           */
/*    <AdmissionModes />                                                */
/*    <NewsCuttings />                                                  */
/*    <ExpertsReview />                                                 */
/*    <Awards />                                                        */
/*    <WhyChooseUs />                                                   */
/*    <div id="lucky-draw-end" />                                       */
/*                                                                      */
/*  Then just render <LuckyDrawWidget /> once, anywhere in the page    */
/*  (it's `fixed`, so position in the tree doesn't matter).             */
/* ------------------------------------------------------------------ */

const GIFT_IMG =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f381.png";

const PRIZES = [
  { label: "10% OFF\nPremium", color: "#2667ff", text: "#ffffff", weight: 2 },
  { label: "Free Career\nReport", color: "#0e1730", text: "#ffffff", weight: 2 },
  { label: "1 Free\nSession", color: "#3f8efc", text: "#ffffff", weight: 1 },
  { label: "Try\nAgain", color: "#e4e4e7", text: "#3f3f46", weight: 3 },
  { label: "5% OFF\nPredictor", color: "#0e1730", text: "#ffffff", weight: 2 },
  { label: "20% OFF\nCombo", color: "#2667ff", text: "#ffffff", weight: 1 },
];
const SEGMENT_ANGLE = 360 / PRIZES.length;

function pickWeightedIndex() {
  const total = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return i;
  }
  return PRIZES.length - 1;
}

/* ---------------------------- Confetti ----------------------------- */
function Confetti({ fire }) {
  const pieces = useRef([]);
  const colors = ["#2667ff", "#3f8efc", "#0e1730", "#ffd166", "#ffffff"];

  useEffect(() => {
    if (!fire) return;
    pieces.current.forEach((el) => {
      if (!el) return;
      const angle = gsap.utils.random(-100, -80);
      const distance = gsap.utils.random(140, 260);
      const rad = (angle * Math.PI) / 180;
      gsap.fromTo(
        el,
        { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 },
        {
          x: Math.cos(rad) * distance * gsap.utils.random(-1, 1),
          y: Math.sin(rad) * distance,
          rotate: gsap.utils.random(-360, 360),
          opacity: 0,
          scale: gsap.utils.random(0.4, 1),
          duration: gsap.utils.random(1, 1.6),
          ease: "power2.out",
          delay: gsap.utils.random(0, 0.15),
        }
      );
    });
  }, [fire]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          ref={(el) => (pieces.current[i] = el)}
          className="absolute w-2 h-2 rounded-sm opacity-0"
          style={{ background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

/* ---------------------------- Wheel Popup ---------------------------- */
function LuckyDrawPopup({ onClose }) {
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [resultIndex, setResultIndex] = useState(null);
  const [confettiFire, setConfettiFire] = useState(false);

  const wheelRef = useRef(null);
  const cardRef = useRef(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }
    );
  }, []);

  const handleSpin = () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setConfettiFire(false);

    const idx = pickWeightedIndex();
    const segmentMid = idx * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const extraSpins = 6;
    const target =
      rotationRef.current +
      extraSpins * 360 +
      (360 - segmentMid) -
      (rotationRef.current % 360);

    gsap.to(wheelRef.current, {
      rotation: target,
      duration: 4.2,
      ease: "power4.out",
      onComplete: () => {
        rotationRef.current = target;
        setSpinning(false);
        setHasSpun(true);
        setResultIndex(idx);
        setConfettiFire(true);
        gsap.fromTo(
          ".result-reveal",
          { y: 16, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }
        );
      },
    });
  };

  const handleClose = () => {
    gsap.to(cardRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.94,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const won = resultIndex !== null && PRIZES[resultIndex].label !== "Try\nAgain";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        ref={cardRef}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 border border-zinc-100 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#2667ff]/10 blur-[90px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#3f8efc]/10 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
          aria-label="Close"
        >
          <X size={16} className="text-zinc-600" />
        </button>

        <div className="relative z-10 pt-10 pb-9 px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 mb-4">
            <Ticket size={13} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              One Spin, One Reward
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 text-center leading-[0.95] mb-1">
            Your Lucky <span className="italic text-[#2667ff]">Draw</span>
          </h2>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-8 text-center">
            Spin once to unlock a reward
          </p>

          <div className="relative w-[280px] h-[280px] mb-8">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderTop: "20px solid #0e1730",
                  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
                }}
              />
            </div>

            <div className="absolute inset-0 rounded-full bg-zinc-900 shadow-xl" />

            <div
              ref={wheelRef}
              className="absolute inset-[8px] rounded-full overflow-hidden"
              style={{
                background: `conic-gradient(${PRIZES.map(
                  (p, i) =>
                    `${p.color} ${i * SEGMENT_ANGLE}deg ${
                      (i + 1) * SEGMENT_ANGLE
                    }deg`
                ).join(", ")})`,
                transformOrigin: "50% 50%",
              }}
            >
              {PRIZES.map((p, i) => {
                const mid = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 flex justify-center"
                    style={{ transform: `rotate(${mid}deg)` }}
                  >
                    <span
                      className="mt-[22px] text-[10px] font-black uppercase leading-tight text-center whitespace-pre-line"
                      style={{
                        color: p.text,
                        width: "70px",
                        transform: "rotate(90deg)",
                      }}
                    >
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-[#2667ff]">
                <img src={GIFT_IMG} alt="Gift" className="w-8 h-8" />
              </div>
            </div>

            <Confetti fire={confettiFire} />
          </div>

          {!hasSpun ? (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="w-full bg-[#2667ff] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-zinc-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              
              {spinning ? "Spinning..." : "Spin the Wheel"}
            </button>
          ) : (
            <div className="result-reveal w-full text-center">
              {won ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift size={18} className="text-[#2667ff]" />
                    <p className="text-sm font-black uppercase tracking-widest text-[#2667ff]">
                      You Won!
                    </p>
                  </div>
                  <p className="text-2xl font-black tracking-tight text-zinc-900 mb-5 italic">
                    {PRIZES[resultIndex].label.replace("\n", " ")}
                  </p>
                  <button className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-[#2667ff] transition-all">
                    Claim Reward
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-black tracking-tight text-zinc-700 mb-5">
                    So close — better luck next time!
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-zinc-100 text-zinc-600 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition-all"
                  >
                    Continue Browsing
                  </button>
                </>
              )}
            </div>
          )}

          <p className="text-zinc-300 font-bold text-[10px] uppercase tracking-widest mt-6 text-center">
            One spin per user &middot; Terms apply
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Scroll-triggered FAB ------------------------- */
export default function LuckyDrawWidget({
  startId = "lucky-draw-start",
  endId = "lucky-draw-end",
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const btnRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    let ScrollTrigger;
    let st;
    let glowTween;

    (async () => {
      const mod = await import("gsap/ScrollTrigger");
      ScrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const startEl = document.getElementById(startId);
      const endEl = document.getElementById(endId);

      // Start hidden, slightly scaled down (pure fade + zoom, no slide)
      gsap.set(btnRef.current, { opacity: 0, scale: 0.5, pointerEvents: "none" });

      const showBtn = () => {
        gsap.to(btnRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.8)",
          pointerEvents: "auto",
        });
      };
      const hideBtn = () => {
        gsap.to(btnRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.35,
          ease: "power2.in",
          pointerEvents: "none",
        });
      };

      if (startEl && endEl) {
        st = ScrollTrigger.create({
          trigger: startEl,
          start: "top center",
          endTrigger: endEl,
          end: "bottom center",
          onEnter: showBtn,
          onEnterBack: showBtn,
          onLeave: hideBtn,
          onLeaveBack: hideBtn,
        });
      }

      // gentle pulsing glow ring while idle
      glowTween = gsap.to(glowRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.6,
        repeat: -1,
        ease: "power1.out",
      });
    })();

    return () => {
      st?.kill();
      glowTween?.kill();
    };
  }, [startId, endId]);

  return (
    <>
      <div className="fixed right-8 bottom-8 z-[60] flex items-center justify-end group">
        {/* Tooltip sits to the left of the circle, hover-only, not part of the scroll entrance anim */}
        <span className="mr-3 bg-zinc-900 text-white text-[11px] font-bold px-3 py-2 rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
          Spin & Win 🎁
        </span>

        {/* Only THIS circle fades + zooms in/out on scroll */}
        <div ref={btnRef} className="relative w-14 h-14 shrink-0">
          <span
            ref={glowRef}
            className="absolute inset-0 rounded-full bg-[#2667ff]"
          />
          <button
            onClick={() => setPopupOpen(true)}
            className="relative w-14 h-14 rounded-full bg-[#2667ff] shadow-xl shadow-[#2667ff]/30 flex items-center justify-center hover:bg-zinc-900 transition-colors"
            aria-label="Open Lucky Draw"
          >
            <img src={GIFT_IMG} alt="" className="w-7 h-7" />
          </button>
        </div>
      </div>

      {popupOpen && <LuckyDrawPopup onClose={() => setPopupOpen(false)} />}
    </>
  );
}