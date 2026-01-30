import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import VoiceStudio from './components/VoiceStudio';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import { PostFormData, GeneratedContent, UserSession, VipUserInfo } from './types';
import { generateFacebookPost } from './services/geminiService';
import { fetchVipListFromSheet } from './services/sheetService';
import { Layout, ShieldAlert, Star, Sparkles, Facebook, Phone, Gift, ExternalLink, Copy, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [zaloCopied, setZaloCopied] = useState(false);
  
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [vipUsers, setVipUsers] = useState<VipUserInfo[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initial Data Load
  useEffect(() => {
    // Check Ban Status
    if (localStorage.getItem('THIEN_MASTER_BAN_FLAG') === 'true') {
        setIsBanned(true);
    }
    
    // Load Session
    const storedSession = localStorage.getItem('THIEN_SESSION_USER');
    if (storedSession) {
        setUserSession(JSON.parse(storedSession));
    }

    // Load History
    const storedHistory = localStorage.getItem('THIEN_CONTENT_HISTORY');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    // INITIAL SYNC WITH GOOGLE SHEET
    syncWithCloud();

    // Security Handlers
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        triggerSecurityLock();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const syncWithCloud = async () => {
      setIsSyncing(true);
      try {
          const cloudUsers = await fetchVipListFromSheet();
          if (cloudUsers.length > 0) {
              setVipUsers(cloudUsers);
              localStorage.setItem('THIEN_VIP_USERS', JSON.stringify(cloudUsers));
          } else {
              // Fallback to local if cloud fails or is empty initially
              const stored = localStorage.getItem('THIEN_VIP_USERS');
              if (stored) setVipUsers(JSON.parse(stored));
          }
      } catch (e) {
          console.error("Sync failed", e);
      } finally {
          setIsSyncing(false);
      }
  };

  const triggerSecurityLock = () => {
    setIsBanned(true);
    localStorage.setItem('THIEN_MASTER_BAN_FLAG', 'true');
  };

  const handleUserLogin = async (email: string) => {
    // Re-sync before login to ensure latest data
    await syncWithCloud();
    
    // Find user in vip list to get activation time
    const vipUser = vipUsers.find(u => u.email === email);
    const activationTime = vipUser ? vipUser.activationTime : 'Unknown';

    const session: UserSession = { 
        email, 
        role: 'USER', 
        timestamp: Date.now(),
        activationTime
    };
    setUserSession(session);
    localStorage.setItem('THIEN_SESSION_USER', JSON.stringify(session));
  };

  const handleAdminLogin = () => {
    const session: UserSession = { email: 'thien', role: 'ADMIN', timestamp: Date.now(), activationTime: 'MASTER ADMIN' };
    setUserSession(session);
    setShowAdminPanel(true); 
    localStorage.setItem('THIEN_SESSION_USER', JSON.stringify(session));
    // Trigger sync when admin logs in
    syncWithCloud();
  };

  const handleLogout = () => {
    setUserSession(null);
    setShowAdminPanel(false);
    localStorage.removeItem('THIEN_SESSION_USER');
  };

  const handleForceSync = async () => {
      await syncWithCloud();
  };

  const handleCopyZalo = () => {
      navigator.clipboard.writeText("0968065274");
      setZaloCopied(true);
      setTimeout(() => setZaloCopied(false), 2000);
  };

  const handleFormSubmit = async (data: PostFormData) => {
    setIsGenerating(true);
    setResult(null);
    try {
      const generatedContent = await generateFacebookPost(data);
      
      // Append ID and Timestamp
      const contentWithMeta: GeneratedContent = {
        ...generatedContent,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };

      setResult(contentWithMeta);
      
      // Update History (Prepend new item)
      const newHistory = [contentWithMeta, ...history];
      setHistory(newHistory);
      localStorage.setItem('THIEN_CONTENT_HISTORY', JSON.stringify(newHistory));

    } catch (error) {
      console.error("Failed to generate content", error);
      alert("Hệ thống đang quá tải. Vui lòng thử lại sau!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistory = (item: GeneratedContent) => {
      setResult(item);
  };

  const handleClearHistory = () => {
    if(window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) {
        setHistory([]);
        localStorage.removeItem('THIEN_CONTENT_HISTORY');
    }
  };

  if (isBanned) {
    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-center p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black"></div>
            <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="w-28 h-28 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(220,38,38,0.8)] border-4 border-red-400">
                    <ShieldAlert className="w-16 h-16 text-white" />
                </div>
            </div>
            <h1 className="relative z-10 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800 tracking-tighter mb-6 uppercase glitch-effect">
                ACCESS DENIED
            </h1>
        </div>
    );
  }

  if (!userSession) {
    return (
        <LoginScreen 
            onUserLogin={handleUserLogin} 
            onAdminLogin={handleAdminLogin}
            vipUsers={vipUsers}
        />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-gray-200 animate-fade-in-up selection:bg-amber-500 selection:text-black flex flex-col">
      
      {/* Background Noise/Grid */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      {/* HEADER */}
      <Header 
        isAdmin={userSession.role === 'ADMIN'}
        onOpenAdmin={() => setShowAdminPanel(true)}
        userEmail={userSession.email}
        activationTime={userSession.activationTime}
        onLogout={handleLogout}
      />
      
      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto relative z-10 px-4 md:px-8 pb-10">
        
        {/* CONDITIONAL RENDERING: SHOW ADMIN PANEL OR MAIN CONTENT */}
        {showAdminPanel && userSession.role === 'ADMIN' ? (
             <div className="py-6">
                <AdminPanel 
                    vipUsers={vipUsers}
                    onSync={handleForceSync}
                    onClose={() => setShowAdminPanel(false)}
                />
             </div>
        ) : (
            <>
                {/* === HERO SECTION === */}
                <div className="py-12 md:py-16 flex flex-col items-center justify-center relative">
                     {/* Ambient Light */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[100px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                     <div className="relative flex flex-col items-center z-20 w-full">
                        {/* 3D TITLE */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-400 to-yellow-700 uppercase tracking-tighter leading-none text-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] animate-float"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.4))' }}
                        >
                            SIÊU CONTENT ĐỈNH CAO
                        </h1>

                        {/* SLOGAN */}
                        <div className="mt-4 flex items-center justify-center gap-6">
                            <div className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-amber-500 to-transparent opacity-60"></div>
                            <div className="flex items-center gap-3 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-amber-500/20 shadow-lg">
                                <Star className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                                <span className="text-sm md:text-base font-bold text-amber-100 tracking-[0.3em] uppercase">
                                    ĐỘT PHÁ DOANH SỐ - TỰ ĐỘNG HÓA 100%
                                </span>
                                <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                            </div>
                            <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-amber-500 to-transparent opacity-60"></div>
                        </div>

                        {/* === PERSONAL BRANDING COMMAND CENTER === */}
                        <div className="w-full max-w-5xl mt-12 relative group animate-fade-in-up px-4">
                            {/* Neon Glow Container Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-1000 animate-tilt"></div>
                            
                            {/* Main Command Bar - CHANGED TO GRID FOR HORIZONTAL LAYOUT */}
                            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden items-stretch">
                                
                                {/* Top Light Reflection */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                                
                                {/* BUTTON 1: FACEBOOK */}
                                <a href="https://byvn.net/44LC" target="_blank" rel="noreferrer" className="w-full group/btn relative h-full">
                                   <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                   <div className="relative h-full bg-[#0a0f1e] hover:bg-blue-900/20 border border-blue-500/30 hover:border-blue-400 rounded-2xl p-4 flex items-center gap-4 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                                         <Facebook className="w-6 h-6 text-white" />
                                      </div>
                                      <div className="flex flex-col min-w-0">
                                         <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest truncate">Facebook Official</span>
                                         <span className="text-lg font-black text-white group-hover/btn:text-blue-200 truncate">NGUYỄN QUỐC THIỆN</span>
                                      </div>
                                      <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 opacity-50 group-hover/btn:opacity-100" />
                                   </div>
                                </a>

                                {/* BUTTON 2: ZALO */}
                                <button onClick={handleCopyZalo} className="w-full group/btn relative h-full">
                                   <div className="absolute inset-0 bg-teal-600/20 rounded-2xl blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                   <div className="relative h-full bg-[#0a0f1e] hover:bg-teal-900/20 border border-teal-500/30 hover:border-teal-400 rounded-2xl p-4 flex items-center gap-4 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                                      <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                                         <Phone className="w-6 h-6 text-white" />
                                      </div>
                                      <div className="flex flex-col items-start min-w-0">
                                         <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest truncate">Zalo Contact</span>
                                         <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-white group-hover/btn:text-teal-200 truncate">0968.065.274</span>
                                            {zaloCopied && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">COPIED</span>}
                                         </div>
                                      </div>
                                      {zaloCopied ? (
                                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                      ) : (
                                        <Copy className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 opacity-50 group-hover/btn:opacity-100" />
                                      )}
                                   </div>
                                </button>

                                {/* BUTTON 3: VIP APP (HIGHLIGHT) */}
                                <a href="https://byvn.net/ky3c" target="_blank" rel="noreferrer" className="w-full group/btn relative h-full">
                                   <div className="absolute inset-0 bg-amber-600/30 rounded-2xl blur-xl opacity-50 group-hover/btn:opacity-100 transition-opacity animate-pulse"></div>
                                   <div className="relative h-full bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-500 hover:border-amber-300 rounded-2xl p-4 flex items-center gap-4 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg border border-white/20 animate-spin-slow shrink-0">
                                         <Gift className="w-6 h-6 text-white" />
                                      </div>
                                      <div className="flex flex-col min-w-0">
                                         <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest flex items-center gap-1 truncate">
                                            <Star className="w-3 h-3 fill-amber-300" /> SPECIAL GIFT
                                         </span>
                                         <span className="text-lg font-black text-white group-hover/btn:text-amber-100 whitespace-nowrap truncate">NHẬN 7 APP SIÊU VIP</span>
                                      </div>
                                      <div className="absolute -top-1 -right-1">
                                        <span className="relative flex h-3 w-3">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                      </div>
                                   </div>
                                </a>

                            </div>
                        </div>

                     </div>
                </div>

                {/* === CONTENT GRID (INFINITE SCROLL) === */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT SIDEBAR (STICKY) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 z-30">
                        <InputForm 
                          onSubmit={handleFormSubmit} 
                          isGenerating={isGenerating} 
                          history={history}
                          onSelectHistory={handleSelectHistory}
                          onClearHistory={handleClearHistory}
                        />
                    </div>

                    {/* RIGHT CONTENT (SCROLLABLE) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {result ? (
                        <div className="flex flex-col gap-6 animate-slide-up">
                            <ResultCard result={result} />
                            <VoiceStudio text={result.content} />
                        </div>
                        ) : (
                        <div className="min-h-[400px] bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                            <div className="w-32 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                                <Layout className="w-12 h-12 text-indigo-400 opacity-80" />
                            </div>
                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 uppercase tracking-widest">Sẵn Sàng</h3>
                            <p className="text-gray-500 max-w-sm mt-3 text-base">
                                Chọn chủ đề bên trái hoặc xem lại <span className="text-amber-500 font-bold">Lịch sử</span> các bài viết đã tạo.
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </>
        )}
      </main>
    </div>
  );
};

export default App;