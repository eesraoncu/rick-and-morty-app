import React, { useEffect } from 'react';
import { CharacterProvider } from './context/CharacterContext';
import { FilterBar } from './components/FilterBar';
import { CharacterList } from './components/CharacterList';
import './App.css';

const App = () => {
  return (
    <CharacterProvider>
      <div className="app">
        <header>
          <h1>Rick and Morty Karakterleri</h1>
        </header>
        <main>
          <FilterBar />
          <CharacterList />
        </main>
      </div>
    </CharacterProvider>
  );
};

export default App; 