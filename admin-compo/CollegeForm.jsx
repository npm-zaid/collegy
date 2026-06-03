"use client";

import { useState, useRef } from "react";
import {
  Save, RotateCcw, CheckCircle, Upload, X, ImagePlus,
  Plus, Trash2, ChevronDown, ChevronUp, GraduationCap,
  Building2, MapPin, BarChart3, Star, MessageSquare,
  TrendingUp, BookOpen,
} from "lucide-react";
import {
  FormCard, FormGroup, Input, Select, Textarea, Btn,
} from "./AdminUi";

const API = "http://localhost:5000";

// ── Static options ──────────────────────────────────────────────────────────────
export const DEGREE_TYPES = ["B.Tech","M.Tech","MBA","MBBS","BDS","B.Sc","M.Sc","Ph.D","B.Arch","LLB","LLM","BBA","MCA","BCA","Diploma"];
export const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];
export const SECTORS = ["IT/Software","Finance/Banking","Core Engineering","Consulting","FMCG","Healthcare","Government/PSU","Research","Other"];
export const CURRENCIES = ["INR","USD","EUR","GBP"];
export const PACKAGE_UNITS = ["LPA","CPA","per month"];

// ── Empty templates ─────────────────────────────────────────────────────────────
export const emptyCourse = () => ({
  courseId:"", courseName:"", degreeType:"", durationYears:"", description:"",
  fees:{ totalFees:"", currency:"INR", yearlyFees:"" }, seatIntake:"",
  rankRequired:{
    general:{minRank:"",maxRank:""}, obc:{minRank:"",maxRank:""},
    sc:{minRank:"",maxRank:""}, st:{minRank:"",maxRank:""},
  },
});

export const emptyCompany = () => ({
  companyId:"", companyName:"", logo:"", sector:"",
  highestPackageOffered:{amount:"",currency:"INR",unit:"LPA"},
  averagePackageOffered:{amount:"",currency:"INR",unit:"LPA"},
  medianPackageOffered: {amount:"",currency:"INR",unit:"LPA"},
});

export const emptyReview = () => ({
  reviewId:"", userId:"", userName:"", rating:"", comment:"",
});

export const EMPTY_FORM = {
  collegeId:"", collegeName:"", establishedYear:"", description:"",
  country:"India", state:"", city:"", address:"", pincode:"", latitude:"", longitude:"",
  nirfOverallRank:"", nirfYear: new Date().getFullYear(),
  videoLink:"",
  placementPercentage:"", placementYear: new Date().getFullYear(),
  highestPackageAmount:"", highestPackageCurrency:"INR", highestPackageUnit:"LPA",
  averagePackageAmount:"", averagePackageCurrency:"INR", averagePackageUnit:"LPA",
  medianPackageAmount:"",  medianPackageCurrency:"INR",  medianPackageUnit:"LPA",
  averageRating:"", totalReviews:"",
};

/** Flatten a college document into the flat form shape */
export const collegeToForm = (c) => ({
  collegeId:           c.collegeId           || "",
  collegeName:         c.collegeName         || "",
  establishedYear:     c.establishedYear     || "",
  description:         c.description         || "",
  country:             c.location?.country   || "India",
  state:               c.location?.state     || "",
  city:                c.location?.city      || "",
  address:             c.location?.address   || "",
  pincode:             c.location?.pincode   || "",
  latitude:            c.location?.coordinates?.latitude  || "",
  longitude:           c.location?.coordinates?.longitude || "",
  nirfOverallRank:     c.nirfRanking?.overallRank || "",
  nirfYear:            c.nirfRanking?.year   || new Date().getFullYear(),
  videoLink:           c.media?.videoLink    || "",
  placementPercentage: c.placement?.placementPercentage || "",
  placementYear:       c.placement?.year || new Date().getFullYear(),
  highestPackageAmount:   c.placement?.highestPackage?.amount   || "",
  highestPackageCurrency: c.placement?.highestPackage?.currency || "INR",
  highestPackageUnit:     c.placement?.highestPackage?.unit     || "LPA",
  averagePackageAmount:   c.placement?.averagePackage?.amount   || "",
  averagePackageCurrency: c.placement?.averagePackage?.currency || "INR",
  averagePackageUnit:     c.placement?.averagePackage?.unit     || "LPA",
  medianPackageAmount:    c.placement?.medianPackage?.amount    || "",
  medianPackageCurrency:  c.placement?.medianPackage?.currency  || "INR",
  medianPackageUnit:      c.placement?.medianPackage?.unit      || "LPA",
  averageRating:       c.collegeRatings?.averageRating || "",
  totalReviews:        c.collegeRatings?.totalReviews  || "",
});

