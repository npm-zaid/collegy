'use client';
import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, MapPin, GraduationCap, Banknote, Search, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

const AI_COLLEGES = [
  { name: "Stanford University", match: "98%", location: "California, USA", fee: "$55k/yr", img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=400" },
  { name: "National University of Singapore", match: "94%", location: "Singapore", fee: "$32k/yr", img: "https://images.unsplash.com/photo-1523050853023-8c2d27443ef8?q=80&w=400" },
  { name: "University of Melbourne", match: "89%", location: "Victoria, Australia", fee: "$38k/yr", img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=400" },
];

export default function CollegePredictor() {
  const [step, setStep] = useState(1); // 1: Form, 2: Radar, 3: Results
  const [formData, setFormData] = useState({ course: '', location: '', budget: '' });
  const containerRef = useRef(null);
  const radarRef = useRef(null);

  const nextStep = () => {
    gsap.to(".step-content", { 
      opacity: 0, y: -20, duration: 0.3, 
      onComplete: () => setStep(prev => prev + 1) 
    });
  };

  useGSAP(() => {
    gsap.fromTo(".step-content", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });

    if (step === 2) {
      // Radar Animation
      gsap.to(".radar-line", {
        rotate: 360,
        duration: 2,
        repeat: -1,
        ease: "none"
      });
      // Auto-move to results after 3 seconds of "searching"
      setTimeout(() => nextStep(), 3500);
    }
  }, [step]);

  return (
    <section className="w-full bg-white py-24 px-6 overflow-hidden min-h-[800px] flex flex-col items-center">
      {/* Animated BG Accents */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#3D6BE8]/5 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#E39F4A]/5 blur-[100px] rounded-full animate-pulse" />

      <div className="max-w-4xl w-full relative z-10" ref={containerRef}>
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Sparkles size={14} className="text-[#3D6BE8]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3D6BE8]">Collegy AI Predictor 2026</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-[1000] tracking-tighter leading-tight text-zinc-900">
            Find Your <span className="text-[#3D6BE8]">Perfect Match</span>
          </h2>
        </div>

        {/* Step 1: Futuristic Form */}
        {step === 1 && (
          <div className="step-content bg-zinc-50/50 backdrop-blur-xl border border-zinc-200 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-500/5">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <GraduationCap size={14}/> Target Course
                </label>
                <input 
                  className="w-full bg-white border border-zinc-200 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-[#3D6BE8] outline-none transition-all"
                  placeholder="e.g. Data Science"
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <MapPin size={14}/> Preferred Location
                </label>
                <input 
                  className="w-full bg-white border border-zinc-200 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-[#3D6BE8] outline-none transition-all"
                  placeholder="e.g. United Kingdom"
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Banknote size={14}/> Max Budget
                </label>
                <input 
                  className="w-full bg-white border border-zinc-200 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-[#3D6BE8] outline-none transition-all"
                  placeholder="e.g. $40,000"
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={nextStep}
              className="w-full bg-[#3D6BE8] text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-[#E39F4A] transition-all group"
            >
              Analyze My Profile
              <Search size={18} className="group-hover:scale-125 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 2: Radar Animation */}
        {step === 2 && (
          <div className="step-content flex flex-col items-center justify-center py-20">
            <div className="relative w-64 h-64 mb-10">
              {/* Radar Circles */}
              <div className="absolute inset-0 border-2 border-blue-100 rounded-full" />
              <div className="absolute inset-8 border border-blue-50 rounded-full" />
              <div className="absolute inset-20 border border-blue-50 rounded-full" />
              
              {/* Spinning Line */}
              <div className="radar-line absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-[#3D6BE8] origin-left z-10" />
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Sparkles className="text-[#3D6BE8] animate-pulse" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-zinc-900 animate-pulse">Scanning Global Database...</h3>
            <p className="text-zinc-400 font-bold mt-2">Matching your profile with 5,000+ colleges</p>
          </div>
        )}

        {/* Step 3: Top 3 Colleges */}
        {step === 3 && (
          <div className="step-content space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter">AI Top Recommendations</h3>
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#3D6BE8] transition-colors"
              >
                <RefreshCw size={14} /> Start Over
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {AI_COLLEGES.map((college, i) => (
                <div key={i} className="group bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-48">
                    <img src={college.img} alt={college.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-[#3D6BE8]">
                      {college.match} Match
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-lg leading-tight mb-2">{college.name}</h4>
                    <div className="flex items-center gap-2 text-zinc-400 mb-4">
                      <MapPin size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{college.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                      <div className="text-[10px] font-black text-[#E39F4A] uppercase tracking-widest">Est: {college.fee}</div>
                      <button className="p-2 rounded-full bg-blue-50 text-[#3D6BE8] group-hover:bg-[#3D6BE8] group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 rounded-3xl bg-zinc-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-[#E39F4A]">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="font-black uppercase tracking-widest text-xs">Verify your profile with an expert</p>
                  <p className="text-zinc-400 text-[10px] font-bold">12k+ students analyzed this week</p>
                </div>
              </div>
              <button className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#E39F4A] hover:text-white transition-all">
                Talk to Mentor
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}