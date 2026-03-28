"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, GraduationCap, BookOpen,
  Building2, Info, Filter, ChevronRight, Star, X
} from "lucide-react";

export const COLLEGES = [
  // FEATURED / TOP
  { id: 1, name: "IIT Bombay", featured: true, rank: 1, type: "IIT", state: "Maharashtra", city: "Mumbai", courses: ["Engineering", "Technology", "Sciences"], seats: 1050, fee: "₹2,18,000", category: "Government", estd: 1958 },
  { id: 2, name: "IIT Delhi", featured: true, rank: 2, type: "IIT", state: "Delhi", city: "New Delhi", courses: ["Engineering", "Technology", "Design"], seats: 880, fee: "₹2,15,000", category: "Government", estd: 1961 },
  { id: 3, name: "IISc Bangalore", featured: true, rank: 3, type: "IISc", state: "Karnataka", city: "Bengaluru", courses: ["Sciences", "Research", "Engineering"], seats: 540, fee: "₹36,000", category: "Government", estd: 1909 },
  { id: 4, name: "IIM Ahmedabad", featured: true, rank: 4, type: "IIM", state: "Gujarat", city: "Ahmedabad", courses: ["Management", "MBA", "Business"], seats: 420, fee: "₹23,00,000", category: "Government", estd: 1961 },
  { id: 5, name: "NLU Delhi (NLU-D)", featured: true, rank: 5, type: "NLU", state: "Delhi", city: "New Delhi", courses: ["Law", "LLB", "LLM"], seats: 110, fee: "₹1,95,000", category: "Government", estd: 2008 },
  { id: 6, name: "AIIMS New Delhi", featured: true, rank: 6, type: "AIIMS", state: "Delhi", city: "New Delhi", courses: ["Medicine", "MBBS", "Nursing"], seats: 776, fee: "₹1,628", category: "Government", estd: 1956 },

  // ENGINEERING
  { id: 7, name: "IIT Madras", featured: false, rank: 7, type: "IIT", state: "Tamil Nadu", city: "Chennai", courses: ["Engineering", "Technology", "Sciences"], seats: 910, fee: "₹2,12,000", category: "Government", estd: 1959 },
  { id: 8, name: "IIT Kanpur", featured: false, rank: 8, type: "IIT", state: "Uttar Pradesh", city: "Kanpur", courses: ["Engineering", "Sciences", "Management"], seats: 870, fee: "₹2,20,000", category: "Government", estd: 1959 },
  { id: 9, name: "IIT Kharagpur", featured: false, rank: 9, type: "IIT", state: "West Bengal", city: "Kharagpur", courses: ["Engineering", "Architecture", "Technology"], seats: 1500, fee: "₹2,25,000", category: "Government", estd: 1951 },
  { id: 10, name: "BITS Pilani", featured: false, rank: 10, type: "Deemed", state: "Rajasthan", city: "Pilani", courses: ["Engineering", "Sciences", "Pharmacy"], seats: 980, fee: "₹5,66,000", category: "Private", estd: 1964 },
  { id: 11, name: "NIT Trichy", featured: false, rank: 18, type: "NIT", state: "Tamil Nadu", city: "Tiruchirappalli", courses: ["Engineering", "Technology"], seats: 870, fee: "₹1,25,000", category: "Government", estd: 1964 },
  { id: 12, name: "DTU Delhi", featured: false, rank: 22, type: "State", state: "Delhi", city: "New Delhi", courses: ["Engineering", "Technology", "Management"], seats: 1240, fee: "₹1,68,000", category: "Government", estd: 1941 },
  { id: 13, name: "VIT Vellore", featured: false, rank: 30, type: "Deemed", state: "Tamil Nadu", city: "Vellore", courses: ["Engineering", "Technology", "Sciences"], seats: 6000, fee: "₹2,20,000", category: "Private", estd: 1984 },
  { id: 14, name: "Jadavpur University", featured: false, rank: 26, type: "State", state: "West Bengal", city: "Kolkata", courses: ["Engineering", "Sciences", "Arts"], seats: 1100, fee: "₹30,000", category: "Government", estd: 1955 },

  // MANAGEMENT
  { id: 15, name: "IIM Bangalore", featured: false, rank: 11, type: "IIM", state: "Karnataka", city: "Bengaluru", courses: ["Management", "MBA", "Business"], seats: 510, fee: "₹24,50,000", category: "Government", estd: 1973 },
  { id: 16, name: "IIM Calcutta", featured: false, rank: 12, type: "IIM", state: "West Bengal", city: "Kolkata", courses: ["Management", "MBA", "Finance"], seats: 480, fee: "₹27,00,000", category: "Government", estd: 1961 },
  { id: 17, name: "FMS Delhi", featured: false, rank: 15, type: "Central", state: "Delhi", city: "New Delhi", courses: ["Management", "MBA"], seats: 250, fee: "₹22,000", category: "Government", estd: 1954 },
  { id: 18, name: "XLRI Jamshedpur", featured: false, rank: 20, type: "Private", state: "Jharkhand", city: "Jamshedpur", courses: ["Management", "MBA", "HR"], seats: 360, fee: "₹28,50,000", category: "Private", estd: 1949 },
  { id: 19, name: "MDI Gurgaon", featured: false, rank: 21, type: "Autonomous", state: "Haryana", city: "Gurugram", courses: ["Management", "MBA", "Business"], seats: 240, fee: "₹21,00,000", category: "Private", estd: 1973 },
  { id: 20, name: "SP Jain Mumbai", featured: false, rank: 25, type: "Autonomous", state: "Maharashtra", city: "Mumbai", courses: ["Management", "MBA", "Finance"], seats: 420, fee: "₹19,50,000", category: "Private", estd: 1981 },

  // LAW
  { id: 21, name: "NALSAR Hyderabad", featured: false, rank: 13, type: "NLU", state: "Telangana", city: "Hyderabad", courses: ["Law", "LLB", "LLM"], seats: 90, fee: "₹2,10,000", category: "Government", estd: 1998 },
  { id: 22, name: "NLSIU Bangalore", featured: false, rank: 14, type: "NLU", state: "Karnataka", city: "Bengaluru", courses: ["Law", "LLB", "LLM"], seats: 80, fee: "₹2,95,000", category: "Government", estd: 1987 },
  { id: 23, name: "NUJS Kolkata", featured: false, rank: 16, type: "NLU", state: "West Bengal", city: "Kolkata", courses: ["Law", "LLB", "LLM"], seats: 80, fee: "₹1,85,000", category: "Government", estd: 1999 },

  // MEDICINE
  { id: 24, name: "JIPMER Puducherry", featured: false, rank: 17, type: "INI", state: "Puducherry", city: "Puducherry", courses: ["Medicine", "MBBS", "Nursing"], seats: 119, fee: "₹5,380", category: "Government", estd: 1823 },
  { id: 25, name: "CMC Vellore", featured: false, rank: 19, type: "Private", state: "Tamil Nadu", city: "Vellore", courses: ["Medicine", "MBBS", "Nursing"], seats: 180, fee: "₹4,50,000", category: "Private", estd: 1900 },
  { id: 26, name: "KGMU Lucknow", featured: false, rank: 23, type: "State", state: "Uttar Pradesh", city: "Lucknow", courses: ["Medicine", "MBBS", "Pharmacy"], seats: 200, fee: "₹1,64,000", category: "Government", estd: 1905 },

  // ARTS & HUMANITIES
  { id: 27, name: "JNU New Delhi", featured: false, rank: 24, type: "Central", state: "Delhi", city: "New Delhi", courses: ["Arts", "Humanities", "Sciences", "Law"], seats: 2200, fee: "₹12,000", category: "Government", estd: 1969 },
  { id: 28, name: "Hyderabad University", featured: false, rank: 27, type: "Central", state: "Telangana", city: "Hyderabad", courses: ["Arts", "Sciences", "Humanities"], seats: 1800, fee: "₹20,000", category: "Government", estd: 1974 },
  { id: 29, name: "Miranda House (DU)", featured: false, rank: 28, type: "Central", state: "Delhi", city: "New Delhi", courses: ["Arts", "Sciences", "Commerce"], seats: 1900, fee: "₹15,000", category: "Government", estd: 1948 },

  // DESIGN / ARCHITECTURE
  { id: 30, name: "NID Ahmedabad", featured: false, rank: 29, type: "Autonomous", state: "Gujarat", city: "Ahmedabad", courses: ["Design", "Product Design", "Visual Communication"], seats: 120, fee: "₹4,20,000", category: "Government", estd: 1961 },
  { id: 31, name: "SPA Delhi", featured: false, rank: 31, type: "Central", state: "Delhi", city: "New Delhi", courses: ["Architecture", "Planning", "Design"], seats: 140, fee: "₹1,90,000", category: "Government", estd: 1959 },
];

