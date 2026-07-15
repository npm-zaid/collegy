"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight, ChevronLeft, MapPin, BookOpen, Wallet,
  GraduationCap, Star, Shield, Zap, RotateCcw,
  CheckCircle2, Building2, Users, TrendingUp, Sparkles, Image as ImageIcon
} from "lucide-react";

const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, '-') || "";
const formatFee = (val) => {
  if (!val) return "N/A";
  if (typeof val === 'string' && (val.includes('L') || val.includes('₹') || val.includes('K'))) return val;
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const STEPS = [
  {
    id: "course", title: "What do you want to study?", subtitle: "Choose your dream field",
    icon: BookOpen, type: "grid", key: "course", multi: false,
    options: [
      { value: "engineering", label: "Engineering", emoji: "⚙️" },
      { value: "medical",     label: "Medical",     emoji: "🩺" },
      { value: "management",  label: "Management",  emoji: "📊" },
      { value: "law",         label: "Law",         emoji: "⚖️" },
      { value: "design",      label: "Design",      emoji: "🎨" },
      { value: "science",     label: "Pure Science",emoji: "🔬" },
    ],
  },
  {
    id: "location", title: "Preferred Location?", subtitle: "Pick states you'd consider",
    icon: MapPin, type: "grid", key: "location", multi: true,
    options: [
      { value: "delhi",       label: "Delhi / NCR",       emoji: "🏛️" },
      { value: "maharashtra", label: "Maharashtra",       emoji: "🌆" },
      { value: "karnataka",   label: "Karnataka",         emoji: "🌿" },
      { value: "tamil_nadu",  label: "Tamil Nadu",        emoji: "🏖️" },
      { value: "west_bengal", label: "West Bengal",       emoji: "🎭" },
      { value: "telangana",   label: "Telangana",         emoji: "💎" },
      { value: "anywhere",    label: "Anywhere in India", emoji: "🇮🇳" },
    ],
  },
  {
    id: "budget", title: "Annual Fee Budget?", subtitle: "Total fees you can manage per year",
    icon: Wallet, type: "grid", key: "budget", multi: false,
    options: [
      { value: "under1l",  label: "Under ₹1 Lakh", sub: "Govt / Scholarship" },
      { value: "1_5l",     label: "₹1L – ₹5L",     sub: "Mid Range"          },
      { value: "5_15l",    label: "₹5L – ₹15L",    sub: "Premium Private"    },
      { value: "above15l", label: "₹15L+",          sub: "Top Tier / IIMs"   },
    ],
  },
  {
    id: "rank", title: "Your Entrance Score / Rank", subtitle: "Approximate rank or percentile",
    icon: TrendingUp, type: "rank", key: "rank",
  },
  {
    id: "category", title: "Reservation Category", subtitle: "For accurate cutoff matching",
    icon: Users, type: "grid", key: "category", multi: false,
    options: [
      { value: "general", label: "General", emoji: "🔵" },
      { value: "obc",     label: "OBC",     emoji: "🟢" },
      { value: "sc",      label: "SC",      emoji: "🟡" },
      { value: "st",      label: "ST",      emoji: "🟠" },
      { value: "ews",     label: "EWS",     emoji: "🟣" },
    ],
  },
];

function getResults(prefs, collegesData) {
  if (!collegesData || collegesData.length === 0) return [];
  
  const scored = collegesData.map(c => {
    let match = 95;

    // Course Matching
    const qCourse = prefs.course?.toLowerCase() || "";
    if (qCourse) {
      let courseKeywords = [qCourse];
      if (qCourse === 'engineering') courseKeywords = ['b.tech', 'm.tech', 'b.e', 'engineering', 'btech'];
      if (qCourse === 'medical') courseKeywords = ['mbbs', 'md', 'bds', 'medical', 'dental'];
      if (qCourse === 'management') courseKeywords = ['mba', 'bba', 'management', 'pgdm'];
      if (qCourse === 'law') courseKeywords = ['llb', 'llm', 'law'];
      if (qCourse === 'design') courseKeywords = ['b.des', 'm.des', 'design', 'fashion'];
      if (qCourse === 'science') courseKeywords = ['b.sc', 'm.sc', 'science'];

      const hasCourse = c.courses?.some(courseName => 
        courseKeywords.some(kw => courseName.toLowerCase().includes(kw))
      );
      if (!hasCourse) match -= 25;
    }

    // Location Matching
    if (prefs.location && !prefs.location.includes("anywhere") && prefs.location.length > 0) {
      const stateMatch = prefs.location.some(loc => {
        if (loc === 'delhi') return c.state.toLowerCase().includes('delhi');
        if (loc === 'maharashtra') return c.state.toLowerCase().includes('maharashtra') || c.state.toLowerCase().includes('mumbai') || c.state.toLowerCase().includes('pune');
        if (loc === 'karnataka') return c.state.toLowerCase().includes('karnataka') || c.state.toLowerCase().includes('bangalore');
        if (loc === 'tamil_nadu') return c.state.toLowerCase().includes('tamil') || c.state.toLowerCase().includes('chennai');
        if (loc === 'west_bengal') return c.state.toLowerCase().includes('bengal') || c.state.toLowerCase().includes('kolkata');
        if (loc === 'telangana') return c.state.toLowerCase().includes('telangana') || c.state.toLowerCase().includes('hyderabad');
        return false;
      });
      if (!stateMatch) match -= 20;
    }
    
    // Fee Budget Matching
    let feeNumeric = 0;
    if (c.feeRange) {
        const clean = c.feeRange.toLowerCase().replace(/,/g, '');
        const matches = clean.match(/[\d.]+/g);
        if (matches && matches.length > 0) {
            const baseNum = parseFloat(matches[matches.length - 1]);
            let multiplier = 1;
            if (clean.includes("lakh") || clean.includes("lac") || clean.includes("l")) multiplier = 100000;
            else if (clean.includes("k") || clean.includes("thousand")) multiplier = 1000;
            feeNumeric = baseNum * multiplier;
        }
    } else {
        const feesList = c.raw?.courses?.map(co => co.fees?.yearlyFees || co.fees?.totalFees || 0).filter(f => f > 0) || [];
        if (feesList.length > 0) feeNumeric = Math.min(...feesList);
    }

    if (prefs.budget && feeNumeric > 0) {
        const yearly = feeNumeric;
        if (prefs.budget === 'under1l' && yearly > 100000) match -= 15;
        if (prefs.budget === '1_5l' && (yearly < 100000 || yearly > 500000)) match -= 15;
        if (prefs.budget === '5_15l' && (yearly < 500000 || yearly > 1500000)) match -= 15;
        if (prefs.budget === 'above15l' && yearly < 1500000) match -= 15;
    }

    // Rank Bonus
    if (c.rank !== "-") {
        if (c.rank <= 50) match += 4;
        else if (c.rank <= 100) match += 2;
    }
    
    // Randomization for tie-breaking and realism
    match -= Math.floor(Math.random() * 5); 
    match = Math.min(Math.max(match, 40), 99);
    
    return { ...c, match };
  });

  return scored.sort((a, b) => b.match - a.match).slice(0, 3);
}

// ─── RADAR ──────────────────────────────────────────────────────────────────
// SVG center
const CX = 150, CY = 150, R = 116;

// 6 dot positions distributed around rings
const DOT_DATA = [
  { cx: 214, cy: 88,  r: 5, delay: 0.65 },
  { cx: 76,  cy: 110, r: 4, delay: 1.1  },
  { cx: 220, cy: 195, r: 6, delay: 1.55 },
  { cx: 90,  cy: 204, r: 4, delay: 2.0  },
  { cx: 174, cy: 50,  r: 5, delay: 2.45 },
  { cx: 56,  cy: 164, r: 3, delay: 2.9  },
];

const STATUS_MSGS = [
  "Scanning 12,000+ colleges…",
  "Matching your preferences…",
  "Applying cutoff filters…",
  "Ranking by fit score…",
  "Results ready!",
];

// Build fan-shaped sweep path starting at 12 o'clock, spanning `deg` degrees
function buildFanPath(deg) {
  const toRad = (d) => (d * Math.PI) / 180;
  const x1 = CX + R * Math.sin(toRad(0));
  const y1 = CY - R * Math.cos(toRad(0));
  const x2 = CX + R * Math.sin(toRad(deg));
  const y2 = CY - R * Math.cos(toRad(deg));
  const large = deg > 180 ? 1 : 0;
  return `M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`;
}

function RadarScanner({ onDone }) {
  const svgRef    = useRef(null);
  const tlRef     = useRef(null);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < STATUS_MSGS.length) setStatusIdx(i);
      else clearInterval(timer);
    }, 900);

    const runGsap = () => {
      const gsap = window.gsap;
      if (!gsap || !svgRef.current) return;

      const tl = gsap.timeline({ onComplete: () => { if (onDone) setTimeout(onDone, 300); } });
      tlRef.current = tl;

      const rings = svgRef.current.querySelectorAll(".r-ring");
      gsap.set(rings, { opacity: 0, transformOrigin: `${CX}px ${CY}px`, scale: 0 });
      tl.to(rings, {
        opacity: 1, scale: 1, duration: 0.45, stagger: 0.12, ease: "back.out(1.6)",
      }, 0);

      DOT_DATA.forEach((d, idx) => {
        const el = svgRef.current.querySelector(`.r-dot-${idx}`);
        if (!el) return;
        gsap.set(el, { opacity: 0, transformOrigin: `${d.cx}px ${d.cy}px`, scale: 0 });
        tl.to(el, { opacity: 1, scale: 1, duration: 0.28, ease: "elastic.out(2, 0.5)" }, d.delay);
      });

      const ctr = svgRef.current.querySelector(".r-ctr");
      if (ctr) {
        gsap.to(ctr, {
          transformOrigin: `${CX}px ${CY}px`,
          scale: 1.6, opacity: 0.3,
          duration: 0.65, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
      }

      tl.to({}, { duration: 0.3 }, 4.8);
    };

    if (window.gsap) {
      runGsap();
    } else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      s.onload = runGsap;
      document.head.appendChild(s);
    }

    return () => {
      clearInterval(timer);
      if (tlRef.current) tlRef.current.kill();
    };
  }, [onDone]);

  const fanPath = buildFanPath(42);

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <svg ref={svgRef} width="300" height="300" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="rg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2667ff" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#2667ff" stopOpacity="0"    />
          </radialGradient>
          <linearGradient id="rg-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3f8efc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2667ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <circle cx={CX} cy={CY} r="145" fill="url(#rg-glow)" />

        <line x1={CX}     y1={CY-132} x2={CX}     y2={CY+132} stroke="#2667ff" strokeWidth="0.8" strokeOpacity="0.14" />
        <line x1={CX-132} y1={CY}     x2={CX+132} y2={CY}     stroke="#2667ff" strokeWidth="0.8" strokeOpacity="0.14" />

        {[R, 88, 58, 28].map((r, i) => (
          <circle key={r} className="r-ring" cx={CX} cy={CY} r={r}
            fill="none"
            stroke="#2667ff"
            strokeWidth={i === 0 ? 1.6 : 1}
            strokeOpacity={0.18 + i * 0.09}
            strokeDasharray={i === 1 || i === 3 ? "5 4" : undefined}
          />
        ))}

        <path d={fanPath} fill="#2667ff" fillOpacity="0.18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CX} ${CY}`}
            to={`1440 ${CX} ${CY}`}
            dur="3.6s"
            begin="0s"
            repeatCount="1"
            fill="freeze"
          />
        </path>

        <line x1={CX} y1={CY} x2={CX} y2={CY - R}
          stroke="#3f8efc" strokeWidth="2.5" strokeOpacity="0.95"
          strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CX} ${CY}`}
            to={`1440 ${CX} ${CY}`}
            dur="3.6s"
            begin="0s"
            repeatCount="1"
            fill="freeze"
          />
        </line>

        {DOT_DATA.map((d, i) => (
          <g key={i} className={`r-dot-${i}`}>
            <circle cx={d.cx} cy={d.cy} r={d.r + 7} fill="#2667ff" opacity="0.08" />
            <circle cx={d.cx} cy={d.cy} r={d.r}     fill="#3f8efc" />
            <circle cx={d.cx} cy={d.cy} r={d.r + 11} fill="none" stroke="#3f8efc" strokeWidth="1" strokeOpacity="0.28" />
          </g>
        ))}

        <circle className="r-ctr" cx={CX} cy={CY} r="11" fill="#2667ff" opacity="0.65" />
        <circle cx={CX} cy={CY} r="4.5" fill="white" />
      </svg>

      <p className="text-sm font-black text-[#2667ff] tracking-widest uppercase transition-all duration-400 min-h-[1.4rem]">
        {STATUS_MSGS[statusIdx]}
      </p>
      <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
        AI · 12,000+ Institutes · Live Cutoffs
      </p>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function AiCollegePredictor() {
  const router = useRouter();
  const [collegesData, setCollegesData] = useState([]);
  
  const [step, setStep]     = useState(0);
  const [prefs, setPrefs]   = useState({ course:"", location:[], budget:"", rank:"", category:"" });
  const [phase, setPhase]   = useState("form"); // "form" | "scanning" | "results"
  const [results, setResults] = useState([]);
  const cardRef    = useRef(null);
  const resultsRef = useRef(null);

  const currentStep = STEPS[step];
  const totalSteps  = STEPS.length;

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("https://finale-beacon-backend.vercel.app/api/colleges");
        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map(c => ({
            id: c._id || c.collegeId,
            name: c.collegeName || "Unknown",
            city: c.location?.city || "Unknown",
            state: c.location?.state || "Unknown",
            courses: c.courses?.map(co => co.courseName) || [],
            category: c.collegeType || "Private",
            featured: c.isFeatured || false,
            feeRange: c.feesRange || "",
            fee: c.feesRange || (c.courses?.[0]?.fees?.totalFees ? formatFee(c.courses[0].fees.totalFees) : "N/A"),
            rank: c.nirfRanking?.overallRank || "-",
            seats: c.courses?.reduce((acc, curr) => acc + (curr.seatIntake || 0), 0) || 0,
            type: c.collegeType || "Private",
            estd: c.establishedYear || "Unknown",
            slug: toSlug(c.collegeName),
            image: c.media?.images?.[0]?.filename || null,
            raw: c,
          }));
          setCollegesData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      }
    };
    fetchColleges();
  }, []);

  // Preload GSAP
  useEffect(() => {
    if (typeof window !== "undefined" && !window.gsap) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      document.head.appendChild(s);
    }
  }, []);

  const animateCardIn = useCallback(() => {
    if (!window.gsap || !cardRef.current) return;
    window.gsap.fromTo(cardRef.current,
      { opacity:0, y:20, scale:0.97 },
      { opacity:1, y:0,  scale:1,   duration:0.4, ease:"back.out(1.4)" }
    );
  }, []);

  useEffect(() => { if (phase === "form") setTimeout(animateCardIn, 60); }, [step, phase, animateCardIn]);

  useEffect(() => {
    if (phase === "results" && resultsRef.current && window.gsap) {
      window.gsap.fromTo(
        resultsRef.current.querySelectorAll(".result-card"),
        { opacity:0, y:26, scale:0.96 },
        { opacity:1, y:0,  scale:1, duration:0.5, stagger:0.12, ease:"back.out(1.3)", delay:0.15 }
      );
    }
  }, [phase]);

  const select = (key, value, multi) => {
    if (multi) {
      setPrefs((p) => {
        const arr = p[key] || [];
        if (value === "anywhere") return { ...p, [key]: ["anywhere"] };
        const next = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr.filter((v) => v !== "anywhere"), value];
        return { ...p, [key]: next };
      });
    } else {
      setPrefs((p) => ({ ...p, [key]: value }));
    }
  };

  const canProceed = () => {
    const val = prefs[currentStep.key];
    if (currentStep.type === "rank") return String(prefs.rank).trim().length > 0;
    if (currentStep.multi) return Array.isArray(val) && val.length > 0;
    return val && String(val).trim().length > 0;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else setPhase("scanning");
  };

  const handleScanDone = () => {
    setResults(getResults(prefs, collegesData));
    setPhase("results");
  };

  const handleReset = () => {
    setPrefs({ course:"", location:[], budget:"", rank:"", category:"" });
    setStep(0);
    setPhase("form");
    setResults([]);
  };

  const matchColor = (p) => p >= 90 ? "#16a34a" : p >= 75 ? "#2667ff" : p >= 60 ? "#ea580c" : "#94a3b8";
  const medals = ["🥇","🥈","🥉"];

  return (
    <section className="min-h-screen py-16 flex items-center justify-center bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20">
      <style>{`
        .match-bar { transition:width 1.1s cubic-bezier(.4,0,.2,1); }
        .opt-btn { transition:all 0.18s ease; }
        .opt-btn:hover { transform:translateY(-1px); }
      `}</style>

      <div className="w-full max-w-[1000px] mx-auto px-6 lg:px-8">
        {/* HEADER */}
        <div className="relative mb-12 flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 mb-5">
            <Sparkles size={14} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              AI Predictor · Powered by CollegeAI
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center leading-[0.85] mb-4 uppercase">
            <span className="text-zinc-900">Predict Your </span>
            <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic pr-3">
              Future
            </span>
          </h1>
          <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2" />
        </div>

        {/* ════ FORM ════ */}
        {phase === "form" && (
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Step {step+1} of {totalSteps}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2667ff]">
                  {Math.round(((step+1)/totalSteps)*100)}% complete
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#2667ff] to-[#3f8efc]"
                  style={{ width:`${((step+1)/totalSteps)*100}%` }} />
              </div>
            </div>

            {/* Step card */}
            <div ref={cardRef} className="bg-white border-2 border-white rounded-[3rem] p-8 md:p-10 shadow-2xl">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[#2667ff]/10">
                  {React.createElement(currentStep.icon, { size:22, className:"text-[#2667ff]" })}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 uppercase italic tracking-tight leading-tight">{currentStep.title}</h2>
                  <p className="text-zinc-400 text-sm font-bold mt-1 uppercase tracking-widest">{currentStep.subtitle}</p>
                </div>
              </div>

              {/* Grid options */}
              {currentStep.type !== "rank" && (
                <div className={`grid gap-3 ${currentStep.options.length <= 4 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                  {currentStep.options.map((opt) => {
                    const val = prefs[currentStep.key];
                    const selected = currentStep.multi
                      ? (Array.isArray(val) && val.includes(opt.value))
                      : val === opt.value;
                    return (
                      <button key={opt.value}
                        onClick={() => select(currentStep.key, opt.value, currentStep.multi)}
                        className={`opt-btn relative flex flex-col items-start gap-2 p-5 rounded-3xl border-2 text-left active:scale-[0.97] transition-all ${
                          selected ? "border-[#2667ff] bg-[#2667ff]/5 shadow-lg shadow-blue-100/50" : "border-zinc-100 bg-zinc-50/50 hover:border-[#2667ff]/30 hover:bg-white"
                        }`}>
                        {opt.emoji && <span className="text-2xl mb-1">{opt.emoji}</span>}
                        <div>
                          <p className={`font-black text-sm uppercase tracking-wide ${selected ? "text-[#2667ff]" : "text-zinc-800"}`}>{opt.label}</p>
                          {opt.sub && <p className="text-[9px] text-zinc-400 font-bold mt-1 uppercase tracking-widest">{opt.sub}</p>}
                        </div>
                        {selected && <CheckCircle2 size={18} className="absolute top-4 right-4 text-[#2667ff]" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rank input */}
              {currentStep.type === "rank" && (
                <div className="space-y-6">
                  <input type="number" value={prefs.rank}
                    onChange={(e) => setPrefs((p) => ({ ...p, rank: e.target.value }))}
                    placeholder="e.g. 14000 (rank) or 95.6 (percentile)"
                    className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-[#2667ff] focus:bg-white rounded-[2rem] px-6 py-5 text-xl font-black text-zinc-900 outline-none transition-all placeholder:text-zinc-300"
                  />
                  <div className="flex flex-wrap gap-2.5">
                    {[["Under 1000","500"],["1000–5000","3000"],["5000–20000","12000"],["20000+","30000"]].map(([label, val]) => (
                      <button key={label} onClick={() => setPrefs((p) => ({ ...p, rank: val }))}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-zinc-100 bg-white text-zinc-400 hover:border-[#2667ff]/40 hover:text-[#2667ff] transition-all active:scale-95">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-zinc-100">
                <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                    <ChevronLeft size={14} />
                  </div>
                  Back
                </button>
                <button onClick={handleNext} disabled={!canProceed()}
                  className="group/btn relative overflow-hidden flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-blue-200/50 bg-zinc-900">
                  {canProceed() && <div className="absolute inset-0 w-full bg-gradient-to-r from-[#2667ff] to-[#3f8efc] transition-all" />}
                  <span className="relative z-10 flex items-center gap-2">
                    {step === totalSteps - 1 ? <><Zap size={14} /> Find My Colleges</> : <>Next <ChevronRight size={14} /></>}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ SCANNING ════ */}
        {phase === "scanning" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border-2 border-white rounded-[3rem] p-10 shadow-2xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2667ff] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">AI Analysis Running</span>
              </div>
              <p className="text-zinc-400 text-xs font-bold mb-8 uppercase tracking-widest">Processing your preferences</p>
              <RadarScanner onDone={handleScanDone} />
            </div>
          </div>
        )}

        {/* ════ RESULTS ════ */}
        {phase === "results" && (
          <div ref={resultsRef}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2667ff]/10 w-fit mb-4">
                  <Shield size={12} className="text-[#2667ff]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2667ff]">AI Match Complete</span>
                </div>
                <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Top Matches for You</h2>
                <p className="text-zinc-500 text-sm font-bold mt-2 uppercase tracking-widest">
                  {prefs.course} · Rank {prefs.rank} · {prefs.category?.toUpperCase()}
                </p>
              </div>
              <button onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-[#2667ff] text-[#2667ff] hover:bg-[#2667ff] hover:text-white transition-all active:scale-95 shadow-lg shadow-blue-100">
                <RotateCcw size={14} /> Refine Search
              </button>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-10">
              {[
                { label:"Scanned",   value:collegesData.length || "0", icon:Building2 },
                { label:"Avg Match", value:`${Math.round(results.reduce((a,c)=>a+c.match,0)/results.length || 0)}%`, icon:TrendingUp },
                { label:"Best Fit",  value:`${results[0]?.match||0}%`, icon:Star },
              ].map(({ label, value, icon:Icon }) => (
                <div key={label} className="bg-white border-2 border-white rounded-[2rem] p-6 text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[#2667ff]/10 mx-auto flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#2667ff]" />
                  </div>
                  <p className="text-3xl font-black text-zinc-900 italic tracking-tight">{value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {results.length > 0 ? results.map((clg, idx) => (
                <div key={clg.id}
                  onClick={() => router.push(`/explore/${clg.slug}`)}
                  className="result-card group bg-white border-2 border-white rounded-[2.5rem] p-7 cursor-pointer hover:shadow-2xl hover:border-[#2667ff]/20 transition-all duration-300 shadow-xl"
                  style={idx === 0 ? { borderColor:"#2667ff28", boxShadow:"0 8px 30px rgba(38,103,255,0.12)" } : {}}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {clg.image ? (
                      <img src={clg.image.startsWith("http") ? clg.image : `https://finale-beacon-backend.vercel.app/uploads/colleges/${clg.image}`} alt={clg.name} className="w-full md:w-36 md:h-36 object-cover rounded-3xl shrink-0 border border-zinc-100" />
                    ) : (
                      <div className="w-full md:w-36 md:h-36 bg-zinc-50 rounded-3xl shrink-0 flex items-center justify-center text-zinc-300 border border-zinc-100"><ImageIcon size={32} /></div>
                    )}

                    <div className="flex-1 space-y-3.5">
                      <div className="flex items-center flex-wrap gap-2.5">
                        <span className="text-2xl">{medals[idx]}</span>
                        {clg.featured && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em]">
                            <Star size={8} className="fill-amber-500" /> Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${
                          clg.category === "Government"
                            ? "bg-gradient-to-r from-[#2667ff]/10 to-[#2667ff]/10 text-[#2667ff] border-[#2667ff]/20"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}>
                          {clg.category}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-1">
                          <MapPin size={10} /> {clg.city}, {clg.state}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-zinc-900 group-hover:text-[#2667ff] transition-colors line-clamp-2">
                        {clg.name}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon:GraduationCap, text:`${clg.seats} Seats` },
                          { icon:Building2,     text:clg.type            },
                          { icon:Wallet,        text:clg.fee             },
                        ].map(({ icon:Icon, text }) => (
                          <span key={text} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-100 uppercase tracking-wider">
                            <Icon size={12} className="text-[#2667ff]" /> {text}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-5 w-full md:w-52 shrink-0 border-t md:border-t-0 border-zinc-100 pt-5 md:pt-0">
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">AI Match</span>
                          <span className="text-2xl font-black italic" style={{ color:matchColor(clg.match) }}>{clg.match}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full match-bar"
                            style={{ width:`${clg.match}%`, backgroundColor:matchColor(clg.match) }} />
                        </div>
                      </div>
                      <button className="group/btn relative w-full flex items-center justify-center gap-2 bg-zinc-900 overflow-hidden px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white transition-colors active:scale-95 shadow-lg">
                        <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#2667ff] to-[#3f8efc] transition-all duration-500 group-hover/btn:w-full" />
                        <span className="relative z-10 flex items-center gap-2 transition-colors duration-150 delay-100">
                          View Details <ChevronRight size={14} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="bg-white border-2 border-white rounded-[3rem] p-10 text-center shadow-xl">
                  <Shield size={32} className="text-zinc-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">No direct matches found</h3>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Try adjusting your filters</p>
                </div>
              )}
            </div>

            <p className="mt-10 text-center text-zinc-400 text-[10px] uppercase font-black tracking-widest">
              Results are AI-estimated. Verify cutoffs at official sources.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}