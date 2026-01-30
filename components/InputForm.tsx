import React, { useState } from 'react';
import { PostFormData, TargetAudience, ToneType, FrameworkType, PostLength, GeneratedContent } from '../types';
import { PenTool, MessageSquare, AlignLeft, DollarSign, TrendingUp, Video, Briefcase, Edit3, Facebook, Clapperboard, X, Film, BookOpen, Crown, ChevronDown, History, Trash2, Clock, Calendar, ArrowRight } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: PostFormData) => void;
  isGenerating: boolean;
  history: GeneratedContent[];
  onSelectHistory: (item: GeneratedContent) => void;
  onClearHistory: () => void;
}

const TOPIC_GROUPS = [
  {
    id: 'wealth',
    title: "LÀM GIÀU & ĐẦU TƯ",
    shortTitle: "LÀM GIÀU",
    icon: <DollarSign className="w-5 h-5" />,
    color: "from-yellow-600 to-amber-600",
    topics: [
        "Tư duy Triệu phú", 
        "Tự do Tài chính (FIRE)", 
        "Đầu tư Bất Động Sản", 
        "Đầu tư Chứng khoán/Crypto", 
        "Quản lý Tài chính Cá nhân", 
        "Xây dựng Dòng tiền Thụ động",
        "Bí mật của giới Siêu giàu",
        "Bài học Khởi nghiệp 0đ"
    ]
  },
  {
    id: 'business',
    title: "KINH DOANH & BÁN HÀNG",
    shortTitle: "KINH DOANH",
    icon: <Briefcase className="w-5 h-5" />,
    color: "from-blue-600 to-cyan-600",
    topics: [
        "Chiến Lược Bán Tết", 
        "Tặng Quà Tết", 
        "Thời trang & Phụ kiện", 
        "Mỹ phẩm & Skincare", 
        "Đồ gia dụng thông minh",
        "Quản trị & Xây team", 
        "Kỹ năng Chốt Sale Đỉnh cao",
        "Xây dựng Hệ thống Đại lý"
    ]
  },
  {
    id: 'tiktok',
    title: "TIKTOK & GIẢI TRÍ",
    shortTitle: "TIKTOK",
    icon: <Video className="w-5 h-5" />,
    color: "from-rose-600 to-orange-600",
    topics: ["Drama Công sở", "Biến hình Trend", "Review Ẩm thực", "Daily Vlog", "Thử thách đường phố", "POV: Tình yêu"]
  },
  {
    id: 'brand',
    title: "THƯƠNG HIỆU CÁ NHÂN",
    shortTitle: "THƯƠNG HIỆU",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-emerald-600 to-teal-600",
    topics: ["Trao Giá Trị", "Phong cách sống (Lifestyle)", "Tư duy Lãnh đạo", "Kỷ luật bản thân", "Truyền cảm hứng", "Góc nhìn Tranh luận"]
  }
];

