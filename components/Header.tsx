import React from 'react';
import { Settings, Power, Clock, Calendar, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onOpenAdmin: () => void;
  userEmail: string;
  activationTime?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onOpenAdmin, activationTime, onLogout }) => {
  
  const displayTime = activationTime || "Lifetime Access";
  const parts = displayTime.split('-');
  const datePart = parts[0]?.trim();
  const timePart = parts[1]?.trim();

  return (
    <header className="relative z-40 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 py-3 px-6 md:px-8 flex justify-between items-center shadow-2xl sticky top-0 w-full">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

      {/* === 1. LEFT: LOGO & BRAND === */}
      <div className="flex items-center">
            <button 
                onClick={isAdmin ? onOpenAdmin : undefined}
                disabled={!isAdmin}
                className={`relative group flex items-center gap-4 ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
            >
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-black border border-amber-500/30 overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-500">
                    <img 
                    src="https://i.postimg.cc/bGxgNSjL/Gemini-Generated-Image-th54ipth54ipth54.png" 
                    alt="Logo" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {isAdmin && <Settings className="absolute bottom-1 right-1 w-3 h-3 text-white bg-red-600 rounded-full p-0.5 animate-spin-slow" />}
                </div>
                
                {/* Brand Name Simplified */}
                <div className="hidden md:block text-left">
                    <div className="text-xl md:text-2xl font-black text-white tracking-wider uppercase leading-none">
                        THIEN MASTER APP
                    </div>
                    <div className="text-[10px] text-amber-500 font-bold tracking-[0.4em] uppercase mt-1 opacity-80">
                        ROYAL EDITION
                    </div>
                </div>
            </button>
      </div>

      {/* === 2. RIGHT: USER INFO === */}
      <div className="flex items-center gap-4 md:gap-6">
          
          {/* VIP LICENCE PLATE */}
          <div className="hidden md:flex items-center bg-[#0a0f1e] border border-white/10 rounded-lg overflow-hidden shadow-inner">
              <div className="px-3 py-2 bg-gradient-to-b from-amber-600 to-yellow-700 border-r border-white/10 flex flex-col items-center justify-center min-w-[50px]">
                  <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex divide-x divide-white/10">
                  <div className="px-3 py-1 flex flex-col justify-center">
                      <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Ngày Kích Hoạt</div>
                      <div className="text-xs font-mono font-bold text-blue-100">{datePart || "..."}</div>
                  </div>
                  {timePart && (
                    <div className="px-3 py-1 flex flex-col justify-center bg-white/5">
                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Giờ</div>
                        <div className="text-xs font-mono font-bold text-green-100">{timePart}</div>
                    </div>
                  )}
              </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout} 
            className="group relative px-4 py-2 overflow-hidden rounded-lg bg-red-950/20 hover:bg-red-600/20 border border-red-900/50 hover:border-red-500/50 transition-all duration-300"
          >
              <div className="flex items-center gap-2 relative z-10">
                  <Power className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                  <span className="hidden md:inline text-xs font-bold text-red-500 group-hover:text-red-400 uppercase tracking-widest">THOÁT</span>
              </div>
          </button>
      </div>
    </header>
  );
};

export default Header;