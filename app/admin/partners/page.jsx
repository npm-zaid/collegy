"use client";

import { useState, useEffect } from "react";
import { CheckCheck, X, Mail, Phone, Building2 } from "lucide-react";
import { PageHeader, TableWrap, AnimRow, Chip, Btn, Modal, ModalRow, ToastProvider, useToast } from "../../../admin-compo/AdminUi";

function statusChip(status) {
  if (status === "Pending") return <Chip label="Pending" color="amber" />;
  if (status === "Approved") return <Chip label="Approved" color="green" />;
  if (status === "Rejected") return <Chip label="Rejected" color="rose" />;
  return <Chip label={status || "Pending"} color="gray" />;
}

export default function PartnersPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("https://finale-beacon-backend.vercel.app/api/partners")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching partners", err));
  }, []);

  const filtered = data.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = [p.fullName, p.email, p.companyName].some((f) => f && f.toLowerCase().includes(q));
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    setData((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
    toast(`✅ Status updated to ${status}`);
    setSelected(null);
  };

  const FILTERS = ["All", "Pending", "Approved", "Rejected"];
  const counts = {
    All: data.length,
    Pending: data.filter((d) => d.status === "Pending").length,
    Approved: data.filter((d) => d.status === "Approved").length,
    Rejected: data.filter((d) => d.status === "Rejected").length,
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="B2B Partners"
        subtitle="Manage partner applications and agencies"
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
        searchPlaceholder="Search by name, email, or company…"
        onSearch={setSearch}
        headers={["Name", "Company", "Email", "Experience", "Volume", "Applied On", "Status", "Actions"]}
      >
        {filtered.map((p, i) => (
          <AnimRow key={p._id} index={i}>
            <td className="px-5 py-4">
              <div className="font-bold text-[13px]">{p.fullName}</div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Building2 size={12} className="text-slate-400" />
                {p.companyName}
              </div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-500">{p.email}</td>
            <td className="px-5 py-4 text-[12px] text-slate-600 whitespace-nowrap">{p.experience}</td>
            <td className="px-5 py-4">
              <Chip label={p.studentVolume} color="purple" />
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
            <td className="px-5 py-4">{statusChip(p.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(p)}>View</Btn>
                {p.status === "Pending" && (
                  <>
                    <Btn size="sm" variant="success" onClick={() => updateStatus(p._id, "Approved")}>
                      <CheckCheck size={11} /> Approve
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => updateStatus(p._id, "Rejected")}>
                      <X size={11} /> Reject
                    </Btn>
                  </>
                )}
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold">No partners match your search.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.fullName || ""}>
        {selected && (
          <div>
            <div className="mb-4">{statusChip(selected.status)}</div>
            <ModalRow label="Email" value={selected.email} />
            <ModalRow label="Company" value={selected.companyName} />
            <ModalRow label="Experience" value={selected.experience} />
            <ModalRow label="Student Volume" value={selected.studentVolume} />
            <ModalRow label="Applied On" value={new Date(selected.createdAt).toLocaleDateString()} />
            <ModalRow label="Status" value={selected.status} />
            
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 bg-[#EEF3FF] text-[#2667ff] px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#2667ff] hover:text-white transition-all"
              >
                <Mail size={13} /> Email Partner
              </a>
              {selected.status === "Pending" && (
                <>
                  <Btn size="sm" variant="success" onClick={() => updateStatus(selected._id, "Approved")}>
                    Approve
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => updateStatus(selected._id, "Rejected")}>
                    Reject
                  </Btn>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