const ALL_COURSES = ["All Courses", "Engineering", "Technology", "Sciences", "Management", "MBA", "Law", "LLB", "Medicine", "MBBS", "Arts", "Humanities", "Commerce", "Design", "Architecture", "Pharmacy", "Nursing", "Research"];

export default function page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
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
      const matchesSearch =
        clg.name.toLowerCase().includes(search.toLowerCase()) ||
        clg.city.toLowerCase().includes(search.toLowerCase());
      const matchesState = selectedState === "All States" || clg.state === selectedState;
      const matchesCity = selectedCity === "All Cities" || clg.city === selectedCity;
      const matchesCourse = selectedCourse === "All Courses" || clg.courses.includes(selectedCourse);
      const matchesCategory = selectedCategory === "All" || clg.category === selectedCategory;
      const matchesFeatured = !showFeaturedOnly || clg.featured;
      return matchesSearch && matchesState && matchesCity && matchesCourse && matchesCategory && matchesFeatured;
    }).sort((a, b) => a.rank - b.rank);
  }, [search, selectedState, selectedCity, selectedCourse, selectedCategory, showFeaturedOnly]);

  const featuredColleges = COLLEGES.filter((c) => c.featured).sort((a, b) => a.rank - b.rank);

  const hasFilters =
    search ||
    selectedState !== "All States" ||
    selectedCity !== "All Cities" ||
    selectedCourse !== "All Courses" ||
    selectedCategory !== "All" ||
    showFeaturedOnly;

  const resetAll = () => {
    setSearch("");
    setSelectedState("All States");
    setSelectedCity("All Cities");
    setSelectedCourse("All Courses");
    setSelectedCategory("All");
    setShowFeaturedOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 font-sans selection:bg-amber-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:pt-28">

        {/* HEADER */}
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
          <h1 className="text-5xl font-[1000] tracking-tighter mb-2">Top Colleges in India</h1>
          <p className="text-slate-400 text-sm font-medium">
            Explore across Engineering, Management, Law, Medicine, Arts & Design
          </p>
        </div>

        {/* FEATURED SECTION */}
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
                onClick={() => router.push(`/explore/${clg.id}`)}
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

          {/* SIDEBAR */}
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

            {/* FEATURED TOGGLE */}
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

            {/* CATEGORY */}
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

            {/* STATE */}
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

            {/* CITY */}
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

            {/* COURSE */}
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

          {/* MAIN */}
          <main className="lg:col-span-9 space-y-6">
            {/* SEARCH */}
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

            {/* COUNT BAR */}
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

            {/* RESULTS */}
            <div className="space-y-3">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((clg) => (
                  <div
                    key={clg.id}
                    className={`group bg-slate-50 border p-7 rounded-[32px] hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-400 border-l-4 ${
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
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                              clg.category === "Government"
                                ? "bg-blue-50 text-[#155DFC] border-blue-100"
                                : "bg-rose-50 text-rose-500 border-rose-100"
                            }`}
                          >
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
                            <span
                              key={c}
                              className="bg-white border border-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                            >
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
                          onClick={() => router.push(`/explore/${clg.id}`)}
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
                  <button
                    onClick={resetAll}
                    className="mt-3 text-[#155DFC] font-black uppercase text-[9px] tracking-widest hover:underline"
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