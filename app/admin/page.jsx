"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  GraduationCap, Users, MessageSquare, Briefcase,
  Newspaper, Star, PieChart, Building2, Activity, ShieldCheck
} from "lucide-react";
import { StatCard } from "../../admin-compo/AdminUi";
import { ACTIVITY_DATA } from "../../data/adminData";

const STATS = [
  { icon: <GraduationCap size={18} />, value: "157", label: "Total Colleges", change: "+12 this month", changeType: "up", colorClass: "blue" },
  { icon: <Users size={18} />, value: "1,248", label: "Registered Users", change: "+131 this week", changeType: "up", colorClass: "green" },
  { icon: <MessageSquare size={18} />, value: "32", label: "Pending Consults", change: "8 overdue", changeType: "down", colorClass: "amber" },
  { icon: <Briefcase size={18} />, value: "45", label: "Internship Requests", change: "12 New today", changeType: "up", colorClass: "rose" },
];

const QUICK = [
  { icon: <Newspaper size={20} />, val: "24", label: "News Published" },
  { icon: <Star size={20} />, val: "18", label: "Featured Colleges" },
  { icon: <Building2 size={20} />, val: "45", label: "Govt. Colleges" },
  { icon: <Building2 size={20} />, val: "112", label: "Private Colleges" },
  { icon: <ShieldCheck size={20} />, val: "12", label: "Active Partners" },
  { icon: <MessageSquare size={20} />, val: "18", label: "Consults Done" },
];

const BAR_DATA = [
  { label: "Consultations", val: 32, max: 100, color: "#2667ff" },
  { label: "Internships", val: 45, max: 100, color: "#f43f5e" },
  { label: "News Articles", val: 24, max: 100, color: "#10b981" },
  { label: "New Users", val: 86, max: 100, color: "#8b5cf6" },
  { label: "Partner Requests", val: 12, max: 100, color: "#f59e0b" },
];


const CAT_DATA = [
  { label: "Government", val: 45, max: 157, color: "#2667ff" },
  { label: "Private", val: 112, max: 157, color: "#8b5cf6" },
  { label: "Featured", val: 18, max: 157, color: "#f59e0b" },
  { label: "IITs", val: 23, max: 157, color: "#10b981" },
  { label: "NITs", val: 31, max: 157, color: "#f43f5e" },
];

