"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, CheckCircle, Upload, X, ImagePlus } from "lucide-react";
import {
  PageHeader, FormCard, FormGroup, Input, Select, Textarea, TagsInput,
  Btn, ToastProvider, useToast,
} from "../../../admin-compo/AdminUi";

const TYPE_OPTIONS = ["IIT", "NIT", "IIM", "AIIMS", "University", "College", "Institute", "Deemed"];
const CAT_OPTIONS = ["Government", "Private"];
const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Himachal Pradesh", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal",
];

const EMPTY = {
  name: "", rank: "", type: "", category: "", state: "", city: "",
  estd: "", seats: "", fee: "", nirf: "", accreditation: "", website: "",
  about: "", avgPackage: "", highestPackage: "", companies: "", featured: false,
};

export default function AddCollegePage() {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [saved, setSaved] = useState(false);

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  // ── Image handlers ──
  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("⚠️ Please upload a valid image file!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("⚠️ Image must be under 5MB!");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => handleImageChange(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save ──
  const handleSave = () => {
    if (!form.name.trim() || !form.rank) {
      toast("⚠️ College name and rank are required!");
      return;
    }
    const college = {
      id: Date.now(),
      name: form.name, rank: +form.rank, featured: form.featured,
      type: form.type || "College", state: form.state || "India",
      city: form.city || "—", courses,
      seats: +form.seats || 0, fee: form.fee || "—",
      category: form.category || "Private", estd: +form.estd || 2020,
      about: form.about,
      accreditation: form.accreditation || "—",
      nirf: +form.nirf || 0,
      website: form.website || "#",
      exams,
      image: imageFile ? imageFile.name : null, // Replace with uploaded URL from API
      placements: {
        avg: form.avgPackage || "—",
        highest: form.highestPackage || "—",
        companies: +form.companies || 0,
      },
    };
    console.log("New College:", college);
    setSaved(true);
    toast(`✅ ${form.name} added successfully!`);
    setTimeout(() => { setSaved(false); handleReset(); }, 2000);
  };

  const handleReset = () => {
    setForm(EMPTY);
    setCourses([]);
    setExams([]);
    removeImage();
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Add New College"
        subtitle="Fill in all the details to list a new institute"
      />

      {/* ── College Image Upload ── */}
      <FormCard title="College Image" index={0}>
        <div className="flex flex-col sm:flex-row gap-6 items-start">

          {/* Drop zone / upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            className={`relative flex-1 min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer select-none
              ${imagePreview
                ? "border-transparent cursor-default p-0 overflow-hidden"
                : isDragging
                  ? "border-[#2667ff] bg-[#EEF3FF] scale-[1.01]"
                  : "border-slate-200 bg-slate-50 hover:border-[#2667ff] hover:bg-[#EEF3FF]/50"
              }`}
          >
            {imagePreview ? (
              <>
                {/* Preview image */}
                <img
                  src={imagePreview}
                  alt="College preview"
                  className="w-full h-[220px] object-cover rounded-2xl"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="bg-white text-slate-700 text-[12px] font-bold px-4 py-2 rounded-xl mr-2 hover:bg-slate-100 transition-all"
                  >
                    Change
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="bg-rose-500 text-white text-[12px] font-bold px-4 py-2 rounded-xl hover:bg-rose-600 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${isDragging ? "bg-[#2667ff] text-white" : "bg-slate-200 text-slate-400"}`}>
                  <ImagePlus size={22} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-slate-600">
                    {isDragging ? "Drop image here" : "Click or drag & drop"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP • Max 5MB</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2667ff] text-white text-[12px] font-bold rounded-xl hover:bg-[#1a54e8] transition-all"
                >
                  <Upload size={13} />
                  Browse File
                </button>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* Thumbnail + file info panel — only shown after upload */}
          {imagePreview && (
            <div className="flex flex-col gap-3 sm:w-[200px]">
              {/* Thumbnail card */}
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img
                  src={imagePreview}
                  alt="Thumbnail"
                  className="w-full h-[120px] object-cover"
                />
              </div>
              {/* File info */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">File Info</p>
                <p className="text-[12px] font-bold text-slate-700 truncate">{imageFile?.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : ""}
                </p>
              </div>
              {/* Remove button */}
              <button
                onClick={removeImage}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-rose-200 text-rose-500 text-[12px] font-bold hover:bg-rose-50 transition-all"
              >
                <X size={13} /> Remove Image
              </button>
            </div>
          )}
        </div>
      </FormCard>

      {/* Basic Info */}
      <FormCard title="Basic Information" index={1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="College Name *">
            <Input placeholder="e.g. IIT Bombay" value={form.name} onChange={set("name")} />
          </FormGroup>
          <FormGroup label="Rank *">
            <Input placeholder="e.g. 1" type="number" value={form.rank} onChange={set("rank")} />
          </FormGroup>
          <FormGroup label="Type *">
            <Select options={TYPE_OPTIONS} value={form.type} onChange={set("type")} placeholder="Select Type" />
          </FormGroup>
          <FormGroup label="Category *">
            <Select options={CAT_OPTIONS} value={form.category} onChange={set("category")} placeholder="Select Category" />
          </FormGroup>
          <FormGroup label="State *">
            <Select options={STATES} value={form.state} onChange={set("state")} placeholder="Select State" />
          </FormGroup>
          <FormGroup label="City *">
            <Input placeholder="e.g. Mumbai" value={form.city} onChange={set("city")} />
          </FormGroup>
          <FormGroup label="Established Year">
            <Input placeholder="e.g. 1958" type="number" value={form.estd} onChange={set("estd")} />
          </FormGroup>
          <FormGroup label="Total Seats">
            <Input placeholder="e.g. 1050" type="number" value={form.seats} onChange={set("seats")} />
          </FormGroup>
          <FormGroup label="Annual Fee">
            <Input placeholder="e.g. ₹2,18,000" value={form.fee} onChange={set("fee")} />
          </FormGroup>
          <FormGroup label="NIRF Rank">
            <Input placeholder="e.g. 3" type="number" value={form.nirf} onChange={set("nirf")} />
          </FormGroup>
          <FormGroup label="Accreditation">
            <Input placeholder="e.g. NAAC A++" value={form.accreditation} onChange={set("accreditation")} />
          </FormGroup>
          <FormGroup label="Official Website">
            <Input placeholder="https://www.iitb.ac.in" value={form.website} onChange={set("website")} />
          </FormGroup>
        </div>
      </FormCard>

      {/* Courses & Exams */}
      <FormCard title="Courses & Entrance Exams" index={2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Courses Offered (press Enter to add)" full>
            <TagsInput tags={courses} setTags={setCourses} placeholder="e.g. Engineering" />
          </FormGroup>
          <FormGroup label="Entrance Exams (press Enter to add)" full>
            <TagsInput tags={exams} setTags={setExams} placeholder="e.g. JEE Advanced" />
          </FormGroup>
        </div>
      </FormCard>

      {/* Placements */}
      <FormCard title="Placements & Additional Info" index={3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Average Package">
            <Input placeholder="e.g. ₹21 LPA" value={form.avgPackage} onChange={set("avgPackage")} />
          </FormGroup>
          <FormGroup label="Highest Package">
            <Input placeholder="e.g. ₹2.8 CPA" value={form.highestPackage} onChange={set("highestPackage")} />
          </FormGroup>
          <FormGroup label="Companies Visited">
            <Input placeholder="e.g. 450" type="number" value={form.companies} onChange={set("companies")} />
          </FormGroup>
          <FormGroup label="Featured Status">
            <label className="flex items-center gap-3 mt-1 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={form.featured} onChange={set("featured")} />
                <div className={`w-11 h-6 rounded-full transition-all duration-200 ${form.featured ? "bg-amber-500" : "bg-slate-200"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.featured ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-[13px] font-semibold text-slate-700">
                {form.featured ? "⭐ Mark as Featured" : "Not Featured"}
              </span>
            </label>
          </FormGroup>
          <FormGroup label="About the College" full>
            <Textarea
              placeholder="Brief description of the institute, its strengths, legacy..."
              value={form.about}
              onChange={set("about")}
              rows={4}
            />
          </FormGroup>
        </div>
      </FormCard>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Btn onClick={handleSave} className={saved ? "!bg-emerald-500" : ""}>
          {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save College</>}
        </Btn>
        <Btn variant="ghost" onClick={handleReset}>
          <RotateCcw size={13} /> Reset Form
        </Btn>
        <Btn variant="ghost" onClick={() => router.push("/admin/colleges")}>
          ← Back to List
        </Btn>
      </div>
    </>
  );
}