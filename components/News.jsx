"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Newspaper,
  Share2
} from "lucide-react";

const PRESS_DATA = [
  {
    id: 1,
    logo: "Inc42",
    img: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=800",
    title: "How Collegy is Cracking The Chaos In India's Digital Higher...",
    link: "#"
  },
  {
    id: 2,
    logo: "APN NEWS",
    img: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800",
    title: "Collegy's edtech revolution hits JioHotstar's 'Brands of Tomorrow'...",
    link: "#"
  },
  {
    id: 3,
    logo: "YOURSTORY",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    title: "Collegy- The Amazon of Online Education Ecosystem",
    link: "#"
  },
  {
    id: 4,
    logo: "THE ECONOMIC TIMES",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800",
    title: "Women's enrolment in AI & ML programs rises by 4 times, says report",
    link: "#"
  }
];

const LOGOS = ["Inc42", "APN NEWS", "YOURSTORY", "The Economic Times", "Financial Express"];

export default function News() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".press-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    });
    return () => ctx.revert();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#FDFDFD] overflow-hidden px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 press-reveal">
          <p className="text-[#2667ff] font-black uppercase tracking-[0.3em] text-[10px] mb-4 flex items-center gap-2">
            <Newspaper size={14} /> Find us in the news!
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              We've been in the news. <br />
              <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent italic">
                200+ Mentions!
              </span>
            </h2>
            
            <div className="flex gap-3">
              <button onClick={() => scroll('left')} className="p-4 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll('right')} className="p-4 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Slider Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PRESS_DATA.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[320px] md:min-w-[400px] snap-start press-reveal group"
            >
              <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-[#2667ff] transition-colors">
                    <Share2 size={16} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-[#2667ff] rounded-full" />
                    <span className="font-black text-[12px] uppercase tracking-widest text-zinc-400">
                      {item.logo}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black leading-tight tracking-tight mb-8 text-zinc-800 min-h-[3rem]">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <a href={item.link} className="group/link flex items-center gap-2 text-[#2667ff] text-[10px] font-black uppercase tracking-widest">
                      Read More 
                      <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logo Ticker (Optional Footer for the section) */}
        <div className="mt-12 pt-12 border-t border-zinc-100 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {LOGOS.map((logo, index) => (
            <span key={index} className="text-sm font-black uppercase tracking-widest italic">{logo}</span>
          ))}
          <a href="#" className="text-[10px] font-black text-[#2667ff] underline tracking-widest uppercase">Explore Media →</a>
        </div>

      </div>
    </section>
  );
}