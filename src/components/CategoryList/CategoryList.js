"use client";
import { useState } from 'react';
import PokemonCard from '../Pokemon/PokemonCard';
import styles from './categoryList.module.css';

export default function CategoryList({ 
  categories, 
  categoryType, 
  onCategorySelect, 
  pokemonList 
}) {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category.name);
    await onCategorySelect(categoryType, category.name);
  };

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryList}>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category)}
            className={`${styles.categoryButton} ${
              selectedCategory === category.name ? styles.selected : ''
            }`}
          >
            {category.name.replace('-', ' ')}
          </button>
        ))}
      </div>
      <div className={styles.pokemonGrid}>
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            img={pokemon.img}
            types={pokemon.types}
          />
        ))}
      </div>
    </div>
  );
}