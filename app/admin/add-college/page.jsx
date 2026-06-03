"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, ToastProvider, useToast } from "../../../admin-compo/AdminUi";
import { getToken } from "../../../lib/auth";
import CollegeForm from "../../../admin-compo/CollegeForm";

const API = "https://finale-beacon-backend.vercel.app";

export default function AddCollegePage() {
  const router = useRouter();
  const toast  = useToast();
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const handleSubmit = async (fd) => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/admin/colleges`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(`❌ ${data.errors?.join(", ") || data.message || "Failed to add college"}`);
        return;
      }
      setSaved(true);
      toast(`✅ ${data.data.collegeName} added successfully!`);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast("❌ Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Add New College"
        subtitle="Fill in all the details to list a new institute"
      />
      <CollegeForm
        mode="add"
        onSubmit={handleSubmit}
        onBack={() => router.push("/admin/colleges")}
        loading={loading}
        saved={saved}
        toast={toast}
      />
    </>
  );
}