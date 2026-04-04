"use client";

import { useState } from "react";
import { CalendarCheck, CheckCheck, Phone, Mail } from "lucide-react";
import {
  PageHeader, TableWrap, AnimRow, Chip, Btn,
  Modal, ModalRow, ToastProvider, useToast,
} from  "../../../admin-compo/AdminUi";
import { CONSULT_DATA } from "../../../data/adminData";


function statusChip(status) {
  if (status === "Pending") return <Chip label="Pending" color="amber" />;
  if (status === "Scheduled") return <Chip label="Scheduled" color="blue" />;
  if (status === "Done") return <Chip label="Done" color="green" />;
  return <Chip label={status} color="gray" />;
}

export default function ConsultationsPage() {
  const toast = useToast();
  const [data, setData] = useState(CONSULT_DATA);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = data.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = [c.name, c.email, c.interest].some((f) => f.toLowerCase().includes(q));
    const matchFilter = filter === "All" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    setData((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast(`✅ Status updated to ${status}`);
    setSelected(null);
  };

  const FILTERS = ["All", "Pending", "Scheduled", "Done"];
  const counts = {
    All: data.length,
    Pending: data.filter((d) => d.status === "Pending").length,
    Scheduled: data.filter((d) => d.status === "Scheduled").length,
    Done: data.filter((d) => d.status === "Done").length,
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Consultation Requests"
        subtitle="Students and parents who booked 1:1 counselling"
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
            {f}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black ${filter === f ? "bg-white/20" : "bg-slate-100"}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <TableWrap
        searchPlaceholder="Search by name, email, or interest…"
        onSearch={setSearch}
        headers={["Name", "Email", "Phone", "Interested In", "Date", "Status", "Actions"]}
      >
        {filtered.map((c, i) => (
          <AnimRow key={c.id} index={i}>
            <td className="px-5 py-4">
              <div className="font-bold text-[13px]">{c.name}</div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-500">{c.email}</td>
            <td className="px-5 py-4 text-[12px] text-slate-600">{c.phone}</td>
            <td className="px-5 py-4">
              <Chip label={c.interest} color="blue" />
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{c.date}</td>
            <td className="px-5 py-4">{statusChip(c.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(c)}>View</Btn>
                {c.status === "Pending" && (
                  <Btn size="sm" variant="success" onClick={() => updateStatus(c.id, "Scheduled")}>
                    <CalendarCheck size={11} /> Schedule
                  </Btn>
                )}
                {c.status === "Scheduled" && (
                  <Btn size="sm" variant="amber" onClick={() => updateStatus(c.id, "Done")}>
                    <CheckCheck size={11} /> Done
                  </Btn>
                )}
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold">No consultations match your search.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
        {selected && (
          <div>
            <div className="mb-4">{statusChip(selected.status)}</div>
            <ModalRow label="Email" value={selected.email} />
            <ModalRow label="Phone" value={selected.phone} />
            <ModalRow label="Interested In" value={selected.interest} />
            <ModalRow label="Requested On" value={selected.date} />
            <ModalRow label="Status" value={selected.status} />
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 bg-[#EEF3FF] text-[#2667ff] px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#2667ff] hover:text-white transition-all"
              >
                <Mail size={13} /> Email
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Phone size={13} /> Call
              </a>
              {selected.status === "Pending" && (
                <Btn size="sm" variant="success" onClick={() => updateStatus(selected.id, "Scheduled")}>
                  Schedule Session
                </Btn>
              )}
              {selected.status === "Scheduled" && (
                <Btn size="sm" variant="amber" onClick={() => updateStatus(selected.id, "Done")}>
                  Mark Done
                </Btn>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}