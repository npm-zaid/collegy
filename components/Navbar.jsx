'use client'
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const COLLEGES_SECTIONS = [
  {
    title: "Top Colleges", color: "text-indigo-600",
    items: ["Amity University", "Bennett University", "Avantika University", "Parul University", "Universal AI University", "Doon Business School (DBS)", "Pimpri Chinchwad University"],
  },
  {
    title: "Popular Colleges", color: "text-violet-600",
    items: ["NIAT Colleges", "JKLU, Jaipur", "RIIMS, Pune", "Thakur Global Business School", "BITS, Pilani", "SVITS, Indore", "ITM, Gwalior"],
  },
  {
    title: "Online Degree Colleges", color: "text-blue-600",
    items: ["Amity University Online", "Parul University Online", "AISECT Online", "NIMMS University Online", "Jaipuriya University Online", "Manglaytan University Online", "Symbiosis University Online"],
  },
  {
    title: "Study Abroad", color: "text-cyan-600",
    items: ["UK", "USA", "UAE", "Nepal", "Canada", "Australia", "Germany"],
  },
];

const COURSES_COLS = [
  ["B. Tech / B.E.", "M. Tech / M.E.", "B. Arch", "B.Sc. IT / CS", "BCA", "MCA", "MBA", "BBA / BBM / BMS"],
  ["PGDM", "CA", "B. Com / B. Com (Hons)", "M. Com", "BA", "MA", "B.Sc", "M.Sc"],
  ["MBBS", "BDS", "BAMS / BHMS / BUMS", "B. Pharma", "M. Pharma", "B. Sc Nursing", "M. Sc Nursing", "AME"],
  ["CPL", "LLB", "BA LLB / BBA LLB", "BPT", "LLM", "B. Des", "M. Des", "BJMC"],
  ["MJMC", "BFA", "MFA", "BHM", "MHM", "B. Stat / B.Math", "M. Stat / M. Math", "B. Sc. Hospitality"],
];

const EXAMS_SECTIONS = [
  { title: "Engineering & Technology", color: "text-indigo-600", items: ["JEE Mains", "JEE Advance", "BITSAT", "VITEEE", "CUET"] },
  { title: "Medical & Health Science",  color: "text-red-600",    items: ["NEET UG", "AIIMS Nursing", "NEET PG", "INI-CET", "FMGE"] },
  { title: "Management",               color: "text-emerald-600", items: ["CAT", "XAT", "MAT", "CMAT", "NMAT"] },
  { title: "Law",                      color: "text-amber-600",   items: ["CLAT UG", "AILET", "CUET LLB", "LSAT India"] },
  { title: "Science & Research",       color: "text-violet-600",  items: ["NEST", "GATE", "IISER", "JAM", "ISI Admission Test"] },
  { title: "Commerce & Arts",          color: "text-cyan-600",    items: ["JAM", "CUET", "IPMAT", "SET", "NMAT"] },
  { title: "Design, Fashion & Arch",   color: "text-pink-600",    items: ["NID DAT", "UCEED", "CEED", "NIFT Entrance", "NATA"] },
];

const MORE_LINKS = [
  { icon: "ℹ️", label: "About Us" },       { icon: "📬", label: "Contact Us" },
  { icon: "🤝", label: "Be a Partner" },    { icon: "👥", label: "Join Our Team" },
  { icon: "💼", label: "Explore Careers" }, { icon: "🎯", label: "College Predictor" },
  { icon: "🧑‍💻", label: "Internships" },   { icon: "💳", label: "Education Loan" },
  { icon: "📅", label: "Book Consultation"},{ icon: "📄", label: "Terms & Conditions" },
];

const NAV_KEYS = ["colleges", "courses", "exams", "more"];

const MEGA_CONFIG = {
  colleges: { sections: COLLEGES_SECTIONS, cols: 4, viewAll: "View All Colleges" },
  exams:    { sections: EXAMS_SECTIONS,    cols: 5, viewAll: "View All Exams", splitAt: 5 },
};

