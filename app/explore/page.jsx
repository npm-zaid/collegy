"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, GraduationCap, BookOpen,
  Building2, Info, Filter, ChevronRight, Star, X,
} from "lucide-react";
import { COLLEGES, ALL_COURSES, toSlug } from "../../data/collegeData";

export default function ExplorePage() {
  const router = useRouter();

  const [search,           setSearch]           = useState("");
  const [selectedState,    setSelectedState]    = useState("All States");
  const [selectedCity,     setSelectedCity]     = useState("All Cities");
  const [selectedCourse,   setSelectedCourse]   = useState("All Courses");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const states = ["All States", ...Array.from(new Set(COLLEGES.map((c) => c.state))).sort()];

  const cities = useMemo(() => {
    const base = COLLEGES
      .filter((c) => selectedState === "All States" || c.state === selectedState)
      .map((c) => c.city);
    return ["All Cities", ...Array.from(new Set(base)).sort()];
  }, [selectedState]);

  const filteredColleges = useMemo(() => {
    return COLLEGES.filter((clg) => {
      const q = search.toLowerCase();
      return (
        (clg.name.toLowerCase().includes(q) || clg.city.toLowerCase().includes(q)) &&
        (selectedState    === "All States"  || clg.state    === selectedState) &&
        (selectedCity     === "All Cities"  || clg.city     === selectedCity) &&
        (selectedCourse   === "All Courses" || clg.courses.includes(selectedCourse)) &&
        (selectedCategory === "All"         || clg.category === selectedCategory) &&
        (!showFeaturedOnly || clg.featured)
      );
    }).sort((a, b) => a.rank - b.rank);
  }, [search, selectedState, selectedCity, selectedCourse, selectedCategory, showFeaturedOnly]);

  const featuredColleges = COLLEGES.filter((c) => c.featured).sort((a, b) => a.rank - b.rank);

  const hasFilters =
    search || selectedState !== "All States" || selectedCity !== "All Cities" ||
    selectedCourse !== "All Courses" || selectedCategory !== "All" || showFeaturedOnly;

  const resetAll = () => {
    setSearch(""); setSelectedState("All States"); setSelectedCity("All Cities");
    setSelectedCourse("All Courses"); setSelectedCategory("All"); setShowFeaturedOnly(false);
  };

  const goToCollege = (clg) => router.push(`/explore/${toSlug(clg.name)}`);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-blue-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:pt-20">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-[#2667ff]/10 to-[#2667ff]/10 text-[#2667ff] border border-[#2667ff]/20 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
              ★ 2025–26 Session
            </span>
            <span className="text-zinc-300 text-xs">•</span>
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
              {COLLEGES.length} Institutes Listed
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-zinc-900 mb-3">
            Top Colleges<br />in India
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            Engineering · Management · Law · Medicine · Arts & Design
          </p>
        </div>

        {/* ── Featured strip ── */}
        {/* Amber/gold — warm contrast against the blue palette, clear visual hierarchy */}
        <section className="mb-12">
          <h2 className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-5">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            Featured & Top Ranked
            <span className="flex-1 h-px bg-zinc-100" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredColleges.map((clg) => (
              <button
                key={clg.id}
                onClick={() => goToCollege(clg)}
                className="group bg-amber-50 border border-amber-200 hover:border-amber-400 hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)] rounded-[1.8rem] p-5 text-left transition-all duration-300 active:scale-95"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[10px] flex items-center justify-center text-white text-[9px] font-black mb-3 shadow-sm shadow-amber-200">
                  #{clg.rank}
                </div>
                <p className="text-[11px] font-black text-zinc-900 leading-snug mb-1.5">{clg.name}</p>
                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-amber-700/60">{clg.city}</p>
                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#2667ff] mt-1">{clg.courses[0]}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-3 bg-zinc-900 rounded-[2.5rem] p-7 h-fit lg:sticky top-28 space-y-6">

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

            {/* Featured toggle — amber on dark sidebar pops beautifully */}
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                showFeaturedOnly
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-900 border-transparent shadow-lg shadow-amber-500/20"
                  : "bg-transparent text-zinc-500 border-zinc-800 hover:border-amber-500/40 hover:text-amber-400"
              }`}
            >
              <Star size={11} className={showFeaturedOnly ? "fill-zinc-900" : ""} />
              Top / Featured Only
            </button>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Category</label>
              <div className="flex gap-2">
                {["All", "Government", "Private"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 py-2 rounded-xl text-[8px] font-black tracking-widest uppercase border transition-all ${
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
            <div className="space-y-3">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">State</label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity("All Cities"); }}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 p-3 rounded-2xl text-xs font-bold outline-none cursor-pointer appearance-none focus:border-[#2667ff]/50 transition-colors"
              >
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* City */}
            <div className="space-y-3">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 p-3 rounded-2xl text-xs font-bold outline-none cursor-pointer appearance-none focus:border-[#2667ff]/50 transition-colors"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Courses */}
            <div className="space-y-3">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Course / Field</label>
              <div className="flex flex-wrap gap-2">
                {ALL_COURSES.map((course) => (
                  <button
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    className={`px-3 py-1.5 rounded-full text-[8px] font-black tracking-widest uppercase border transition-all ${
                      selectedCourse === course
                        ? "bg-gradient-to-r from-[#2667ff] to-[#2667ff] text-white border-transparent"
                        : "bg-transparent text-zinc-600 border-zinc-800 hover:border-[#2667ff]/40 hover:text-[#2667ff]"
                    }`}
                  >
                    {course === "All Courses" ? "All" : course}
                  </button>
                ))}
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
                placeholder="Search by college name or city…"
                className="w-full bg-zinc-100 border-2 border-transparent pl-14 pr-6 py-5 rounded-[2rem] text-base font-bold text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#2667ff]/30 focus:bg-white transition-all"
              />
            </div>

            {/* Count */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Showing <span className="text-zinc-900">{filteredColleges.length}</span> institutes
              </p>
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="text-[9px] text-[#2667ff] font-black uppercase tracking-widest flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <X size={10} /> Clear All
                </button>
              )}
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