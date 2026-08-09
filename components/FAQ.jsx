"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Plus, Minus, HelpCircle } from "lucide-react";

 const faqs = [
  {
    id:1,
    question: "How does the personalized college recommendation work?",
    answer: "Our AI-driven engine analyzes your academic profile, exam scores, preferred location, and budget to match you with colleges where you have the highest probability of admission and career success.",
  },
  {
     id:2,
    question: "Are the cutoff scores updated for the 2026 session?",
    answer: "Yes, we monitor official university portals and NTA updates daily. The cutoffs currently displayed reflect the latest trends and historical data for the upcoming 2026-27 academic year.",
  },
  {
    id:3,
    question: "Can I compare multiple colleges at once?",
    answer: "Absolutely! You can select up to 4 colleges to compare side-by-side across 20+ parameters including fees, placement packages, faculty ratio, and campus facilities.",
  },
  {
    id:4,
    question: "Is the application process through Finale Beacon free?",
    answer: "Browsing and comparing colleges is 100% free. If you choose to apply through our 'One-Click Apply' system, you only pay the college's official application fee—there are no hidden platform charges.",
  },
  {
    id:5,
    question: "How can I connect with alumni of a specific college?",
    answer: "Each college page has a 'Connect with Alumni' section where you can book a 10-minute discovery call with verified former students to get an honest review of the campus life.",
  }
];



export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const contentRefs = useRef([]);
  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    faqs.forEach((faq, index) => {
      const element = contentRefs.current[index];
      if (!element) return;

      if (openId === faq.id) {
        // Open animation
        gsap.to(element, {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power3.inOut",
          overwrite: true,
        });
      } else {
        // Close animation
        gsap.to(element, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
          overwrite: true,
        });
      }
    });
  }, [openId]);

  return (
    <section className=" py-10 relative overflow-hidden">
      {/* Soft Background Accent */}
      {/* <div className="absolute w-[500px] h-[500px] rounded-full blur-[150px] bg-[#2667ff]/10 -bottom-40 -left-20 pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 mb-4">
            <HelpCircle size={14} className="text-[#2667ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
              Common Queries
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] text-zinc-900">
            Frequently Asked <br />
              <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic pr-3">
              Questions
            </span>
          </h2>
              <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2" />
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`group rounded-[2rem] border-2 transition-colors duration-500 ${
                  isOpen
                    ? "bg-zinc-50 border-[#2667ff] shadow-xl shadow-[#2667ff]/5"
                    : "bg-white border-zinc-200"
                }`}
              >
                <button
                  className="w-full flex justify-between items-center p-7 text-left focus:outline-none"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span
                    className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${
                      isOpen ? "text-zinc-900" : "text-zinc-600"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isOpen 
                        ? "bg-[#2667ff] text-gray-200 rotate-180" 
                        : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                    }`}
                  >
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                {/* GSAP Target Container */}
                <div
                  ref={(el) => { contentRefs.current[index] = el }}
                  className="overflow-hidden h-0 opacity-0"
                >
                  <div className="px-7 pb-8">
                    <div className="h-[1px] w-full bg-zinc-200 mb-6" />
                    <p className="text-zinc-500 font-medium leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}