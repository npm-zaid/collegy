"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Phone, Trash2, AlertTriangle } from "lucide-react";
import {
  PageHeader, TableWrap, AnimRow, Btn,
  Modal, ModalRow, ToastProvider, useToast,
} from "../../../admin-compo/AdminUi";
import { getToken } from "../../../lib/auth";

const API = "https://finale-beacon-backend.vercel.app";

/* ── Tiny inline confirm dialog ─────────────────────────────────────────────── */
function ConfirmModal({ open, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <div className="text-center">
          <p className="font-bold text-[14px] text-slate-800">Delete Enquiry?</p>
          <p className="text-[12px] text-slate-400 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 rounded-xl border border-slate-200 text-[12px] font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-red-500 text-white text-[12px] font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            <Trash2 size={11} />
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────────── */
export default function EnquiriesPage() {
  const toast = useToast();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);   // which id is pending delete
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState("");

  /* ── Fetch all enquiries ── */
  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res  = await fetch(`${API}/api/admin/enquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      } else {
        toast("❌ Failed to load enquiries");
      }
    } catch {
      toast("❌ Network error — could not reach server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  /* ── Confirm then delete ── */
  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const token = getToken();
      const res  = await fetch(`${API}/api/admin/enquiries/${confirmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== confirmId));
        if (selected?._id === confirmId) setSelected(null);
        toast("🗑️ Enquiry deleted");
      } else {
        toast("❌ Delete failed");
      }
    } catch {
      toast("❌ Network error");
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  /* ── Client-side search ── */
  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    return [e.name, e.phone, e.email].some((f) => f?.toLowerCase().includes(q));
  });

  return (
    <>
      <ToastProvider />

      {/* Custom confirm dialog */}
      <ConfirmModal
        open={!!confirmId}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setConfirmId(null)}
      />

      <PageHeader
        title="Enquiries"
        subtitle="All incoming enquiries submitted via the public form"
        action={
          <button
            onClick={fetchEnquiries}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-slate-50 transition-all"
          >
            ↻ Refresh
          </button>
        }
      />

      <TableWrap
        searchPlaceholder="Search by name, email, phone…"
        onSearch={setSearch}
        headers={["#", "Name", "Email", "Phone", "Submitted", "Actions"]}
      >
        {loading ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-[12px] text-slate-400">
              Loading enquiries…
            </td>
          </tr>
        ) : filtered.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-[12px] text-slate-400">
              No enquiries found.
            </td>
          </tr>
        ) : (
          filtered.map((e, i) => (
            <AnimRow key={e._id} index={i}>
              <td className="px-5 py-4 text-[12px] text-slate-400 font-bold">{i + 1}</td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EEF3FF] flex items-center justify-center text-[#2667ff] text-[11px] font-black flex-shrink-0">
                    {e.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-bold text-[13px] text-slate-800 whitespace-nowrap">{e.name}</span>
                </div>
              </td>

              <td className="px-5 py-4 text-[12px] text-slate-500">{e.email}</td>
              <td className="px-5 py-4 text-[12px] text-slate-600">{e.phone}</td>

              <td className="px-5 py-4 text-[12px] text-slate-400 whitespace-nowrap">
                {e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric",
                }) : "—"}
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Btn size="sm" variant="ghost" onClick={() => setSelected(e)}>View</Btn>
                  <Btn
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirmId(e._id)}
                  >
                    <Trash2 size={10} /> Delete
                  </Btn>
                </div>
              </td>
            </AnimRow>
          ))
        )}
      </TableWrap>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#EEF3FF] flex items-center justify-center text-[#2667ff] text-[22px] font-black">
                {selected.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            </div>

            <ModalRow label="Name"      value={selected.name}  />
            <ModalRow label="Email"     value={selected.email} />
            <ModalRow label="Phone"     value={selected.phone} />
            <ModalRow
              label="Submitted"
              value={selected.createdAt
                ? new Date(selected.createdAt).toLocaleString("en-IN")
                : "—"}
            />

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
                variant="danger"
                onClick={() => setConfirmId(selected._id)}
              >
                <Trash2 size={10} /> Delete Enquiry
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}