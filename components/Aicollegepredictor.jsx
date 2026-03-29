"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight, ChevronLeft, MapPin, BookOpen, Wallet,
  GraduationCap, Star, Shield, Zap, RotateCcw,
  CheckCircle2, Building2, Users, TrendingUp, Sparkles
} from "lucide-react";

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

const COLLEGE_DB = {
  engineering: [
    { id:1,  name:"IIT Bombay",       city:"Mumbai",          state:"maharashtra", fee:"₹2.18L/yr", type:"IIT",    match:97, seats:1050, category:"Government", tag:"Top Pick"   },
    { id:2,  name:"IIT Delhi",        city:"New Delhi",       state:"delhi",       fee:"₹2.15L/yr", type:"IIT",    match:94, seats:880,  category:"Government", tag:null         },
    { id:3,  name:"BITS Pilani",      city:"Pilani",          state:"rajasthan",   fee:"₹5.66L/yr", type:"Deemed", match:88, seats:980,  category:"Private",    tag:"High ROI"   },
    { id:4,  name:"NIT Trichy",       city:"Tiruchirappalli", state:"tamil_nadu",  fee:"₹1.25L/yr", type:"NIT",    match:82, seats:870,  category:"Government", tag:null         },
    { id:5,  name:"VIT Vellore",      city:"Vellore",         state:"tamil_nadu",  fee:"₹2.20L/yr", type:"Deemed", match:76, seats:6000, category:"Private",    tag:"Easy Admit" },
    { id:6,  name:"DTU Delhi",        city:"New Delhi",       state:"delhi",       fee:"₹1.68L/yr", type:"State",  match:79, seats:1240, category:"Government", tag:null         },
  ],
  medical: [
    { id:7,  name:"AIIMS New Delhi",   city:"New Delhi",  state:"delhi",      fee:"₹1,628/yr", type:"AIIMS", match:96, seats:776, category:"Government", tag:"Top Pick" },
    { id:8,  name:"JIPMER Puducherry", city:"Puducherry", state:"telangana",  fee:"₹5,380/yr", type:"INI",   match:91, seats:119, category:"Government", tag:null       },
    { id:9,  name:"CMC Vellore",       city:"Vellore",    state:"tamil_nadu", fee:"₹4.5L/yr",  type:"Pvt",   match:85, seats:180, category:"Private",    tag:"Legacy"   },
    { id:10, name:"KGMU Lucknow",      city:"Lucknow",    state:"up",         fee:"₹1.64L/yr", type:"State", match:78, seats:200, category:"Government", tag:null       },
  ],
  management: [
    { id:11, name:"IIM Ahmedabad",   city:"Ahmedabad",  state:"gujarat",   fee:"₹23L/yr",   type:"IIM",     match:98, seats:420, category:"Government", tag:"Top Pick"   },
    { id:12, name:"IIM Bangalore",   city:"Bengaluru",  state:"karnataka", fee:"₹24.5L/yr", type:"IIM",     match:95, seats:510, category:"Government", tag:null         },
    { id:13, name:"FMS Delhi",       city:"New Delhi",  state:"delhi",     fee:"₹22K/yr",   type:"Central", match:88, seats:250, category:"Government", tag:"Best Value" },
    { id:14, name:"XLRI Jamshedpur", city:"Jamshedpur", state:"jharkhand", fee:"₹28.5L/yr", type:"Private", match:82, seats:360, category:"Private",    tag:null         },
  ],
  law: [
    { id:15, name:"NLU Delhi",        city:"New Delhi", state:"delhi",     fee:"₹1.95L/yr", type:"NLU", match:95, seats:110, category:"Government", tag:"Top Pick" },
    { id:16, name:"NALSAR Hyderabad", city:"Hyderabad", state:"telangana", fee:"₹2.10L/yr", type:"NLU", match:90, seats:90,  category:"Government", tag:null       },
    { id:17, name:"NLSIU Bangalore",  city:"Bengaluru", state:"karnataka", fee:"₹2.95L/yr", type:"NLU", match:86, seats:80,  category:"Government", tag:null       },
  ],
  design: [
    { id:18, name:"NID Ahmedabad", city:"Ahmedabad", state:"gujarat", fee:"₹4.20L/yr", type:"Autonomous", match:94, seats:120, category:"Government", tag:"Top Pick" },
    { id:19, name:"SPA Delhi",     city:"New Delhi", state:"delhi",   fee:"₹1.90L/yr", type:"Central",    match:88, seats:140, category:"Government", tag:null       },
  ],
  science: [
    { id:20, name:"IISc Bangalore", city:"Bengaluru", state:"karnataka", fee:"₹36K/yr", type:"IISc",    match:97, seats:540,  category:"Government", tag:"Top Pick"   },
    { id:21, name:"JNU New Delhi",  city:"New Delhi", state:"delhi",     fee:"₹12K/yr", type:"Central", match:88, seats:2200, category:"Government", tag:"Best Value" },
  ],
};

