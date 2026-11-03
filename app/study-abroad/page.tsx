"use client";
// Save as app/study-abroad/page.jsx
// Pattern: EDITORIAL chapters (big numerals, eyebrow + italic headline) + BENTO grids inside each chapter
// + NEW: Match quiz (live-scoring) and Compare lab (animated cost bars). Brand blue: #2667ff (design.md §2.1).
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe2, Sparkles, ArrowRight, ArrowUpRight, MapPin, Wallet, Plane, Clock, Briefcase,
  GraduationCap, BookOpen, Award, CalendarDays, ChevronDown, Users, FileText, Landmark,
  Search, Plus, X, RotateCcw, Cpu, TrendingUp, HeartPulse, Palette, Cog, Zap, Trophy,
} from "lucide-react";

// ─── helpers (design.md §10) ──────────────────────────────────────────────────
const API = "https://finale-beacon-backend.vercel.app";
const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, "-") || "";
const imgSrc = (v) => (!v ? null : v.startsWith("http") ? v : `${API}/uploads/colleges/${v}`);
const BOOK_ROUTE = "/book-session"; // change if your route differs
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// ─── content — ALL FIGURES/SCORES ARE INDICATIVE PLACEHOLDERS, verify before publishing ───
// costMin/costMax: approx. total yearly cost (tuition + living) in ₹ lakh
// f = field strength (1–5), p = priority strength (1–5)
const COUNTRIES = [
  { id: "usa", flag: "🇺🇸", name: "USA", costMin: 30, costMax: 65, tuition: "₹20–50L", living: "₹10–15L", pswork: "1–3 yrs (OPT/STEM)", visa: "3–8 wks", intakes: ["Fall", "Spring"], f: { tech: 5, business: 5, health: 5, design: 4, eng: 5 }, p: { cost: 1, work: 4, visa: 2, rank: 5 } },
  { id: "uk", flag: "🇬🇧", name: "UK", costMin: 25, costMax: 50, tuition: "₹15–35L", living: "₹10–15L", pswork: "2 yrs (Graduate Route)", visa: "~3 wks", intakes: ["Sept", "Jan"], f: { tech: 4, business: 5, health: 4, design: 5, eng: 4 }, p: { cost: 2, work: 3, visa: 4, rank: 5 } },
  { id: "canada", flag: "🇨🇦", name: "Canada", costMin: 20, costMax: 40, tuition: "₹12–30L", living: "₹8–12L", pswork: "Up to 3 yrs (PGWP)", visa: "4–12 wks", intakes: ["Fall", "Winter", "Summer"], f: { tech: 5, business: 4, health: 4, design: 3, eng: 4 }, p: { cost: 3, work: 5, visa: 3, rank: 4 } },
  { id: "australia", flag: "🇦🇺", name: "Australia", costMin: 25, costMax: 45, tuition: "₹15–35L", living: "₹10–14L", pswork: "2–4 yrs (Grad visa)", visa: "4–6 wks", intakes: ["Feb", "July"], f: { tech: 4, business: 4, health: 5, design: 3, eng: 4 }, p: { cost: 2, work: 5, visa: 3, rank: 4 } },
  { id: "germany", flag: "🇩🇪", name: "Germany", costMin: 8, costMax: 20, tuition: "₹0–3L", living: "₹8–11L", pswork: "18 months", visa: "6–12 wks", intakes: ["Winter", "Summer"], f: { tech: 4, business: 3, health: 3, design: 3, eng: 5 }, p: { cost: 5, work: 3, visa: 2, rank: 4 } },
  { id: "ireland", flag: "🇮🇪", name: "Ireland", costMin: 20, costMax: 35, tuition: "₹10–25L", living: "₹8–12L", pswork: "1–2 yrs", visa: "4–8 wks", intakes: ["Sept", "Jan"], f: { tech: 5, business: 4, health: 4, design: 3, eng: 3 }, p: { cost: 3, work: 3, visa: 3, rank: 3 } },
  { id: "singapore", flag: "🇸🇬", name: "Singapore", costMin: 25, costMax: 45, tuition: "₹15–30L", living: "₹10–14L", pswork: "Pass-based", visa: "2–4 wks", intakes: ["Aug", "Jan"], f: { tech: 5, business: 5, health: 3, design: 3, eng: 4 }, p: { cost: 2, work: 2, visa: 5, rank: 5 } },
  { id: "netherlands", flag: "🇳🇱", name: "Netherlands", costMin: 15, costMax: 30, tuition: "₹10–20L", living: "₹8–12L", pswork: "1 yr (Orientation)", visa: "4–8 wks", intakes: ["Sept", "Feb"], f: { tech: 4, business: 4, health: 3, design: 4, eng: 5 }, p: { cost: 4, work: 2, visa: 3, rank: 4 } },
];

