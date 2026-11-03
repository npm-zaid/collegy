"use client";
// Save as app/online-colleges/page.jsx
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ArrowRight, Wifi, MapPin, Star, ChevronRight, ChevronDown, ShieldCheck, Clock,
  Wallet, Video, Laptop, Award, BadgeCheck, Users, BookOpen, GraduationCap, Briefcase,
  CheckCircle2, X, Quote, Sparkles, CalendarClock, Globe,
} from "lucide-react";

// ─── helpers (design.md §10) ──────────────────────────────────────────────────
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
const imgSrc = (v) => (!v ? null : v.startsWith("http") ? v : `${API}/uploads/colleges/${v}`);

const BOOK_ROUTE = "/book-session"; // change if your route differs

// ─── content (placeholder — replace with real data) ───────────────────────────
const ACCREDITATIONS = [
  { icon: ShieldCheck, label: "UGC-DEB Entitled", note: "Approved to offer online degrees" },
  { icon: Award, label: "NAAC Graded", note: "Quality-assessed institutions" },
  { icon: BadgeCheck, label: "AICTE Approved", note: "Technical & management programs" },
  { icon: Globe, label: "Globally Recognised", note: "Check WES / AIU equivalence" },
];

const WHY = [
  { icon: Clock, title: "Learn on your schedule", text: "Recorded lectures plus weekend live classes, so you can study around a job or other commitments.", accent: "bg-[#2667ff]" },
  { icon: Wallet, title: "Lower total cost", text: "Fees are typically a fraction of on-campus programs, with no hostel or relocation costs. EMI options are common.", accent: "bg-emerald-500" },
  { icon: Briefcase, title: "Earn while you learn", text: "Keep your salary and apply what you study at work straight away.", accent: "bg-amber-500" },
  { icon: Video, title: "Live + recorded classes", text: "Attend live sessions, rewatch recordings, and get doubts solved by faculty and mentors.", accent: "bg-violet-500" },
  { icon: Laptop, title: "Study from anywhere", text: "A phone or laptop is all you need. Exams can often be taken online or at a nearby centre.", accent: "bg-cyan-500" },
  { icon: Users, title: "Alumni & peer network", text: "Join cohorts, discussion groups and alumni communities across cities.", accent: "bg-[#2667ff]" },
];

const COMPARE = [
  { label: "Class format", online: "Live + recorded, anywhere", regular: "Fixed campus timetable" },
  { label: "Typical fees", online: "Lower overall cost", regular: "Higher, plus hostel & travel" },
  { label: "Flexibility", online: "Study alongside a job", regular: "Full-time commitment" },
  { label: "Campus experience", online: "Virtual communities, optional meetups", regular: "Full on-campus life" },
  { label: "Placements", online: "Career services, varies by university", regular: "Campus recruitment drives" },
  { label: "Duration", online: "Often flexible, extendable", regular: "Fixed term" },
];

const STEPS = [
  { n: 1, title: "Shortlist", text: "Compare programs, fees and ratings side by side." },
  { n: 2, title: "Verify", text: "Check UGC-DEB entitlement and read verified student reviews." },
  { n: 3, title: "Talk to seniors", text: "Book a 1:1 session with an online-degree student or alumnus." },
  { n: 4, title: "Apply", text: "Apply directly to the university and start learning." },
];

const REVIEWS = [
  { id: "r1", name: "Rohit Verma", verified: true, college: "Online MBA", batch: "Class of 2026", aspect: "Flexibility", rating: 4, tags: ["Weekend classes", "Recorded lectures", "Working professional"], text: "I could keep my job and still attend live sessions on weekends. The recordings saved me whenever work got hectic." },
  { id: "r2", name: "Anonymous Student", anonymous: true, college: "Online BCA", batch: "Class of 2027", aspect: "Learning Quality", rating: 3, tags: ["Self-paced", "Doubt sessions", "Needs discipline"], text: "Content is decent, but you must be self-driven. Doubt sessions help, though response time varies." },
  { id: "r3", name: "Sneha Kulkarni", verified: true, college: "Online M.Com", batch: "Class of 2026", aspect: "Value for Money", rating: 4, tags: ["Affordable", "EMI available", "Exam centres"], text: "Fees were reasonable and the EMI option made it easy. Do check the exam mode and degree recognition before you enrol." },
];

