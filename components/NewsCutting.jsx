
"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Newspaper, ExternalLink, Calendar, Bell } from 'lucide-react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NEWS_DATA = [
  {
    id: 1,
    source: "Times of India",
    date: "12 March 2026",
    headline: "Collegy AI Predictor Hits 99% Accuracy in 2026 Admission Cycle",
    excerpt: "The innovative platform has become the go-to resource for millions of Indian students seeking transparent admission data.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800",
    size: "large" 
  },
  {
    id: 2,
    source: "Economic Times",
    date: "05 April 2026",
    headline: "EdTech Startup Collegy Raises Series B Funding",
    excerpt: "Expansion plans include local language support for tier-2 city students.",
    image: "https://images.unsplash.com/photo-1585829365234-781f8c484dca?q=80&w=800",
    size: "small"
  },
  {
    id: 3,
    source: "Hindustan Times",
    date: "28 Feb 2026",
    headline: "Simplifying the Complex World of College Admissions",
    excerpt: "Collegy's compare tool is being hailed as the 'Google for Universities'.",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800",
    size: "small"
  },
  {
    id: 4,
    source: "NDTV Education",
    date: "10 April 2026",
    headline: "Top 5 Platforms Every College Aspirant Should Know",
    excerpt: "Collegy leads the pack with its user-centric dashboard and real-time fee updates.",
    image: "https://images.unsplash.com/photo-1503594384566-461fe158e797?q=80&w=800",
    size: "medium"
  }
];

const NewsCutting = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        gsap.fromTo(item, 
          { 
            y: 100, 
            opacity: 0, 
            rotate: index % 2 === 0 ? -2 : 2 
          },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 w-fit">
              <Newspaper size={14} className="text-[#3D6BE8]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">In The Press</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 leading-[0.9]">
              News <span className="italic text-[#3D6BE8]">Cuttings</span>
            </h2>
          </div>
          <p className="text-zinc-500 font-bold max-w-xs text-sm uppercase tracking-wider">
            Making headlines across the nation for revolutionizing education.
          </p>
        </div>

        {/* Bento-style News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_DATA.map((news, idx) => (
            <div
              key={news.id}
              ref={(el) => (itemsRef.current[idx] = el)}
              className={`group relative bg-white border border-zinc-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-[#3D6BE8]/20 transition-all duration-500 flex flex-col justify-between
                ${news.size === 'large' ? 'md:col-span-2 md:row-span-2 min-h-[500px]' : ''}
                ${news.size === 'medium' ? 'md:col-span-1 md:row-span-2' : ''}
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3D6BE8]">
                      {news.source}
                    </span>
                    <div className="flex items-center gap-2 text-zinc-400 mt-1">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase">{news.date}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#3D6BE8] transition-colors duration-300">
                    <ExternalLink size={16} className="text-zinc-300 group-hover:text-white" />
                  </div>
                </div>

                <h3 className={`font-black text-zinc-900 tracking-tight leading-none mb-4 group-hover:text-[#3D6BE8] transition-colors
                  ${news.size === 'large' ? 'text-4xl md:text-5xl' : 'text-2xl'}
                `}>
                  {news.headline}
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed mb-6">
                  {news.excerpt}
                </p>
              </div>

              {/* Featured Image inside the cutting */}
              <div className="relative w-full h-48 md:h-64 rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img 
                  src={news.image} 
                  alt={news.headline} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsCutting;