const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (page = 1, queryParams = '') => {
  try {
    const url = queryParams ? `${BASE_URL}/character/?${queryParams}` : `${BASE_URL}/character/?page=${page}`;
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
