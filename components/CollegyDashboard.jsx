"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from "next/navigation";

import {
  Search,
  Sparkles,
  Radio,
  ArrowUpRight,
  MapPin,
  Star,
  Trophy,
  Award,
  Video,
  Users,
  Clock,
  Play,
  CalendarDays,
  BookOpen,
  Mic,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const aiMatches = [
  { name: "IIT Bombay",      location: "Mumbai",      score: 98, type: "Engineering" },
  { name: "BITS Pilani",     location: "Rajasthan",   score: 94, type: "Science"     },
  { name: "NIT Trichy",      location: "Tamil Nadu",  score: 91, type: "Engineering" },
  { name: "Delhi University",location: "Delhi",       score: 87, type: "Arts"        },
];

const topColleges = [
  { name: "IIT Bombay",      rank: "#1", rating: "9.8", color: "bg-[#3D6BE8]", location: "Mumbai"    },
  { name: "IIT Delhi",       rank: "#2", rating: "9.6", color: "bg-[#5B7FEE]", location: "Delhi"     },
  { name: "IISc Bangalore",  rank: "#3", rating: "9.5", color: "bg-[#2B59D9]", location: "Bangalore" },
  { name: "IIT Madras",      rank: "#4", rating: "9.3", color: "bg-[#3D6BE8]", location: "Chennai"   },
  { name: "BITS Pilani",     rank: "#5", rating: "9.1", color: "bg-[#7C88F0]", location: "Rajasthan" },
  { name: "IIT Kharagpur",   rank: "#6", rating: "9.0", color: "bg-[#4F6FE8]", location: "WB"        },
];

const featuredColleges = [
  { name: "Ashoka University",  tag: "Liberal Arts", fee: "₹12L/yr", color: "bg-[#3D6BE8]" },
  { name: "Manipal Institute",  tag: "Engineering",  fee: "₹8L/yr",  color: "bg-[#818CF8]" },
  { name: "Christ University",  tag: "Commerce",     fee: "₹3L/yr",  color: "bg-[#34D399]" },
  { name: "Symbiosis Pune",     tag: "Management",   fee: "₹15L/yr", color: "bg-[#F59E0B]" },
];

// Row 1 — scrolls LEFT
const webinarRow1 = [
  { id: 1,  title: "IIT JEE 2025 Strategy",     host: "Dr. Ramesh Kumar",    status: "LIVE",     viewers: "1.2K watching",  time: "Live now",           icon: "🎯" },
  { id: 2,  title: "NEET Prep Masterclass",      host: "Prof. Ananya Singh",  status: "UPCOMING", viewers: "850 registered", time: "Today · 5:00 PM",    icon: "🔬" },
  { id: 3,  title: "College Application Tips",   host: "Aditi Sharma",        status: "UPCOMING", viewers: "620 registered", time: "Tomorrow · 3:00 PM", icon: "📝" },
  { id: 4,  title: "Scholarship Guide 2025",     host: "Rahul Mehta",         status: "RECORDED", viewers: "3.4K views",     time: "Watch anytime",      icon: "🏆" },
  { id: 5,  title: "Engineering Career Paths",   host: "Vikram Nair",         status: "UPCOMING", viewers: "530 registered", time: "Sat · 11:00 AM",     icon: "⚙️" },
];

// Row 2 — scrolls RIGHT
const webinarRow2 = [
  { id: 6,  title: "MBA Admissions 2025",        host: "Priya Khanna",        status: "UPCOMING", viewers: "920 registered", time: "Today · 7:00 PM",    icon: "💼" },
  { id: 7,  title: "CUET Strategy Session",      host: "Dr. Suresh Iyer",     status: "LIVE",     viewers: "2.1K watching",  time: "Live now",           icon: "📚" },
  { id: 8,  title: "Study Abroad 101",           host: "Neha Bose",           status: "RECORDED", viewers: "5.6K views",     time: "Watch anytime",      icon: "✈️" },
  { id: 9,  title: "Financial Aid & Loans",      host: "Arjun Sethi",         status: "UPCOMING", viewers: "410 registered", time: "Sun · 4:00 PM",      icon: "💰" },
  { id: 10, title: "Law School Journey",         host: "Kavya Menon",         status: "UPCOMING", viewers: "340 registered", time: "Mon · 6:00 PM",      icon: "⚖️" },
];

// ─── WebinarCard sub-component (used in both marquee rows) ───────────────────

const WebinarCard = ({ webinar }) => {
  const isLive     = webinar.status === "LIVE";
  const isUpcoming = webinar.status === "UPCOMING";
  const isRecorded = webinar.status === "RECORDED";

  return (
    <div className="w-64 shrink-0 bg-white rounded-[2rem] p-5 border-2  border-[#3D6BE8]/50 transition-all shadow-lg">
      {/* Top: icon + status badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0 mr-2">
          <span className="text-xl shrink-0 mt-0.5">{webinar.icon}</span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-zinc-900 leading-tight line-clamp-2">
              {webinar.title}
            </p>
            <p className="text-[9px] text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
              <Mic size={7} />
              {webinar.host}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black shrink-0 ${
            isLive
              ? "bg-red-100 text-red-500"
              : isUpcoming
              ? "bg-[#3D6BE8]/10 text-[#3D6BE8]"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
          )}
          {isUpcoming && <CalendarDays size={8} />}
          {isRecorded  && <Play size={8} />}
          {webinar.status}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-[9px] text-zinc-400">
          <span className="flex items-center gap-0.5"><Users size={8} /> {webinar.viewers}</span>
          <span className="flex items-center gap-0.5"><Clock size={8} /> {webinar.time}</span>
        </div>
        <button
          className={`px-2.5 py-1 rounded-full text-[9px] font-black transition-all hover:opacity-85 ${
            isLive
              ? "bg-red-500 text-white"
              : isUpcoming
              ? "bg-[#3D6BE8] text-white"
              : "bg-zinc-900 text-white"
          }`}
        >
          {isLive ? "Join" : isUpcoming ? "Register" : "Watch"}
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CollegyDashboard = () => {
  const containerRef       = useRef(null);
  const topCollegeTrackRef = useRef(null);
  const featuredTrackRef   = useRef(null);
  const webinarRow1Ref     = useRef(null);
  const webinarRow2Ref     = useRef(null);
  const router             = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Card 1 · Scan line ──────────────────────────────────────────────
      gsap.to(".scan-line", {
        top: "100%",
        duration: 3,
        repeat: -1,
        ease: "sine.inOut",
        yoyo: true,
      });

      // ── Card 2 · Top colleges vertical scroll ───────────────────────────
      if (topCollegeTrackRef.current) {
        const h = topCollegeTrackRef.current.offsetHeight / 2;
        gsap.to(topCollegeTrackRef.current, {
          y: -h,
          duration: 11,
          ease: "none",
          repeat: -1,
        });
      }

      // ── Card 3 · Featured colleges vertical scroll ──────────────────────
      if (featuredTrackRef.current) {
        const h = featuredTrackRef.current.offsetHeight / 2;
        gsap.to(featuredTrackRef.current, {
          y: -h,
          duration: 11,
          ease: "none",
          repeat: -1,
        });
      }

      // ── Card 4 · Horizontal marquee — row 1 scrolls LEFT, row 2 scrolls RIGHT ──
      if (webinarRow1Ref.current) {
        const w = webinarRow1Ref.current.scrollWidth / 2;
        gsap.to(webinarRow1Ref.current, {
          x: -w,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
      }

      if (webinarRow2Ref.current) {
        const w = webinarRow2Ref.current.scrollWidth / 2;
        gsap.fromTo(
          webinarRow2Ref.current,
          { x: -w },
          { x: 0, duration: 34, ease: "none", repeat: -1 }
        );
      }

      // LIVE badge pulse rings (both rows)
      gsap.to(".live-ring", {
        scale:   2.2,
        opacity: 0,
        duration: 1.1,
        repeat:  -1,
        ease:    "power2.out",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="min-h-screen  p-6 lg:p-12 text-zinc-900 selection:bg-[#3D6BE8]/30 overflow-x-hidden"
    >
      {/* ── HEADER ── */}
      <div className="relative mb-10 mt-16 flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D6BE8]/10 border border-[#3D6BE8]/20 mb-4">
          <Sparkles size={14} className="text-[#3D6BE8]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3D6BE8]">
            Next-Gen Solutions
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-center leading-[0.8] mb-4">
          <span className="text-zinc-900">Our </span>
          <span className="bg-gradient-to-r from-[#3D6BE8] via-[#818CF8] to-[#3D6BE8] bg-clip-text text-transparent italic pr-3">
            Dashboard
          </span>
        </h1>
        <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#3D6BE8] rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ══════════════════════════════════════════════════════════════════
            CARD 1 · AI COLLEGE SEARCH  (col-span-8)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 group relative bg-[#3D6BE8]/10 rounded-[3rem] p-8 border-2 border-zinc-100 shadow-2xl shadow-black/20 overflow-hidden">

          <div className="relative z-10">
            {/* Title row */}
            <div className="flex items-center gap-4 mb-16">
              <div className="p-3 bg-zinc-900 rounded-2xl">
                <Search size={20} className="text-[#3D6BE8]" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  Match-Engine v2
                </h2>
                <p className="text-xl font-bold">AI College Search</p>
              </div>
            </div>

            {/* Hero copy */}
            <div className="relative mb-12">
              <h3 className="text-5xl font-black tracking-tighter leading-[0.9] mb-8">
                Find your <br />
                <span className="text-zinc-700 italic line-through decoration-[#3D6BE8] decoration-4">
                  random
                </span>{" "}
                <br />
                <span className="text-[#3D6BE8]">dream</span> college.
              </h3>
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-2 rounded-[2rem] w-fit pr-6 focus-within:border-[#3D6BE8] transition-all">
                <div className="bg-[#3D6BE8] p-4 rounded-full shadow-sm text-white">
                  <Sparkles size={20} />
                </div>
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push("/find/ai-search");
                  }}
                  className="bg-transparent border-none outline-none text-zinc-800 font-medium placeholder:text-zinc-400 w-1/2 sm:w-64"
                  placeholder="e.g. Engineering in Mumbai…"
                />
              </div>
            </div>
          </div>

          {/* ── Right panel: AI matches ── */}
          <div className="absolute right-6 top-10 w-[38%] h-[85%] bg-white rounded-[3rem] border border-zinc-100 shadow-xl overflow-hidden hidden md:block">
            <div className="scan-line absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-[#3D6BE8]/25 to-transparent border-t-2 border-[#3D6BE8] z-20" />
            <div className="p-4 ">
              <div className="flex justify-between items-center mb-8 mt-4">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  AI Matches
                </span>
                <span className="text-[10px] font-bold text-[#3D6BE8] px-2 py-0.5 bg-[#3D6BE8]/10 rounded-full">
                  AI Optimised
                </span>
              </div>

              {aiMatches.map((college, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[#3D6BE8]/08 p-3 rounded-2xl border border-transparent hover:border-zinc-100 transition-colors hover:bg-zinc-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-[#3D6BE8] font-black text-xs shrink-0">
                    {college.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-zinc-900 truncate">{college.name}</p>
                    <p className="text-[9px] text-zinc-400">
                      {college.location} · {college.type}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3D6BE8]"
                          style={{ width: `${college.score}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-[#3D6BE8]">
                        {college.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CARD 2 · TOP COLLEGES SCROLL LIST  (col-span-4, dark)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 bg-[#1A1A1A] rounded-[3rem] p-8 border-2 border-[#3D6BE8] text-white relative overflow-hidden shadow-2xl h-[480px]">

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#3D6BE8] rounded-2xl">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter">Top Colleges</h3>
                <p className="text-[10px] text-[#3D6BE8] font-bold uppercase tracking-widest">
                  2025 Rankings
                </p>
              </div>
            </div>
            <Radio size={16} className="text-[#3D6BE8] animate-pulse" />
          </div>

          {/* Scrolling list */}
          <div className="relative h-[330px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
            <div ref={topCollegeTrackRef} className="space-y-3">
              {[...topColleges, ...topColleges].map((college, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/15 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${college.color} rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0`}
                  >
                    {college.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{college.name}</p>
                    <p className="text-[10px] text-white/40 flex items-center gap-1">
                      <MapPin size={8} />
                      {college.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={10} className="text-[#3D6BE8] fill-[#3D6BE8]" />
                    <span className="text-xs font-black text-[#3D6BE8]">{college.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#3D6BE8 0.5px, transparent 0.5px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CARD 3 · FEATURED COLLEGES SCROLL  (col-span-4)
        ══════════════════════════════════════════════════════════════════ */}
              <div className="lg:col-span-4 bg-[#1A1A1A] rounded-[3rem] p-8 border-2 border-[#3D6BE8] text-white relative overflow-hidden shadow-2xl h-[480px]">

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#3D6BE8] rounded-2xl">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter">Featured Colleges</h3>
                <p className="text-[10px] text-[#3D6BE8] font-bold uppercase tracking-widest">
                  2025 Rankings
                </p>
              </div>
            </div>
            <Radio size={16} className="text-[#3D6BE8] animate-pulse" />
          </div>

          {/* Scrolling list */}
          <div className="relative h-[330px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
            <div ref={featuredTrackRef} className="space-y-3">
              {[...topColleges, ...topColleges].map((college, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/15 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${college.color} rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0`}
                  >
                    {college.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{college.name}</p>
                    <p className="text-[10px] text-white/40 flex items-center gap-1">
                      <MapPin size={8} />
                      {college.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={10} className="text-[#3D6BE8] fill-[#3D6BE8]" />
                    <span className="text-xs font-black text-[#3D6BE8]">{college.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#3D6BE8 0.5px, transparent 0.5px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CARD 4 · WEBINARS — dual horizontal marquee  (col-span-8)
            Row 1 → scrolls LEFT  |  Row 2 ← scrolls RIGHT
            Faded edges via mask-image gradient
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8  bg-[#3D6BE8]/10 rounded-[3rem] p-8 border-2 border-zinc-100 shadow-2xl shadow-black/20 overflow-hidden">

          {/* Header */}
          <div className="relative z-10 mb-8 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Video size={20} className="text-[#3D6BE8]" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-zinc-900">
                  Live <span className="italic text-[#3D6BE8]">Webinars</span>
                </h3>
                <p className="text-[10px] font-semibold text-[#3D6BE8] uppercase">
                  Expert sessions for your college journey
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-[#3D6BE8] hover:underline shrink-0">
              View all <ArrowUpRight size={14} />
            </button>
          </div>

          {/* ── Marquee wrapper — clips overflow + fades left/right edges ── */}
          <div
            className="relative overflow-hidden "
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            {/* ── ROW 1 — scrolls LEFT ── */}
            <div className="overflow-hidden  py-4">
              <div
                ref={webinarRow1Ref}
                className="flex gap-4 w-max"
              >
                {[...webinarRow1, ...webinarRow1].map((webinar, i) => (
                  <WebinarCard key={`r1-${i}`} webinar={webinar} />
                ))}
              </div>
            </div>

            {/* ── ROW 2 — scrolls RIGHT ── */}
            <div className="overflow-hidden  py-4">
              <div
                ref={webinarRow2Ref}
                className="flex gap-4 w-max"
              >
                {[...webinarRow2, ...webinarRow2].map((webinar, i) => (
                  <WebinarCard key={`r2-${i}`} webinar={webinar} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CollegyDashboard;