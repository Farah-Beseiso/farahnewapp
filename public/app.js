/**
 * Gemini Çeviri İstemci Tarafı (Frontend) Mantığı
 */

// DOM Elementleri
const sourceTextEl = document.getElementById("sourceText");
const targetTextEl = document.getElementById("targetText");
const targetPlaceholderEl = document.getElementById("targetPlaceholder");
const sourceLangEl = document.getElementById("sourceLang");
const targetLangEl = document.getElementById("targetLang");
const domainSelectEl = document.getElementById("domainSelect");
const toneSelectEl = document.getElementById("toneSelect");
const glossaryInputEl = document.getElementById("glossaryInput");
const glossarySectionEl = document.getElementById("glossarySection");
const toggleGlossaryBtn = document.getElementById("toggleGlossaryBtn");
const translateBtn = document.getElementById("translateBtn");
const translateBtnText = document.getElementById("translateBtnText");
const loadingSpinner = document.getElementById("loadingSpinner");
const copyBtn = document.getElementById("copyBtn");
const copyBtnText = document.getElementById("copyBtnText");
const swapLangsBtn = document.getElementById("swapLangsBtn");
const clearSourceBtn = document.getElementById("clearSourceBtn");
const charCountEl = document.getElementById("charCount");
const targetCharCountEl = document.getElementById("targetCharCount");
const statusIndicator = document.getElementById("statusIndicator");
const errorMessageEl = document.getElementById("errorMessage");
const errorTextEl = document.getElementById("errorText");
const closeErrorBtn = document.getElementById("closeErrorBtn");

// 1. Karakter Sayacı Takibi
sourceTextEl.addEventListener("input", () => {
  const len = sourceTextEl.value.length;
  charCountEl.textContent = `${len} karakter`;
});

// 2. Terimce Kutusunu Aç/Kapat
toggleGlossaryBtn.addEventListener("click", () => {
  glossarySectionEl.classList.toggle("hidden");
});

// 3. Hata Kutusunu Kapat
closeErrorBtn.addEventListener("click", () => {
  hideError();
});

function showError(message) {
  errorTextEl.textContent = message;
  errorMessageEl.classList.remove("hidden");
}

function hideError() {
  errorMessageEl.classList.add("hidden");
}

// 4. Dilleri Yer Değiştirme (Swap)
swapLangsBtn.addEventListener("click", () => {
  const tempLang = sourceLangEl.value;
  sourceLangEl.value = targetLangEl.value;
  targetLangEl.value = tempLang;

  // Eğer hedef metin varsa kaynak ile de yer değiştir
  if (targetTextEl.value.trim()) {
    const tempText = sourceTextEl.value;
    sourceTextEl.value = targetTextEl.value;
    targetTextEl.value = tempText;
    updateTargetView();
    charCountEl.textContent = `${sourceTextEl.value.length} karakter`;
  }
});

// 5. Kaynak Metni Temizleme
clearSourceBtn.addEventListener("click", () => {
  sourceTextEl.value = "";
  charCountEl.textContent = "0 karakter";
  sourceTextEl.focus();
});

// 6. Tek Tıkla Kopyalama Fonksiyonu
copyBtn.addEventListener("click", async () => {
  const textToCopy = targetTextEl.value;
  if (!textToCopy) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
    copyBtnText.textContent = "Kopyalandı!";
    copyBtn.style.color = "#10b981";

    setTimeout(() => {
      copyBtnText.textContent = "Kopyala";
      copyBtn.style.color = "";
    }, 2000);
  } catch (err) {
    console.error("Kopyalama başarısız:", err);
  }
});

// Hedef metin alanının görünürlüğünü güncelle
function updateTargetView() {
  const hasText = targetTextEl.value.trim().length > 0;
  if (hasText) {
    targetPlaceholderEl.style.display = "none";
    copyBtn.disabled = false;
    targetCharCountEl.textContent = `${targetTextEl.value.length} karakter`;
  } else {
    targetPlaceholderEl.style.display = "block";
    copyBtn.disabled = true;
    targetCharCountEl.textContent = "0 karakter";
  }
}

// 7. Çeviri İsteği Gönderme
async function handleTranslate() {
  const text = sourceTextEl.value.trim();

  if (!text) {
    showError("Lütfen çevrilmesini istediğiniz bir metin girin.");
    return;
  }

  hideError();

  // Yükleniyor durumunu aktifleştir
  translateBtn.disabled = true;
  loadingSpinner.classList.remove("hidden");
  translateBtnText.textContent = "Çevriliyor...";
  statusIndicator.textContent = "Gemini düşünüyor...";
  targetPlaceholderEl.textContent = "Çeviri hazırlanıyor...";
  targetTextEl.value = "";
  updateTargetView();

  try {
    const payload = {
      text: text,
      sourceLang: sourceLangEl.value,
      targetLang: targetLangEl.value,
      domain: domainSelectEl.value,
      tone: toneSelectEl.value,
      glossary: glossaryInputEl.value
    };

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Çeviri sırasında bir hata oluştu.");
    }

    // Başarılı çeviriyi kutuya yaz
    targetTextEl.value = data.translatedText;
    updateTargetView();
    statusIndicator.textContent = "Tamamlandı";
  } catch (err) {
    showError(err.message || "Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığından emin olun.");
    statusIndicator.textContent = "Hata oluştu";
    targetPlaceholderEl.textContent = "Çeviri burada görünecektir...";
  } finally {
    // Yükleniyor durumunu kapat
    translateBtn.disabled = false;
    loadingSpinner.classList.add("hidden");
    translateBtnText.textContent = "Çevir";
  }
}

// Çevir düğmesi tıklama ve Ctrl+Enter kısayolu
translateBtn.addEventListener("click", handleTranslate);

sourceTextEl.addEventListener("keydown", (e) => {
  // Ctrl + Enter veya Cmd + Enter ile hızlı çeviri
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    handleTranslate();
  }
});
