import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, Zap, Mail, Crown, User, Fingerprint } from 'lucide-react';
import { VipUserInfo } from '../types';

interface LoginScreenProps {
  onUserLogin: (email: string) => void;
  onAdminLogin: () => void;
  vipUsers: VipUserInfo[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onUserLogin, onAdminLogin, vipUsers }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);
  const [isAdminDetected, setIsAdminDetected] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    setError(null);
    if (val.trim() === 'thien') {
      setIsAdminDetected(true);
    } else {
      setIsAdminDetected(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = inputVal.trim();
    // Normalize input to lowercase for comparison
    const valLower = val.toLowerCase();

    // 1. ADMIN LOGIN (NO PASSWORD)
    if (val === 'thien') {
       onAdminLogin();
       return;
    }

    // 2. USER LOGIN (GMAIL WHITELIST - Case Insensitive)
    if (val.includes('@')) {
      const vipUser = vipUsers.find(u => u.email.toLowerCase() === valLower);
      
      if (vipUser) {
        onUserLogin(vipUser.email); 
      } else {
        triggerError("Gmail này chưa được kích hoạt VIP!");
      }
    } else {
      triggerError("Vui lòng nhập Gmail hợp lệ!");
    }
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden font-sans perspective-1000">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      
      {/* Neon Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* --- MAIN CONTAINER (Split Layout) --- */}
      <div className={`relative z-10 w-full max-w-[1400px] mx-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 transition-all duration-500 ${isShake ? 'animate-shake' : ''}`}>
        
        {/* === LEFT SIDE: STANDALONE ART IMAGE (OUTSIDE THE FORM) === */}
        <div className="hidden md:block w-full md:w-[450px] lg:w-[500px] h-[600px] relative group animate-fade-in-up">
            {/* Glow Behind */}
            <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/20 to-purple-600/20 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* The Image Container */}
            <div className="w-full h-full relative overflow-hidden rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 z-10 transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1">
                {/* Border Glow Gradient */}
                <div className="absolute inset-0 rounded-[3rem] border-2 border-transparent bg-gradient-to-br from-amber-400/50 via-transparent to-purple-500/50 [mask-image:linear-gradient(#fff,#fff)] [mask-composite:exclude] opacity-50 z-20 pointer-events-none"></div>
                
                <img 
                    src="https://lh3.googleusercontent.com/d/1-lRjggKSO2tUG-c06UO3LW6_w8LxclV-" 
                    alt="Super Content AI" 
                    className="w-full h-full object-cover opacity-90"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                
                {/* Image Text/Badge */}
                <div className="absolute bottom-10 left-0 w-full text-center z-20 px-6">
                    <div className="inline-block px-4 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20 mb-2">
                         <span className="text-[10px] font-black text-amber-400 tracking-[0.3em] uppercase">POWERED BY GEMINI 2.5</span>
                    </div>
                </div>
            </div>
        </div>

        {/* === RIGHT SIDE: LOGIN FORM CARD === */}
        <div className="w-full md:flex-1 max-w-[600px] bg-[#0a0a0a]/60 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative animate-slide-up">
          
          {/* Decor */}
          <div className="absolute top-8 right-8">
             <Fingerprint className="w-12 h-12 text-white/5 animate-pulse" />
          </div>

          <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none uppercase tracking-tighter drop-shadow-lg mb-2">
                  THIEN MASTER <br/> APP
              </h2>
              <div className="inline-block relative mt-2">
                <div className="relative bg-black/50 backdrop-blur-sm border border-yellow-500/50 px-3 py-1 rounded-full">
                    <p className="text-yellow-400 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
                        ĐỘT PHÁ DOANH SỐ - TỰ ĐỘNG HÓA 100%
                    </p>
                </div>
              </div>
          </div>

          <div className="mb-10 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl ${isAdminDetected ? 'bg-gradient-to-br from-red-600 to-pink-600 shadow-red-500/30' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'}`}>
                    {isAdminDetected ? <Crown className="w-5 h-5 text-white animate-bounce" /> : <Zap className="w-5 h-5 text-white" />}
                 </div>
                 <h3 className="text-2xl font-bold text-white tracking-tight">
                    {isAdminDetected ? "Xin chào, Master!" : "Đăng nhập"}
                 </h3>
             </div>
             <p className="text-gray-400 text-sm md:text-base">
                {isAdminDetected ? "Hệ thống đã sẵn sàng phục vụ." : "Nhập Gmail VIP để truy cập hệ thống."}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-cyan-400 transition-colors">
                 {isAdminDetected ? 'Admin Username' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  placeholder="Nhập Gmail của bạn..."
                  className={`w-full bg-[#050505] text-white placeholder-gray-600 border-2 rounded-2xl px-6 py-5 pl-14 text-xl font-medium outline-none transition-all duration-300
                    ${error 
                      ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                      : isAdminDetected
                        ? 'border-pink-500 focus:shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                        : 'border-white/10 focus:border-cyan-500 focus:shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                    }
                  `}
                  autoFocus
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                    {isAdminDetected ? (
                        <User className="w-6 h-6 text-pink-500" />
                    ) : (
                        <Mail className="w-6 h-6 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    )}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-red-400 bg-red-900/10 p-4 rounded-xl border border-red-500/20 animate-fade-in">
                 <ShieldCheck className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-6 rounded-2xl font-black text-xl text-white shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 active:scale-95
                ${isAdminDetected 
                    ? 'bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 shadow-pink-600/30' 
                    : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-cyan-600/30'
                }`}
            >
              {/* Shine effect */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine"></div>
              
              <span className="relative z-10 flex items-center gap-2">
                 {isAdminDetected ? 'TRUY CẬP NGAY' : 'KÍCH HOẠT PHIÊN'} 
                 <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase tracking-wider">
             <span>Thien Master App v33.0</span>
             <span className="flex items-center gap-1 text-gray-600">
                <ShieldCheck className="w-3 h-3" /> Secure
             </span>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 200%; }
        }
        .animate-shine {
            animation: shine 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;