"use client";

import { useState, useEffect } from "react";
import { Star, X, Mail } from "lucide-react";
import { PageHeader, TableWrap, AnimRow, Chip, Btn, Modal, ModalRow, ToastProvider, useToast } from "../../../admin-compo/AdminUi";


function statusChip(status) {
  const map = { Shortlisted: "green", Pending: "amber", Rejected: "rose" };
  return <Chip label={status} color={map[status] || "gray"} />;
}

export default function InternshipsPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);


  
  useEffect(() => {
    fetch("https://finale-beacon-backend.vercel.app/api/internships")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching internships", err));
  }, []);

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = [d.fullName, d.stream, d.skill].some((f) => f && f.toLowerCase().includes(q));
    const matchFilter = filter === "All" || d.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    setData((prev) => prev.map((d) => (d._id === id ? { ...d, status } : d)));
    toast(status === "Shortlisted" ? "🎉 Applicant shortlisted!" : "❌ Application rejected");
    setSelected(null);
  };

  const FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];
  const counts = FILTERS.reduce((acc, f) => ({
    ...acc,
    [f]: f === "All" ? data.length : data.filter((d) => d.status === f).length,
  }), {});

  return (
    <>
      <ToastProvider />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Total Applications", val: data.length, bg: "bg-[#EEF3FF]", text: "text-[#2667ff]" },
          { label: "Shortlisted", val: counts.Shortlisted, bg: "bg-emerald-50", text: "text-emerald-600" },
          { label: "Pending Review", val: counts.Pending, bg: "bg-amber-50", text: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-[20px] p-5 border border-slate-100`}>
            <div className={`font-black text-[28px] tracking-tight ${s.text}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {s.val}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <PageHeader
        title="Internship Applications"
        subtitle="Students who want to intern with Collegy"
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
              filter === f
                ? "bg-[#2667ff] text-white shadow-md shadow-blue-100"
                : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {f} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] ${filter === f ? "bg-white/20" : "bg-slate-100"}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <TableWrap
        searchPlaceholder="Search by name, stream, or skill…"
        onSearch={setSearch}
        headers={["Applicant", "Stream", "Portfolio", "Skills", "Applied On", "Status", "Actions"]}
      >
        {filtered.map((d, i) => (
          <AnimRow key={d._id} index={i}>
            <td className="px-5 py-4 font-bold text-[13px] whitespace-nowrap">{d.fullName}</td>
            <td className="px-5 py-4 text-[12px] text-slate-600">{d.stream}</td>
            <td className="px-5 py-4 text-[12px] text-slate-500">
              <a href={d.portfolio} target="_blank" rel="noreferrer" className="text-[#2667ff] hover:underline">Link</a>
            </td>
            <td className="px-5 py-4">
              <div className="flex flex-wrap gap-1">
                {d.skill && d.skill.split(",").map((s) => (
                  <Chip key={s.trim()} label={s.trim()} color="purple" />
                ))}
              </div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
            <td className="px-5 py-4">{statusChip(d.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(d)}>View</Btn>
                {d.status !== "Shortlisted" && (
                  <Btn size="sm" variant="success" onClick={() => updateStatus(d._id, "Shortlisted")}>
                    <Star size={10} /> Shortlist
                  </Btn>
                )}
                {d.status !== "Rejected" && (
                  <Btn size="sm" variant="danger" onClick={() => updateStatus(d._id, "Rejected")}>
                    <X size={10} /> Reject
                  </Btn>
                )}
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.fullName || ""}>
        {selected && (
          <div>
            <div className="mb-4">{statusChip(selected.status)}</div>
            <ModalRow label="Stream" value={selected.stream} />
            <ModalRow label="Skills" value={selected.skill} />
            <ModalRow label="Portfolio" value={selected.portfolio} />
            <ModalRow label="Project" value={selected.projectDescription} />
            <ModalRow label="Applied On" value={new Date(selected.createdAt).toLocaleDateString()} />
            <div className="flex flex-wrap gap-3 mt-6">
              {selected.status !== "Shortlisted" && (
                <Btn size="sm" variant="success" onClick={() => updateStatus(selected._id, "Shortlisted")}>
                  <Star size={11} /> Shortlist
                </Btn>
              )}
              {selected.status !== "Rejected" && (
                <Btn size="sm" variant="danger" onClick={() => updateStatus(selected._id, "Rejected")}>
                  <X size={11} /> Reject
                </Btn>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}