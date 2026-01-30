import React from 'react';
import { AlertTriangle, ShieldCheck, Crown, Sparkles } from 'lucide-react';

const AuthorSignature: React.FC = () => {
  return (
    <div className="mt-12 pt-8 pb-4 animate-slide-up relative">
      {/* 3D NEON BOX CONTAINER */}
      <div className="relative group w-full">
         
         {/* The Glowing Border Effect (Neon) */}
         <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-xl blur opacity-30 group-hover:opacity-80 transition duration-1000"></div>
         
         <div className="relative bg-black rounded-xl border border-white/10 overflow-hidden">
            {/* Background Grid Pattern */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             
             <div className="relative px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-b from-white/5 to-transparent">
                 
                 {/* Left: Powered By */}
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
                        <Crown className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">POWERED BY</span>
                        <span className="text-xs font-black text-white uppercase tracking-widest">THIEN MASTER AI</span>
                    </div>
                 </div>

                 {/* Center: BRAND NAME (Main Focus - Neon Text) */}
                 <div className="flex-1 text-center relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-10 bg-red-500/20 blur-xl"></div>
                     <h3 className="relative text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.5)' }}>
                        NGUYỄN QUỐC THIỆN
                     </h3>
                 </div>

                 {/* Right: Copyright Warning */}
                 <div className="flex items-center gap-2 px-4 py-2 bg-red-950/40 border border-red-500/30 rounded-lg shadow-inner">
                    <ShieldCheck className="w-3 h-3 text-red-500" />
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">
                        NO COPYING ALLOWED
                    </span>
                 </div>

             </div>
         </div>
      </div>
    </div>
  );
};

export default AuthorSignature;