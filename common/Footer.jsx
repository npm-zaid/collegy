
import { 
  Stethoscope, 

  
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative  pt-24 pb-12 px-6 overflow-hidden">
      <div className='absolute inset-0 bg-gradient-to-t z-0 from-[#2667ff]/80 via-[#2667ff]/10 to-transparent'></div>
   
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2667ff 1.5px, transparent 1.5px), linear-gradient(90deg, #2667ff 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#2667ff] p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
                <Stethoscope className="text-white w-6 h-6" strokeWidth={3} />
              </div>
              <span className="text-3xl font-[1000] tracking-tighter text-slate-900 uppercase">
               Collegy
              </span>
            </div>
            <p className="text-zinc-600 font-bold max-w-xs leading-relaxed mb-10 text-base">
              India's #1  platform, engineered with precision for every aspirant.
            </p>
            <div className="flex gap-5">
              {/* {[ Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl border-2 border-zinc-600 flex items-center justify-center text-zinc-600 hover:bg-[#2667ff] hover:text-white hover:border-[#2667ff] transition-all hover:-translate-y-1">
                  <Icon size={20} strokeWidth={2.5} />
                </a>
              ))} */}
            </div>
          </div>

          {[
            { 
              title: "Platform", 
              links: ["College Predictor", "Cut-off Analysis", "Choice Filling", "Seat Matrix"] 
            },
            { 
              title: "Resources", 
              links: ["State Counselling", "Counselling FAQs", "Latest News", "Documentation"] 
            },
            { 
              title: "Company", 
              links: ["About Us", "Privacy Policy", "Terms of Service", "Contact Support"] 
            }
          ].map((group, idx) => (
            <div key={idx}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8 border-l-4 border-[#2667ff] pl-4">
                {group.title}
              </h4>
              <ul className="space-y-5 text-[13px] font-bold text-zinc-600">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="hover:text-[#2667ff] transition-colors flex items-center group">
                      {link}
                      <ChevronRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        <div className=" flex flex-col  justify-between items-center gap-6 text-black text-[10px] font-black tracking-[0.2em] uppercase">
        <div className='h-[2px] mb-4 w-full bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent'></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <p>© 2026 CollegeFind. Built by Engineers.</p>
          <div className="flex gap-10 ">
            <span className="flex items-center gap-2 hover:text-[#2667ff] transition-colors cursor-pointer">
              India's #1 Platform <ExternalLink size={12} strokeWidth={3} />
            </span>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