const FAQS = [
  { q: "Are online degrees valid in India?", a: "Yes, when the university is UGC-DEB entitled for that program. Always verify the entitlement on the official UGC-DEB website before you apply." },
  { q: "Can I get a government job with an online degree?", a: "Degrees from UGC-entitled universities are generally treated as equivalent to regular degrees, but individual recruiters and exams can have their own rules. Check the eligibility notice of the post you're targeting." },
  { q: "How are exams conducted?", a: "It varies by university. Some hold proctored online exams, others use in-person centres. Ask for the exact exam mode for the program you pick." },
  { q: "Are there placements for online programs?", a: "Many universities offer career services such as resume help, job portals and interview prep, but campus-style placement drives are less common. Ask for recent outcomes data." },
  { q: "Can I study online while working full-time?", a: "That's what these programs are designed for. Weekend live classes and recorded lectures let most working professionals manage alongside a job." },
  { q: "What does an online degree cost?", a: "Fees differ widely by university and program. Compare the fee on each university card, and confirm the total program fee, not just the per-semester amount." },
];

const FALLBACK_COLLEGES = [
  { id: "f1", name: "Amity University Online", city: "Noida", state: "Uttar Pradesh", fee: "₹1.9L", feeNum: 190000, programs: ["MBA", "BBA", "BCA", "MCA"], rating: "4.3", rank: "-", category: "Online" },
  { id: "f2", name: "Manipal University Online", city: "Jaipur", state: "Rajasthan", fee: "₹1.7L", feeNum: 170000, programs: ["MBA", "BCA", "MCA", "B.Com"], rating: "4.4", rank: "-", category: "Online" },
  { id: "f3", name: "NMIMS Online", city: "Mumbai", state: "Maharashtra", fee: "₹2.5L", feeNum: 250000, programs: ["MBA", "BBA"], rating: "4.5", rank: "-", category: "Online" },
  { id: "f4", name: "Lovely Professional University Online", city: "Phagwara", state: "Punjab", fee: "₹1.2L", feeNum: 120000, programs: ["MBA", "BCA", "B.Com", "MA"], rating: "4.2", rank: "-", category: "Online" },
  { id: "f5", name: "Jain University Online", city: "Bengaluru", state: "Karnataka", fee: "₹1.5L", feeNum: 150000, programs: ["MBA", "BBA", "BCA", "M.Com"], rating: "4.3", rank: "-", category: "Online" },
  { id: "f6", name: "Symbiosis Centre for Distance Learning", city: "Pune", state: "Maharashtra", fee: "₹1.1L", feeNum: 110000, programs: ["MBA", "BBA", "MA"], rating: "4.4", rank: "-", category: "Online" },
];

