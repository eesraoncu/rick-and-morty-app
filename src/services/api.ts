import { ApiResponse } from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (pageSize: number = 20, queryParams: string = ''): Promise<ApiResponse> => {
  try {
    const query = new URLSearchParams(queryParams);
    // API'nin kendi sayfalama sistemini kullan
    const url = `${BASE_URL}/character/?${query.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    throw error;
  }
};
