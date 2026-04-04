"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink } from "lucide-react";
import {
  PageHeader, TableWrap, AnimRow, Chip, Btn, Modal, ModalRow, ToastProvider, useToast,
} from "../../../admin-compo/AdminUi";
import { COLLEGES_DATA } from "../../../data/adminData";

function statusColor(category) {
  return category === "Government" ? "green" : "rose";
}

export default function CollegesPage() {
  const router = useRouter();
  const toast = useToast();
  const [colleges, setColleges] = useState(COLLEGES_DATA);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = colleges.filter((c) =>
    [c.name, c.city, c.state, c.type].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = (id, name) => {
    setColleges((prev) => prev.filter((c) => c.id !== id));
    toast(`🗑️ ${name} removed`);
  };

  const toggleFeatured = (id) => {
    setColleges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
    toast("⭐ Featured status updated");
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="College List"
        subtitle={`${filtered.length} institutes listed`}
        action={
          <Btn onClick={() => router.push("/admin/add-college")}>
            <Plus size={13} /> Add College
          </Btn>
        }
      />

      <TableWrap
        searchPlaceholder="Search by name, city, state, type…"
        onSearch={setSearch}
        headers={["Rank", "Name", "Location", "Type", "Category", "Seats", "Fee", "Featured", "Actions"]}
      >
        {filtered.map((c, i) => (
          <AnimRow key={c.id} index={i}>
            <td className="px-5 py-4">
              <span className="inline-flex items-center justify-center w-8 h-7 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg">
                #{c.rank}
              </span>
            </td>
            <td className="px-5 py-4">
              <div className="font-bold text-[13px] text-slate-800 whitespace-nowrap">{c.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{c.estd} · {c.accreditation}</div>
            </td>
            <td className="px-5 py-4 text-[12px] text-slate-500 whitespace-nowrap">
              {c.city}, {c.state}
            </td>
            <td className="px-5 py-4">
              <Chip label={c.type} color="blue" />
            </td>
            <td className="px-5 py-4">
              <Chip label={c.category} color={statusColor(c.category)} />
            </td>
            <td className="px-5 py-4 text-[12px] font-semibold text-slate-600">
              {c.seats.toLocaleString()}
            </td>
            <td className="px-5 py-4 text-[12px] font-bold text-slate-800 whitespace-nowrap">
              {c.fee}
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => toggleFeatured(c.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                  c.featured
                    ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                }`}
              >
                {c.featured ? "⭐ Yes" : "No"}
              </button>
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setSelected(c)}>
                  View
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => handleDelete(c.id, c.name)}>
                  Delete
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
            <div className="flex flex-wrap gap-2 mb-5">
              <Chip label={`#${selected.rank} Rank`} color="gray" />
              <Chip label={selected.type} color="blue" />
              <Chip label={selected.category} color={statusColor(selected.category)} />
              {selected.featured && <Chip label="⭐ Featured" color="amber" />}
            </div>
            <ModalRow label="Location" value={`${selected.city}, ${selected.state}`} />
            <ModalRow label="Established" value={selected.estd} />
            <ModalRow label="Seats" value={selected.seats.toLocaleString()} />
            <ModalRow label="Annual Fee" value={selected.fee} />
            <ModalRow label="NIRF Rank" value={selected.nirf} />
            <ModalRow label="Accreditation" value={selected.accreditation} />
            <ModalRow label="Avg Package" value={selected.placements.avg} />
            <ModalRow label="Highest Package" value={selected.placements.highest} />
            <ModalRow label="Companies" value={selected.placements.companies} />
            <ModalRow label="Exams" value={selected.exams.join(", ")} />
            <ModalRow label="Courses" value={selected.courses.join(", ")} />
            <div className="mt-4 p-4 bg-slate-50 rounded-[14px]">
              <div className="text-[10px] font-black uppercase tracking-[.1em] text-slate-400 mb-2">About</div>
              <p className="text-[13px] text-slate-600 leading-relaxed">{selected.about}</p>
            </div>
            <div className="flex gap-3 mt-5">
              <a
                href={selected.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#2667ff] text-white px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#1a50e0] transition-all"
              >
                <ExternalLink size={13} /> Visit Website
              </a>
              <Btn size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}