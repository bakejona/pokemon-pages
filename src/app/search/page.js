"use client";
import { useState } from 'react';
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import styles from './search.module.css';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const { searchPokemon } = usePokemonApi();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    if (searchTerm.trim() === '') {
      setError('Please enter a Pokémon name');
      return;
    }
    const result = await searchPokemon(searchTerm);
    if (result) {
      setSearchResult(result);
    } else {
      setError('Pokémon not found');
    }
  };

  return (
    <main className={styles.searchPage}>
      <h1>Search for a Pokémon</h1>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Pokémon name"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {searchResult && (
        <div className={styles.resultContainer}>
          <PokemonCard
            name={searchResult.name}
            img={searchResult.img}
            types={searchResult.types}
          />
        </div>
      )}
    </main>
  );
}