/** Build FormData from flat form + arrays */
export const buildFormData = ({ form, courses, companies, reviews, imageFiles }) => {
  const fd = new FormData();
  fd.append("collegeId",       form.collegeId.trim());
  fd.append("collegeName",     form.collegeName.trim());
  fd.append("establishedYear", form.establishedYear || "0");
  fd.append("description",     form.description || "");
  fd.append("location", JSON.stringify({
    country: form.country || "India", state: form.state || "",
    city: form.city || "", address: form.address || "", pincode: form.pincode || "",
    coordinates:{ latitude: parseFloat(form.latitude)||0, longitude: parseFloat(form.longitude)||0 },
  }));
  fd.append("nirfRanking", JSON.stringify({
    overallRank: parseInt(form.nirfOverallRank)||0,
    year: parseInt(form.nirfYear)||new Date().getFullYear(),
  }));
  fd.append("videoLink", form.videoLink || "");
  imageFiles.forEach(f => fd.append("images", f));
  fd.append("placement", JSON.stringify({
    placementPercentage: parseFloat(form.placementPercentage)||0,
    year: parseInt(form.placementYear)||new Date().getFullYear(),
    highestPackage:{ amount: parseFloat(form.highestPackageAmount)||0, currency: form.highestPackageCurrency||"INR", unit: form.highestPackageUnit||"LPA" },
    averagePackage:{ amount: parseFloat(form.averagePackageAmount)||0, currency: form.averagePackageCurrency||"INR", unit: form.averagePackageUnit||"LPA" },
    medianPackage: { amount: parseFloat(form.medianPackageAmount)||0,  currency: form.medianPackageCurrency||"INR",  unit: form.medianPackageUnit||"LPA"  },
    companiesVisited: companies.map(c=>({
      companyId: c.companyId||"", companyName: c.companyName||"", logo: c.logo||"", sector: c.sector||"",
      highestPackageOffered:{ amount: parseFloat(c.highestPackageOffered.amount)||0, currency: c.highestPackageOffered.currency||"INR", unit: c.highestPackageOffered.unit||"LPA" },
      averagePackageOffered:{ amount: parseFloat(c.averagePackageOffered.amount)||0, currency: c.averagePackageOffered.currency||"INR", unit: c.averagePackageOffered.unit||"LPA" },
      medianPackageOffered: { amount: parseFloat(c.medianPackageOffered.amount)||0,  currency: c.medianPackageOffered.currency||"INR",  unit: c.medianPackageOffered.unit||"LPA"  },
    })),
  }));
  fd.append("courses", JSON.stringify(courses.map(c=>({
    courseId: c.courseId||"", courseName: c.courseName||"", degreeType: c.degreeType||"",
    durationYears: parseFloat(c.durationYears)||0, description: c.description||"",
    fees:{ totalFees: parseFloat(c.fees.totalFees)||0, currency: c.fees.currency||"INR", yearlyFees: parseFloat(c.fees.yearlyFees)||0 },
    seatIntake: parseInt(c.seatIntake)||0,
    rankRequired:{
      general:{ minRank: parseInt(c.rankRequired.general.minRank)||0, maxRank: parseInt(c.rankRequired.general.maxRank)||0 },
      obc:    { minRank: parseInt(c.rankRequired.obc.minRank)||0,     maxRank: parseInt(c.rankRequired.obc.maxRank)||0     },
      sc:     { minRank: parseInt(c.rankRequired.sc.minRank)||0,      maxRank: parseInt(c.rankRequired.sc.maxRank)||0      },
      st:     { minRank: parseInt(c.rankRequired.st.minRank)||0,      maxRank: parseInt(c.rankRequired.st.maxRank)||0      },
    },
    courseRatings:{ averageRating:0, totalReviews:0 },
  }))));
  fd.append("collegeRatings", JSON.stringify({ averageRating: parseFloat(form.averageRating)||0, totalReviews: parseInt(form.totalReviews)||0 }));
  fd.append("reviews", JSON.stringify(reviews.map(r=>({
    reviewId: r.reviewId||"", userId: r.userId||"", userName: r.userName||"",
    rating: parseFloat(r.rating)||0, comment: r.comment||"",
    createdAt: new Date().toISOString(),
  }))));
  return fd;
};

