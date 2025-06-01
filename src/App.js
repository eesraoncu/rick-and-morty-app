import React, { useEffect, useState, useMemo } from 'react';
import { fetchCharacters } from './services/api';
import './styles/App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({});
  const [pageSize, setPageSize] = useState(20); // Yeni: kullanıcıya kaç karakter gösterileceğini seçtir

  const [nameFilter, setNameFilter] = useState('');
  const [tempNameFilter, setTempNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setNameFilter(tempNameFilter);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [tempNameFilter]);

  // API çağrısı
  useEffect(() => {
    const totalNeeded = pageSize;
    const pagesToFetch = Math.ceil(totalNeeded / 20);
    const startIndex = (page - 1) * pageSize;

    const query = new URLSearchParams();
    if (nameFilter) query.append('name', nameFilter);
    if (statusFilter) query.append('status', statusFilter);
    if (genderFilter) query.append('gender', genderFilter);

    setLoading(true);
    Promise.all(
      Array.from({ length: pagesToFetch }, (_, i) => fetchCharacters(page + i, query.toString()))
    )
      .then((results) => {
        const allChars = results.flatMap(r => r.results || []);
        const paged = allChars.slice(0, pageSize);
        setCharacters(paged);
        setInfo(results[0].info || {});
        setSelectedCharacter(null);
        setLoading(false);
      })
      .catch(() => {
        setCharacters([]);
        setInfo({});
        setSelectedCharacter(null);
        setLoading(false);
      });
  }, [page, nameFilter, statusFilter, genderFilter, pageSize]);

  // Filtre değiştiğinde sayfayı sıfırla
  useEffect(() => {
    setPage(1);
  }, [nameFilter, statusFilter, genderFilter, pageSize]);

  const sortedCharacters = useMemo(() => {
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

  const sortTable = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) return <p className="loading-text">Yükleniyor...</p>;

  return (
    <div className="app-container">
      <h1 className="app-title">Rick and Morty Karakterleri</h1>

      {/* Filtreler ve Sayfa Boyutu */}
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

      {/* Tablo veya mesaj */}
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
                <tr key={char.id} onClick={() => setSelectedCharacter(char)}>
                  <td>{char.name}</td>
                  <td>{char.species}</td>
                  <td>{char.status}</td>
                  <td>{char.gender}</td>
                  <td>{char.type || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sayfalama */}
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

      {/* Detay */}
      {selectedCharacter && (
        <div className="character-detail">
          <h2>{selectedCharacter.name} Detayları</h2>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} />
          <p><strong>Tür:</strong> {selectedCharacter.species}</p>
          <p><strong>Durum:</strong> {selectedCharacter.status}</p>
          <p><strong>Cinsiyet:</strong> {selectedCharacter.gender}</p>
          <p><strong>Türü:</strong> {selectedCharacter.type || '-'}</p>
          <p><strong>Orijin:</strong> {selectedCharacter.origin?.name}</p>
          <p><strong>Konum:</strong> {selectedCharacter.location?.name}</p>
          <button className="close-detail-button" onClick={() => setSelectedCharacter(null)}>
            Detayı Kapat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
