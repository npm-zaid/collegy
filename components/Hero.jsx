"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";

const NOTIFICATIONS = {
  All: [
    { id: 1, title: "JEE Main 2025 Registration Open",     date: "26 FEB 2026", tag: "Exam" },
    { id: 2, title: "NEET-UG Admit Card Released",          date: "24 FEB 2026", tag: "Admission" },
    { id: 3, title: "Top 10 Engineering Colleges Updated",  date: "22 FEB 2026", tag: "Academics" },
    { id: 4, title: "Scholarship Portal Opens for SC/ST",   date: "20 FEB 2026", tag: "Admission" },
    { id: 5, title: "CUET 2025 Exam Date Announced",        date: "18 FEB 2026", tag: "Exam" },
    { id: 6, title: "IIT Delhi New BTech Program Launched", date: "15 FEB 2026", tag: "Academics" },
  ],
  Academics: [
    { id: 3, title: "Top 10 Engineering Colleges Updated",  date: "22 FEB 2026", tag: "Academics" },
    { id: 6, title: "IIT Delhi New BTech Program Launched", date: "15 FEB 2026", tag: "Academics" },
  ],
  Exam: [
    { id: 1, title: "JEE Main 2025 Registration Open", date: "26 FEB 2026", tag: "Exam" },
    { id: 5, title: "CUET 2025 Exam Date Announced",   date: "18 FEB 2026", tag: "Exam" },
  ],
  Admission: [
    { id: 2, title: "NEET-UG Admit Card Released",        date: "24 FEB 2026", tag: "Admission" },
    { id: 4, title: "Scholarship Portal Opens for SC/ST", date: "20 FEB 2026", tag: "Admission" },
  ],
};

const TABS = ["All", "Academics", "Exam", "Admission"];

const TAG_STYLES = {
  Exam:      { wrap: "bg-orange-50 text-orange-600",  icon: "stroke-orange-600", badge: "bg-orange-100 text-orange-700" },
  Admission: { wrap: "bg-blue-50 text-blue-600",      icon: "stroke-blue-600",   badge: "bg-blue-100 text-blue-700" },
  Academics: { wrap: "bg-emerald-50 text-emerald-600",icon: "stroke-emerald-600",badge: "bg-emerald-100 text-emerald-700" },
};

const ALL_NEWS = [
  { id: 1,  headline: "IIT Bombay ranks #1 in NIRF 2025",           source: "Rankings",    time: "2h ago",  emoji: "🏆", color: "bg-amber-50 text-amber-600" },
  { id: 2,  headline: "JEE Advanced cutoff drops by 8 marks",        source: "JEE",         time: "5h ago",  emoji: "📉", color: "bg-red-50 text-red-500" },
  { id: 3,  headline: "New NIT campus opens in Sikkim",              source: "Rankings",    time: "1d ago",  emoji: "🏛️", color: "bg-indigo-50 text-indigo-500" },
  { id: 4,  headline: "NEET UG 2025 result declared by NTA",         source: "NEET",        time: "1d ago",  emoji: "📋", color: "bg-purple-50 text-purple-600" },
  { id: 5,  headline: "SC/ST scholarship portal closes May 15",      source: "Scholarship", time: "2d ago",  emoji: "📢", color: "bg-green-50 text-green-600" },
  { id: 6,  headline: "DU cutoffs expected to rise 2% this year",    source: "Admission",   time: "3d ago",  emoji: "📈", color: "bg-blue-50 text-blue-600" },
  { id: 7,  headline: "JEE Main session 2 answer key released",      source: "JEE",         time: "4d ago",  emoji: "🔑", color: "bg-orange-50 text-orange-600" },
  { id: 8,  headline: "NEET counselling schedule announced",          source: "NEET",        time: "5d ago",  emoji: "📅", color: "bg-purple-50 text-purple-600" },
  { id: 9,  headline: "PM Vidyalaxmi: 22 lakh beneficiaries aided",  source: "Scholarship", time: "6d ago",  emoji: "🎓", color: "bg-green-50 text-green-600" },
];

const STATS = [
  ["10,000+", "Colleges"],
  ["500+",    "Exams Covered"],
  ["2M+",     "Students Helped"],
];