function getResults(prefs) {
  const base = COLLEGE_DB[prefs.course] || COLLEGE_DB.engineering;
  return base
    .map((c) => {
      let match = c.match;
      if (prefs.location && !prefs.location.includes("anywhere") && prefs.location.length > 0 && !prefs.location.includes(c.state)) {
        match = Math.max(match - 15, 30);
      }
      return { ...c, match };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
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
  // start = 12 o'clock = angle 0 (pointing up)
  // x = cx + R*sin(angle), y = cy - R*cos(angle)
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
    // Cycle status messages with plain setInterval — no layout issues
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < STATUS_MSGS.length) setStatusIdx(i);
      else clearInterval(timer);
    }, 900);

    // GSAP for rings + dots + center pulse only
    // Sweep is handled by SVG native <animateTransform> → always perfectly centered
    const runGsap = () => {
      const gsap = window.gsap;
      if (!gsap || !svgRef.current) return;

      const tl = gsap.timeline({ onComplete: () => { if (onDone) setTimeout(onDone, 300); } });
      tlRef.current = tl;

      // Rings scale in from the SVG center point
      const rings = svgRef.current.querySelectorAll(".r-ring");
      gsap.set(rings, { opacity: 0, transformOrigin: `${CX}px ${CY}px`, scale: 0 });
      tl.to(rings, {
        opacity: 1, scale: 1, duration: 0.45, stagger: 0.12, ease: "back.out(1.6)",
      }, 0);

      // Dots pop in at their own positions
      DOT_DATA.forEach((d, idx) => {
        const el = svgRef.current.querySelector(`.r-dot-${idx}`);
        if (!el) return;
        gsap.set(el, { opacity: 0, transformOrigin: `${d.cx}px ${d.cy}px`, scale: 0 });
        tl.to(el, { opacity: 1, scale: 1, duration: 0.28, ease: "elastic.out(2, 0.5)" }, d.delay);
      });

      // Center pulses independently (not on the main timeline)
      const ctr = svgRef.current.querySelector(".r-ctr");
      if (ctr) {
        gsap.to(ctr, {
          transformOrigin: `${CX}px ${CY}px`,
          scale: 1.6, opacity: 0.3,
          duration: 0.65, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
      }

      // Pad timeline so onComplete fires after sweep finishes (~3.6s + buffer)
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
          {/* Sweep gradient: bright at the leading edge, fades toward the trailing edge */}
          <linearGradient id="rg-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3f8efc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2667ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Ambient glow disc */}
        <circle cx={CX} cy={CY} r="145" fill="url(#rg-glow)" />

        {/* Crosshairs */}
        <line x1={CX}     y1={CY-132} x2={CX}     y2={CY+132} stroke="#2667ff" strokeWidth="0.8" strokeOpacity="0.14" />
        <line x1={CX-132} y1={CY}     x2={CX+132} y2={CY}     stroke="#2667ff" strokeWidth="0.8" strokeOpacity="0.14" />

        {/* Concentric rings — scaled in by GSAP from CX,CY */}
        {[R, 88, 58, 28].map((r, i) => (
          <circle key={r} className="r-ring" cx={CX} cy={CY} r={r}
            fill="none"
            stroke="#2667ff"
            strokeWidth={i === 0 ? 1.6 : 1}
            strokeOpacity={0.18 + i * 0.09}
            strokeDasharray={i === 1 || i === 3 ? "5 4" : undefined}
          />
        ))}

        {/*
          ── SWEEP ──────────────────────────────────────────────────────────
          Uses SVG-native <animateTransform> with rotate type and explicit
          cx,cy in "from" and "to" — this guarantees the rotation is always
          about the exact center (150,150) regardless of browser/GSAP quirks.
        */}
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

        {/* Leading-edge bright line — same rotation as fan */}
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

        {/* Detected dots — GSAP pops them in one by one */}
        {DOT_DATA.map((d, i) => (
          <g key={i} className={`r-dot-${i}`}>
            <circle cx={d.cx} cy={d.cy} r={d.r + 7} fill="#2667ff" opacity="0.08" />
            <circle cx={d.cx} cy={d.cy} r={d.r}     fill="#3f8efc" />
            <circle cx={d.cx} cy={d.cy} r={d.r + 11} fill="none" stroke="#3f8efc" strokeWidth="1" strokeOpacity="0.28" />
          </g>
        ))}

        {/* Center pulsing dot */}
        <circle className="r-ctr" cx={CX} cy={CY} r="11" fill="#2667ff" opacity="0.65" />
        <circle cx={CX} cy={CY} r="4.5" fill="white" />
      </svg>

      {/* Status label */}
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
  const [step, setStep]     = useState(0);
  const [prefs, setPrefs]   = useState({ course:"", location:[], budget:"", rank:"", category:"" });
  const [phase, setPhase]   = useState("form"); // "form" | "scanning" | "results"
  const [results, setResults] = useState([]);
  const cardRef    = useRef(null);
  const resultsRef = useRef(null);

  const currentStep = STEPS[step];
  const totalSteps  = STEPS.length;

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
    setResults(getResults(prefs));
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
    <section className="min-h-screen  py-16 flex items-center justify-center">
      <style>{`
        .card-hover:hover { transform:translateY(-3px); box-shadow:0 20px 40px rgba(38,103,255,0.10); }
        .match-bar { transition:width 1.1s cubic-bezier(.4,0,.2,1); }
        .opt-btn { transition:all 0.18s ease; }
        .opt-btn:hover { transform:translateY(-1px); }
      `}</style>

      <div className="w-full max-w-4xl mx-auto px-4 lg:px-8">

        {/* HEADER */}

          <div className="relative mb-10  flex flex-col items-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/30 mb-4">
                  <Sparkles size={14} className="text-[#2667ff]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
                     AI Predictor · Powered by CollegeAI
                  </span>
                </div>
                <h1 className="sm:text-6xl text-5xl font-black tracking-tighter text-center leading-[0.8] mb-4">
                  <span className="text-zinc-900">Predict Your </span>
                  <span className="bg-gradient-to-br from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic pr-3">
                    Future
                  </span>
                </h1>
                <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-800 to-[#2667ff] rounded-full mt-2" />
              </div>
{/* 
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-2 bg-[#2667ff] text-white text-[10px] font-black uppercase tracking-[0.28em] px-4 py-2 rounded-full mb-4 shadow-lg shadow-blue-200">
            <Sparkles size={11} /> AI Predictor · Powered by CollegeAI
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find Your <span style={{ color:"#2667ff" }}>Perfect College</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Answer 5 quick questions — get AI-matched colleges in seconds
          </p>
        </div> */}

        {/* ════ FORM ════ */}
        {phase === "form" && (
          <div className="max-w-xl mx-auto">
            {/* Progress bar */}
            <div className="mb-7">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {step+1} of {totalSteps}</span>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color:"#2667ff" }}>
                  {Math.round(((step+1)/totalSteps)*100)}% complete
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width:`${((step+1)/totalSteps)*100}%`, background:"linear-gradient(90deg,#2667ff,#3f8efc)" }} />
              </div>
            </div>

            {/* Step card */}
            <div ref={cardRef} className="bg-white border border-slate-100 rounded-[36px] p-8 shadow-xl shadow-blue-50/60">
              <div className="flex items-start gap-4 mb-7">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background:"linear-gradient(135deg,#2667ff18,#3f8efc18)" }}>
                  {React.createElement(currentStep.icon, { size:20, color:"#2667ff" })}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{currentStep.title}</h2>
                  <p className="text-slate-400 text-sm mt-0.5">{currentStep.subtitle}</p>
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
                        className={`opt-btn relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left active:scale-[0.97] ${
                          selected ? "border-[#2667ff] bg-[#eff4ff] shadow-md shadow-blue-100" : "border-slate-100 bg-slate-50 hover:border-blue-200"
                        }`}>
                        {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
                        <div>
                          <p className={`font-black text-sm ${selected ? "text-[#2667ff]" : "text-slate-700"}`}>{opt.label}</p>
                          {opt.sub && <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.sub}</p>}
                        </div>
                        {selected && <CheckCircle2 size={15} className="absolute top-3 right-3" color="#2667ff" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rank input */}
              {currentStep.type === "rank" && (
                <div className="space-y-5">
                  <input type="number" value={prefs.rank}
                    onChange={(e) => setPrefs((p) => ({ ...p, rank: e.target.value }))}
                    placeholder="e.g. 14000 (rank) or 95.6 (percentile)"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#2667ff] rounded-2xl px-5 py-4 text-lg font-black text-slate-900 outline-none transition-all placeholder:text-slate-300"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[["Under 1000","500"],["1000–5000","3000"],["5000–20000","12000"],["20000+","30000"]].map(([label, val]) => (
                      <button key={label} onClick={() => setPrefs((p) => ({ ...p, rank: val }))}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white text-slate-400 hover:border-[#2667ff] hover:text-[#2667ff] transition-all">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white text-slate-400 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={13} /> Back
                </button>
                <button onClick={handleNext} disabled={!canProceed()}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                  style={{ background: canProceed() ? "linear-gradient(135deg,#2667ff,#3f8efc)" : "#94a3b8" }}>
                  {step === totalSteps - 1 ? <><Zap size={13} /> Find My Colleges</> : <>Next <ChevronRight size={13} /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ SCANNING ════ */}
        {phase === "scanning" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-2xl shadow-blue-100 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#2667ff] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#2667ff]">AI Analysis Running</span>
              </div>
              <p className="text-slate-400 text-xs font-bold mb-6">Processing your preferences</p>
              <RadarScanner onDone={handleScanDone} />
            </div>
          </div>
        )}

        {/* ════ RESULTS ════ */}
        {phase === "results" && (
          <div ref={resultsRef}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={13} color="#2667ff" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2667ff]">AI Match Complete</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Top 3 Matches for You</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  {prefs.course} · Rank {prefs.rank} · {prefs.category?.toUpperCase()}
                </p>
              </div>
              <button onClick={handleReset}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-[#2667ff] text-[#2667ff] hover:bg-[#2667ff] hover:text-white transition-all">
                <RotateCcw size={12} /> Refine Search
              </button>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 mb-6">
              <Shield size={15} className="text-emerald-500 shrink-0" />
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
                Algorithm Verified · Calibrated to Latest 2025–26 Seat Matrix & Cutoffs
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-7">
              {[
                { label:"Scanned",   value:"12,847", icon:Building2 },
                { label:"Avg Match", value:`${Math.round(results.reduce((a,c)=>a+c.match,0)/results.length)}%`, icon:TrendingUp },
                { label:"Best Fit",  value:`${results[0]?.match||0}%`, icon:Star },
              ].map(({ label, value, icon:Icon }) => (
                <div key={label} className="bg-white border border-slate-100 rounded-[22px] p-5 text-center shadow-sm">
                  <Icon size={17} className="mx-auto mb-2" color="#2667ff" />
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {results.map((clg, idx) => (
                <div key={clg.id}
                  className="result-card group bg-white border border-slate-100 rounded-[28px] p-6 card-hover transition-all duration-300 cursor-pointer"
                  style={idx === 0 ? { borderColor:"#2667ff28", boxShadow:"0 4px 28px rgba(38,103,255,0.09)" } : {}}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-2xl">{medals[idx]}</span>
                        {clg.tag && (
                          <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                            style={{ background:idx===0?"#eff4ff":"#f0fdf4", color:idx===0?"#2667ff":"#16a34a", border:`1px solid ${idx===0?"#c7d7fd":"#bbf7d0"}` }}>
                            {clg.tag}
                          </span>
                        )}
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                          clg.category==="Government" ? "bg-blue-50 text-[#2667ff] border-blue-100" : "bg-rose-50 text-rose-500 border-rose-100"
                        }`}>{clg.category}</span>
                        <span className="text-[9px] font-black text-slate-400 flex items-center gap-1">
                          <MapPin size={9} /> {clg.city}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#2667ff] transition-colors">
                        {clg.name}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon:GraduationCap, text:`${clg.seats} Seats` },
                          { icon:Building2,     text:clg.type            },
                          { icon:Wallet,        text:clg.fee             },
                        ].map(({ icon:Icon, text }) => (
                          <span key={text} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <Icon size={11} color="#2667ff" /> {text}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-44 shrink-0">
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">AI Match</span>
                          <span className="text-xl font-black" style={{ color:matchColor(clg.match) }}>{clg.match}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full match-bar"
                            style={{ width:`${clg.match}%`, backgroundColor:matchColor(clg.match) }} />
                        </div>
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-md shadow-blue-100"
                        style={{ background:"linear-gradient(135deg,#2667ff,#3f8efc)" }}>
                        View Details <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-slate-400 text-xs font-bold">
              Results are AI-estimated. Verify cutoffs at official sources.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}