"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import {
  GraduationCap, Users, MessageSquare, Briefcase,
  Newspaper, Star, Building2, ShieldCheck, Loader2
} from "lucide-react";
import { StatCard } from "../../admin-compo/AdminUi";
import { getToken } from "../../lib/auth";

const API = "https://finale-beacon-backend.vercel.app";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all necessary data
        const [
          collegesRes,
          usersRes,
          consultRes,
          internRes,
          newsRes,
          partnersRes
        ] = await Promise.all([
          fetch(`${API}/api/admin/colleges`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
          fetch(`${API}/api/admin/enquiries`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
          fetch(`${API}/api/consultations`).then(r => r.json()).catch(() => ({ data: [] })),
          fetch(`${API}/api/internships`).then(r => r.json()).catch(() => ({ data: [] })),
          fetch(`${API}/api/notifications`).then(r => r.json()).catch(() => ({ data: [] })),
          fetch(`${API}/api/partners`).then(r => r.json()).catch(() => ({ data: [] })),
        ]);

        const colleges = collegesRes?.data || [];
        const users = usersRes?.data || [];
        const consults = consultRes?.data || [];
        const interns = internRes?.data || [];
        const news = newsRes?.data || [];
        const partners = partnersRes?.data || [];

        const pendingConsults = consults.filter(c => c.status === "Pending").length;
        const consultsDone = consults.filter(c => c.status === "Done").length;
        
        // Use loose matching for college types/featured status to be safe
        const featuredColleges = colleges.filter(c => c.isFeatured === true || c.isFeatured === "true").length;
        const govtColleges = colleges.filter(c => c.collegeType?.toLowerCase().includes("government") || c.type?.toLowerCase().includes("government")).length;
        const privateColleges = colleges.filter(c => c.collegeType?.toLowerCase().includes("private") || c.type?.toLowerCase().includes("private")).length;

        setStatsData({
          stats: [
            { icon: <GraduationCap size={18} />, value: colleges.length, label: "Total Colleges", colorClass: "blue" },
            { icon: <Users size={18} />, value: users.length, label: "Registered Enquiries", colorClass: "green" },
            { icon: <MessageSquare size={18} />, value: pendingConsults, label: "Pending Consults", colorClass: "amber" },
            { icon: <Briefcase size={18} />, value: interns.length, label: "Internship Requests", colorClass: "rose" },
          ],
          quick: [
            { icon: <Newspaper size={20} />, val: news.length, label: "News Published" },
            { icon: <Star size={20} />, val: featuredColleges, label: "Featured Colleges" },
            { icon: <Building2 size={20} />, val: govtColleges, label: "Govt. Colleges" },
            { icon: <Building2 size={20} />, val: privateColleges, label: "Private Colleges" },
            { icon: <ShieldCheck size={20} />, val: partners.length, label: "Active Partners" },
            { icon: <MessageSquare size={20} />, val: consultsDone, label: "Consults Done" },
          ]
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && statsData) {
      gsap.fromTo(".quick-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.45, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [loading, statsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Stat grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {statsData.stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3 mb-7">
        {statsData.quick.map((q) => (
          <div key={q.label} className="quick-card bg-white border border-slate-100 rounded-[16px] p-4 flex items-center gap-4 shadow-sm">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-indigo-500 shrink-0">
              {q.icon}
            </span>
            <div>
              <div className="font-black text-[20px] leading-none tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>{q.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">{q.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