const VIP_GOALS = ["💰 Bán hàng chuyển đổi cao", "🔥 Kéo tương tác & Tranh luận", "🏆 Xây dựng uy tín chuyên gia", "🎣 Thu hút khách hàng (Lead Magnet)", "🚀 Viral thương hiệu"];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating, history, onSelectHistory, onClearHistory }) => {
  const [activeView, setActiveView] = useState<'create' | 'history'>('create');
  const [formData, setFormData] = useState<PostFormData>({
    topic: '',
    audience: TargetAudience.EVERYONE,
    tone: ToneType.PROFESSIONAL,
    framework: FrameworkType.PAS, 
    goal: VIP_GOALS[0],
    emojiDensity: 'Medium',
    length: PostLength.MEDIUM
  });

  const [activeTab, setActiveTab] = useState<string>('wealth'); 
  const [selectedTopicBase, setSelectedTopicBase] = useState<string>(''); 
  const [customPrompt, setCustomPrompt] = useState<string>(''); 
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModel, setVideoModel] = useState<'VEO3' | 'SORA2' | null>(null);

  const handleChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTopicSelect = (topic: string) => {
    setCustomPrompt(''); 
    setFormData(prev => ({ ...prev, topic }));
    setSelectedTopicBase(topic);
  };

  const getTopicString = () => {
    if (customPrompt.trim().length > 0) {
        return customPrompt.trim();
    }
    return formData.topic;
  };

  const handleContentSubmit = () => {
    const topic = getTopicString();
    if (!topic) {
        alert("Vui lòng chọn chủ đề hoặc nhập ý tưởng của bạn!");
        return;
    }
    onSubmit({ ...formData, topic });
  };

  const openVideoModal = () => {
    const topic = getTopicString();
    if (!topic) {
        alert("Vui lòng chọn chủ đề hoặc nhập ý tưởng của bạn!");
        return;
    }
    setShowVideoModal(true);
    setVideoModel(null);
  };

  const handleVideoSubmit = (duration: string) => {
    const baseTopic = getTopicString();
    if (!baseTopic || !videoModel) return;
    const finalTopic = `[KỊCH BẢN VIDEO ${videoModel} - THỜI LƯỢNG ${duration}] ${baseTopic}`;
    onSubmit({ ...formData, topic: finalTopic });
    setShowVideoModal(false);
  };

  const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleString('vi-VN', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
  }

  const activeGroup = TOPIC_GROUPS.find(g => g.id === activeTab);
  
  const isValid = isGenerating ? false : (
      customPrompt.trim().length > 0 || formData.topic.length > 0
  );

  // Define durations based on model
  const getDurations = () => {
      if (videoModel === 'VEO3') return ['8s', '16s', '32s'];
      return ['15s', '30s', '60s'];
  };

  return (
    <>
      {/* Sticky Container */}
      <div className="sticky top-24 glass-panel rounded-3xl overflow-hidden flex flex-col relative border border-white/10 shadow-2xl transition-all duration-300 max-h-[85vh]">
        
        {/* Toggle Header */}
        <div className="flex border-b border-white/10 bg-black/40">
           <button 
              onClick={() => setActiveView('create')}
              className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all
              ${activeView === 'create' ? 'bg-white/10 text-white border-b-2 border-indigo-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
           >
              <PenTool className="w-4 h-4" /> KHO Ý TƯỞNG
           </button>
           <button 
              onClick={() => setActiveView('history')}
              className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all
              ${activeView === 'history' ? 'bg-white/10 text-amber-400 border-b-2 border-amber-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
           >
              <History className="w-4 h-4" /> LỊCH SỬ ({history.length})
           </button>
        </div>

        {/* --- VIEW 1: CREATE FORM --- */}
        {activeView === 'create' && (
        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
          
          {/* Tabs */}
          <div className="px-4 py-4 border-b border-white/5 overflow-x-auto scrollbar-hide flex gap-3 snap-x bg-black/20 shrink-0">
            {TOPIC_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 snap-start border
                  ${activeTab === group.id 
                    ? `bg-gradient-to-r ${group.color} border-transparent text-white shadow-lg scale-105` 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {group.icon}
                {group.shortTitle}
              </button>
            ))}
          </div>

          {/* Main Area */}
          <div className="p-6 space-y-8">
            
            {/* 1. TOPIC GRID */}
            <div className="animate-fade-in-up">
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeGroup?.topics.map((topic, i) => (
                          <button
                            key={i}
                            onClick={() => handleTopicSelect(topic)}
                            className={`
                              relative group p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden
                              min-h-[120px]
                              ${(formData.topic === topic && !customPrompt)
                                ? `bg-gradient-to-br ${activeGroup.color} border-transparent text-white shadow-2xl scale-[1.02] ring-2 ring-white/20`
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white'
                              }
                            `}
                          >
                            <span className="relative z-10 text-base font-black uppercase tracking-wide leading-tight drop-shadow-md">
                                {topic}
                            </span>
                          </button>
                      ))}
                   </div>
                </div>
            </div>

            {/* DIVIDER */}
            <div className="relative h-4 flex items-center justify-center">
                 <div className="absolute w-full h-px bg-white/10"></div>
                 <span className="relative bg-[#0a0f1e] px-2 text-xs text-gray-500 uppercase font-bold">TÙY CHỈNH</span>
            </div>

            {/* 2. CUSTOM PROMPT */}
            <div className="animate-fade-in-up">
               <div className={`rounded-2xl p-1 transition-all duration-300 ${customPrompt ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-white/10'}`}>
                  <div className="bg-[#050505] rounded-xl p-3">
                      <textarea
                        placeholder="Nhập ý tưởng riêng..."
                        className="w-full p-3 rounded-xl border border-white/10 focus:border-pink-500/50 bg-white/5 text-white placeholder-gray-600 outline-none min-h-[80px] resize-none text-base transition-colors"
                        value={customPrompt}
                        onChange={(e) => {
                            setCustomPrompt(e.target.value);
                        }}
                      />
                  </div>
               </div>
            </div>

            {/* 3. CONFIG (UPDATED TO HORIZONTAL GRID) */}
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* FRAMEWORK */}
                   <div className="group">
                      <label className="text-[10px] font-bold text-indigo-300 flex items-center gap-2 mb-1 uppercase tracking-wide">
                        <BookOpen className="w-3 h-3" /> CÔNG THỨC
                      </label>
                      <div className="relative">
                        <select
                            className="w-full p-2 pl-3 rounded-lg border border-indigo-500/30 bg-indigo-900/10 text-indigo-100 text-xs font-bold focus:border-indigo-400 outline-none cursor-pointer hover:bg-indigo-900/20 appearance-none truncate"
                            value={formData.framework}
                            onChange={(e) => handleChange('framework', e.target.value)}
                        >
                            {Object.values(FrameworkType).map((v) => <option key={v} value={v} className="bg-slate-900 text-gray-300">{v.split('(')[0]}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400 pointer-events-none" />
                      </div>
                   </div>

                   {/* LENGTH */}
                   <div className="group">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Độ dài</label>
                      <select
                        className="w-full p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 text-xs focus:border-white/20 outline-none truncate"
                        value={formData.length}
                        onChange={(e) => handleChange('length', e.target.value)}
                      >
                        {Object.values(PostLength).map(v => <option key={v} value={v} className="bg-slate-900">{v.split('(')[0]}</option>)}
                      </select>
                   </div>

                   {/* TONE */}
                   <div className="group">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Tone</label>
                      <select
                        className="w-full p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 text-xs focus:border-white/20 outline-none truncate"
                        value={formData.tone}
                        onChange={(e) => handleChange('tone', e.target.value)}
                      >
                           {Object.values(ToneType).map(v => <option key={v} value={v} className="bg-slate-900">{v.split('/')[0]}</option>)}
                      </select>
                   </div>
               </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
              <button
                onClick={handleContentSubmit}
                disabled={!isValid}
                className={`
                  relative py-4 rounded-xl font-bold text-base text-white shadow-xl flex items-center justify-center gap-2 overflow-hidden border border-white/10
                  ${!isValid 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 active:scale-95'
                  }
                `}
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Facebook className="w-5 h-5" />}
                VIẾT NGAY
              </button>

              <button
                onClick={openVideoModal}
                disabled={!isValid}
                className={`
                  relative py-4 rounded-xl font-bold text-base text-white shadow-xl flex items-center justify-center gap-2 overflow-hidden border border-white/10
                  ${!isValid 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 active:scale-95'
                  }
                `}
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Clapperboard className="w-5 h-5" />}
                VIDEO
              </button>
            </div>
          </div>
        </div>
        )}

        {/* --- VIEW 2: HISTORY LIST --- */}
        {activeView === 'history' && (
          <div className="flex-1 flex flex-col relative bg-black/20">
             {history.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                    <History className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-center text-sm">Chưa có lịch sử.<br/>Hãy tạo nội dung đầu tiên!</p>
                 </div>
             ) : (
                <>
                  <div className="p-4 flex justify-between items-center border-b border-white/5">
                     <span className="text-xs font-bold text-gray-500 uppercase">Danh sách lưu trữ</span>
                     <button onClick={onClearHistory} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-400">
                        <Trash2 className="w-3 h-3" /> Xóa tất cả
                     </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                     {history.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => onSelectHistory(item)}
                          className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 rounded-xl p-4 cursor-pointer transition-all group relative overflow-hidden"
                        >
                           <div className="absolute top-0 left-0 w-1 h-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <h4 className="font-bold text-gray-200 text-sm mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                              {item.headline || "Không có tiêu đề"}
                           </h4>
                           <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                              <span className="flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> {item.timestamp ? formatTime(item.timestamp) : 'N/A'}
                              </span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500" />
                           </div>
                        </div>
                     ))}
                  </div>
                </>
             )}
          </div>
        )}

      </div>

      {/* Video Modal - Dark */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
           <div className="bg-[#0a0a0a] rounded-3xl w-full max-w-2xl border border-gray-800 shadow-2xl relative overflow-hidden animate-slide-up">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>

              <div className="relative p-6 border-b border-gray-800 flex justify-between items-center bg-white/5">
                  <h3 className="text-2xl font-black text-white flex items-center gap-2"><Film className="w-6 h-6 text-red-500" /> ĐẠO DIỄN AI STUDIO</h3>
                  <button onClick={() => setShowVideoModal(false)} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-10 relative">
                 <div className="mb-10">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 block">1. Chọn Siêu AI</label>
                    <div className="grid grid-cols-2 gap-6">
                        <button onClick={() => setVideoModel('VEO3')} className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-4 ${videoModel === 'VEO3' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}>
                            <span className="text-3xl font-black text-white">VEO 3</span>
                            <span className="text-xs text-blue-400 font-bold uppercase">Google DeepMind</span>
                        </button>
                        <button onClick={() => setVideoModel('SORA2')} className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-4 ${videoModel === 'SORA2' ? 'border-red-500 bg-red-900/20' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}>
                            <span className="text-3xl font-black text-white">SORA 2</span>
                            <span className="text-xs text-red-400 font-bold uppercase">OpenAI</span>
                        </button>
                    </div>
                 </div>
                 <div className={`transition-all duration-500 ${videoModel ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 block">2. Thời Lượng ({videoModel === 'VEO3' ? 'Veo 3 Standard' : 'Extended'})</label>
                    <div className="grid grid-cols-3 gap-6">
                         {getDurations().map(time => (
                            <button key={time} onClick={() => handleVideoSubmit(time)} className="p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-white/30 hover:bg-gray-800 transition-all">
                                <span className="font-black text-xl text-white">{time}</span>
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default InputForm;