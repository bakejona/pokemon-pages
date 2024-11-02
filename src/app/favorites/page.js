"use client";
import { useEffect, useState } from 'react';
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import styles from './favorites.module.css';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage when the component mounts
    const loadFavorites = () => {
      if (typeof window !== 'undefined') {
        const savedFavorites = localStorage.getItem('pokemonFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }
    };

    loadFavorites();

    // Add event listener for storage changes
    window.addEventListener('storage', loadFavorites);

    return () => {
      window.removeEventListener('storage', loadFavorites);
    };
  }, []);

  const handleRemove = (id) => {
    const newFavorites = favorites.filter(pokemon => pokemon.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
  };

  return (
    <div className={styles.favoritesPage}>
      <h1>My Favorite Pokémon</h1>
      {favorites.length === 0 ? (
        <p className={styles.noFavorites}>
          You haven't added any Pokémon to your favorites yet!
        </p>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map((pokemon) => (
            <div key={pokemon.id} className={styles.favoriteCardContainer}>
              <PokemonCard
                id={pokemon.id}
                name={pokemon.name}
                img={pokemon.img}
                types={pokemon.types}
              />
              <button
                className={styles.removeButton}
                onClick={() => handleRemove(pokemon.id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}