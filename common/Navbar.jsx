'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_KEYS = ["colleges", "courses", "exams", "more"];

const DATA = {
  colleges: {
    viewAll: "View All Colleges",
    sections: [
      { title: "Top Colleges",           emoji: "🏆", color: "text-indigo-600",  bg: "bg-indigo-50",  items: ["IIT Bombay","AIIMS","Bennett University","Avantika University","Parul University","Universal AI University","Doon Business School","Pimpri Chinchwad University"] },
      { title: "Popular Colleges",       emoji: "⭐", color: "text-violet-600",  bg: "bg-violet-50",  items: ["IIT Delhi","JKLU, Jaipur","RIIMS, Pune","Thakur Global Business School","BITS, Pilani","SVITS, Indore","ITM, Gwalior"] },
      { title: "Online Degree Colleges", emoji: "💻", color: "text-blue-600",    bg: "bg-blue-50",    items: ["Amity University Online","Parul University Online","AISECT Online","NIMMS University Online","Jaipuriya University Online","Manglaytan University Online","Symbiosis University Online"] },
      { title: "Study Abroad",           emoji: "✈️", color: "text-cyan-600",    bg: "bg-cyan-50",    items: ["UK","USA","UAE","Nepal","Canada","Australia","Germany"] },
    ],
  },
  courses: {
    viewAll: "View All Courses",
    columns: [
      ["B. Tech / B.E.","M. Tech / M.E.","B. Arch","B.Sc. IT / CS","BCA","MCA","MBA","BBA / BBM / BMS"],
      ["PGDM","CA","B. Com / B. Com (Hons)","M. Com","BA","MA","B.Sc","M.Sc"],
      ["MBBS","BDS","BAMS / BHMS / BUMS","B. Pharma","M. Pharma","B. Sc Nursing","M. Sc Nursing","AME"],
      ["CPL","LLB","BA LLB / BBA LLB","BPT","LLM","B. Des","M. Des","BJMC"],
      ["MJMC","BFA","MFA","BHM","MHM","B. Stat / B.Math","M. Stat / M. Math","B. Sc. Hospitality"],
    ],
  },
  exams: {
    viewAll: "View All Exams",
    sections: [
      { title: "Engineering",  emoji: "⚙️", color: "text-indigo-600",  bg: "bg-indigo-50",  items: ["JEE Mains","JEE Advance","BITSAT","VITEEE","CUET"] },
      { title: "Medical",      emoji: "🏥", color: "text-red-600",     bg: "bg-red-50",     items: ["NEET UG","AIIMS Nursing","NEET PG","INI-CET","FMGE"] },
      { title: "Management",   emoji: "📊", color: "text-emerald-600", bg: "bg-emerald-50", items: ["CAT","XAT","MAT","CMAT","NMAT"] },
      { title: "Law",          emoji: "⚖️", color: "text-amber-600",   bg: "bg-amber-50",   items: ["CLAT UG","AILET","CUET LLB","LSAT India"] },
      { title: "Science",      emoji: "🔬", color: "text-violet-600",  bg: "bg-violet-50",  items: ["NEST","GATE","IISER","JAM","ISI Admission"] },
      { title: "Commerce",     emoji: "📈", color: "text-cyan-600",    bg: "bg-cyan-50",    items: ["JAM","CUET","IPMAT","SET","NMAT"] },
      { title: "Design & Arch",emoji: "🎨", color: "text-pink-600",    bg: "bg-pink-50",    items: ["NID DAT","UCEED","CEED","NIFT","NATA"] },
    ],
  },
  more: {
    links: [
      { icon: "ℹ️",  label: "About Us",          desc: "Our story & mission" },
      { icon: "📬",  label: "Contact Us",         desc: "Get in touch" },
      { icon: "🤝",  label: "Be a Partner",       desc: "Grow with us" },
      { icon: "🎯",  label: "College Predictor",  desc: "Find your best fit" },
      { icon: "🧑‍💻", label: "Internships",         desc: "Kick-start your career" },
      // { icon: "💳",  label: "Education Loan",     desc: "Fund your education" },
      { icon: "📅",  label: "Book Consultation",  desc: "Talk to an expert" },
      { icon: "🤝",  label: "Refer & Earn",       desc: "Earn rewards" },
      { icon: "📄",  label: "Terms & Conditions", desc: "Policies & rules" },
    ],
  },
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

const ChevronIcon = ({ open }) => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// NavLink — calls onClose when clicked so the mega panel shuts immediately
const NavLink = ({ href, children, onClose }) => {
  const cls = `
    group flex items-center gap-1.5 text-[0.8rem] font-medium text-gray-600
    py-[4px] px-2 rounded-lg transition-all duration-150
    hover:text-indigo-600 hover:bg-indigo-50/70 hover:pl-3
  `;
  const handleClick = () => onClose?.();
  return href
    ? <Link href={href} className={cls} onClick={handleClick}>
        <span className="w-1 h-1 rounded-full bg-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        {children}
      </Link>
    : <a href="#" className={cls} onClick={handleClick}>
        <span className="w-1 h-1 rounded-full bg-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        {children}
      </a>;
};

const SectionLabel = ({ color, bg, emoji, children, mobile }) => (
  <div
    data-label="1"
    className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-widest mb-2.5 ${color} ${mobile ? "text-[0.6rem]" : "text-[0.63rem]"}`}
    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
  >
    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${bg}`}>{emoji}</span>
    {children}
  </div>
);