// ── Internal helpers ────────────────────────────────────────────────────────────
function deepSet(obj, path, value) {
  const u = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");
  let ref = u;
  for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
  ref[keys[keys.length - 1]] = value;
  return u;
}

// ── Shared UI primitives ────────────────────────────────────────────────────────
export function SectionDivider({ icon: Icon, label, color = "#2667ff" }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: color + "15" }}>
        <Icon size={14} style={{ color }} />
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

export function PackageRow({ label, amount, currency, unit, onAmount, onCurrency, onUnit }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-4">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">{label}</label>
        <Input type="number" placeholder="0" value={amount} onChange={onAmount} />
      </div>
      <div className="col-span-4">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">Currency</label>
        <Select options={CURRENCIES} value={currency} onChange={onCurrency} placeholder="INR" />
      </div>
      <div className="col-span-4">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">Unit</label>
        <Select options={PACKAGE_UNITS} value={unit} onChange={onUnit} placeholder="LPA" />
      </div>
    </div>
  );
}

function RankRangeRow({ category, data, onChange }) {
  const label = { general:"General", obc:"OBC", sc:"SC", st:"ST" }[category];
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-4">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">{label}</label>
        <div className="h-9 flex items-center px-3 bg-slate-50 rounded-lg border border-slate-100 text-[12px] font-semibold text-slate-400">
          Category
        </div>
      </div>
      <div className="col-span-4">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">Min Rank</label>
        <Input type="number" placeholder="1" value={data.minRank} onChange={e=>onChange(category,"minRank",e.target.value)} />
      </div>
      <div className="col-span-4">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Rank</label>
        <Input type="number" placeholder="500" value={data.maxRank} onChange={e=>onChange(category,"maxRank",e.target.value)} />
      </div>
    </div>
  );
}

