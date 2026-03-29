"use client";
import React, { useState } from "react";
import {
  Calendar, Clock, Users, Video, ChevronRight,
  Mic, BookOpen, FlaskConical, Scale, Stethoscope,
  Palette, Globe, ArrowRight, Bell, Star, Zap,
  Sparkles
} from "lucide-react";

const STREAMS = [
  { id: "all", label: "All", icon: Globe },
  { id: "engineering", label: "Engineering", icon: FlaskConical },
  { id: "medical", label: "Medical", icon: Stethoscope },
  { id: "management", label: "Management", icon: BookOpen },
  { id: "law", label: "Law", icon: Scale },
  { id: "design", label: "Design", icon: Palette },
];

const WEBINARS = [
  {
    id: 1,
    stream: "engineering",
    streamLabel: "Engineering",
    streamColor: "#2667ff",
    streamBg: "#EFF4FF",
    title: "JEE Advanced 2025 — Strategy & Paper Analysis",
    speaker: "Dr. Rajesh Sharma",
    designation: "Ex-IIT Bombay Faculty, 18 yrs exp.",
    avatar: "RS",
    avatarColor: "#2667ff",
    date: "Apr 5, 2025",
    time: "6:00 PM IST",
    duration: "90 min",
    registered: 4821,
    capacity: 6000,
    tags: ["JEE", "IIT", "Strategy"],
    featured: true,
    live: false,
  },
  {
    id: 2,
    stream: "medical",
    streamLabel: "Medical",
    streamColor: "#16A34A",
    streamBg: "#F0FDF4",
    title: "NEET 2025 Biology — High-Yield Chapters & MCQ Patterns",
    speaker: "Dr. Priya Menon",
    designation: "MBBS, AIIMS Alumni & NEET Mentor",
    avatar: "PM",
    avatarColor: "#16A34A",
    date: "Apr 7, 2025",
    time: "5:30 PM IST",
    duration: "75 min",
    registered: 3200,
    capacity: 5000,
    tags: ["NEET", "Biology", "AIIMS"],
    featured: false,
    live: true,
  },
  {
    id: 3,
    stream: "management",
    streamLabel: "Management",
    streamColor: "#9333EA",
    streamBg: "#FAF5FF",
    title: "CAT 2025 Quant Shortcuts — From 80 to 99 Percentile",
    speaker: "Amit Goyal",
    designation: "IIM Ahmedabad Alumnus, CAT 99.8%ile",
    avatar: "AG",
    avatarColor: "#9333EA",
    date: "Apr 9, 2025",
    time: "7:00 PM IST",
    duration: "60 min",
    registered: 2750,
    capacity: 4000,
    tags: ["CAT", "Quant", "IIM"],
    featured: false,
    live: false,
  },
  {
    id: 4,
    stream: "law",
    streamLabel: "Law",
    streamColor: "#EA580C",
    streamBg: "#FFF7ED",
    title: "CLAT 2025 — Legal Reasoning & Current Affairs Masterclass",
    speaker: "Adv. Neha Kapoor",
    designation: "NLU Delhi Alumna, CLAT Trainer",
    avatar: "NK",
    avatarColor: "#EA580C",
    date: "Apr 11, 2025",
    time: "6:30 PM IST",
    duration: "80 min",
    registered: 1540,
    capacity: 3000,
    tags: ["CLAT", "NLU", "Legal"],
    featured: false,
    live: false,
  },
  {
    id: 5,
    stream: "engineering",
    streamLabel: "Engineering",
    streamColor: "#2667ff",
    streamBg: "#EFF4FF",
    title: "BITSAT vs JEE Mains — Which to Prioritise & How?",
    speaker: "Vikram Anand",
    designation: "BITS Pilani CSE, Product @ Google",
    avatar: "VA",
    avatarColor: "#2667ff",
    date: "Apr 13, 2025",
    time: "5:00 PM IST",
    duration: "60 min",
    registered: 2100,
    capacity: 3500,
    tags: ["BITSAT", "JEE", "BITS"],
    featured: false,
    live: false,
  },
  {
    id: 6,
    stream: "design",
    streamLabel: "Design",
    streamColor: "#DB2777",
    streamBg: "#FDF2F8",
    title: "NID & NIFT 2025 Portfolio Secrets — What Jurors Look For",
    speaker: "Ria Sinha",
    designation: "NID Ahmedabad Alumni, Design Lead",
    avatar: "RS",
    avatarColor: "#DB2777",
    date: "Apr 15, 2025",
    time: "4:00 PM IST",
    duration: "70 min",
    registered: 980,
    capacity: 2000,
    tags: ["NID", "NIFT", "Portfolio"],
    featured: false,
    live: false,
  },
  {
    id: 7,
    stream: "medical",
    streamLabel: "Medical",
    streamColor: "#16A34A",
    streamBg: "#F0FDF4",
    title: "AIIMS vs PGI — Choosing the Right MD Specialisation",
    speaker: "Dr. Arjun Mehta",
    designation: "Sr. Resident, AIIMS Delhi",
    avatar: "AM",
    avatarColor: "#16A34A",
    date: "Apr 17, 2025",
    time: "8:00 PM IST",
    duration: "90 min",
    registered: 1800,
    capacity: 3000,
    tags: ["AIIMS", "MBBS", "PG"],
    featured: false,
    live: false,
  },
  {
    id: 8,
    stream: "management",
    streamLabel: "Management",
    streamColor: "#9333EA",
    streamBg: "#FAF5FF",
    title: "MBA Abroad vs India — ROI, Scholarships & Career Paths",
    speaker: "Shruti Bose",
    designation: "IIM-C + Wharton Alumni, VC Analyst",
    avatar: "SB",
    avatarColor: "#9333EA",
    date: "Apr 19, 2025",
    time: "7:30 PM IST",
    duration: "75 min",
    registered: 2300,
    capacity: 4000,
    tags: ["MBA", "Abroad", "Scholarships"],
    featured: false,
    live: false,
  },
];

