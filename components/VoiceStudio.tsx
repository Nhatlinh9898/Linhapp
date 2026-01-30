import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Mic, Volume2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { createAudioBlob, base64ToUint8Array } from '../services/audioUtils';
import { VoiceConfig } from '../types';

interface VoiceStudioProps {
  text: string;
}

const VOICES: VoiceConfig[] = [
  { voiceName: 'Fenrir', speed: 1, label: 'Giọng Nam (Trầm ấm / Doanh nhân)' },
  { voiceName: 'Kore', speed: 1, label: 'Giọng Nữ (Truyền cảm / BTV)' },
];

const VoiceStudio: React.FC<VoiceStudioProps> = ({ text }) => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfig>(VOICES[1]); // Default Female
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup URL object
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleGenerateAudio = async () => {
    if (!text) return;
    setIsLoading(true);
    setAudioUrl(null);

    try {
      const base64Data = await generateSpeech(text, selectedVoice.voiceName);
      const pcmData = base64ToUint8Array(base64Data);
      
      // Gemini returns 24kHz raw PCM. We wrap it in a WAV container.
      const blob = createAudioBlob(pcmData, 24000);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      alert("Failed to generate audio. Please check API Key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => setIsPlaying(false);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-blue-700/50 mt-6">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">VOICE STUDIO PRO</h3>
          <p className="text-blue-200 text-xs">Chuyển văn bản thành giọng đọc AI siêu thực</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-blue-300 uppercase mb-2 block">Chọn Giọng Đọc</label>
          <div className="space-y-2">
            {VOICES.map((voice) => (
              <button
                key={voice.voiceName}
                onClick={() => {
                  setSelectedVoice(voice);
                  setAudioUrl(null); // Reset audio when voice changes
                }}
                className={`w-full p-3 rounded-lg text-left text-sm font-medium transition-all flex items-center justify-between ${
                  selectedVoice.voiceName === voice.voiceName
                    ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                    : 'bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
              >
                {voice.label}
                {selectedVoice.voiceName === voice.voiceName && <Volume2 className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-end">
           <button
            onClick={handleGenerateAudio}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-blue-800 cursor-wait' 
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 active:scale-95'
              }`}
          >
            {isLoading ? 'Đang tạo âm thanh...' : (!audioUrl ? '🎤 TẠO FILE ÂM THANH' : '🎤 TẠO LẠI')}
          </button>
        </div>
      </div>

      {audioUrl && (
        <div className="bg-black/30 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm border border-white/10 animate-fade-in">
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={handleEnded} 
            // Apply playback rate if needed manually, though basic audio element support is limited for blob sources sometimes without re-rendering
          />
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-white text-blue-900 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <div className="flex-1 mx-4 h-2 bg-white/20 rounded-full overflow-hidden">
             {/* Simple visualizer placeholder */}
             <div className={`h-full bg-gradient-to-r from-green-400 to-blue-400 ${isPlaying ? 'animate-pulse w-full' : 'w-0'} transition-all duration-300`}></div>
          </div>

          <a
            href={audioUrl}
            download={`voice_${selectedVoice.voiceName}_${Date.now()}.wav`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Tải MP3/WAV
          </a>
        </div>
      )}
    </div>
  );
};

export default VoiceStudio;
