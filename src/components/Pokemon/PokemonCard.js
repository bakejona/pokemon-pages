"use client";
import Link from 'next/link';
import pokemonStyles from "./pokemon.module.css";
import usePokemonApi from "@/hooks/usePokemonApi";
import { useEffect, useState } from 'react';

export default function PokemonCard({ id, img = "", name = "", types = [] }) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = () => {
      const favorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
      setIsFavorited(favorites.some(pokemon => pokemon.id === id));
    };

    checkFavoriteStatus();
    
    window.addEventListener('storage', checkFavoriteStatus);
    
    return () => {
      window.removeEventListener('storage', checkFavoriteStatus);
    };
  }, [id]);

  const typesJsx = types
    .map(function (typeObj) {
      return typeObj.type.name;
    })
    .join(", ");

  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    const favorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
    
    if (isFavorited) {
      const newFavorites = favorites.filter(pokemon => pokemon.id !== id);
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      setIsFavorited(false);
    } else {
      const newFavorite = {
        id,
        name,
        img,
        types
      };
      const newFavorites = [...favorites, newFavorite];
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      setIsFavorited(true);
    }

    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Link href={`/pokemon/${id}`} className={pokemonStyles.pokeCard}>
      <img src={img} alt={name} />
      <div>
        <h4>{name}</h4>
        <p>
          <span>{typesJsx}</span>
        </p>
        <button 
          onClick={handleFavoriteClick}
          className={`${pokemonStyles.favoriteButton} ${isFavorited ? pokemonStyles.favorited : ''}`}
        >
          {isFavorited ? '★' : '☆'}
        </button>
      </div>
    </Link>
  );
}