"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, Star, ExternalLink, Award, Sparkles } from "lucide-react";

const EXPERTS_REVIEW = [
  { id: 1,  name: "Vikas B.",     title: "Education Expert",  detail: "MBA · 8 Years",  rating: 4.8, image: "/assets/vikas.jpeg",  tag: "Top Rated" },
  { id: 2,  name: "Sarthak Garg",    title: "Sr. Mentor",        detail: "MCA · 6 Years",  rating: 4.7, image: "https://images.unsplash.com/photo-14799645785-5658abf4ff4e?q=80&w=00",  tag: "Popular" },
  { id: 3,  name: "Sakshi Rajput",   title: "Sr. Mentor",        detail: "M.Com · 5 Years", rating: 4.5, image: "https://images.unsplash.com/photo-157496359142-b8d87734a5a2?q=80&w=40", tag: "New" },
  { id: 4,  name: "Manish Thapliyal",title: "Sr. Mentor",        detail: "MA · 6 Years",   rating: 4.6, image: "https://images.unsplash.com/photo-1519853653-af0119f7cbe7?q=80&w=400",  tag: "Popular" },
  { id: 5,  name: "Ananya Iyer",     title: "Career Coach",      detail: "M.Sc · 7 Years", rating: 4.9, image: "https://images.unsplash.com/photo-15804994461-15a19d654956?q=80&=00",  tag: "Top Rated" },
  { id: 6,  name: "Vikram Seth",     title: "Admissions Head",   detail: "PhD · 12 Years", rating: 4.8, image: "https://images.unsplash.com/photo-150700321169-0a1dd7228f2d?q=80&w=400",  tag: "Expert" },
  { id: 7,  name: "Priya Sharma",    title: "Global Advisor",    detail: "MBA · 4 Years",  rating: 4.7, image: "https://images.unsplash.com/photo-156753239604-b6c5b0ad2e01?q=80w=400",  tag: "New" },
  { id: 8,  name: "Karan Oberoi",    title: "Tech Mentor",       detail: "M.Tech · 9 Years",rating: 4.6, image: "https://images.unsplash.com/photo-150064867791-00dcc994a43e?q=80w=400", tag: "Popular" },
  { id: 9,  name: "Meera Das",       title: "Counselor",         detail: "MSW · 10 Years", rating: 4.5, image: "https://images.unsplash.com/photo-159855874175-4d0fe4a2c90b?q=80&=400",  tag: "Expert" },
  { id: 10, name: "Arjun Verma",     title: "Strategy Lead",     detail: "PGDM · 15 Years",rating: 4.9, image: "https://images.unsplash.com/photo-151934518560-3f2917c472ef?q=80&=400",  tag: "Top Rated" },
];

const TAG_STYLES = {
  "Top Rated": "bg-amber-50 text-amber-700 border-amber-200",
  "Popular":   "bg-blue-50 text-blue-700 border-blue-200",
  "Expert":    "bg-violet-50 text-violet-700 border-violet-200",
  "New":       "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// Stars rendered as filled/half/empty
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < full
              ? "text-amber-400 fill-amber-400"
              : i === full && hasHalf
              ? "text-amber-400 fill-amber-200"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
    </div>
  );
}

