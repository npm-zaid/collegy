'use client';
import React, { useState } from 'react';
import { 
  Users, 
  Gift, 
  Share2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const ReferAndEarn = () => {
  const [formData, setFormData] = useState({
    agentName: '',
    agentContact: '',
    studentName: '',
    studentContact: '',
    course: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const API_URL = "https://finale-beacon-backend.vercel.app";
      const res = await fetch(`${API_URL}/api/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Referral submitted successfully!' });
        setFormData({
          agentName: '',
          agentContact: '',
          studentName: '',
          studentContact: '',
          course: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to the server' });
    }
    setLoading(false);
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
                  Collegy Agent Program
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter leading-[0.95] text-zinc-900 italic">
                Become an Agent, <br />
                <span className="text-[#3D6BE8]">Refer & Grow.</span>
              </h2>
              <p className="text-lg font-bold text-zinc-500 max-w-xl border-l-4 border-zinc-100 pl-6">
                Help students find the right path. Submit their details, guide them through our ecosystem, and earn exciting rewards as a certified Collegy Agent.
              </p>
            </div>

            {/* Steps Visual */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Users, title: "Submit", desc: "Enter student details" },
                { icon: Share2, title: "Connect", desc: "We contact the student" },
                { icon: Gift, title: "Get Rewarded", desc: "Earn when they enroll" },
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

          {/* Right: Referral Form Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-zinc-900 rounded-[3.5rem] p-10 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3D6BE8]/20 blur-[80px] rounded-full" />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="text-3xl font-[1000] tracking-tighter italic">Refer a Student</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-2">Submit details to earn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {message.text && (
                    <div className={`p-4 rounded-2xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {message.text}
                    </div>
                  )}
                  {/* Agent Details */}
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      name="agentName"
                      value={formData.agentName}
                      onChange={handleChange}
                      placeholder="Agent Name" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#3D6BE8]/50 focus:bg-white/10 transition-all font-medium placeholder:text-zinc-500" 
                      required
                    />
                    <input 
                      type="text" 
                      name="agentContact"
                      value={formData.agentContact}
                      onChange={handleChange}
                      placeholder="Agent Contact" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#3D6BE8]/50 focus:bg-white/10 transition-all font-medium placeholder:text-zinc-500" 
                      required
                    />
                  </div>

                  <div className="h-[1px] w-full bg-white/10 my-4" />

                  {/* Student Details */}
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Student Name" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#3D6BE8]/50 focus:bg-white/10 transition-all font-medium placeholder:text-zinc-500" 
                      required
                    />
                    <input 
                      type="text" 
                      name="studentContact"
                      value={formData.studentContact}
                      onChange={handleChange}
                      placeholder="Student Contact" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#3D6BE8]/50 focus:bg-white/10 transition-all font-medium placeholder:text-zinc-500" 
                      required
                    />
                    <input 
                      type="text" 
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Course Interested In" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#3D6BE8]/50 focus:bg-white/10 transition-all font-medium placeholder:text-zinc-500" 
                      required
                    />
                  </div>

                  {/* CTA */}
                  <button type="submit" disabled={loading} className="w-full mt-8 py-5 flex items-center justify-center gap-2 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#3D6BE8] hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Referral'}
                  </button>
                </form>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="mt-8 flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-emerald-50 border border-emerald-100">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Trusted Agent</p>
                <p className="text-xs font-bold text-emerald-600/80 tracking-tight">Your referrals have high conversion rates!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReferAndEarn;