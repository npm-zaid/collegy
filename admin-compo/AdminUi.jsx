// "use client";

// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { Search, X } from "lucide-react";

// // ─── STAT CARD ────────────────────────────────────────────────────────────────
// export function StatCard({ icon, value, label, change, changeType = "up", colorClass = "blue", delay = 0 }) {
//   const ref = useRef(null);
//   const colorMap = {
//     blue: { icon: "bg-[#EEF3FF] text-[#2667ff]", border: "border-[#2667ff]/10" },
//     green: { icon: "bg-emerald-50 text-emerald-500", border: "border-emerald-100" },
//     amber: { icon: "bg-amber-50 text-amber-500", border: "border-amber-100" },
//     rose: { icon: "bg-rose-50 text-rose-500", border: "border-rose-100" },
//     purple: { icon: "bg-purple-50 text-purple-500", border: "border-purple-100" },
//   };
//   const c = colorMap[colorClass] || colorMap.blue;

//   useEffect(() => {
//     gsap.fromTo(ref.current,
//       { opacity: 0, y: 28, scale: 0.94 },
//       { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)", delay }
//     );
//   }, [delay]);

//   return (
//     <div ref={ref} className={`bg-white border ${c.border} border-l-4 rounded-[20px] p-6 relative overflow-hidden`}>
//       <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-4 ${c.icon}`}>
//         {icon}
//       </div>
//       <div className="font-black text-[28px] tracking-tight leading-none" >
//         {value}
//       </div>
//       <div className="text-[11px] font-bold uppercase tracking-[.06em] text-slate-400 mt-1">{label}</div>
//       {change && (
//         <div className={`text-[11px] font-bold mt-3 ${changeType === "up" ? "text-emerald-500" : "text-rose-500"}`}>
//           {changeType === "up" ? "↑" : "↓"} {change}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── PAGE HEADER ─────────────────────────────────────────────────────────────
// export function PageHeader({ title, subtitle, action }) {
//   return (
//     <div className="flex items-start justify-between mb-7">
//       <div>
//         <h2 className="text-[22px] font-black tracking-tight text-slate-900" >
//           {title}
//         </h2>
//         {subtitle && <p className="text-[12px] text-slate-400 font-medium mt-1">{subtitle}</p>}
//       </div>
//       {action && <div>{action}</div>}
//     </div>
//   );
// }

// // ─── CHIP / BADGE ─────────────────────────────────────────────────────────────
// export function Chip({ label, color = "gray" }) {
//   const colorMap = {
//     blue: "bg-[#EEF3FF] text-[#2667ff]",
//     green: "bg-emerald-50 text-emerald-600",
//     amber: "bg-amber-50 text-amber-600",
//     rose: "bg-rose-50 text-rose-600",
//     purple: "bg-purple-50 text-purple-600",
//     gray: "bg-slate-100 text-slate-500",
//   };
//   return (
//     <span className={`inline-block px-2.5 py-[3px] rounded-full text-[10px] font-bold ${colorMap[color] || colorMap.gray}`}>
//       {label}
//     </span>
//   );
// }

// // ─── BTN ─────────────────────────────────────────────────────────────────────
// export function Btn({ children, onClick, variant = "primary", size = "md", className = "" }) {
//   const base = "inline-flex items-center gap-2 font-bold rounded-xl transition-all duration-200 uppercase tracking-wider";
//   const sizes = { sm: "px-3 py-[6px] text-[10px]", md: "px-5 py-[9px] text-[11px]", lg: "px-7 py-3 text-[12px]" };
//   const variants = {
//     primary: "bg-[#2667ff] text-white hover:bg-[#1a50e0] shadow-md shadow-blue-100 hover:-translate-y-[1px] active:scale-95",
//     ghost: "bg-transparent text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800",
//     danger: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white",
//     success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white",
//     amber: "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white",
//   };
//   return (
//     <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
//       {children}
//     </button>
//   );
// }

// // ─── TABLE WRAPPER ────────────────────────────────────────────────────────────
// export function TableWrap({ searchPlaceholder, onSearch, headers, children, searchCols }) {
//   return (
//     <div className="bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-sm">
//       {onSearch && (
//         <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
//           <Search size={15} className="text-slate-300 flex-shrink-0" />
//           <input
//             type="text"
//             placeholder={searchPlaceholder || "Search…"}
//             onChange={(e) => onSearch(e.target.value)}
//             className="flex-1 text-[13px] font-medium outline-none placeholder:text-slate-300"
//           />
//         </div>
//       )}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-slate-50">
//               {headers.map((h) => (
//                 <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[.1em] text-slate-400 border-b border-slate-100 whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">{children}</tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // ─── ANIMATED TABLE ROW ───────────────────────────────────────────────────────
// export function AnimRow({ children, index }) {
//   const ref = useRef(null);
//   useEffect(() => {
//     gsap.fromTo(ref.current,
//       { opacity: 0, y: 20 },
//       { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: index * 0.055 }
//     );
//   }, [index]);
//   return (
//     <tr ref={ref} className="hover:bg-slate-50/80 transition-colors">
//       {children}
//     </tr>
//   );
// }

// // ─── FORM CARD ────────────────────────────────────────────────────────────────
// export function FormCard({ title, children, index = 0 }) {
//   const ref = useRef(null);
//   useEffect(() => {
//     gsap.fromTo(ref.current,
//       { opacity: 0, y: 28 },
//       { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: index * 0.12 }
//     );
//   }, [index]);
//   return (
//     <div ref={ref} className="bg-white border border-slate-100 rounded-[24px] p-8 mb-5 shadow-sm">
//       {title && (
//         <div className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400 mb-6">{title}</div>
//       )}
//       {children}
//     </div>
//   );
// }

// // ─── FORM GROUP ───────────────────────────────────────────────────────────────
// export function FormGroup({ label, children, full = false }) {
//   return (
//     <div className={full ? "col-span-2" : ""}>
//       <label className="block text-[9px] font-black uppercase tracking-[.1em] text-slate-400 mb-2">{label}</label>
//       {children}
//     </div>
//   );
// }

// // ─── INPUT ────────────────────────────────────────────────────────────────────
// export function Input({ placeholder, type = "text", value, onChange, id }) {
//   return (
//     <input
//       id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
//       className="w-full border border-slate-200 rounded-[12px] px-4 py-[10px] text-[13px] font-medium text-slate-800 outline-none focus:border-[#2667ff] focus:ring-2 focus:ring-[#2667ff]/10 transition-all placeholder:text-slate-300"
//     />
//   );
// }

// // ─── SELECT ───────────────────────────────────────────────────────────────────
// export function Select({ options, value, onChange, placeholder }) {
//   return (
//     <select
//       value={value} onChange={onChange}
//       className="w-full border border-slate-200 rounded-[12px] px-4 py-[10px] text-[13px] font-medium text-slate-800 outline-none focus:border-[#2667ff] focus:ring-2 focus:ring-[#2667ff]/10 transition-all bg-white appearance-none cursor-pointer"
//     >
//       {placeholder && <option value="">{placeholder}</option>}
//       {options.map((o) => (
//         <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
//           {typeof o === "string" ? o : o.label}
//         </option>
//       ))}
//     </select>
//   );
// }

// // ─── TEXTAREA ─────────────────────────────────────────────────────────────────
// export function Textarea({ placeholder, value, onChange, rows = 4 }) {
//   return (
//     <textarea
//       placeholder={placeholder} value={value} onChange={onChange} rows={rows}
//       className="w-full border border-slate-200 rounded-[12px] px-4 py-[10px] text-[13px] font-medium text-slate-800 outline-none focus:border-[#2667ff] focus:ring-2 focus:ring-[#2667ff]/10 transition-all resize-y placeholder:text-slate-300"
//     />
//   );
// }

// // ─── TAGS INPUT ───────────────────────────────────────────────────────────────
// export function TagsInput({ tags, setTags, placeholder }) {
//   const [val, setVal] = useState("");
//   const handleKey = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const trimmed = val.trim();
//       if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
//       setVal("");
//     }
//   };
//   const remove = (tag) => setTags(tags.filter((t) => t !== tag));
//   return (
//     <div
//       className="flex flex-wrap gap-2 border border-slate-200 rounded-[12px] px-3 py-2 min-h-[48px] items-center focus-within:border-[#2667ff] focus-within:ring-2 focus-within:ring-[#2667ff]/10 transition-all cursor-text"
//       onClick={(e) => e.currentTarget.querySelector("input").focus()}
//     >
//       {tags.map((tag) => (
//         <span key={tag} className="flex items-center gap-1.5 bg-[#EEF3FF] text-[#2667ff] px-2.5 py-1 rounded-lg text-[11px] font-bold">
//           {tag}
//           <X size={11} className="cursor-pointer" onClick={() => remove(tag)} />
//         </span>
//       ))}
//       <input
//         value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={handleKey}
//         placeholder={tags.length === 0 ? placeholder : ""}
//         className="flex-1 min-w-[80px] outline-none text-[13px] font-medium bg-transparent placeholder:text-slate-300"
//       />
//     </div>
//   );
// }

