//Bu kısımda React kütüphanesinden bileşenler, API çağrıları için gerekli fonksiyonlar ve CSS stilleri içe aktarılır.
import React, { useEffect, useState } from 'react';
import { fetchCharacters } from './services/api';
import { Character, ApiResponse } from './types';
import './styles/App.css';

function App() {
  // Yükleme durumu, sayfa numarası, toplam bilgi ve sayfa boyutu için state tanımları  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<ApiResponse['info']>({ count: 0, pages: 0, next: null, prev: null });
  const [pageSize, setPageSize] = useState(20);

  // Filtreler ve sıralama için state tanımları
  // İsim filtresi için geçici state, debouncing için kullanılır
  const [nameFilter, setNameFilter] = useState('');
  const [tempNameFilter, setTempNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Character | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  //Kullanıcının yazdığı isme göre 500ms bekleyip filtreleme yapılmasını sağlar (debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setNameFilter(tempNameFilter);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [tempNameFilter]);

  // API çağrısı kullanarak filtreler ve sayfa boyutuna göre karakterleri alır
  useEffect(() => {
    const totalNeeded = pageSize;
    const pagesToFetch = Math.ceil(totalNeeded / 20);
    const startIndex = (page - 1) * pageSize;

    const query = new URLSearchParams();
    if (nameFilter) query.append('name', nameFilter);
    if (statusFilter) query.append('status', statusFilter);
    if (genderFilter) query.append('gender', genderFilter);

    setLoading(true);
    // Gerekli sayıda sayfa için API çağrıları yapılır
    Promise.all(
      Array.from({ length: pagesToFetch }, (_, i) => fetchCharacters(page + i, query.toString()))
    )
      .then((results) => {
        const allChars = results.flatMap(r => r.results || []);
        const paged = allChars.slice(0, pageSize);
        setCharacters(paged);
        setInfo(results[0].info || { count: 0, pages: 0, next: null, prev: null });
        setSelectedCharacter(null);
        setLoading(false);
      })
      .catch(() => {
        setCharacters([]);
        setInfo({ count: 0, pages: 0, next: null, prev: null });
        setSelectedCharacter(null);
        setLoading(false);
      });
  }, [page, nameFilter, statusFilter, genderFilter, pageSize]);

   // Filtreler değiştiğinde sayfa numarası sıfırlanır
  useEffect(() => {
    setPage(1);
  }, [nameFilter, statusFilter, genderFilter, pageSize]);

  // Karakterleri seçilen alana göre sıralar
  const sortedCharacters = React.useMemo(() => {
    if (!sortField) return characters;
    return [...characters].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [characters, sortField, sortOrder]);

  // Tablodaki sütunlara tıklanınca sıralama yönünü değiştirir
  const sortTable = (field: keyof Character) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Yüklenme ekranı
  if (loading) return <p className="loading-text">Yükleniyor...</p>;

  return (
    <div className="app-container">
      <h1 className="app-title">Rick and Morty Karakterleri</h1>

      {/* Filtreler ve sayfa boyutu ayarı */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="İsim ile ara"
          value={tempNameFilter}
          onChange={(e) => setTempNameFilter(e.target.value)}
          className="filter-input"
        />

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Durum (Tümü)</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <select 
          value={genderFilter} 
          onChange={(e) => setGenderFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Cinsiyet (Tümü)</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>

        <select 
          value={pageSize} 
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="filter-select"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
        </select>
      </div>

      {/* Tablo ya da sonuç bulunamadı mesajı */}
      {sortedCharacters.length === 0 ? (
        <p className="no-results-text">Filtrelere uygun karakter bulunamadı.</p>
      ) : (
        <>
          <table className="character-table">
            <thead>
              <tr>
                <th onClick={() => sortTable('name')}>
                  Ad {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => sortTable('species')}>
                  Tür {sortField === 'species' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => sortTable('status')}>
                  Durum {sortField === 'status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => sortTable('gender')}>
                  Cinsiyet {sortField === 'gender' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => sortTable('type')}>
                  Türü {sortField === 'type' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCharacters.map((char) => (
                <React.Fragment key={char.id}>
                  <tr 
                    onClick={() => setSelectedCharacter(selectedCharacter?.id === char.id ? null : char)}
                    className={selectedCharacter?.id === char.id ? 'selected-row' : ''}
                  >
                    <td>{char.name}</td>
                    <td>{char.species}</td>
                    <td>{char.status}</td>
                    <td>{char.gender}</td>
                    <td>{char.type || '-'}</td>
                  </tr>
                  {selectedCharacter?.id === char.id && (
                    <tr className="detail-row">
                      <td colSpan={5}>
                        <div className="character-detail-inline">
                          <div className="character-detail-content">
                            <img src={char.image} alt={char.name} />
                            <div className="character-detail-info">
                              <h3>{char.name} Detayları</h3>
                              <p><strong>Tür:</strong> {char.species}</p>
                              <p><strong>Durum:</strong> {char.status}</p>
                              <p><strong>Cinsiyet:</strong> {char.gender}</p>
                              <p><strong>Türü:</strong> {char.type || '-'}</p>
                              <p><strong>Orijin:</strong> {char.origin?.name}</p>
                              <p><strong>Konum:</strong> {char.location?.name}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Sayfalama kontrolleri */}
          <div className="pagination-container">
            <button 
              className="pagination-button"
              onClick={() => setPage((p) => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              Önceki
            </button>
            <span className="page-info">Sayfa: {page}</span>
            <button 
              className="pagination-button"
              onClick={() => setPage((p) => p + 1)} 
              disabled={!info.next && characters.length < pageSize}
            >
              Sonraki
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App; 