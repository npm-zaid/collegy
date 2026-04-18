"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, saveToken } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = tab === "login"
        ? await authAPI.login(form.email, form.password)
        : await authAPI.register(form.name, form.email, form.password);

      if (!res.success) {
        setError(res.message);
      } else {
        saveToken(res.data.token);
        router.push("/admin/");
      }
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl">

        {/* Left — brand panel */}
        <div className="hidden md:flex flex-col justify-between w-[42%] bg-[#2667ff] p-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white font-black text-sm">C</div>
            <span className="text-white font-black text-lg">Collegy Admin</span>
          </div>
          <div>
            <h2 className="text-white font-black text-2xl leading-snug mb-3">
              Manage everything from one place
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Central dashboard for colleges, users, enquiries and content.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["248 Users", "34 Colleges", "Secure JWT"].map(b => (
              <span key={b} className="text-[11px] font-bold text-white/90 bg-white/15 border border-white/20 px-3 py-1 rounded-full">{b}</span>
            ))}
          </div>
        </div>

        {/* Right — form panel */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center">

          {/* Tabs */}
          <div className="flex bg-[#F1F4FF] rounded-xl p-1 mb-8">
            {["login", "register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 rounded-[10px] text-[13px] font-bold capitalize transition-all
                  ${tab === t ? "bg-[#2667ff] text-white" : "text-slate-400"}`}>
                {t}
              </button>
            ))}
          </div>

          <h1 className="text-[19px] font-black text-slate-900 mb-1">
            {tab === "login" ? "Welcome back" : "Create admin"}
          </h1>
          <p className="text-[12px] text-slate-400 mb-6">
            {tab === "login" ? "Enter your credentials to continue" : "One-time setup — register your account"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] rounded-xl px-4 py-3 mb-5">
              ⚠ {error}
            </div>
          )}

          {tab === "register" && (
            <Field label="Full Name" name="name" type="text" placeholder="Admin Name" value={form.name} onChange={handle} />
          )}
          <Field label="Email Address" name="email" type="email" placeholder="admin@example.com" value={form.email} onChange={handle} />
          <Field label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} />

          <button onClick={submit} disabled={loading}
            className="w-full h-11 bg-[#2667ff] text-white rounded-xl text-[13px] font-black mt-2 disabled:opacity-60">
            {loading ? "Please wait..." : tab === "login" ? "Sign in →" : "Create account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full h-10 border border-slate-200 rounded-xl px-4 text-[13px] bg-slate-50 focus:outline-none focus:border-[#2667ff] focus:bg-white transition-all" />
    </div>
  );
}