// // ─── MODAL ────────────────────────────────────────────────────────────────────
// export function Modal({ open, onClose, title, children }) {
//   const ref = useRef(null);
//   useEffect(() => {
//     if (open) {
//       gsap.fromTo(ref.current,
//         { opacity: 0, scale: 0.94, y: 20 },
//         { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(2)" }
//       );
//     }
//   }, [open]);
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4" onClick={onClose}>
//       <div
//         ref={ref}
//         className="bg-white rounded-[24px] p-8 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="font-black text-[18px] tracking-tight" >{title}</h3>
//           <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all">
//             <X size={14} />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// export function ModalRow({ label, value }) {
//   return (
//     <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
//       <span className="text-[10px] font-black uppercase tracking-[.08em] text-slate-400">{label}</span>
//       <span className="text-[13px] font-semibold text-slate-700">{value}</span>
//     </div>
//   );
// }

// // ─── TOAST ────────────────────────────────────────────────────────────────────
// let toastFn = null;
// export function useToast() {
//   return (msg) => toastFn && toastFn(msg);
// }

// export function ToastProvider() {
//   const [toast, setToast] = useState(null);
//   const ref = useRef(null);

//   useEffect(() => {
//     toastFn = (msg) => {
//       setToast(msg);
//       if (ref.current) {
//         gsap.fromTo(ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" });
//         setTimeout(() => {
//           if (ref.current) gsap.to(ref.current, { y: 10, opacity: 0, duration: 0.25, onComplete: () => setToast(null) });
//         }, 3000);
//       }
//     };
//   }, []);

//   if (!toast) return null;
//   return (
//     <div ref={ref} className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-[14px] text-[13px] font-semibold z-[999] shadow-2xl flex items-center gap-2">
//       {toast}
//     </div>
//   );
// }

// // ─── EMPTY STATE ─────────────────────────────────────────────────────────────
// export function EmptyState({ icon, message }) {
//   return (
//     <div className="text-center py-20 text-slate-300">
//       <div className="text-5xl mb-4">{icon || "🔍"}</div>
//       <p className="font-bold text-[14px] text-slate-400">{message || "No results found."}</p>
//     </div>
//   );
// }

