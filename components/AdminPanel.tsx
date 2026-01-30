import React, { useState } from 'react';
import { Shield, ExternalLink, Trash2, X, Users, Database, FileSpreadsheet, CheckCircle, RefreshCw, Cloud, Clock } from 'lucide-react';
import { openSheetForEditing } from '../services/sheetService';
import { VipUserInfo } from '../types';

interface AdminPanelProps {
  vipUsers: VipUserInfo[];
  onSync: () => Promise<void>;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ vipUsers, onSync, onClose }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSync = async () => {
      setIsSyncing(true);
      await onSync();
      setIsSyncing(false);
      setNotification("✅ Đã cập nhật dữ liệu mới nhất từ Google Sheet!");
      setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full h-full animate-fade-in-up">
      
      {/* Header of Panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-900 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] border border-green-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                DATABASE CLOUD VIP
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                 <span className="flex items-center gap-1 text-green-400"><Cloud className="w-3 h-3" /> Live Connection</span>
                 <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                 <span>Sheet ID: 16NIR...</span>
              </div>
            </div>
        </div>
        
        <button 
          onClick={onClose}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10 hover:border-white/30"
        >
          <X className="w-5 h-5" /> THOÁT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          
          {/* Instructions & Actions */}
          <div className="lg:col-span-5 h-full">
            <div className="bg-[#0f172a]/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl h-full flex flex-col relative overflow-hidden group">
               {/* Decoration */}
               <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-[60px] pointer-events-none"></div>

               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                 <Database className="w-5 h-5 text-green-400" /> QUẢN LÝ DỮ LIỆU
               </h3>

               <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-200 mb-2">
                     <strong>Cách thêm thành viên mới:</strong>
                  </p>
                  <ol className="list-decimal pl-4 text-xs text-gray-400 space-y-2">
                     <li>Nhấn nút <strong>"MỞ GOOGLE SHEET"</strong> bên dưới.</li>
                     <li><strong>Cột A:</strong> Nhập Gmail.</li>
                     <li><strong>Cột B:</strong> Nhập Ngày/Giờ kích hoạt.</li>
                     <li>Quay lại đây và nhấn <strong>"LÀM MỚI DỮ LIỆU"</strong>.</li>
                  </ol>
               </div>
               
               <div className="space-y-4 mt-auto">
                 <button 
                   onClick={openSheetForEditing}
                   className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                 >
                   <ExternalLink className="w-4 h-4" /> MỞ GOOGLE SHEET (EDIT)
                 </button>

                 <button 
                   onClick={handleSync}
                   disabled={isSyncing}
                   className={`w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                     ${isSyncing ? 'opacity-70 cursor-wait' : 'hover:shadow-green-500/30'}
                   `}
                 >
                   <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                   {isSyncing ? 'ĐANG ĐỒNG BỘ...' : 'LÀM MỚI DỮ LIỆU (SYNC)'}
                 </button>
                 
                 {notification && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-200 text-xs font-bold p-3 rounded-lg flex items-center gap-2 animate-fade-in text-center justify-center">
                        <CheckCircle className="w-4 h-4" /> {notification}
                    </div>
                 )}
               </div>
            </div>
          </div>

          {/* User List Section */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-[#0f172a]/60 rounded-3xl p-6 shadow-2xl border border-white/10 h-full flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" /> DANH SÁCH CLOUD ({vipUsers.length})
                  </h3>
                  <div className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                     LIVE DATA
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar relative z-0 pb-2">
                {vipUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Database className="w-12 h-12 mb-3 opacity-20" />
                    <p>Đang tải dữ liệu từ đám mây...</p>
                  </div>
                ) : (
                  vipUsers.map((user, index) => (
                    <div key={index} className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 font-mono w-6">{(index + 1).toString().padStart(2, '0')}</span>
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold border border-white/10">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-gray-200 font-mono">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-green-400 font-mono flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded">
                         <Clock className="w-3 h-3" /> {user.activationTime}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminPanel;
