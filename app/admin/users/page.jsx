"use client";

import { useState } from "react";
import { UserX, Mail, Phone, Shield } from "lucide-react";
import {
  PageHeader, TableWrap, AnimRow, Chip, Btn,
  Modal, ModalRow, ToastProvider, useToast, StatCard,
} from "../../../admin-compo/AdminUi";
import { USERS_DATA } from "../../../data/adminData";
import { Users } from "lucide-react";
 
function statusChip(status) {
  return <Chip label={status} color={status === "Active" ? "green" : "gray"} />;
}

function roleChip(role) {
  return <Chip label={role} color={role === "Student" ? "blue" : "purple"} />;
}

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState(USERS_DATA);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = [u.name, u.email, u.phone].some((f) => f.toLowerCase().includes(q));
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)
    );
    toast("🔄 User status updated");
  };

  const ROLES = ["All", "Student", "Parent"];
  const counts = {
    All: users.length,
    Student: users.filter((u) => u.role === "Student").length,
    Parent: users.filter((u) => u.role === "Parent").length,
    Active: users.filter((u) => u.status === "Active").length,
  };

  return (
    <>
      <ToastProvider />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard icon={<Users size={18} />} value={users.length} label="Total Users" colorClass="blue" delay={0} />
        <StatCard icon={<Users size={18} />} value={counts.Active} label="Active" colorClass="green" delay={0.08} />
        <StatCard icon={<Users size={18} />} value={counts.Student} label="Students" colorClass="purple" delay={0.16} />
        <StatCard icon={<Users size={18} />} value={counts.Parent} label="Parents" colorClass="amber" delay={0.24} />
      </div>


      <PageHeader
        title="Registered Users"
        subtitle="All students and parents signed up on Collegy"
        action={
          <button
            onClick={() => toast("📥 Export feature coming soon!")}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-slate-50 transition-all"
          >
            Export CSV
          </button>
        }
      />

      {/* Role filters */}
      <div className="flex items-center gap-2 mb-5">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
              roleFilter === r
                ? "bg-[#2667ff] text-white shadow-md shadow-blue-100"
                : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {r}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${roleFilter === r ? "bg-white/20" : "bg-slate-100"}`}>
              {counts[r]}
            </span>
          </button>
        ))}
      </div>

      <TableWrap
        searchPlaceholder="Search by name, email, phone…"
        onSearch={setSearch}
        headers={["#", "Name", "Email", "Phone", "Role", "Joined", "Status", "Actions"]}
      >
        {filtered.map((u, i) => (
          <AnimRow key={u.id} index={i}>
            <td className="px-5 py-4 text-[12px] text-slate-400 font-bold">{i + 1}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EEF3FF] flex items-center justify-center text-[#2667ff] text-[11px] font-black flex-shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <span className="font-bold text-[13px] text-slate-800 whitespace-nowrap">{u.name}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-500">{u.email}</td>
            <td className="px-5 py-4 text-[12px] text-slate-600">{u.phone}</td>
            <td className="px-5 py-4">{roleChip(u.role)}</td>
            <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">{u.joined}</td>
            <td className="px-5 py-4">{statusChip(u.status)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(u)}>View</Btn>
                <Btn
                  size="sm"
                  variant={u.status === "Active" ? "danger" : "success"}
                  onClick={() => toggleStatus(u.id)}
                >
                  {u.status === "Active" ? (
                    <><UserX size={10} /> Block</>
                  ) : (
                    <><Shield size={10} /> Activate</>
                  )}
                </Btn>
              </div>
            </td>
          </AnimRow>
        ))}
      </TableWrap>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
        {selected && (
          <div>
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#EEF3FF] flex items-center justify-center text-[#2667ff] text-[22px] font-black">
                {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
            </div>
            <div className="flex justify-center gap-2 mb-6">
              {roleChip(selected.role)}
              {statusChip(selected.status)}
            </div>
            <ModalRow label="Email" value={selected.email} />
            <ModalRow label="Phone" value={selected.phone} />
            <ModalRow label="Role" value={selected.role} />
            <ModalRow label="Joined" value={selected.joined} />
            <ModalRow label="Status" value={selected.status} />
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 bg-[#EEF3FF] text-[#2667ff] px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#2667ff] hover:text-white transition-all"
              >
                <Mail size={13} /> Send Email
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Phone size={13} /> Call
              </a>
              <Btn
                size="sm"
                variant={selected.status === "Active" ? "danger" : "success"}
                onClick={() => { toggleStatus(selected.id); setSelected(null); }}
              >
                {selected.status === "Active" ? "Block User" : "Activate User"}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

