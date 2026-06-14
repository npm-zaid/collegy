"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  FaPlay, 
  FaYoutube, 
  FaClock, 
  FaEye, 
  FaTimes, 
  FaExternalLinkAlt,
  FaFire,
  FaTv
} from "react-icons/fa";

const videos = [
  {
    id: "Tgo73L3SQr8",
    title: "Sunstone, PW IOI, Scaler, Masai, Mirai School — Truth Nobody Tells You!",
    duration: "18:42",
    views: "12K views",
    published: "1 week ago",
    tag: "EdTech Reality",
    color: "border-blue-500/30",
    glow: "shadow-[0_0_20px_rgba(61,107,232,0.25)]"
  },
  {
    id: "h_DixBv5wkA",
    title: "SGSITS Indore EXPOSED | Placement Reality, Hostel, Fees & Package Truth!",
    duration: "14:15",
    views: "18K views",
    published: "3 weeks ago",
    tag: "College Review",
    color: "border-[#E39F4A]/30",
    glow: "shadow-[0_0_20px_rgba(227,159,74,0.25)]"
  },
  {
    id: "zlfnsfaRZtQ",
    title: "NMIMS Indore Review 2026 — Biggest Reality Check Before Taking Admission!",
    duration: "16:20",
    views: "24K views",
    published: "1 month ago",
    tag: "Honest Opinion",
    color: "border-red-500/30",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]"
  }
];

const YouTubeThumbnail = ({ videoId, title }) => {
  const [src, setSrc] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (!failed) {
      setSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      setFailed(true);
    }
  };

  return (
    <img
      src={src}
      alt={title}
      onError={handleError}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      loading="lazy"
    />
  );
};

export default function YouTubeShowcase() {
  const [activeVideo, setActiveVideo] = useState(null);
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const iframeRef = useRef(null);

  // Entrance animations with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade and slide in cards
      gsap.fromTo(
        ".video-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        }
      );

      // Simple floating animation for header items
      gsap.to(".youtube-badge", {
        y: -4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Modal animations when activeVideo changes
  useEffect(() => {
    if (activeVideo) {
      // Prevent page scrolling while modal is open
      document.body.style.overflow = "hidden";

      // Animate modal in
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      
      gsap.fromTo(
        ".modal-content",
        { scale: 0.9, y: 20 },
        { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
      );
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activeVideo]);

  const handleCloseModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setActiveVideo(null)
    });
  };

  return (
    <section 
      ref={containerRef} 
      className="min-h-fit w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden relative py-20 px-6 md:px-10"
    >
      {/* Background Micro-Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#3D6BE8 1px, transparent 1px), linear-gradient(90deg, #3D6BE8 1px, transparent 1px)`, 
          backgroundSize: '50px 50px' 
        }} 
      />
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center mb-16 space-y-4 max-w-2xl">
          <div className="youtube-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-red-500/20">
            <FaYoutube size={12} className="fill-red-500" /> FinaleBeacon TV
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
            Reality Checks <br />
            <span className="bg-gradient-to-r from-red-500 to-[#E39F4A] bg-clip-text text-transparent italic">
              Exposing the Ground Truth.
            </span>
          </h2>
          
          <p className="text-zinc-500 font-bold text-xs md:text-sm max-w-md mx-auto leading-relaxed px-4">
            We review colleges, programs, and EdTech claiming "guarantees" so you can make informed decisions. Watch our trending videos below.
          </p>
        </div>

        {/* VIDEOS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
          {videos.map((video) => (
            <div 
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`video-card group relative flex flex-col bg-zinc-900/40 backdrop-blur-2xl border ${video.color} ${video.glow} rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 hover:bg-zinc-800/60 hover:-translate-y-2`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden">
                <YouTubeThumbnail videoId={video.id} title={video.title} />
                
                {/* Red Overlay on Hover */}
                <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-500 shadow-red-600/50">
                    <FaPlay size={28} className="fill-white ml-1" />
                  </div>
                </div>

                {/* Default static play button visual */}
                <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/10 group-hover:hidden transition-all">
                  <FaPlay size={16} className="fill-white ml-0.5" />
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wide border border-white/5">
                  {video.duration}
                </div>

                {/* Tag Badge */}
                <div className="absolute top-4 left-4 bg-[#050505]/80 backdrop-blur-md text-[#E39F4A] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-[#E39F4A]/20">
                  {video.tag}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-sm font-black text-white leading-snug tracking-tight mb-3 group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
                    {video.title}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between text-zinc-500 font-bold text-[10px] uppercase tracking-wider pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <FaEye size={12} /> {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock size={12} /> {video.published}
                  </span>
                </div>
              </div>

              {/* YouTube Progress Bar Vibe at bottom of card */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* REDIRECT TO CHANNEL BUTTON */}
        <div className="flex flex-col items-center gap-4">
          <a 
            href="https://www.youtube.com/@FinaleBeacon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all duration-500 hover:scale-105 flex items-center gap-3"
          >
            <FaYoutube size={18} className="fill-white animate-pulse" />
             YouTube Channel
            <FaExternalLinkAlt size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Join 50k+ students getting authentic information
          </p>
        </div>

      </div>

      {/* DETAILED VIDEO MODAL PLAYER */}
      {activeVideo && (
        <div 
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-pointer" onClick={handleCloseModal} />
          
          <div className="modal-content relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10">
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 hover:bg-red-600 text-white hover:text-white transition-all z-20 border border-white/10"
              aria-label="Close modal"
            >
              <FaTimes size={18} />
            </button>

            {/* Video Player Frame */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&showinfo=0&modestbranding=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Info details under video in modal */}
            <div className="p-6 bg-zinc-900/60 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-red-500/20">
                  {activeVideo.tag}
                </span>
                <h3 className="text-base font-black text-white tracking-tight">
                  {activeVideo.title}
                </h3>
              </div>
              <a
                href={`https://youtu.be/${activeVideo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider bg-red-500/5 hover:bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20"
              >
                Watch on YouTube <FaExternalLinkAlt size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
