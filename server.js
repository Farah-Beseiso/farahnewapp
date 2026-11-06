import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

// .env dosyasındaki ortam değişkenlerini yükle
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// JSON gövdelerini işlemek için middleware
app.use(express.json());

// Statik dosyaları (HTML, CSS, JS) 'public' klasöründen sun
app.use(express.static(path.join(__dirname, "public")));

/**
 * Çeviri API Uç Noktası (POST /api/translate)
 */
app.post("/api/translate", async (req, res) => {
  const { text, sourceLang, targetLang, domain, tone, glossary } = req.body;

  // 1. API Anahtarı Kontrolü
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
  if (!apiKey || apiKey === "BURAYA_GEMINI_API_KEY_YAPISTIRIN") {
    return res.status(400).json({
      error: "Gemini API anahtarı bulunamadı. Lütfen '.env' dosyasına geçerli bir GEMINI_API_KEY girip sunucuyu yeniden başlatın.",
      type: "MISSING_KEY"
    });
  }

  // 2. Metin Kontrolü
  if (!text || !text.trim()) {
    return res.status(400).json({
      error: "Lütfen çevrilecek bir metin girin.",
      type: "EMPTY_TEXT"
    });
  }

  try {
    // GoogleGenerativeAI istemcisini başlat
    const genAI = new GoogleGenerativeAI(apiKey);

    // Terimce (Glossary) kurallarını hazırla
    let glossaryInstructions = "";
    if (glossary && glossary.trim()) {
      const lines = glossary
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && l.includes("="));

      if (lines.length > 0) {
        glossaryInstructions = `
[ZORUNLU TERİM LİSTESİ - GLOSSARY]:
Metinde geçen aşağıdaki kaynak terimleri MUTLAKA belirtilen hedef karşılıklarıyla çevir:
${lines.map((l) => `- ${l}`).join("\n")}
`;
      }
    }

    // Sistem Talimatı (Prompt Mühendisliği)
    const systemInstruction = `Sen profesyonel, yüksek doğrulukta bir makine çevirisi motorusun.
GÖREV: Sana verilen metni kaynak dilden (${sourceLang || "Otomatik Algıla"}) hedef dile (${targetLang || "Türkçe"}) çevir.

KURALLAR:
1. Alan / Disiplin: ${domain || "Genel"} alanına uygun terminoloji ve sözcük dağarcığı kullan.
2. Üslup / Ton: ${tone || "Resmi"} bir dil kullan.
${glossaryInstructions}
3. KESİN ÇIKTI KURALI:
- YALNIZCA VE SADECE hedef dildeki çevrilmiş metni döndür.
- Başında veya sonunda "İşte çeviri:", "Translation:", tırnak işaretleri, açıklama veya ek notlar KESİNLİKLE OLMAMALIDIR.
- Orijinal metnin satır başlarını ve paragraf yapısını koru.`;

    // gemini-flash-lite-latest en hafif, ultra düşük gecikmeli ve güncel Flash-Lite modelidir
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.2 // Tutarlı ve sadık çeviri için düşük sıcaklık
      }
    });

    // Metni modele gönder
    const result = await model.generateContent(text);
    const response = await result.response;
    const translatedText = response.text() ? response.text().trim() : "";

    return res.json({ translatedText });
  } catch (error) {
    console.error("Gemini API Hatası:", error);

    const errorMessage = error?.message || "";
    let userFriendlyMessage = "Çeviri sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
    let errorType = "UNKNOWN";

    // Hata tipini belirleme ve kullanıcıya Türkçe çözüm önerisi sunma
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid") || errorMessage.includes("INVALID_ARGUMENT") || errorMessage.includes("401")) {
      userFriendlyMessage = "API anahtarınız geçersiz görünüyor. Lütfen .env dosyasındaki GEMINI_API_KEY değerini kontrol edin.";
      errorType = "INVALID_KEY";
    } else if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429")) {
      userFriendlyMessage = "Gemini API kullanım kotanız doldu veya istek sınırı aşıldı. Lütfen bir süre bekleyip tekrar deneyin.";
      errorType = "QUOTA_EXCEEDED";
    } else if (errorMessage.includes("FETCH_ERROR") || errorMessage.includes("ECONNREFUSED") || errorMessage.includes("ENOTFOUND")) {
      userFriendlyMessage = "İnternet bağlantısı kurulamadı veya Google sunucularına erişilemiyor. Lütfen internet bağlantınızı kontrol edin.";
      errorType = "NETWORK_ERROR";
    } else {
      userFriendlyMessage = `Hata Detayı: ${errorMessage}`;
    }

    return res.status(500).json({
      error: userFriendlyMessage,
      type: errorType
    });
  }
});

// Sunucuyu dinlemeye başla
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Çeviri Uygulaması Başarıyla Çalışıyor!`);
  console.log(`🌐 Tarayıcıdan açın: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
