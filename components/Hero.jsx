"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";

const NOTIFICATIONS = {
  All: [
    { id: 1, title: "JEE Main 2025 Registration Open",      date: "26 FEB 2026", tag: "Exam" },
    { id: 2, title: "NEET-UG Admit Card Released",           date: "24 FEB 2026", tag: "Admission" },
    { id: 3, title: "Top 10 Engineering Colleges Updated",   date: "22 FEB 2026", tag: "Academics" },
    { id: 4, title: "Scholarship Portal Opens for SC/ST",    date: "20 FEB 2026", tag: "Admission" },
    { id: 5, title: "CUET 2025 Exam Date Announced",         date: "18 FEB 2026", tag: "Exam" },
    { id: 6, title: "IIT Delhi New BTech Program Launched",  date: "15 FEB 2026", tag: "Academics" },
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
    { id: 2, title: "NEET-UG Admit Card Released",          date: "24 FEB 2026", tag: "Admission" },
    { id: 4, title: "Scholarship Portal Opens for SC/ST",   date: "20 FEB 2026", tag: "Admission" },
  ],
};

const TABS = ["All", "Academics", "Exam", "Admission"];

const TAG_STYLES = {
  Exam:      { wrap: "bg-orange-50 text-orange-600",   icon: "stroke-orange-600", badge: "bg-orange-50 text-orange-600" },
  Admission: { wrap: "bg-blue-50 text-blue-600",       icon: "stroke-blue-600",   badge: "bg-blue-50 text-blue-600" },
  Academics: { wrap: "bg-green-50 text-green-600",     icon: "stroke-green-600",  badge: "bg-green-50 text-green-600" },
};

const NEWS_POPUP = [
  { id: 1, headline: "IIT Bombay ranks #1 in NIRF 2025",     time: "2h ago", emoji: "🏆" },
  { id: 2, headline: "JEE Advanced cutoff drops by 8 marks", time: "5h ago", emoji: "📉" },
  { id: 3, headline: "New NIT campus opens in Sikkim",        time: "1d ago", emoji: "🏛️" },
];

const STATS = [
  ["10,000+", "Colleges"],
  ["500+",    "Exams Covered"],
  ["2M+",     "Students Helped"],
];

