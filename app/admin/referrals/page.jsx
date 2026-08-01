"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, CheckCircle, XCircle } from "lucide-react";
import { PageHeader, TableWrap, AnimRow, Chip, Btn, Modal, ModalRow, ToastProvider, useToast } from "../../../admin-compo/AdminUi";

function statusChip(status) {
  if (status === "pending") return <Chip label="Pending" color="amber" />;
  if (status === "contacted") return <Chip label="Contacted" color="blue" />;
  if (status === "enrolled") return <Chip label="Enrolled" color="green" />;
  if (status === "rejected") return <Chip label="Rejected" color="red" />;
  return <Chip label={status} color="gray" />;
}

export default function ReferralsPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const API_URL = "https://finale-beacon-backend.vercel.app";

  useEffect(() => {
    fetch(`${API_URL}/api/referrals`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching referrals", err));
  }, []);

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = [r.agentName, r.studentName, r.course].some((f) => f && f.toLowerCase().includes(q));
    const matchFilter = filter === "All" || r.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    fetch(`${API_URL}/api/referrals/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
          toast(`✅ Status updated to ${status}`);
          setSelected(null);
        }
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        toast("❌ Failed to update status");
      });
  };

  const FILTERS = ["All", "Pending", "Contacted", "Enrolled", "Rejected"];
  const counts = {
    All: data.length,
    Pending: data.filter((d) => d.status === "pending").length,
    Contacted: data.filter((d) => d.status === "contacted").length,
    Enrolled: data.filter((d) => d.status === "enrolled").length,
    Rejected: data.filter((d) => d.status === "rejected").length,
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Agent Referrals"
        subtitle="Manage student referrals submitted by agents"
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
        searchPlaceholder="Search by agent, student or course..."
        onSearch={setSearch}
        headers={["Agent Name", "Student Name", "Course", "Date", "Status", "Actions"]}
      >
        {filtered.map((r, i) => (
          <AnimRow key={r._id} index={i}>
            <td className="px-5 py-4 text-[12px] text-slate-700 font-bold">{r.agentName}</td>
            <td className="px-5 py-4 text-[12px] text-slate-700 font-bold">{r.studentName}</td>
            <td className="px-5 py-4 text-[12px] text-slate-500">{r.course}</td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
            <td className="px-5 py-4">{statusChip(r.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(r)}>View</Btn>
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold">No referrals match your search.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Referral Details">
        {selected && (
          <div>
            <div className="mb-4">{statusChip(selected.status)}</div>
            <ModalRow label="Agent Name" value={selected.agentName} />
            <ModalRow label="Agent Contact" value={selected.agentContact} />
            <ModalRow label="Student Name" value={selected.studentName} />
            <ModalRow label="Student Contact" value={selected.studentContact} />
            <ModalRow label="Course" value={selected.course} />
            <ModalRow label="Submitted On" value={new Date(selected.createdAt).toLocaleString()} />
            
            <div className="h-[1px] w-full bg-slate-100 my-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Update Status</p>

            <div className="flex flex-wrap gap-3">
              {selected.status === "pending" && (
                <Btn size="sm" variant="blue" onClick={() => updateStatus(selected._id, "contacted")}>
                  <Phone size={13} /> Mark Contacted
                </Btn>
              )}
              {(selected.status === "pending" || selected.status === "contacted") && (
                <Btn size="sm" variant="success" onClick={() => updateStatus(selected._id, "enrolled")}>
                  <CheckCircle size={13} /> Enrolled
                </Btn>
              )}
              {selected.status !== "rejected" && selected.status !== "enrolled" && (
                <Btn size="sm" variant="rose" onClick={() => updateStatus(selected._id, "rejected")}>
                  <XCircle size={13} /> Reject
                </Btn>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
               <a
                href={`tel:${selected.studentContact}`}
                className="flex items-center gap-2 bg-[#EEF3FF] text-[#2667ff] px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#2667ff] hover:text-white transition-all"
              >
                <Phone size={13} /> Call Student
              </a>
               <a
                href={`tel:${selected.agentContact}`}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Phone size={13} /> Call Agent
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
