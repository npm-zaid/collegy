"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, MapPin, GraduationCap, BookOpen, Building2,
  Star, ExternalLink, Users, TrendingUp, Award, FileText,
  ChevronRight, Globe, Banknote, Image as ImageIcon
} from "lucide-react";

const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, '-') || "";
const formatFee = (val) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

// ─── Stat card atom ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="bg-[#2667ff]/5 border border-slate-100 rounded-[24px] p-5 flex flex-col gap-2 shadow-sm">
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
    blue: "bg-blue-50   text-[#2667ff] border-blue-100",
    amber: "bg-amber-50  text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    slate: "bg-slate-50  text-slate-600  border-slate-200",
    rose: "bg-rose-50   text-rose-600   border-rose-200",
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
  const router = useRouter();

  const [college, setCollege] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch("https://finale-beacon-backend.vercel.app/api/colleges");
        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map(c => ({
            id: c._id || c.collegeId,
            name: c.collegeName || "Unknown",
            city: c.location?.city || "Unknown",
            state: c.location?.state || "Unknown",
            courses: c.courses || [],
            category: c.collegeType || "Private",
            featured: c.isFeatured || false,
            fee: c.feesRange || (c.courses?.[0]?.fees?.totalFees ? formatFee(c.courses[0].fees.totalFees) : "N/A"),
            rank: c.nirfRanking?.overallRank || "-",
            seats: c.courses?.reduce((acc, curr) => acc + (curr.seatIntake || 0), 0) || 0,
            type: c.collegeType || "Private",
            estd: c.establishedYear || "Unknown",
            accreditation: c.accreditation || "NA",
            exams: c.exams || ["Merit Based"],
            about: c.description || "No description available.",
            website: c.website || "#",
            image: c.media?.images?.[0]?.filename || null,
            placements: {
              avg: c.placement?.averagePackage?.amount ? `${c.placement.averagePackage.amount} ${c.placement.averagePackage.unit}` : "N/A",
              highest: c.placement?.highestPackage?.amount ? `${c.placement.highestPackage.amount} ${c.placement.highestPackage.unit}` : "N/A",
              companies: c.placement?.companiesVisited?.length || 0
            },
            slug: toSlug(c.collegeName),
            raw: c,
          }));

          const found = mapped.find(c => c.slug === slug);
          setCollege(found);

          if (found) {
            const foundCourseNames = found.courses.map(co => co.courseName);
            const sim = mapped
              .filter(c => c.id !== found.id && c.courses.some(co => foundCourseNames.includes(co.courseName)))
              .sort((a, b) => (typeof a.rank === 'number' ? a.rank : 99999) - (typeof b.rank === 'number' ? b.rank : 99999))
              .slice(0, 4);
            setSimilar(sim);
          }
        }
      } catch (err) {
        console.error("Failed to fetch college", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDFEFF] text-slate-500 font-bold">Loading...</div>;
  }

  // Unknown slug → 404
  if (!college) {
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

        {/* ── Gorgeous Hero Cover Banner ── */}
        <div className="relative h-[280px] md:h-[400px] w-full rounded-[36px] overflow-hidden mb-10 shadow-lg border border-slate-100">
          {college.image ? (
            <img 
              src={college.image.startsWith("http") ? college.image : `https://finale-beacon-backend.vercel.app/uploads/colleges/${college.image}`} 
              alt={college.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-[#2667ff] flex items-center justify-center text-white/20">
              <GraduationCap size={100} />
            </div>
          )}
          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
          
          {/* Hero text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white space-y-3.5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              {college.featured && (
                <span className="px-2.5 py-1 bg-amber-500 text-zinc-950 text-[8px] font-black uppercase tracking-widest rounded-lg shadow-md flex items-center gap-1">
                  <Star size={8} className="fill-zinc-950" />Featured
                </span>
              )}
              <span className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                {college.category}
              </span>
              <span className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                {college.type}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/80 flex items-center gap-1.5 ml-1">
                <MapPin size={11} className="text-[#3f8efc]" /> {college.city}, {college.state}
              </span>
            </div>
            
            {/* Title & Stats */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-zinc-950 text-[10px] font-black shadow-sm leading-none">
                  NIRF #{college.rank}
                </span>
                <span className="text-white/60 text-xs font-semibold">Established {college.estd}</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-[900] tracking-tight leading-tight uppercase italic text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {college.name}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={GraduationCap} iconColor="bg-[#2667ff]" label="Total Seats" value={college.seats || "—"} />
          <StatCard icon={TrendingUp} iconColor="bg-emerald-500" label="Avg Package" value={college.placements.avg || "—"} />
          <StatCard icon={Award} iconColor="bg-amber-500" label="Highest Package" value={college.placements.highest || "—"} />
          <StatCard icon={Users} iconColor="bg-violet-500" label="Companies Visited" value={`${college.placements.companies}+`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: details ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* About Section */}
            <section className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
              <SectionHeading>
                <Building2 size={14} className="text-[#2667ff]" /> About the Institution
              </SectionHeading>
              <p className="text-slate-600 text-[14px] font-medium leading-relaxed">
                {college.about}
              </p>
            </section>

            {/* Placement Details */}
            <section>
              <SectionHeading>
                <TrendingUp size={14} className="text-emerald-500" /> Placement Details
              </SectionHeading>
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Highest CTC", value: college.placements.highest, desc: "Top offer package", color: "text-amber-600 bg-amber-50 border-amber-100" },
                    { label: "Average CTC", value: college.placements.avg, desc: "Mean offer package", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                    { label: "Median CTC", value: college.raw?.placement?.medianPackage?.amount ? `${college.raw.placement.medianPackage.amount} ${college.raw.placement.medianPackage.unit || "LPA"}` : "N/A", desc: "Midpoint package", color: "text-[#2667ff] bg-blue-50 border-blue-100" },
                  ].map(({ label, value, desc, color }) => (
                    <div key={label} className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-4 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                      <p className={`text-xl font-[900] ${color.split(' ')[0]} italic`}>{value}</p>
                      <p className="text-[9px] text-slate-400 mt-1 font-medium">{desc}</p>
                    </div>
                  ))}
                </div>

                {college.raw?.placement?.placementPercentage > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                        <TrendingUp size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">High Placement Rate</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Track record for the year {college.raw.placement.year}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-[900] italic text-emerald-600 leading-none">{college.raw.placement.placementPercentage}%</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Students Placed</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Courses Details */}
            {college.courses?.length > 0 && (
              <section>
                <SectionHeading>
                  <BookOpen size={14} className="text-indigo-500" /> Courses Offered & Details
                </SectionHeading>
                <div className="flex flex-col gap-4">
                  {college.courses.map((course) => (
                    <div key={course.courseId || course.courseName} className="bg-white border border-slate-100 hover:border-[#2667ff]/30 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-wider">
                              {course.degreeType || "Degree"}
                            </span>
                            {course.durationYears > 0 && (
                              <span className="text-[10px] font-bold text-slate-400">
                                · {course.durationYears} Years
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight capitalize">
                            {course.courseName}
                          </h3>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Fees</p>
                          <p className="text-lg font-[900] text-emerald-600 italic">
                            {course.fees?.totalFees ? formatFee(course.fees.totalFees) : "N/A"}
                          </p>
                          {course.fees?.yearlyFees > 0 && (
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {formatFee(course.fees.yearlyFees)} / year
                            </p>
                          )}
                        </div>
                      </div>

                      {course.description && (
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 font-medium">
                          {course.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Seat Intake</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{course.seatIntake || "—"} seats</p>
                        </div>
                        {course.rankRequired?.general?.maxRank > 0 && (
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Cutoff Rank (Gen)</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">
                              {course.rankRequired.general.minRank > 0 ? `${course.rankRequired.general.minRank} - ` : ""}
                              {course.rankRequired.general.maxRank}
                            </p>
                          </div>
                        )}
                        {course.rankRequired?.obc?.maxRank > 0 && (
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Cutoff Rank (OBC)</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">
                              {course.rankRequired.obc.minRank > 0 ? `${course.rankRequired.obc.minRank} - ` : ""}
                              {course.rankRequired.obc.maxRank}
                            </p>
                          </div>
                        )}
                        {course.rankRequired?.sc?.maxRank > 0 && (
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Cutoff Rank (SC/ST)</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">
                              SC: {course.rankRequired.sc.maxRank} / ST: {course.rankRequired.st?.maxRank || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key facts */}
            <section>
              <SectionHeading>
                <FileText size={14} className="text-[#2667ff]" /> Key Facts
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Building2, color: "text-[#2667ff]", label: "Institute Type", value: college.type || "—" },
                  { icon: MapPin, color: "text-rose-500", label: "Location", value: `${college.city}, ${college.state}` },
                  { icon: BookOpen, color: "text-purple-500", label: "Established", value: college.estd || "—" },
                  { icon: GraduationCap, color: "text-emerald-500", label: "Total Seats", value: college.seats || "—" },
                  { icon: Award, color: "text-amber-500", label: "NIRF Rank", value: college.rank ? `#${college.rank}` : "—" },
                  { icon: Banknote, color: "text-teal-500", label: "Fees Range", value: college.fee || "—" },
                  { icon: TrendingUp, color: "text-indigo-500", label: "Placement %", value: college.raw?.placement?.placementPercentage ? `${college.raw.placement.placementPercentage}%` : "—" },
                  { icon: Users, color: "text-cyan-500", label: "Study Modes", value: college.raw?.modes?.length > 0 ? college.raw.modes.join(", ") : "—" },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-4">
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
            {college.exams?.length > 0 && (
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
            )}

            {/* Recruiting Companies */}
            {college.raw?.placement?.companiesVisited?.length > 0 && (
              <section>
                <SectionHeading>
                  <Building2 size={14} className="text-emerald-500" /> Top Recruiting Companies
                </SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {college.raw.placement.companiesVisited.map((co, i) => (
                    <div key={i} className="bg-white border border-slate-100 hover:border-emerald-200/50 rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-800 capitalize">{co.companyName}</span>
                        {co.sector && (
                          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {co.sector}
                          </span>
                        )}
                      </div>
                      {(co.highestPackageOffered?.amount > 0 || co.averagePackageOffered?.amount > 0) && (
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-slate-500">
                          {co.averagePackageOffered?.amount > 0 && (
                            <span>Avg: <strong className="text-slate-700">{co.averagePackageOffered.amount} {co.averagePackageOffered.unit || "LPA"}</strong></span>
                          )}
                          {co.highestPackageOffered?.amount > 0 && (
                            <span>Max: <strong className="text-emerald-600 font-extrabold">{co.highestPackageOffered.amount} {co.highestPackageOffered.unit || "LPA"}</strong></span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Campus Gallery */}
            {college.raw?.media?.images?.length > 1 && (
              <section>
                <SectionHeading>
                  <ImageIcon size={14} className="text-blue-500" /> Campus Gallery
                </SectionHeading>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {college.raw.media.images.map((img, i) => (
                    <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                      <img
                        src={img.filename.startsWith("http") ? img.filename : `https://finale-beacon-backend.vercel.app/uploads/colleges/${img.filename}`}
                        alt={img.originalName || `Campus Image ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Student Reviews */}
            {college.raw?.reviews?.length > 0 && (
              <section>
                <SectionHeading>
                  <Star size={14} className="text-amber-500" /> Student Reviews
                </SectionHeading>
                <div className="flex flex-col gap-4">
                  {college.raw.reviews.map((r, i) => {
                    const dateStr = r.createdAt?.$date || r.createdAt;
                    const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;
                    return (
                      <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-xs text-[#2667ff] uppercase">
                              {r.userName?.slice(0, 2) || "UR"}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 capitalize">{r.userName}</p>
                              {formattedDate && <p className="text-[9px] text-slate-400 font-bold">{formattedDate}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl">
                            <Star size={10} className="fill-amber-400 text-amber-500 mr-1" />
                            <span className="text-[10px] font-black text-amber-700">{r.rating}/5</span>
                          </div>
                        </div>
                        {r.comment && (
                          <p className="text-slate-600 text-xs font-medium leading-relaxed bg-slate-50/50 rounded-xl p-3 border border-slate-50">
                            "{r.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-6">

            {/* Quick overview widget */}
            <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quick Contact</p>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Accreditation</p>
                <p className="text-sm font-black text-slate-700">{college.accreditation}</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  {college.raw?.location?.address || "—"}, {college.city}, {college.state} - {college.raw?.location?.pincode || ""}
                </p>
              </div>
              {college.website && college.website !== "#" && (
                <>
                  <div className="h-px bg-slate-100" />
                  <a
                    href={college.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#2667ff] hover:bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md shadow-blue-100 active:scale-95"
                  >
                    <Globe size={12} /> Visit Official Site <ExternalLink size={10} />
                  </a>
                </>
              )}
            </div>

            {/* Courses offered quick summary list */}
            <div className="bg-[#2667ff]/5 border border-slate-100 rounded-[28px] p-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Courses List</p>
              <div className="space-y-2">
                {college.courses.map((co) => (
                  <div key={co.courseId || co.courseName} className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-xs font-bold text-slate-700 uppercase">{co.courseName}</span>
                    <ChevronRight size={12} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick apply CTA */}
            <div className="bg-gradient-to-br from-[#2667ff] to-[#3f8efc] rounded-[28px] p-6 text-white space-y-3 shadow-lg shadow-blue-100">
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
                  className="group bg-white border border-slate-100 rounded-[24px] p-5 text-left hover:shadow-lg hover:border-[#2667ff]/30 transition-all duration-300 active:scale-95 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                      #{clg.rank}
                    </span>
                    {clg.featured && <Star size={10} className="text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-[11px] font-black text-slate-900 leading-snug mb-1 group-hover:text-[#2667ff] transition-colors line-clamp-1 capitalize">
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