function Chevron({ open }) {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ColLink({ children }) {
  return (
    <a href="#"
      className="block text-[0.79rem] font-medium text-gray-700 no-underline py-[3.5px] px-1 rounded-md transition-all duration-150 hover:text-indigo-600 hover:pl-2"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {children}
    </a>
  );
}

function SectionGrid({ sections, cols, mobile }) {
  return (
    <div className={mobile ? "space-y-3" : `grid gap-5`} style={!mobile ? { gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` } : {}}>
      {sections.map((sec) => (
        <div key={sec.title}>
          <div className={`font-bold uppercase tracking-widest mb-2 ${sec.color} ${mobile ? "text-[0.65rem]" : "text-[0.68rem]"}`}
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {sec.title}
          </div>
          {sec.items.map((item) => <ColLink key={item}>{item}</ColLink>)}
        </div>
      ))}
    </div>
  );
}

function ViewAll({ label }) {
  return (
    <div className="mt-5 pt-4 border-t border-indigo-50 flex justify-end">
      <a href="#" className="text-[0.75rem] font-bold text-indigo-600 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {label} →
      </a>
    </div>
  );
}

function PanelHeading({ children }) {
  return (
    <div className="text-[0.7rem] font-bold uppercase tracking-widest text-indigo-600 mb-4"
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      {children}
    </div>
  );
}

function MegaPanel({ megaKey }) {
  if (megaKey === "colleges" || megaKey === "exams") {
    const { sections, cols, viewAll, splitAt } = MEGA_CONFIG[megaKey];
    const row1 = splitAt ? sections.slice(0, splitAt) : sections;
    const row2 = splitAt ? sections.slice(splitAt) : null;
    return (
      <div className="p-7">
        <SectionGrid sections={row1} cols={cols} />
        {row2 && <div className="mt-0 pt-5 border-t border-indigo-50 mt-5"><SectionGrid sections={row2} cols={cols} /></div>}
        <ViewAll label={viewAll} />
      </div>
    );
  }

  if (megaKey === "courses") {
    return (
      <div className="p-7">
        <PanelHeading>Popular Courses</PanelHeading>
        <div className="grid grid-cols-5 gap-4">
          {COURSES_COLS.map((col, i) => (
            <div key={i}>{col.map((item) => <ColLink key={item}>{item}</ColLink>)}</div>
          ))}
        </div>
        <ViewAll label="View All Courses" />
      </div>
    );
  }

  if (megaKey === "more") {
    return (
      <div className="p-7">
        <PanelHeading>Quick Links</PanelHeading>
        <div className="grid grid-cols-5 gap-1">
          {MORE_LINKS.map((item) => (
            <a key={item.label} href="#"
              className="flex items-center gap-2 px-3 py-[9px] rounded-xl text-[0.82rem] font-semibold text-slate-800 no-underline transition-all duration-150 hover:bg-indigo-50/80 hover:translate-x-[3px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function MobilePanel({ megaKey }) {
  if (megaKey === "colleges" || megaKey === "exams") {
    const sections = megaKey === "colleges" ? COLLEGES_SECTIONS : EXAMS_SECTIONS;
    return <div className="pb-3 pt-2"><SectionGrid sections={sections} cols={1} mobile /></div>;
  }

  if (megaKey === "courses") {
    return (
      <div className="pb-3 grid grid-cols-2 gap-x-4 mt-2">
        {COURSES_COLS.flat().map((item) => <ColLink key={item}>{item}</ColLink>)}
      </div>
    );
  }

  if (megaKey === "more") {
    return (
      <div className="pb-3 mt-1">
        {MORE_LINKS.map((item) => (
          <a key={item.label} href="#"
            className="flex items-center gap-2 px-3 py-[9px] rounded-xl text-[0.82rem] font-semibold text-slate-800 no-underline hover:bg-indigo-50 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </a>
        ))}
      </div>
    );
  }

  return null;
}

export default function Navbar() {
  const navRef    = useRef(null);
  const logoRef   = useRef(null);
  const linksRef  = useRef(null);
  const ctaRef    = useRef(null);
  const megaRef   = useRef(null);
  const drawerRef = useRef(null);
  const timerRef  = useRef(null);

  const [scrolled,     setScrolled]     = useState(false);
  const [activeMega,   setActiveMega]   = useState(null);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [mobileExpand, setMobileExpand] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, linksRef.current, ctaRef.current], { opacity: 0, y: -14 });
      gsap.to([logoRef.current, linksRef.current, ctaRef.current], { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out", delay: 0.1 });
    }, navRef);
    return () => ctx.revert();
  }, []);

  const openMega = (key) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMega(key);
    requestAnimationFrame(() => {
      if (megaRef.current)
        gsap.fromTo(megaRef.current, { opacity: 0, y: -8, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power3.out" });
    });
  };

  const closeMega = () => {
    timerRef.current = setTimeout(() => {
      if (megaRef.current)
        gsap.to(megaRef.current, { opacity: 0, y: -5, scale: 0.97, duration: 0.18, ease: "power2.in", onComplete: () => setActiveMega(null) });
      else setActiveMega(null);
    }, 100);
  };

  const keepOpen = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  useEffect(() => {
    const d = drawerRef.current;
    if (!d) return;
    if (mobileOpen) {
      d.style.display = "block";
      gsap.fromTo(d, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
    } else {
      gsap.to(d, { opacity: 0, y: -8, duration: 0.18, ease: "power2.in", onComplete: () => { d.style.display = "none"; } });
    }
  }, [mobileOpen]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');`}</style>

      <nav ref={navRef}
        className={`sticky top-0 z-40 border-b border-indigo-100/80 transition-all duration-300 ${scrolled ? "shadow-[0_4px_28px_rgba(79,70,229,0.1)] bg-blue-50" : "bg-white"}`}
        style={{ backdropFilter: "blur(22px) saturate(180%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        <div className="max-w-[1280px] mx-auto px-7 flex items-center h-[66px] gap-2">

          <div ref={logoRef} className="flex items-center gap-2.5 mr-5 shrink-0">
            <div className="w-10 h-10 rounded-[13px] flex items-center justify-center shadow-[0_4px_16px_rgba(79,70,229,0.4)]"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <svg width="21" height="21" fill="none" stroke="white" strokeWidth="2.1" viewBox="0 0 24 24">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-[1.05rem] leading-none text-[#0f0a2e]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>CollegeFind</div>
              <div className="text-[0.57rem] font-bold tracking-[.07em] text-indigo-500 mt-0.5">DISCOVER · COMPARE · APPLY</div>
            </div>
          </div>

          <div ref={linksRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <button className="inline-flex items-center gap-1 px-[13px] py-[7px] rounded-[11px] text-sm font-semibold text-gray-700 bg-transparent border-0 cursor-pointer transition-all duration-150 hover:text-indigo-600 hover:bg-indigo-600/10"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Home
            </button>
            {NAV_KEYS.map((key) => (
              <button key={key}
                className={`inline-flex items-center gap-1 px-[13px] py-[7px] rounded-[11px] text-sm font-semibold border-0 cursor-pointer whitespace-nowrap transition-all duration-150 ${activeMega === key ? "text-indigo-600 bg-indigo-600/9" : "text-gray-700 bg-transparent hover:text-indigo-600 hover:bg-indigo-600/10"}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                onMouseEnter={() => openMega(key)} onMouseLeave={closeMega}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <Chevron open={activeMega === key} />
              </button>
            ))}
          </div>

          <div ref={ctaRef} className="hidden lg:flex items-center gap-2.5 ml-auto shrink-0">
            <button className="relative w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-500 hover:bg-indigo-100 transition-colors cursor-pointer">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
            </button>
            <div className="w-px h-7 bg-indigo-100" />
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white cursor-pointer border-0 shadow-[0_4px_18px_rgba(79,70,229,0.38)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.55)] hover:scale-[1.04] transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Join Us Now
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          <button className="lg:hidden ml-auto flex flex-col items-center justify-center gap-[5px] w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer p-2.5"
            onClick={() => setMobileOpen((p) => !p)} aria-label="Toggle menu">
            <span className={`block w-[18px] h-0.5 rounded bg-indigo-600 transition-all duration-250 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-[18px] h-0.5 rounded bg-indigo-600 transition-all duration-250 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-[18px] h-0.5 rounded bg-indigo-600 transition-all duration-250 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>

        {activeMega && (
          <div className="absolute left-0 right-0 top-full px-7 pb-5 z-[90]" onMouseEnter={keepOpen} onMouseLeave={closeMega}>
            <div className="max-w-[1280px] mx-auto">
              <div ref={megaRef}
                className="rounded-[22px] border border-indigo-100/70 shadow-[0_18px_60px_rgba(79,70,229,0.13),0_4px_16px_rgba(0,0,0,0.07)] overflow-hidden"
                style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(32px)" }}>
                <MegaPanel megaKey={activeMega} />
              </div>
            </div>
          </div>
        )}

        <div ref={drawerRef}
          className="lg:hidden absolute top-full left-0 right-0 z-[90] border-b border-indigo-100 shadow-[0_12px_40px_rgba(79,70,229,0.1)] px-6 pb-6 max-h-[75vh] overflow-y-auto"
          style={{ display: "none", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(28px)" }}>
          {[{ label: "Home", key: null }, ...NAV_KEYS.map((k) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), key: k }))].map(({ label, key }) => (
            <div key={label}>
              <button
                className="flex items-center justify-between w-full py-3 border-b border-indigo-50 text-[0.95rem] font-semibold text-[#1e1b4b] bg-transparent cursor-pointer border-x-0 border-t-0"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                onClick={() => key && setMobileExpand((p) => (p === key ? null : key))}>
                <span>{label}</span>
                {key && <Chevron open={mobileExpand === key} />}
              </button>
              {key && mobileExpand === key && <MobilePanel megaKey={key} />}
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-indigo-50">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white border-0 cursor-pointer shadow-[0_4px_18px_rgba(79,70,229,0.38)]"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Join Us Now
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </nav>
    </>
  );
}