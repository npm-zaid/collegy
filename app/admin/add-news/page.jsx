"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, RotateCcw, CheckCircle } from "lucide-react";
import {
  PageHeader, FormCard, FormGroup, Input, Select, Textarea,
  Btn, ToastProvider, useToast,
} from  "../../../admin-compo/AdminUi";

const API = 'https://finale-beacon-backend.vercel.app';

const CATEGORIES = ["All", "Academics", "Exam", "Admission"];

const EMPTY = {
  title: "", category: "Exam",
  source: "", date: "", summary: "", url: "",
};

export default function AddNewsPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const preview = form.title || form.summary;

  const handlePublish = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      toast("⚠️ Headline and summary are required!");
      return;
    }
    const article = {
      ...form,
      date: form.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      source: form.source || "Collegy",
    };
    
    try {
      const res = await fetch(`${API}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      if (res.ok) {
        setSaved(true);
        toast("📰 News article published!");
        setTimeout(() => { setSaved(false); setForm(EMPTY); }, 2000);
      } else {
        toast("❌ Error publishing article!");
      }
    } catch (error) {
      console.error(error);
      toast("❌ Network error!");
    }
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Add News Article"
        subtitle="Publish educational updates for students"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="xl:col-span-2">
          <FormCard title="Article Details" index={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormGroup label="Headline *" full>
                <Input
                  placeholder="e.g. JEE Advanced 2025 registration opens…"
                  value={form.title}
                  onChange={set("title")}
                />
              </FormGroup>
              <FormGroup label="Category">
                <Select options={CATEGORIES} value={form.category} onChange={set("category")} />
              </FormGroup>
              <FormGroup label="Source">
                <Input placeholder="e.g. Times of India, NTA Official" value={form.source} onChange={set("source")} />
              </FormGroup>
              <FormGroup label="Publication Date">
                <Input type="date" value={form.date} onChange={set("date")} />
              </FormGroup>
              <FormGroup label="Source URL">
                <Input placeholder="https://..." value={form.url} onChange={set("url")} />
              </FormGroup>
              <FormGroup label="Summary *" full>
                <Textarea
                  placeholder="Write a brief, informative summary of the article. Keep it clear and student-friendly."
                  value={form.summary}
                  onChange={set("summary")}
                  rows={5}
                />
              </FormGroup>
            </div>
          </FormCard>

          <div className="flex items-center gap-3">
            <Btn onClick={handlePublish} className={saved ? "!bg-emerald-500" : ""}>
              {saved
                ? <><CheckCircle size={13} /> Published!</>
                : <><Send size={13} /> Publish Article</>
              }
            </Btn>
            <Btn variant="ghost" onClick={() => setForm(EMPTY)}>
              <RotateCcw size={13} /> Reset
            </Btn>
            <Btn variant="ghost" onClick={() => router.push("/admin/news")}>
              ← All News
            </Btn>
          </div>
        </div>

        {/* Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <div className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400 mb-3">Live Preview</div>
            <div className={`bg-white border rounded-[20px] p-5 transition-all duration-300 ${preview ? "border-[#2667ff]/30 shadow-md shadow-blue-50" : "border-slate-100"}`}>
              {preview ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    {form.category && (
                      <span className="bg-[#EEF3FF] text-[#2667ff] text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                        {form.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-[14px] text-slate-800 leading-snug mb-2">
                    {form.title || "Your headline will appear here"}
                  </h3>
                  {form.source && (
                    <div className="text-[11px] text-slate-400 font-semibold mb-2">
                      {form.source} · {form.date || "Today"}
                    </div>
                  )}
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {form.summary || "Your summary will appear here…"}
                  </p>
                </>
              ) : (
                <div className="text-center py-10 text-slate-300">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-[12px] font-semibold">Start typing to see preview</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-5 bg-amber-50 border border-amber-100 rounded-[16px] p-5">
              <div className="text-[10px] font-black uppercase tracking-[.1em] text-amber-600 mb-3">Writing Tips</div>
              <ul className="space-y-2">
                {[
                  "Keep headline under 80 characters",
                  "Summary should be 2–3 sentences",
                  "Include exam dates when relevant",
                  "Add official source URL for credibility",
                ].map((tip) => (
                  <li key={tip} className="text-[11px] text-amber-700 font-medium flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}