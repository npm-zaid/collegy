"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Mail, Phone } from "lucide-react";
import {
  PageHeader, TableWrap, AnimRow, Chip, Btn,
  Modal, ModalRow, ToastProvider, useToast, StatCard,
} from "../../../admin-compo/AdminUi";
import { LOAN_DATA } from "../../../data/adminData";

import { CreditCard } from "lucide-react";

function statusChip(status) {
  const map = { Approved: "green", Reviewing: "blue", Pending: "amber", Rejected: "rose" };
  return <Chip label={status} color={map[status] || "gray"} />;
}

export default function LoansPage() {
  const toast = useToast();
  const [data, setData] = useState(LOAN_DATA);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = data.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = [l.name, l.email, l.college].some((f) => f.toLowerCase().includes(q));
    const matchFilter = filter === "All" || l.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    setData((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast(`✅ Loan ${status.toLowerCase()}!`);
    setSelected(null);
  };

  const FILTERS = ["All", "Pending", "Reviewing", "Approved", "Rejected"];
  const counts = FILTERS.reduce((acc, f) => ({
    ...acc,
    [f]: f === "All" ? data.length : data.filter((d) => d.status === f).length,
  }), {});

  const totalAmount = data
    .filter((l) => l.status === "Approved")
    .reduce((sum, l) => sum + parseInt(l.amount.replace(/[₹,]/g, "")), 0);

  return (
    <>
      <ToastProvider />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard icon={<CreditCard size={18} />} value={data.length} label="Total Requests" colorClass="blue" delay={0} />
        <StatCard icon={<CreditCard size={18} />} value={counts.Pending} label="Pending" colorClass="amber" delay={0.08} />
        <StatCard icon={<CreditCard size={18} />} value={counts.Approved} label="Approved" colorClass="green" delay={0.16} />
        <StatCard icon={<CreditCard size={18} />} value={`₹${(totalAmount / 100000).toFixed(1)}L`} label="Approved Amount" colorClass="purple" delay={0.24} />
      </div>

      <PageHeader
        title="Education Loan Requests"
        subtitle="Students seeking financial assistance for college"
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
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
        searchPlaceholder="Search by name, email, college…"
        onSearch={setSearch}
        headers={["Name", "Email", "College Applied", "Loan Amount", "Bank Pref.", "Date", "Status", "Actions"]}
      >
        {filtered.map((l, i) => (
          <AnimRow key={l.id} index={i}>
            <td className="px-5 py-4 font-bold text-[13px]">{l.name}</td>
            <td className="px-5 py-4 text-[12px] text-slate-500">{l.email}</td>
            <td className="px-5 py-4 text-[12px] text-slate-600">{l.college}</td>
            <td className="px-5 py-4">
              <span className="text-[13px] font-black text-[#2667ff]">{l.amount}</span>
            </td>
            <td className="px-5 py-4">
              <Chip label={l.bank} color="gray" />
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{l.date}</td>
            <td className="px-5 py-4">{statusChip(l.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(l)}>View</Btn>
                {l.status !== "Approved" && (
                  <Btn size="sm" variant="success" onClick={() => updateStatus(l.id, "Approved")}>
                    <CheckCircle size={11} /> Approve
                  </Btn>
                )}
                {l.status !== "Rejected" && (
                  <Btn size="sm" variant="danger" onClick={() => updateStatus(l.id, "Rejected")}>
                    <XCircle size={11} /> Reject
                  </Btn>
                )}
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Loan — ${selected?.name}`}>
        {selected && (
          <div>
            <div className="mb-4">{statusChip(selected.status)}</div>
            <ModalRow label="Email" value={selected.email} />
            <ModalRow label="College Applied" value={selected.college} />
            <ModalRow label="Loan Amount" value={selected.amount} />
            <ModalRow label="Bank Preference" value={selected.bank} />
            <ModalRow label="Requested On" value={selected.date} />
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 bg-[#EEF3FF] text-[#2667ff] px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#2667ff] hover:text-white transition-all">
                <Mail size={13} /> Email Student
              </a>
              {selected.status !== "Approved" && (
                <Btn size="sm" variant="success" onClick={() => updateStatus(selected.id, "Approved")}>Approve</Btn>
              )}
              {selected.status !== "Rejected" && (
                <Btn size="sm" variant="danger" onClick={() => updateStatus(selected.id, "Rejected")}>Reject</Btn>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}