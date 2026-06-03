"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Sparkles, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  GraduationCap,
  ArrowUpRight
} from "lucide-react";

export default function ContactPage() {
  const containerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  const [form, setForm] = useState({ name: '', phone: '', email: '', course: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name  = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const course = form.course.trim();

    if (!name) { setError('Your name is required.'); return; }
    if (name.length < 2) { setError('Name must be at least 2 characters.'); return; }

    if (!phone) { setError('Mobile number is required.'); return; }
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit mobile number.'); return; }

    if (!email) { setError('Email address is required.'); return; }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError('Enter a valid email address.'); return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('https://finale-beacon-backend.vercel.app/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, course }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.errors?.join(', ') || data.message || 'Something went wrong.');
        return;
      }

      setIsSubmitted(true);
      setForm({ name: '', phone: '', email: '', course: '' });
    } catch {
      setError('Network error — please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Accents - Using your brand blues */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2667ff]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3f8efc]/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center contact-reveal">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/5 border border-[#2667ff]/10 mb-4">
            <Sparkles size={14} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              Admission Concierge
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-4">
            Let's find your <br />
            <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
              perfect fit.
            </span>
          </h1>
          <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-4 shadow-[0_4px_15px_rgba(38,103,255,0.3)]" />
        </div>

        {/* Main Bento Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Card */}
          <div className="lg:col-span-7 bg-zinc-100 rounded-[3rem] p-8 md:p-12 border border-zinc-200/50 shadow-2xl shadow-indigo-100/40 relative overflow-hidden contact-reveal">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#2667ff] to-[#3f8efc] rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl rotate-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Synced!</h2>
                <p className="text-zinc-500 font-medium mb-8">Our expert advisors are reviewing your profile.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-4 bg-zinc-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-transform"
                >
                  Send New Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Student Name *</label>
                    <input
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); setError(''); }}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Mobile Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={(e) => { setForm(p => ({ ...p, phone: e.target.value })); setError(''); }}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Direct Email *</label>
                  <input
                    type="email"
                    placeholder="student@collegy.in"
                    value={form.email}
                    onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setError(''); }}
                    className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 italic">Target Course (Optional)</label>
                  <input
                    placeholder="e.g. B.Tech CSE"
                    value={form.course}
                    onChange={(e) => { setForm(p => ({ ...p, course: e.target.value })); setError(''); }}
                    className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#2667ff] focus:bg-white p-5 rounded-2xl outline-none transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                  />
                </div>
                
                {error && (
                  <p className="text-rose-500 text-[12px] font-bold text-center">⚠️ {error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-zinc-900 overflow-hidden p-6 rounded-2xl transition-all hover:shadow-[0_20px_40px_rgba(38,103,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#2667ff] to-[#3f8efc] transition-all duration-500 group-hover:w-full" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase tracking-[0.3em] text-xs group-hover:text-white">
                    {isSubmitting ? "Connecting..." : "Initiate Sync"}
                    <Send size={16} />
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 contact-reveal">
            
            {/* Blue Brand Card */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 border-2 border-[#2667ff]/20 text-white group hover:scale-[1.02] transition-transform shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2667ff]/20 rounded-full blur-3xl group-hover:bg-[#2667ff]/40 transition-colors" />
               
              <div className="flex items-start gap-5 relative z-10">
                <div className="p-4 bg-gradient-to-br from-[#2667ff] to-[#3f8efc] rounded-2xl text-white group-hover:rotate-6 transition-transform shadow-lg">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#3f8efc] mb-1">Expert Support</h3>
                  <p className="text-xl font-bold cursor-pointer hover:text-[#3f8efc] transition-colors truncate">
                    admissions@collegy.in
                  </p>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-xl group hover:scale-[1.02] transition-transform">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-zinc-50 rounded-2xl text-[#2667ff] group-hover:bg-[#2667ff] group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Our Base</h3>
                  <p className="text-sm font-bold text-zinc-800 leading-relaxed">
                    A-930, Bhutani Cyber Park <br />
                    Sector 62, Noida-201301 <br />
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Bento Box with Image */}
            <div className="flex-1 min-h-[350px] bg-zinc-200 rounded-[2.5rem] overflow-hidden relative group shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
                alt="Collegy Success"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#2667ff] rounded-xl text-white shadow-lg shadow-blue-500/30">
                      <GraduationCap size={18} />
                    </div>
                    <p className="text-white font-black text-sm uppercase tracking-widest">Collegy Elite</p>
                  </div>
                  <ArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}