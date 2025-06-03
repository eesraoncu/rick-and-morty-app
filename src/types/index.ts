// Rick and Morty API'den gelen bir karakterin özelliklerini tanımlar
export interface Character {
  id: number;                 // Karakterin benzersiz ID'si
  name: string;               // Karakterin adı
  status: string;             // Karakterin durumu (alive, dead, unknown)
  species: string;            // Karakterin türü (Human, Alien, vs.)
  type: string;               // Karakterin tipi (örneğin "Parasite" gibi)
  gender: string;             // Karakterin cinsiyeti (male, female, genderless, unknown)
  origin: {                   // Karakterin orijinal geldiği yer
    name: string;             // Orijin adı
    url: string;              // Orijin URL’si (detaylar için)
  };
  location: {                 // Karakterin bulunduğu mevcut lokasyon
    name: string;             // Lokasyon adı
    url: string;              // Lokasyon URL’si (detaylar için)
  };
  image: string;              // Karakterin görsel URL’si
  episode: string[];          // Karakterin göründüğü bölümlerin listesi (URL’ler)
  url: string;                // Karakterin API'deki kendi URL’si
  created: string;            // Karakterin oluşturulma tarihi (ISO format)
}

// API'den dönen yanıtın genel yapısı
export interface ApiResponse {
  info: {
    count: number;            // Toplam karakter sayısı
    pages: number;            // Toplam sayfa sayısı
    next: string | null;      // Sonraki sayfa URL’si (varsa)
    prev: string | null;      // Önceki sayfa URL’si (varsa)
  };
  results: Character[];       // Belirli sayfadaki karakterler listesi
}

// Uygulama içinde filtreleme durumunu tutan yapı
export interface FilterState {
  name: string;               // Arama yapılacak karakter ismi
  status: string;             // Filtrelenecek durum
  species: string;            // Filtrelenecek tür
  gender: string;             // Filtrelenecek cinsiyet
  page: number;               // Şu anki sayfa numarası
  pageSize: number;           // Sayfa başına gösterilecek karakter sayısı
  sortBy: 'name' | 'status' | 'species' | 'gender'; // Sıralanacak alan
  sortOrder: 'asc' | 'desc';  // Sıralama yönü (artan/azalan)
}

// Sıralama yapılabilecek alanları tanımlar
export type SortField = 'name' | 'status' | 'species' | 'gender';

// Sıralama yönünü tanımlar
export type SortOrder = 'asc' | 'desc';
