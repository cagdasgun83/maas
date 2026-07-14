# Maaş Günü v5.0 — Kurulum Rehberi

## Bu sürümde ne değişti

- **Kişisel veri temizlendi:** Dosyaya gömülü 61 işlemlik geçmiş veri bloğu ve "Hazır veriyi yükle" butonu kaldırıldı. Barındırılan dosyada artık hiçbir finansal bilgin yok — tüm veriler her cihazın kendi tarayıcısında (IndexedDB) saklanıyor.
- **Tam çevrimdışı:** Chart.js ve SheetJS dosyanın içine gömüldü, internet olmadan da grafikler ve Excel yedeği çalışır.
- **PWA:** manifest + service worker eklendi. iPhone'da ana ekrana eklenince kendi ikonuyla, tam ekran, uygulama gibi açılır.
- **Mobil arayüz:** Telefonda alt gezinme çubuğu (Bütçe / Portföy / Yedek), iOS odak-zoom düzeltmesi, güvenli alan (çentik) desteği.
- **Yedek hatırlatıcı:** Başlıkta "Son yedek: ..." bilgisi. 14 günü geçince sarı, 30 günü geçince kırmızı olur.

## GitHub Pages'e yükleme (5 dakika)

1. github.com'a gir (hesap yoksa ücretsiz aç) → sağ üstte **+** → **New repository**.
2. Repository name: `maas-gunu` → **Public** seç → **Create repository**.
3. Açılan sayfada **uploading an existing file** bağlantısına tıkla, bu klasördeki 7 dosyayı sürükle-bırak:
   `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`
   → **Commit changes**.
4. **Settings → Pages** → "Branch" altında `main` ve `/ (root)` seç → **Save**.
5. 1–2 dakika sonra adresin hazır: `https://KULLANICIADIN.github.io/maas-gunu/`

> Repo public olsa da endişe yok: dosyada kişisel veri yok, veriler yalnızca senin cihazlarında tutuluyor.

## iPhone'a kurulum

1. Safari'de yukarıdaki adresi aç.
2. **Paylaş** (kare + ok) → **Ana Ekrana Ekle** → **Ekle**.
3. Ana ekrandaki "Maaş Günü" ikonundan aç — artık uygulama gibi, tam ekran çalışır.

Not: Ana ekrana eklenmiş uygulamalarda veriler kalıcıdır. Safari sekmesinde açık bırakılan sürümde ise iOS, 7 gün kullanılmayan site verilerini silebilir — bu yüzden mutlaka ana ekrana ekle.

## Mevcut verini taşıma (önemli)

Yeni adres = yeni veri deposu; PC'deki eski verilerin otomatik gelmez. Taşıma için:

1. **Eski dosyada** (PC'de kullandığın HTML): **Excel'e aktar** → yedek dosyası iner.
2. **Yeni adreste** (PC veya telefon): **Excel'den al** → indirdiğin yedeği seç.

PC ↔ telefon senkronu da aynı yöntemle yapılır: bir cihazda Excel'e aktar, dosyayı diğerine geçir (AirDrop/e-posta/WhatsApp), orada Excel'den al. Alt çubuktaki **Yedek** butonu telefonda tek dokunuşla Excel yedeği indirir (Dosyalar uygulamasına kaydedilir).

## İleride güncelleme yaparken

`index.html`'de değişiklik yapıp repoya yüklediğinde, `sw.js` içindeki ilk satırlardaki sürüm adını da artır (`maas-gunu-v5.0.0` → `maas-gunu-v5.0.1`). Böylece cihazlardaki önbellek yenilenir; aksi halde eski sürüm görünmeye devam edebilir. Uygulamayı kapatıp açmak güncellemeyi tamamlar.
