"use client";
import { useParams, useRouter, notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, GraduationCap, BookOpen, Building2,
  Star, ExternalLink, Users, TrendingUp, Award, FileText,
  ChevronRight, Globe, Banknote,
} from "lucide-react";
import { COLLEGE_BY_SLUG, COLLEGES, toSlug } from "../../../data/collegeData";

// ─── Stat card atom ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="bg-blue-50 border border-slate-100 rounded-[24px] p-5 flex flex-col gap-2 shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon size={17} className="text-white" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-lg font-[900] text-slate-900 leading-tight">{value}</p>
    </div>
  );
}

// ─── Tag atom ─────────────────────────────────────────────────────────────────
function Tag({ children, color = "slate" }) {
  const map = {
    blue:    "bg-blue-50   text-[#2667ff] border-blue-100",
    amber:   "bg-amber-50  text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    slate:   "bg-slate-50  text-slate-600  border-slate-200",
    rose:    "bg-rose-50   text-rose-600   border-rose-200",
  };
  return (
    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${map[color]}`}>
      {children}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3 mb-5">
      {children}
      <span className="flex-1 h-px bg-slate-100" />
    </h2>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CollegeDetailPage() {
  const { slug } = useParams();
  const router   = useRouter();

  const college = COLLEGE_BY_SLUG[slug];

  // Unknown slug → 404
  if (!college) {
    // In Next 13 app router you'd call notFound(); here we render a friendly 404
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFEFF]">
        <p className="text-4xl font-black text-slate-200">404</p>
        <p className="text-slate-500 font-bold">College not found for <code className="text-sm bg-slate-100 px-2 py-0.5 rounded">{slug}</code></p>
        <button
          onClick={() => router.push("/explore")}
          className="mt-2 flex items-center gap-2 bg-[#2667ff] text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest"
        >
          <ArrowLeft size={13} /> Back to Explore
        </button>
      </div>
    );
  }

  // Similar colleges — same first course, excluding self, limit 4
  const similar = COLLEGES
    .filter((c) => c.id !== college.id && c.courses.some((co) => college.courses.includes(co)))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-amber-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10 lg:pt-24">

        {/* ── Breadcrumb ── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#2667ff] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to results
        </button>

        {/* ── Hero ── */}
        <div className={`rounded-[36px] p-8 md:p-12 mb-10 border ${
          college.featured
            ? "bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200"
            : "bg-gradient-to-br from-blue-50 via-white to-indigo-50  border-blue-100"
        }`}>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-4">

              {/* Badges */}
              <div className="flex flex-wrap gap-2 items-center">
                {college.featured && (
                  <Tag color="amber">
                    <Star size={8} className="inline fill-amber-500 mr-1" />Featured
                  </Tag>
                )}
                <Tag color={college.category === "Government" ? "blue" : "rose"}>
                  {college.category}
                </Tag>
                <Tag color="slate">{college.type}</Tag>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={10} /> {college.city}, {college.state}
                </span>
              </div>

              {/* Rank + Name */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg ${
                  college.featured ? "bg-amber-500 shadow-amber-200" : "bg-[#2667ff] shadow-blue-200"
                }`}>
                  #{college.rank}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-[900] tracking-tight leading-tight text-slate-900">
                    {college.name}
                  </h1>
                  <p className="text-slate-400 text-sm font-medium mt-1">Established {college.estd}</p>
                </div>
              </div>

              {/* About */}
              <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-xl">
                {college.about}
              </p>

              {/* Courses */}
              <div className="flex flex-wrap gap-2">
                {college.courses.map((c) => (
                  <Tag key={c} color="emerald">{c}</Tag>
                ))}
              </div>

              {/* Exams */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Via:</span>
                {college.exams.map((e) => (
                  <Tag key={e} color="slate">{e}</Tag>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-4 md:items-end md:min-w-[200px]">
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4 w-full md:w-auto">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Fee</p>
                  <p className="text-2xl font-[900] text-slate-900">{college.fee}</p>
                </div>
                <div className="h-px bg-slate-100" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Accreditation</p>
                  <p className="text-sm font-black text-slate-700">{college.accreditation}</p>
                </div>
                <div className="h-px bg-slate-100" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">NIRF Rank</p>
                  <p className="text-sm font-black text-slate-700">#{college.nirf}</p>
                </div>
              </div>
              <a
                href={college.website} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#2667ff] text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                <Globe size={13} /> Official Website <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={GraduationCap} iconColor="bg-[#2667ff]" label="Total Seats"       value={college.seats} />
          <StatCard icon={TrendingUp}    iconColor="bg-emerald-500" label="Avg Package"      value={college.placements.avg} />
          <StatCard icon={Award}         iconColor="bg-amber-500"   label="Highest Package"  value={college.placements.highest} />
          <StatCard icon={Users}         iconColor="bg-violet-500"  label="Recruiting Companies" value={`${college.placements.companies}+`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: details ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Placements */}
            <section>
              <SectionHeading>
                <TrendingUp size={14} className="text-emerald-500" /> Placements
              </SectionHeading>
              <div className="bg-blue-50 border border-slate-100 rounded-[28px] p-6 grid grid-cols-3 gap-6">
                {[
                  { label: "Average CTC",  value: college.placements.avg },
                  { label: "Highest CTC",  value: college.placements.highest },
                  { label: "Companies",    value: `${college.placements.companies}+` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                    <p className="text-xl font-[900] text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Key facts */}
            <section>
              <SectionHeading>
                <FileText size={14} className="text-[#2667ff]" /> Key Facts
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Building2,    color: "text-[#2667ff]",   label: "Institute Type",  value: college.type },
                  { icon: MapPin,       color: "text-rose-500",    label: "Location",        value: `${college.city}, ${college.state}` },
                  { icon: BookOpen,     color: "text-purple-500",  label: "Established",     value: college.estd },
                  { icon: GraduationCap,color: "text-emerald-500", label: "Total Seats",     value: college.seats },
                  { icon: Award,        color: "text-amber-500",   label: "Accreditation",   value: college.accreditation },
                  { icon: Banknote,     color: "text-teal-500",    label: "Annual Fee",      value: college.fee },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className="flex items-center gap-4 bg-blue-50 border border-slate-100 rounded-2xl px-5 py-4">
                    <Icon size={16} className={color} />
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                      <p className="text-sm font-bold text-slate-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Entrance exams */}
            <section>
              <SectionHeading>
                <FileText size={14} className="text-violet-500" /> Entrance Exams Accepted
              </SectionHeading>
              <div className="flex flex-wrap gap-2">
                {college.exams.map((exam) => (
                  <div key={exam} className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-sm font-bold text-slate-700">{exam}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-6">

            {/* Courses offered */}
            <div className="bg-blue-50 border border-slate-100 rounded-[28px] p-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Courses Offered</p>
              <div className="space-y-2">
                {college.courses.map((c) => (
                  <div key={c} className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3">
                    <span className="text-sm font-bold text-slate-700">{c}</span>
                    <ChevronRight size={13} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick apply CTA */}
            <div className="bg-gradient-to-br from-[#2667ff] to-[#3f8efc]  rounded-[28px] p-6 text-white space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Admissions Open</p>
              <p className="text-lg font-[900] leading-tight">Interested in {college.name}?</p>
              <p className="text-xs font-medium opacity-70">Get expert guidance on admissions, fees, and scholarships.</p>
              <button className="w-full bg-white text-[#2667ff] px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95">
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>

        {/* ── Similar colleges ── */}
        {similar.length > 0 && (
          <section className="mt-14">
            <SectionHeading>
              <Building2 size={14} className="text-slate-400" /> Similar Colleges
            </SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((clg) => (
                <button
                  key={clg.id}
                  onClick={() => router.push(`/explore/${toSlug(clg.name)}`)}
                  className="group bg-white border border-slate-100 rounded-[24px] p-5 text-left hover:shadow-lg hover:border-[#2667ff]/30 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                      #{clg.rank}
                    </span>
                    {clg.featured && <Star size={10} className="text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-[11px] font-black text-slate-900 leading-snug mb-1 group-hover:text-[#2667ff] transition-colors">
                    {clg.name}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={8} /> {clg.city}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}