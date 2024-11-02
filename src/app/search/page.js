"use client";
import { useState, useEffect } from 'react';
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import styles from './search.module.css';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const { searchPokemon, getAllPokemon } = usePokemonApi();

  useEffect(() => {
    const fetchAllPokemon = async () => {
      const pokemonList = await getAllPokemon();
      setAllPokemon(pokemonList);
    };
    fetchAllPokemon();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const results = await searchPokemon(searchTerm);
      setSearchResults(results ? results.result : []);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className={styles.searchPage}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Pokémon name or ID"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      {searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <h2>Search Results</h2>
          <div className={styles.pokemonGrid}>
            {searchResults.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                img={pokemon.img}
                types={pokemon.types}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.allPokemon}>
        <h2>All Pokémon</h2>
        <div className={styles.pokemonGrid}>
          {allPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              img={pokemon.img}
              types={pokemon.types}
            />
          ))}
        </div>
      </div>
    </div>
  );
}