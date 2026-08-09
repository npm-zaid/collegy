'use client';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronRight, Sparkles, GraduationCap, Plane, Globe,
  ShieldCheck, Zap, BookOpen, Search, ArrowUpRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const ADMISSION_MODES = [
  {
    id: 1,
    title: 'Normal Admission',
    icon: GraduationCap,
    tag: 'Most Popular',
    accent: '#3D6BE8',
    accentBg: 'rgba(61,107,232,0.10)',
    accentBorder: 'rgba(61,107,232,0.25)',
    accentGlow: 'rgba(61,107,232,0.18)',
    desc: 'Normal admission is available for all streams and courses, including both government and private colleges.',
    highlights: ['All Streams & Courses', 'Govt & Private Colleges', 'Entrance-Based & Merit'],
  },
  {
    id: 2,
    title: '100% Scholarship',
    icon: Zap,
    tag: 'High Demand',
    accent: '#E39F4A',
    accentBg: 'rgba(227,159,74,0.10)',
    accentBorder: 'rgba(227,159,74,0.25)',
    accentGlow: 'rgba(227,159,74,0.18)',
    desc: 'Available for OBC and SC/ST categories in courses like MBA, B.Tech, M.Tech, MCA, and other regular programs.',
    highlights: ['OBC & SC/ST Categories', 'MBA · B.Tech · MCA', 'Zero Fee Pathway'],
  },
  {
    id: 3,
    title: '0% Attendance Policy',
    icon: ShieldCheck,
    tag: 'Flexible',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.10)',
    accentBorder: 'rgba(16,185,129,0.25)',
    accentGlow: 'rgba(16,185,129,0.18)',
    desc: 'Flexible learning options for working professionals or those pursuing multiple certifications simultaneously.',
    highlights: ['Working Professionals', 'Multi-Certification Track', 'No Attendance Cap'],
  },
  {
    id: 4,
    title: 'Private Degree',
    icon: BookOpen,
    tag: 'Open Access',
    accent: '#a855f7',
    accentBg: 'rgba(168,85,247,0.10)',
    accentBorder: 'rgba(168,85,247,0.25)',
    accentGlow: 'rgba(168,85,247,0.18)',
    desc: 'Admissions are available for all undergraduate (UG) and postgraduate (PG) courses in private MODE.',
    highlights: ['UG & PG Programs', 'Recognised Universities', 'Anytime Admission'],
  },
  {
    id: 5,
    title: '100% Placement Guarantee',
    icon: Sparkles,
    tag: 'Job-Backed',
    accent: '#f43f5e',
    accentBg: 'rgba(244,63,94,0.10)',
    accentBorder: 'rgba(244,63,94,0.25)',
    accentGlow: 'rgba(244,63,94,0.18)',
    desc: 'Includes BCA, MBA, MCA, B.Tech, BBA, along with programs associated with Sunstone and HCL Tech.',
    highlights: ['BCA · MBA · B.Tech', 'Sunstone & HCL Tech', 'Offer Before Graduation'],
  },
  {
    id: 6,
    title: 'Direct Govt. Admission',
    icon: Search,
    tag: 'Elite Seats',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.10)',
    accentBorder: 'rgba(6,182,212,0.25)',
    accentGlow: 'rgba(6,182,212,0.18)',
    desc: 'Direct entry into reputed government institutes such as SGSITS (B.Tech, MBA, MCA) and DAVV (IET, IMS).',
    highlights: ['SGSITS · DAVV', 'B.Tech · MBA · MCA', 'Management Quota'],
  },
  {
    id: 7,
    title: 'Online & Distance Learning',
    icon: Globe,
    tag: 'Anytime',
    accent: '#3D6BE8',
    accentBg: 'rgba(61,107,232,0.10)',
    accentBorder: 'rgba(61,107,232,0.25)',
    accentGlow: 'rgba(61,107,232,0.18)',
    desc: 'Accredited online and distance education programs designed for modern flexibility.',
    highlights: ['UGC-DEB Approved', 'Self-Paced Learning', 'Live + Recorded Classes'],
  },
  {
    id: 8,
    title: 'Aviation Courses',
    icon: Plane,
    tag: 'Premium',
    accent: '#E39F4A',
    accentBg: 'rgba(227,159,74,0.10)',
    accentBorder: 'rgba(227,159,74,0.25)',
    accentGlow: 'rgba(227,159,74,0.18)',
    desc: 'Premium admissions available for pilot training, ground staff, and aviation management courses.',
    highlights: ['Pilot Training', 'Ground Staff Programs', 'Aviation Management'],
  },
  {
    id: 9,
    title: 'Medical / Paramedical',
    icon: GraduationCap,
    tag: 'Healthcare',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.10)',
    accentBorder: 'rgba(16,185,129,0.25)',
    accentGlow: 'rgba(16,185,129,0.18)',
    desc: 'Comprehensive admission support for all medical and paramedical courses across India.',
    highlights: ['MBBS · BDS · BAMS', 'Paramedical Diplomas', 'NRI & Management Quota'],
  },
  {
    id: 10,
    title: 'MBBS Abroad',
    icon: Globe,
    tag: 'Global',
    accent: '#a855f7',
    accentBg: 'rgba(168,85,247,0.10)',
    accentBorder: 'rgba(168,85,247,0.25)',
    accentGlow: 'rgba(168,85,247,0.18)',
    desc: 'Global medical pathways with recognized universities in Europe, Asia, and more.',
    highlights: ['WHO Recognised', 'Europe · Asia · Russia', 'Affordable Fees'],
  },
];

