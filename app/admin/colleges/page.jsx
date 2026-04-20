"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, RefreshCw, Trash2, Eye, Pencil, MapPin, GraduationCap,
  TrendingUp, Star, X, AlertTriangle, Loader2, Search, BookOpen,
  Building2, ExternalLink, ChevronRight, ImageOff,
} from "lucide-react";
import {
  PageHeader, Btn, ToastProvider, useToast,
} from "../../../admin-compo/AdminUi";
import { getToken } from "../../../lib/auth";
import CollegeForm from "../../../admin-compo/CollegeForm";

const API = "http://localhost:5000";

const fmtPkg = (pkg) => pkg?.amount > 0 ? `${pkg.amount} ${pkg.unit || "LPA"}` : null;
const imgUrl = (filename) => `${API}/uploads/${filename}`;

// ── Delete Dialog ──────────────────────────────────────────────────────────────
function DeleteDialog({ college, onConfirm, onClose, loading }) {
  if (!college) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto">
          <AlertTriangle size={26} className="text-rose-500" />
        </div>
        <div className="text-center">
          <p className="text-[16px] font-black text-slate-800">Delete College?</p>
          <p className="text-[12px] text-slate-500 mt-1.5 leading-relaxed">
            <span className="font-bold text-slate-700">{college.collegeName}</span> and all its data will be permanently removed.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-bold rounded-xl transition-all disabled:opacity-60">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Drawer ────────────────────────────────────────────────────────────────
function ViewDrawer({ college: c, onClose, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);
  if (!c) return null;
  const cover = c.media?.images?.[0];

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Cover */}
        <div className="relative h-52 bg-gradient-to-br from-slate-700 to-slate-900 shrink-0">
          {cover && !imgError ? (
            <img src={imgUrl(cover.filename)} alt={cover.originalName || c.collegeName}
              className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
              <ImageOff size={32} /><span className="text-[12px]">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-white text-[18px] font-black leading-tight capitalize">{c.collegeName}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-white/70" />
              <span className="text-white/80 text-[12px]">
                {[c.location?.city, c.location?.state].filter(Boolean).join(", ") || "Location unknown"}
              </span>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {c.nirfRanking?.overallRank > 0 && (
              <span className="px-3 py-1 bg-[#2667ff]/10 text-[#2667ff] text-[11px] font-black rounded-full">NIRF #{c.nirfRanking.overallRank}</span>
            )}
            {c.collegeRatings?.averageRating > 0 && (
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[11px] font-black rounded-full flex items-center gap-1">
                <Star size={10} className="fill-amber-500" /> {c.collegeRatings.averageRating}/5
              </span>
            )}
            {c.placement?.placementPercentage > 0 && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-black rounded-full">{c.placement.placementPercentage}% Placed</span>
            )}
            {c.establishedYear > 0 && (
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-black rounded-full">Est. {c.establishedYear}</span>
            )}
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3">
            {[
              ["College ID", c.collegeId || "—"],
              ["Address", [c.location?.address, c.location?.city, c.location?.state, c.location?.pincode].filter(Boolean).join(", ") || "—"],
              ["NIRF Rank", c.nirfRanking?.overallRank > 0 ? `#${c.nirfRanking.overallRank} (${c.nirfRanking.year})` : "—"],
              ["Rating", c.collegeRatings?.averageRating > 0 ? `${c.collegeRatings.averageRating}/5 (${c.collegeRatings.totalReviews} reviews)` : "—"],
              ["Placement", c.placement?.placementPercentage > 0 ? `${c.placement.placementPercentage}% (${c.placement.year})` : "—"],
              ["Highest Pkg", fmtPkg(c.placement?.highestPackage) || "—"],
              ["Average Pkg", fmtPkg(c.placement?.averagePackage) || "—"],
              ["Median Pkg", fmtPkg(c.placement?.medianPackage) || "—"],
              ["Companies", c.placement?.companiesVisited?.length > 0 ? `${c.placement.companiesVisited.length} companies` : "—"],
              ["Courses", c.courses?.length > 0 ? `${c.courses.length} courses` : "—"],
              ["Reviews", c.reviews?.length > 0 ? `${c.reviews.length} reviews` : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0">{label}</span>
                <span className="text-[12px] font-semibold text-slate-700 text-right">{value}</span>
              </div>
            ))}
          </div>

          {c.description && (
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">About</p>
              <p className="text-[13px] text-slate-600 leading-relaxed">{c.description}</p>
            </div>
          )}

          {c.media?.images?.length > 1 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">All Images</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {c.media.images.map((img, i) => (
                  <img key={i} src={imgUrl(img.filename)} alt={img.originalName}
                    className="h-20 w-28 object-cover rounded-xl shrink-0 border border-slate-100" />
                ))}
              </div>
            </div>
          )}

          {c.courses?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Courses</p>
              <div className="flex flex-col gap-1.5">
                {c.courses.map((course, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <BookOpen size={11} className="text-[#2667ff]" />
                      <span className="text-[12px] font-bold text-slate-700">{course.courseName}</span>
                      {course.degreeType && <span className="text-[10px] text-slate-400">{course.degreeType}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      {course.durationYears > 0 && <span>{course.durationYears}yr</span>}
                      {course.seatIntake > 0 && <span>{course.seatIntake} seats</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.placement?.companiesVisited?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Companies Visited</p>
              <div className="flex flex-wrap gap-1.5">
                {c.placement.companiesVisited.map((co, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg">{co.companyName}</span>
                ))}
              </div>
            </div>
          )}

          {c.media?.videoLink && (
            <a href={c.media.videoLink} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-[#2667ff] text-[12px] font-bold hover:underline">
              <ExternalLink size={13} /> Watch College Video
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-slate-100 flex gap-3">
          <button onClick={() => { onClose(); onEdit(c); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2667ff] hover:bg-[#1a54e8] text-white text-[12px] font-bold rounded-xl transition-all">
            <Pencil size={13} /> Edit College
          </button>
          <button onClick={() => { onClose(); onDelete(c); }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-bold rounded-xl transition-all">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Drawer ────────────────────────────────────────────────────────────────
function EditDrawer({ college, onClose, onSaved, toast }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!college) return null;

  const handleSubmit = async (fd) => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/admin/colleges/${college._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(`❌ ${data.errors?.join(", ") || data.message || "Update failed"}`);
        return;
      }
      setSaved(true);
      toast(`✅ ${data.data.collegeName} updated!`);
      setTimeout(() => { setSaved(false); onSaved(data.data); onClose(); }, 1200);
    } catch (err) {
      toast(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !loading && onClose()} />
      <div className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-[15px] font-black text-slate-800">Edit College</h2>
            <p className="text-[12px] text-slate-400 capitalize">{college.collegeName}</p>
          </div>
          <button onClick={() => !loading && onClose()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          <CollegeForm
            mode="edit"
            initialData={college}
            existingImages={college.media?.images || []}
            onSubmit={handleSubmit}
            onBack={onClose}
            loading={loading}
            saved={saved}
            toast={toast}
          />
        </div>
      </div>
    </div>
  );
}

// ── College Card ───────────────────────────────────────────────────────────────
function CollegeCard({ college: c, onView, onEdit, onDelete }) {
  const cover = c.media?.images?.[0];
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 shrink-0 overflow-hidden">
        {cover && !imgError ? (
          <img src={imgUrl(cover.filename)} alt={cover.originalName || c.collegeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
            <GraduationCap size={36} /><span className="text-[11px] font-semibold">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {c.nirfRanking?.overallRank > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#2667ff] text-white text-[11px] font-black rounded-lg shadow-lg">
            NIRF #{c.nirfRanking.overallRank}
          </div>
        )}
        {c.collegeRatings?.averageRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg">
            <Star size={10} className="fill-amber-400 text-amber-400" />{c.collegeRatings.averageRating}
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <button onClick={() => onView(c)} className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-all" title="View"><Eye size={14} /></button>
          <button onClick={() => onEdit(c)} className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-[#2667ff] flex items-center justify-center shadow-md transition-all" title="Edit"><Pencil size={14} /></button>
          <button onClick={() => onDelete(c)} className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center shadow-md transition-all" title="Delete"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="text-[14px] font-black text-slate-800 leading-tight capitalize line-clamp-1">{c.collegeName}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-slate-400">{c.collegeId}</span>
            {c.establishedYear > 0 && <span className="text-[10px] text-slate-400">· Est. {c.establishedYear}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <MapPin size={11} className="text-slate-400 shrink-0" />
          <span className="line-clamp-1">{[c.location?.city, c.location?.state].filter(Boolean).join(", ") || "—"}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {c.placement?.placementPercentage > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg">
              <TrendingUp size={10} />{c.placement.placementPercentage}%
            </span>
          )}
          {c.courses?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg">
              <BookOpen size={10} />{c.courses.length} courses
            </span>
          )}
          {c.placement?.companiesVisited?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg">
              <Building2 size={10} />{c.placement.companiesVisited.length} cos.
            </span>
          )}
        </div>

        {fmtPkg(c.placement?.averagePackage) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Package</span>
            <span className="text-[13px] font-black text-slate-800">{fmtPkg(c.placement.averagePackage)}</span>
          </div>
        )}
      </div>

      <button onClick={() => onView(c)}
        className="flex items-center justify-between px-4 py-3 border-t border-slate-50 text-[12px] font-bold text-slate-400 hover:text-[#2667ff] hover:bg-slate-50 transition-all">
        View Details <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════════
export default function CollegesPage() {
  const router = useRouter();
  const toast  = useToast();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  const [viewTarget,    setViewTarget]    = useState(null);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/admin/colleges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Fetch failed");
      setColleges(data.data);
    } catch (err) {
      toast(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  const filtered = colleges.filter(c =>
    [c.collegeName, c.location?.city, c.location?.state, c.collegeId]
      .filter(Boolean).some(f => f.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/admin/colleges/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");
      setColleges(p => p.filter(c => c._id !== deleteTarget._id));
      toast(`🗑️ ${deleteTarget.collegeName} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast(`❌ ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <ToastProvider />

      <PageHeader
        title="College List"
        subtitle={loading ? "Loading…" : `${filtered.length} of ${colleges.length} institutes`}
        action={
          <div className="flex items-center gap-2">
            <button onClick={fetchColleges} disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all disabled:opacity-50">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <Btn onClick={() => router.push("/admin/add-college")}>
              <Plus size={13} /> Add College
            </Btn>
          </div>
        }
      />

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, city, state, ID…"
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2667ff]/20 focus:border-[#2667ff] transition-all shadow-sm" />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
              <div className="h-44 bg-slate-100" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
            <GraduationCap size={36} className="text-slate-300" />
          </div>
          <p className="text-[16px] font-black text-slate-700">No colleges found</p>
          <p className="text-[13px] text-slate-400 mt-2">
            {search ? `No results for "${search}"` : "Add your first college to get started"}
          </p>
          {!search && (
            <button onClick={() => router.push("/admin/add-college")}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#2667ff] text-white text-[13px] font-bold rounded-xl hover:bg-[#1a54e8] transition-all">
              <Plus size={14} /> Add College
            </button>
          )}
        </div>
      )}

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-5">
          {filtered.map(c => (
            <CollegeCard key={c._id} college={c}
              onView={setViewTarget} onEdit={setEditTarget} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <ViewDrawer college={viewTarget} onClose={() => setViewTarget(null)}
        onEdit={c => { setViewTarget(null); setEditTarget(c); }}
        onDelete={c => { setViewTarget(null); setDeleteTarget(c); }} />

      <EditDrawer college={editTarget} onClose={() => setEditTarget(null)}
        onSaved={updated => setColleges(p => p.map(c => c._id === updated._id ? updated : c))}
        toast={toast} />

      <DeleteDialog college={deleteTarget} onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)} loading={deleteLoading} />
    </>
  );
}