function TagIcon({ tag }) {
  const cls = TAG_STYLES[tag]?.icon ?? "stroke-green-600";
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
  const heroRef      = useRef(null);
  const titleRef     = useRef(null);
  const subtitleRef  = useRef(null);
  const searchRef    = useRef(null);
  const sidebarRef   = useRef(null);
  const overlayRef   = useRef(null);
  const newsPopupRef = useRef(null);
  const leftRefs     = useRef([]);
  const rightRefs    = useRef([]);

  const [query,       setQuery]       = useState("");
  const [activeTab,   setActiveTab]   = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsOpen,    setNewsOpen]    = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const allFloating = [...leftRefs.current, ...rightRefs.current];
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

  useEffect(() => {
    if (!newsPopupRef.current) return;
    if (newsOpen) {
      newsPopupRef.current.style.display = "block";
      gsap.fromTo(newsPopupRef.current, { opacity: 0, y: 12, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
    } else {
      gsap.to(newsPopupRef.current, { opacity: 0, y: 8, scale: 0.96, duration: 0.2, ease: "power2.in",
        onComplete: () => { if (newsPopupRef.current) newsPopupRef.current.style.display = "none"; } });
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
      `}</style>

      <section
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-20 "
       
      >
      

        {/* LEFT 1 — Avatar dashed ring (top-left) */}
        <div
          ref={el => { leftRefs.current[0] = el; }}
          className="absolute hidden z-10 rounded-full will-change-transform p-2 border-dashed border-2 border-indigo-300"
          style={{ top: "11%", left: "4%", width: 90, height: 90 }}
        >
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="student"
            className="w-full h-full rounded-full object-cover ring-2 ring-white shadow-lg" />
        </div>

        {/* LEFT 2 — College card (mid-left) */}
        <div
          ref={el => { leftRefs.current[1] = el; }}
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

        {/* LEFT 3 — Spark avatar (bottom-left) */}
        <div
          ref={el => { leftRefs.current[2] = el; }}
          className="absolute hidden lg:block z-10 rounded-full will-change-transform"
          style={{ bottom: "25%", left: "8%", width: 76, height: 76 }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-[5px] pointer-events-none">
            {["-rotate-[35deg]", "rotate-0", "rotate-[35deg]"].map((r, j) => (
              <div key={j} className={`w-[3px] h-[18px] bg-gradient-to-br from-[#2667ff] to-[#3f8efc] rounded-full origin-bottom ${r}`} />
            ))}
          </div>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="student"
            className="w-full h-full rounded-full object-cover ring-2 ring-white shadow-md" />
        </div>

        {/* RIGHT 1 — Avatar with ring (top-right) */}
        <div
          ref={el => { rightRefs.current[0] = el; }}
          className="absolute hidden z-10 rounded-full will-change-transform"
          style={{ top: "11%", right: "4%", width: 84, height: 84 }}
        >
          <div className="absolute rounded-full border-[3px] border-gradient-to-br from-[#2667ff] to-[#3f8efc] pointer-events-none" style={{ inset: -10 }} />
          <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="student"
            className="w-full h-full rounded-full object-cover ring-2 ring-white shadow-md" />
        </div>

        {/* RIGHT 2 — News popup trigger (mid-right) */}
        <div
          ref={el => { rightRefs.current[1] = el; }}
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
              <div className="text-[10px] text-gray-400">3 new updates</div>
            </div>
            <svg width="14" height="14" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* News Popup */}
          <div
            ref={newsPopupRef}
            className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden z-60"
            style={{ display: "none" }}
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-800">📰 College News</span>
              <button onClick={() => setNewsOpen(false)} className="text-gray-400 hover:text-red-400 transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            {NEWS_POPUP.map((n) => (
              <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50/60 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                <span className="text-xl mt-0.5">{n.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800 leading-snug">{n.headline}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-2.5 bg-indigo-50/60">
              <button className="text-xs text-indigo-600 font-semibold w-full text-center hover:text-indigo-800 transition-colors">
                View all news →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 3 — Live Updates trigger (bottom-right) */}
        <div
          ref={el => { rightRefs.current[2] = el; }}
          className="absolute  z-10 will-change-transform rotate-6 lg:bottom-[25%] lg:right-[5%] bottom-[5%] right-[2%]"
          
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

        {/* Center content */}
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
            className="text-gray-500  max-w-[580px] mx-auto mb-10 lg:text-lg text-base"
          >
            Explore thousands of colleges, compare programs, check cutoffs, and
            get personalized recommendations — all in one place.
          </p>

          {/* Search bar */}
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
              <SendHorizontal className="lg:hidden text-white"/>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center lg:justify-center justify-between gap-10 mt-9 ">
            {STATS.map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-bold text-[#2667ff] text-xl">{num}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay */}
        <div
          ref={overlayRef}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[3px]"
          style={{ display: "none" }}
        />

        {/* Notification Sidebar */}
        <div
          ref={sidebarRef}
          className="fixed top-0 right-0 h-full z-50 flex-col rounded-tl-3xl rounded-bl-3xl bg-white shadow-[-10px_0_60px_rgba(79,70,229,0.14)] w-[min(420px,92vw)]"
          style={{ display: "none" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-7 pb-4">
            <div>
              <h2 className="font-bold text-[1.2rem] text-indigo-950">Live Updates</h2>
              <p className="text-xs text-gray-400 mt-0.5">Stay ahead with real-time notices</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-6 pb-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab}
                {tab === "All" && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/25">
                    {NOTIFICATIONS["All"].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-3">
                <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="text-sm">Nothing here yet</span>
              </div>
            ) : (
              notifications.map((n) => {
                const ts = TAG_STYLES[n.tag] ?? TAG_STYLES["Academics"];
                return (
                  <div key={n.id}
                    className="group flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 cursor-pointer transition-all duration-200">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ts.wrap}`}>
                      <TagIcon tag={n.tag} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-indigo-700 transition-colors">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
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
                    <svg className="shrink-0 text-gray-300 group-hover:text-indigo-400 transition-colors mt-1" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-100">
            <button className="w-full py-3.5 rounded-2xl text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity bg-gradient-to-br from-indigo-600 to-blue-600 shadow-[0_6px_20px_rgba(79,70,229,0.3)]">
              View Full Portal
            </button>
          </div>
        </div>
      </section>
    </>
  );
}