"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Plus, Trash2, ExternalLink, Search, Video, CalendarDays, Play, Mic, Users, Clock } from "lucide-react";
import { PageHeader, Chip, Btn, ToastProvider, useToast } from "../../../admin-compo/AdminUi";
import { getWebinarsApi, deleteWebinarApi } from "../../../lib/webinarApi";

const STATUS_COLOR_MAP = {
  "LIVE": "rose",
  "UPCOMING": "blue",
  "RECORDED": "gray",
};

function WebinarAdminCard({ webinar, onDelete, index }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: index * 0.05 }
    );
  }, [index]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${webinar.title}"?`)) return;

    gsap.to(ref.current, {
      opacity: 0,
      x: 30,
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onDelete(webinar._id || webinar.id),
    });
  };

  const isLive = webinar.status === "LIVE";
  const isUpcoming = webinar.status === "UPCOMING";
  const isRecorded = webinar.status === "RECORDED";

  return (
    <div
      ref={ref}
      className="bg-white border border-slate-100 rounded-[20px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#2667ff]/30 hover:shadow-md transition-all duration-200"
    >
      {/* Left info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">
          {webinar.icon || "🎯"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${
                isLive
                  ? "bg-rose-100 text-rose-600"
                  : isUpcoming
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {webinar.status || "UPCOMING"}
            </span>
            {webinar.category && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                {webinar.category}
              </span>
            )}
          </div>
          <h3 className="font-black text-[15px] text-slate-800 leading-snug truncate">
            {webinar.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-semibold mt-1">
            <span className="flex items-center gap-1 text-slate-600">
              <Mic size={12} className="text-[#2667ff]" />
              {webinar.name || webinar.host}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {webinar.time || "Upcoming"}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {webinar.viewers || "0 registered"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        {webinar.url && (
          <a
            href={webinar.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold hover:bg-[#EEF3FF] hover:text-[#2667ff] transition-all"
          >
            <ExternalLink size={13} />
            Visit Link
          </a>
        )}
        <button
          onClick={handleDelete}
          title="Delete Webinar"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function WebinarsAdminPage() {
  const router = useRouter();
  const toast = useToast();
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const STATUSES = ["ALL", "UPCOMING", "LIVE", "RECORDED"];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getWebinarsApi();
        setWebinars(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = webinars.filter((w) => {
    const matchSearch = [w.title, w.name, w.host, w.category].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = statusFilter === "ALL" || w.status?.toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    try {
      await deleteWebinarApi(id);
      setWebinars((prev) => prev.filter((w) => (w._id || w.id) !== id));
      toast("🗑️ Webinar deleted successfully");
    } catch (err) {
      console.error(err);
      toast("❌ Failed to delete webinar");
    }
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Live & Upcoming Webinars"
        subtitle={`${webinars.length} webinars registered in the database`}
        action={
          <Btn onClick={() => router.push("/admin/add-webinar")}>
            <Plus size={14} /> Add Webinar
          </Btn>
        }
      />

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              statusFilter === s
                ? "bg-[#2667ff] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          type="text"
          placeholder="Search webinars by title, speaker, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-[16px] pl-10 pr-4 py-3 text-[13px] font-medium outline-none focus:border-[#2667ff] transition-all placeholder:text-slate-300 shadow-sm"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-3xl mb-3 animate-spin">⏳</div>
          <p className="font-bold text-sm">Loading webinars from backend...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((w, i) => (
              <WebinarAdminCard
                key={w._id || w.id || i}
                webinar={w}
                onDelete={handleDelete}
                index={i}
              />
            ))
          ) : (
            <div className="text-center py-20 text-slate-400 bg-white border border-slate-100 rounded-[24px]">
              <div className="text-4xl mb-3">🎥</div>
              <p className="font-bold text-sm">No webinars found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="mt-3 text-[#2667ff] text-[12px] font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
