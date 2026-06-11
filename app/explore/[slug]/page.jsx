"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, MapPin, GraduationCap, BookOpen, Building2,
  Star, ExternalLink, Users, TrendingUp, Award, FileText,
  ChevronRight, Globe, Banknote, Image as ImageIcon, Clock,
  ChevronDown, Loader2, CheckCircle2, Send
} from "lucide-react";

const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, '-') || "";
const formatFee = (val) => {
  if (!val) return "N/A";
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

/* ─── Tiny atoms ─────────────────────────────────────────────────────────── */

function EyebrowBadge({ children }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 w-fit mb-5">
      <div className="w-1.5 h-1.5 rounded-full bg-[#2667ff]" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">{children}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-3xl font-black tracking-tight mb-8 uppercase italic">
      {children}
    </h2>
  );
}

function SectionDivider() {
  return <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mb-10" />;
}

function StatChip({ icon: Icon, label, value, accent }) {
  return (
    <div className={`bg-white p-6 rounded-[2rem] border-2 border-white shadow-xl flex flex-col gap-3 hover:shadow-2xl transition-all group`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent} transition-colors`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">{label}</p>
      <p className="text-xl font-black text-zinc-900 italic leading-tight">{value}</p>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CollegeDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [college, setCollege] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("overview");

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

  const handleContact = async (e) => {
    e.preventDefault();
    setContactStatus("loading");
    await new Promise(r => setTimeout(r, 1200));
    setContactStatus("success");
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactStatus("idle"), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2667ff]/10 flex items-center justify-center animate-pulse">
            <GraduationCap size={24} className="text-[#2667ff]" />
          </div>
          <p className="text-zinc-400 text-sm font-black uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFDFD]">
        <p className="text-6xl font-black text-zinc-100 italic uppercase">404</p>
        <p className="text-zinc-500 font-bold">College not found</p>
        <button
          onClick={() => router.push("/explore")}
          className="mt-2 flex items-center gap-2 bg-[#2667ff] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={13} /> Back to Explore
        </button>
      </div>
    );
  }

  const tabs = ["overview", "courses", "placements", "gallery"];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-[#2667ff]/20 pb-24 overflow-x-hidden">

      {/* ── Background glow blobs (Buzzar signature) ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#2667ff]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-10%] w-[450px] h-[450px] bg-[#2667ff]/10 blur-[110px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#2667ff]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-28 relative z-10">

        {/* ── Back button ── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#2667ff] transition-colors mb-10 group"
        >
          <div className="w-7 h-7 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-[#2667ff]/10 transition-colors">
            <ArrowLeft size={13} />
          </div>
          Back to results
        </button>

        {/* ══════════════════════════════════════════════════════
            HERO SECTION — Buzzar-style header block
        ══════════════════════════════════════════════════════ */}
        <header className="relative mb-14 flex flex-col items-start">
          <EyebrowBadge>
            {college.category} · Est. {college.estd}
          </EyebrowBadge>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-4 uppercase">
            {college.name.split(" ").length > 3
              ? <>
                  {college.name.split(" ").slice(0, 3).join(" ")}
                  <span className="bg-gradient-to-r from-[#2667ff] via-[#3f8efc] to-[#2667ff] bg-clip-text text-transparent italic px-2">
                    {college.name.split(" ").slice(3).join(" ")}
                  </span>
                </>
              : <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-[#2667ff] bg-clip-text text-transparent italic">
                  {college.name}
                </span>
            }
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 text-zinc-500 text-sm font-bold">
              <MapPin size={14} className="text-[#2667ff]" /> {college.city}, {college.state}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            {college.rank !== "-" && (
              <span className="px-3 py-1 bg-[#2667ff]/10 text-[#2667ff] text-[10px] font-black rounded-xl uppercase tracking-widest">
                NIRF #{college.rank}
              </span>
            )}
            {/* <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black rounded-xl uppercase tracking-widest">
              {college.accreditation}
            </span> */}
            {college.featured && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black rounded-xl uppercase tracking-widest flex items-center gap-1">
                <Star size={9} className="fill-amber-500" /> Featured
              </span>
            )}
          </div>

          <SectionDivider />
        </header>

        {/* ── Hero Cover ── */}
        <div className="relative h-[300px] md:h-[420px] w-full rounded-[3rem] overflow-hidden mb-10 shadow-2xl border-2 border-white">
          {college.image ? (
            <img
              src={college.image.startsWith("http") ? college.image : `https://finale-beacon-backend.vercel.app/uploads/colleges/${college.image}`}
              alt={college.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2667ff] to-[#3f8efc] flex items-center justify-center">
              <GraduationCap size={80} className="text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
            <div className="flex flex-wrap gap-2">
              {college.exams?.slice(0, 3).map(exam => (
                <span key={exam} className="px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                  {exam}
                </span>
              ))}
            </div>
            {college.website && college.website !== "#" && (
              <a
                href={college.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg"
              >
                <Globe size={12} /> Official Site <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {/* ── Stats row (Buzzar-style cards) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <StatChip icon={GraduationCap} label="Total Seats" value={college.seats || "—"} accent="bg-[#2667ff]" />
          <StatChip icon={TrendingUp} label="Avg Package" value={college.placements.avg} accent="bg-emerald-500" />
          <StatChip icon={Award} label="Highest CTC" value={college.placements.highest} accent="bg-amber-500" />
          <StatChip icon={Users} label="Recruiters" value={`${college.placements.companies}+`} accent="bg-violet-500" />
        </div>

        {/* ── Tab nav ── */}
        <div className="flex items-center gap-2 mb-10 bg-zinc-100/80 rounded-2xl p-1.5 w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            MAIN CONTENT GRID
        ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Left column ── */}
          <div className="lg:col-span-7 space-y-12">

            {/* OVERVIEW */}
            {(activeTab === "overview") && (
              <>
                {/* About — white card */}
                <section className="bg-white p-10 rounded-[3rem] border-2 border-white shadow-xl">
                  <EyebrowBadge>About the Institution</EyebrowBadge>
                  <SectionTitle>Who we are</SectionTitle>
                  <p className="text-zinc-500 leading-relaxed text-sm">{college.about}</p>
                </section>

                {/* Key facts — 2-col grid inside white card */}
                <section className="bg-white p-10 rounded-[3rem] border-2 border-white shadow-xl">
                  <EyebrowBadge>Quick Facts</EyebrowBadge>
                  <SectionTitle>At a Glance</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Building2, label: "Institute Type", value: college.type || "—" },
                      { icon: MapPin, label: "Location", value: `${college.city}, ${college.state}` },
                      { icon: BookOpen, label: "Established", value: college.estd || "—" },
                      { icon: GraduationCap, label: "Total Seats", value: college.seats || "—" },
                      { icon: Award, label: "NIRF Rank", value: college.rank ? `#${college.rank}` : "—" },
                      { icon: Banknote, label: "Fees Range", value: college.fee || "—" },
                      { icon: TrendingUp, label: "Placement %", value: college.raw?.placement?.placementPercentage ? `${college.raw.placement.placementPercentage}%` : "—" },
                      { icon: Users, label: "Study Modes", value: college.raw?.modes?.length > 0 ? college.raw.modes.join(", ") : "On Campus" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-4 bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 hover:border-[#2667ff]/20 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-[#2667ff]/10 flex items-center justify-center shrink-0">
                          <Icon size={15} className="text-[#2667ff]" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                          <p className="text-sm font-black text-zinc-800 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Entrance exams */}
                {college.exams?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <EyebrowBadge>Accepted Exams</EyebrowBadge>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {college.exams.map(exam => (
                        <div key={exam} className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-white shadow-md rounded-2xl hover:border-[#2667ff]/20 transition-all">
                          <div className="w-2 h-2 rounded-full bg-[#2667ff]" />
                          <span className="text-sm font-black text-zinc-700">{exam}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* COURSES */}
            {(activeTab === "courses") && college.courses?.length > 0 && (
              <section>
                <EyebrowBadge>Programs</EyebrowBadge>
                <SectionTitle>Courses Offered</SectionTitle>
                <div className="flex flex-col gap-4">
                  {college.courses.map(course => (
                    <div key={course.courseId || course.courseName} className="bg-white p-7 rounded-[2.5rem] border-2 border-white shadow-xl hover:shadow-2xl hover:border-[#2667ff]/20 transition-all group">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#2667ff]/10 text-[#2667ff] text-[9px] font-black uppercase tracking-widest">
                              {course.degreeType || "Degree"}
                            </span>
                            {course.durationYears > 0 && (
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                {course.durationYears} Years
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-black text-zinc-900 uppercase italic tracking-tight">
                            {course.courseName}
                          </h3>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Total Fees</p>
                          <p className="text-2xl font-black text-emerald-600 italic">
                            {course.fees?.totalFees ? formatFee(course.fees.totalFees) : "N/A"}
                          </p>
                          {course.fees?.yearlyFees > 0 && (
                            <p className="text-[10px] text-zinc-400 font-bold mt-0.5">{formatFee(course.fees.yearlyFees)}/yr</p>
                          )}
                        </div>
                      </div>

                      {course.description && (
                        <p className="text-zinc-500 text-xs leading-relaxed mb-5 font-medium">{course.description}</p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-zinc-50">
                        {[
                          { label: "Seat Intake", value: course.seatIntake ? `${course.seatIntake} seats` : "—" },
                          course.rankRequired?.general?.maxRank > 0 && { label: "Cutoff (Gen)", value: `${course.rankRequired.general.minRank > 0 ? course.rankRequired.general.minRank + " – " : ""}${course.rankRequired.general.maxRank}` },
                          course.rankRequired?.obc?.maxRank > 0 && { label: "Cutoff (OBC)", value: `${course.rankRequired.obc.maxRank}` },
                          course.rankRequired?.sc?.maxRank > 0 && { label: "Cutoff (SC)", value: `${course.rankRequired.sc.maxRank}` },
                        ].filter(Boolean).map(({ label, value }) => (
                          <div key={label} className="bg-zinc-50 rounded-xl p-3">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                            <p className="text-sm font-black text-zinc-800 mt-1">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PLACEMENTS */}
            {activeTab === "placements" && (
              <section>
                <EyebrowBadge>Career Outcomes</EyebrowBadge>
                <SectionTitle>Placement Records</SectionTitle>

                {/* 3 big numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Highest CTC", value: college.placements.highest, color: "from-amber-500 to-orange-400" },
                    { label: "Average CTC", value: college.placements.avg, color: "from-emerald-500 to-teal-400" },
                    { label: "Median CTC", value: college.raw?.placement?.medianPackage?.amount ? `${college.raw.placement.medianPackage.amount} ${college.raw.placement.medianPackage.unit || "LPA"}` : "N/A", color: "from-[#2667ff] to-[#3f8efc]" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white p-7 rounded-[2rem] border-2 border-white shadow-xl text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">{label}</p>
                      <p className={`text-3xl font-black italic bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
                    </div>
                  ))}
                </div>

                {college.raw?.placement?.placementPercentage > 0 && (
                  <div className="bg-zinc-900 p-8 rounded-[2.5rem] border-2 border-[#2667ff]/30 mb-8 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Placement Rate {college.raw.placement.year && `· ${college.raw.placement.year}`}</p>
                      <p className="text-white text-2xl font-black">Students land jobs.</p>
                    </div>
                    <p className="text-5xl font-black italic text-[#2667ff] shrink-0">{college.raw.placement.placementPercentage}%</p>
                  </div>
                )}

                {/* Recruiting companies */}
                {college.raw?.placement?.companiesVisited?.length > 0 && (
                  <>
                    <EyebrowBadge>Top Recruiters</EyebrowBadge>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {college.raw.placement.companiesVisited.map((co, i) => (
                        <div key={i} className="bg-white p-5 rounded-[1.5rem] border-2 border-white shadow-md hover:shadow-xl hover:border-[#2667ff]/20 transition-all flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-zinc-900 capitalize">{co.companyName}</p>
                            {co.sector && (
                              <span className="text-[8px] font-black text-[#2667ff] bg-[#2667ff]/10 px-2 py-0.5 rounded-lg uppercase tracking-wider mt-1 inline-block">
                                {co.sector}
                              </span>
                            )}
                          </div>
                          {co.highestPackageOffered?.amount > 0 && (
                            <div className="text-right shrink-0">
                              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Max CTC</p>
                              <p className="text-base font-black text-emerald-600 italic">{co.highestPackageOffered.amount} {co.highestPackageOffered.unit || "LPA"}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* GALLERY */}
            {activeTab === "gallery" && (
              <section>
                <EyebrowBadge>Campus Life</EyebrowBadge>
                <SectionTitle>Photo Gallery</SectionTitle>
                {college.raw?.media?.images?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {college.raw.media.images.map((img, i) => (
                      <div key={i} className="group relative aspect-video rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl hover:shadow-2xl transition-all">
                        <img
                          src={img.filename.startsWith("http") ? img.filename : `https://finale-beacon-backend.vercel.app/uploads/colleges/${img.filename}`}
                          alt={img.originalName || `Campus ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">View</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-10 rounded-[2.5rem] border-2 border-white shadow-xl text-center">
                    <ImageIcon size={32} className="text-zinc-200 mx-auto mb-3" />
                    <p className="text-zinc-400 font-black text-sm uppercase tracking-widest">No gallery images available</p>
                  </div>
                )}
              </section>
            )}

            {/* Student Reviews (always visible) */}
            {activeTab === "overview" && college.raw?.reviews?.length > 0 && (
              <section>
                <EyebrowBadge>Student Reviews</EyebrowBadge>
                <SectionTitle>What they say</SectionTitle>
                <div className="flex flex-col gap-4">
                  {college.raw.reviews.map((r, i) => {
                    const dateStr = r.createdAt?.$date || r.createdAt;
                    const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : null;
                    return (
                      <div key={i} className="bg-white p-7 rounded-[2rem] border-2 border-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#2667ff]/10 border border-[#2667ff]/20 flex items-center justify-center font-black text-xs text-[#2667ff] uppercase">
                              {r.userName?.slice(0, 2) || "UR"}
                            </div>
                            <div>
                              <p className="text-sm font-black text-zinc-800 capitalize">{r.userName}</p>
                              {formattedDate && <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{formattedDate}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
                            <Star size={10} className="fill-amber-400 text-amber-400 mr-0.5" />
                            <span className="text-[10px] font-black text-amber-700">{r.rating}/5</span>
                          </div>
                        </div>
                        {r.comment && (
                          <p className="text-zinc-500 text-sm font-medium leading-relaxed bg-zinc-50/60 rounded-2xl p-4 border border-zinc-100 italic">
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

          {/* ─── Right sidebar ─────────────────────────── */}
          <aside className="lg:col-span-5 space-y-6">

            {/* Response time chip */}
            <div className="bg-white p-7 rounded-[2rem] border-2 border-white shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Average Response</p>
                  <span className="text-5xl font-black text-zinc-900 tracking-tighter italic">&lt; 24h</span>
                </div>
                <div className="bg-[#2667ff]/10 p-3 rounded-xl">
                  <Clock className="text-[#2667ff]" size={20} />
                </div>
              </div>
            </div>

            {/* Quick contact info */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-xl space-y-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Contact & Info</p>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Accreditation</p>
                <p className="text-sm font-black text-zinc-800">{college.accreditation}</p>
              </div>
              <div className="h-px bg-zinc-100" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Address</p>
                <p className="text-xs font-semibold text-zinc-600 leading-relaxed">
                  {college.raw?.location?.address || "—"}, {college.city}, {college.state}
                  {college.raw?.location?.pincode ? ` – ${college.raw.location.pincode}` : ""}
                </p>
              </div>
              {college.website && college.website !== "#" && (
                <>
                  <div className="h-px bg-zinc-100" />
                  <a
                    href={college.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#2667ff] hover:bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-100"
                  >
                    <Globe size={13} /> Visit Official Site <ExternalLink size={10} />
                  </a>
                </>
              )}
            </div>

            {/* Courses quick list */}
            <div className="bg-[#2667ff]/5 p-8 rounded-[2.5rem] border-2 border-white shadow-md">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4">Programs List</p>
              <div className="space-y-2">
                {college.courses.map(co => (
                  <div key={co.courseId || co.courseName} className="flex items-center justify-between bg-white border border-zinc-100 rounded-xl px-4 py-3 hover:border-[#2667ff]/20 transition-colors">
                    <span className="text-xs font-black text-zinc-700 uppercase">{co.courseName}</span>
                    <ChevronRight size={12} className="text-zinc-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Dark contact form (Buzzar signature dark card) ── */}
            {/* <div className="bg-zinc-900 p-10 rounded-[3rem] border-2 border-[#2667ff]/40 shadow-2xl text-white">
              <EyebrowBadge>Admissions Open</EyebrowBadge>
              <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tight mt-4">
                Get free guidance
              </h3>
              <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
                Our counsellors can walk you through admissions, fees, and scholarships.
              </p>
              <form className="space-y-5" onSubmit={handleContact}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Your Name</label>
                  <input
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full bg-zinc-800/60 border-2 border-zinc-800 focus:border-[#2667ff] rounded-2xl px-5 py-3.5 text-sm outline-none transition-all font-medium text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-800/60 border-2 border-zinc-800 focus:border-[#2667ff] rounded-2xl px-5 py-3.5 text-sm outline-none transition-all font-medium text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Course Interest</label>
                  <div className="relative">
                    <select
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-zinc-800/60 border-2 border-zinc-800 focus:border-[#2667ff] rounded-2xl px-5 py-3.5 text-sm outline-none appearance-none cursor-pointer font-medium text-white"
                    >
                      <option value="" className="bg-zinc-900">Select a course...</option>
                      {college.courses.map(co => (
                        <option key={co.courseName} value={co.courseName} className="bg-zinc-900">{co.courseName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                  </div>
                </div>

                <button
                  disabled={contactStatus === "loading"}
                  type="submit"
                  className={`w-full font-black py-4 rounded-2xl uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 mt-2 ${
                    contactStatus === "success" ? "bg-emerald-500 text-white" : "bg-[#2667ff] text-white hover:scale-[1.02] hover:bg-[#1a4fd4]"
                  }`}
                >
                  {contactStatus === "loading" ? <Loader2 className="animate-spin" size={18} /> :
                   contactStatus === "success" ? <CheckCircle2 size={18} /> : <Send size={18} />}
                  {contactStatus === "loading" ? "Sending..." : contactStatus === "success" ? "Sent!" : "Book Consultation"}
                </button>
              </form>
            </div> */}
          </aside>
        </div>

        {/* ── Similar Colleges ── */}
        {similar.length > 0 && (
          <section className="mt-16">
            <div className="flex flex-col items-start mb-10">
              <EyebrowBadge>You may also like</EyebrowBadge>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic mt-3">
                Similar
                <span className="bg-gradient-to-r from-[#2667ff] to-[#3f8efc] bg-clip-text text-transparent px-2">
                  Colleges
                </span>
              </h2>
              <div className="w-28 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(clg => (
                <button
                  key={clg.id}
                  onClick={() => router.push(`/explore/${toSlug(clg.name)}`)}
                  className="group bg-white p-6 rounded-[2rem] border-2 border-white text-left hover:shadow-2xl hover:border-[#2667ff]/20 transition-all duration-300 active:scale-95 shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {clg.rank !== "-" && (
                      <span className="text-[9px] font-black text-zinc-400 bg-zinc-100 rounded-lg px-2 py-1 uppercase">
                        NIRF #{clg.rank}
                      </span>
                    )}
                    {clg.featured && <Star size={10} className="text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-sm font-black text-zinc-900 leading-snug mb-1 group-hover:text-[#2667ff] transition-colors line-clamp-2 uppercase italic">
                    {clg.name}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1 mt-2">
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