'use client';
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  ChevronRight, Sparkles, GraduationCap, Plane, Globe,
  ShieldCheck, Zap, BookOpen, Search, X, CheckCircle2
} from 'lucide-react';

const ADMISSION_MODES = [
  { id: 1, title: 'Normal Admission', icon: GraduationCap, desc: 'Normal admission is available for all streams and courses, including both government and private colleges.' },
  { id: 2, title: '100% Scholarship', icon: Zap, desc: 'Available for OBC and SC/ST categories in courses like MBA, B.Tech, M.Tech, MCA, and other regular programs.' },
  { id: 3, title: '0% Attendance Policy', icon: ShieldCheck, desc: 'Flexible learning options for working professionals or those pursuing multiple certifications simultaneously.' },
  { id: 4, title: 'Private Degree', icon: BookOpen, desc: 'Admissions are available for all undergraduate (UG) and postgraduate (PG) courses in private MODE.' },
  { id: 5, title: '100% Placement Guarantee', icon: Sparkles, desc: 'Includes BCA, MBA, MCA, B.Tech, BBA, along with programs associated with Sunstone and HCL Tech.' },
  { id: 6, title: 'Direct Govt. Admission', icon: Search, desc: 'Direct entry into reputed government institutes such as SGSITS (B.Tech, MBA, MCA) and DAVV (IET, IMS).' },
  { id: 7, title: 'Online & Distance Learning', icon: Globe, desc: 'Accredited online and distance education programs designed for modern flexibility.' },
  { id: 8, title: 'Aviation Courses', icon: Plane, desc: 'Premium admissions available for pilot training, ground staff, and aviation management courses.' },
  { id: 9, title: 'Medical / Paramedical', icon: GraduationCap, desc: 'Comprehensive admission support for all medical and paramedical courses across India.' },
  { id: 10, title: 'MBBS Abroad', icon: Globe, desc: 'Global medical pathways with recognized universities in Europe, Asia, and more.' },
];

export default function AdmissionModes() {
  const [activeTab, setActiveTab] = useState(ADMISSION_MODES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentRef = useRef(null);

  // Tab Switch Animation
  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <section className="w-full py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-[#3D6BE8]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3D6BE8]">Explore Admission Pathways</span>
          </div>
          <h2 className="text-5xl font-[1000] tracking-tighter text-zinc-900 italic">Admission <span className="text-[#3D6BE8]">Modes</span></h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-2 sticky top-24">
            {ADMISSION_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveTab(mode)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${activeTab.id === mode.id
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl translate-x-2'
                    : 'bg-white border-zinc-100 text-zinc-500 hover:border-[#3D6BE8]/30 hover:bg-zinc-50'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <mode.icon size={18} className={activeTab.id === mode.id ? 'text-[#E39F4A]' : 'group-hover:text-[#3D6BE8]'} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{mode.title}</span>
                </div>
                <ChevronRight size={14} className={activeTab.id === mode.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
              </button>
            ))}
          </div>

          {/* Right Content Card */}
          <div className="lg:col-span-8" ref={contentRef}>
            <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 md:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] relative overflow-hidden h-full min-h-[500px] flex flex-col justify-center">
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3D6BE8]/5 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-zinc-50 flex items-center justify-center text-[#3D6BE8] mb-8">
                  <activeTab.icon size={40} />
                </div>

                <h3 className="text-4xl font-[1000] tracking-tighter text-zinc-900 mb-6 italic">
                  {activeTab.title}
                </h3>

                <p className="text-xl font-bold text-zinc-500 leading-relaxed max-w-2xl mb-12">
                  {activeTab.desc}
                </p>

                <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-100">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-10 py-5 bg-[#3D6BE8] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all shadow-xl shadow-blue-200"
                  >
                    Enroll for {activeTab.title}
                  </button>
                  <button className="px-10 py-5 border border-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all">
                    Download Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl overflow-hidden">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors">
              <X size={24} />
            </button>

            <div className="mb-8">
              <h4 className="text-2xl font-[1000] tracking-tighter italic">Apply for Admission</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#3D6BE8] mt-1">{activeTab.title}</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert('Request Submitted!') }}>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" required className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#3D6BE8] outline-none" />
                <input type="tel" placeholder="Mobile Number" required className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#3D6BE8] outline-none" />
              </div>
              <input type="email" placeholder="Email Address" required className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#3D6BE8] outline-none" />
              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#3D6BE8] mt-0.5" />
                <p className="text-[11px] font-bold text-zinc-600">By enrolling, you will receive expert guidance specific to the <span className="font-black text-[#3D6BE8]">{activeTab.title}</span> process.</p>
              </div>
              <button type="submit" className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#3D6BE8] transition-all shadow-xl">
                Submit Enrollment Request
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}