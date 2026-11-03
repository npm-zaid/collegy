"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ArrowRight, Sparkles, ShieldCheck, BarChart3, MessageCircle,
  MapPin, GraduationCap, Star, ChevronRight, Rocket, Quote, Users,
} from "lucide-react";

// ─── helpers (from design.md §10) ─────────────────────────────────────────────
const API = "https://finale-beacon-backend.vercel.app";
const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, "-") || "";
const formatFee = (val) => {
  if (!val) return "N/A";
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};
const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// Optional: drop your illustration in /public and set the path here.
const HERO_IMAGE = '/miles-2.png'; // e.g. "/newgen-hero.png"

// Route of the mentors page ("Choose. Connect. Grow.")
const MENTORS_ROUTE = "/mentors";

const TRENDING = ["Scaler", "Newton", "Vedam", "NIAT"];

const FEATURED_LOGOS = [
  { name: "Scaler", sub: "School of Technology" },
  { name: "Vedam", sub: "School of Technology" },
  { name: "NIAT", sub: "NxtWave Institute of Advanced Technologies" },
  { name: "ALTA", sub: "School of Technology" },
  { name: "Newton", sub: "School of Technology" },
  { name: "Velocity", sub: "Camp" },
];

const FLOATERS = [
  { name: "NIAT", sub: "NxtWave Institute", pos: "top-[6%] left-[-4%]", delay: "0s", tone: "from-[#2667ff] to-[#3f8efc]" },
  { name: "Scaler", sub: "School of Technology", pos: "bottom-[10%] left-[-8%]", delay: "2.1s", tone: "from-zinc-900 to-zinc-700" },
];

const WHY = [
  { icon: ShieldCheck, title: "Verified student reviews", text: "Every review is checked against enrolment proof, so you hear from real students, not marketing teams." },
  { icon: BarChart3, title: "Real placement data", text: "Packages, recruiters and placement rates sourced and cross-checked, with no cherry-picked highlights." },
  { icon: MessageCircle, title: "Direct access to students", text: "Ask current students and alumni your questions before you commit a rupee or a year." },
];

const REVIEWS = [
  {
    id: "r1", name: "Anonymous Student", anonymous: true, verified: false,
    college: "Vedam School of Technology", batch: "Class of 2029",
    aspect: "Overall Experience", rating: 3,
    tags: ["Campus Life", "High Workload", "Self-starters"],
    text: "Faculty are approachable and doubts do get attention, but the system expects you to stay self-driven. If you need spoon-feeding, this may feel rough.",
  },
  {
    id: "r2", name: "Ishita Sharma", anonymous: false, verified: true,
    college: "Scaler School of Technology", batch: "Class of 2028",
    aspect: "Faculty & Academics", rating: 3,
    tags: ["Medium", "Slack/Discord", "Faculty access"],
    text: "Teaching quality is strong when you use the ecosystem properly, but the workload can get exhausting. It suits students who want structure and pressure.",
  },
  {
    id: "r3", name: "Riya Sharma", anonymous: false, verified: true,
    college: "Newton School of Technology ADYPU", batch: "Class of 2028",
    aspect: "Campus Reality", rating: 4,
    tags: ["Coding culture", "Active peers", "Check stay reality"],
    text: "The coding culture is useful, but the experience is not equally strong across every part. Check campus life and outcome claims before deciding.",
  },
];

