"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Plus, Trash2, ExternalLink, Search } from "lucide-react";
import { PageHeader, Chip, Btn, ToastProvider, useToast } from "../../../admin-compo/AdminUi";
import { NEWS_DATA } from "../../../data/adminData";

const API = 'https://finale-beacon-backend.vercel.app'

const CAT_COLOR_MAP = {
  "Exam": "blue",
  "Admission": "purple",
  "Academics": "green",
  "All": "gray",
};

function NewsCard({ article, onDelete, index }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: index * 0.07 }
    );
  }, [index]);

  const handleDelete = async () => {
    gsap.to(ref.current, {
      opacity: 0, x: 30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.3, ease: "power2.in",
      onComplete: () => onDelete(article._id || article.id),
    });
  };

  return (
    <div ref={ref} className="bg-white border border-slate-100 rounded-[20px] p-5 flex items-start gap-4 hover:border-[#2667ff]/30 hover:shadow-md transition-all duration-200 group">


      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Chip label={article.category} color={CAT_COLOR_MAP[article.category] || "gray"} />
          <span className="text-[10px] text-slate-400 font-semibold">{article.source}</span>
          <span className="text-[10px] text-slate-300">·</span>
          <span className="text-[10px] text-slate-400 font-semibold">{article.date}</span>
        </div>
        <h3 className="font-black text-[14px] text-slate-800 leading-snug mb-1.5">
          {article.title}
        </h3>
        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        {article.url && article.url !== "#" && (
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#EEF3FF] hover:text-[#2667ff] transition-all"
          >
            <ExternalLink size={13} />
          </a>
        )}
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const router = useRouter();
  const toast = useToast();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const CATS = ["All", "Academics", "Exam", "Admission"];

  useEffect(() => {
    fetch(`${API}/api/notifications`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setArticles(data.data);
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = articles.filter((a) => {
    const matchSearch = [a.title, a.summary, a.source].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    );
    const matchCat = catFilter === "All" || a.category === catFilter || a.tag === catFilter;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => (a._id || a.id) !== id));
        toast("🗑️ Article deleted");
      } else {
        toast("❌ Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast("❌ Network error");
    }
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Latest News"
        subtitle={`${articles.length} articles published`}
        action={
          <Btn onClick={() => router.push("/admin/add-news")}>
            <Plus size={13} /> Add News
          </Btn>
        }
      />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
              catFilter === c
                ? "bg-[#2667ff] text-white"
                : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-[16px] pl-10 pr-4 py-3 text-[13px] font-medium outline-none focus:border-[#2667ff] transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Articles */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((article, i) => (
            <NewsCard key={article._id || article.id} article={article} onDelete={handleDelete} index={i} />
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3">📰</div>
            <p className="font-bold">No articles match your search.</p>
            <button
              onClick={() => { setSearch(""); setCatFilter("All"); }}
              className="mt-3 text-[#2667ff] text-[12px] font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}