const FIELDS = [
  { id: "tech", label: "Tech & Data", icon: Cpu },
  { id: "business", label: "Business", icon: TrendingUp },
  { id: "eng", label: "Engineering", icon: Cog },
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "design", label: "Design & Arts", icon: Palette },
];
const PRIORITIES = [
  { id: "cost", label: "Low cost", icon: Wallet },
  { id: "work", label: "Work rights", icon: Briefcase },
  { id: "visa", label: "Fast visa", icon: Zap },
  { id: "rank", label: "Top ranked", icon: Trophy },
];

const ROADMAP = [
  { icon: Search, title: "Research", text: "Pick a country, a course and a realistic budget. Shortlist 8–10 universities across safe, target and reach." },
  { icon: FileText, title: "Entrance & language exams", text: "IELTS / TOEFL / PTE for English, plus GRE, GMAT or SAT where required. Book slots early." },
  { icon: GraduationCap, title: "Apply", text: "Statement of purpose, recommendation letters, transcripts and portfolio. Track every deadline." },
  { icon: Landmark, title: "Funding", text: "Scholarships, education loans and proof of funds. Compare interest rates and moratorium periods." },
  { icon: Plane, title: "Visa", text: "Offer letter, financial documents, biometrics and interview preparation." },
  { icon: Globe2, title: "Fly out", text: "Housing, forex, insurance and a pre-departure plan so day one isn't a scramble." },
];

const EXAMS = [
  { name: "IELTS", use: "English · UK, CA, AU", range: "Band 0–9" },
  { name: "TOEFL", use: "English · USA, CA", range: "0–120" },
  { name: "PTE", use: "English · AU, UK", range: "10–90" },
  { name: "GRE", use: "Masters · USA, DE", range: "260–340" },
  { name: "GMAT", use: "MBA · Global", range: "205–805" },
  { name: "SAT", use: "Undergrad · USA", range: "400–1600" },
];
const SCHOLARSHIPS = [
  { name: "Chevening", where: "UK", type: "Fully funded" },
  { name: "Fulbright-Nehru", where: "USA", type: "Fully funded" },
  { name: "DAAD", where: "Germany", type: "Partial / full" },
  { name: "Erasmus Mundus", where: "Europe", type: "Fully funded" },
  { name: "Vanier CGS", where: "Canada", type: "PhD funding" },
];
const INTAKES = [
  { m: "Jan–Feb", note: "Spring / Winter intake", tag: "UK · CA · AU · DE" },
  { m: "May–Jun", note: "Summer intake", tag: "CA · USA" },
  { m: "Aug–Sep", note: "Main intake — most seats", tag: "USA · UK · DE · SG" },
];
const FAQS = [
  { q: "When should I start preparing?", a: "Ideally 12–18 months before your intake. That leaves time for exams, shortlisting, applications, funding and the visa." },
  { q: "How much does it really cost?", a: "Tuition plus living costs vary widely by country and city. Use the compare lab for a rough idea, then check each university's official fee page." },
  { q: "Can I work while studying?", a: "Most destinations allow limited part-time work during term and more during breaks, but hours differ per country and visa. Check the official immigration site." },
  { q: "Do I need an education loan?", a: "Many students combine savings, scholarships and a loan. Compare interest rates, collateral rules and moratorium periods before choosing." },
  { q: "Is an agent necessary?", a: "No. You can apply directly. If you use a consultant, verify credentials and never pay for guaranteed admission." },
];
const FALLBACK_UNIS = [
  { id: "u1", name: "University of Toronto", where: "Toronto, Canada", flag: "🇨🇦", tone: "from-[#2667ff] to-[#3f8efc]", image: undefined },
  { id: "u2", name: "University of Melbourne", where: "Melbourne, Australia", flag: "🇦🇺", tone: "from-violet-500 to-indigo-500", image: undefined },
  { id: "u3", name: "Technical University of Munich", where: "Munich, Germany", flag: "🇩🇪", tone: "from-zinc-800 to-zinc-600", image: undefined },
  { id: "u4", name: "National University of Singapore", where: "Singapore", flag: "🇸🇬", tone: "from-amber-500 to-orange-400", image: undefined },
];
const TONES = ["from-[#2667ff] to-[#3f8efc]", "from-violet-500 to-indigo-500", "from-zinc-800 to-zinc-600", "from-amber-500 to-orange-400"];

