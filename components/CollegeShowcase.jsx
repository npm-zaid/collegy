'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SecIntro from '../common/SecIntro';

const COLLEGES = [
  { name: "Amity University", url: "https://d1aeya7jd2fyco.cloudfront.net/logo/amity-online-university-logo_2.webp" },
  { name: "LPU", url: "https://d1aeya7jd2fyco.cloudfront.net/logo/lpu-logo.webp" },
  { name: "MIT", url: "https://www.logo.wine/a/logo/Massachusetts_Institute_of_Technology/Massachusetts_Institute_of_Technology-Logo.wine.svg" },
  { name: "IIT Delhi", url: "https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_logo.svg" },
  { name: "IIM Ahmedabad", url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/IIM_Ahmedabad_Logo.svg/1200px-IIM_Ahmedabad_Logo.svg.png" },
  { name: "Oxford", url: "https://www.logo.wine/a/logo/University_of_Oxford/University_of_Oxford-Logo.wine.svg" },
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
            <div className="w-52 h-28 flex items-center justify-center p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm group-hover:border-[#3D6BE8]/40 transition-all duration-500 group-hover:bg-zinc-50 group-hover:shadow-md">
              <img
                src={college.url}
                alt={college.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-all duration-500"
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
      {/* Softened background glows for light theme */}
      <div className="absolute top-[-10%] left-[-5%] w-1/3 h-1/3 bg-[#3D6BE8]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-1/3 h-1/3 bg-[#E39F4A]/5 blur-[120px] rounded-full" />

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
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

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