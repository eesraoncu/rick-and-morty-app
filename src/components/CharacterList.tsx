import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { Character } from '../types';

// Tek bir karakteri görsel ve bilgilerle gösteren kart bileşeni tanımlaması
const CharacterCard = ({ character }: { character: Character }) => (
  <div className="character-card">
    <img src={character.image} alt={character.name} />

    {/* Karakter bilgileri */}
    <div className="character-info">
      <h3>{character.name}</h3>
      <p>
        {/* Duruma göre renkli durum göstergesi */}
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

// Karakter listesini ve sayfalama kontrollerini gösteren ana bileşen
export const CharacterList = () => {
  // Context üzerinden karakterler, durumlar ve filtreleme bilgileri alınır
  const { characters, loading, error, filters, totalPages, updateFilters } = useCharacterContext();

  // Yüklenme durumu gösterilir
  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  // Hata varsa gösterilir
  if (error) {
    return <div className="error">{error}</div>;
  }

   // Sonuç bulunamazsa mesaj gösterilir
  if (characters.length === 0) {
    return <div className="no-results">Sonuç bulunamadı</div>;
  }

  // Sayfa değiştirme işlemi
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

      {/* Sayfalama bileşeni */}
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