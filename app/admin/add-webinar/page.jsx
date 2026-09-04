"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, RotateCcw, CheckCircle, Video, Mic, CalendarDays, Play, Clock, Users, ExternalLink } from "lucide-react";
import {
  PageHeader, FormCard, FormGroup, Input, Select, Textarea,
  Btn, ToastProvider, useToast,
} from "../../../admin-compo/AdminUi";
import { createWebinarApi } from "../../../lib/webinarApi";

const STATUS_OPTIONS = ["UPCOMING", "LIVE", "RECORDED"];
const CATEGORY_OPTIONS = ["Engineering", "Medical", "Management", "Admissions", "Scholarship", "Law", "Design", "Study Abroad", "General"];
const POPULAR_ICONS = ["🎯", "🔬", "📝", "🏆", "⚙️", "💼", "📚", "✈️", "💰", "⚖️", "🎓", "🚀"];

const EMPTY_FORM = {
  title: "",
  name: "",
  url: "",
  status: "UPCOMING",
  category: "Engineering",
  time: "Tomorrow · 5:00 PM",
  viewers: "500+ registered",
  icon: "🎯",
  description: "",
};

export default function AddWebinarPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setIcon = (emoji) =>
    setForm((prev) => ({ ...prev, icon: emoji }));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast("⚠️ Webinar title is required!");
      return;
    }
    if (!form.name.trim()) {
      toast("⚠️ Speaker / Host name is required!");
      return;
    }
    if (!form.url.trim()) {
      toast("⚠️ Webinar URL is required!");
      return;
    }

    setSaving(true);
    try {
      await createWebinarApi(form);
      setSaved(true);
      toast("🎉 Webinar published successfully!");
      setTimeout(() => {
        router.push("/admin/webinars");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast(`❌ ${err.message || "Failed to publish webinar"}`);
    } finally {
      setSaving(false);
    }
  };

  const isLive = form.status === "LIVE";
  const isUpcoming = form.status === "UPCOMING";
  const isRecorded = form.status === "RECORDED";

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Add New Webinar"
        subtitle="Schedule live webinars, expert sessions, and recordings"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form fields */}
        <div className="xl:col-span-2">
          <FormCard title="Webinar Details" index={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormGroup label="Webinar Title *" full>
                <Input
                  placeholder="e.g. IIT JEE 2025 Comprehensive Strategy"
                  value={form.title}
                  onChange={set("title")}
                />
              </FormGroup>

              <FormGroup label="Speaker / Host Name *">
                <Input
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={form.name}
                  onChange={set("name")}
                />
              </FormGroup>

              <FormGroup label="Status">
                <Select
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={set("status")}
                />
              </FormGroup>

              <FormGroup label="Webinar Link / URL *" full>
                <Input
                  placeholder="e.g. https://meet.google.com/xyz or https://collegy.in/register"
                  value={form.url}
                  onChange={set("url")}
                />
              </FormGroup>

              <FormGroup label="Schedule / Timing">
                <Input
                  placeholder="e.g. Tomorrow · 5:00 PM or Live now"
                  value={form.time}
                  onChange={set("time")}
                />
              </FormGroup>

              <FormGroup label="Registered / Viewers Count">
                <Input
                  placeholder="e.g. 850 registered or 1.2K watching"
                  value={form.viewers}
                  onChange={set("viewers")}
                />
              </FormGroup>

              <FormGroup label="Category">
                <Select
                  options={CATEGORY_OPTIONS}
                  value={form.category}
                  onChange={set("category")}
                />
              </FormGroup>

              <FormGroup label="Icon / Emoji">
                <div className="flex items-center gap-2">
                  <Input
                    className="!w-24 text-center text-lg"
                    value={form.icon}
                    onChange={set("icon")}
                  />
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_ICONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setIcon(emoji)}
                        className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
                          form.icon === emoji
                            ? "bg-[#2667ff] text-white border-[#2667ff] scale-110"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </FormGroup>

              <FormGroup label="Description (Optional)" full>
                <Textarea
                  placeholder="Brief summary of what students will learn during this session…"
                  value={form.description}
                  onChange={set("description")}
                  rows={4}
                />
              </FormGroup>
            </div>
          </FormCard>

          <div className="flex items-center gap-3">
            <Btn
              onClick={handleSubmit}
              disabled={saving}
              className={saved ? "!bg-emerald-500" : ""}
            >
              {saved ? (
                <><CheckCircle size={14} /> Published!</>
              ) : saving ? (
                "Publishing..."
              ) : (
                <><Send size={14} /> Publish Webinar</>
              )}
            </Btn>
            <Btn variant="ghost" onClick={() => setForm(EMPTY_FORM)}>
              <RotateCcw size={14} /> Reset
            </Btn>
            <Btn variant="ghost" onClick={() => router.push("/admin/webinars")}>
              ← All Webinars
            </Btn>
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <div className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400 mb-3">
              Dashboard Card Preview
            </div>

            <div className="bg-[#3D6BE8]/10 p-6 rounded-[2.5rem] border-2 border-zinc-100 shadow-xl flex items-center justify-center">
              <div className="w-64 bg-white rounded-[2rem] p-5 border-2 border-[#3D6BE8]/50 shadow-lg">
                {/* Top: icon + status badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0 mr-2">
                    <span className="text-xl shrink-0 mt-0.5">{form.icon || "🎯"}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-zinc-900 leading-tight line-clamp-2">
                        {form.title || "Webinar Headline"}
                      </p>
                      <p className="text-[9px] text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
                        <Mic size={7} />
                        {form.name || "Speaker Name"}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black shrink-0 ${
                      isLive
                        ? "bg-red-100 text-red-500"
                        : isUpcoming
                        ? "bg-[#3D6BE8]/10 text-[#3D6BE8]"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {isLive && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                      </span>
                    )}
                    {isUpcoming && <CalendarDays size={8} />}
                    {isRecorded && <Play size={8} />}
                    {form.status}
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400">
                    <span className="flex items-center gap-0.5">
                      <Users size={8} /> {form.viewers || "500+ registered"}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={8} /> {form.time || "Upcoming"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded-full text-[9px] font-black transition-all hover:opacity-85 ${
                      isLive
                        ? "bg-red-500 text-white"
                        : isUpcoming
                        ? "bg-[#3D6BE8] text-white"
                        : "bg-zinc-900 text-white"
                    }`}
                  >
                    {isLive ? "Join" : isUpcoming ? "Register" : "Watch"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Helper */}
            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-[16px] p-5">
              <div className="text-[10px] font-black uppercase tracking-[.1em] text-blue-600 mb-2">
                Pro Tip
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                When students click <strong>Register</strong>, <strong>Join</strong>, or <strong>Watch</strong> on the home dashboard marquee, they are directed straight to your designated webinar link!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
