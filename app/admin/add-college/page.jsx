"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, CheckCircle, Upload, X, ImagePlus } from "lucide-react";
import {
  PageHeader, FormCard, FormGroup, Input, Select, Textarea, TagsInput,
  Btn, ToastProvider, useToast,
} from "../../../admin-compo/AdminUi";
import { getToken } from "../../../lib/auth"; // adjust path as needed

const API = "http://localhost:5000";

const TYPE_OPTIONS = ["IIT", "NIT", "IIM", "AIIMS", "University", "College", "Institute", "Deemed"];
const CAT_OPTIONS = ["Government", "Private"];
const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Himachal Pradesh", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal",
];

const EMPTY = {
  collegeId: "", name: "", rank: "", type: "", category: "", state: "", city: "",
  estd: "", seats: "", fee: "", nirf: "", accreditation: "", website: "",
  about: "", avgPackage: "", highestPackage: "", companies: "",
  featured: false, videoLink: "",
};

export default function AddCollegePage() {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image state — supports multiple files
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  // ── Image handlers ──
  const handleImageChange = (files) => {
    const validFiles = [];
    const validPreviews = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast("⚠️ Only image files are allowed!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast(`⚠️ ${file.name} exceeds 5MB limit!`);
        return;
      }
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileInput = (e) => handleImageChange(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files);
  };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Build FormData for multipart/form-data API ──
  const buildFormData = () => {
    const fd = new FormData();

    // Simple text fields
    fd.append("collegeId", form.collegeId.trim());
    fd.append("collegeName", form.name.trim());
    fd.append("establishedYear", form.estd || "");
    fd.append("description", form.about || "");
    fd.append("videoLink", form.videoLink || "");
    fd.append("accreditation", form.accreditation || "");
    fd.append("website", form.website || "");
    fd.append("annualFee", form.fee || "");
    fd.append("totalSeats", form.seats || "");
    fd.append("type", form.type || "");
    fd.append("category", form.category || "");
    fd.append("featured", form.featured ? "true" : "false");

    // location — JSON string
    fd.append(
      "location",
      JSON.stringify({
        country: "India",
        state: form.state || "",
        city: form.city || "",
        address: "",
        pincode: "",
        coordinates: { latitude: 0, longitude: 0 },
      })
    );

    // nirfRanking — JSON string
    fd.append(
      "nirfRanking",
      JSON.stringify({
        overallRank: form.nirf ? parseInt(form.nirf) : 0,
        year: new Date().getFullYear(),
      })
    );

    // placement — JSON string
 fd.append(
  "placement",
  JSON.stringify({
    placementPercentage: 0,
    year: new Date().getFullYear(),
    highestPackage: {
      amount: form.highestPackage || "0",
      currency: "INR",
    },
    averagePackage: {
      amount: form.avgPackage || "0",
      currency: "INR",
    },
    companiesVisited: form.companies
      ? [{ name: "Various", count: parseInt(form.companies) }]
      : [],
  })
);
    // courses — JSON string array
    // TagsInput gives plain strings; wrap into objects expected by backend
    fd.append(
      "courses",
      JSON.stringify(
        courses.map((c) => ({ courseName: c, duration: "", fees: "", seats: 0 }))
      )
    );

    // collegeRatings — default empty
    fd.append(
      "collegeRatings",
      JSON.stringify({ averageRating: 0, totalReviews: 0 })
    );

    // reviews — default empty
    fd.append("reviews", JSON.stringify([]));

    // Entrance exams as comma-separated (adjust if backend expects different)
    fd.append("entranceExams", exams.join(","));

    // Images — field name MUST be "images" per API spec
    imageFiles.forEach((file) => fd.append("images", file));

    return fd;
  };

  // ── Save ──
  const handleSave = async () => {
    if (!form.collegeId.trim()) {
      toast("⚠️ College ID is required (e.g. IITB-001)!");
      return;
    }
    if (!form.name.trim()) {
      toast("⚠️ College name is required!");
      return;
    }
    if (!form.rank) {
      toast("⚠️ Rank is required!");
      return;
    }

    setLoading(true);

    try {
      const token = getToken();
      const fd = buildFormData();

      const res = await fetch(`${API}/api/admin/colleges`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ Do NOT set Content-Type — browser sets it automatically with boundary for multipart
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Show validation errors if any
        const errMsg = data.errors?.join(", ") || data.message || "Failed to add college";
        toast(`❌ ${errMsg}`);
        return;
      }

      setSaved(true);
      toast(`✅ ${form.name} added successfully!`);
      setTimeout(() => {
        setSaved(false);
        handleReset();
      }, 2000);
    } catch (err) {
      console.error("Add college error:", err);
      toast("❌ Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY);
    setCourses([]);
    setExams([]);
    clearAllImages();
  };

  return (
    <>
      <ToastProvider />
      <PageHeader
        title="Add New College"
        subtitle="Fill in all the details to list a new institute"
      />

      {/* ── College Image Upload ── */}
      <FormCard title="College Images" index={0}>
        <div className="flex flex-col gap-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative min-h-[160px] rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer select-none
              ${isDragging
                ? "border-[#2667ff] bg-[#EEF3FF] scale-[1.01]"
                : "border-slate-200 bg-slate-50 hover:border-[#2667ff] hover:bg-[#EEF3FF]/50"
              }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${isDragging ? "bg-[#2667ff] text-white" : "bg-slate-200 text-slate-400"}`}>
              <ImagePlus size={22} />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-slate-600">
                {isDragging ? "Drop images here" : "Click or drag & drop to add images"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP • Max 5MB each • Multiple allowed</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#2667ff] text-white text-[12px] font-bold rounded-xl hover:bg-[#1a54e8] transition-all"
            >
              <Upload size={13} /> Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* Image previews grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-[100px] object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => removeImage(i)}
                      className="bg-rose-500 text-white rounded-full p-1.5 hover:bg-rose-600 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[#2667ff] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {imagePreviews.length > 1 && (
            <button
              onClick={clearAllImages}
              className="self-start flex items-center gap-2 py-1.5 px-3 rounded-xl border border-rose-200 text-rose-500 text-[12px] font-bold hover:bg-rose-50 transition-all"
            >
              <X size={12} /> Clear All Images
            </button>
          )}
        </div>
      </FormCard>

      {/* Basic Info */}
      <FormCard title="Basic Information" index={1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* NEW: College ID */}
          <FormGroup label="College ID *">
            <Input placeholder="e.g. IITB-001" value={form.collegeId} onChange={set("collegeId")} />
          </FormGroup>
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
          <FormGroup label="Video Link">
            <Input placeholder="https://youtube.com/..." value={form.videoLink} onChange={set("videoLink")} />
          </FormGroup>
        </div>
      </FormCard>

      {/* Courses & Exams */}
      <FormCard title="Courses & Entrance Exams" index={2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Courses Offered (press Enter to add)" full>
            <TagsInput tags={courses} setTags={setCourses} placeholder="e.g. B.Tech Computer Science" />
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
        <Btn onClick={handleSave} disabled={loading} className={saved ? "!bg-emerald-500" : ""}>
          {saved
            ? <><CheckCircle size={13} /> Saved!</>
            : loading
              ? <>Saving…</>
              : <><Save size={13} /> Save College</>
          }
        </Btn>
        <Btn variant="ghost" onClick={handleReset} disabled={loading}>
          <RotateCcw size={13} /> Reset Form
        </Btn>
        <Btn variant="ghost" onClick={() => router.push("/admin/colleges")} disabled={loading}>
          ← Back to List
        </Btn>
      </div>
    </>
  );
}