// ─── atoms (design.md §6) ─────────────────────────────────────────────────────
function EyebrowBadge({ children, icon: Icon = null, tone = "blue" }) {
  const t = tone === "cyan"
    ? "bg-cyan-50 border-cyan-200 text-cyan-700"
    : tone === "emerald"
    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
    : "bg-[#2667ff]/10 border-[#2667ff]/20 text-[#2667ff]";
  return (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border w-fit mb-5 ${t}`}>
      {Icon ? <Icon size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{children}</span>
    </div>
  );
}

function SectionHeader({ eyebrow, title, accent, sub = undefined, tone = "blue" }) {
  return (
    <div className="flex flex-col items-start mb-10">
      <EyebrowBadge tone={tone}>{eyebrow}</EyebrowBadge>
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95]">
        {title}{" "}
        <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic">{accent}</span>
      </h2>
      {sub && <p className="text-zinc-500 text-base font-medium leading-relaxed mt-4 max-w-xl">{sub}</p>}
      <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-4" />
    </div>
  );
}

function LogoTile({ name, size = "w-12 h-12", cover }) {
  return (
    <div className={`${size} rounded-xl bg-gradient-to-br from-cyan-500 to-[#2667ff] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md overflow-hidden`}>
      {cover ? <img src={cover} alt="" className="w-full h-full object-cover" /> : initials(name)}
    </div>
  );
}

function CollegeCard({ c, onOpen }) {
  return (
    <div
      onClick={() => onOpen(c)}
      className="group text-left bg-white p-7 rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="flex items-start justify-between mb-5">
        <LogoTile name={c.name} size="w-14 h-14" cover={c.image} />
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.15em] bg-cyan-50 text-cyan-700 border-cyan-200 shadow-sm shadow-cyan-100">
          <Wifi size={8} /> Online
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {c.rank !== "-" && (
          <span className="text-[9px] font-black text-zinc-700 bg-white border border-zinc-200 rounded-lg px-2 py-1">#{c.rank}</span>
        )}
        <h3 className="text-lg font-black italic uppercase tracking-tight leading-tight text-zinc-900 group-hover:text-[#2667ff] transition-colors line-clamp-2">
          {c.name}
        </h3>
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 flex items-center gap-1 mb-4">
        <MapPin size={9} /> {c.city}, {c.state}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {c.programs.slice(0, 4).map((p) => (
          <span key={p} className="bg-white border border-zinc-200 text-zinc-500 text-[8px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg">{p}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-5 border-t border-zinc-100">
        <div className="bg-zinc-50 rounded-xl p-3">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Annual Fee</p>
          <p className="text-sm font-black text-zinc-800 mt-1">{c.fee}</p>
        </div>
        <div className="bg-zinc-50 rounded-xl p-3">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Programs</p>
          <p className="text-sm font-black text-zinc-800 mt-1">{c.programs.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        {c.rating ? (
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-amber-700">
            <Star size={10} className="fill-amber-400 text-amber-400" /> {c.rating}/5
          </span>
        ) : <span />}
        <span className="group/btn relative flex items-center gap-1.5 bg-zinc-900 overflow-hidden px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white">
          <span className="absolute inset-0 w-0 bg-[#2667ff] transition-all duration-500 group-hover:w-full" />
          <span className="relative z-10 flex items-center gap-1">Details <ChevronRight size={11} /></span>
        </span>
      </div>
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div className="relative bg-white rounded-[2.5rem] border-2 border-[#2667ff]/10 shadow-xl hover:shadow-2xl hover:border-[#2667ff]/30 transition-all p-7 flex flex-col">
      <Quote size={40} className="absolute top-7 right-7 text-[#2667ff]/15" />
      <div className="flex items-start gap-4 mb-6 pr-12">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-md ${r.anonymous ? "bg-zinc-100 text-zinc-500" : "bg-[#2667ff] text-white"}`}>
          {r.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-black text-zinc-900 tracking-tight">{r.name}</p>
            {r.anonymous ? (
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[9px] font-black uppercase tracking-widest text-zinc-500">Anonymous</span>
            ) : r.verified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] font-black uppercase tracking-widest text-emerald-700">
                <ShieldCheck size={10} /> Verified
              </span>
            ) : null}
          </div>
          <p className="text-sm text-zinc-500 font-medium mt-1">{r.college}</p>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">{r.batch}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-sm font-black text-[#2667ff]">{r.aspect}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={14} className={n <= r.rating ? "fill-amber-500 text-amber-500" : "text-amber-500"} />
          ))}
          <span className="ml-1.5 text-xs font-black text-amber-700">{r.rating}/5</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {r.tags.map((t) => (
          <span key={t} className="bg-zinc-50 border border-zinc-100 text-zinc-600 text-xs font-bold px-3.5 py-2 rounded-xl">{t}</span>
        ))}
      </div>
      <p className="mt-auto text-zinc-600 text-sm font-medium italic leading-relaxed bg-white rounded-[1.75rem] border border-[#2667ff]/15 p-5">{r.text}</p>
    </div>
  );
}

function Faq({ item, open, onToggle }) {
  return (
    <div className={`bg-white rounded-[2rem] border-2 shadow-md transition-all ${open ? "border-[#2667ff]/30 shadow-xl" : "border-white hover:border-[#2667ff]/20"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left px-7 py-5">
        <span className="text-sm md:text-base font-black text-zinc-900 tracking-tight">{item.q}</span>
        <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${open ? "bg-[#2667ff] text-white rotate-180" : "bg-zinc-100 text-zinc-400"}`}>
          <ChevronDown size={15} />
        </span>
      </button>
      {open && <p className="px-7 pb-6 -mt-1 text-sm text-zinc-500 font-medium leading-relaxed">{item.a}</p>}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function OnlineCollegesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [colleges, setColleges] = useState(FALLBACK_COLLEGES);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/colleges?limit=100`);
        const json = await res.json();
        if (!active || !json.success) return;
        const mapped = json.data
          .filter((c) => (c.collegeType || "").toLowerCase().includes("online") || (c.modes || []).includes("Online"))
          .map((c) => {
            const fees = c.courses?.map((co) => co.fees?.yearlyFees || co.fees?.totalFees || 0).filter((f) => f > 0) || [];
            const feeNum = c.annualFees || (fees.length ? Math.min(...fees) : 0);
            const ratings = c.reviews?.map((r) => r.rating || 0) || [];
            return {
              id: c._id || c.collegeId,
              name: c.collegeName || "Unknown",
              city: c.location?.city || "Unknown",
              state: c.location?.state || "Unknown",
              programs: c.courses?.map((co) => co.courseName) || [],
              feeNum,
              fee: feeNum ? formatFee(feeNum) : "N/A",
              rating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null,
              rank: c.nirfRanking?.overallRank || "-",
              image: imgSrc(c.media?.images?.[0]?.filename),
              category: c.collegeType || "Online",
            };
          });
        if (mapped.length > 0) setColleges(mapped);
      } catch (e) {
        console.error("Failed to fetch colleges", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return colleges
      .filter((c) =>
        !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.programs.some((p) => p.toLowerCase().includes(q))
      )
      .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
  }, [colleges, query]);

  const hasFilters = !!query;
  const reset = () => setQuery("");
  const open = (c) => router.push(`/explore/${toSlug(c.name)}`);
  const scrollToList = () => document.getElementById("online-list")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 overflow-x-hidden relative">
      <style>{`
        @keyframes float-y { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1.5deg); } }
        .float-card { animation: float-y 5s ease-in-out infinite; }
      `}</style>

      {/* Background glow + grid (design.md §5) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] bg-cyan-400/10 blur-[110px] rounded-full" />
        <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-[100vh] z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right,#829cec38 1px,transparent 1px),linear-gradient(to bottom,#829cec38 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ══════════════ HERO ══════════════ */}
        <section className="grid lg:grid-cols-12 gap-12 pt-28 lg:pt-36 pb-16 items-center">
          <div className="lg:col-span-7">
            <EyebrowBadge icon={Wifi} tone="cyan">Online Colleges</EyebrowBadge>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
              Earn a degree{" "}
              <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic">from anywhere</span>
            </h1>
            <p className="text-zinc-500 text-base lg:text-lg leading-relaxed max-w-xl mb-10 font-medium">
              <span className="text-zinc-900">Compare UGC-entitled online universities, real fees and verified student reviews</span>{" "}
              — then talk to students before you enrol.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); scrollToList(); }}
              className="flex items-center bg-white rounded-[2rem] pl-6 pr-2 py-2 gap-3 max-w-2xl border-2 border-white shadow-xl ring-1 ring-zinc-100 focus-within:ring-[#2667ff]/30 transition-all"
            >
              <Search size={18} className="text-zinc-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search university, program or city…"
                className="flex-1 bg-transparent outline-none text-base font-bold text-zinc-900 placeholder:text-zinc-400 min-w-0"
              />
              <button type="submit" className="flex items-center gap-2 bg-[#2667ff] hover:bg-zinc-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors active:scale-95 shadow-lg shadow-blue-100">
                Search <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Right: illustration stage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-[460px] aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-white shadow-2xl bg-gradient-to-br from-[#2667ff] to-cyan-400 flex items-center justify-center">
              <Laptop size={140} className="text-white/20" />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }} />
            </div>
            <div style={{ animationDelay: "0s" }} className="float-card absolute top-[8%] left-[-4%] z-20 hidden sm:flex items-center gap-3 bg-white rounded-[1.5rem] px-4 py-3 border-2 border-white shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center"><ShieldCheck size={18} className="text-white" /></div>
              <div className="leading-tight">
                <p className="text-sm font-black text-zinc-900 uppercase italic">UGC-DEB</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Verified degrees</p>
              </div>
            </div>
            <div style={{ animationDelay: "1.2s" }} className="float-card absolute top-[42%] right-[-6%] z-20 hidden sm:flex items-center gap-3 bg-white rounded-[1.5rem] px-4 py-3 border-2 border-white shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center"><Video size={18} className="text-white" /></div>
              <div className="leading-tight">
                <p className="text-sm font-black text-zinc-900 uppercase italic">Live + Recorded</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Learn your way</p>
              </div>
            </div>
            <Link
              href="/mentors"
              style={{ animationDelay: "2.1s" }}
              className="float-card group/btn absolute bottom-[8%] left-[-6%] z-20 flex items-center gap-3 bg-zinc-900 overflow-hidden rounded-[1.5rem] pl-3 pr-5 py-3 border-2 border-[#2667ff]/40 shadow-2xl"
            >
              <div className="absolute inset-0 w-0 bg-[#2667ff] transition-all duration-500 group-hover/btn:w-full" />
              <span className="relative z-10 w-10 h-10 rounded-xl bg-[#2667ff] group-hover/btn:bg-white/20 flex items-center justify-center transition-colors"><Users size={18} className="text-white" /></span>
              <span className="relative z-10 leading-tight">
                <span className="block text-sm font-black text-white uppercase italic">Connect</span>
                <span className="block text-[8px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white/80">Talk to a student</span>
              </span>
              <ArrowRight size={14} className="relative z-10 text-white" />
            </Link>
          </div>
        </section>

        {/* ══════════════ ACCREDITATION STRIP ══════════════ */}
        <section className="mb-24">
          <div className="bg-white/80 backdrop-blur rounded-[3rem] border-2 border-white shadow-xl p-6 md:p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACCREDITATIONS.map(({ icon: Icon, label, note }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2667ff]/10 border border-[#2667ff]/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#2667ff]" />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 tracking-tight">{label}</p>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ COLLEGE LISTING ══════════════ */}
        <section id="online-list" className="mb-24 scroll-mt-28">
          <SectionHeader eyebrow="Browse" title="Top online" accent="universities" sub="Compare fees, programs and ratings to find the right fit." tone="cyan" />

          <div>
              <div className="flex items-center justify-between flex-wrap gap-3 px-1 mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Showing <span className="text-zinc-900">{filtered.length}</span> universities
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {hasFilters && (
                    <button onClick={reset} className="text-[9px] text-[#2667ff] font-black uppercase tracking-widest flex items-center gap-1 hover:text-zinc-900 transition-colors">
                      <X size={10} /> Clear All
                    </button>
                  )}
                </div>
              </div>

              {loading && colleges === FALLBACK_COLLEGES && (
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-4 animate-pulse">Loading latest data…</p>
              )}

              {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filtered.map((c) => <CollegeCard key={c.id} c={c} onOpen={open} />)}
                </div>
              ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200">
                  <Wifi className="mx-auto mb-4 text-zinc-200" size={40} />
                  <p className="text-zinc-500 font-bold text-sm mb-3">No universities match your filters.</p>
                  <button onClick={reset} className="text-[#2667ff] font-black uppercase text-[9px] tracking-widest hover:underline">Clear all filters</button>
                </div>
              )}
          </div>
        </section>

        {/* ══════════════ WHY ONLINE ══════════════ */}
        <section className="mb-24">
          <SectionHeader eyebrow="Why Online" title="Built around" accent="your life" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {WHY.map(({ icon: Icon, title, text, accent }) => (
              <div key={title} className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all">
                <div className={`w-12 h-12 rounded-2xl ${accent} flex items-center justify-center mb-6`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 mb-3">{title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ ONLINE vs REGULAR ══════════════ */}
        <section className="mb-24">
          <SectionHeader eyebrow="Compare" title="Online vs" accent="regular" sub="An honest look at the trade-offs." />
          <div className="bg-white rounded-[3rem] border-2 border-white shadow-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-zinc-900 text-white">
              <div className="p-5 md:p-7 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">Factor</div>
              <div className="p-5 md:p-7 text-[10px] font-black uppercase tracking-[0.2em] text-[#2667ff] flex items-center gap-2"><Wifi size={13} /> Online</div>
              <div className="p-5 md:p-7 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2"><GraduationCap size={13} /> Regular</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 border-t border-zinc-100 ${i % 2 ? "bg-zinc-50/60" : ""}`}>
                <div className="p-5 md:p-7 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">{row.label}</div>
                <div className="p-5 md:p-7 text-xs md:text-sm font-bold text-zinc-800 flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#2667ff] shrink-0 mt-0.5" /> {row.online}
                </div>
                <div className="p-5 md:p-7 text-xs md:text-sm font-medium text-zinc-500">{row.regular}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section className="mb-24">
          <SectionHeader eyebrow="Process" title="How to pick" accent="the right one" />
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-xl">
                <div className="w-14 h-14 rounded-full bg-[#2667ff] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100 mb-5">{s.n}</div>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">{s.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed mt-2">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ REVIEWS ══════════════ */}
        <section className="mb-24">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader eyebrow="Student voices" title="What online students" accent="actually say" tone="emerald" />
            <Link href="/explore?category=Online" className="mb-10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#2667ff] hover:text-zinc-900 transition-colors">
              Read all reviews <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {REVIEWS.map((r) => <ReviewCard key={r.id} r={r} />)}
          </div>
        </section>

        {/* ══════════════ FAQ ══════════════ */}
        <section className="mb-24">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <SectionHeader eyebrow="FAQ" title="Common" accent="questions" sub="Everything you should know before you enrol." />
            </div>
            <div className="lg:col-span-8 space-y-4">
              {FAQS.map((f, i) => (
                <Faq key={f.q} item={f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section className="pb-24">
          <div className="bg-zinc-900 rounded-[3rem] p-10 md:p-14 border-2 border-[#2667ff]/30 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#2667ff 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border w-fit mb-5 bg-[#2667ff]/15 border-[#2667ff]/30 text-[#2667ff]">
                <Sparkles size={12} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Not sure yet?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] text-white">
                Talk to someone who <span className="text-[#2667ff] italic">did it</span>.
              </h2>
              <p className="text-zinc-400 text-sm font-medium mt-4 max-w-md leading-relaxed">
                Book a 1:1 with a student or expert and get honest answers on fees, exams and recognition.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3">
              <Link href="/mentors" className="flex items-center gap-2 bg-[#2667ff] hover:bg-white hover:text-zinc-900 text-white px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                <Users size={14} /> Talk to a mentor
              </Link>
              <Link href={BOOK_ROUTE} className="flex items-center gap-2 bg-white/10 border border-white/15 hover:bg-white/20 text-white px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                <CalendarClock size={14} /> Book Session
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}