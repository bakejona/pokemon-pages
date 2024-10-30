"use client";
import { useEffect, useState } from 'react';
import usePokemonApi from '@/hooks/usePokemonApi';
import CategoryList from '@/components/CategoryList/CategoryList';
import styles from './categories.module.css';

export default function Categories() {
  const { 
    eggGroups, 
    habitats, 
    getEggGroups, 
    getHabitats, 
    getPokemonByCategory,
    pokemonByCategory 
  } = usePokemonApi();
  
  const [activeTab, setActiveTab] = useState('egg-group');

  useEffect(() => {
    const fetchCategories = async () => {
      if (eggGroups.length === 0) await getEggGroups();
      if (habitats.length === 0) await getHabitats();
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = async (categoryType, categoryName) => {
    await getPokemonByCategory(categoryType, categoryName);
  };

  const getPokemonList = (categoryType, categoryName) => {
    return pokemonByCategory[`${categoryType}-${categoryName}`] || [];
  };

  return (
    <main className={styles.categoriesPage}>
      <h1>Pokémon Categories</h1>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'egg-group' ? styles.active : ''}`}
          onClick={() => setActiveTab('egg-group')}
        >
          Egg Groups
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'pokemon-habitat' ? styles.active : ''}`}
          onClick={() => setActiveTab('pokemon-habitat')}
        >
          Habitats
        </button>
      </div>

      {activeTab === 'egg-group' && (
        <CategoryList
          categories={eggGroups}
          categoryType="egg-group"
          onCategorySelect={handleCategorySelect}
          pokemonList={getPokemonList('egg-group', eggGroups[0]?.name)}
        />
      )}

      {activeTab === 'pokemon-habitat' && (
        <CategoryList
          categories={habitats}
          categoryType="pokemon-habitat"
          onCategorySelect={handleCategorySelect}
          pokemonList={getPokemonList('pokemon-habitat', habitats[0]?.name)}
        />
      )}
    </main>
  );
}