function ProgressBar({ registered, capacity, color }) {
  const pct = Math.min((registered / capacity) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function WebinarSection() {
  const [activeStream, setActiveStream] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  // const featured = WEBINARS.find((w) => w.featured);
  // const filtered = WEBINARS.filter(
  //   (w) => !w.featured && (activeStream === "all" || w.stream === activeStream)
  // );

  return (
    <section className=" py-20 ">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ── HEADER ─────────────────────────────────── */}
       

           <div className="relative mb-8  flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/30 mb-4">
          <Sparkles size={14} className="text-[#2667ff]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
            Live & Upcoming | Free to Join
          </span>
        </div>
        <h1 className="sm:text-6xl text-5xl font-black tracking-tighter text-center leading-[0.8] mb-4">
          <span className="text-zinc-900">Our </span>
          <span className="bg-gradient-to-br from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic pr-3">
            Webinars
          </span>
        </h1>
        <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-800 to-[#2667ff] rounded-full mt-2" />
      </div>

        {/* ── FEATURED WEBINAR ───────────────────────── */}
      

        {/* ── STREAM TABS ────────────────────────────── */}
        {/* <div className="flex items-center gap-2 flex-wrap mb-8">
          {STREAMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveStream(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
                activeStream === id
                  ? "bg-[#2667ff] text-white border-[#2667ff] shadow-lg shadow-blue-100"
                  : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div> */}

        {/* ── WEBINAR GRID ───────────────────────────── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {WEBINARS.slice(0, 6).map((w) => (
            <div
              key={w.id}
              onMouseEnter={() => setHoveredId(w.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative bg-white  shadow-2xl shadow-black/20 border-2 border-white rounded-[28px] p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer ${
                hoveredId === w.id
                  ? " -translate-y-1"
                  : ""
              }`}
            >
              {/* LIVE badge */}
              {w.live && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Live Now
                </div>
              )}

              {/* Stream badge */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border"
                  style={{ color: w.streamColor, backgroundColor: w.streamBg, borderColor: w.streamBg }}
                >
                  {w.streamLabel}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-[1000] text-slate-900 leading-snug tracking-tight group-hover:text-[#2667ff] transition-colors">
                {w.title}
              </h3>

              {/* Speaker */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black shrink-0"
                  style={{ backgroundColor: w.streamColor }}
                >
                  {w.avatar}
                </div>
                <div>
                  <p className="text-slate-900 font-black text-[11px]">{w.speaker}</p>
                  <p className="text-slate-400 text-[9px] font-bold leading-snug">{w.designation}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                  <Calendar size={11} className="text-[#2667ff]" /> {w.date}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                  <Clock size={11} className="text-[#2667ff]" /> {w.time}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                  <Video size={11} className="text-[#2667ff]" /> {w.duration}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {w.tags.map((t) => (
                  <span key={t} className="bg-slate-50 border border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>

              {/* Registration progress */}
              <div className="space-y-1.5 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Users size={10} /> {w.registered.toLocaleString()} registered
                  </span>
                  <span className="text-[9px] font-black text-slate-400">
                    {w.capacity.toLocaleString()} capacity
                  </span>
                </div>
                <ProgressBar registered={w.registered} capacity={w.capacity} color={w.streamColor} />
              </div>

              {/* CTA */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all duration-300 active:scale-95"
                style={
                  hoveredId === w.id
                    ? { backgroundColor: w.streamColor, color: "#fff", boxShadow: `0 8px 24px ${w.streamColor}33` }
                    : { backgroundColor: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }
                }
              >
                {w.live ? (
                  <><Mic size={12} /> Join Live Session</>
                ) : (
                  <><Bell size={12} /> Register Free</>
                )}
                <ChevronRight size={12} />
              </button>
            </div>
          ))}

          {WEBINARS.slice(0, 6).length === 0 && (
            <div className="col-span-3 text-center py-20 bg-slate-50 rounded-[28px] border border-dashed border-slate-200">
              <Video className="mx-auto mb-3 text-slate-300" size={36} />
              <p className="text-slate-500 font-bold text-sm">No upcoming webinars for this stream yet.</p>
              <p className="text-slate-400 text-xs mt-1">Check back soon or explore another stream.</p>
            </div>
          )}
        </div>

 

      </div>
    </section>
  );
}