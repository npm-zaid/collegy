'use client';
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Phone, ShieldCheck, Zap, Users, User, Mail, CheckCircle } from 'lucide-react';

const API = 'http://localhost:5000';

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen]     = useState(false);
  const [form, setForm]         = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');

  const modalRef   = useRef(null);
  const overlayRef = useRef(null);

  // Open after 1.2 s — use setTimeout not setInterval
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 120000);
    return () => clearTimeout(t);
  }, []);

  // Animate in
  useEffect(() => {
    if (!isOpen) return;
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(modalRef.current,   { scale: 0.85, opacity: 0, y: 40 });
    const tl = gsap.timeline();
    tl.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .to(modalRef.current,   { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.15');
  }, [isOpen]);

  const closeModal = () => {
    gsap.to(modalRef.current,   { scale: 0.9, opacity: 0, y: 16, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setIsOpen(false);
        setTimeout(() => { setForm({ name:'', phone:'', email:'' }); setSubmitted(false); setError(''); }, 200);
      }
    });
  };

  const set = (key) => (e) => { setForm(p => ({ ...p, [key]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Client-side validation matching the schema ──────────────────────────
    const name  = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!name) { setError('Your name is required.'); return; }
    if (name.length < 2) { setError('Name must be at least 2 characters.'); return; }

    if (!phone) { setError('Mobile number is required.'); return; }
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit mobile number.'); return; }

    if (!email) { setError('Email address is required.'); return; }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError('Enter a valid email address.'); return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // All three fields are required by the schema — send all of them
        body: JSON.stringify({ name, phone, email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.errors?.join(', ') || data.message || 'Something went wrong.');
        return;
      }

      setSubmitted(true);
      setTimeout(() => closeModal(), 2500);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={closeModal}
      />

      {/* Modal — constrained to viewport height */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(61,107,232,0.25)]"
      >
        {/* Top accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#3D6BE8] via-[#E39F4A] to-[#3D6BE8] shrink-0" />

        {/* Close */}
        <button onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
          <X size={17} />
        </button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-7 pt-7 pb-5">
            {submitted ? (
              /* ── Success ── */
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle size={30} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter">We'll call you soon!</h3>
                <p className="text-zinc-500 text-sm font-semibold">Our experts will reach out within 24 hours.</p>
              </div>
            ) : (
              <>
                {/* Header — compact */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-3 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    250+ Experts Online
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter leading-tight mb-2">
                    Do you want <br />
                    <span className="text-[#3D6BE8]">us to help you?</span>
                  </h2>
                  <p className="text-zinc-500 text-xs font-semibold">
                    Get expert guidance on scholarships, SOPs, and visas.
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-2.5" onSubmit={handleSubmit}>
                  {/* Name — REQUIRED by schema */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D6BE8] group-focus-within:text-[#E39F4A] transition-colors pointer-events-none">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={form.name}
                      onChange={set('name')}
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-semibold placeholder:text-zinc-600 focus:outline-none focus:border-[#3D6BE8]/50 transition-all"
                    />
                  </div>

                  {/* Phone — required */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D6BE8] group-focus-within:text-[#E39F4A] transition-colors pointer-events-none">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={form.phone}
                      onChange={set('phone')}
                      maxLength={10}
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-semibold placeholder:text-zinc-600 focus:outline-none focus:border-[#3D6BE8]/50 transition-all"
                    />
                  </div>

                  {/* Email — REQUIRED by schema */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D6BE8] group-focus-within:text-[#E39F4A] transition-colors pointer-events-none">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={set('email')}
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-semibold placeholder:text-zinc-600 focus:outline-none focus:border-[#3D6BE8]/50 transition-all"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-rose-400 text-[11px] font-bold text-center">⚠️ {error}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3D6BE8] hover:bg-[#2b51c5] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(61,107,232,0.35)] mt-1"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Submitting…
                      </span>
                    ) : (
                      <>Request Callback <Zap size={14} className="fill-white" /></>
                    )}
                  </button>
                </form>

                {/* Benefits — 2×2 compact grid */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {['No Processing Fee', 'SOP & LOR Prep', 'Visa Assistance', 'Education Loan'].map((text, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                      <ShieldCheck size={12} className="text-[#E39F4A] shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-zinc-900/60 px-7 py-4 flex items-center justify-center gap-3 border-t border-white/5 shrink-0">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                  <Users size={12} className="text-[#E39F4A]" />
                </div>
              ))}
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Joined by 12k+ students this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}