"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Building2, Briefcase, SlidersHorizontal, ArrowRight, ShieldCheck,
  Video, MessageSquare, BadgeCheck, Users, HelpCircle, Sparkles, X, MapPin,
} from "lucide-react";
import { FALLBACK_MENTORS, mapMentor, initials, API } from "../../lib/mentorsData";

// ─── config ───────────────────────────────────────────────────────────────────
const HERO_IMAGE = null; // e.g. "/mentor-hero.png" (student with question marks)

const EXPERTISE = ["Campus Life", "Academic Life", "Internship", "SAT/Interview", "Placements", "Hostel Life"];

const TRUST = [
  { icon: ShieldCheck, title: "100% Verified Seniors", text: "Every mentor is manually verified. No fake profiles.", wrap: "bg-[#2667ff]/10 border-[#2667ff]/20", color: "text-[#2667ff]" },
  { icon: Video, title: "Direct 1:1 Video Calls", text: "Secure Google Meet link directly. No middleman.", wrap: "bg-emerald-50 border-emerald-200", color: "text-emerald-600" },
  { icon: MessageSquare, title: "Unfiltered Reality", text: "Absolute truth about hostels and placements.", wrap: "bg-amber-50 border-amber-200", color: "text-amber-600" },
];

// ─── atoms ────────────────────────────────────────────────────────────────────
function Avatar({ mentor, size = "w-24 h-24", text = "text-2xl" }) {
  return (
    <div className={`${size} rounded-full bg-white p-1.5 shadow-lg shrink-0`}>
      {mentor.photo ? (
        <img src={mentor.photo} alt={mentor.name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <div className={`w-full h-full rounded-full bg-zinc-100 flex items-center justify-center font-black text-zinc-400 ${text}`}>
          {initials(mentor.name)}
        </div>
      )}
    </div>
  );
}

function CollegeLogo({ mentor, size = "w-14 h-14" }) {
  return (
    <div className={`${size} rounded-full bg-white shadow-md border border-zinc-100 flex items-center justify-center overflow-hidden`}>
      {mentor.logo ? (
        <img src={mentor.logo} alt={mentor.college} className="w-3/4 h-3/4 object-contain" />
      ) : (
        <span className="text-[10px] font-black text-[#2667ff]">{initials(mentor.college)}</span>
      )}
    </div>
  );
}

function Cover({ mentor, className = "h-36" }) {
  return (
    <div className={`relative ${className} overflow-hidden`}>
      {mentor.cover ? (
        <img src={mentor.cover} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${mentor.tone}`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", backgroundSize: "18px 18px" }} />
        </div>
      )}
      <span className="absolute top-4 right-4 bg-white/95 text-zinc-700 text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-sm">
        New Mentor
      </span>
    </div>
  );
}

function FilterSelect({ icon: Icon, value, onChange, options, placeholder, disabled = false }) {
  return (
    <div className={`relative flex-1 min-w-0 ${disabled ? "opacity-50" : ""}`}>
      <Icon size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none ${disabled ? "text-zinc-300" : "text-[#2667ff]"}`} />
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent pl-13 pr-12 py-5 text-sm font-black text-zinc-900 outline-none cursor-pointer disabled:cursor-not-allowed"
        style={{ paddingLeft: "3.25rem" }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <SlidersHorizontal size={15} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
    </div>
  );
}

function MentorCard({ mentor, onBook }) {
  return (
    <div
      onClick={() => onBook(mentor)}
      className="group bg-white rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative">
        <Cover mentor={mentor} />
        <div className="absolute left-6 -bottom-12">
          <Avatar mentor={mentor} />
        </div>
        <div className="absolute right-6 -bottom-7">
          <CollegeLogo mentor={mentor} />
        </div>
      </div>

      <div className="pt-16 px-7 pb-6 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black tracking-tight text-zinc-900 group-hover:text-[#2667ff] transition-colors">
            {mentor.name}
          </h3>
          <BadgeCheck size={17} className="text-[#2667ff] shrink-0" />
        </div>
        <p className="text-sm font-black text-zinc-800 mt-2">{mentor.college}</p>
        <p className="text-sm text-zinc-500 font-medium mt-0.5 flex items-center gap-1">
          <MapPin size={12} className="text-zinc-400" /> {mentor.campus}
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {mentor.expertise.map((t) => (
            <span key={t} className="bg-white border border-zinc-200 text-zinc-600 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 px-7 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400">Sessions from</p>
          <p className="text-lg font-black text-zinc-900 mt-1">Rs. {mentor.price}</p>
        </div>
        <button
          onClick={() => onBook(mentor)}
          className="flex items-center gap-2 bg-white border-2 border-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 px-6 py-3.5 rounded-2xl text-xs font-black tracking-wide transition-all active:scale-95"
        >
          Book Session <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function MentorsPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState(FALLBACK_MENTORS);
  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("");
  const [campus, setCampus] = useState("");
  const [expertise, setExpertise] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/mentors`); // assumed endpoint
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.data;
        if (active && Array.isArray(list) && list.length > 0) setMentors(list.map(mapMentor));
      } catch (e) {
        console.error("Failed to fetch mentors", e);
      }
    })();
    return () => { active = false; };
  }, []);

  const colleges = useMemo(() => Array.from(new Set(mentors.map((m) => m.college))).sort(), [mentors]);
  const campuses = useMemo(
    () => Array.from(new Set(mentors.filter((m) => m.college === college).map((m) => m.campus))).sort(),
    [mentors, college]
  );
  const allExpertise = useMemo(
    () => Array.from(new Set([...EXPERTISE, ...mentors.flatMap((m) => m.expertise)])),
    [mentors]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mentors.filter(
      (m) =>
        (!q || m.name.toLowerCase().includes(q)) &&
        (!college || m.college === college) &&
        (!campus || m.campus === campus) &&
        (!expertise || m.expertise.includes(expertise))
    );
  }, [mentors, search, college, campus, expertise]);

  const hasFilters = search || college || campus || expertise;
  const reset = () => { setSearch(""); setCollege(""); setCampus(""); setExpertise(""); };
  const book = (m) => router.push(`/mentors/${encodeURIComponent(m.id)}`);

  const preview = mentors.slice(0, 3);
  const tilt = ["-rotate-2 lg:translate-y-24", "lg:-translate-y-4", "rotate-2 lg:translate-y-20"];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 overflow-x-hidden relative">
      <style>{`
        @keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .float-soft { animation: float-y 4.5s ease-in-out infinite; }
      `}</style>

      {/* Background glow + grid (design.md §5) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-[#2667ff]/10 blur-[110px] rounded-full" />
        <div className="absolute bottom-[5%] left-[15%] w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full" />
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
        <section className="pt-28 lg:pt-32 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-zinc-100 shadow-sm text-[#2667ff] mb-8">
            <Users size={14} />
            <span className="text-[11px] font-black tracking-wide">Find the right mentor. Shape your future.</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Choose. Connect.{" "}
            <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic">Grow.</span>
          </h1>
          <p className="text-zinc-500 text-base lg:text-lg font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
            Explore mentors from top institutes and book 1:1 sessions to get personalized guidance.
          </p>
          <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mx-auto mt-6" />

          {/* Illustration + connected preview cards */}
          <div className="relative mt-14 lg:mt-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-6 lg:min-h-[560px]">
            {/* Thinking student */}
            <div className="relative w-64 h-72 lg:w-72 lg:h-[420px] lg:mt-16 shrink-0">
              {HERO_IMAGE ? (
                <img src={HERO_IMAGE} alt="Student choosing a mentor" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full rounded-[3rem] bg-gradient-to-br from-[#2667ff]/10 to-[#3f8efc]/10 border-2 border-white shadow-xl flex items-center justify-center">
                  <Users size={90} className="text-[#2667ff]/25" />
                </div>
              )}
              {[
                { s: 54, pos: "-top-6 left-14", d: "0s" },
                { s: 36, pos: "top-4 -left-2", d: "0.8s" },
                { s: 34, pos: "top-8 right-4", d: "1.6s" },
              ].map((q, i) => (
                <HelpCircle
                  key={i}
                  size={q.s}
                  style={{ animationDelay: q.d }}
                  className={`float-soft absolute ${q.pos} text-[#2667ff]/50`}
                />
              ))}
              <Sparkles size={16} className="absolute top-0 right-16 text-[#2667ff]/40" />
            </div>

            {/* Preview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left relative">
              <svg className="hidden lg:block absolute inset-0 w-full h-full -z-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 62 C 20 40, 30 70, 50 50 S 85 60, 100 50" fill="none" stroke="#2667ff" strokeOpacity="0.25" strokeWidth="0.4" strokeDasharray="1.5 1.5" vectorEffect="non-scaling-stroke" />
              </svg>
              {preview.map((m, i) => (
                <div key={m.id} className={`${tilt[i]} transition-transform`}>
                  <div className="bg-white rounded-[2rem] border-2 border-white shadow-2xl overflow-hidden">
                    <div className="relative">
                      <Cover mentor={m} className="h-24" />
                      <div className="absolute left-5 -bottom-9"><Avatar mentor={m} size="w-[72px] h-[72px]" text="text-lg" /></div>
                      <div className="absolute right-5 -bottom-5"><CollegeLogo mentor={m} size="w-11 h-11" /></div>
                    </div>
                    <div className="pt-12 px-5 pb-4">
                      <p className="flex items-center gap-1.5 text-base font-black text-zinc-900">
                        {m.name} <BadgeCheck size={14} className="text-[#2667ff]" />
                      </p>
                      <p className="text-xs font-black text-zinc-700 mt-1">{m.college}</p>
                      <p className="text-[11px] text-zinc-400 font-medium">{m.campus}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {m.expertise.slice(0, 2).map((t) => (
                          <span key={t} className="border border-zinc-200 text-zinc-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-[7px] font-black uppercase tracking-[0.25em] text-zinc-400">Sessions from</p>
                        <p className="text-sm font-black text-zinc-900">Rs. {m.price}</p>
                      </div>
                      <button onClick={() => book(m)} className="flex items-center gap-1.5 border-2 border-zinc-100 px-4 py-2 rounded-xl text-[11px] font-black hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all active:scale-95">
                        Book Session <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ TRUST STRIP ══════════════ */}
        <section className="mt-16 lg:mt-8 mb-24">
          <div className="bg-white/80 backdrop-blur rounded-[3rem] border-2 border-white shadow-xl p-6 md:p-8 grid md:grid-cols-3 gap-6">
            {TRUST.map(({ icon: Icon, title, text, wrap, color }) => (
              <div key={title} className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${wrap}`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-zinc-900">{title}</h3>
                  <p className="text-sm text-zinc-500 font-medium mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ FIND YOUR RIGHT MENTOR ══════════════ */}
        <section className="pb-28">
          <div className="mb-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border w-fit mb-5 bg-[#2667ff]/10 border-[#2667ff]/20 text-[#2667ff]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2667ff]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Mentors</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">
              Find Your{" "}
              <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent">Right Mentor</span>
            </h2>
            <p className="text-zinc-500 text-base lg:text-lg font-medium max-w-xl mt-5 leading-relaxed">
              Filter by college or expertise to connect with the perfect senior for 1:1 guidance.
            </p>
            <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-5" />
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-[2.5rem] border-2 border-white shadow-xl ring-1 ring-zinc-100 flex flex-col lg:flex-row lg:items-stretch lg:divide-x divide-zinc-100">
            <div className="relative flex-[1.3] min-w-0">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full bg-transparent pl-14 pr-6 py-5 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium outline-none"
              />
            </div>
            <FilterSelect
              icon={Building2}
              value={college}
              onChange={(v) => { setCollege(v); setCampus(""); }}
              options={colleges}
              placeholder="All Colleges"
            />
            <FilterSelect
              icon={Building2}
              value={campus}
              onChange={setCampus}
              options={campuses}
              placeholder={college ? "All Campuses" : "Select College First"}
              disabled={!college}
            />
            <FilterSelect
              icon={Briefcase}
              value={expertise}
              onChange={setExpertise}
              options={allExpertise}
              placeholder="Any Expertise"
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between flex-wrap gap-3 mt-10 mb-6 px-2">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
              Showing <span className="text-zinc-900">{filtered.length}</span> mentors
            </p>
            {hasFilters && (
              <button onClick={reset} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#2667ff] hover:text-zinc-900 transition-colors">
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((m) => <MentorCard key={m.id} mentor={m} onBook={book} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200">
              <Users className="mx-auto mb-4 text-zinc-200" size={40} />
              <p className="text-zinc-500 font-bold text-sm mb-3">No mentors match your filters.</p>
              <button onClick={reset} className="text-[#2667ff] font-black uppercase text-[9px] tracking-widest hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}