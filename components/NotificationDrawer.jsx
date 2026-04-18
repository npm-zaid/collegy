'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Zap, Gift, Check, BellRing } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, title: '250+ Experts Online', desc: 'Connect now for a free profile evaluation.', time: 'Live', type: 'expert' },
  { id: 2, title: 'New Scholarship Alert', desc: 'Up to $20,000 subsidy available for Canada.', time: '2h ago', type: 'promo' },
  { id: 3, title: 'CUET (UG) 2026 Update', desc: 'Important admit card release notification.', time: '5h ago', type: 'news' }
];

export default function NotificationDrawer({ isOpen, onClose }) {
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
      gsap.to(drawerRef.current, { x: 0, duration: 0.6, ease: "expo.out" });
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: "expo.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
    }
  }, [isOpen]);

  return (
    <>
      <div ref={overlayRef} onClick={onClose} className="fixed h-screen w-full bg-black/20 backdrop-blur-md z-50 hidden opacity-0" />
      
      <div ref={drawerRef} className="absolute top-0 right-0 h-full w-full max-w-[400px] bg-white border-l border-zinc-100 z-50 shadow-2xl translate-x-full flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-[1000] tracking-tighter text-zinc-900">Notifications</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3D6BE8]">Stay Updated with Collegy</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Dynamic List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {NOTIFICATIONS.map((item) => (
            <div key={item.id} className="p-5 rounded-[2rem] bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#3D6BE8]">
                  <BellRing size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-black uppercase tracking-tight text-zinc-900">{item.title}</h4>
                    <span className="text-[9px] font-bold text-zinc-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] font-bold text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8">
          <button className="w-full py-5 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3D6BE8] transition-all shadow-lg">
            Mark All as Read
          </button>
        </div>
      </div>
    </>
  );
}