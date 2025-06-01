const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (pageSize = 20, queryParams = '') => {
  try {
    const query = new URLSearchParams(queryParams);
    // API'nin kendi sayfalama sistemini kullan
    const url = `${BASE_URL}/character/?${query.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Veri alınamadı');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
};
