"use client";

import React, { useState, useRef, useEffect } from 'react';
import SecIntro from '../common/SecIntro';
import { gsap } from 'gsap';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Sparkles,
  X
} from 'lucide-react';



const testimonials = [
  {
    id: 1,
    name: "Mahak Kashyap",
    role: "Career Counselling / Business",
    views: "43.6K",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1580894732230-285093379443?auto=format&fit=crop&q=80&w=600",
    color: "#3D6BE8"
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "IIT Delhi / Mechanical Eng.",
    views: "12.1K",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
    color: "#818CF8"
  },
  {
    id: 3,
    name: "Sanya Iyer",
    role: "BITS Pilani / Computer Science",
    views: "8.9K",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    color: "#3D6BE8"
  },
  {
    id: 4,
    name: "Vidya Sharma",
    role: "EMI Resolved / Finance",
    views: "2.2K",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
    color: "#818CF8"
  }
];

const VideoReviews = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [playingId, setPlayingId] = useState(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const distance = index - activeIndex;
      const isCenter = distance === 0;
      
      // LOGIC: Show 3 on Large, 1 on Mobile
      const isVisible = isMobile ? isCenter : Math.abs(distance) <= 1;

      gsap.to(card, {
        autoAlpha: isVisible ? 1 : 0,
        display: isVisible ? "block" : "none",
        xPercent: isMobile ? 0 : distance * 85,
        scale: isCenter ? 1 : 0.65,
        rotateY: isMobile ? 0 : distance * -20,
        zIndex: isCenter ? 40 : 20,
        filter: isCenter ? "blur(0px)" : "blur(8px)",
        duration: 0.6,
        ease: "power2.out",
      });
    });
    
    setPlayingId(null);
  }, [activeIndex]);

  const handleNext = () => setActiveIndex(prev => (prev + 1) % testimonials.length);
  const handlePrev = () => setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);

  const togglePlay = (id, index) => {
    if (activeIndex === index) {
      setPlayingId(playingId === id ? null : id);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative py-20 flex flex-col items-center overflow-hidden min-h-[800px] ">
      
      <SecIntro
        badgeText="Studet Stories"
        badgeIcon={<Sparkles size={14} className="text-[#3D6BE8]" />}
        prefix="Voices of"
        highlight="Collegy"
        suffix=""
      />

      <div className="relative z-10 w-full max-w-6xl h-[550px] flex items-center justify-center perspective-1500">
        
        {/* Navigation Arrows */}
        <div className="absolute  inset-x-0 sm:top-1/2 top-[105%] -translate-y-0 sm:-translate-y-1/2 flex sm:justify-between justify-center gap-12 px-6 md:px-12 z-[50]">
          <button onClick={handlePrev} className="p-4 rounded-full bg-zinc-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-4 rounded-full bg-zinc-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Card Track */}
        <div className="relative  w-full flex justify-center items-center">
          {testimonials.map((item, idx) => {
            const isPlaying = playingId === item.id;
            const isCenter = activeIndex === idx;

            return (
              <div
                key={item.id}
                ref={el => cardsRef.current[idx] = el}
                onClick={() => togglePlay(item.id, idx)}
                className={`absolute w-[280px] md:w-[350px] h-[450px] md:h-[520px] rounded-[3.5rem] bg-black overflow-hidden shadow-2xl border-[6px] border-white cursor-pointer transition-shadow duration-500 ${isCenter ? 'shadow-zinc-300' : ''}`}
              >
                {isPlaying ? (
                  <div className="relative w-full h-full bg-black">
                    <video 
                      src={item.videoUrl} 
                      autoPlay 
                      controls 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPlayingId(null); }}
                      className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white z-50 hover:bg-white/40"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <img 
                      src={item.videoThumbnail} 
                      className={`w-full h-full object-cover transition-opacity duration-700 ${isCenter ? 'opacity-80' : 'opacity-40'}`} 
                      alt={item.name}
                    />
                    
                    {/* Play Button Overlay */}
                    {isCenter && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                          <Play size={24} className="text-black fill-black ml-1" />
                        </div>
                      </div>
                    )}

                    {/* View Badge */}
                    <div className="absolute top-6 right-8 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-white tracking-widest">{item.views}</span>
                    </div>

                    {/* Footer Content */}
                    <div className="absolute bottom-10 left-8 right-8 text-white">
                      <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">
                        {item.name}
                      </h3>
                      <div className="h-1 w-14 rounded-full mb-4" style={{ backgroundColor: item.color }} />
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] leading-tight">
                        {item.role}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Page Indicator */}
      <div className="flex gap-2 mt-20 md:hidden">
        {testimonials.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-[#3D6BE8]' : 'w-2 bg-zinc-200'}`} 
          />
        ))}
      </div>
    </section>
  );
};

export default VideoReviews;