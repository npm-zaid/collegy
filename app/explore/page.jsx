"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, MapPin, GraduationCap, BookOpen,
  Building2, Info, Filter, ChevronRight, Star, X, Wifi, Monitor, Clock, Users, Image as ImageIcon
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────
const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, '-') || "";
const formatFee = (val) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000)   return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const parseFeeRange = (rangeStr) => {
  if (!rangeStr) return 0;
  const clean = rangeStr.toLowerCase().replace(/,/g, '');
  const matches = clean.match(/[\d.]+/g);
  if (!matches || matches.length === 0) return 0;
  
  const isLakh = clean.includes("lakh") || clean.includes("lac") || clean.includes("l");
  const isK = clean.includes("k") || clean.includes("thousand");
  
  const baseNum = parseFloat(matches[matches.length - 1]);
  let multiplier = 1;
  if (isLakh) multiplier = 100000;
  else if (isK) multiplier = 1000;
  
  return baseNum * multiplier;
};

const STUDY_MODE_META = {
  Online:     { icon: Wifi,    color: "text-cyan-400",   active: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  Hybrid:     { icon: Monitor, color: "text-violet-400", active: "bg-violet-500/20 text-violet-300 border-violet-500/40" },
  "Part-Time":{ icon: Clock,   color: "text-amber-400",  active: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Regular:    { icon: Users,   color: "text-emerald-400",active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  Distance:   { icon: Wifi,    color: "text-amber-400",  active: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
};

function ExplorePageContent() {
  const router = useRouter();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("https://finale-beacon-backend.vercel.app/api/colleges");
        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map(c => ({
            id: c._id || c.collegeId,
            name: c.collegeName || "Unknown",
            city: c.location?.city || "Unknown",
            state: c.location?.state || "Unknown",
            courses: c.courses?.map(co => co.courseName) || [],
            exams: c.exams || [],
            category: c.collegeType || "Private",
            featured: c.isFeatured || false,
            studyMode: c.modes || [],
            feeNumeric: (() => {
              const feesList = c.courses?.map(co => co.fees?.yearlyFees || co.fees?.totalFees || 0).filter(f => f > 0) || [];
              if (feesList.length > 0) {
                return Math.min(...feesList);
              }
              if (c.feesRange) {
                const parsed = parseFeeRange(c.feesRange);
                if (parsed > 0) return parsed;
              }
              return 0;
            })(),
            fee: c.feesRange || (c.courses?.[0]?.fees?.totalFees ? formatFee(c.courses[0].fees.totalFees) : "N/A"),
            rank: c.nirfRanking?.overallRank || "-",
            seats: c.courses?.reduce((acc, curr) => acc + (curr.seatIntake || 0), 0) || 0,
            type: c.collegeType || "Private",
            estd: c.establishedYear || "Unknown",
            image: c.media?.images?.[0]?.filename || null,
            raw: c,
          }));
          setColleges(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const [search,            setSearch]            = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearch(query);
    }
  }, [searchParams]);
  const [selectedState,     setSelectedState]     = useState("All States");
  const [selectedCity,      setSelectedCity]      = useState("All Cities");
  const [selectedCourse,    setSelectedCourse]    = useState("All Courses");
  const [selectedCategory,  setSelectedCategory]  = useState("All");
  const [showFeaturedOnly,  setShowFeaturedOnly]  = useState(false);
  const [selectedModes,     setSelectedModes]     = useState([]);

  const states = useMemo(() => ["All States", ...Array.from(new Set(colleges.map((c) => c.state))).filter(Boolean).sort()], [colleges]);
  const ALL_COURSES = useMemo(() => Array.from(new Set(colleges.flatMap((c) => c.courses))).sort(), [colleges]);
  const ALL_STUDY_MODES = useMemo(() => Array.from(new Set(colleges.flatMap((c) => c.studyMode))).filter(m => m !== "Offline").sort(), [colleges]);
  const MAX_FEE = 3000000; // 30 Lakhs max limit

  const [maxFee, setMaxFee] = useState(MAX_FEE);

  const cities = useMemo(() => {
    const base = colleges
      .filter((c) => selectedState === "All States" || c.state === selectedState)
      .map((c) => c.city).filter(Boolean);
    return ["All Cities", ...Array.from(new Set(base)).sort()];
  }, [selectedState, colleges]);

  const toggleMode = (mode) =>
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );

  const filteredColleges = useMemo(() => {
    return colleges.filter((clg) => {
      const q = search.toLowerCase();
      const modeMatch =
        selectedModes.length === 0 ||
        selectedModes.some((m) => clg.studyMode?.includes(m));
      return (
        (clg.name.toLowerCase().includes(q) || clg.city.toLowerCase().includes(q) || clg.courses.some(course => course.toLowerCase().includes(q)) || clg.exams.some(exam => exam.toLowerCase().includes(q))) &&
        (selectedState    === "All States"  || clg.state    === selectedState) &&
        (selectedCity     === "All Cities"  || clg.city     === selectedCity) &&
        (selectedCourse   === "All Courses" || clg.courses.includes(selectedCourse)) &&
        (selectedCategory === "All"         || clg.category === selectedCategory) &&
        (!showFeaturedOnly || clg.featured) &&
        modeMatch &&
        (clg.feeNumeric === 0 || clg.feeNumeric <= maxFee)
      );
    }).sort((a, b) => {
      // sort by rank if rank is a number
      const rankA = typeof a.rank === 'number' ? a.rank : 99999;
      const rankB = typeof b.rank === 'number' ? b.rank : 99999;
      return rankA - rankB;
    });
  }, [search, selectedState, selectedCity, selectedCourse, selectedCategory, showFeaturedOnly, selectedModes, maxFee, colleges]);

  const hasFilters =
    search || selectedState !== "All States" || selectedCity !== "All Cities" ||
    selectedCourse !== "All Courses" || selectedCategory !== "All" ||
    showFeaturedOnly || selectedModes.length > 0 || maxFee < MAX_FEE;

  const resetAll = () => {
    setSearch(""); setSelectedState("All States"); setSelectedCity("All Cities");
    setSelectedCourse("All Courses"); setSelectedCategory("All"); setShowFeaturedOnly(false);
    setSelectedModes([]); setMaxFee(MAX_FEE);
  };

  const goToCollege = (clg) => router.push(`/explore/${toSlug(clg.name)}`);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-blue-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:pt-20">

        <div className="grid lg:grid-cols-12 gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-3 bg-zinc-900 rounded-[2rem] p-6 h-fit lg:sticky top-28 space-y-3">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                <Filter size={12} /> Filters
              </h3>
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#2667ff] hover:text-white transition-colors"
                >
                  <X size={10} /> Reset
                </button>
              )}
            </div>

            {/* Featured toggle */}
            {/* <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border transition-all ${
                showFeaturedOnly
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-900 border-transparent shadow-lg shadow-amber-500/20"
                  : "bg-transparent text-zinc-500 border-zinc-800 hover:border-amber-500/40 hover:text-amber-400"
              }`}
            >
              <Star size={10} className={showFeaturedOnly ? "fill-zinc-900" : ""} />
              Top / Featured Only
            </button> */}

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Category</label>
              <div className="flex gap-1.5">
                {["All", "Government", "Private"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black tracking-widest uppercase border transition-all ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-[#2667ff] to-[#2667ff] text-white border-transparent shadow-md shadow-[#2667ff]/20"
                        : "bg-transparent text-zinc-500 border-zinc-800 hover:border-[#2667ff]/40 hover:text-[#2667ff]"
                    }`}
                  >
                    {cat === "Government" ? "Govt" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity("All Cities"); }}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-[11px] font-bold outline-none cursor-pointer appearance-none focus:border-[#2667ff]/50 transition-colors"
              >
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* City */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-[11px] font-bold outline-none cursor-pointer appearance-none focus:border-[#2667ff]/50 transition-colors"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* ── Course / Field – DROPDOWN ── */}
            <div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-[11px] font-bold outline-none cursor-pointer appearance-none focus:border-[#2667ff]/50 transition-colors"
              >
                {ALL_COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* ── Study Mode – multi-select pills ── */}
            <div className="space-y-1.5">
              <label className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Study Mode</label>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_STUDY_MODES.map((mode) => {
                  const meta  = STUDY_MODE_META[mode];
                  const Icon  = meta.icon;
                  const active = selectedModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      onClick={() => toggleMode(mode)}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] border transition-all ${
                        active
                          ? meta.active
                          : "bg-transparent text-zinc-600 border-zinc-800 hover:border-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      <Icon size={9} className={active ? "" : meta.color} />
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Annual Fee Slider ── */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Max Annual Fee</label>
                <span className="text-[10px] font-black text-[#2667ff]">
                  {maxFee >= MAX_FEE ? "Any" : formatFee(maxFee)}
                </span>
              </div>
              <input
                id="fee-slider"
                type="range"
                min={0}
                max={MAX_FEE}
                step={10000}
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #2667ff ${(maxFee / MAX_FEE) * 100}%, #3f3f46 ${(maxFee / MAX_FEE) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[7px] font-black text-zinc-700 uppercase tracking-widest">
                <span>Free</span>
                <span>₹30L+</span>
              </div>
            </div>

          </aside>

          {/* ── Main ── */}
          <main className="lg:col-span-9 space-y-4">

            {/* Search */}
            <div className="relative group">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#2667ff] transition-colors"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by college name, city or course…"
                className="w-full bg-zinc-100 border-2 border-transparent pl-14 pr-6 py-5 rounded-[2rem] text-base font-bold text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#2667ff]/30 focus:bg-white transition-all"
              />
            </div>

            {/* Count + active filter chips */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Showing <span className="text-zinc-900">{filteredColleges.length}</span> institutes
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedModes.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full border border-zinc-200"
                  >
                    {m}
                    <button onClick={() => toggleMode(m)} className="ml-0.5 hover:text-red-500 transition-colors">
                      <X size={8} />
                    </button>
                  </span>
                ))}
                {hasFilters && (
                  <button
                    onClick={resetAll}
                    className="text-[9px] text-[#2667ff] font-black uppercase tracking-widest flex items-center gap-1 hover:text-zinc-900 transition-colors"
                  >
                    <X size={10} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((clg) => (
                  <div
                    key={clg.id}
                    className={`group rounded-[2.2rem] p-7 transition-all duration-300 border ${
                      clg.featured
                        ? "bg-amber-50 border-amber-200 border-l-4 border-l-amber-400 shadow-xl"
                        : "bg-[#2667ff]/10 border-zinc-100 hover:border-[#2667ff]/70 shadow-xl"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      {clg.image ? (
                        <img src={clg.image.startsWith("http") ? clg.image : `https://finale-beacon-backend.vercel.app/uploads/colleges/${clg.image}`} alt={clg.name} className="w-full md:w-32 md:h-32 object-cover rounded-2xl shrink-0 border border-zinc-200" />
                      ) : (
                        <div className="w-full md:w-32 md:h-32 bg-zinc-100 rounded-2xl shrink-0 flex items-center justify-center text-zinc-300 border border-zinc-200"><ImageIcon size={32} /></div>
                      )}

                      <div className="space-y-2.5 flex-1">
                        {/* Badges */}
                        <div className="flex items-center flex-wrap gap-2">
                          {clg.featured && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em]">
                              <Star size={7} className="fill-amber-500" /> Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${
                            clg.category === "Government"
                              ? "bg-gradient-to-r from-[#2667ff]/8 to-[#2667ff]/8 text-[#2667ff] border-[#2667ff]/20"
                              : "bg-indigo-50 text-indigo-600 border-indigo-200"
                          }`}>
                            {clg.category}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-700 flex items-center gap-1">
                            <MapPin size={9} /> {clg.city}, {clg.state}
                          </span>
                          {/* Study mode badges on card */}
                          {clg.studyMode?.map((m) => {
                            const meta = STUDY_MODE_META[m];
                            if (!meta) return null;
                            const Icon = meta.icon;
                            return (
                              <span key={m} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.12em] border bg-zinc-900/5 border-zinc-200 text-zinc-500`}>
                                <Icon size={7} className={meta.color} /> {m}
                              </span>
                            );
                          })}
                        </div>

                        {/* Rank + Name */}
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-zinc-700 bg-white border border-zinc-200 rounded-lg px-2 py-1">
                            #{clg.rank}
                          </span>
                          <h2 className="text-2xl font-black italic uppercase tracking-tight text-zinc-900 leading-none group-hover:text-[#2667ff] transition-colors">
                            {clg.name}
                          </h2>
                        </div>

                        {/* Courses */}
                        <div className="flex flex-wrap gap-1.5">
                          {clg.courses.map((c) => (
                            <span key={c} className="bg-white border border-zinc-200 text-zinc-500 text-[8px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg">
                              {c}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-5 pt-1">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700">
                            <GraduationCap size={12} className="text-[#2667ff]" /> {clg.seats} Seats
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700">
                            <Building2 size={12} className="text-[#2667ff]" /> {clg.type}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700">
                            <BookOpen size={12} className="text-indigo-400" /> Est. {clg.estd}
                          </span>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        <div className="md:text-right">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Annual Fee</p>
                          <p className="text-2xl font-black italic tracking-tight text-zinc-900">{clg.fee}</p>
                        </div>
                        <button
                          onClick={() => goToCollege(clg)}
                          className="group/btn relative flex items-center gap-2 bg-zinc-900 overflow-hidden px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white transition-colors active:scale-95"
                        >
                          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#2667ff] to-[#2667ff] transition-all duration-500 group-hover/btn:w-full" />
                          <span className="relative z-10 flex items-center gap-1.5 group-hover/btn:text-white transition-colors duration-150 delay-100">
                            View Details <ChevronRight size={12} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200">
                  <Info className="mx-auto mb-4 text-zinc-200" size={40} />
                  <p className="text-zinc-500 font-bold text-sm mb-3">No colleges match your filters.</p>
                  <button
                    onClick={resetAll}
                    className="text-[#2667ff] font-black uppercase text-[9px] tracking-widest hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}