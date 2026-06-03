'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { 
  Users, 
  Gift, 
  Wallet, 
  Copy, 
  Share2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const ReferAndEarn = () => {
  const cardRef = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("COLLEGY2026");
    alert("Referral code copied!");
  };

  return (
    <section className="w-full bg-[#FDFEFF] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Flex Container */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Info & Steps */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                <Sparkles size={14} className="text-[#3D6BE8]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3D6BE8]">
                  Collegy Community Program
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter leading-[0.95] text-zinc-900 italic">
                Empower Friends, <br />
                <span className="text-[#3D6BE8]">Earn Together.</span>
              </h2>
              <p className="text-lg font-bold text-zinc-500 max-w-xl border-l-4 border-zinc-100 pl-6">
                Share the gift of right guidance. When your friends join the Collegy ecosystem, you both unlock premium rewards and counseling credits.
              </p>
            </div>

            {/* Steps Visual */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Share2, title: "Invite", desc: "Share your unique code" },
                { icon: Users, title: "Register", desc: "Friend signs up on platform" },
                { icon: Gift, title: "Get Rewarded", desc: "Earn ₹2,000 per referral" },
              ].map((step, i) => (
                <div key={i} className="relative group p-6 rounded-[2rem] bg-white border border-zinc-100 hover:border-[#3D6BE8]/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 mb-4 group-hover:bg-[#3D6BE8] group-hover:text-white transition-all">
                    <step.icon size={20} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-1">{step.title}</h4>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{step.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 translate-y-[-50%] z-10 text-zinc-200">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Referral Dashboard Card */}
          <div className="lg:col-span-5">
            <div 
              ref={cardRef}
              className="relative bg-zinc-900 rounded-[3.5rem] p-10 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3D6BE8]/20 blur-[80px] rounded-full" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Earnings</p>
                    <h3 className="text-5xl font-[1000] tracking-tighter italic">₹12,400</h3>
                  </div>
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Wallet className="text-[#E39F4A]" />
                  </div>
                </div>

                {/* Referral Code Box */}
                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Your Referral Code</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between group cursor-pointer" onClick={copyToClipboard}>
                      <span className="font-mono text-xl font-bold tracking-widest">COLLEGY2026</span>
                      <Copy size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Friends Joined</p>
                    <p className="text-xl font-black italic">14</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Pending</p>
                    <p className="text-xl font-black italic text-[#E39F4A]">₹4,000</p>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full mt-10 py-6 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#3D6BE8] hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20">
                  Share Now
                </button>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="mt-8 flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-emerald-50 border border-emerald-100">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Top Influencer</p>
                <p className="text-xs font-bold text-emerald-600/80 tracking-tight">You are in the top 5% of referrers this month!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReferAndEarn;