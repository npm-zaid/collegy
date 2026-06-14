"use client";

import React, { useState, useRef, useEffect } from 'react';
import SecIntro from '../common/SecIntro';
import { gsap } from 'gsap';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';

const videos = [
  {
    id: 1,
    videoUrl: "/assets/vid1.mp4",
  },
  {
    id: 2,
    videoUrl: "/assets/vid2.mp4",
  },
  {
    id: 3,
    videoUrl: "/assets/vid3.mp4",
  },
  {
    id: 4,
    videoUrl: "/assets/vid4.mp4",
  }
];

const VideoReviews = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const cardsRef = useRef([]);
  const videoRefs = useRef([]);

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

    // Control play/pause of the video elements
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.muted = false;
        video.play().catch((err) => {
          // If browser autoplay policy blocks unmuted playback, play muted
          video.muted = true;
          video.play().catch((e) => console.log("Video playback failed: ", e));
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  const handleNext = () => setActiveIndex(prev => (prev + 1) % videos.length);
  const handlePrev = () => setActiveIndex(prev => (prev - 1 + videos.length) % videos.length);

  const handleCardClick = (index) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative py-20 flex flex-col items-center overflow-hidden min-h-[800px]">
      
      <SecIntro
        badgeText="Student Stories"
        badgeIcon={<Sparkles size={14} className="text-[#3D6BE8]" />}
        prefix="Voices of"
        highlight="FinaleBeacon"
        suffix=""
      />

      <div className="relative z-10 w-full max-w-6xl h-[550px] flex items-center justify-center perspective-1500">
        
        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 sm:top-1/2 top-[105%] -translate-y-0 sm:-translate-y-1/2 flex sm:justify-between justify-center gap-12 px-6 md:px-12 z-[50]">
          <button onClick={handlePrev} className="p-4 rounded-full bg-zinc-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-4 rounded-full bg-zinc-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Card Track */}
        <div className="relative w-full flex justify-center items-center">
          {videos.map((item, idx) => {
            const isCenter = activeIndex === idx;

            return (
              <div
                key={item.id}
                ref={el => cardsRef.current[idx] = el}
                onClick={() => handleCardClick(idx)}
                className={`absolute w-[280px] md:w-[350px] h-[450px] md:h-[520px] rounded-[3.5rem] bg-black overflow-hidden shadow-2xl border-[6px] border-white cursor-pointer transition-shadow duration-500 ${isCenter ? 'shadow-zinc-300' : ''}`}
              >
                <video
                  ref={el => videoRefs.current[idx] = el}
                  src={item.videoUrl}
                  className="w-full h-full object-cover"
                  controls={isCenter}
                  muted={!isCenter}
                  playsInline
                  loop
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Page Indicator */}
      <div className="flex gap-2 mt-20 md:hidden">
        {videos.map((_, i) => (
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