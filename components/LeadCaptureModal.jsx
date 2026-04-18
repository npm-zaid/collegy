'use client';
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Phone, ShieldCheck, Zap, Users, User, Mail, CheckCircle } from 'lucide-react';

const API = 'http://localhost:5000';

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setIsOpen(true), 120000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.4 })
        .fromTo(modalRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.2'
        );
    }
  }, [isOpen]);

  const closeModal = () => {
    gsap.to(modalRef.current, {
      scale: 0.9, opacity: 0, y: 20, duration: 0.3,
      onComplete: () => {
        setIsOpen(false);
        // Reset state after close so it's fresh next time
        setTimeout(() => {
          setForm({ name: '', phone: '', email: '' });
          setSubmitted(false);
          setError('');
        }, 300);
      }
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setError(''); // clear error on any input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.phone.trim()) {
      setError('Mobile number is required.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim() || undefined,   // optional
          phone: form.phone.trim(),
          email: form.email.trim() || undefined, // optional
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.errors?.join(', ') || data.message || 'Something went wrong.';
        setError(errMsg);
        return;
      }

      setSubmitted(true);

      // Auto-close after 2.5s on success
      setTimeout(() => closeModal(), 2500);

    } catch (err) {
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
        className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0"
        onClick={closeModal}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(61,107,232,0.2)] opacity-0"
      >
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#3D6BE8] via-[#E39F4A] to-[#3D6BE8]" />

        <button
          onClick={closeModal}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors p-2"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {submitted ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter">
                We'll call you soon!
              </h3>
              <p className="text-zinc-500 text-sm font-bold">
                Our experts will reach out within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  250+ Experts Online
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-4">
                  Do you want <br />
                  <span className="text-[#3D6BE8]">us to help you?</span>
                </h2>
                <p className="text-zinc-500 text-sm font-bold">
                  Get expert guidance on scholarships, SOPs, and visas.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Name — optional */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D6BE8] group-focus-within:text-[#E39F4A] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={form.name}
                    onChange={set('name')}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-[#3D6BE8]/50 transition-all"
                  />
                </div>

                {/* Phone — required */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D6BE8] group-focus-within:text-[#E39F4A] transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={form.phone}
                    onChange={set('phone')}
                    maxLength={10}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-[#3D6BE8]/50 transition-all"
                  />
                </div>

                {/* Email — optional */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D6BE8] group-focus-within:text-[#E39F4A] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address (optional)"
                    value={form.email}
                    onChange={set('email')}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-[#3D6BE8]/50 transition-all"
                  />
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-rose-500 text-[11px] font-bold text-center px-2">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3D6BE8] hover:bg-[#2b51c5] disabled:opacity-60 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(61,107,232,0.3)] group mt-1"
                >
                  {loading ? 'Submitting…' : 'Request Callback'}
                  {!loading && <Zap size={16} className="group-hover:fill-white transition-all" />}
                </button>
              </form>

              {/* Benefits Grid */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {['No Processing Fee', 'SOP & LOR Prep', 'Visa Assistance', 'Education Loan'].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                    <ShieldCheck size={14} className="text-[#E39F4A]" />
                    {text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-900/50 p-6 flex items-center justify-center gap-4 border-t border-white/5">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                <Users size={14} className="text-[#E39F4A]" />
              </div>
            ))}
          </div>
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            Joined by 12k+ students this month
          </p>
        </div>
      </div>
    </div>
  );
}