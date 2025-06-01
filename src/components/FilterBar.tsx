import React, { useEffect } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { SortField, SortOrder } from '../types';

export const FilterBar = () => {
  const { filters, updateFilters } = useCharacterContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters({ page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.name, filters.status, filters.species, filters.gender, filters.pageSize, updateFilters]);

  const handleFilterChange = (key: string, value: string) => {
    console.log('Changing filter:', key, 'to value:', value); // Debug log
    if (key === 'pageSize') {
      const newSize = parseInt(value, 10);
      console.log('New page size:', newSize); // Debug log
      updateFilters({ pageSize: newSize });
    } else {
      updateFilters({ [key]: value });
    }
  };

  const handleSortChange = (field: SortField) => {
    const newOrder: SortOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortBy: field, sortOrder: newOrder });
  };

  console.log('Current pageSize:', filters.pageSize); // Debug log

  return (
    <div className="filter-bar">
      <div className="search-filters">
        <input
          type="text"
          placeholder="İsim ara..."
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
        
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Durum Seçin</option>
          <option value="alive">Yaşıyor</option>
          <option value="dead">Ölü</option>
          <option value="unknown">Bilinmiyor</option>
        </select>

        <select
          value={filters.species}
          onChange={(e) => handleFilterChange('species', e.target.value)}
        >
          <option value="">Tür Seçin</option>
          <option value="Human">İnsan</option>
          <option value="Alien">Uzaylı</option>
          <option value="Humanoid">İnsansı</option>
          <option value="unknown">Bilinmiyor</option>
        </select>

        <select
          value={filters.gender}
          onChange={(e) => handleFilterChange('gender', e.target.value)}
        >
          <option value="">Cinsiyet Seçin</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
          <option value="genderless">Cinsiyetsiz</option>
          <option value="unknown">Bilinmiyor</option>
        </select>
      </div>

      <div className="sort-options">
        <button
          onClick={() => handleSortChange('name')}
          className={filters.sortBy === 'name' ? 'active' : ''}
        >
          İsim {filters.sortBy === 'name' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSortChange('status')}
          className={filters.sortBy === 'status' ? 'active' : ''}
        >
          Durum {filters.sortBy === 'status' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSortChange('species')}
          className={filters.sortBy === 'species' ? 'active' : ''}
        >
          Tür {filters.sortBy === 'species' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      <div className="page-size">
        <label htmlFor="pageSize">Sayfa Başına Karakter:</label>
        <select
          id="pageSize"
          value={filters.pageSize}
          onChange={(e) => handleFilterChange('pageSize', e.target.value)}
        >
          <option value="10">10 karakter</option>
          <option value="20">20 karakter</option>
          <option value="50">50 karakter</option>
          <option value="100">100 karakter</option>
          <option value="250">250 karakter</option>
        </select>
      </div>
    </div>
  );
}; 