export default function AdmissionModes() {
  const router = useRouter();
  const [activeId, setActiveId] = useState(1);
  const sectionRef = useRef(null);
  const detailRef = useRef(null);

  const active = ADMISSION_MODES.find((m) => m.id === activeId);

  // Entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.am-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.am-pill', { scale: 0.88, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      });
      gsap.fromTo('.am-card', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
      });
      gsap.to('.am-badge', {
        y: -5, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to('.am-orb', {
        scale: 1.15, opacity: 0.7, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Detail panel switch animation
  const handleSelect = (id) => {
    gsap.to(detailRef.current, {
      opacity: 0, y: 12, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setActiveId(id);
        gsap.fromTo(detailRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#050505] py-28 px-6 md:px-10 relative overflow-hidden"
    >
      {/* Micro-grid background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#3D6BE8 1px, transparent 1px), linear-gradient(90deg, #3D6BE8 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Ambient orb — shifts with active accent */}
      <div
        className="am-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${active.accentGlow} 0%, transparent 65%)`,
        }}
      />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#3D6BE8]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── HEADER ── */}
        <div className="am-header text-center mb-16 space-y-4">
          <div
            className="am-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border"
            style={{ background: 'rgba(61,107,232,0.08)', color: '#3D6BE8', borderColor: 'rgba(61,107,232,0.2)' }}
          >
            <Zap size={11} />
            Explore Admission Pathways
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
            Your Path to
            <br />
            <span className="bg-gradient-to-r from-[#2667ff] to-[#E39F4A] bg-clip-text text-transparent italic">
              Every College.
            </span>
          </h2>
          <p className="text-zinc-500 font-bold text-xs md:text-sm max-w-xl mx-auto leading-relaxed px-4">
            10 admission modes — from full scholarships to global MBBS — all under one roof. 
            Find the pathway made for you.
          </p>
        </div>

        {/* ── MODE PILL SELECTOR ── */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {ADMISSION_MODES.map((mode) => {
            const isActive = activeId === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                className="am-pill flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: isActive ? mode.accentBg : 'rgba(24,24,27,0.5)',
                  color: isActive ? mode.accent : '#52525b',
                  borderColor: isActive ? mode.accentBorder : 'rgba(255,255,255,0.06)',
                  boxShadow: isActive ? `0 0 18px ${mode.accentGlow}` : 'none',
                }}
              >
                <mode.icon size={13} />
                {mode.title}
              </button>
            );
          })}
        </div>

        {/* ── DETAIL CARD ── */}
        <div
          ref={detailRef}
          className="am-card relative rounded-[36px] border backdrop-blur-2xl overflow-hidden transition-all duration-500"
          style={{
            background: 'rgba(9,9,11,0.75)',
            borderColor: active.accentBorder,
            boxShadow: `0 0 70px ${active.accentGlow}, 0 0 0 1px ${active.accentBorder}`,
          }}
        >
          {/* Top stripe */}
          <div
            className="flex items-center justify-between px-8 md:px-12 py-5 border-b"
            style={{ borderColor: active.accentBorder }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                style={{ background: active.accentBg, color: active.accent }}
              >
                <active.icon size={20} />
              </div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500"
                style={{ color: active.accent }}
              >
                {active.title}
              </p>
            </div>
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all duration-500"
              style={{ color: active.accent, background: active.accentBg, borderColor: active.accentBorder }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: active.accent }} />
              {active.tag}
            </span>
          </div>

          {/* Main body — two column on lg */}
          <div className="grid lg:grid-cols-2 gap-0">

            {/* Left — Description + CTA */}
            <div
              className="p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: active.accentBorder }}
            >
              {/* Big icon */}
              <div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500"
                  style={{ background: active.accentBg }}
                >
                  <active.icon size={34} style={{ color: active.accent }} />
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-5 italic">
                  {active.title}
                </h3>

                <p className="text-zinc-400 font-bold text-sm md:text-base leading-relaxed mb-8">
                  {active.desc}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => router.push('/contact-us')}
                  className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, ${active.accent}, ${active.accent}cc)`,
                    boxShadow: `0 8px 24px ${active.accentGlow}`,
                  }}
                >
                  Enroll Now
                  <ArrowUpRight size={14} />
                </button>
                <button
                  className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 hover:bg-white/5"
                  style={{ color: '#71717a', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  Download Guidelines
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Right — Highlights + mode number list */}
            <div className="p-8 md:p-12 flex flex-col gap-8">

              {/* Highlights */}
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.3em] mb-4"
                  style={{ color: active.accent }}
                >
                  Key Highlights
                </p>
                <div className="space-y-3">
                  {active.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all duration-300"
                      style={{ background: active.accentBg, borderColor: active.accentBorder }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                        style={{ background: active.accent, color: '#000' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs font-black text-white tracking-tight">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick-jump to all modes */}
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.3em] mb-4"
                  style={{ color: '#3f3f46' }}
                >
                  All Modes
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ADMISSION_MODES.map((mode) => {
                    const isSel = activeId === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleSelect(mode.id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 text-left"
                        style={{
                          background: isSel ? mode.accentBg : 'rgba(24,24,27,0.4)',
                          color: isSel ? mode.accent : '#52525b',
                          borderColor: isSel ? mode.accentBorder : 'rgba(255,255,255,0.05)',
                          boxShadow: isSel ? `0 0 10px ${mode.accentGlow}` : 'none',
                        }}
                      >
                        <mode.icon size={11} />
                        <span className="truncate">{mode.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stripe */}
          <div
            className="flex items-center justify-between px-8 md:px-12 py-4 border-t"
            style={{ borderColor: active.accentBorder }}
          >
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Collegy · Expert Verified Pathways
            </p>
            <span
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: active.accent }}
            >
              Mode {String(active.id).padStart(2, '0')} / {String(ADMISSION_MODES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