"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Search, X, TrendingUp, ArrowUpRight, ChevronUp, ChevronDown } from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  blue:   { solid: "#2563eb", tint: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",   ring: "focus-within:ring-blue-200"   },
  green:  { solid: "#059669", tint: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", ring: "focus-within:ring-emerald-200" },
  amber:  { solid: "#d97706", tint: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700",  ring: "focus-within:ring-amber-200"  },
  rose:   { solid: "#e11d48", tint: "bg-rose-50",   text: "text-rose-600",   border: "border-rose-200",   badge: "bg-rose-100 text-rose-700",   ring: "focus-within:ring-rose-200"   },
  purple: { solid: "#7c3aed", tint: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", ring: "focus-within:ring-violet-200" },
  gray:   { solid: "#64748b", tint: "bg-slate-50",  text: "text-slate-500",  border: "border-slate-200",  badge: "bg-slate-100 text-slate-600",  ring: "focus-within:ring-slate-200"  },
};

// shared gsap defaults
const ease = "power3.out";
const easeBack = "back.out(1.7)";

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({
  icon, value, label, change, changeType = "up", colorClass = "blue", delay = 0
}) {
  const ref = useRef(null);
  const c = C[colorClass] || C.blue;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(ref.current, { opacity: 0, y: 32, scale: 0.95 });
      gsap.to(ref.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55, ease: easeBack, delay,
        clearProps: "transform",
      });
    });
    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`
        group relative overflow-hidden rounded-3xl p-6
        border ${c.border} ${c.tint}
        transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5
        sm:p-7 lg:p-8
      `}
    >
      {/* subtle glow blob */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: c.solid }}
      />

      <div className="flex items-start justify-between">
        {/* icon */}
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-white text-base font-bold shadow-sm sm:h-12 sm:w-12"
          style={{ backgroundColor: c.solid }}
        >
          {icon}
        </div>

        {/* arrow indicator */}
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${c.border} bg-white/70`}>
          <ArrowUpRight size={15} className={`${c.text} opacity-50 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{value}</div>
        <div className={`mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${c.text}`}>
          <TrendingUp size={11} />
          {label}
        </div>
      </div>

      {change && (
        <div className={`mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.badge}`}>
          {changeType === "up"
            ? <ChevronUp size={12} />
            : <ChevronDown size={12} />}
          {change}
        </div>
      )}
    </div>
  );
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-400 font-medium">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── CHIP / BADGE ─────────────────────────────────────────────────────────────
export function Chip({ label, color = "gray" }) {
  const c = C[color] || C.gray;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${c.badge} ${c.border}`}>
      {label}
    </span>
  );
}

// ─── BTN ─────────────────────────────────────────────────────────────────────
const BTN_SIZE = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-4 py-2 text-[11px]",
  lg: "px-6 py-2.5 text-[12px]",
};
const BTN_VARIANT = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-sm shadow-blue-200",
  ghost:   "bg-white text-slate-600 hover:bg-slate-50 border-slate-200",
  danger:  "bg-rose-600 text-white hover:bg-rose-700 border-transparent shadow-sm shadow-rose-200",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 border-transparent shadow-sm shadow-emerald-200",
  amber:   "bg-amber-500 text-white hover:bg-amber-600 border-transparent shadow-sm shadow-amber-200",
  outline: "bg-transparent text-blue-600 hover:bg-blue-50 border-blue-200",
};

export function Btn({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 rounded-xl border font-bold uppercase tracking-wider
        transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-40
        ${BTN_SIZE[size] || BTN_SIZE.md}
        ${BTN_VARIANT[variant] || BTN_VARIANT.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ─── TABLE WRAPPER + FIXED STAGGER ───────────────────────────────────────────
// TableBody replaces the per-row delay hack — one GSAP stagger on the whole tbody
export function TableBody({ children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const rows = ref.current.querySelectorAll("tr");
    if (!rows.length) return;

    const ctx = gsap.context(() => {
      gsap.set(rows, { opacity: 0, y: 18 });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.38,
        ease,
        stagger: { each: 0.05, from: "start" },
        clearProps: "transform",
      });
    }, ref);

    return () => ctx.revert();
  }, [children]); // re-run when rows change (search / filter)

  return <tbody ref={ref}>{children}</tbody>;
}

export function TableWrap({ searchPlaceholder, onSearch, headers, children }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {onSearch && (
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
          <Search size={14} className="shrink-0 text-blue-500" />
          <input
            type="text"
            placeholder={searchPlaceholder || "Search…"}
            onChange={(e) => onSearch(e.target.value)}
            className="flex-1 bg-transparent text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-300"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-5 py-3 text-left text-[9px] font-black uppercase tracking-[.14em] text-blue-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          {/* wrap children in TableBody for stagger */}
          <TableBody>{children}</TableBody>
        </table>
      </div>
    </div>
  );
}

// ─── TABLE ROW (no individual animation — handled by TableBody) ───────────────
export function AnimRow({ children }) {
  return (
    <tr className="border-b border-slate-50 transition-colors duration-150 last:border-0 hover:bg-blue-50/40">
      {children}
    </tr>
  );
}

// ─── FORM CARD ────────────────────────────────────────────────────────────────
export function FormCard({ title, children, index = 0, color = "blue" }) {
  const ref = useRef(null);
  const c = C[color] || C.blue;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(ref.current, { opacity: 0, y: 24 });
      gsap.to(ref.current, {
        opacity: 1, y: 0,
        duration: 0.45, ease,
        delay: index * 0.1,
        clearProps: "transform",
      });
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`mb-5 overflow-hidden rounded-3xl border ${c.border} ${c.tint} p-6 sm:p-8`}
    >
      {title && (
        <div className={`mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] ${c.text}`}>
          <TrendingUp size={11} />
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── FORM GROUP ───────────────────────────────────────────────────────────────
export function FormGroup({ label, children, full = false }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[.12em] text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── SHARED INPUT STYLES ──────────────────────────────────────────────────────
const inputBase = `
  w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5
  text-[13px] font-medium text-slate-800 outline-none
  placeholder:text-slate-300
  transition-all duration-150
  focus:border-blue-400 focus:ring-2 focus:ring-blue-100
