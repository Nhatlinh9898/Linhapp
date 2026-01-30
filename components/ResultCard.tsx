import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { Copy, Check, Facebook, Heart, Share2, ThumbsUp, Hash, Image as ImageIcon, Sparkles, AlertCircle, Download, Film, CreditCard } from 'lucide-react';
import { generateImageIllustration } from '../services/geminiService';
import AuthorSignature from './AuthorSignature';

interface ResultCardProps {
  result: GeneratedContent | null;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [bankCopied, setBankCopied] = useState(false);

  React.useEffect(() => {
    setGeneratedImage(result?.imageBase64 || null);
    setImageError(false);
  }, [result]);

  if (!result) return null;

  const isVideoScript = result.content.includes('|') && result.content.includes('---');

  const handleCopy = () => {
    const fullText = `${result.headline}\n\n${result.content}\n\n${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('19035907828017');
    setBankCopied(true);
    setTimeout(() => setBankCopied(false), 2000);
  };

  const handleGenerateImage = async () => {
    if (!result.imagePrompt) return;
    setIsGeneratingImage(true);
    setImageError(false);
    try {
      const base64 = await generateImageIllustration(result.imagePrompt);
      if (base64) {
        setGeneratedImage(base64);
      } else {
        setImageError(true);
      }
    } catch (e) {
      setImageError(true);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `thien-master-ai-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col animate-fade-in-up border border-white/10 shadow-2xl h-auto">
      <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md sticky top-0 z-10">
        <h2 className="font-bold flex items-center gap-3 text-white text-lg">
          {isVideoScript ? <Film className="w-6 h-6 text-red-500" /> : <Facebook className="w-6 h-6 text-blue-500" />}
          {isVideoScript ? 'KỊCH BẢN ĐIỆN ẢNH' : 'NỘI DUNG ĐỀ XUẤT'}
        </h2>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl text-base font-medium flex items-center gap-2 transition-all ${
            copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
          }`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Đã lưu' : 'Sao chép'}
        </button>
      </div>

      <div className="p-8 bg-black/20">
        
        {/* Donation/Congrats - Gold Dark Theme */}
        <div className="mb-10 relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
           <div className="relative bg-[#0f1218] rounded-2xl border border-amber-500/30 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 p-4 text-center border-b border-amber-500/20">
                 <h3 className="text-amber-400 font-bold text-base uppercase tracking-widest flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                    Content Triệu View Đã Sẵn Sàng!
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                 </h3>
              </div>
              <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                 <div className="flex-1">
                    <p className="text-gray-400 text-base mb-4">
                       Mời <span className="font-bold text-amber-500">THIỆN</span> ly cà phê <span className="text-white bg-red-600 px-2 py-0.5 rounded text-sm font-bold">99K</span> nếu bạn thích App này nhé! ❤️
                    </p>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
                       <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-red-500" />
                          <div>
                             <div className="text-xs text-gray-500 uppercase font-bold">Techcombank</div>
                             <div className="text-lg font-black text-white tracking-widest">1903 5907 8280 17</div>
                          </div>
                       </div>
                       <button onClick={handleCopyBank} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${bankCopied ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-300'}`}>
                          {bankCopied ? 'COPIED' : 'COPY'}
                       </button>
                    </div>
                 </div>
                 <div className="w-24 h-24 bg-white p-2 rounded-xl flex-shrink-0 shadow-lg">
                    <img src="https://img.vietqr.io/image/TCB-19035907828017-compact2.png?amount=99000" alt="QR" className="w-full h-full object-contain" />
                 </div>
              </div>
           </div>
        </div>

        {/* Headline */}
        <div className="mb-8">
           <h1 className="text-2xl md:text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm">
             {result.headline}
           </h1>
        </div>

        {/* Content */}
        {isVideoScript ? (
            <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 p-8 shadow-inner font-mono text-gray-300 text-base whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {result.content}
            </div>
        ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-8 text-gray-900 transform transition-all hover:scale-[1.01]">
              <div className="p-5 flex gap-4 border-b border-gray-100">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">AI</div>
                 <div>
                   <div className="font-bold text-base">Chuyên Gia Content</div>
                   <div className="text-sm text-gray-500">Vừa xong · 🌎</div>
                 </div>
              </div>
              <div className="px-6 py-5 text-lg leading-relaxed whitespace-pre-wrap">
                {result.content}
              </div>
              <div className="px-6 pb-6 flex flex-wrap gap-2">
                 {result.hashtags.map((tag, i) => (
                   <span key={i} className="text-blue-600 font-bold text-lg">#{tag.replace('#', '')}</span>
                 ))}
              </div>
              <div className="px-6 py-3 border-t border-gray-100 flex justify-between text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                   <ThumbsUp className="w-5 h-5" /> 12K
                </div>
                <div>5.2K Bình luận</div>
              </div>
            </div>
        )}

        {/* Image */}
        <div className="mt-8 border-t border-white/10 pt-8">
            <div className="relative group rounded-2xl overflow-hidden bg-black/40 border border-white/5 min-h-[300px] flex items-center justify-center">
            {generatedImage ? (
              <div className="relative w-full">
                <img src={generatedImage} alt="Generated" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                   <button onClick={handleDownloadImage} className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"><Download className="w-5 h-5" /> TẢI VỀ</button>
                   <button onClick={handleGenerateImage} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"><Sparkles className="w-5 h-5" /> VẼ LẠI</button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-sm text-gray-500 mb-6 italic max-w-lg mx-auto leading-relaxed">"{result.imagePrompt}"</p>
                {imageError && <div className="text-red-500 text-sm mb-4 font-bold">Lỗi tạo ảnh. Thử lại sau.</div>}
                <button 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-bold text-base shadow-xl hover:shadow-fuchsia-500/20 transition-all active:scale-95 flex items-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isGeneratingImage ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                  {isVideoScript ? 'VẼ STORYBOARD' : 'VẼ ẢNH MINH HỌA'}
                </button>
              </div>
            )}
            </div>
        </div>

        <AuthorSignature />
      </div>
    </div>
  );
};

export default ResultCard;