// ─── atoms (design.md §6) ─────────────────────────────────────────────────────
function Eyebrow({ children, icon: Icon = null }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border w-fit mb-5 bg-[#2667ff]/10 border-[#2667ff]/20 text-[#2667ff]">
      {Icon ? <Icon size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-[#2667ff]" />}
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{children}</span>
    </div>
  );
}

function Chapter({ n, eyebrow, title, accent, sub = undefined, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-10 -left-2 text-[9rem] leading-none font-black italic tracking-tighter text-[#2667ff]/[0.07] select-none pointer-events-none">{n}</span>
      <div className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.92]">
          {title}{" "}
          <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic">{accent}</span>
        </h2>
        {sub && <p className="text-zinc-500 text-base font-medium leading-relaxed mt-5 max-w-lg">{sub}</p>}
        <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-5" />
      </div>
    </div>
  );
}

const White = "bg-white rounded-[3rem] border-2 border-white shadow-xl hover:shadow-2xl transition-shadow";
const Dark = "bg-zinc-900 rounded-[3rem] border-2 border-[#2667ff]/30 text-white relative overflow-hidden";
const Dots = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#2667ff 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }} />
);

// ─── page ─────────────────────────────────────────────────────────────────────
export default function StudyAbroadPage() {
  const router = useRouter();
  const [unis, setUnis] = useState(FALLBACK_UNIS);
  const [openFaq, setOpenFaq] = useState(0);

  // quiz
  const [field, setField] = useState(null);
  const [priority, setPriority] = useState(null);
  const [budget, setBudget] = useState(30);
  // compare
  const [picked, setPicked] = useState(["usa", "canada", "germany"]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/colleges?limit=100`);
        const json = await res.json();
        if (!live || !json.success) return;
        const mapped = json.data
          .filter((c) => (c.collegeType || "").toLowerCase().includes("abroad"))
          .map((c, i) => ({
            id: c._id || c.collegeId,
            name: c.collegeName || "Unknown",
            where: [c.location?.city, c.location?.state].filter(Boolean).join(", ") || "Abroad",
            flag: "🌍",
            image: imgSrc(c.media?.images?.[0]?.filename),
            tone: TONES[i % TONES.length],
          }));
        if (mapped.length > 0) setUnis(mapped);
      } catch (e) {
        console.error("Failed to fetch colleges", e);
      }
    })();
    return () => { live = false; };
  }, []);

  // quiz scoring
  const ranked = useMemo(() => {
    const MAX = 24;
    return COUNTRIES.map((c) => {
      let s = 0;
      if (field) s += c.f[field] * 2; else s += 6;
      if (priority) s += c.p[priority] * 2; else s += 6;
      s += c.costMin <= budget ? (c.costMax <= budget ? 4 : 3) : -((c.costMin - budget) / 5);
      return { ...c, match: clamp(Math.round((s / MAX) * 100), 12, 99) };
    }).sort((a, b) => b.match - a.match);
  }, [field, priority, budget]);
  const answered = [field, priority].filter(Boolean).length;
  const resetQuiz = () => { setField(null); setPriority(null); setBudget(30); };

  // compare
  const togglePick = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? [...p.slice(1), id] : [...p, id]));
  const compared = COUNTRIES.filter((c) => picked.includes(c.id));

  const goExplore = (term = "") => {
    const p = new URLSearchParams({ category: "Abroad" });
    if (term) p.set("search", term);
    router.push(`/explore?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 overflow-x-hidden relative">
      <style>{`
        @keyframes float-y { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1.5deg); } }
        .float-card { animation: float-y 5s ease-in-out infinite; }
        @keyframes grow-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .bar { transform-origin: left; animation: grow-x .7s cubic-bezier(.16,1,.3,1) both; }
        .rng::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 9999px; background: #2667ff; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(38,103,255,.5); cursor: pointer; }
        .rng::-moz-range-thumb { width: 18px; height: 18px; border-radius: 9999px; background: #2667ff; border: 3px solid #fff; cursor: pointer; }
      `}</style>

      {/* ambient glow + grid (design.md §5) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-[#2667ff]/10 blur-[110px] rounded-full" />
        <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] bg-amber-400/5 blur-[100px] rounded-full" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[100vh] z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right,#829cec38 1px,transparent 1px),linear-gradient(to bottom,#829cec38 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ══════════ HERO: editorial copy + bento mosaic ══════════ */}
        <section className="grid lg:grid-cols-12 gap-12 pt-28 lg:pt-36 pb-24 items-center">
          <div className="lg:col-span-7">
            <Eyebrow icon={Globe2}>Study Abroad</Eyebrow>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
              Your degree,{" "}
              <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic">without borders</span>
            </h1>
            <p className="text-zinc-500 text-base lg:text-lg leading-relaxed max-w-xl mb-10 font-medium">
              <span className="text-zinc-900">Find the country that fits your field, budget and priorities</span>{" "}
              — then compare them side by side and follow a clear roadmap to the visa.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#match" className="group/btn relative flex items-center gap-2 bg-zinc-900 overflow-hidden px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white active:scale-95">
                <span className="absolute inset-0 w-0 bg-[#2667ff] transition-all duration-500 group-hover/btn:w-full" />
                <span className="relative z-10 flex items-center gap-2"><Sparkles size={14} /> Find my match</span>
              </a>
              <Link href="/mentors" className="flex items-center gap-2 bg-white border-2 border-white shadow-xl hover:border-[#2667ff]/30 text-zinc-900 px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                <Users size={14} className="text-[#2667ff]" /> Talk to a student abroad
              </Link>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-8">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mr-1">Destinations:</span>
              {COUNTRIES.map((c) => (
                <button key={c.id} onClick={() => goExplore(c.name)} title={c.name}
                  className="w-10 h-10 rounded-full bg-white border border-zinc-100 shadow-sm text-lg hover:border-[#2667ff]/40 hover:shadow-md transition-all active:scale-95">{c.flag}</button>
              ))}
            </div>
          </div>

          {/* bento mosaic */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div style={{ animationDelay: "0s" }} className={`float-card col-span-2 ${Dark} p-7`}>
              <Dots />
              <div className="relative z-10">
                <div className="flex -space-x-2 mb-5">
                  {COUNTRIES.slice(0, 6).map((c) => (
                    <span key={c.id} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-lg">{c.flag}</span>
                  ))}
                  <span className="w-10 h-10 rounded-full bg-[#2667ff] border-2 border-zinc-900 flex items-center justify-center text-[10px] font-black">+{COUNTRIES.length - 6}</span>
                </div>
                <p className="text-5xl font-black italic tracking-tighter leading-none">{COUNTRIES.length} <span className="text-[#2667ff]">destinations</span></p>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 mt-3">compared on cost, work rights & visa</p>
              </div>
            </div>
            <div style={{ animationDelay: "1s" }} className={`float-card ${White} p-6 flex flex-col gap-3`}>
              <div className="w-10 h-10 rounded-xl bg-[#2667ff] flex items-center justify-center"><Sparkles size={18} className="text-white" /></div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">Match quiz</p>
              <p className="text-xl font-black italic text-zinc-900 leading-tight">60 seconds</p>
            </div>
            <div style={{ animationDelay: "2s" }} className="float-card rounded-[3rem] p-6 flex flex-col gap-3 bg-gradient-to-br from-[#2667ff] to-[#3f8efc] text-white shadow-xl shadow-blue-200">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Users size={18} /></div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70">Free 1:1</p>
              <p className="text-xl font-black italic leading-tight">Talk to seniors</p>
            </div>
          </div>
        </section>

        {/* ══════════ 01 · MATCH QUIZ (editorial header + bento body) ══════════ */}
        <section id="match" className="mb-32 scroll-mt-24">
          <Chapter n="01" eyebrow="Match" title="Find your" accent="country" sub="Answer two quick questions and set a budget. Results update live as you go." className="mb-14" />
          <div className="grid lg:grid-cols-12 gap-6">
            {/* questions */}
            <div className={`lg:col-span-7 ${White} p-8 md:p-10 space-y-9`}>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-4">1 · What will you study?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FIELDS.map(({ id, label, icon: Icon }) => {
                    const on = field === id;
                    return (
                      <button key={id} onClick={() => setField(on ? null : id)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left text-xs font-black transition-all active:scale-95 ${on ? "border-[#2667ff] bg-[#2667ff]/5 text-[#2667ff] shadow-lg shadow-blue-100" : "border-zinc-100 bg-zinc-50 text-zinc-700 hover:border-[#2667ff]/30"}`}>
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${on ? "bg-[#2667ff] text-white" : "bg-white text-[#2667ff]"}`}><Icon size={16} /></span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-4">2 · What matters most?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRIORITIES.map(({ id, label, icon: Icon }) => {
                    const on = priority === id;
                    return (
                      <button key={id} onClick={() => setPriority(on ? null : id)}
                        className={`flex flex-col items-start gap-3 px-4 py-4 rounded-2xl border-2 text-xs font-black transition-all active:scale-95 ${on ? "border-[#2667ff] bg-[#2667ff]/5 text-[#2667ff] shadow-lg shadow-blue-100" : "border-zinc-100 bg-zinc-50 text-zinc-700 hover:border-[#2667ff]/30"}`}>
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${on ? "bg-[#2667ff] text-white" : "bg-white text-[#2667ff]"}`}><Icon size={16} /></span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex items-end justify-between mb-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">3 · Yearly budget</p>
                  <span className="text-4xl font-black italic tracking-tighter text-[#2667ff] leading-none">₹{budget}L</span>
                </div>
                <input type="range" min={5} max={70} step={1} value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                  className="rng w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #2667ff ${((budget - 5) / 65) * 100}%, #e4e4e7 ${((budget - 5) / 65) * 100}%)` }} />
                <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-2"><span>₹5L</span><span>₹70L</span></div>
              </div>
              <button onClick={resetQuiz} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#2667ff] transition-colors">
                <RotateCcw size={12} /> Reset answers
              </button>
            </div>

            {/* live results */}
            <div className={`lg:col-span-5 ${Dark} p-8 md:p-10`}>
              <Dots />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2667ff]">Your top matches</p>
                    <p className="text-[9px] font-bold text-zinc-500 mt-1">{answered}/2 answered · budget set</p>
                  </div>
                  <Trophy size={18} className="text-[#2667ff]" />
                </div>
                <div className="space-y-4">
                  {ranked.slice(0, 3).map((c, i) => (
                    <button key={c.id} onClick={() => goExplore(c.name)}
                      className="w-full text-left bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 rounded-2xl p-4 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black">{i === 0 && <span className="text-[#2667ff] mr-1">#1</span>}{c.name}</p>
                          <p className="text-[10px] text-white/40">₹{c.costMin}–{c.costMax}L / yr · visa {c.visa}</p>
                        </div>
                        <span className="text-xl font-black italic text-[#2667ff]">{c.match}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div key={`${c.id}-${c.match}`} className="bar h-full bg-gradient-to-r from-[#2667ff] to-[#3f8efc] rounded-full" style={{ width: `${c.match}%` }} />
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => { setPicked(ranked.slice(0, 3).map((c) => c.id)); document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="mt-7 w-full flex items-center justify-center gap-2 bg-[#2667ff] hover:bg-white hover:text-zinc-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                  Compare these three <ArrowRight size={14} />
                </button>
                <p className="text-[9px] text-zinc-500 font-medium mt-4 leading-relaxed">Indicative scoring on general trends. Always verify with official sources.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 02 · COMPARE LAB ══════════ */}
        <section id="compare" className="mb-32 scroll-mt-24">
          <Chapter n="02" eyebrow="Compare" title="Side by" accent="side" sub="Pick up to three destinations. Bars show the typical total yearly cost." className="mb-14" />

          <div className="flex flex-wrap gap-2 mb-6">
            {COUNTRIES.map((c) => {
              const on = picked.includes(c.id);
              return (
                <button key={c.id} onClick={() => togglePick(c.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black border transition-all active:scale-95 ${on ? "bg-zinc-900 text-white border-transparent shadow-lg" : "bg-white text-zinc-600 border-zinc-200 hover:border-[#2667ff]/40 hover:text-[#2667ff]"}`}>
                  <span className="text-base leading-none">{c.flag}</span> {c.name}
                  {on ? <X size={11} className="text-white/60" /> : <Plus size={11} className="text-zinc-400" />}
                </button>
              );
            })}
          </div>

          <div className={`grid gap-6 ${compared.length === 3 ? "lg:grid-cols-3" : compared.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
            {compared.map((c) => {
              const lo = (c.costMin / 70) * 100, hi = (c.costMax / 70) * 100;
              return (
                <div key={c.id} className={`${White} p-8`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{c.flag}</span>
                      <h3 className="text-2xl font-black italic uppercase tracking-tight">{c.name}</h3>
                    </div>
                    <button onClick={() => goExplore(c.name)} className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-[#2667ff] hover:text-white text-zinc-500 flex items-center justify-center transition-colors"><ArrowUpRight size={15} /></button>
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">Total yearly cost</p>
                  <p className="text-3xl font-black italic tracking-tighter text-zinc-900">₹{c.costMin}–{c.costMax}L</p>
                  <div className="relative h-3 bg-zinc-100 rounded-full overflow-hidden mt-4 mb-1">
                    <div key={c.id} className="bar absolute top-0 h-full bg-gradient-to-r from-[#2667ff] to-[#3f8efc] rounded-full" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-zinc-300 uppercase tracking-widest mb-7"><span>₹0</span><span>₹70L</span></div>

                  <div className="space-y-3">
                    {[
                      { icon: Wallet, label: "Tuition / yr", value: c.tuition },
                      { icon: Landmark, label: "Living / yr", value: c.living },
                      { icon: Briefcase, label: "Post-study work", value: c.pswork },
                      { icon: Clock, label: "Visa time", value: c.visa },
                      { icon: CalendarDays, label: "Intakes", value: c.intakes.join(" · ") },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-4 bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2667ff]/10 flex items-center justify-center shrink-0"><Icon size={14} className="text-[#2667ff]" /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                          <p className="text-sm font-black text-zinc-800">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-400 font-bold mt-5">* Indicative placeholder figures. Verify costs and visa rules on official sources.</p>
        </section>

        {/* ══════════ 03 · UNIVERSITIES (bento mosaic) ══════════ */}
        <section className="mb-32">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
            <Chapter n="03" eyebrow="Universities" title="Where you'll" accent="study" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4">
            {unis.slice(0, 4).map((u, i) => (
              <button key={u.id} onClick={() => goExplore(u.name)}
                className={`group relative rounded-[2.5rem] overflow-hidden text-left border-2 border-white shadow-xl hover:shadow-2xl transition-all ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                {u.image ? (
                  <img src={u.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${u.tone || TONES[i % 4]}`}>
                    <span className="absolute -bottom-4 -right-2 text-[9rem] leading-none opacity-20">{u.flag}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-5 right-5 bg-amber-50 text-amber-800 border border-amber-200 text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full">Abroad</span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className={`font-black italic uppercase tracking-tight text-white leading-tight ${i === 0 ? "text-3xl" : "text-base"}`}>{u.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-2 flex items-center gap-1"><MapPin size={9} /> {u.where}</p>
                </div>
              </button>
            ))}
            <button onClick={() => goExplore()} className={`group ${Dark} p-6 flex flex-col justify-between text-left`}>
              <Dots />
              <div className="relative z-10 w-11 h-11 rounded-xl bg-[#2667ff] flex items-center justify-center"><GraduationCap size={18} /></div>
              <div className="relative z-10">
                <p className="text-2xl font-black italic tracking-tighter leading-none">View all<br />universities</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#2667ff] group-hover:gap-2 transition-all">Explore <ArrowRight size={11} /></span>
              </div>
            </button>
          </div>
        </section>

        {/* ══════════ 04 · ROADMAP (editorial sticky + stacked steps) ══════════ */}
        <section className="mb-32">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:sticky top-28 h-fit">
              <Chapter n="04" eyebrow="Roadmap" title="Six steps to" accent="takeoff" sub="From first idea to landing day, in order." />
              <Link href={BOOK_ROUTE} className="mt-8 inline-flex items-center gap-2 bg-[#2667ff] hover:bg-zinc-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-100">
                Plan with a mentor <ArrowRight size={13} />
              </Link>
            </div>
            <div className="lg:col-span-8 space-y-5">
              {ROADMAP.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="group bg-white rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all p-7 md:p-8 flex items-start gap-6">
                  <span className="text-6xl font-black italic tracking-tighter text-[#2667ff]/20 group-hover:text-[#2667ff] transition-colors leading-none w-16 shrink-0">0{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-[#2667ff]/10 flex items-center justify-center"><Icon size={16} className="text-[#2667ff]" /></div>
                      <h3 className="text-xl font-black uppercase italic tracking-tight">{title}</h3>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 05 · EXAMS · FUNDING · INTAKES (bento) ══════════ */}
        <section className="mb-32">
          <Chapter n="05" eyebrow="Prepare" title="Exams, funding &" accent="timing" className="mb-14" />
          <div className="grid lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-7 ${White} p-8 md:p-10`}>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center"><BookOpen size={18} className="text-[#2667ff]" /></div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight">Exams you may need</h3>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {EXAMS.map((e) => (
                  <div key={e.name} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 hover:border-[#2667ff]/30 transition-colors">
                    <p className="text-2xl font-black italic tracking-tighter text-zinc-900">{e.name}</p>
                    <p className="text-[10px] font-bold text-zinc-500 mt-1">{e.use}</p>
                    <span className="inline-block mt-3 text-[9px] font-black text-[#2667ff] px-2 py-0.5 bg-[#2667ff]/10 rounded-full">{e.range}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`lg:col-span-5 ${Dark} p-8 md:p-10`}>
              <Dots />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-11 h-11 rounded-2xl bg-[#2667ff] flex items-center justify-center"><Award size={18} /></div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">Scholarships</h3>
                </div>
                <div className="space-y-3">
                  {SCHOLARSHIPS.map((s) => (
                    <div key={s.name} className="bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 rounded-2xl p-4 flex items-center gap-3 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{s.name}</p>
                        <p className="text-[10px] text-white/40">{s.where}</p>
                      </div>
                      <span className="text-[9px] font-black text-[#2667ff] shrink-0">{s.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {INTAKES.map((i) => (
              <div key={i.m} className={`lg:col-span-4 ${White} p-8`}>
                <CalendarDays size={18} className="text-[#2667ff] mb-4" />
                <p className="text-4xl font-black italic tracking-tighter text-[#2667ff]">{i.m}</p>
                <p className="text-sm font-black text-zinc-900 mt-2">{i.note}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">{i.tag}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ 06 · FAQ + CTA ══════════ */}
        <section className="pb-28">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-8">
              <Chapter n="06" eyebrow="FAQ" title="Quick" accent="answers" />
              <div className={`${Dark} p-8 md:p-10`}>
                <Dots />
                <div className="relative z-10">
                  <Eyebrow icon={Sparkles}>Free guidance</Eyebrow>
                  <h3 className="text-4xl font-black tracking-tighter leading-[0.92]">
                    Talk to someone who <span className="text-[#2667ff] italic">went</span>.
                  </h3>
                  <p className="text-zinc-400 text-sm font-medium mt-4 leading-relaxed">Chat 1:1 with students already studying abroad and get the honest picture.</p>
                  <div className="space-y-3 mt-7">
                    <Link href="/mentors" className="flex items-center justify-center gap-2 bg-[#2667ff] hover:bg-white hover:text-zinc-900 text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"><Users size={14} /> Connect with a mentor</Link>
                    <Link href={BOOK_ROUTE} className="flex items-center justify-center gap-2 bg-white/10 border border-white/15 hover:bg-white/20 text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">Book Session <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4 lg:pt-6">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className={`bg-white rounded-[2rem] border-2 shadow-md transition-all ${open ? "border-[#2667ff]/30 shadow-xl" : "border-white hover:border-[#2667ff]/20"}`}>
                    <button onClick={() => setOpenFaq(open ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-7 py-5">
                      <span className="text-sm md:text-base font-black text-zinc-900 tracking-tight">{f.q}</span>
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${open ? "bg-[#2667ff] text-white rotate-180" : "bg-zinc-100 text-zinc-400"}`}><ChevronDown size={15} /></span>
                    </button>
                    {open && <p className="px-7 pb-6 -mt-1 text-sm text-zinc-500 font-medium leading-relaxed">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}