// ── CourseCard ──────────────────────────────────────────────────────────────────
function CourseCard({ course, index, onChange, onRemove }) {
  const [open, setOpen] = useState(index === 0);
  const set = (path, val) => onChange(index, deepSet(course, path, val));
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setOpen(o=>!o)}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#2667ff] text-white flex items-center justify-center text-[10px] font-black">{index+1}</div>
          <span className="text-[13px] font-bold text-slate-700">{course.courseName || `Course ${index+1}`}</span>
          {course.degreeType && <span className="px-2 py-0.5 bg-[#2667ff]/10 text-[#2667ff] text-[10px] font-bold rounded-md">{course.degreeType}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e=>{e.stopPropagation();onRemove(index)}} className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 size={13}/></button>
          {open ? <ChevronUp size={15} className="text-slate-400"/> : <ChevronDown size={15} className="text-slate-400"/>}
        </div>
      </div>
      {open && (
        <div className="p-4 flex flex-col gap-4">
          <SectionDivider icon={BookOpen} label="Course Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Course ID"><Input placeholder="BTECH-CS-001" value={course.courseId} onChange={e=>set("courseId",e.target.value)}/></FormGroup>
            <FormGroup label="Course Name *"><Input placeholder="B.Tech Computer Science" value={course.courseName} onChange={e=>set("courseName",e.target.value)}/></FormGroup>
            <FormGroup label="Degree Type"><Select options={DEGREE_TYPES} value={course.degreeType} onChange={e=>set("degreeType",e.target.value)} placeholder="Select degree"/></FormGroup>
            <FormGroup label="Duration (Years)"><Input type="number" placeholder="4" value={course.durationYears} onChange={e=>set("durationYears",e.target.value)}/></FormGroup>
            <FormGroup label="Seat Intake"><Input type="number" placeholder="120" value={course.seatIntake} onChange={e=>set("seatIntake",e.target.value)}/></FormGroup>
            <FormGroup label="Description" full><Textarea rows={2} placeholder="Course overview…" value={course.description} onChange={e=>set("description",e.target.value)}/></FormGroup>
          </div>
          <SectionDivider icon={BarChart3} label="Fees" color="#059669"/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormGroup label="Total Fees"><Input type="number" placeholder="800000" value={course.fees.totalFees} onChange={e=>set("fees.totalFees",e.target.value)}/></FormGroup>
            <FormGroup label="Yearly Fees"><Input type="number" placeholder="200000" value={course.fees.yearlyFees} onChange={e=>set("fees.yearlyFees",e.target.value)}/></FormGroup>
            <FormGroup label="Currency"><Select options={CURRENCIES} value={course.fees.currency} onChange={e=>set("fees.currency",e.target.value)} placeholder="INR"/></FormGroup>
          </div>
          <SectionDivider icon={Star} label="Rank Required (by Category)" color="#d97706"/>
          <div className="flex flex-col gap-3">
            {["general","obc","sc","st"].map(cat=>(
              <RankRangeRow key={cat} category={cat} data={course.rankRequired[cat]} onChange={(c,f,v)=>set(`rankRequired.${c}.${f}`,v)}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CompanyCard ─────────────────────────────────────────────────────────────────
function CompanyCard({ company, index, onChange, onRemove }) {
  const [open, setOpen] = useState(false);
  const set = (path, val) => onChange(index, deepSet(company, path, val));
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setOpen(o=>!o)}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">{index+1}</div>
          <span className="text-[13px] font-bold text-slate-700">{company.companyName || `Company ${index+1}`}</span>
          {company.sector && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">{company.sector}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e=>{e.stopPropagation();onRemove(index)}} className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 size={13}/></button>
          {open ? <ChevronUp size={15} className="text-slate-400"/> : <ChevronDown size={15} className="text-slate-400"/>}
        </div>
      </div>
      {open && (
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Company ID"><Input placeholder="GOOGL-001" value={company.companyId} onChange={e=>set("companyId",e.target.value)}/></FormGroup>
            <FormGroup label="Company Name *"><Input placeholder="Google" value={company.companyName} onChange={e=>set("companyName",e.target.value)}/></FormGroup>
            <FormGroup label="Sector"><Select options={SECTORS} value={company.sector} onChange={e=>set("sector",e.target.value)} placeholder="Select sector"/></FormGroup>
            <FormGroup label="Logo URL"><Input placeholder="https://…" value={company.logo} onChange={e=>set("logo",e.target.value)}/></FormGroup>
          </div>
          <SectionDivider icon={BarChart3} label="Package Details" color="#059669"/>
          <div className="flex flex-col gap-3">
            <PackageRow label="Highest Package" amount={company.highestPackageOffered.amount} currency={company.highestPackageOffered.currency} unit={company.highestPackageOffered.unit}
              onAmount={e=>set("highestPackageOffered.amount",e.target.value)} onCurrency={e=>set("highestPackageOffered.currency",e.target.value)} onUnit={e=>set("highestPackageOffered.unit",e.target.value)}/>
            <PackageRow label="Average Package" amount={company.averagePackageOffered.amount} currency={company.averagePackageOffered.currency} unit={company.averagePackageOffered.unit}
              onAmount={e=>set("averagePackageOffered.amount",e.target.value)} onCurrency={e=>set("averagePackageOffered.currency",e.target.value)} onUnit={e=>set("averagePackageOffered.unit",e.target.value)}/>
            <PackageRow label="Median Package" amount={company.medianPackageOffered.amount} currency={company.medianPackageOffered.currency} unit={company.medianPackageOffered.unit}
              onAmount={e=>set("medianPackageOffered.amount",e.target.value)} onCurrency={e=>set("medianPackageOffered.currency",e.target.value)} onUnit={e=>set("medianPackageOffered.unit",e.target.value)}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ReviewCard ──────────────────────────────────────────────────────────────────
function ReviewCard({ review, index, onChange, onRemove }) {
  const [open, setOpen] = useState(false);
  const set = (k, v) => onChange(index, { ...review, [k]: v });
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={()=>setOpen(o=>!o)}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">{index+1}</div>
          <span className="text-[13px] font-bold text-slate-700">{review.userName || `Reviewer ${index+1}`}</span>
          {review.rating && (
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s=><Star key={s} size={11} className={s<=Number(review.rating)?"fill-amber-400 text-amber-400":"fill-slate-100 text-slate-300"}/>)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e=>{e.stopPropagation();onRemove(index)}} className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 size={13}/></button>
          {open ? <ChevronUp size={15} className="text-slate-400"/> : <ChevronDown size={15} className="text-slate-400"/>}
        </div>
      </div>
      {open && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormGroup label="Review ID"><Input placeholder="REV-001" value={review.reviewId} onChange={e=>set("reviewId",e.target.value)}/></FormGroup>
          <FormGroup label="User ID"><Input placeholder="USR-123" value={review.userId} onChange={e=>set("userId",e.target.value)}/></FormGroup>
          <FormGroup label="User Name"><Input placeholder="Rahul Sharma" value={review.userName} onChange={e=>set("userName",e.target.value)}/></FormGroup>
          <FormGroup label="Rating (click stars)">
            <div className="flex items-center gap-1 h-9">
              {[1,2,3,4,5].map(s=>(
                <button key={s} type="button" onClick={()=>set("rating",s)} className="hover:scale-110 transition-transform">
                  <Star size={18} className={s<=Number(review.rating)?"fill-amber-400 text-amber-400":"fill-slate-100 text-slate-300"}/>
                </button>
              ))}
              {review.rating && <span className="ml-1 text-[12px] font-bold text-amber-500">{review.rating}/5</span>}
            </div>
          </FormGroup>
          <FormGroup label="Comment" full>
            <Textarea rows={2} placeholder="Review comment…" value={review.comment} onChange={e=>set("comment",e.target.value)}/>
          </FormGroup>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// COLLEGE FORM — the single shared form component
// Props:
//   mode         : "add" | "edit"
//   initialData  : college document (for edit mode) or undefined
//   existingImages: array of {filename, originalName} already on server (edit only)
//   onSubmit     : async (formData: FormData) => void   — called by Save button
//   onReset      : () => void                           — optional extra reset logic
//   onBack       : () => void                           — Back / Cancel button
//   loading      : bool
//   saved        : bool
// ════════════════════════════════════════════════════════════════════════════════
export default function CollegeForm({
  mode = "add",
  initialData,
  existingImages = [],
  onSubmit,
  onBack,
  loading = false,
  saved = false,
  toast,
}) {
  const fileInputRef = useRef(null);

  // ── Local state ───────────────────────────────────────────────────────────────
  const [form, setForm] = useState(
    mode === "edit" && initialData ? collegeToForm(initialData) : { ...EMPTY_FORM }
  );
  const [courses,   setCourses]   = useState(mode === "edit" && initialData ? hydrateCourses(initialData.courses || [])   : []);
  const [companies, setCompanies] = useState(mode === "edit" && initialData ? hydrateCompanies(initialData.placement?.companiesVisited || []) : []);
  const [reviews,   setReviews]   = useState(mode === "edit" && initialData ? hydrateReviews(initialData.reviews || []) : []);
  const [imageFiles,    setImageFiles]    = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // ── Hydrate helpers (stringify numbers for inputs) ────────────────────────────
  function hydrateCourses(arr) {
    return arr.map(c => ({
      ...emptyCourse(), ...c,
      durationYears: c.durationYears ?? "", seatIntake: c.seatIntake ?? "",
      fees: { totalFees: c.fees?.totalFees ?? "", yearlyFees: c.fees?.yearlyFees ?? "", currency: c.fees?.currency || "INR" },
      rankRequired: {
        general:{ minRank: c.rankRequired?.general?.minRank ?? "", maxRank: c.rankRequired?.general?.maxRank ?? "" },
        obc:    { minRank: c.rankRequired?.obc?.minRank ?? "",     maxRank: c.rankRequired?.obc?.maxRank ?? ""     },
        sc:     { minRank: c.rankRequired?.sc?.minRank ?? "",      maxRank: c.rankRequired?.sc?.maxRank ?? ""      },
        st:     { minRank: c.rankRequired?.st?.minRank ?? "",      maxRank: c.rankRequired?.st?.maxRank ?? ""      },
      },
    }));
  }
  function hydrateCompanies(arr) {
    return arr.map(c => ({ ...emptyCompany(), ...c,
      highestPackageOffered: { ...emptyCompany().highestPackageOffered, ...c.highestPackageOffered },
      averagePackageOffered: { ...emptyCompany().averagePackageOffered, ...c.averagePackageOffered },
      medianPackageOffered:  { ...emptyCompany().medianPackageOffered,  ...c.medianPackageOffered  },
    }));
  }
  function hydrateReviews(arr) {
    return arr.map(r => ({ ...emptyReview(), ...r, rating: r.rating ?? "" }));
  }

  // ── Form field setter ─────────────────────────────────────────────────────────
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  // ── Image handlers ────────────────────────────────────────────────────────────
  const handleImages = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) { toast?.("⚠️ Only image files allowed!"); return; }
      if (file.size > 5*1024*1024) { toast?.(`⚠️ ${file.name} exceeds 5MB!`); return; }
      setImageFiles(p => [...p, file]);
      const r = new FileReader();
      r.onloadend = () => setImagePreviews(p => [...p, r.result]);
      r.readAsDataURL(file);
    });
  };
  const removeImage = (i) => { setImageFiles(p=>p.filter((_,x)=>x!==i)); setImagePreviews(p=>p.filter((_,x)=>x!==i)); };
  const clearImages = () => { setImageFiles([]); setImagePreviews([]); if (fileInputRef.current) fileInputRef.current.value = ""; };

  // ── Validate ──────────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.collegeId.trim()) { toast?.("⚠️ College ID is required!"); return false; }
    if (!form.collegeName.trim()) { toast?.("⚠️ College Name is required!"); return false; }
    if (!form.state) { toast?.("⚠️ State is required!"); return false; }
    for (const [i,c] of courses.entries()) {
      if (!c.courseName.trim()) { toast?.(`⚠️ Course ${i+1}: Name required!`); return false; }
    }
    for (const [i,co] of companies.entries()) {
      if (!co.companyName.trim()) { toast?.(`⚠️ Company ${i+1}: Name required!`); return false; }
    }
    for (const [i,r] of reviews.entries()) {
      if (!r.userName.trim()) { toast?.(`⚠️ Review ${i+1}: User Name required!`); return false; }
      if (!r.rating) { toast?.(`⚠️ Review ${i+1}: Rating required!`); return false; }
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) return;
    const fd = buildFormData({ form, courses, companies, reviews, imageFiles });
    onSubmit?.(fd);
  };

  // ── Reset (add mode only) ─────────────────────────────────────────────────────
  const handleReset = () => {
    setForm({ ...EMPTY_FORM });
    setCourses([]); setCompanies([]); setReviews([]);
    clearImages();
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0">

      {/* ① Images */}
      <FormCard title="College Images" index={0}>
        <div className="flex flex-col gap-4">
          {/* Existing images (edit mode) */}
          {mode === "edit" && existingImages.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                {imageFiles.length > 0 ? "⚠️ New uploads will replace all existing images" : "Current Images"}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {existingImages.map((img, i) => (
                  <img key={i}
                    src={`${API}/uploads/colleges/${img.filename}`}
                    alt={img.originalName}
                    className={`h-20 w-28 object-cover rounded-xl shrink-0 border transition-all ${imageFiles.length > 0 ? "opacity-40 border-rose-200 grayscale" : "border-slate-200"}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDrop={e=>{e.preventDefault();setIsDragging(false);handleImages(e.dataTransfer.files);}}
            onDragOver={e=>{e.preventDefault();setIsDragging(true);}}
            onDragLeave={()=>setIsDragging(false)}
            onClick={()=>fileInputRef.current?.click()}
            className={`relative min-h-[140px] rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer select-none
              ${isDragging ? "border-[#2667ff] bg-[#EEF3FF] scale-[1.01]" : "border-slate-200 bg-slate-50 hover:border-[#2667ff] hover:bg-[#EEF3FF]/50"}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${isDragging?"bg-[#2667ff] text-white":"bg-slate-200 text-slate-400"}`}>
              <ImagePlus size={20}/>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-slate-600">{isDragging?"Drop images here":"Click or drag & drop images"}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP · Max 5MB · Multiple allowed</p>
            </div>
            <button onClick={e=>{e.stopPropagation();fileInputRef.current?.click();}}
              className="flex items-center gap-2 px-4 py-2 bg-[#2667ff] text-white text-[12px] font-bold rounded-xl hover:bg-[#1a54e8] transition-all">
              <Upload size={13}/> Browse Files
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e=>handleImages(e.target.files)}/>
          </div>

          {/* New previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {imagePreviews.map((src,i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={src} alt="" className="w-full h-[100px] object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={()=>removeImage(i)} className="bg-rose-500 text-white rounded-full p-1.5 hover:bg-rose-600 transition-all"><X size={12}/></button>
                  </div>
                  {i===0 && <span className="absolute top-1.5 left-1.5 bg-[#2667ff] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">Cover</span>}
                  {mode==="edit" && <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">New</span>}
                </div>
              ))}
            </div>
          )}
          {imagePreviews.length > 1 && (
            <button onClick={clearImages} className="self-start flex items-center gap-2 py-1.5 px-3 rounded-xl border border-rose-200 text-rose-500 text-[12px] font-bold hover:bg-rose-50 transition-all">
              <X size={12}/> Clear All
            </button>
          )}
        </div>
      </FormCard>

      {/* ② Basic Info */}
      <FormCard title="Basic Information" index={1}>
        <SectionDivider icon={Building2} label="Identity"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <FormGroup label="College ID *"><Input placeholder="e.g. IITB-001" value={form.collegeId} onChange={set("collegeId")}/></FormGroup>
          <FormGroup label="College Name *"><Input placeholder="e.g. IIT Bombay" value={form.collegeName} onChange={set("collegeName")}/></FormGroup>
          <FormGroup label="Established Year"><Input type="number" placeholder="1958" value={form.establishedYear} onChange={set("establishedYear")}/></FormGroup>
          <FormGroup label="NIRF Overall Rank"><Input type="number" placeholder="3" value={form.nirfOverallRank} onChange={set("nirfOverallRank")}/></FormGroup>
          <FormGroup label="NIRF Ranking Year"><Input type="number" placeholder="2024" value={form.nirfYear} onChange={set("nirfYear")}/></FormGroup>
          <FormGroup label="Video Link"><Input placeholder="https://youtube.com/…" value={form.videoLink} onChange={set("videoLink")}/></FormGroup>
          <FormGroup label="Description" full>
            <Textarea rows={3} placeholder="Brief description of the institute…" value={form.description} onChange={set("description")}/>
          </FormGroup>
        </div>

        <SectionDivider icon={MapPin} label="Location" color="#7c3aed"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Country"><Input placeholder="India" value={form.country} onChange={set("country")}/></FormGroup>
          <FormGroup label="State *"><Select options={STATES} value={form.state} onChange={set("state")} placeholder="Select State"/></FormGroup>
          <FormGroup label="City"><Input placeholder="Mumbai" value={form.city} onChange={set("city")}/></FormGroup>
          <FormGroup label="Pincode"><Input placeholder="400076" value={form.pincode} onChange={set("pincode")}/></FormGroup>
          <FormGroup label="Address" full><Input placeholder="Powai, Mumbai" value={form.address} onChange={set("address")}/></FormGroup>
          <FormGroup label="Latitude"><Input type="number" placeholder="19.1334" value={form.latitude} onChange={set("latitude")}/></FormGroup>
          <FormGroup label="Longitude"><Input type="number" placeholder="72.9133" value={form.longitude} onChange={set("longitude")}/></FormGroup>
        </div>
      </FormCard>

      {/* ③ Placement */}
      <FormCard title="Placement Statistics" index={2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <FormGroup label="Placement Percentage (%)"><Input type="number" placeholder="95" value={form.placementPercentage} onChange={set("placementPercentage")}/></FormGroup>
          <FormGroup label="Placement Year"><Input type="number" placeholder="2024" value={form.placementYear} onChange={set("placementYear")}/></FormGroup>
        </div>

        <SectionDivider icon={TrendingUp} label="Overall Packages" color="#059669"/>
        <div className="flex flex-col gap-3 mb-6">
          <PackageRow label="Highest Package" amount={form.highestPackageAmount} currency={form.highestPackageCurrency} unit={form.highestPackageUnit}
            onAmount={set("highestPackageAmount")} onCurrency={set("highestPackageCurrency")} onUnit={set("highestPackageUnit")}/>
          <PackageRow label="Average Package" amount={form.averagePackageAmount} currency={form.averagePackageCurrency} unit={form.averagePackageUnit}
            onAmount={set("averagePackageAmount")} onCurrency={set("averagePackageCurrency")} onUnit={set("averagePackageUnit")}/>
          <PackageRow label="Median Package" amount={form.medianPackageAmount} currency={form.medianPackageCurrency} unit={form.medianPackageUnit}
            onAmount={set("medianPackageAmount")} onCurrency={set("medianPackageCurrency")} onUnit={set("medianPackageUnit")}/>
        </div>

        <SectionDivider icon={Building2} label={`Companies Visited (${companies.length})`} color="#0891b2"/>
        <div className="flex flex-col gap-3">
          {companies.map((co,i) => (
            <CompanyCard key={i} company={co} index={i}
              onChange={(idx,u)=>setCompanies(p=>p.map((c,x)=>x===idx?u:c))}
              onRemove={idx=>setCompanies(p=>p.filter((_,x)=>x!==idx))}/>
          ))}
          <button onClick={()=>setCompanies(p=>[...p,emptyCompany()])}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-[13px] font-bold hover:border-[#0891b2] hover:text-[#0891b2] hover:bg-[#0891b2]/5 transition-all">
            <Plus size={15}/> Add Company
          </button>
        </div>
      </FormCard>

      {/* ④ Courses */}
      <FormCard title="Courses Offered" index={3}>
        <div className="flex flex-col gap-3">
          {courses.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-[13px]">
              <GraduationCap size={32} className="mx-auto mb-2 opacity-30"/>No courses yet. Add one below.
            </div>
          )}
          {courses.map((c,i) => (
            <CourseCard key={i} course={c} index={i}
              onChange={(idx,u)=>setCourses(p=>p.map((x,xi)=>xi===idx?u:x))}
              onRemove={idx=>setCourses(p=>p.filter((_,xi)=>xi!==idx))}/>
          ))}
          <button onClick={()=>setCourses(p=>[...p,emptyCourse()])}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-[13px] font-bold hover:border-[#2667ff] hover:text-[#2667ff] hover:bg-[#2667ff]/5 transition-all">
            <Plus size={15}/> Add Course
          </button>
        </div>
      </FormCard>

      {/* ⑤ College Ratings */}
      <FormCard title="College Ratings" index={4}>
        <div className="flex items-start gap-4 mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <Star size={16} className="text-amber-500 mt-0.5 shrink-0"/>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            Set the initial overall college rating. This updates automatically as users submit reviews.
            <strong> Total Reviews</strong> should match the count seeded below.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Average Rating (0–5)">
            <div className="flex flex-col gap-2">
              <Input type="number" placeholder="4.5" min="0" max="5" step="0.1" value={form.averageRating} onChange={set("averageRating")}/>
              {form.averageRating && (
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s=><Star key={s} size={14} className={s<=Math.round(Number(form.averageRating))?"fill-amber-400 text-amber-400":"fill-slate-100 text-slate-300"}/>)}
                  <span className="text-[11px] text-slate-400 ml-1">preview</span>
                </div>
              )}
            </div>
          </FormGroup>
          <FormGroup label="Total Reviews Count">
            <Input type="number" placeholder="128" value={form.totalReviews} onChange={set("totalReviews")}/>
          </FormGroup>
        </div>
      </FormCard>

      {/* ⑥ Reviews */}
      <FormCard title="Reviews" index={5}>
        <div className="flex items-start gap-4 mb-5 p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <MessageSquare size={16} className="text-slate-400 mt-0.5 shrink-0"/>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            Seed initial reviews. Each requires a <strong>User Name</strong>, a <strong>star rating</strong>, and a comment.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {reviews.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-[13px]">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30"/>No reviews yet.
            </div>
          )}
          {reviews.map((r,i) => (
            <ReviewCard key={i} review={r} index={i}
              onChange={(idx,u)=>setReviews(p=>p.map((x,xi)=>xi===idx?u:x))}
              onRemove={idx=>setReviews(p=>p.filter((_,xi)=>xi!==idx))}/>
          ))}
          <button onClick={()=>setReviews(p=>[...p,emptyReview()])}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-[13px] font-bold hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50/50 transition-all">
            <Plus size={15}/> Add Review
          </button>
        </div>
      </FormCard>

      {/* ⑦ Actions */}
      <div className="flex items-center gap-3 pb-8 pt-2">
        <Btn onClick={handleSubmit} disabled={loading} className={saved?"!bg-emerald-500":""}>
          {saved ? <><CheckCircle size={13}/> Saved!</>
            : loading ? <>Saving…</>
            : <><Save size={13}/> {mode==="add"?"Save College":"Save Changes"}</>}
        </Btn>
        {mode === "add" && (
          <Btn variant="ghost" onClick={handleReset} disabled={loading}>
            <RotateCcw size={13}/> Reset
          </Btn>
        )}
        <Btn variant="ghost" onClick={onBack} disabled={loading}>
          ← {mode==="add"?"Back to List":"Cancel"}
        </Btn>
      </div>
    </div>
  );
}