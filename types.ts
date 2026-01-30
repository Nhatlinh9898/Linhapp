
export enum ToneType {
  WITTY = 'Hài hước / Lầy lội',
  PROFESSIONAL = 'Chuyên gia / Uy tín',
  EMOTIONAL = 'Cảm xúc / Chữa lành',
  URGENT = 'Gấp gáp / FOMO',
  STORYTELLING = 'Kể chuyện / Tâm sự',
  CONTROVERSIAL = 'Tranh luận / Góc nhìn lạ'
}

export enum FrameworkType {
  AIDA = 'AIDA (Attention - Interest - Desire - Action)',
  PAS = 'PAS (Problem - Agitation - Solution)',
  STORY = 'Hero Journey (Hành trình nhân vật)',
  LISTICLE = 'Dạng liệt kê (Top list/Tips)',
  BEFORE_AFTER = 'Before - After (Kết quả thực tế)'
}

export enum TargetAudience {
  GEN_Z = 'Gen Z (18-24)',
  OFFICE = 'Dân văn phòng (25-35)',
  PARENTS = 'Bố mẹ bỉm sữa',
  INVESTORS = 'Nhà đầu tư / Doanh nhân',
  STUDENTS = 'Học sinh / Sinh viên',
  EVERYONE = 'Đại chúng'
}

export enum PostLength {
  MICRO = 'Siêu ngắn (50 - 100 từ)',
  SHORT = 'Ngắn gọn (100 - 300 từ)',
  MEDIUM = 'Tiêu chuẩn (300 - 600 từ)',
  LONG = 'Chi tiết (600 - 1000 từ)',
  EXTENSIVE = 'Chuyên sâu (Trên 1000 từ)'
}

export interface PostFormData {
  topic: string; // The "Free Topic" input
  audience: TargetAudience;
  tone: ToneType;
  framework: FrameworkType;
  goal: string; 
  emojiDensity: 'Low' | 'Medium' | 'High';
  length: PostLength;
}

export interface GeneratedContent {
  id: string; // Unique ID for history
  timestamp: number; // Creation time
  headline: string; // Shocking title
  content: string;
  hook: string; // Brief hook for image text
  cta: string;
  hashtags: string[];
  imagePrompt: string; // Description for the AI image generator
  imageBase64?: string; // The actual generated image
}

export interface VoiceConfig {
  voiceName: string; // 'Kore' (Female) or 'Fenrir' (Male)
  speed: number;
  label: string;
}

// VIP User Info from Google Sheet
export interface VipUserInfo {
  email: string;
  activationTime: string; // From Column B in Sheet
}

// New Types for Auth
export interface UserSession {
  email: string;
  role: 'ADMIN' | 'USER';
  timestamp: number;
  activationTime?: string; // Stored in session
}
