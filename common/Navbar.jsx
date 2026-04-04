'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";

// Converts "Amity University" → "amity-university"
const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_KEYS = ["colleges", "courses", "exams", "more"];

const DATA = {
  colleges: {
    viewAll: "View All Colleges",
    sections: [
      { title: "Top Colleges",          color: "text-indigo-600", items: ["IIT Bombay","AIIMS","Bennett University","Avantika University","Parul University","Universal AI University","Doon Business School (DBS)","Pimpri Chinchwad University"] },
      { title: "Popular Colleges",      color: "text-violet-600", items: ["IIT Delhi","JKLU, Jaipur","RIIMS, Pune","Thakur Global Business School","BITS, Pilani","SVITS, Indore","ITM, Gwalior"] },
      { title: "Online Degree Colleges",color: "text-blue-600",   items: ["Amity University Online","Parul University Online","AISECT Online","NIMMS University Online","Jaipuriya University Online","Manglaytan University Online","Symbiosis University Online"] },
      { title: "Study Abroad",          color: "text-cyan-600",   items: ["UK","USA","UAE","Nepal","Canada","Australia","Germany"] },
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
      { title: "Engineering & Technology", color: "text-indigo-600", items: ["JEE Mains","JEE Advance","BITSAT","VITEEE","CUET"] },
      { title: "Medical & Health Science",  color: "text-red-600",    items: ["NEET UG","AIIMS Nursing","NEET PG","INI-CET","FMGE"] },
      { title: "Management",               color: "text-emerald-600", items: ["CAT","XAT","MAT","CMAT","NMAT"] },
      { title: "Law",                      color: "text-amber-600",   items: ["CLAT UG","AILET","CUET LLB","LSAT India"] },
      { title: "Science & Research",       color: "text-violet-600",  items: ["NEST","GATE","IISER","JAM","ISI Admission Test"] },
      { title: "Commerce & Arts",          color: "text-cyan-600",    items: ["JAM","CUET","IPMAT","SET","NMAT"] },
      { title: "Design, Fashion & Arch",   color: "text-pink-600",    items: ["NID DAT","UCEED","CEED","NIFT Entrance","NATA"] },
    ],
  },
  more: {
    links: [
      { icon: "ℹ️", label: "About Us" },        { icon: "📬", label: "Contact Us" },
      { icon: "🤝", label: "Be a Partner" },    
      { icon: "🎯", label: "College Predictor" },
      { icon: "🧑‍💻", label: "Internships" },    { icon: "💳", label: "Education Loan" },
      { icon: "📅", label: "Book Consultation" },{ icon: "📄", label: "Terms & Conditions" },
    ],
  },
};

// ─── Tiny reusable atoms ──────────────────────────────────────────────────────

