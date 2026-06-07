"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  LayoutDashboard, GraduationCap, PlusCircle, MessageSquare,
  CreditCard, Briefcase, Newspaper, FilePlus, Users, LogOut,
  Bell, ChevronLeft, ChevronRight, Menu,
} from "lucide-react";

const NAV = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/", badge: null },
      { id: "users", label: "Registered Users", icon: Users, href: "/admin/users", badge: "248", badgeColor: "bg-[#2667ff]" },
    ],
  },
  {
    label: "Colleges",
    items: [
      { id: "colleges", label: "College List", icon: GraduationCap, href: "/admin/colleges", badge: "34", badgeColor: "bg-emerald-500" },
      { id: "add-college", label: "Add College", icon: PlusCircle, href: "/admin/add-college", badge: null },
    ],
  },
  {
    label: "Requests",
    items: [
      { id: "consultations", label: "Consultations", icon: MessageSquare, href: "/admin/consultations", badge: "12", badgeColor: "bg-amber-500" },
      // { id: "loans", label: "Education Loans", icon: CreditCard, href: "/admin/loans", badge: "8", badgeColor: "bg-amber-500" },
      { id: "internships", label: "Internships", icon: Briefcase, href: "/admin/internships", badge: "19", badgeColor: "bg-rose-500" },
      { id: "partners", label: "Partners", icon: Users, href: "/admin/partners", badge: null },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "news", label: "Latest News", icon: Newspaper, href: "/admin/news", badge: null },
      { id: "add-news", label: "Add News", icon: FilePlus, href: "/admin/add-news", badge: null },
    ],
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Refs for GSAP
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const labelsRef = useRef([]);
  const groupLabelsRef = useRef([]);
  const toggleBtnRef = useRef(null);
  const logoTextRef = useRef(null);

  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const isAnimating = useRef(false);

  // Determine if we are on the login page
  const isLoginPage = pathname === "/admin/login";

 
 // --- Logout Logic ---
  const handleLogout = () => {
    // 1. Clear LocalStorage (just in case)
    localStorage.removeItem("token");
    
    // 2. Clear the Cookie (Crucial for your Middleware)
    // Cookie ko delete karne ka sahi tarika uski Max-Age ko 0 set karna hai
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0";
    
    // 3. Redirect to login page
    // window.location use karna zyada reliable hota hai logout ke time 
    // taaki state puri tarah refresh ho jaye, par router.push bhi kaam karega
    router.push("/admin/login");
    
    // Optional: Agar router.push se issue ho, toh ye use karein:
    // window.location.href = "/admin/login";
  };

  // Initial entrance animation
  useEffect(() => {
    if (isLoginPage) return; 

    const ctx = gsap.context(() => {
      gsap.set(".nav-group-item", { opacity: 0, x: -18 });
      gsap.to(".nav-group-item", {
        opacity: 1, x: 0, stagger: 0.04, duration: 0.4,
        ease: "power3.out", delay: 0.15,
      });
      gsap.from(".sidebar-logo", { opacity: 0, y: -16, duration: 0.5, ease: "power3.out" });
    }, sidebarRef);
    return () => ctx.revert();
  }, [isLoginPage]);

  // Sync page title
  useEffect(() => {
    const allItems = NAV.flatMap((g) => g.items);
    const active = allItems.find((i) => i.href === pathname);
    if (active) setPageTitle(active.label);
  }, [pathname]);

  const toggleSidebar = () => {
    if (isAnimating.current || isLoginPage) return;
    isAnimating.current = true;

    const sidebar = sidebarRef.current;
    const content = contentRef.current;
    const labels = labelsRef.current.filter(Boolean);
    const groupLabels = groupLabelsRef.current.filter(Boolean);
    const logoText = logoTextRef.current;
    const toggleBtn = toggleBtnRef.current;

    const opening = !isOpen;

    gsap.to(toggleBtn, {
      rotation: opening ? 0 : 180,
      duration: 0.4,
      ease: "back.out(1.7)",
    });

    if (opening) {
      gsap.to(sidebar, {
        width: "25vw",
        duration: 0.5,
        ease: "elastic.out(1, 0.7)",
        onComplete: () => {
          gsap.to([...labels, ...groupLabels, logoText], {
            opacity: 1,
            x: 0,
            duration: 0.25,
            stagger: 0.03,
            ease: "power2.out",
            onComplete: () => { isAnimating.current = false; },
          });
        },
      });
      gsap.to(content, { width: "75vw", duration: 0.5, ease: "elastic.out(1, 0.7)" });
    } else {
      gsap.to([...labels, ...groupLabels, logoText], {
        opacity: 0,
        x: -8,
        duration: 0.15,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(sidebar, {
            width: "5rem",
            duration: 0.45,
            ease: "elastic.out(1, 0.75)",
            onComplete: () => { isAnimating.current = false; },
          });
          gsap.to(content, {
            width: "calc(100vw - 5rem)",
            duration: 0.45,
            ease: "elastic.out(1, 0.75)",
          });
        },
      });
    }
    setIsOpen(opening);
  };

  const isActive = (href) => pathname === href;

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F7F8FC]">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-[#F7F8FC] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        ref={sidebarRef}
        className="bg-white border-r border-slate-100 flex flex-col h-screen z-50 overflow-hidden flex-shrink-0"
        style={{ width: "25vw" }}
      >
        <div className="sidebar-logo flex items-center gap-3 px-4 py-6 border-b border-slate-100 min-h-[73px]">
          <div className="w-8 h-8 bg-[#2667ff] rounded-xl flex items-center justify-center text-white text-[13px] font-black flex-shrink-0">
            C
          </div>
          <span ref={logoTextRef} className="font-black text-[18px] tracking-tight text-[#2667ff] whitespace-nowrap overflow-hidden">
            Collegy Admin
          </span>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {NAV.map((group, gi) => (
            <div key={group.label} className="mb-2">
              <div
                ref={(el) => (groupLabelsRef.current[gi] = el)}
                className="px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap overflow-hidden"
              >
                {group.label}
              </div>

              {group.items.map((item, ii) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const labelIndex = NAV.slice(0, gi).reduce((acc, g) => acc + g.items.length, 0) + ii;

                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={`nav-group-item w-full flex items-center gap-3 px-4 py-[10px] mx-2 rounded-xl text-[13px] font-semibold transition-colors duration-200 relative text-left
                      ${active ? "bg-[#EEF3FF] text-[#2667ff] font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
                    style={{ width: "calc(100% - 16px)" }}
                  >
                    {active && <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#2667ff] rounded-full" />}
                    <Icon size={15} className="flex-shrink-0" />
                    <span ref={(el) => (labelsRef.current[labelIndex] = el)} className="flex-1 text-left whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`${item.badgeColor} text-white text-[9px] font-black px-2 py-[2px] rounded-full flex-shrink-0`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="nav-group-item w-full flex items-center gap-3 px-4 py-[10px] rounded-xl text-[13px] font-semibold text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut size={15} className="flex-shrink-0" />
            <span ref={(el) => (labelsRef.current[99] = el)} className="whitespace-nowrap overflow-hidden">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div ref={contentRef} className="flex flex-col h-screen overflow-hidden" style={{ width: "75vw" }}>
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button ref={toggleBtnRef} onClick={toggleSidebar} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#EEF3FF] hover:text-[#2667ff] hover:border-[#2667ff]/30 transition-all duration-200 flex-shrink-0">
              {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>
            <h1 className="text-[17px] font-black tracking-tight text-slate-900 whitespace-nowrap">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all relative">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 bg-[#2667ff] rounded-full flex items-center justify-center text-white text-[12px] font-black">AD</div>
              <span className="text-[12px] font-bold text-slate-600 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}