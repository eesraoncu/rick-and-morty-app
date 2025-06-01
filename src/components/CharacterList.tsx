import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { Character } from '../types';

const CharacterCard = ({ character }: { character: Character }) => (
  <div className="character-card">
    <img src={character.image} alt={character.name} />
    <div className="character-info">
      <h3>{character.name}</h3>
      <p>
        <span className={`status ${character.status.toLowerCase()}`}></span>
        {character.status} - {character.species}
      </p>
      <p className="location">
        <span>Son Konum:</span>
        {character.location.name}
      </p>
      <p className="origin">
        <span>İlk Görünüm:</span>
        {character.origin.name}
      </p>
    </div>
  </div>
);

export const CharacterList = () => {
  const { characters, loading, error, filters, totalPages, updateFilters } = useCharacterContext();

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (characters.length === 0) {
    return <div className="no-results">Sonuç bulunamadı</div>;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateFilters({ page: newPage });
    }
  };

  return (
    <div className="character-list-container">
      <div className="character-grid">
        {characters.map((character: Character) => (
          <div key={character.id}>
            <CharacterCard character={character} />
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page <= 1}
        >
          Önceki
        </button>
        <span>
          Sayfa {filters.page} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page >= totalPages}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}; 