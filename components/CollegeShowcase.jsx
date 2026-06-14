'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SecIntro from '../common/SecIntro';

const COLLEGES = [
  { name: "Amity University", url: "/assets/Artboard 1.png" },
  { name: "LPU", url: "/assets/Artboard 2.png" },
  { name: "MIT", url: "/assets/Artboard 3.png" },
  { name: "Sharda", url: "/assets/Artboard 4.png" },
  { name: "IIM Ahmedabad", url: "/assets/Artboard 5.png" },
  { name: "Oxford", url: "/assets/Artboard 6.png" },
  { name: "Oxford", url: "/assets/Artboard 7.png" },
  { name: "Oxford", url: "/assets/Artboard 8.png" },
  { name: "Oxford", url: "/assets/Artboard 9.png" },
  { name: "Oxford", url: "/assets/Artboard 10.png" },
    { name: "Oxford", url: "/assets/Artboard 11.png" },
  { name: "Oxford", url: "/assets/Artboard 12.png" },
  { name: "Oxford", url: "/assets/Artboard 13.png" },
  { name: "Oxford", url: "/assets/Artboard 14.png" },
  { name: "Oxford", url: "/assets/Artboard 15.png" },
  { name: "Oxford", url: "/assets/Artboard 18.png" },
  { name: "Oxford", url: "/assets/Artboard 19.png" },
  { name: "Oxford", url: "/assets/Artboard 20.png" },
 
 
];

const Row = ({ items, speed, direction = 'left' }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollWidth = el.scrollWidth / 2;

    const tween = gsap.to(el, {
      x: direction === 'left' ? -scrollWidth : 0,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });

    if (direction === 'right') {
      gsap.set(el, { x: -scrollWidth });
    }

    el.addEventListener('mouseenter', () => tween.pause());
    el.addEventListener('mouseleave', () => tween.play());

    return () => tween.kill();
  }, [speed, direction]); // Improved dependency array

  return (
    <div className="relative w-full overflow-hidden py-3 select-none">
      <div ref={scrollRef} className="flex w-max items-center">
        {[...items, ...items].map((college, index) => (
          <div key={index} className="flex-shrink-0 mx-3 group">
            <div className="w-52 h-28 flex items-center justify-center p-2 rounded-3xl bg-white border border-zinc-200 shadow-sm group-hover:border-[#3D6BE8]/40 transition-all duration-500 group-hover:bg-zinc-50 group-hover:shadow-md">
              <img
                src={college.url}
                alt={college.name}
                className="w-[90%] h-[90%] object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CollegeShowcase = () => {
  return (
    /* Background changed to white */
    <section className="w-full py-24 relative overflow-hidden">
 
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-20">
        <SecIntro
          badgeText="Global Reach"
          prefix="Strategic"
          highlight="University"
          suffix="Network"
        />
      </div>

      <div className="relative z-10">
        {/* Gradients updated to fade into white */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-indigo-50 via-indigo-50/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-blue-100 via-blue-100/80 to-transparent z-20 pointer-events-none" />

        <Row items={COLLEGES} speed={40} direction="left" />
        <Row items={[...COLLEGES].reverse()} speed={50} direction="right" />
        <Row items={COLLEGES} speed={45} direction="left" />
        <Row items={[...COLLEGES].reverse()} speed={35} direction="right" />
      </div>
      
      <div className="mt-12 text-center relative z-20">
         {/* Slightly darker text for readability */}
         <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Human Verified Partners • AI Data Driven
         </p>
      </div>
    </section>
  );
};

export default CollegeShowcase;