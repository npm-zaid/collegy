"use client";
import { useState } from "react";
import { 
  Play, 
  Info, 
  Eye, 
  CheckCircle2, 
  ExternalLink,
  Maximize2,
  Video
} from "lucide-react";

export default function CollegeVideoReview() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Example College Data
  const college = {
    name: "Noida International University",
    subTitle: "Campus Tour & Student Review 2026",
    description: "Unlimited access to world-class courses, hands-on projects, and job-ready certificate programs. Watch our detailed infrastructure review and placement analysis.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual review ID
    views: "45K+",
    rating: "4.8/5"
  };

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* --- DUAL-PANE GLASS CARD --- */}
        <div className="bg-[#E6F2F2] rounded-[50px] overflow-hidden p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 border border-white shadow-2xl relative">
          
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/30 blur-[100px] rounded-full" />

          {/* LEFT: CONTENT SECTION */}
          <div className="flex-1 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm">
              <Video size={16} className="text-[#006D77]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#006D77]">Video Prospectus</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-[1000] text-[#1D1D42] tracking-tighter leading-tight">
                Want to know in details <br /> 
                <span className="text-[#006D77]">about {college.name}?</span>
              </h2>
              <p className="text-slate-600 font-medium text-lg max-w-md leading-relaxed">
                {college.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-[#006D77] hover:bg-[#1D1D42] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-teal-900/20 flex items-center gap-3">
                Explore {college.name} <ExternalLink size={16} />
              </button>
              
              <div className="flex items-center gap-3 px-6 py-4 bg-white/40 rounded-2xl">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                  {college.views} Students Viewed
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: NON-REDIRECTING PLAYER */}
          <div className="flex-1 w-full relative z-10 group">
            <div className="relative aspect-video rounded-[35px] overflow-hidden shadow-2xl border-4 border-white bg-black">
              
              {!isPlaying ? (
                /* Custom Thumbnail Overlay */
                <div className="absolute inset-0 z-20 cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=1200&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                    alt="Campus Tour" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Floating Elements on Thumbnail */}
                  <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/30">
                     <CheckCircle2 size={14} className="text-white" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Review</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-80">Course Overview</p>
                    <p className="text-xl font-bold tracking-tight">Campus Tour: Totally Unexpected</p>
                  </div>
                </div>
              ) : (
                /* Actual Iframe (No Redirection) */
                <iframe
                  className="w-full h-full"
                  src={`${college.videoUrl}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            
            {/* Player Floating Action Bar */}
            <div className="absolute -bottom-6 right-10 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-4">
               <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors"><Maximize2 size={18} /></button>
               <div className="w-[1px] h-6 bg-slate-100" />
               <button className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest px-2">
                  Live Review
               </button>
            </div>
          </div>

        </div>

        {/* --- TECHNICAL DATA GRID BELOW --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { label: "Hostel Rating", val: "4.5/5" },
            { label: "Placements", val: "High Rate" },
            { label: "Faculty", val: "Ph.D Holders" },
            { label: "Campus Size", val: "75 Acres" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-[24px] text-center hover:bg-white hover:shadow-xl transition-all group">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-xl font-[1000] text-slate-900 group-hover:text-[#006D77] transition-colors">{stat.val}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}