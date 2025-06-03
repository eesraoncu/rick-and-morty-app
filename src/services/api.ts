// API'den dönen verilerin tipini içeri aktarıyoruz
import { ApiResponse } from '../types';
// Rick and Morty API’nin temel adresi
const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Rick and Morty API'den karakter verilerini çeken asenkron fonksiyon
 * @param pageSize - Sayfa başına alınacak karakter sayısı (varsayılan: 20)
 * @param queryParams - Filtreleme için kullanılacak query parametreleri (örn. name, status)
 * @returns ApiResponse - API'den dönen karakter verisi
 */
export const fetchCharacters = async (pageSize: number = 20, queryParams: string = ''): Promise<ApiResponse> => {
  try {
    // Gelen query parametrelerini işleyip URLSearchParams nesnesine çeviriyoruz
    const query = new URLSearchParams(queryParams);
    // API'nin karakter endpoint'ine istek atmak için URL oluşturuluyor
    const url = `${BASE_URL}/character/?${query.toString()}`;
    // API'ye fetch isteği gönderiliyor
    const response = await fetch(url);
    
    // Eğer response başarılı değilse (örneğin 404, 500), hata fırlat
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Gelen veriyi JSON formatında ayrıştır
    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    // Hata durumunda konsola detaylı bilgi yazdır
    console.error('API Hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    throw error; // hatayı dışarıya aktar
  }
};
