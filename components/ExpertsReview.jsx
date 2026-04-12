"use client";
import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  User,
  Star,
  ExternalLink,
  Award
} from "lucide-react";

const EXPERTS_REVIEW = [
  { id: 1, name: "ROHIT GUPTA", title: "Education Expert", detail: "MBA • 8 Years Exp", rating: 4.8, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
  { id: 2, name: "SARTHAK GARG", title: "Sr. Mentor", detail: "MCA • 6 Years Exp", rating: 4.7, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" },
  { id: 3, name: "SAKSHI RAJPUT", title: "Sr. Mentor", detail: "M.Com • 5 Years Exp", rating: 4.5, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
  { id: 4, name: "MANISH THAPLIYAL", title: "Sr. Mentor", detail: "MA • 6 Years Exp", rating: 4.6, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400" },
  { id: 5, name: "ANANYA IYER", title: "Career Coach", detail: "M.Sc • 7 Years Exp", rating: 4.9, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" },
  { id: 6, name: "VIKRAM SETH", title: "Admissions Head", detail: "PhD • 12 Years Exp", rating: 4.8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
  { id: 7, name: "PRIYA SHARMA", title: "Global Advisor", detail: "MBA • 4 Years Exp", rating: 4.7, image: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?q=80&w=400" },
  { id: 8, name: "KARAN OBEROI", title: "Tech Mentor", detail: "M.Tech • 9 Years Exp", rating: 4.6, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" },
  { id: 9, name: "MEERA DAS", title: "Counselor", detail: "MSW • 10 Years Exp", rating: 4.5, image: "https://images.unsplash.com/photo-1598550874175-4d0fe4a2c90b?q=80&w=400" },
  { id: 10, name: "ARJUN VERMA", title: "Strategy Lead", detail: "PGDM • 15 Years Exp", rating: 4.9, image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400" }
];

export default function ExpertsReview() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % (EXPERTS_REVIEW.length - itemsPerPage + 1));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + (EXPERTS_REVIEW.length - itemsPerPage + 1)) % (EXPERTS_REVIEW.length - itemsPerPage + 1));
  };

  return (
    <section className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#3D6BE8] font-black uppercase tracking-[0.3em] text-xs mb-4 block">
              Academic Council
            </span>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
              Right Guidance from <span className="text-[#3D6BE8]">Experts</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrev}
              className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#3D6BE8] hover:text-[#3D6BE8] transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={handleNext}
              className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#3D6BE8] hover:text-[#3D6BE8] transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        {/* --- GRID TRACK --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERTS_REVIEW.slice(startIndex, startIndex + itemsPerPage).map((expert) => (
            <div 
              key={expert.id} 
              className="group relative bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-3"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={expert.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={expert.name} 
                />
                
                {/* Rating Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
                  <Star size={14} className="text-[#3D6BE8] fill-[#3D6BE8]" />
                  <span className="text-sm font-black text-slate-900">{expert.rating}</span>
                </div>

                {/* Consultant CTA Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D6BE8]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                  <button className="bg-white text-[#3D6BE8] px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Consult Now <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 text-center bg-white">
                <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                  {expert.name}
                </h4>
                <p className="text-[#3D6BE8] text-xs font-black uppercase tracking-widest mb-4">
                  {expert.title}
                </p>
                <div className="h-px w-12 bg-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  {expert.detail}
                </p>
              </div>

              {/* Top Accent Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                <Award size={24} className="text-slate-400 group-hover:text-[#3D6BE8]" />
              </div>
            </div>
          ))}
        </div>

        {/* --- PAGINATION STATUS --- */}
        <div className="mt-16 flex items-center justify-center gap-2">
          {Array.from({ length: EXPERTS_REVIEW.length - itemsPerPage + 1 }).map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 transition-all duration-300 rounded-full ${i === startIndex ? "w-8 bg-[#3D6BE8]" : "w-2 bg-slate-200"}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}