function TagIcon({ tag }) {
  const cls = TAG_STYLES[tag]?.icon ?? "stroke-emerald-600";
  if (tag === "Exam") return (
    <svg width="15" height="15" fill="none" strokeWidth="2" viewBox="0 0 24 24" className={cls}>
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
  if (tag === "Admission") return (
    <svg width="15" height="15" fill="none" strokeWidth="2" viewBox="0 0 24 24" className={cls}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
  return (
    <svg width="15" height="15" fill="none" strokeWidth="2" viewBox="0 0 24 24" className={cls}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

export default function Hero() {
  const heroRef        = useRef(null);
  const titleRef       = useRef(null);
  const subtitleRef    = useRef(null);
  const searchRef      = useRef(null);
  const sidebarRef     = useRef(null);
  const overlayRef     = useRef(null);
  const newsSidebarRef = useRef(null);
  const newsOverlayRef = useRef(null);
  const leftRefs       = useRef([]);
  const rightRefs      = useRef([]);

  const [query,       setQuery]       = useState("");
  const [activeTab,   setActiveTab]   = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsOpen,    setNewsOpen]    = useState(false);

  // ── Entry animation ──────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const allFloating = [...leftRefs.current, ...rightRefs.current].filter(Boolean);
      gsap.set([titleRef.current, subtitleRef.current, searchRef.current], { opacity: 0, y: 50 });
      gsap.set(allFloating, { opacity: 0, scale: 0.5 });

      gsap.timeline({ delay: 0.1 })
        .to(titleRef.current,    { opacity: 1, y: 0, duration: 0.95, ease: "power3.out" })
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" }, "-=0.6")
        .to(searchRef.current,   { opacity: 1, y: 0, duration: 0.7,  ease: "power2.out" }, "-=0.5")
        .to(allFloating,         { opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.9)", stagger: 0.1 }, "-=0.5");

      allFloating.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : 11,
          rotation: i % 3 === 0 ? -4 : 3,
          duration: 2.5 + i * 0.28,
          repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.22,
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // ── Scroll lock whenever ANY sidebar is open ─────────────────────────────
  // Uses position:fixed trick — works on iOS Safari, Chrome, Firefox, all.
  // Saves & restores scroll position so the page doesn't jump.
  useEffect(() => {
    const isOpen = sidebarOpen || newsOpen;
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top      = `-${scrollY}px`;
      document.body.style.left     = "0";
      document.body.style.right    = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.left     = "";
      document.body.style.right    = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.left     = "";
      document.body.style.right    = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, scrollY);
    };
  }, [sidebarOpen, newsOpen]);

  // ── Notification sidebar animation ───────────────────────────────────────
  useEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;
    if (sidebarOpen) {
      sidebarRef.current.style.display = "flex";
      overlayRef.current.style.display = "block";
      gsap.fromTo(sidebarRef.current,  { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(overlayRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      gsap.to(sidebarRef.current, { x: "100%", opacity: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => { if (sidebarRef.current) sidebarRef.current.style.display = "none"; } });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25,
        onComplete: () => { if (overlayRef.current) overlayRef.current.style.display = "none"; } });
    }
  }, [sidebarOpen]);

  // ── News sidebar animation ───────────────────────────────────────────────
  useEffect(() => {
    if (!newsSidebarRef.current || !newsOverlayRef.current) return;
    if (newsOpen) {
      newsSidebarRef.current.style.display = "flex";
      newsOverlayRef.current.style.display = "block";
      gsap.fromTo(newsSidebarRef.current,  { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(newsOverlayRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      gsap.to(newsSidebarRef.current, { x: "100%", opacity: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => { if (newsSidebarRef.current) newsSidebarRef.current.style.display = "none"; } });
      gsap.to(newsOverlayRef.current, { opacity: 0, duration: 0.25,
        onComplete: () => { if (newsOverlayRef.current) newsOverlayRef.current.style.display = "none"; } });
    }
  }, [newsOpen]);

  const hoverIn  = (e) => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2 });
  const hoverOut = (e) => gsap.to(e.currentTarget, { scale: 1,    duration: 0.2 });

  const notifications = NOTIFICATIONS[activeTab];

  return (
    <>
      <style>{`
        .pulse-ring { animation: pulse-ring 1.4s ease-out infinite; }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── News sidebar card hover lift ── */
        .news-card { transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; }
        .news-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,70,229,0.10); border-color: #c7d2fe; }

        /* ── Notif sidebar card hover ── */
        .notif-card { transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease; }
        .notif-card:hover { transform: translateX(3px); }
      `}</style>

      <section
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-20"
      >

        {/* LEFT 0 — College card */}
        <div
          ref={el => { leftRefs.current[0] = el; }}
          className="absolute hidden lg:block z-10 will-change-transform lg:top-[18%] top-[10%] left-[2.5%] w-[200px]"
        >
          <div className="bg-white rounded-2xl p-3.5 shadow-xl border border-indigo-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#2667ff] to-[#3f8efc]">
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">IIT Bombay</div>
              <div className="text-[10px] text-indigo-500 font-semibold mt-0.5">⭐ 4.9 · Top Ranked</div>
            </div>
          </div>
        </div>

        {/* LEFT 1 — Spark avatar */}
        <div
          ref={el => { leftRefs.current[1] = el; }}
          className="absolute hidden lg:block z-10 rounded-full will-change-transform"
          style={{ bottom: "25%", left: "8%", width: 76, height: 76 }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-[5px] pointer-events-none">
            {["-rotate-[35deg]", "rotate-0", "rotate-[35deg]"].map((r, j) => (
              <div key={j} className={`w-[3px] h-[18px] bg-gradient-to-br from-[#2667ff] to-[#3f8efc] rounded-full origin-bottom ${r}`} />
            ))}
          </div>
          <img src="https://m.media-amazon.com/images/I/51AQb8ZL5HL._UXNaN_FMjpg_QL85_.jpg" alt="student"
            className="w-full h-full rounded-full object-cover ring-2 ring-white shadow-md" />
        </div>

        {/* RIGHT 0 — Latest News trigger */}
        <div
          ref={el => { rightRefs.current[0] = el; }}
          className="absolute hidden lg:block z-20 will-change-transform -rotate-6"
          style={{ top: "18%", right: "3%" }}
        >
          <button
            onClick={() => { setNewsOpen(p => !p); setSidebarOpen(false); }}
            onMouseEnter={hoverIn} onMouseLeave={hoverOut}
            className="relative flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-xl border border-indigo-100 cursor-pointer"
          >
            <span className="absolute -top-1 -right-1 w-4 h-4">
              <span className="pulse-ring absolute inset-0 rounded-full bg-orange-400" />
              <span className="absolute inset-0.5 rounded-full bg-orange-400" />
            </span>
            <span className="text-xl">📰</span>
            <div className="text-left">
              <div className="text-xs font-bold text-gray-800">Latest News</div>
              <div className="text-[10px] text-gray-400">{ALL_NEWS.length} new updates</div>
            </div>
            <svg width="14" height="14" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* RIGHT 1 — Live Updates trigger */}
        <div
          ref={el => { rightRefs.current[1] = el; }}
          className="absolute z-10 will-change-transform rotate-6 lg:bottom-[25%] lg:right-[5%] bottom-[5%] right-[2%]"
        >
          <button
            onClick={() => { setSidebarOpen(p => !p); setNewsOpen(false); }}
            onMouseEnter={hoverIn} onMouseLeave={hoverOut}
            className="relative flex items-center gap-2.5 text-white rounded-2xl px-4 py-3 shadow-[0_8px_28px_rgba(79,70,229,0.4)] cursor-pointer bg-gradient-to-br from-[#2667ff] to-[#3f8efc]"
          >
            <span className="relative">
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-400 rounded-full border-2 border-white text-[8px] font-bold flex items-center justify-center">
                {NOTIFICATIONS["All"].length}
              </span>
            </span>
            <div className="text-left">
              <div className="text-xs font-bold">Live Updates</div>
              <div className="text-[10px] opacity-80">Tap to view</div>
            </div>
          </button>
        </div>

        {/* ── Center content ─────────────────────────────────────────────── */}
        <div className="relative z-20 text-center max-w-[700px] w-full mx-auto">
          <h1
            ref={titleRef}
            className="font-extrabold leading-[1.08] tracking-tight text-indigo-950 mb-[1.1rem] text-[clamp(2.5rem,6vw,4.6rem)]"
          >
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent">
              College
            </span>{" "}
            Journey
          </h1>

          <p
            ref={subtitleRef}
            className="text-gray-500 max-w-[580px] mx-auto mb-10 lg:text-lg text-base"
          >
            Explore thousands of colleges, compare programs, check cutoffs, and
            get personalized recommendations — all in one place.
          </p>

          <div
            ref={searchRef}
            className="flex items-center bg-white rounded-full pl-6 pr-2 py-2 gap-2.5 max-w-[540px] mx-auto shadow-[0_4px_30px_rgba(79,70,229,0.15)] border border-indigo-100 ring-1 ring-indigo-100"
          >
            <svg className="shrink-0 text-indigo-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="e.g. Engineering in Mumbai"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 placeholder:text-gray-400"
            />
            <Link
              href="/explore"
              className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] text-white font-semibold text-[0.95rem] rounded-full px-7 py-3 whitespace-nowrap shadow-[0_4px_16px_rgba(79,70,229,0.35)] hover:opacity-90 hover:scale-[1.04] transition-all duration-150"
            >
              <span className="hidden lg:block text-white">Find Colleges</span>
              <SendHorizontal className="lg:hidden text-white" />
            </Link>
          </div>

          <div className="flex items-center lg:justify-center justify-between gap-10 mt-9">
            {STATS.map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-bold text-[#2667ff] text-xl">{num}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            NOTIFICATION SIDEBAR
        ══════════════════════════════════════════════════════════════════ */}

        {/* Overlay */}
        <div
          ref={overlayRef}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[3px]"
          style={{ display: "none" }}
        />

        {/* Sidebar shell */}
        <div
          ref={sidebarRef}
          className="fixed top-0 right-0 h-full z-50 flex-col bg-white shadow-[-10px_0_60px_rgba(79,70,229,0.14)] w-[min(420px,92vw)]"
          style={{ display: "none", borderRadius: "24px 0 0 24px" }}
          onWheel={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="px-6 pt-7 pb-5 border-b border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2667ff] to-[#3f8efc] flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.35)]">
                  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-[1.1rem] text-gray-900 leading-tight">Live Updates</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Real-time exam & college notices</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 mt-0.5"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Badge count */}
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                {NOTIFICATIONS["All"].length} active notices
              </span>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-2 px-5 py-3 overflow-x-auto no-scrollbar border-b border-gray-100/80">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-br from-[#2667ff] to-[#3f8efc] text-white shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab}
                {tab === "All" && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {NOTIFICATIONS["All"].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── List (overflowY scroll lives HERE, not on body) ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-2 overscroll-contain"
            onWheel={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}
          >
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-3">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="text-sm">Nothing here yet</span>
              </div>
            ) : (
              notifications.map((n) => {
                const ts = TAG_STYLES[n.tag] ?? TAG_STYLES["Academics"];
                return (
                  <div
                    key={n.id}
                    className="notif-card group flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ts.wrap}`}>
                      <TagIcon tag={n.tag} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 leading-snug group-hover:text-indigo-700 transition-colors">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                          </svg>
                          {n.date}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ts.badge}`}>
                          {n.tag}
                        </span>
                      </div>
                    </div>
                    <svg className="shrink-0 text-gray-300 group-hover:text-indigo-400 transition-colors mt-1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60">
            <button className="w-full py-3 rounded-2xl text-white font-bold text-[13px] tracking-wide hover:opacity-90 active:scale-[0.98] transition-all bg-gradient-to-r from-[#2667ff] to-[#3f8efc] shadow-[0_4px_16px_rgba(79,70,229,0.3)]">
              View Full Portal →
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            NEWS SIDEBAR
        ══════════════════════════════════════════════════════════════════ */}

        {/* Overlay */}
        <div
          ref={newsOverlayRef}
          onClick={() => setNewsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[3px]"
          style={{ display: "none" }}
        />

        {/* Sidebar shell */}
        <div
          ref={newsSidebarRef}
          className="fixed top-0 right-0 h-full z-50 flex-col bg-white shadow-[-10px_0_60px_rgba(79,70,229,0.14)] w-[min(420px,92vw)]"
          style={{ display: "none", borderRadius: "24px 0 0 24px" }}
          onWheel={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="px-6 pt-7 pb-5 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.35)]">
                  <span className="text-lg">📰</span>
                </div>
                <div>
                  <h2 className="font-bold text-[1.1rem] text-gray-900 leading-tight">Latest News</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">College & exam updates</p>
                </div>
              </div>
              <button
                onClick={() => setNewsOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 mt-0.5"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Live badge */}
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block animate-pulse" />
                {ALL_NEWS.length} stories today
              </span>
            </div>
          </div>

          {/* ── News list (scrollable) ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain"
            onWheel={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}
          >
            {ALL_NEWS.map((n, i) => (
              <div
                key={n.id}
                className="news-card group flex items-start gap-3.5 p-4 rounded-2xl border border-gray-100 cursor-pointer bg-white"
              >
                {/* Rank number */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${n.color} shrink-0`}>
                    {n.emoji}
                  </div>
                  <span className="text-[10px] font-bold text-gray-300">#{i + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 leading-snug group-hover:text-indigo-700 transition-colors">
                    {n.headline}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Source pill */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${n.color}`}>
                      {n.source}
                    </span>
                    {/* Time */}
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                      {n.time}
                    </span>
                  </div>
                </div>

                <svg className="shrink-0 text-gray-300 group-hover:text-indigo-400 transition-colors mt-1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60">
            <button className="w-full py-3 rounded-2xl text-white font-bold text-[13px] tracking-wide hover:opacity-90 active:scale-[0.98] transition-all bg-gradient-to-r from-orange-400 to-rose-500 shadow-[0_4px_16px_rgba(249,115,22,0.3)]">
              Open News Portal →
            </button>
          </div>
        </div>

      </section>
    </>
  );
}