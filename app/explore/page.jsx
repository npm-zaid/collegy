"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, GraduationCap, BookOpen,
  Building2, Info, Filter, ChevronRight, Star, X,
} from "lucide-react";
import { COLLEGES, ALL_COURSES, toSlug } from "@/data/collegeData";

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
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-amber-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:pt-28">

        {/* ── Header ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border border-amber-200">
              2025–26 Session
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {COLLEGES.length} Institutes Listed
            </span>
          </div>
          <h1 className="text-5xl tracking-tighter mb-2">Top Colleges in India</h1>
          <p className="text-slate-400 text-sm font-medium">
            Explore across Engineering, Management, Law, Medicine, Arts & Design
          </p>
        </div>

        {/* ── Featured strip ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              Featured & Top Ranked
            </h2>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredColleges.map((clg) => (
              <button
                key={clg.id}
                onClick={() => goToCollege(clg)}
                className="group relative bg-gradient-to-b from-amber-50 to-white border border-amber-100 rounded-[24px] p-5 text-left hover:shadow-xl hover:shadow-amber-100/60 hover:border-amber-300 transition-all duration-300 active:scale-95"
              >
                <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white text-[10px] font-black mb-3">
                  #{clg.rank}
                </div>
                <p className="text-[11px] font-black text-slate-900 leading-snug mb-1">{clg.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{clg.city}</p>
                <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest mt-1">
                  {clg.courses[0]}
                </p>
              </button>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-3 space-y-6 bg-slate-50 border border-slate-100 p-7 rounded-[36px] h-fit lg:sticky top-28 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
                <Filter size={13} /> Filters
              </h3>
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 text-[9px] text-[#155DFC] font-black uppercase tracking-widest hover:underline"
                >
                  <X size={10} /> Reset
                </button>
              )}
            </div>

            {/* Featured toggle */}
            <div>
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  showFeaturedOnly
                    ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-100"
                    : "bg-white text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                <Star size={11} className={showFeaturedOnly ? "fill-white" : ""} />
                Top / Featured Only
              </button>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Category</label>
              <div className="flex flex-wrap gap-2">
                {["All", "Government", "Private"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border transition-all ${
                      selectedCategory === cat
                        ? "bg-[#155DFC] text-white border-[#155DFC] shadow-md shadow-blue-100"
                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">State</label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity("All Cities"); }}
                className="w-full bg-white border border-slate-200 p-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-50 focus:border-[#155DFC] outline-none cursor-pointer"
              >
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white border border-slate-200 p-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-50 focus:border-[#155DFC] outline-none cursor-pointer"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Course */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Course / Field</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_COURSES.map((course) => (
                  <button
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border transition-all ${
                      selectedCourse === course
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    {course === "All Courses" ? "All" : course}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="lg:col-span-9 space-y-6">

            {/* Search */}
            <div className="relative group">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#155DFC] transition-colors"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by college name or city…"
                className="w-full bg-slate-50 border border-slate-200 pl-14 pr-6 py-5 rounded-[28px] text-base font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#155DFC] transition-all"
              />
            </div>

            {/* Count bar */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Showing <span className="text-slate-900">{filteredColleges.length}</span> institutes
              </p>
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="text-[9px] text-[#155DFC] font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  <X size={10} /> Clear All
                </button>
              )}
            </div>

            {/* Results */}
            <div className="space-y-3">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((clg) => (
                  <div
                    key={clg.id}
                    className={`group bg-slate-50 border p-7 rounded-[32px] hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-300 border-l-4 ${
                      clg.featured
                        ? "border-amber-200 border-l-amber-400 bg-amber-50/40"
                        : "border-slate-100 border-l-transparent hover:border-l-[#155DFC]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      <div className="space-y-2.5">
                        <div className="flex items-center flex-wrap gap-2">
                          {clg.featured && (
                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">
                              <Star size={8} className="fill-amber-500" /> Featured
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                            clg.category === "Government"
                              ? "bg-blue-50 text-[#155DFC] border-blue-100"
                              : "bg-rose-50 text-rose-500 border-rose-100"
                          }`}>
                            {clg.category}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={10} /> {clg.city}, {clg.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-300 bg-white border border-slate-100 rounded-lg px-2 py-1">
                            #{clg.rank}
                          </span>
                          <h2 className="text-xl font-[1000] text-slate-900 leading-tight group-hover:text-[#155DFC] transition-colors">
                            {clg.name}
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {clg.courses.map((c) => (
                            <span key={c} className="bg-white border border-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4 pt-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <GraduationCap size={13} className="text-[#155DFC]" /> {clg.seats} Seats
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Building2 size={13} className="text-emerald-500" /> {clg.type}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <BookOpen size={13} className="text-purple-400" /> Est. {clg.estd}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="md:text-right">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Annual Fee</p>
                          <p className="text-xl font-[1000] text-slate-900">{clg.fee}</p>
                        </div>
                        <button
                          onClick={() => goToCollege(clg)}
                          className="flex items-center gap-2 bg-[#155DFC] text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                          View Details <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                  <Info className="mx-auto mb-3 text-slate-300" size={36} />
                  <p className="text-slate-500 font-bold text-sm">No colleges match your filters.</p>
                  <button onClick={resetAll} className="mt-3 text-[#155DFC] font-black uppercase text-[9px] tracking-widest hover:underline">
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