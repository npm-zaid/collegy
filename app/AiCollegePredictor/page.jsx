'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, MapPin, GraduationCap, Banknote, Search, CheckCircle, ArrowRight, RefreshCw, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, '-') || "";
const formatFee = (val) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000)   return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

export default function CollegePredictor() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Form, 2: Radar, 3: Results
  const [formData, setFormData] = useState({ course: 'Any', location: 'Any', budget: 'Any' });
  const containerRef = useRef(null);
  
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiColleges, setAiColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("https://finale-beacon-backend.vercel.app/api/colleges");
        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map(c => {
              let feeNumeric = 0;
              const feesList = c.courses?.map(co => co.fees?.yearlyFees || co.fees?.totalFees || 0).filter(f => f > 0) || [];
              if (feesList.length > 0) {
                feeNumeric = Math.min(...feesList);
              } else if (c.feesRange) {
                const clean = c.feesRange.toLowerCase().replace(/,/g, '');
                const matches = clean.match(/[\d.]+/g);
                if (matches && matches.length > 0) {
                  const baseNum = parseFloat(matches[matches.length - 1]);
                  let multiplier = 1;
                  if (clean.includes("lakh") || clean.includes("lac") || clean.includes("l")) multiplier = 100000;
                  else if (clean.includes("k") || clean.includes("thousand")) multiplier = 1000;
                  feeNumeric = baseNum * multiplier;
                }
              }
              
              return {
                id: c._id || c.collegeId,
                name: c.collegeName || "Unknown",
                city: c.location?.city || "Unknown",
                state: c.location?.state || "Unknown",
                courses: c.courses?.map(co => co.courseName) || [],
                feeNumeric,
                fee: c.feesRange || (c.courses?.[0]?.fees?.totalFees ? formatFee(c.courses[0].fees.totalFees) : "N/A"),
                img: c.media?.images?.[0]?.filename 
                  ? (c.media.images[0].filename.startsWith('http') ? c.media.images[0].filename : `https://finale-beacon-backend.vercel.app/uploads/colleges/${c.media.images[0].filename}`)
                  : "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=400"
              };
          });
          setColleges(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const ALL_COURSES = useMemo(() => {
    const courses = new Set(colleges.flatMap(c => c.courses));
    return ["Any", ...Array.from(courses).sort()];
  }, [colleges]);

  const ALL_LOCATIONS = useMemo(() => {
    const states = new Set(colleges.map(c => c.state).filter(Boolean));
    return ["Any", ...Array.from(states).sort()];
  }, [colleges]);

  const BUDGET_OPTIONS = [
    { label: "Any Budget", value: "Any" },
    { label: "Under ₹1 Lakh/yr", value: "under1" },
    { label: "₹1L - ₹5L/yr", value: "1to5" },
    { label: "₹5L - ₹15L/yr", value: "5to15" },
    { label: "₹15L+/yr", value: "above15" }
  ];

  const calculateMatches = () => {
    let validColleges = [...colleges];

    // Strict Filter for Location
    if (formData.location !== 'Any') {
      validColleges = validColleges.filter(c => c.state === formData.location);
    }

    // Strict Filter for Course
    if (formData.course !== 'Any') {
      validColleges = validColleges.filter(c => c.courses.some(course => course.toLowerCase().includes(formData.course.toLowerCase())));
    }

    // Strict Filter for Budget
    if (formData.budget !== 'Any') {
      validColleges = validColleges.filter(c => {
        if (c.feeNumeric <= 0) return true; // Keep if fee is unknown
        const fee = c.feeNumeric;
        if (formData.budget === 'under1') return fee <= 100000;
        if (formData.budget === '1to5') return fee >= 100000 && fee <= 500000;
        if (formData.budget === '5to15') return fee >= 500000 && fee <= 1500000;
        if (formData.budget === 'above15') return fee >= 1500000;
        return true;
      });
    }

    const scored = validColleges.map(c => {
      // Base high score since it passed strict filters
      let score = 95 - Math.floor(Math.random() * 8); 
      return { ...c, match: Math.max(75, Math.min(score, 99)) };
    });

    const top3 = scored.sort((a, b) => b.match - a.match).slice(0, 3);
    setAiColleges(top3);
  };

  const nextStep = () => {
    if (step === 1) {
      calculateMatches();
    }
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
        duration: 1.5,
        repeat: -1,
        ease: "none"
      });
      // Auto-move to results after 3 seconds
      setTimeout(() => nextStep(), 3000);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 py-24 px-6 overflow-x-hidden flex flex-col items-center">
      {/* ── Background glow blobs (Buzzar signature) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-10%] w-[450px] h-[450px] bg-[#2667ff]/10 blur-[110px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#2667ff]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl w-full relative z-10" ref={containerRef}>
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 w-fit mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">AI Predictor</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] uppercase mb-4">
            Find Your <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic pr-2">Perfect Match</span>
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mb-6 mt-2" />
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto">
            Our AI analyzes real-time college data to find the best institutes tailored exactly to your preferences.
          </p>
        </div>

        {/* Step 1: Futuristic Form */}
        {step === 1 && (
          <div className="step-content bg-white/60 backdrop-blur-3xl border-2 border-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-500/10">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <GraduationCap size={16} className="text-[#2667ff]" /> Target Course
                </label>
                <div className="relative group">
                  <select 
                    disabled={loading}
                    className="w-full bg-white border-2 border-zinc-100 rounded-3xl p-5 font-bold focus:ring-4 focus:ring-[#2667ff]/10 focus:border-[#2667ff] outline-none transition-all appearance-none cursor-pointer group-hover:border-[#2667ff]/30 text-zinc-800"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                  >
                    {loading ? <option>Loading...</option> : ALL_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-[#2667ff] transition-colors" size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <MapPin size={16} className="text-[#2667ff]" /> Preferred State
                </label>
                <div className="relative group">
                  <select 
                    disabled={loading}
                    className="w-full bg-white border-2 border-zinc-100 rounded-3xl p-5 font-bold focus:ring-4 focus:ring-[#2667ff]/10 focus:border-[#2667ff] outline-none transition-all appearance-none cursor-pointer group-hover:border-[#2667ff]/30 text-zinc-800"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    {loading ? <option>Loading...</option> : ALL_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-[#2667ff] transition-colors" size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Banknote size={16} className="text-[#2667ff]" /> Max Budget
                </label>
                <div className="relative group">
                  <select 
                    className="w-full bg-white border-2 border-zinc-100 rounded-3xl p-5 font-bold focus:ring-4 focus:ring-[#2667ff]/10 focus:border-[#2667ff] outline-none transition-all appearance-none cursor-pointer group-hover:border-[#2667ff]/30 text-zinc-800"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  >
                    {BUDGET_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-[#2667ff] transition-colors" size={20} />
                </div>
              </div>
            </div>
            
            <button 
              onClick={nextStep}
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-[#2667ff] transition-all duration-300 group shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? 'Initializing AI...' : 'Analyze My Profile'}
                {!loading && <Search size={18} className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />}
              </span>
            </button>
          </div>
        )}

        {/* Step 2: Radar Animation */}
        {step === 2 && (
          <div className="step-content flex flex-col items-center justify-center py-20">
            <div className="relative w-72 h-72 mb-12">
              {/* Radar Circles */}
              <div className="absolute inset-0 border-2 border-[#2667ff]/20 rounded-full" />
              <div className="absolute inset-8 border border-[#2667ff]/10 rounded-full" />
              <div className="absolute inset-20 border border-[#2667ff]/10 rounded-full" />
              
              {/* Spinning Line */}
              <div className="radar-line absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-[#2667ff] origin-left z-10" />
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-xl shadow-blue-500/20 flex items-center justify-center border border-zinc-100">
                  <Sparkles className="text-[#2667ff] animate-pulse" size={24} />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-zinc-900 animate-pulse italic">Scanning Database</h3>
            <p className="text-zinc-500 font-bold mt-3 tracking-wide">Evaluating {colleges.length} colleges for optimal match...</p>
          </div>
        )}

        {/* Step 3: Top 3 Colleges */}
        {step === 3 && (
          <div className="step-content space-y-8">
            <div className="flex flex-col items-start mb-10">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 w-fit mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2667ff]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">AI Recommendations</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
                <div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic text-zinc-900">Your Perfect Fit</h3>
                  <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-4 mb-2" />
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-[#2667ff] hover:text-[#2667ff] transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw size={14} /> Start Over
                </button>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {aiColleges.length > 0 ? (
                aiColleges.map((college, i) => (
                  <div 
                    key={college.id} 
                    onClick={() => router.push(`/explore/${toSlug(college.name)}`)}
                    className="group bg-white border-2 border-white rounded-[2.5rem] overflow-hidden hover:border-[#2667ff]/30 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col"
                  >
                    <div className="relative h-56 shrink-0">
                      <img src={college.img} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-[#2667ff] shadow-lg flex items-center gap-1.5">
                        <Sparkles size={12} /> {college.match}% Fit
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h4 className="font-black text-xl leading-tight mb-3 text-zinc-900 group-hover:text-[#2667ff] transition-colors line-clamp-2">{college.name}</h4>
                      <div className="flex items-center gap-2 text-zinc-500 mb-6 mt-auto">
                        <MapPin size={14} className="text-[#2667ff]" />
                        <span className="text-xs font-bold uppercase tracking-widest">{college.city}, {college.state}</span>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-zinc-100">
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Est. Fee</div>
                          <div className="text-sm font-black text-zinc-900 uppercase tracking-widest">{college.fee}</div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-[#2667ff] group-hover:bg-[#2667ff] group-hover:text-white transition-colors shadow-sm">
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-zinc-200">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <Search size={24} />
                  </div>
                  <h4 className="font-black text-xl text-zinc-800 mb-2 uppercase tracking-tight">No Exact Matches</h4>
                  <p className="text-zinc-500 font-medium">Try broadening your search criteria (like changing location or budget to "Any").</p>
                </div>
              )}
            </div>
            
            <div className="mt-16 p-10 rounded-[3rem] bg-zinc-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border-2 border-[#2667ff]/40">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2667ff]/10 to-transparent opacity-50" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 bg-[#2667ff]/20 border border-[#2667ff]/30 rounded-2xl flex items-center justify-center text-[#3f8efc] backdrop-blur shrink-0">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2667ff]/20 border border-[#2667ff]/30 w-fit mb-3 mx-auto md:mx-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#3f8efc]">Admissions Open</span>
                  </div>
                  <h4 className="font-black text-2xl md:text-3xl italic tracking-tight uppercase mb-2">Want expert validation?</h4>
                  <p className="text-zinc-400 text-sm font-medium max-w-md">Connect with our admission counselors to review your AI matches and plan your next steps.</p>
                </div>
              </div>
              <button className="relative z-10 bg-[#2667ff] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#1a4fd4] hover:scale-[1.02] transition-all shadow-xl active:scale-95 whitespace-nowrap">
                Talk to Mentor
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}