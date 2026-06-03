'use client';
import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { GraduationCap, CheckCircle2, PhoneCall, ArrowRight } from 'lucide-react';
import SecIntro from '../common/SecIntro';

const COUNTRY_DATA = [
  {
    id: 'usa',
    label: 'USA',
    flag: '🇺🇸',
    title: 'Study in USA',
    color: '#3D6BE8', // Collegy Blue
    image: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
    benefits: [
      'Study in top USA universities at affordable cost',
      '100% of the USA universities offers scholarships',
      'Average salary for Indian Students in the USA is $75,000',
      'Post study work permit up to 3 years'
    ]
  },
  {
    id: 'uk',
    label: 'UK',
    flag: '🇬🇧',
    title: 'United Kingdom',
    color: '#E31B23',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    benefits: [
      '50 out of the 100 top Universities are in the UK',
      'Highest quality of education at very affordable cost',
      'Study in the UK without IELTS/TOEFL/PTE',
      'UK offers 2 years of PSW & PR for Indian students'
    ]
  },
  {
    id: 'ireland',
    label: 'Ireland',
    flag: '🇮🇪',
    title: 'Masters in Ireland',
    color: '#009A49',
    image: 'https://images.pexels.com/photos/13352084/pexels-photo-13352084.jpeg',
    benefits: [
      'All Irish universities are ranked in the top 3% globally',
      'Pursue master’s with an affordable fees of 9 Lakhs',
      '99% of Indian students receive scholarship to study in Ireland',
      'Ireland offers 2 years of PSW & PR for Indian students'
    ]
  }
];

const StudyAbroad = () => {
  const [activeTab, setActiveTab] = useState(COUNTRY_DATA[0]);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Smooth transition between country data
    gsap.fromTo(contentRef.current, 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <section className="w-full  py-24 px-6 md:px-20 relative overflow-hidden">
      {/* Decorative Brand Accent (Top Right) */}
      <div className="absolute top-10 right-[-5%] w-1/4 h-1/4 bg-[#3D6BE8]/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto">
        <SecIntro 
          badgeText="Explore the World"
          prefix="Global"
          highlight="Education"
          suffix="Hubs"
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          
          {/* Main Display Area (Collegy UI Pattern) */}
          <div className="lg:col-span-8">
            <div 
              className="relative min-h-[500px] rounded-[3rem] overflow-hidden border border-zinc-100 shadow-2xl transition-all duration-700"
              style={{ background: `linear-gradient(135deg, ${activeTab.color}08, white)` }}
            >
              {/* Corner Accent matching image_411181.png pattern */}
              <div 
                className="absolute top-0 left-0 w-24 h-24 transition-colors duration-500"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)', 
                  backgroundColor: activeTab.color 
                }} 
              />

              <div ref={contentRef} className="p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center">
                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-5xl font-[1000] tracking-tighter leading-none mb-6">
                    {activeTab.title}
                  </h3>
                  
                  <ul className="space-y-4 mb-10">
                    {activeTab.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 size={18} className="mt-1 flex-shrink-0 transition-colors" style={{ color: activeTab.color }} />
                        <span className="text-zinc-600 font-bold text-sm group-hover:text-zinc-900 transition-colors">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg transition-transform active:scale-95 group"
                    style={{ backgroundColor: activeTab.color }}
                  >
                    Talk to an {activeTab.label} Expert
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Localized Image with Soft Shadow */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-zinc-200/50 rounded-full blur-3xl opacity-20" />
                  <img 
                    src={activeTab.image} 
                    alt={activeTab.title} 
                    className="relative z-10 w-full aspect-square object-cover rounded-[2.5rem] shadow-xl border-4 border-white grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Side Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 px-4">
              Choose your destination
            </h4>
            
            {COUNTRY_DATA.map((country) => (
              <button
                key={country.id}
                onClick={() => setActiveTab(country)}
                className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                  activeTab.id === country.id 
                  ? 'bg-white border-zinc-200 shadow-xl scale-[1.02] z-10' 
                  : 'bg-zinc-50 border-transparent hover:border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl filter grayscale-[0.5] group-hover:grayscale-0">{country.flag}</span>
                  <div className="text-left">
                    <p className={`font-black text-sm uppercase tracking-widest ${activeTab.id === country.id ? 'text-zinc-900' : 'text-zinc-500'}`}>
                      {country.label}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400">View Scholarships</p>
                  </div>
                </div>
                {activeTab.id === country.id && (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                    <GraduationCap size={16} />
                  </div>
                )}
              </button>
            ))}

            {/* Support CTA */}
            <div className="mt-auto p-6 rounded-3xl bg-[#E39F4A]/5 border border-[#E39F4A]/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E39F4A] mb-2 flex items-center gap-2">
                <PhoneCall size={12} /> Live Assistance
              </p>
              <p className="text-zinc-600 font-bold text-xs leading-relaxed">
                Need help with Visa? Our experts are available since 2019.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StudyAbroad;