const ChevronIcon = ({ open }) => (
  <svg
    width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const NavLink = ({ href, children }) => {
  const cls = "block text-[0.79rem] font-medium text-gray-700 py-[3.5px] px-1 rounded-md transition-all duration-150 hover:text-indigo-600 hover:pl-2";
  const style = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
  return href
    ? <Link href={href} className={cls} style={style}>{children}</Link>
    : <a href="#" className={cls} style={style}>{children}</a>;
};

const SectionLabel = ({ color, children, mobile }) => (
  <div
    className={`font-bold uppercase tracking-widest mb-2 ${color} ${mobile ? "text-[0.65rem]" : "text-[0.68rem]"}`}
    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
  >
    {children}
  </div>
);

const PanelHeading = ({ children }) => (
  <div
    className="text-[0.7rem] font-bold uppercase tracking-widest text-indigo-600 mb-4"
    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
  >
    {children}
  </div>
);

const ViewAllLink = ({ label }) => (
  <div className="mt-5 pt-4 border-t border-indigo-50 flex justify-end">
    <a
      href="#"
      className="text-[0.75rem] font-bold text-[#2667ff] px-4 py-2 rounded-lg bg-[#2667ff]/10 border border-[#2667ff]/30 hover:bg-indigo-100 transition-colors"
    >
      {label} →
    </a>
  </div>
);

// ─── Section grid (shared between desktop & mobile) ───────────────────────────

const SectionGrid = ({ sections, cols, mobile = false, routable = false }) => (
  <div
    className={mobile ? "space-y-3" : "grid gap-5"}
    style={!mobile ? { gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` } : {}}
  >
    {sections.map((sec) => (
      <div key={sec.title}>
        <SectionLabel color={sec.color} mobile={mobile}>{sec.title}</SectionLabel>
        {sec.items.map((item) => (
          <NavLink key={item} href={routable ? `/explore/${toSlug(item)}` : undefined}>{item}</NavLink>
        ))}
      </div>
    ))}
  </div>
);

// ─── Desktop mega-panel content ───────────────────────────────────────────────

const MegaContent = ({ megaKey }) => {
  if (megaKey === "colleges") {
    const { sections, viewAll } = DATA.colleges;
    return (
      <div className="p-7">
        <SectionGrid sections={sections} cols={4} routable />
        <ViewAllLink label={viewAll} />
      </div>
    );
  }

  if (megaKey === "exams") {
    const { sections, viewAll } = DATA.exams;
    const [row1, row2] = [sections.slice(0, 5), sections.slice(5)];
    return (
      <div className="p-7">
        <SectionGrid sections={row1} cols={5} routable />
        <div className="mt-5 pt-5 border-t border-indigo-50">
          <SectionGrid sections={row2} cols={5} routable />
        </div>
        <ViewAllLink label={viewAll} />
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
            <div key={i}>{col.map((item) => <NavLink key={item} href={`/explore/${toSlug(item)}`}>{item}</NavLink>)}</div>
          ))}
        </div>
        <ViewAllLink label={viewAll} />
      </div>
    );
  }

  if (megaKey === "more") {
    return (
      <div className="p-7">
        <PanelHeading>Quick Links</PanelHeading>
        <div className="grid grid-cols-5 gap-1">
          {DATA.more.links.map(({ icon, label }) => (
            <a
              key={label} href={`/${toSlug(label)}`}
              className="flex items-center gap-2 px-3 py-[9px] rounded-xl text-[0.82rem] font-semibold text-slate-800 transition-all duration-150 hover:bg-indigo-50/80 hover:translate-x-[3px]"
             
            >
            
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// ─── Mobile accordion panel content ──────────────────────────────────────────

const MobileContent = ({ megaKey }) => {
  if (megaKey === "colleges")
    return <div className="pb-3 pt-2"><SectionGrid sections={DATA.colleges.sections} cols={1} mobile routable /></div>;

  if (megaKey === "exams")
    return <div className="pb-3 pt-2"><SectionGrid sections={DATA.exams.sections} cols={1} mobile routable /></div>;

  if (megaKey === "courses")
    return (
      <div className="pb-3 grid grid-cols-2 gap-x-4 mt-2">
        {DATA.courses.columns.flat().map((item) => <NavLink key={item} href={`/explore/${toSlug(item)}`}>{item}</NavLink>)}
      </div>
    );

  if (megaKey === "more")
    return (
      <div className="pb-3 mt-1">
        {DATA.more.links.map(({ icon, label }) => (
          <a
            key={label} href="#"
            className="flex items-center gap-2 px-3 py-[9px] rounded-xl text-[0.82rem] font-semibold text-slate-800 hover:bg-indigo-50 transition-colors"
            
          >
           <span>{label}</span>
          </a>
        ))}
      </div>
    );

  return null;
};

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5 mr-5 shrink-0">
    <div className="w-10 h-10 rounded-[13px] bg-[#2667ff] flex items-center justify-center shadow-[0_4px_16px_rgba(79,70,229,0.4)]">
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

// ─── Hamburger icon ───────────────────────────────────────────────────────────

const HamburgerButton = ({ open, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Toggle menu"
    className="lg:hidden ml-auto flex flex-col items-center justify-center gap-[5px] w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer p-2.5"
  >
    {[
      open ? "rotate-45 translate-y-[7px]" : "",
      open ? "opacity-0" : "",
      open ? "-rotate-45 -translate-y-[7px]" : "",
    ].map((cls, i) => (
      <span key={i} className={`block w-[18px] h-0.5 rounded bg-[#2667ff] transition-all duration-250 ${cls}`} />
    ))}
  </button>
);

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const navRef     = useRef(null);
  const logoRef    = useRef(null);
  const linksRef   = useRef(null);
  const ctaRef     = useRef(null);
  const megaRef    = useRef(null);
  const drawerRef  = useRef(null);
  const closeTimer = useRef(null);

  const [scrolled,      setScrolled]     = useState(false);
  const [activeMega,    setActiveMega]   = useState(null);
  const [mobileOpen,    setMobileOpen]   = useState(false);
  const [mobileExpand,  setMobileExpand] = useState(null);

  // ── Scroll shadow ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mount animation ────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [logoRef.current, linksRef.current, ctaRef.current];

      gsap.set(targets, { opacity: 0, y: -18, filter: "blur(6px)" });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.12,
        ease: "expo.out",
        delay: 0.1,
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // ── Mega panel open/close ─────────────────────────────────────────────────
  const openMega = useCallback((key) => {
    clearTimeout(closeTimer.current);

    if (activeMega === key) return;              // already open — no flicker

    const isSwitch = activeMega !== null;

    setActiveMega(key);

    requestAnimationFrame(() => {
      if (!megaRef.current) return;

      if (isSwitch) {
        // instant crossfade when switching tabs
        gsap.fromTo(
          megaRef.current,
          { opacity: 0.4, scale: 0.99 },
          { opacity: 1,   scale: 1, duration: 0.18, ease: "power2.out" },
        );
      } else {
        // full entrance
        gsap.fromTo(
          megaRef.current,
          { opacity: 0, y: -10, scale: 0.97, transformOrigin: "top center" },
          { opacity: 1, y: 0,   scale: 1,    duration: 0.3, ease: "expo.out" },
        );

        // stagger inner items for a polished cascade
        const items = megaRef.current.querySelectorAll("a, div[class*='font-bold']");
        gsap.fromTo(
          items,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.012, ease: "power3.out", delay: 0.05 },
        );
      }
    });
  }, [activeMega]);

  const closeMega = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      if (megaRef.current) {
        gsap.to(megaRef.current, {
          opacity: 0, y: -6, scale: 0.97,
          duration: 0.2, ease: "power2.in",
          onComplete: () => setActiveMega(null),
        });
      } else {
        setActiveMega(null);
      }
    }, 110);
  }, []);

  const keepOpen = useCallback(() => clearTimeout(closeTimer.current), []);

  // ── Mobile drawer animation ────────────────────────────────────────────────
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    if (mobileOpen) {
      el.style.display = "block";
      gsap.fromTo(
        el,
        { opacity: 0, y: -14, filter: "blur(4px)" },
        { opacity: 1, y: 0,   filter: "blur(0px)", duration: 0.32, ease: "expo.out" },
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
    <nav
      ref={navRef}
      className={`sticky top-0 z-40 border-b border-indigo-100/80 transition-all duration-300 ${
        scrolled ? "shadow-[0_4px_28px_rgba(79,70,229,0.1)] bg-blue-50" : "bg-white"
      }`}
      style={{ backdropFilter: "blur(22px) saturate(180%)" }}
    >
      {/* ── Top bar ── */}
      <div className="max-w-[1280px] mx-auto px-7 flex items-center h-[66px] gap-2">

        <div ref={logoRef}><Logo /></div>

        {/* Desktop nav links */}
        <div ref={linksRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_KEYS.map((key) => (
            <button
              key={key}
              onMouseEnter={() => openMega(key)}
              onMouseLeave={closeMega}
              className={`inline-flex items-center gap-1 px-[13px] py-[7px] rounded-[11px] text-sm font-semibold border-0 cursor-pointer whitespace-nowrap transition-all duration-150 ${
                activeMega === key
                  ? "text-indigo-600 bg-indigo-600/9"
                  : "text-gray-700 bg-transparent hover:text-indigo-600 hover:bg-indigo-600/10"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <ChevronIcon open={activeMega === key} />
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div ref={ctaRef} className="hidden lg:flex items-center gap-2.5 ml-auto shrink-0">
          <button className="relative w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-500 hover:bg-indigo-100 transition-colors cursor-pointer">
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
          </button>

          <div className="w-px h-7 bg-indigo-100" />

          <button className="flex items-center bg-gradient-to-br from-[#2667ff] to-[#3f8efc] gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white cursor-pointer border-0 shadow-[0_4px_18px_rgba(79,70,229,0.38)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.55)] hover:scale-[1.04] transition-all duration-200">
            Join Us Now
            <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile hamburger */}
        <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen((p) => !p)} />
      </div>

      {/* ── Desktop mega panel ── */}
      {activeMega && (
        <div
          className="absolute left-0 right-0 top-full px-7 pb-5 z-[90]"
          onMouseEnter={keepOpen}
          onMouseLeave={closeMega}
        >
          <div className="max-w-[1280px] mx-auto">
            <div
              ref={megaRef}
              className="rounded-[22px] border border-indigo-100/70 shadow-[0_18px_60px_rgba(79,70,229,0.13),0_4px_16px_rgba(0,0,0,0.07)] overflow-hidden"
              style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(32px)" }}
            >
              <MegaContent megaKey={activeMega} />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      <div
        ref={drawerRef}
        style={{ display: "none", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(28px)" }}
        className="lg:hidden absolute top-full left-0 right-0 z-[90] border-b border-indigo-100 shadow-[0_12px_40px_rgba(79,70,229,0.1)] px-6 pb-6 max-h-[75vh] overflow-y-auto"
      >
        {/* Home + nav keys */}
        {[{ label: "Home", key: null }, ...NAV_KEYS.map((k) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), key: k }))].map(({ label, key }) => (
          <div key={label}>
            <button
              onClick={() => key && toggleMobileExpand(key)}
              className="flex items-center justify-between w-full py-3 border-b border-indigo-50 text-[0.95rem] font-semibold text-[#1e1b4b] bg-transparent cursor-pointer border-x-0 border-t-0"
            >
              <span>{label}</span>
              {key && <ChevronIcon open={mobileExpand === key} />}
            </button>
            {key && mobileExpand === key && <MobileContent megaKey={key} />}
          </div>
        ))}

        {/* Join CTA */}
        <div className="mt-4 pt-4 border-t border-indigo-50">
          <button className="w-full flex items-center justify-center bg-gradient-to-br from-[#2667ff] to-[#3f8efc] gap-2 py-3 rounded-xl text-sm font-bold text-white border-0 cursor-pointer">
            Join Us
            <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}