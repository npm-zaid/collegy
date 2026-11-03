"use client";
// Save as app/mentors/[id]/page.jsx  → dynamic route /mentors/<id>
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, BadgeCheck, MapPin, Lightbulb, Users, GraduationCap, CalendarDays,
} from "lucide-react";
import { fetchMentorById, initials } from "../../../lib/mentorsData";

const BOOK_ROUTE = "/book-session"; // change if your booking route differs

const STEPS = [
  { n: 1, title: "Choose duration", text: "15 min for quick Qs or 30 min to go deep." },
  { n: 2, title: "Pick date & time", text: "See open slots across the next 30 days." },
  { n: 3, title: "Pay & connect", text: "Secure Cashfree payment. Meet link unlocks 10 minutes before the session." },
];

// group ISO slot strings by calendar day
const groupSlots = (slots = []) => {
  const map = new Map();
  slots.forEach((s) => {
    const d = new Date(s);
    if (isNaN(d.getTime())) return;
    const key = d.toDateString();
    if (!map.has(key)) map.set(key, { date: d, items: [] });
    map.get(key).items.push({ iso: s, d });
  });
  return Array.from(map.values()).sort((a, b) => a.date - b.date);
};

export default function MentorDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(15);
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const m = await fetchMentorById(id);
        if (!active) return;
        setMentor(m);
      } catch (e) {
        console.error("Failed to load mentor", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const days = useMemo(() => groupSlots(mentor?.slots), [mentor]);
  const price = mentor ? (duration === 15 ? mentor.price15 : mentor.price30) : 0;

  const handleBook = () => {
    if (!mentor || !slot) return;
    const qs = new URLSearchParams({ mentor: mentor.id, duration: String(duration), slot });
    router.push(`${BOOK_ROUTE}?${qs.toString()}`);
  };

  // ── loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2667ff]/10 flex items-center justify-center animate-pulse">
            <GraduationCap size={24} className="text-[#2667ff]" />
          </div>
          <p className="text-zinc-400 text-sm font-black uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  // ── 404 ──
  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFDFD]">
        <p className="text-6xl font-black text-zinc-100 italic uppercase">404</p>
        <p className="text-zinc-500 font-bold">Mentor not found</p>
        <button
          onClick={() => router.push("/mentors")}
          className="mt-2 flex items-center gap-2 bg-[#2667ff] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={13} /> Back to Mentors
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 pb-24 overflow-x-hidden relative">
      {/* Background glow (design.md §5) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-10%] w-[450px] h-[450px] bg-[#2667ff]/10 blur-[110px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#2667ff]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-28 relative z-10">

        {/* Back */}
        <button
          onClick={() => router.push("/mentors")}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#2667ff] transition-colors mb-8 group"
        >
          <div className="w-7 h-7 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-[#2667ff]/10 transition-colors">
            <ArrowLeft size={13} />
          </div>
          Back to mentors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ═════════ LEFT ═════════ */}
          <div className="lg:col-span-8 space-y-8">

            {/* Profile card */}
            <section className="bg-white rounded-[3rem] border-2 border-white shadow-xl overflow-hidden">
              {/* Cover */}
              <div className="relative h-56 md:h-72">
                {mentor.cover ? (
                  <img src={mentor.cover} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${mentor.tone}`}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", backgroundSize: "18px 18px" }} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <span className="absolute top-6 right-6 bg-white/95 text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-sm">
                  New Mentor
                </span>
              </div>

              <div className="relative px-8 md:px-12 pb-10">
                {/* Avatar + logo */}
                <div className="absolute -top-20 left-8 md:left-12 w-36 h-36 rounded-full bg-white p-2 shadow-xl">
                  {mentor.photo ? (
                    <img src={mentor.photo} alt={mentor.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-4xl font-black text-zinc-400">
                      {initials(mentor.name)}
                    </div>
                  )}
                </div>
                <div className="absolute -top-10 right-8 md:right-12 w-20 h-20 rounded-3xl bg-white shadow-lg border border-zinc-100 flex items-center justify-center overflow-hidden">
                  {mentor.logo ? (
                    <img src={mentor.logo} alt={mentor.college} className="w-3/4 h-3/4 object-contain" />
                  ) : (
                    <span className="text-sm font-black text-[#2667ff]">{initials(mentor.college)}</span>
                  )}
                </div>

                {/* Name */}
                <div className="pt-20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900">{mentor.name}</h1>
                    <BadgeCheck size={28} className="text-[#2667ff]" />
                  </div>

                  {/* Languages */}
                  {mentor.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {mentor.languages.map((l) => (
                        <span key={l} className="bg-white border border-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                          {l}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* College */}
                  <h2 className="text-2xl font-black tracking-tight text-zinc-900 mt-8">{mentor.college}</h2>
                  <p className="flex items-center gap-1.5 text-zinc-500 font-medium mt-2">
                    <MapPin size={16} className="text-zinc-400" /> {mentor.campus}
                  </p>
                  {mentor.year && (
                    <span className="inline-block mt-5 bg-[#2667ff]/10 border border-[#2667ff]/20 text-[#2667ff] text-sm font-black px-5 py-2.5 rounded-2xl">
                      {mentor.year}
                    </span>
                  )}
                </div>

                {/* About */}
                <div className="border-t border-zinc-100 mt-10 pt-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#2667ff] mb-4">About</p>
                  <p className="text-zinc-600 leading-relaxed text-base">{mentor.about}</p>

                  {mentor.quote && (
                    <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-100 rounded-[1.75rem] px-6 py-5 mt-7">
                      <Lightbulb size={22} className="text-[#2667ff] shrink-0" />
                      <p className="text-zinc-700 font-medium">{mentor.quote}</p>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {mentor.expertise?.length > 0 && (
                  <div className="border-t border-zinc-100 mt-10 pt-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#2667ff] mb-4">Specialties</p>
                    <div className="flex flex-wrap gap-3">
                      {mentor.expertise.map((t) => (
                        <span key={t} className="bg-white border border-zinc-200 text-zinc-800 text-sm font-black px-5 py-3 rounded-2xl shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* How it works */}
            <section className="bg-white rounded-[3rem] border-2 border-white shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-10">How it Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {STEPS.map((s) => (
                  <div key={s.n}>
                    <div className="w-14 h-14 rounded-full bg-[#2667ff] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100 mb-5">
                      {s.n}
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">{s.title}</h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed mt-2">{s.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ═════════ RIGHT: booking ═════════ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white rounded-[2.5rem] border-2 border-white shadow-xl p-8">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-7">Book a Session</h2>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { min: 15, price: mentor.price15 },
                  { min: 30, price: mentor.price30 },
                ].map((d) => {
                  const active = duration === d.min;
                  return (
                    <button
                      key={d.min}
                      onClick={() => setDuration(d.min)}
                      className={`rounded-[1.75rem] border-2 py-6 px-4 text-center transition-all active:scale-95 ${
                        active
                          ? "border-[#2667ff] bg-[#2667ff]/5 shadow-lg shadow-blue-100"
                          : "border-zinc-100 bg-white shadow-sm hover:border-[#2667ff]/30"
                      }`}
                    >
                      <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${active ? "text-[#2667ff]" : "text-zinc-500"}`}>
                        {d.min} Min
                      </p>
                      <p className="text-3xl font-black tracking-tight text-zinc-900 mt-2">Rs. {d.price}</p>
                    </button>
                  );
                })}
              </div>

              {/* Slots */}
              {days.length === 0 ? (
                <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 mt-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <p className="text-sm font-bold text-zinc-600">No open slots right now</p>
                </div>
              ) : (
                <div className="mt-6 space-y-5 max-h-72 overflow-y-auto pr-1">
                  {days.map(({ date, items }) => (
                    <div key={date.toDateString()}>
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5">
                        <CalendarDays size={11} />
                        {date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {items.map(({ iso, d }) => {
                          const active = slot === iso;
                          return (
                            <button
                              key={iso}
                              onClick={() => setSlot(iso)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all active:scale-95 ${
                                active
                                  ? "bg-[#2667ff] text-white border-transparent shadow-md shadow-blue-100"
                                  : "bg-white text-zinc-700 border-zinc-200 hover:border-[#2667ff]/40 hover:text-[#2667ff]"
                              }`}
                            >
                              {d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleBook}
                disabled={!slot}
                className={`w-full mt-6 flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-black transition-all ${
                  slot
                    ? "bg-zinc-900 text-white hover:bg-[#2667ff] shadow-lg active:scale-95"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {slot ? `Book a Session · Rs. ${price}` : "Book a Session"} <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}