`;

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({ placeholder, type = "text", value, onChange, id }) {
  return (
    <input
      id={id} type={type}
      placeholder={placeholder}
      value={value} onChange={onChange}
      className={inputBase}
    />
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({ options, value, onChange, placeholder }) {
  return (
    <select
      value={value} onChange={onChange}
      className={`${inputBase} cursor-pointer appearance-none`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option
          key={typeof o === "string" ? o : o.value}
          value={typeof o === "string" ? o : o.value}
        >
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  );
}

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────
export function Textarea({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value} onChange={onChange} rows={rows}
      className={`${inputBase} resize-y`}
    />
  );
}

// ─── TAGS INPUT ───────────────────────────────────────────────────────────────
export function TagsInput({ tags, setTags, placeholder }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);

  const addTag = useCallback(() => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setVal("");
  }, [val, tags, setTags]);

  const handleKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && !val && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div
      className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-all duration-150 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setTags(tags.filter((t) => t !== tag)); }}
            className="text-blue-400 hover:text-blue-700 transition-colors"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] bg-transparent text-[13px] font-medium text-slate-800 outline-none placeholder:text-slate-300"
      />
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, color = "blue" }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const c = C[color] || C.blue;

  useLayoutEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { opacity: 0, scale: 0.9, y: 20 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.2 });
      gsap.to(panelRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: easeBack, delay: 0.05 });
    });
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(15,23,42,0.4)" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className={`
          w-full max-w-md max-h-[80vh] overflow-y-auto
          rounded-3xl border ${c.border} ${c.tint}
          p-6 shadow-2xl sm:p-8
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: c.solid }}
            >
              <TrendingUp size={15} />
            </div>
            <h3 className="text-lg font-black tracking-tight text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:text-slate-700 hover:border-slate-300"
          >
            <X size={13} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-[.1em] text-slate-400">{label}</span>
      <span className="text-[13px] font-semibold text-slate-700">{value}</span>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
let _toastFn = null;

export function useToast() {
  return useCallback((msg, type = "info") => _toastFn?.(msg, type), []);
}

const TOAST_STYLES = {
  info:    "bg-blue-600 text-white",
  success: "bg-emerald-600 text-white",
  error:   "bg-rose-600 text-white",
  warning: "bg-amber-500 text-white",
};

export function ToastProvider() {
  const [toast, setToast] = useState(null);
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    _toastFn = (msg, type = "info") => {
      clearTimeout(timerRef.current);
      setToast({ msg, type });
    };
    return () => { _toastFn = null; };
  }, []);

  useLayoutEffect(() => {
    if (!toast || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.set(ref.current, { y: 20, opacity: 0, scale: 0.95 });
      gsap.to(ref.current, { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: easeBack });
    });
    timerRef.current = setTimeout(() => {
      gsap.to(ref.current, {
        y: 12, opacity: 0, scale: 0.95, duration: 0.25,
        onComplete: () => setToast(null),
      });
    }, 3000);
    return () => { ctx.revert(); clearTimeout(timerRef.current); };
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      ref={ref}
      className={`fixed bottom-5 right-5 z-[999] flex items-center gap-2.5 rounded-2xl px-4 py-3 text-[13px] font-semibold shadow-lg ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}`}
    >
      {toast.msg}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 py-20 px-8 text-center">
      <div className="mb-4 text-4xl opacity-40">{icon || "🔍"}</div>
      <p className="text-sm font-medium text-slate-400">{message || "No results found."}</p>
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
  );
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  if (!label) return <hr className="my-5 border-slate-100" />;
  return (
    <div className="my-5 flex items-center gap-3">
      <hr className="flex-1 border-slate-100" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</span>
      <hr className="flex-1 border-slate-100" />
    </div>
  );
}