export default function DashboardPage() {
  const barsRef = useRef(null);
  const actRef = useRef(null);
  const quickRef = useRef(null);

  useEffect(() => {
    // Animate quick cards
    gsap.fromTo(".quick-card",
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.45, ease: "power3.out", delay: 0.45 }
    );
    // Animate chart bars
    setTimeout(() => {
      document.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
    }, 600);
    // Animate activity items
    gsap.fromTo(".activity-row",
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  return (
    <div>
      {/* Stat grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3 mb-7">
        {QUICK.map((q) => (
          <div key={q.label} className="quick-card bg-white border border-slate-100 rounded-[16px] p-4 flex items-center gap-4 shadow-sm">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-indigo-500 shrink-0">
              {q.icon}
            </span>
            <div>
              <div className="font-black text-[20px] leading-none tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>{q.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">{q.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Bar charts */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm">
          <div className="font-bold text-[13px] mb-5 flex items-center gap-2 text-slate-800">
            <PieChart size={16} className="text-indigo-500" /> <span>Requests by Type</span>
          </div>
          <div ref={barsRef} className="flex flex-col gap-4">
            {BAR_DATA.map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-[11px]">
                <div className="w-[90px] text-slate-500 font-semibold text-right flex-shrink-0">{b.label}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-[6px] overflow-hidden">
                  <div
                    className="bar-fill h-full rounded-full transition-all duration-700 ease-out"
                    style={{ background: b.color, width: "0%" }}
                    data-width={`${Math.round((b.val / b.max) * 100)}%`}
                  />
                </div>
                <div className="w-5 text-slate-700 font-bold">{b.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm">
          <div className="font-bold text-[13px] mb-5 flex items-center gap-2 text-slate-800">
            <Building2 size={16} className="text-indigo-500" /> <span>Colleges by Category</span>
          </div>
          <div className="flex flex-col gap-4">
            {CAT_DATA.map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-[11px]">
                <div className="w-[90px] text-slate-500 font-semibold text-right flex-shrink-0">{b.label}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-[6px] overflow-hidden">
                  <div
                    className="bar-fill h-full rounded-full transition-all duration-700 ease-out"
                    style={{ background: b.color, width: "0%" }}
                    data-width={`${Math.round((b.val / b.max) * 100)}%`}
                  />
                </div>
                <div className="w-5 text-slate-700 font-bold">{b.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm">
          <div className="font-bold text-[13px] mb-5 flex items-center gap-2 text-slate-800">
            <Activity size={16} className="text-indigo-500" /> <span>Recent Activity</span>
          </div>
          <div ref={actRef} className="flex flex-col divide-y divide-slate-50">
            {ACTIVITY_DATA.map((a, i) => (
              <div key={i} className="activity-row flex items-center gap-3 py-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.dot }} />
                <div
                  className="text-[12px] text-slate-600 flex-1 leading-snug"
                  dangerouslySetInnerHTML={{ __html: a.text }}
                />
                <div className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured colleges quick strip */}
      <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm">
        <div className="font-bold text-[13px] mb-4 flex items-center gap-2">
          <Star size={14} className="text-amber-500 fill-amber-500" /> Featured Colleges Overview
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "IIT Bombay", rank: 1, field: "Engineering", color: "bg-blue-50 border-blue-100" },
            { name: "IIM Ahmedabad", rank: 1, field: "Management", color: "bg-purple-50 border-purple-100" },
            { name: "AIIMS Delhi", rank: 1, field: "Medicine", color: "bg-emerald-50 border-emerald-100" },
            { name: "NLSIU Bangalore", rank: 1, field: "Law", color: "bg-amber-50 border-amber-100" },
          ].map((c, i) => (
            <div key={c.name} className={`${c.color} border rounded-[16px] p-4`}>
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white text-[9px] font-black mb-3">
                #{c.rank}
              </div>
              <div className="font-black text-[12px] text-slate-800 leading-snug">{c.name}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{c.field}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   GraduationCap, Users, MessageSquare, Briefcase,
//   BarChart3, Activity, Star, Globe, ArrowUpRight,
//   MousePointerClick, Target, ShieldCheck, Zap,
// } from "lucide-react";
// import { ACTIVITY_DATA } from "../../data/adminData";

// gsap.registerPlugin(ScrollTrigger);

// // ─── DATA ─────────────────────────────────────────────────────────────────────
// const STATS = [
//   { icon: <GraduationCap size={20} />, value: "34",  label: "Colleges",    change: "+3 this month" },
//   { icon: <Users         size={20} />, value: "248", label: "Users",       change: "+31 this week" },
//   { icon: <MessageSquare size={20} />, value: "12",  label: "Consults",    change: "4 overdue"     },
//   { icon: <Briefcase     size={20} />, value: "19",  label: "Internships", change: "New today"     },
// ];

// const QUICK = [
//   { emoji: "🏦", val: "8",  label: "Loan Requests"  },
//   { emoji: "📰", val: "6",  label: "News Published"  },
//   { emoji: "⭐", val: "8",  label: "Featured"        },
//   { emoji: "🏛️", val: "22", label: "Govt. Colleges"  },
//   { emoji: "🏢", val: "12", label: "Private"         },
//   { emoji: "✅", val: "4",  label: "Consults Done"   },
// ];

// const BAR_DATA = [
//   { label: "Consultations", val: 12, max: 20 },
//   { label: "Loans",         val: 8,  max: 20 },
//   { label: "Internships",   val: 19, max: 20 },
//   { label: "News",          val: 6,  max: 20 },
//   { label: "New Users",     val: 31, max: 50 },
// ];

// const FEATURED = [
//   { name: "IIT Bombay",    field: "Engineering" },
//   { name: "IIM Ahmedabad", field: "Management"  },
//   { name: "AIIMS Delhi",   field: "Medicine"    },
//   { name: "NLSIU Blr",     field: "Law"         },
// ];

// const TICKER_TEXT = "Students • Colleges • Consults • Growth • Admissions • Oplifi •";

// // ─── DASHBOARD ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const containerRef = useRef(null);
//   const tickerRef    = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {

//       // stat bars grow on scroll
//       gsap.from(".stat-bar", {
//         width: "0%",
//         duration: 1.5,
//         stagger: 0.1,
//         ease: "expo.out",
//         scrollTrigger: { trigger: ".stat-bar", start: "top 90%" },
//       });

//       // live pulse dot
//       gsap.to(".pulse-dot", {
//         opacity: 0.2, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut",
//       });

//       // float icons
//       gsap.to(".float-icon", {
//         y: -10, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.4,
//       });

//       // seamless ticker
//       if (tickerRef.current) {
//         gsap.to(tickerRef.current, { xPercent: -50, duration: 20, repeat: -1, ease: "none" });
//       }

//       // entrance animations
//       gsap.from(".stat-card", {
//         opacity: 0, y: 32, scale: 0.95, stagger: 0.08, duration: 0.55, ease: "back.out(1.7)",
//       });
//       gsap.from(".quick-card", {
//         opacity: 0, y: 20, scale: 0.94, stagger: 0.06, duration: 0.45, ease: "power3.out", delay: 0.3,
//       });
//       gsap.from(".act-row", {
//         opacity: 0, x: -16, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.5,
//       });

//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={containerRef} className="py-2 space-y-5">

//       {/* ── Page Title ── */}
//       <div>
//         <h2 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
//           Dashboard
//         </h2>
//         <p className="mt-1 text-[10px] font-black uppercase tracking-[.22em] text-zinc-400">
//           Live Overview
//         </p>
//       </div>

//       {/* ══════════════════════════════════════════════════════════
//           ROW 1 — 4 Stat Cards
//       ══════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//         {STATS.map((s) => (
//           <div
//             key={s.label}
//             className="stat-card relative overflow-hidden rounded-[2.5rem] p-7 bg-zinc-900 border border-zinc-800 group hover:border-[#3f8efc]/40 transition-colors duration-300"
//           >
//             <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl bg-[#3f8efc]" />
//             <div className="flex items-start justify-between mb-6">
//               <div className="p-3 bg-[#3f8efc] rounded-xl text-white">{s.icon}</div>
//               <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-[#3f8efc] transition-colors" />
//             </div>
//             <div className="text-5xl font-black italic tracking-tighter text-white leading-none">{s.value}</div>
//             <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">{s.label}</div>
//             <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3f8efc]/10 border border-[#3f8efc]/20">
//               <div className="w-1.5 h-1.5 rounded-full bg-[#3f8efc] pulse-dot" />
//               <span className="text-[9px] font-black text-[#3f8efc] uppercase tracking-wider">{s.change}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ══════════════════════════════════════════════════════════
//           ROW 2 — Analytics (col-8) + Consults (col-4)
//       ══════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

//         {/* Analytics bar chart — moss green */}
//         <div className="lg:col-span-8 bg-[#3f8efc]/10 rounded-[3.5rem] p-10 border border-[#3f8efc]/20 flex flex-col">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-[#3f8efc] rounded-2xl text-zinc-900"><BarChart3 size={22} /></div>
//               <div>
//                 <p className="text-[9px] font-black uppercase tracking-[.22em] text-zinc-500">Live Ops</p>
//                 <h3 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">Analytics</h3>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3f8efc]/20 rounded-full border border-[#3f8efc]/30">
//               <div className="w-1.5 h-1.5 rounded-full bg-[#3f8efc] pulse-dot" />
//               <span className="text-[9px] font-black text-[#3f8efc] uppercase tracking-widest">Live</span>
//             </div>
//           </div>

//           <div className="space-y-5 mt-auto">
//             {BAR_DATA.map((b) => (
//               <div key={b.label} className="space-y-2">
//                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                   <span>{b.label}</span>
//                   <span className="text-zinc-900">{b.val}</span>
//                 </div>
//                 <div className="h-2.5 w-full bg-white/60 rounded-full overflow-hidden">
//                   <div
//                     className="stat-bar h-full bg-[#3f8efc] rounded-full"
//                     style={{ width: `${Math.round((b.val / b.max) * 100)}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pending Consults — deep purple */}
//          <div className="lg:col-span-4 bg-zinc-900 rounded-[3.5rem] p-8 border border-zinc-800 flex flex-col">
//           <div className="flex items-center justify-between mb-6">
//             <h4 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
//               Quick <br /> Stats
//             </h4>
//             <div className="p-3 bg-[#3f8efc] rounded-xl text-zinc-900"><MousePointerClick size={18} /></div>
//           </div>
//           <div className="grid grid-cols-2 gap-3 mt-auto">
//             {QUICK.map((q) => (
//               <div
//                 key={q.label}
//                 className="quick-card bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex flex-col gap-1 hover:border-[#3f8efc]/40 transition-colors"
//               >
//                 <span className="text-xl leading-none">{q.emoji}</span>
//                 <div className="text-2xl font-black text-white tracking-tighter leading-none mt-1">{q.val}</div>
//                 <div className="text-[9px] font-black uppercase tracking-wider text-zinc-500">{q.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>

  

//       {/* ══════════════════════════════════════════════════════════
//           ROW 4 — Activity (col-5) + Featured Colleges (col-7)
//       ══════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

//         {/* Activity Feed — zinc-900 */}
//         <div className="lg:col-span-5 bg-zinc-900 rounded-[3.5rem] p-10 border border-zinc-800 flex flex-col">
//           <div className="flex items-center gap-4 mb-8">
//             <div className="p-4 bg-[#6A5C98] rounded-2xl text-white"><Activity size={20} /></div>
//             <div>
//               <p className="text-[9px] font-black uppercase tracking-[.22em] text-zinc-500">Latest</p>
//               <h4 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Activity</h4>
//             </div>
//           </div>
//           <div className="flex flex-col divide-y divide-zinc-800">
//             {ACTIVITY_DATA.map((a, i) => (
//               <div key={i} className="act-row flex items-start gap-3 py-3.5">
//                 <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: a.dot ?? "#B1C357" }} />
//                 <div className="flex-1 text-[12px] leading-snug text-zinc-400" dangerouslySetInnerHTML={{ __html: a.text }} />
//                 <div className="shrink-0 whitespace-nowrap text-[10px] font-bold text-zinc-600">{a.time}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Featured Colleges — moss green tint */}
//         <div className="lg:col-span-7 bg-[#3f8efc]/10 rounded-[3.5rem] p-10 border border-[#3f8efc]/20 flex flex-col">
//           <div className="flex items-center gap-4 mb-8">
//             <div className="p-4 bg-[#E39F4A] rounded-2xl text-white">
//               <Star size={20} className="fill-white" />
//             </div>
//             <div>
//               <p className="text-[9px] font-black uppercase tracking-[.22em] text-zinc-500">Top Ranked</p>
//               <h4 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">Featured</h4>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4 mt-auto">
//             {FEATURED.map((c, i) => (
//               <div
//                 key={c.name}
//                 className="group relative overflow-hidden rounded-[1.8rem] bg-zinc-900 border border-zinc-800 p-6 hover:border-[#3f8efc]/40 transition-all duration-300 cursor-pointer"
//               >
//                 <span className="absolute top-5 right-5 text-[10px] font-black text-zinc-700 uppercase tracking-widest">#{i + 1}</span>
//                 <div className="w-10 h-10 bg-[#3f8efc] rounded-xl flex items-center justify-center text-zinc-900 mb-4">
//                   <GraduationCap size={18} />
//                 </div>
//                 <div className="text-[14px] font-black text-white leading-snug tracking-tight">{c.name}</div>
//                 <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-zinc-500">{c.field}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }