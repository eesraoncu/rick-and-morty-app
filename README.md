# Rick and Morty Karakter Uygulaması

Bu proje, Rick and Morty API'sini kullanarak karakterleri listeleyen, filtreleyen ve detaylarını görüntüleyen modern bir web uygulamasıdır. React ve TypeScript kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- 📋 Karakter listesi tablo görünümü
- 🔍 İsim, durum ve cinsiyet bazlı filtreleme
- 📊 Sütunlara göre sıralama (artan/azalan)
- 📱 Responsive tasarım
- 🖼️ Karakter detay görünümü
- 📄 Sayfalama sistemi
- ⚡ Performans optimizasyonları
- 🎨 Modern ve kullanıcı dostu arayüz

## 🛠️ Teknolojiler

- React 18
- TypeScript
- CSS3 (Modern özellikler ve değişkenler)
- Rick and Morty API

## 📁 Proje Yapısı

```
rick-and-morty-app/
├── src/
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   ├── context/          # React Context dosyaları
│   ├── services/         # API servisleri
│   ├── styles/           # CSS dosyaları
│   ├── types/            # TypeScript tip tanımlamaları
│   ├── App.tsx           # Ana uygulama bileşeni
│   └── index.tsx         # Uygulama giriş noktası
├── public/               # Statik dosyalar
├── package.json          # Proje bağımlılıkları
└── tsconfig.json         # TypeScript yapılandırması
```

## 🚀 Başlangıç
Projeyi Github Pages ile çalıştırmak için:

https://eesraoncu.github.io/rick-and-morty-app/
Yukarıdaki linki tarayıcınızda açabilirsiniz.

Projeyi yerel makinenizde çalıştırmak için:

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/rick-and-morty-app.git
   ```

2. Proje dizinine gidin:
   ```bash
   cd rick-and-morty-app
   ```

3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm start
   ```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 💻 Kullanım

### Filtreleme
- İsim arama kutusunu kullanarak karakterleri isme göre filtreleyebilirsiniz
- Durum filtresi ile karakterleri "Alive", "Dead" veya "Unknown" durumlarına göre filtreleyebilirsiniz
- Cinsiyet filtresi ile karakterleri cinsiyetlerine göre filtreleyebilirsiniz

### Sıralama
- Tablo başlıklarına tıklayarak karakterleri ilgili sütuna göre sıralayabilirsiniz
- Tekrar tıklayarak sıralama yönünü değiştirebilirsiniz (artan/azalan)

### Detay Görünümü
- Tablodaki herhangi bir karaktere tıklayarak detaylı bilgilerini görüntüleyebilirsiniz
- Detay görünümünde karakterin resmi ve tüm özellikleri listelenir

### Sayfalama
- Sayfa başına gösterilecek karakter sayısını seçebilirsiniz (20, 50, 100, 250)
- Önceki/Sonraki butonları ile sayfalar arasında gezinebilirsiniz

## 🛠️ Geliştirme

### TypeScript Tip Tanımlamaları
Proje, TypeScript ile geliştirilmiştir ve tip güvenliği sağlar. Önemli tip tanımlamaları:

- `Character`: Karakter veri yapısı
- `ApiResponse`: API yanıt yapısı
- `FilterState`: Filtreleme durumu

### Stil Yapısı
CSS değişkenleri kullanılarak tutarlı bir tema uygulanmıştır:
- Renk paleti
- Boşluk ve kenar yuvarlaklığı değerleri
- Responsive tasarım breakpoint'leri

Proje Linki: [https://github.com/eesraoncu/rick-and-morty-app](https://github.com/eesraoncu/rick-and-morty-app)
