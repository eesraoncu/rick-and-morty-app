export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export interface FilterState {
  name: string;
  status: string;
  species: string;
  gender: string;
  page: number;
  pageSize: number;
  sortBy: 'name' | 'status' | 'species' | 'gender';
  sortOrder: 'asc' | 'desc';
}

export type SortField = 'name' | 'status' | 'species' | 'gender';
export type SortOrder = 'asc' | 'desc'; 