function ReviewCard({ r }) {
  return (
    <div className="relative bg-white rounded-[2.5rem] border-2 border-[#2667ff]/10 shadow-xl hover:shadow-2xl hover:border-[#2667ff]/30 transition-all p-7 flex flex-col">
      <Quote size={40} className="absolute top-7 right-7 text-[#2667ff]/15" />

      {/* Author */}
      <div className="flex items-start gap-4 mb-7 pr-12">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-md ${
            r.anonymous ? "bg-zinc-100 text-zinc-500" : "bg-[#2667ff] text-white"
          }`}
        >
          {r.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-black text-zinc-900 tracking-tight">{r.name}</p>
            {r.anonymous ? (
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Anonymous
              </span>
            ) : r.verified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] font-black uppercase tracking-widest text-emerald-700">
                <ShieldCheck size={10} /> Verified
              </span>
            ) : null}
          </div>
          <p className="text-sm text-zinc-500 font-medium mt-1 leading-snug">{r.college}</p>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">{r.batch}</p>
        </div>
      </div>

      {/* Aspect + rating */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-sm font-black text-[#2667ff]">{r.aspect}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={14}
              className={n <= r.rating ? "fill-amber-500 text-amber-500" : "text-amber-500"}
            />
          ))}
          <span className="ml-1.5 text-xs font-black text-amber-700">{r.rating}/5</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {r.tags.map((t) => (
          <span key={t} className="bg-zinc-50 border border-zinc-100 text-zinc-600 text-xs font-bold px-3.5 py-2 rounded-xl">
            {t}
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="mt-auto text-zinc-600 text-sm font-medium italic leading-relaxed bg-white rounded-[1.75rem] border border-[#2667ff]/15 p-5">
        {r.text}
      </p>
    </div>
  );
}

const FALLBACK_COLLEGES = [
  { id: "f1", name: "Scaler School of Technology", city: "Bengaluru", state: "Karnataka", fee: "₹4L", seats: 120, rating: "4.6", category: "Next Gen" },
  { id: "f2", name: "Vedam School of Technology", city: "Bhopal", state: "Madhya Pradesh", fee: "₹3.5L", seats: 100, rating: "4.4", category: "Next Gen" },
  { id: "f3", name: "NxtWave Institute of Advanced Technologies", city: "Hyderabad", state: "Telangana", fee: "₹2.8L", seats: 300, rating: "4.3", category: "Next Gen" },
  { id: "f4", name: "Newton School of Technology", city: "Pune", state: "Maharashtra", fee: "₹3L", seats: 150, rating: "4.5", category: "Next Gen" },
];

// ─── atoms (design.md §6.1) ───────────────────────────────────────────────────
function EyebrowBadge({ children, icon: Icon = Sparkles }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border w-fit mb-5 bg-[#2667ff]/10 border-[#2667ff]/20 text-[#2667ff]">
      <Icon size={12} />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{children}</span>
    </div>
  );
}

function SectionHeader({ eyebrow, title, accent }) {
  return (
    <div className="flex flex-col items-start mb-10">
      <EyebrowBadge>{eyebrow}</EyebrowBadge>
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95]">
        {title}{" "}
        <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic">
          {accent}
        </span>
      </h2>
      <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-4" />
    </div>
  );
}

function LogoTile({ name, size = "w-10 h-10", tone = "from-[#2667ff] to-[#3f8efc]" }) {
  return (
    <div className={`${size} rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md`}>
      {initials(name)}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function NewGenPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [colleges, setColleges] = useState(FALLBACK_COLLEGES);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/colleges?limit=100`);
        const json = await res.json();
        if (!active || !json.success) return;
        const mapped = json.data
          .filter((c) => (c.collegeType || "").toLowerCase().includes("next gen"))
          .map((c) => ({
            id: c._id || c.collegeId,
            name: c.collegeName || "Unknown",
            city: c.location?.city || "Unknown",
            state: c.location?.state || "Unknown",
            fee: c.annualFees ? formatFee(c.annualFees) : formatFee(c.courses?.[0]?.fees?.totalFees),
            seats: c.courses?.reduce((a, b) => a + (b.seatIntake || 0), 0) || 0,
            rating: c.reviews?.length
              ? (c.reviews.reduce((a, r) => a + (r.rating || 0), 0) / c.reviews.length).toFixed(1)
              : null,
            category: c.collegeType || "Next Gen",
          }));
        if (mapped.length > 0) setColleges(mapped);
      } catch (e) {
        console.error("Failed to fetch colleges", e);
      }
    })();
    return () => { active = false; };
  }, []);

  const marquee = useMemo(() => [...FEATURED_LOGOS, ...FEATURED_LOGOS], []);

  const goExplore = (term = query) => {
    const params = new URLSearchParams({ category: "Next Gen" });
    if (term.trim()) params.set("search", term.trim());
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 overflow-x-hidden relative">
      <style>{`
        @keyframes float-y { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-14px) rotate(1.5deg); } }
        .float-card { animation: float-y 5s ease-in-out infinite; }
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee-x 26s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Background glow + grid (design.md §5) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] bg-[#2667ff]/10 blur-[110px] rounded-full" />
        <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-[100vh] z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,#829cec38 1px,transparent 1px),linear-gradient(to bottom,#829cec38 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 ">

        {/* ══════════════ HERO ══════════════ */}
        <section className="grid lg:grid-cols-12 gap-12 pt-22 pb-10 items-center">

          {/* Left */}
          <div className="lg:col-span-7">
            <EyebrowBadge icon={Rocket}>New-Gen Colleges</EyebrowBadge>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
              The honest truth about India&apos;s{" "}
              <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic">
                new-gen colleges
              </span>
            </h1>

            <p className="text-zinc-500 text-base lg:text-lg leading-relaxed max-w-xl mb-10 font-medium">
              <span className="text-zinc-900">Verified student reviews, real placement data, and direct access to students</span>
              {" "}— before you commit.
            </p>

            {/* Search (design.md §6.9, hero variant) */}
            <form
              onSubmit={(e) => { e.preventDefault(); goExplore(); }}
              className="flex items-center bg-white rounded-[2rem] pl-6 pr-2 py-2 gap-3 max-w-2xl border-2 border-white shadow-xl ring-1 ring-zinc-100 focus-within:ring-[#2667ff]/30 transition-all"
            >
              <Search size={18} className="text-zinc-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges, courses, or cities…"
                className="flex-1 bg-transparent outline-none text-base font-bold text-zinc-900 placeholder:text-zinc-400 min-w-0"
              />
              <button
                type="submit"
                className="group/btn relative flex items-center gap-2 bg-[#2667ff] hover:bg-zinc-900 overflow-hidden px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors active:scale-95 shadow-lg shadow-blue-100"
              >
                Explore <ArrowRight size={14} />
              </button>
            </form>

            {/* Trending chips */}
            {/* <div className="flex items-center gap-2 flex-wrap mt-6">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mr-1">Trending:</span>
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => goExplore(t)}
                  className="px-4 py-2 rounded-full bg-white border border-zinc-100 text-[11px] font-black text-zinc-700 shadow-sm hover:border-[#2667ff]/40 hover:text-[#2667ff] hover:shadow-md transition-all active:scale-95"
                >
                  {t}
                </button>
              ))}
            </div> */}

            {/* Featured marquee */}
            <div className="mt-12 pt-8 border-t border-zinc-100">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-5">Featured Colleges</p>
              <div
                className="overflow-hidden max-w-2xl"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                }}
              >
                <div className="marquee-track flex gap-8 w-max">
                  {marquee.map((l, i) => (
                    <div key={`${l.name}-${i}`} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                      <LogoTile name={l.name} size="w-9 h-9" tone="from-zinc-700 to-zinc-500" />
                      <div className="leading-tight">
                        <p className="text-sm font-black text-zinc-800 uppercase tracking-tight">{l.name}</p>
                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest max-w-[120px] truncate">{l.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: illustration stage with floating logo cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-[480px] aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-white shadow-2xl bg-gradient-to-br from-[#2667ff]/10 via-white to-[#3f8efc]/10">
              {HERO_IMAGE ? (
                <img src='/miles-2.png' alt="Students comparing colleges" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2667ff] to-[#3f8efc]">
                  <GraduationCap size={120} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {FLOATERS.map((f) => (
              <div
                key={f.name}
                style={{ animationDelay: f.delay }}
                className={`float-card absolute ${f.pos} z-20 hidden sm:flex items-center gap-3 bg-white rounded-[1.5rem] px-4 py-3 border-2 border-white shadow-xl`}
              >
                <LogoTile name={f.name} tone={f.tone} />
                <div className="leading-tight">
                  <p className="text-sm font-black text-zinc-900 uppercase italic">{f.name}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{f.sub}</p>
                </div>
              </div>
            ))}

            {/* Connect button (replaces a floating card) → mentors page */}
            <Link
              href={MENTORS_ROUTE}
              style={{ animationDelay: "1.2s" }}
              className="float-card group/btn absolute bottom-4 right-3 sm:bottom-auto sm:top-[50%] sm:right-[-10%] z-20 flex items-center gap-3 bg-zinc-900 overflow-hidden rounded-[1.5rem] pl-3 pr-5 py-3 border-2 border-[#2667ff]/40 shadow-2xl"
            >
              <div className="absolute inset-0 w-0 bg-[#2667ff] transition-all duration-500 group-hover/btn:w-full" />
              <span className="relative z-10 w-10 h-10 rounded-xl bg-[#2667ff] group-hover/btn:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                <Users size={18} className="text-white" />
                <span className="absolute -top-1 -right-1 flex w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-900" />
                </span>
              </span>
              <span className="relative z-10 leading-tight text-left">
                <span className="block text-sm font-black text-white uppercase italic tracking-tight">Connect</span>
                <span className="block text-[8px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white/80 transition-colors">
                  Talk to a senior mentor
                </span>
              </span>
              <ArrowRight size={14} className="relative z-10 text-white ml-1" />
            </Link>
          </div>
        </section>

        {/* ══════════════ NEW-GEN COLLEGES GRID ══════════════ */}
        <section className="mb-24">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader eyebrow="Top Picks" title="Explore" accent="new-gen colleges" />
            <button
              onClick={() => goExplore("")}
              className="mb-10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#2667ff] hover:text-zinc-900 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {colleges.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(`/explore/${toSlug(c.name)}`)}
                className="group text-left bg-white p-7 rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all duration-300 active:scale-95 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <LogoTile name={c.name} size="w-12 h-12" />
                  <span className="inline-flex items-center px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.15em] bg-violet-50 text-violet-700 border-violet-200 shadow-sm shadow-violet-100">
                    {c.category}
                  </span>
                </div>

                <h3 className="text-lg font-black italic uppercase tracking-tight leading-tight text-zinc-900 group-hover:text-[#2667ff] transition-colors line-clamp-2 mb-2">
                  {c.name}
                </h3>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 flex items-center gap-1 mb-5">
                  <MapPin size={9} /> {c.city}, {c.state}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-auto pt-5 border-t border-zinc-100">
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Annual Fee</p>
                    <p className="text-sm font-black text-zinc-800 mt-1">{c.fee}</p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Seats</p>
                    <p className="text-sm font-black text-zinc-800 mt-1">{c.seats || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                  {c.rating ? (
                    <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-amber-700">
                      <Star size={10} className="fill-amber-400 text-amber-400" /> {c.rating}/5
                    </span>
                  ) : <span />}
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#2667ff]">
                    Details <ChevronRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════ STUDENT TESTIMONIALS ══════════════ */}
        <section className="mb-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border w-fit mb-5 bg-emerald-50 border-emerald-200 text-emerald-700">
                <ShieldCheck size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Student voices and critiques</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95]">
                What students{" "}
                <span className="text-[#2667ff] italic underline decoration-[#2667ff]/30 decoration-4 underline-offset-4">
                  actually
                </span>{" "}
                say.
              </h2>
              <p className="text-zinc-500 text-base font-medium leading-relaxed mt-5">
                Honest student experiences with{" "}
                <span className="font-black text-zinc-900">positives</span>,{" "}
                <span className="font-black text-zinc-900">tradeoffs</span>, and{" "}
                <span className="font-black text-zinc-900">critiques</span> shown together.
              </p>
              <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-5" />
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#2667ff] hover:text-zinc-900 transition-colors mb-2"
            >
              Read student reviews <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>
        </section>

        {/* ══════════════ WHY TRUST US ══════════════ */}
        <section className="mb-24">
          <SectionHeader eyebrow="Why Collegy" title="No fluff." accent="just facts" />
          <div className="grid md:grid-cols-3 gap-6">
            {WHY.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2667ff]/10 flex items-center justify-center mb-6">
                  <Icon size={20} className="text-[#2667ff]" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 mb-3">{title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section className="pb-24">
          <div className="bg-[#2667ff]/10 rounded-[3rem] p-10 md:p-14 border-2 border-zinc-100 shadow-2xl shadow-black/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <EyebrowBadge>Ready when you are</EyebrowBadge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95]">
                Find your <span className="text-[#2667ff] italic">dream</span> college.
              </h2>
              <p className="text-zinc-500 text-sm font-medium mt-4 max-w-md leading-relaxed">
                Compare programs, fees and outcomes side by side, and talk to real students before you decide.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => goExplore("")}
                className="flex items-center gap-2 bg-[#2667ff] hover:bg-zinc-900 text-white px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-100"
              >
                Explore Colleges <ArrowRight size={14} />
              </button>
              <Link
                href="/book-session"
                className="flex items-center gap-2 bg-white border-2 border-white hover:border-[#2667ff]/30 text-zinc-900 px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95"
              >
                Book Session
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}