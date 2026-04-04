"use client";

import { useState } from "react";
import { Star, X, Mail } from "lucide-react";
import {
  PageHeader, TableWrap, AnimRow, Chip, Btn,
  Modal, ModalRow, ToastProvider, useToast,
} from  "../../../admin-compo/AdminUi";
import { INTERN_DATA } from "../../../data/adminData";


function statusChip(status) {
  const map = { Shortlisted: "green", Pending: "amber", Rejected: "rose" };
  return <Chip label={status} color={map[status] || "gray"} />;
}

export default function InternshipsPage() {
  const toast = useToast();
  const [data, setData] = useState(INTERN_DATA);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = [d.name, d.email, d.college, d.skills].some((f) => f.toLowerCase().includes(q));
    const matchFilter = filter === "All" || d.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
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
        searchPlaceholder="Search by name, college, or skill…"
        onSearch={setSearch}
        headers={["Applicant", "Email", "College", "Skills", "Duration", "Applied On", "Status", "Actions"]}
      >
        {filtered.map((d, i) => (
          <AnimRow key={d.id} index={i}>
            <td className="px-5 py-4 font-bold text-[13px] whitespace-nowrap">{d.name}</td>
            <td className="px-5 py-4 text-[12px] text-slate-500">{d.email}</td>
            <td className="px-5 py-4 text-[12px] text-slate-600">{d.college}</td>
            <td className="px-5 py-4">
              <div className="flex flex-wrap gap-1">
                {d.skills.split(", ").map((s) => (
                  <Chip key={s} label={s} color="purple" />
                ))}
              </div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-600 whitespace-nowrap">{d.duration}</td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{d.date}</td>
            <td className="px-5 py-4">{statusChip(d.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(d)}>View</Btn>
                {d.status !== "Shortlisted" && (
                  <Btn size="sm" variant="success" onClick={() => updateStatus(d.id, "Shortlisted")}>
                    <Star size={10} /> Shortlist
                  </Btn>
                )}
                {d.status !== "Rejected" && (
                  <Btn size="sm" variant="danger" onClick={() => updateStatus(d.id, "Rejected")}>
                    <X size={10} /> Reject
                  </Btn>
                )}
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
        {selected && (
          <div>
            <div className="mb-4">{statusChip(selected.status)}</div>
            <ModalRow label="Email" value={selected.email} />
            <ModalRow label="College" value={selected.college} />
            <ModalRow label="Skills" value={selected.skills} />
            <ModalRow label="Preferred Duration" value={selected.duration} />
            <ModalRow label="Applied On" value={selected.date} />
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 bg-[#EEF3FF] text-[#2667ff] px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#2667ff] hover:text-white transition-all">
                <Mail size={13} /> Send Email
              </a>
              {selected.status !== "Shortlisted" && (
                <Btn size="sm" variant="success" onClick={() => updateStatus(selected.id, "Shortlisted")}>
                  <Star size={11} /> Shortlist
                </Btn>
              )}
              {selected.status !== "Rejected" && (
                <Btn size="sm" variant="danger" onClick={() => updateStatus(selected.id, "Rejected")}>
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