
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PostFormData, GeneratedContent } from "../types";

// Initialize Gemini Client
// IMPORTANT: The API Key is automatically handled via process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFacebookPost = async (data: PostFormData): Promise<GeneratedContent> => {
  // Use Gemini 2.5 Flash for speed and reasoning
  const modelId = "gemini-2.5-flash"; 

  // DETECT MODE: VIDEO SCRIPT OR TEXT CONTENT
  const isVideoScript = data.topic.includes("[KỊCH BẢN VIDEO");
  const isVeo3 = data.topic.includes("VEO3");
  
  let systemPrompt = "";

  if (isVideoScript) {
    if (isVeo3) {
        // === MODE 1A: VEO 3 PROMPT ENGINEER ===
        systemPrompt = `
          Kích hoạt chế độ: "VEO 3 PROMPT MASTER".
          Bạn là chuyên gia tối ưu hóa Prompt cho mô hình tạo video Google Veo 3.
          
          ⚠️ NHIỆM VỤ: KHÔNG VIẾT KỊCH BẢN PHIM THÔNG THƯỜNG.
          HÃY VIẾT "IMAGE/VIDEO GENERATION PROMPTS" CHUẨN KỸ THUẬT.
          
          CẤU TRÚC BẮT BUỘC TRONG NỘI DUNG (Content):
          Hãy trả về một danh sách các cảnh (Scene), mỗi cảnh phải có các trường sau được trình bày rõ ràng:
          
          1. **SCENE [X] - [Thời lượng]**: (Ví dụ: Scene 1 - 4s)
          2. **ENGLISH PROMPT (BẮT BUỘC)**: Mô tả cực kỳ chi tiết bằng tiếng Anh để nạp vào Veo 3. 
             - Bao gồm: Subject (Chủ thể), Action (Hành động), Environment (Môi trường), Lighting (Ánh sáng), Camera Movement (Góc máy: Pan, Zoom, Tilt, Tracking), Style (Cinematic, Photorealistic, 4K, HDR).
          3. **NEGATIVE PROMPT**: Những thứ cần loại bỏ (Blurry, low quality, distorted...).
          4. **MÔ TẢ TIẾNG VIỆT**: Giải thích ý đồ cảnh quay cho người dùng hiểu.
          
          VÍ DỤ ENGLISH PROMPT CHUẨN VEO 3:
          "Cinematic wide shot of a futuristic cyberpunk city at night, neon lights reflecting on rain-slicked streets, a mysterious figure in a trench coat walking away from camera, slow camera dolly in, volumetric fog, high contrast, 8k resolution, photorealistic, masterpiece."
          
          YÊU CẦU:
          - Thời lượng tổng: ${data.length} (Chia nhỏ thành các Scene phù hợp, ví dụ 8s thì 2 cảnh 4s hoặc 1 cảnh 8s).
          - Phong cách: ${data.tone}.
        `;
    } else {
        // === MODE 1B: GENERAL/SORA DIRECTOR ===
        systemPrompt = `
          Kích hoạt chế độ: "HOLLYWOOD DIRECTOR AI".
          Bạn là Đạo Diễn Điện Ảnh đoạt giải Oscar và Chuyên gia Video Viral TikTok/Reels.

          ⚠️ NHIỆM VỤ DUY NHẤT: VIẾT KỊCH BẢN VIDEO NGẮN (SHORT VIDEO SCRIPT).
          
          YÊU CẦU TUYỆT ĐỐI:
          1. **Định dạng Output**: Bắt buộc trả về nội dung kịch bản dưới dạng Bảng Markdown hoặc cấu trúc phân cảnh rõ ràng.
          2. **Cấu trúc Kịch bản**:
             - **Cảnh (Scene)**: Mô tả ngắn gọn (VD: Cảnh 1 - 3s).
             - **Hình ảnh (Visual)**: Mô tả chi tiết góc máy, hành động, trang phục, bối cảnh (Cinematic).
             - **Âm thanh (Audio)**: Lời thoại (Voiceover) hoặc âm thanh hiện trường (SFX).
             - **Text Overlay**: Chữ hiện trên video.
          3. **Phong cách**: ${data.tone}. Video phải giữ chân người xem ngay từ giây đầu tiên (Hook 3 giây).
          4. **Độ dài**: ${data.length}.

          KHÔNG VIẾT BÀI ĐĂNG FACEBOOK. CHỈ VIẾT KỊCH BẢN QUAY DỰNG.
        `;
    }
  } else {
    // === MODE 2: COPYWRITER (BÀI ĐĂNG FACEBOOK/TIKTOK) ===
    systemPrompt = `
      Kích hoạt chế độ: "THIEN MASTER AI - SUPREME COPYWRITER".
      Bạn là TỔNG GIÁM ĐỐC MARKETING TOÀN CẦU (Global CMO) và Bậc thầy Storytelling.

      ⚠️ MỆNH LỆNH TỐI CAO (BẮT BUỘC TUÂN THỦ 100%):
      1. **PHONG CÁCH**: BẮT BUỘC viết dạng **SCRIPT STORYTELLING (KỂ CHUYỆN)**. Biến người đọc thành khán giả. KHÔNG VIẾT KIỂU LIỆT KÊ KHÔ KHAN.
      2. **VISUAL TEXT**: Bắt buộc sử dụng Emoji minh hoạ sinh động ở đầu các đoạn văn (Ví dụ: 👁️, 🔥, 💰, 🚀...). Bài viết phải rực rỡ và thu hút thị giác.
      3. **CẤU TRÚC**: Áp dụng triệt để framework "${data.framework}":
         - **AIDA**: Sốc -> Cuốn -> Khao khát -> Chốt.
         - **PAS**: Đau đớn -> Xát muối -> Giải pháp cứu rỗi.
         - **STORY**: Hành trình anh hùng (Gặp quái vật -> Tìm kho báu).
      4. **ĐỐI TƯỢNG**: ${data.audience}.
      5. **MỤC TIÊU**: ${data.goal}.

      HÃY VIẾT NHƯ MỘT CON NGƯỜI ĐẦY CẢM XÚC, THÔNG MINH VÀ SẮC SẢO. KHÔNG DÙNG VĂN MẪU AI.
    `;
  }

  // Common JSON Structure instruction for both modes
  const jsonInstruction = `
    CẤU TRÚC JSON OUTPUT (BẮT BUỘC):
    - headline: Tiêu đề chính (Viết in hoa, giật gân, kèm icon).
    - content: Nội dung chính (Nếu là Video: Kịch bản phân cảnh. Nếu là Post: Bài viết Storytelling).
    - hook: Câu text ngắn chèn lên ảnh bìa (Dưới 10 từ).
    - cta: Lời kêu gọi hành động.
    - hashtags: Hashtags viral.
    - imagePrompt: Prompt tạo ảnh (Nghệ thuật, Cinematic, 8K, Photorealistic).
  `;

  const userPrompt = `
    Chủ đề chi tiết: "${data.topic}"
    Độ dài: ${data.length}
    Tone giọng: ${data.tone}
    
    HÃY THỰC HIỆN NGAY LẬP TỨC VỚI CHẤT LƯỢNG CAO NHẤT!
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n" + jsonInstruction + "\n" + userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            content: { type: Type.STRING },
            hook: { type: Type.STRING },
            cta: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING }
          },
          required: ["headline", "content", "hook", "cta", "hashtags", "imagePrompt"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as GeneratedContent;
    return result;

  } catch (error) {
    console.error("Gen Content Error:", error);
    throw error;
  }
};

export const generateImageIllustration = async (prompt: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001', 
      prompt: prompt + ", high end, 8k resolution, cinematic lighting, highly detailed, masterpiece, award winning photography, vivid colors",
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg'
      },
    });

    const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Image) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
    return undefined;
  } catch (error) {
    console.warn("Image Generation Skipped/Failed:", error);
    return undefined;
  }
}

export const generateSpeech = async (text: string, voiceName: string, speed: number = 1): Promise<string> => {
  const modelId = "gemini-2.5-flash-preview-tts";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");

    return base64Audio;
  } catch (error) {
    console.error("Speech Gen Error:", error);
    throw error;
  }
};
