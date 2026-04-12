import React from "react";
import { Sparkles } from "lucide-react";


const SecIntro  = ({
  badgeText = "Trusted Partnerships",
  badgeIcon = <Sparkles size={14} className="text-[#2667ff]" />,

  prefix = "Over 20+",
  highlight = "Businesses",
  suffix = "Growing with Us",

  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      
      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2667ff]/10 border border-[#2667ff]/20 mb-6">
        {badgeIcon}
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2667ff]">
          {badgeText}
        </span>
      </div>

      {/* Heading */}
      <div className="relative mb-12 flex flex-col items-center">
        <h2 className="sm:text-5xl text-4xl font-black tracking-tighter text-center leading-[0.9] mb-4">
          <span className="text-zinc-900">{prefix} </span>

          <span className="bg-gradient-to-r from-[#2667ff]  to-[#2667ff] bg-clip-text text-transparent italic pr-2">
            {highlight}
          </span>

          <span className="text-zinc-900 block sm:inline">
            {" "}
            {suffix}
          </span>
        </h2>

        <div className="w-36 h-1.5 bg-gradient-to-r from-zinc-900 to-[#2667ff] rounded-full mt-2" />
      </div>

    </div>
  );
};

export default SecIntro;