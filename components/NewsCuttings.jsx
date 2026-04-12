"use client";
import SecIntro from "../common/SecIntro";
import React from "react";
import { 
  ExternalLink, 
  Share2, 
  TrendingUp, 
  ArrowUpRight,
  Clock
} from "lucide-react";

const NEWS_CUTTINGS = [
  {
    id: 1,
    source: "The Economic Times",
    headline: "Collegy AI Predictor Sees 40% Surge in Tier-2 City Usage",
    date: "24 Feb, 2026",
    tag: "Market Trend",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    rotation: "-1.5deg"
  },
  {
    id: 2,
    source: "Business Standard",
    headline: "New UGC Guidelines 2026: What Every Aspirant Must Know",
    date: "22 Feb, 2026",
    tag: "Education Policy",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    rotation: "2deg"
  },
  {
    id: 3,
    source: "Education World",
    headline: "Top 10 Engineering Colleges Redefining Placement Records",
    date: "20 Feb, 2026",
    tag: "Ranking 2026",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
    rotation: "-0.8deg"
  }
];

export default function NewsCuttings() {
  return (
    <section className="py-24 px-6 overflow-hidden ">
      <div className="max-w-7xl mx-auto">
        <SecIntro
          badgeText="Press Headlines"
          prefix="Collegy in"
          highlight="Media"
          suffix=""
        />

        {/* --- NEWS GRID --- */}
        <div className="grid lg:grid-cols-3 gap-12 mt-16">
          {NEWS_CUTTINGS.map((news) => (
            <div
              key={news.id}
              style={{ transform: `rotate(${news.rotation})` }}
              className="group relative bg-white p-7 rounded-sm shadow-[10px_10px_20px_rgba(0,0,0,0.05)]  transition-all duration-500 hover:rotate-0 hover:-translate-y-4 border-b-[6px] border-[#3D6BE8] overflow-hidden"
            >
              {/* --- THE PAPER FOLD ANIMATION (Top Left) --- */}
              <div 
                className="absolute top-0 left-0 w-0 h-0 bg-white transition-all duration-300 ease-in-out group-hover:w-10 group-hover:h-10 z-30 shadow-[2px_2px_5px_rgba(0,0,0,0.1)] rounded-br-lg"
                style={{
                  background: `linear-gradient(135deg, rgba(250,250,250,1) 0%, rgba(250,250,250,1) 50%, #2b4eb3 50%, #3D6BE8 60%)`,
                  boxShadow: "0.2em 0.2em 0.2em rgba(0, 0, 0, 0.3)"
                }}
              />

              {/* Image Clipping */}
              <div className="relative aspect-[16/10] overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                <img 
                  src={news.image} 
                  alt="Headline" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-[#3D6BE8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-4 right-4 w-12 h-12 bg-white flex items-center justify-center rounded-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                  <ArrowUpRight size={20} className="text-[#3D6BE8]" />
                </div>
              </div>

              {/* Source & Date */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-[1000] text-[#3D6BE8] uppercase tracking-[0.15em] border-b-2 border-[#3D6BE8] pb-0.5">
                  {news.source}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold">
                  <Clock size={12} /> {news.date}
                </div>
              </div>

              {/* Headline */}
              <h3 className="text-3xl font-[1000] text-zinc-900 tracking-tighter leading-[1.1] mb-8 group-hover:text-[#3D6BE8] transition-colors font-serif italic">
                "{news.headline}"
              </h3>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#3D6BE8] animate-pulse" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{news.tag}</span>
                </div>
                <div className="flex gap-5">
                  <button className="text-zinc-300 hover:text-zinc-900 transition-colors transform hover:scale-110"><Share2 size={18} /></button>
                  <button className="text-zinc-300 hover:text-[#3D6BE8] transition-colors transform hover:scale-110"><ExternalLink size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTTOM PARTNERS --- */}
        <div className="mt-28 py-10 border-y border-[#3D6BE8] flex flex-col md:flex-row items-center justify-around gap-10">
         
              <div className="text-2xl font-black tracking-tighter">FINANCIAL EXPRESS</div>
              <div className="text-2xl font-black tracking-tighter">DAINIK BHASKAR</div>
              <div className="text-2xl font-black tracking-tighter">THE HINDU</div>
              <div className="text-2xl font-black tracking-tighter">MINT</div>
       
           
        </div>
      </div>
    </section>
  );
}