# Gemini AI Çeviri Uygulaması 🌐✨

Gemini API kullanan, alan (domain), üslup (tone) ve özel terimce (glossary) destekli modern bir makine çevirisi uygulamasıdır.

## 🚀 Özellikler
- **Çoklu Dil Desteği:** Türkçe, İngilizce, Almanca, İspanyolca, Fransızca, İtalyanca, Rusça, Arapça ve çift yönlü hızlı değişim (swap).
- **Alan Seçimi:** Genel, Hukuk, Tıp, Teknik/Yazılım, Edebi.
- **Üslup / Ton Seçimi:** Resmi (Formal) veya Gündelik (Casual).
- **Terimce (Glossary):** `kaynak terim = hedef terim` formatında girilen kelimelerin çeviride zorunlu olarak kullanılmasını sağlar.
- **Sade ve Doğrudan Çıktı:** Modele verilen sistem talimatı sayesinde açıklama, tırnak veya "İşte çeviri:" gibi ekler olmadan saf çeviri döner.
- **Tek Tıkla Kopyalama:** Çevrilen metni panoya kopyalama ve geri bildirim animasyonu.
- **Kullanıcı Dostu Hata Yönetimi:** Geçersiz API anahtarı, kota dolumu veya ağ hatası durumunda Türkçe açıklama ve yönlendirme.
- **Mobil Uyumlu Tasarım:** Masaüstü ve telefon ekranlarına uyumlu DeepL tarzı modern iki sütunlu koyu tema.

---

## 🛠️ Kurulum ve Çalıştırma Adımları

Yeni başlayan biriyseniz aşağıdaki adımları sırasıyla uygulayabilirsiniz:

### 1. API Anahtarınızı Tanımlayın (.env)
Proje klasöründeki [.env](file:///c:/Users/PCLAB1/Documents/farah/w5/.env) dosyasını açın ve `GEMINI_API_KEY=` karşısına anahtarınızı yapıştırıp kaydedin:

```env
GEMINI_API_KEY=AIzaSy...SizinKeyiniz...
PORT=3000
```

### 2. Bağımlılıkları Yükleyin
Proje klasöründe terminali / komut satırını açıp şu komutu çalıştırın:
```bash
npm install
```
*(Paketler önceden yüklendi ancak ileride ihtiyaç olursa bu komut kullanılır)*

### 3. Uygulamayı Başlatın
```bash
npm start
```

### 4. Tarayıcıda Açın
Tarayıcınızı açın ve adres çubuğuna şu adresi girin:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Dosya Yapısı
- [server.js](file:///c:/Users/PCLAB1/Documents/farah/w5/server.js): Express backend sunucusu ve Gemini API prompt mühendisliği.
- [public/index.html](file:///c:/Users/PCLAB1/Documents/farah/w5/public/index.html): Uygulamanın modern HTML yapısı.
- [public/style.css](file:///c:/Users/PCLAB1/Documents/farah/w5/public/style.css): Koyu tema ve mobil uyumlu CSS stilleri.
- [public/app.js](file:///c:/Users/PCLAB1/Documents/farah/w5/public/app.js): İstemci tarafı olay dinleyicileri, kopyalama ve API çağrıları.
- [.env](file:///c:/Users/PCLAB1/Documents/farah/w5/.env): API anahtarı ayarı.