// Individual expert card
function ExpertCard({ expert, index }) {
  const cardRef = useRef(null);
  const imgRef  = useRef(null);
  const ctaRef  = useRef(null);

  const onEnter = useCallback(() => {
    gsap.to(cardRef.current, { y: -10, scale: 1.02, duration: 0.4, ease: "power3.out" });
    gsap.to(imgRef.current,  { scale: 1.08, duration: 0.6, ease: "power2.out" });
    gsap.to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.5)" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(imgRef.current,  { scale: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(ctaRef.current,  { opacity: 0, y: 16, duration: 0.25, ease: "power2.in" });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative rounded-[28px] overflow-hidden border border-slate-100 will-change-transform cursor-pointer"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          ref={imgRef}
          src={expert.image}
          alt={expert.name}
          className="w-full h-full object-cover object-top"
        />

        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Tag pill — top left */}
        <div className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm bg-white/80 ${TAG_STYLES[expert.tag]}`}>
          {expert.tag}
        </div>

        {/* Rating — top right */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl shadow-sm">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-[12px] font-black text-slate-900">{expert.rating}</span>
        </div>

        {/* CTA overlay — slides up on hover */}
        <div
          ref={ctaRef}
          className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0"
          style={{ transform: "translateY(16px)" }}
        >
          <button className="flex items-center gap-2 bg-[#2667ff] text-white px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-[0_8px_24px_rgba(38,103,255,0.5)] hover:bg-[#1a56e8] transition-colors">
            Consult Now <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-[14px] font-black text-slate-900 leading-tight">{expert.name}</h4>
          <Award size={14} className="text-[#2667ff] shrink-0 mt-0.5 opacity-60" />
        </div>
        <p className="text-[11px] font-bold text-[#2667ff] uppercase tracking-widest mb-2.5">{expert.title}</p>
        <div className="flex items-center justify-between">
          <StarRating rating={expert.rating} />
          <span className="text-[10px] text-slate-400 font-semibold">{expert.detail}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExpertsReview() {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const gridRef = useRef(null);

  // Responsive visible count
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640)       setVisibleCount(1);
      else if (w < 900)  setVisibleCount(2);
      else if (w < 1200) setVisibleCount(3);
      else               setVisibleCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = EXPERTS_REVIEW.length - visibleCount;

  const animateSlide = useCallback((direction, newIndex) => {
    if (isAnimating || !gridRef.current) return;
    setIsAnimating(true);

    const xOut = direction === "next" ? -40 : 40;
    const cards = gridRef.current.querySelectorAll("[data-card]");

    gsap.to(cards, {
      x: xOut, opacity: 0, duration: 0.22, ease: "power2.in", stagger: 0.04,
      onComplete: () => {
        setStartIndex(newIndex);
        requestAnimationFrame(() => {
          const newCards = gridRef.current?.querySelectorAll("[data-card]");
          if (!newCards) return;
          gsap.fromTo(
            newCards,
            { x: -xOut, opacity: 0, scale: 0.95 },
            { x: 0, opacity: 1, scale: 1, duration: 0.38, ease: "expo.out", stagger: 0.06,
              onComplete: () => setIsAnimating(false) }
          );
        });
      },
    });
  }, [isAnimating]);

  const handleNext = () => {
    if (isAnimating) return;
    const next = startIndex >= maxIndex ? 0 : startIndex + 1;
    animateSlide("next", next);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    const prev = startIndex <= 0 ? maxIndex : startIndex - 1;
    animateSlide("prev", prev);
  };

  const handleDot = (i) => {
    if (isAnimating || i === startIndex) return;
    animateSlide(i > startIndex ? "next" : "prev", i);
  };

  const visible = EXPERTS_REVIEW.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">

     
      <div className="max-w-7xl mx-auto relative">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#2667ff]/8 border border-[#2667ff]/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={13} className="text-[#2667ff]" />
              <span className="text-[#2667ff] font-bold uppercase tracking-[0.2em] text-[10px]">Academic Council</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Right Guidance from{" "}
              <span className="relative inline-block">
                <span className="text-[#2667ff]">Experts</span>
                {/* Underline squiggle */}
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                  <path d="M0,3 Q25,0 50,3 Q75,6 100,3" stroke="#2667ff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-md">
              Connect with India's top education mentors who've helped 2M+ students find their perfect college.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Slide counter */}
            <span className="text-xs font-bold text-slate-400 tabular-nums mr-1">
              {String(startIndex + 1).padStart(2, "0")} / {String(maxIndex + 1).padStart(2, "0")}
            </span>
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#2667ff] hover:text-[#2667ff] hover:bg-[#2667ff]/5 transition-all duration-200 active:scale-90 disabled:opacity-40"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#2667ff] flex items-center justify-center text-white hover:bg-[#1a56e8] hover:shadow-[0_8px_24px_rgba(38,103,255,0.45)] transition-all duration-200 active:scale-90 disabled:opacity-40"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div
          ref={gridRef}
          className="grid gap-5 sm:gap-6"
          style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
        >
          {visible.map((expert, i) => (
            <div key={`${expert.id}-${startIndex}`} data-card="1">
              <ExpertCard expert={expert} index={i} />
            </div>
          ))}
        </div>

        {/* ── Dot pagination ── */}
        <div className="mt-10 sm:mt-14 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              className={`rounded-full transition-all duration-300 ${
                i === startIndex
                  ? "w-7 h-2 bg-[#2667ff]"
                  : "w-2 h-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        {/* <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#2667ff]/6 to-indigo-50/60 border border-[#2667ff]/15 rounded-3xl px-6 sm:px-8 py-5 sm:py-6">
          <div>
            <p className="font-black text-slate-900 text-base sm:text-lg">Not sure which expert to pick?</p>
            <p className="text-slate-400 text-sm mt-0.5">Get matched with the right mentor in under 2 minutes.</p>
          </div>
          <button className="shrink-0 flex items-center gap-2 bg-[#2667ff] text-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_4px_18px_rgba(38,103,255,0.38)] hover:bg-[#1a56e8] hover:shadow-[0_8px_28px_rgba(38,103,255,0.5)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 whitespace-nowrap">
            Find My Expert
            <ChevronRight size={16} />
          </button>
        </div> */}

      </div>
    </section>
  );
}