const ViewAllLink = ({ label, onClose }) => (
  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
    <Link
      href="/explore"
      onClick={onClose}
      className="group inline-flex items-center gap-2 text-[0.78rem] font-bold text-[#2667ff] px-4 py-2 rounded-xl bg-[#2667ff]/8 border border-[#2667ff]/20 hover:bg-[#2667ff]/15 hover:border-[#2667ff]/40 transition-all duration-200"
    >
      {label}
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        className="group-hover:translate-x-1 transition-transform duration-200">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
);

// ─── Section grid ─────────────────────────────────────────────────────────────

const SectionGrid = ({ sections, cols, mobile = false, routable = false, onClose }) => (
  <div
    className={mobile ? "space-y-4" : "grid gap-6"}
    style={!mobile ? { gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` } : {}}
  >
    {sections.map((sec) => (
      <div key={sec.title}>
        <SectionLabel color={sec.color} bg={sec.bg} emoji={sec.emoji} mobile={mobile}>
          {sec.title}
        </SectionLabel>
        {sec.items.map((item) => (
          <NavLink key={item} href={routable ? `/explore/${toSlug(item)}` : undefined} onClose={onClose}>
            {item}
          </NavLink>
        ))}
      </div>
    ))}
  </div>
);

// ─── Desktop mega panel content ───────────────────────────────────────────────

const PanelHeading = ({ children }) => (
  <div className="text-[0.63rem] font-bold uppercase tracking-widest text-indigo-500 mb-5"
    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
    {children}
  </div>
);

const MegaContent = ({ megaKey, onClose }) => {
  if (megaKey === "colleges") {
    const { sections, viewAll } = DATA.colleges;
    return (
      <div className="p-7">
        <SectionGrid sections={sections} cols={4} routable onClose={onClose} />
        <ViewAllLink label={viewAll} onClose={onClose} />
      </div>
    );
  }
  if (megaKey === "exams") {
    const { sections, viewAll } = DATA.exams;
    const [row1, row2] = [sections.slice(0, 4), sections.slice(4)];
    return (
      <div className="p-7">
        <SectionGrid sections={row1} cols={4} routable onClose={onClose} />
        <div className="mt-6 pt-6 border-t border-gray-100">
          <SectionGrid sections={row2} cols={4} routable onClose={onClose} />
        </div>
        <ViewAllLink label={viewAll} onClose={onClose} />
      </div>
    );
  }
  if (megaKey === "courses") {
    const { columns, viewAll } = DATA.courses;
    return (
      <div className="p-7">
        <PanelHeading>Popular Courses</PanelHeading>
        <div className="grid grid-cols-5 gap-4">
          {columns.map((col, i) => (
            <div key={i}>
              {col.map((item) => (
                <NavLink key={item} href={`/explore/${toSlug(item)}`} onClose={onClose}>{item}</NavLink>
              ))}
            </div>
          ))}
        </div>
        <ViewAllLink label={viewAll} onClose={onClose} />
      </div>
    );
  }
  if (megaKey === "more") {
    return (
      <div className="p-7">
        <PanelHeading>Quick Links</PanelHeading>
        <div className="grid grid-cols-4 gap-3">
          {DATA.more.links.map(({ icon, label, desc }) => (
            <Link key={label} href={`/${toSlug(label)}`} onClick={onClose}
              className="group flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="text-xl shrink-0 mt-0.5">{icon}</span>
              <div>
                <div className="text-[0.82rem] font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors leading-tight">{label}</div>
                <div className="text-[0.7rem] text-gray-400 mt-0.5">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// ─── Mobile content ───────────────────────────────────────────────────────────

const MobileContent = ({ megaKey, onClose }) => {
  if (megaKey === "colleges")
    return <div className="pb-3 pt-2"><SectionGrid sections={DATA.colleges.sections} cols={1} mobile routable onClose={onClose} /></div>;
  if (megaKey === "exams")
    return <div className="pb-3 pt-2"><SectionGrid sections={DATA.exams.sections} cols={1} mobile routable onClose={onClose} /></div>;
  if (megaKey === "courses")
    return (
      <div className="pb-3 grid grid-cols-2 gap-x-4 mt-2">
        {DATA.courses.columns.flat().map((item) => (
          <NavLink key={item} href={`/explore/${toSlug(item)}`} onClose={onClose}>{item}</NavLink>
        ))}
      </div>
    );
  if (megaKey === "more")
    return (
      <div className="pb-3 mt-1">
        {DATA.more.links.map(({ icon, label }) => (
          <Link key={label} href={`/${toSlug(label)}`} onClick={onClose}
            className="flex items-center gap-2 px-3 py-[9px] rounded-xl text-[0.82rem] font-semibold text-slate-800 hover:bg-indigo-50 transition-colors no-underline">
            <span>{icon}</span><span>{label}</span>
          </Link>
        ))}
      </div>
    );
  return null;
};

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5 mr-5 shrink-0">
    <div className="w-10 h-10 rounded-[13px] bg-[#2667ff] flex items-center justify-center shadow-[0_4px_16px_rgba(38,103,255,0.4)]">
      <svg width="21" height="21" fill="none" stroke="white" strokeWidth="2.1" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    </div>
    <div>
      <div className="font-extrabold text-[1.05rem] leading-none text-[#0f0a2e]">Collegy</div>
      <div className="text-[0.57rem] font-bold tracking-[.07em] text-indigo-500 mt-0.5">DISCOVER · COMPARE · APPLY</div>
    </div>
  </Link>
);

const HamburgerButton = ({ open, onClick }) => (
  <button onClick={onClick} aria-label="Toggle menu"
    className="lg:hidden ml-auto flex flex-col items-center justify-center gap-[5px] w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer p-2.5">
    {[
      open ? "rotate-45 translate-y-[7px]" : "",
      open ? "opacity-0 scale-x-0" : "",
      open ? "-rotate-45 -translate-y-[7px]" : "",
    ].map((cls, i) => (
      <span key={i} className={`block w-[18px] h-0.5 rounded bg-[#2667ff] transition-all duration-250 ${cls}`} />
    ))}
  </button>
);

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const navRef     = useRef(null);
  const logoRef    = useRef(null);
  const linksRef   = useRef(null);
  const ctaRef     = useRef(null);
  const megaRef    = useRef(null);
  const drawerRef  = useRef(null);
  const closeTimer = useRef(null);

  const [scrolled,     setScrolled]     = useState(false);
  const [activeMega,   setActiveMega]   = useState(null);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [mobileExpand, setMobileExpand] = useState(null);

  // ── Scroll shadow ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mount animation ────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, linksRef.current, ctaRef.current], { opacity: 0, y: -18, filter: "blur(6px)" });
      gsap.to([logoRef.current, linksRef.current, ctaRef.current], {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.7, stagger: 0.12, ease: "expo.out", delay: 0.1,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  // ── Force-close (called from NavLink onClick) ──────────────────────────────
  const forceCloseMega = useCallback(() => {
    clearTimeout(closeTimer.current);
    if (megaRef.current) {
      gsap.to(megaRef.current, {
        opacity: 0, y: -8, scale: 0.97,
        duration: 0.18, ease: "power2.in",
        onComplete: () => setActiveMega(null),
      });
    } else {
      setActiveMega(null);
    }
  }, []);

  // ── Hover open ────────────────────────────────────────────────────────────
  const openMega = useCallback((key) => {
    clearTimeout(closeTimer.current);
    if (activeMega === key) return;

    const isSwitch = activeMega !== null;
    setActiveMega(key);

    requestAnimationFrame(() => {
      if (!megaRef.current) return;
      if (isSwitch) {
        // Crossfade + slight horizontal slide when switching tabs
        gsap.fromTo(megaRef.current,
          { opacity: 0.5, x: -8 },
          { opacity: 1,   x: 0, duration: 0.22, ease: "power2.out" }
        );
      } else {
        // Full entrance
        gsap.fromTo(megaRef.current,
          { opacity: 0, y: -16, scale: 0.96, transformOrigin: "top center" },
          { opacity: 1, y: 0,   scale: 1,    duration: 0.38, ease: "expo.out" }
        );
        // Stagger section labels
        const labels = megaRef.current.querySelectorAll("[data-label]");
        gsap.fromTo(labels,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power3.out", delay: 0.1 }
        );
        // Stagger links
        const links = megaRef.current.querySelectorAll("a");
        gsap.fromTo(links,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.32, stagger: 0.008, ease: "power2.out", delay: 0.14 }
        );
      }
    });
  }, [activeMega]);

  // ── Hover close (with delay so user can move into the panel) ──────────────
  const closeMega = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      if (megaRef.current) {
        gsap.to(megaRef.current, {
          opacity: 0, y: -8, scale: 0.97,
          duration: 0.2, ease: "power2.in",
          onComplete: () => setActiveMega(null),
        });
      } else {
        setActiveMega(null);
      }
    }, 120);
  }, []);

  const keepOpen = useCallback(() => clearTimeout(closeTimer.current), []);

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    if (mobileOpen) {
      el.style.display = "block";
      gsap.fromTo(el,
        { opacity: 0, y: -14, filter: "blur(4px)" },
        { opacity: 1, y: 0,   filter: "blur(0px)", duration: 0.32, ease: "expo.out" }
      );
    } else {
      gsap.to(el, {
        opacity: 0, y: -10, filter: "blur(4px)",
        duration: 0.2, ease: "power2.in",
        onComplete: () => { el.style.display = "none"; },
      });
    }
  }, [mobileOpen]);

  const toggleMobileExpand = useCallback((key) => {
    setMobileExpand((prev) => (prev === key ? null : key));
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .mega-panel-border {
          position: relative;
        }
        .mega-panel-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 22px;
          padding: 1px;
          background: linear-gradient(135deg,
            rgba(99,102,241,0.3) 0%,
            rgba(56,189,248,0.15) 50%,
            rgba(99,102,241,0.25) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
                        linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      <nav
        ref={navRef}
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-indigo-100/60 shadow-[0_4px_32px_rgba(38,103,255,0.08)] bg-white/95"
            : "border-indigo-50 bg-white"
        }`}
        style={{ backdropFilter: "blur(24px) saturate(180%)" }}
      >
        {/* ── Top bar ── */}
        <div className="max-w-[1280px] mx-auto px-7 flex items-center h-[66px] gap-2">

          <div ref={logoRef}><Logo /></div>

          {/* Desktop nav links */}
          <div ref={linksRef} className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_KEYS.map((key) => {
              const isActive = activeMega === key;
              return (
                <button
                  key={key}
                  onMouseEnter={() => openMega(key)}
                  onMouseLeave={closeMega}
                  className={`
                    relative inline-flex items-center gap-1.5 px-[14px] py-[7px] rounded-xl
                    text-[0.85rem] font-semibold border-0 cursor-pointer whitespace-nowrap
                    transition-all duration-200
                    ${isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 bg-transparent hover:text-indigo-600 hover:bg-indigo-50/70"
                    }
                  `}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <ChevronIcon open={isActive} />
                
                </button>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div ref={ctaRef} className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
            <button
              onClick={() => setIsNotiOpen(true)}
              className="relative w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-500 hover:bg-indigo-100 hover:border-indigo-200 transition-all cursor-pointer"
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-[1.5px] border-white" />
            </button>

            <div className="w-px h-6 bg-indigo-100" />

        
           <Link href="/contact-us" className="flex btn items-center bg-gradient-to-br from-[#2667ff] to-[#3f8efc] gap-2 px-5 py-2.5 rounded-3xl text-sm font-bold text-white cursor-pointer border-0 shadow-[0_4px_18px_rgba(79,70,229,0.38)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.55)] no-underline">
           Join Us Now
          </Link>
          </div>

          <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen((p) => !p)} />
        </div>

        {/* ── Desktop mega panel ── */}
        {activeMega && (
          <div
            className="absolute left-0 right-0 top-full px-6 pb-5 z-[90]"
            onMouseEnter={keepOpen}
            onMouseLeave={closeMega}
          >
            <div className="max-w-[1280px] mx-auto">
              <div
                ref={megaRef}
                className="mega-panel-border rounded-[22px] overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.99)",
                  backdropFilter: "blur(40px)",
                  boxShadow: "0 24px 80px rgba(38,103,255,0.13), 0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                {/* Gradient accent bar at top */}
                <div className="h-[3px] w-full bg-gradient-to-r from-[#2667ff] via-[#818cf8] to-[#38bdf8]" />

                {/* In-panel tab strip — hover to switch sections without leaving the panel */}
                <div className="flex items-center gap-0.5 px-7 pt-3 border-b border-gray-100/80">
                  {NAV_KEYS.map((key) => (
                    <button
                      key={key}
                      onMouseEnter={() => openMega(key)}
                      className={`
                        text-[0.72rem] font-bold uppercase tracking-wider px-3.5 py-2.5 border-b-2
                        transition-all duration-200 cursor-pointer bg-transparent rounded-t-lg
                        ${activeMega === key
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                        }
                      `}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>

                <MegaContent megaKey={activeMega} onClose={forceCloseMega} />
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile drawer ── */}
        <div
          ref={drawerRef}
          style={{ display: "none", background: "rgba(255,255,255,0.98)", backdropFilter: "blur(28px)" }}
          className="lg:hidden absolute top-full left-0 right-0 z-[90] border-b border-indigo-100 shadow-[0_12px_40px_rgba(38,103,255,0.1)] px-5 pb-5 max-h-[75vh] overflow-y-auto"
        >
          {[{ label: "Home", key: null }, ...NAV_KEYS.map((k) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), key: k }))].map(({ label, key }) => (
            <div key={label}>
              {key === null ? (
                <Link
                  href="/"
                  onClick={() => { setMobileOpen(false); setMobileExpand(null); }}
                  className="flex items-center justify-between w-full py-3 border-b border-indigo-50 text-[0.9rem] font-semibold text-[#1e1b4b] bg-transparent cursor-pointer border-x-0 border-t-0 no-underline"
                >
                  <span>{label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => toggleMobileExpand(key)}
                  className="flex items-center justify-between w-full py-3 border-b border-indigo-50 text-[0.9rem] font-semibold text-[#1e1b4b] bg-transparent cursor-pointer border-x-0 border-t-0"
                >
                  <span>{label}</span>
                  <ChevronIcon open={mobileExpand === key} />
                </button>
              )}
              {key && mobileExpand === key && (
                <MobileContent megaKey={key} onClose={() => { setMobileOpen(false); setMobileExpand(null); }} />
              )}
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-indigo-50">
            <Link href="/contact-us" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white border-0 cursor-pointer bg-gradient-to-r from-[#2667ff] to-[#3f8efc] no-underline">
              Join Us
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}