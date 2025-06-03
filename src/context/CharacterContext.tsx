// Gerekli React ve proje içi türler/fonksiyonlar import edilir
import { createContext, useContext, useReducer, type PropsWithChildren, useEffect, useCallback } from 'react';
import { FilterState, Character, ApiResponse, SortField } from '../types';
import { fetchCharacters } from '../services/api';

// Context’in tutacağı verilerin tipi tanımlanır
interface CharacterContextType {
  characters: Character[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  totalPages: number;
  updateFilters: (filters: Partial<FilterState>) => void;
  fetchData: () => Promise<void>;
}

// Başlangıç filtre durumu tanımlanır
const initialState: FilterState = {
  name: '',
  status: '',
  species: '',
  gender: '',
  page: 1,
  pageSize: 20,
  sortBy: 'name',
  sortOrder: 'asc',
};

const MAX_PAGE_SIZE = 250;

// Context oluşturulur ve varsayılan değerler atanır
const CharacterContext = createContext<CharacterContextType>({
  characters: [],
  loading: false,
  error: null,
  filters: initialState,
  totalPages: 0,
  updateFilters: () => {},
  fetchData: async () => {},
});

// useReducer için eylem (action) türleri tanımlanır
type Action =
  | { type: 'SET_CHARACTERS'; payload: ApiResponse }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> };

// Reducer fonksiyonu: state güncellemeleri burada yapılır
const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'SET_CHARACTERS':
      // Karakter verisi başarıyla yüklendiğinde state’i güncelleriz
      return {
        ...state,
        characters: action.payload.results,
        totalPages: action.payload.info.pages,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_FILTERS':
      // Filtre güncellenince yeni filtreler hazırlanır
      const newFilters = { ...state.filters };
      
      // Sayfa boyutu özel kontrolü yapılır(MAX_PAGE_SIZE’tan büyük olamaz)
      if ('pageSize' in action.payload) {
        const newPageSize = parseInt(String(action.payload.pageSize), 10);
        if (!isNaN(newPageSize) && newPageSize > 0 && newPageSize <= MAX_PAGE_SIZE) {
          newFilters.pageSize = newPageSize;
          newFilters.page = 1;  // Sayfa boyutu değiştiyse başa dönülmesi sağlanır
        }
      }

      // Diğer filtreleri güncelleriz
      Object.entries(action.payload).forEach(([key, value]) => {
        if (key !== 'pageSize' && key in newFilters) {
          (newFilters as any)[key] = value;
        }
      });

      return {
        ...state,
        filters: newFilters,
      };
    default:
      return state;
  }
};

// Provider bileşeni: Context sağlayıcısı
export const CharacterProvider = ({ children }: PropsWithChildren) => {
  // useReducer ile state yönetimi başlatılır
  const [state, dispatch] = useReducer(reducer, {
    characters: [],
    loading: false,
    error: null,
    filters: initialState,
    totalPages: 0,
  });

  // Filtreleri güncelleyen fonksiyon
  const updateFilters = (newFilters: Partial<FilterState>) => {
    console.log('Updating filters with:', newFilters); // Debug log
    dispatch({ type: 'UPDATE_FILTERS', payload: newFilters });
  };

  // Verileri API’den çekme fonksiyonu
  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const queryParams = new URLSearchParams();
      const { name, status, species, gender, page, pageSize, sortBy, sortOrder } = state.filters;
      
      console.log('Current filters state:', state.filters); // Debug log
      console.log('Fetching with pageSize:', pageSize); // Debug log

      // Filtrelere göre query parametreleri hazırlanır
      if (name) queryParams.append('name', name);
      if (status) queryParams.append('status', status);
      if (species) queryParams.append('species', species);
      if (gender) queryParams.append('gender', gender);
      
      // Sayfa numarasını 1 olarak ayarla ve tüm sonuçları al
      queryParams.set('page', '1');
      
      // İlk sayfa karakter verileri çekilir
      const data = await fetchCharacters(pageSize, queryParams.toString());
      
    
      let allResults = [...data.results];// İlk sayfanın verileri alınır
      
      // Gerekirse diğer sayfaların verileri de çekilir
      if (data.info.pages > 1) {
        const remainingPages = Math.min(data.info.pages, Math.ceil(pageSize / 20));
        console.log('Fetching remaining pages:', remainingPages); // Debug log
        
        for (let i = 2; i <= remainingPages; i++) {
          queryParams.set('page', i.toString());
          const nextPageData = await fetchCharacters(pageSize, queryParams.toString());
          allResults = allResults.concat(nextPageData.results);
        }
      }

      console.log('Total results fetched:', allResults.length); // Debug log

      // Tüm veriler alındıktan sonra sıralanır
      const sortedResults = allResults.sort((a, b) => {
        const aValue = String(a[sortBy as keyof Character]).toLowerCase();
        const bValue = String(b[sortBy as keyof Character]).toLowerCase();
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

      // Sayfa boyutuna göre sonuçlar bölünür
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, sortedResults.length);
      const paginatedResults = sortedResults.slice(startIndex, endIndex);

      console.log('Final paginated results:', paginatedResults.length); // Debug log

      // Reducer’a veriler gönderilir
      dispatch({ 
        type: 'SET_CHARACTERS', 
        payload: { 
          info: {
            ...data.info,
            pages: Math.ceil(sortedResults.length / pageSize),
            count: sortedResults.length
          },
          results: paginatedResults
        } 
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Bir hata oluştu' });
    }
  }, [state.filters]);

  // Filtrelerde değişiklik olduğunda verileri yeniden yükle yani fetchData tekrar çalışır
  useEffect(() => {
    console.log('Filters changed, fetching data...'); // Debug log
    fetchData();
  }, [fetchData]);

  // Context sağlayıcı bileşen döndürülür
  return (
    <CharacterContext.Provider
      value={{
        characters: state.characters,
        loading: state.loading,
        error: state.error,
        filters: state.filters,
        totalPages: state.totalPages,
        updateFilters,
        fetchData,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

// Custom hook: context’i tüketmek için kullanılır
export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
}; 