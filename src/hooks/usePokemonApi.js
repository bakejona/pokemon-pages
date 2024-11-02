"use client";
import { createContext, useContext, useState } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
    randomPokemon: [],
  });

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('pokemonFavorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    return [];
  });

  const [categories, setCategories] = useState({
    eggGroups: [],
    habitats: [],
    pokemonByCategory: {},
  });

  // Favorites functions
  const addToFavorites = (pokemon) => {
    const newFavorites = [...favorites];
    if (!newFavorites.some(fav => fav.id === pokemon.id)) {
      newFavorites.push(pokemon);
      setFavorites(newFavorites);
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (pokemonId) => {
    const newFavorites = favorites.filter(pokemon => pokemon.id !== pokemonId);
    setFavorites(newFavorites);
    localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (pokemonId) => {
    return favorites.some(pokemon => pokemon.id === pokemonId);
  };

  async function getNumberOfPokemon() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=1`
    );
    const { count: pokemonCount } = await pokeResponse.json();
    setPokemonState({ ...pokemonState, totalPokemonCount: pokemonCount });
  }
  
  async function getRandomPokemon(limit = 5) {
    if (!pokemonState.totalPokemonCount) return [];
    const pokemonIds = {};
    let pokeIndex = 0;

    while (pokeIndex < limit) {
      const randId =
        parseInt(Math.random() * pokemonState.totalPokemonCount) + 1;

      if (!pokemonIds[randId]) {
        let idToUse = randId;
        if (idToUse > 1000) {
          idToUse = "10" + String(idToUse).slice(1);
        }
        const pokeRequest = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${idToUse}`
        );
        const pokeData = await pokeRequest.json();
        pokemonIds[randId] = pokeData;
        pokeIndex++;
      }
    }

    setPokemonState({
      ...pokemonState,
      randomPokemon: Object.values(pokemonIds),
    });
  }

  function getPokemonQuickInfo(pokeData) {
    return {
      name: pokeData.name,
      id: pokeData.id,
      img: pokeData.sprites.front_default,
      types: pokeData.types,
    };
  }

  async function searchPokemon(searchTerm) {
    try {
      // Search by name
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (pokemonResponse.ok) {
        const pokemonData = await pokemonResponse.json();
        return {
          type: 'pokemon',
          result: [getPokemonQuickInfo(pokemonData)]
        };
      }

      // Search by egg group
      const eggGroupResponse = await fetch(`https://pokeapi.co/api/v2/egg-group/${searchTerm.toLowerCase()}`);
      if (eggGroupResponse.ok) {
        const eggGroupData = await eggGroupResponse.json();
        const pokemonList = await Promise.all(
          eggGroupData.pokemon_species.slice(0, 10).map(async (species) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
            return response.json();
          })
        );
        return {
          type: 'egg-group',
          result: pokemonList.map(pokemon => getPokemonQuickInfo(pokemon))
        };
      }

      // Search by habitat
      const habitatResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${searchTerm.toLowerCase()}`);
      if (habitatResponse.ok) {
        const habitatData = await habitatResponse.json();
        const pokemonList = await Promise.all(
          habitatData.pokemon_species.slice(0, 10).map(async (species) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
            return response.json();
          })
        );
        return {
          type: 'habitat',
          result: pokemonList.map(pokemon => getPokemonQuickInfo(pokemon))
        };
      }

      throw new Error('No results found');
    } catch (error) {
      console.error('Error searching:', error);
      return null;
    }
  }

  async function getAllPokemon(limit = 151) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const data = await response.json();
      const pokemonList = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return detailResponse.json();
        })
      );
      return pokemonList.map(pokemon => getPokemonQuickInfo(pokemon));
    } catch (error) {
      console.error('Error fetching all pokemon:', error);
      return [];
    }
  }

  async function getEggGroups() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/egg-group');
      const data = await response.json();
      setCategories(prev => ({ ...prev, eggGroups: data.results }));
      return data.results;
    } catch (error) {
      console.error('Error fetching egg groups:', error);
      return [];
    }
  }

  async function getHabitats() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon-habitat');
      const data = await response.json();
      setCategories(prev => ({ ...prev, habitats: data.results }));
      return data.results;
    } catch (error) {
      console.error('Error fetching habitats:', error);
      return [];
    }
  }

  async function getPokemonByCategory(categoryType, categoryName) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/${categoryType}/${categoryName}`);
      const data = await response.json();
      const pokemonList = await Promise.all(
        data.pokemon_species.slice(0, 10).map(async (species) => {
          const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${species.name}`
          );
          return pokemonResponse.json();
        })
      );
      
      const processedPokemon = pokemonList.map(pokemon => getPokemonQuickInfo(pokemon));
      setCategories(prev => ({
        ...prev,
        pokemonByCategory: {
          ...prev.pokemonByCategory,
          [`${categoryType}-${categoryName}`]: processedPokemon
        }
      }));
      return processedPokemon;
    } catch (error) {
      console.error('Error fetching pokemon by category:', error);
      return [];
    }
  }

  async function getPokemonDetails(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) throw new Error('Pokemon not found');
      const pokemonData = await response.json();
      
      // Get species data for additional information
      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();
      
      return {
        ...getPokemonQuickInfo(pokemonData),
        height: pokemonData.height,
        weight: pokemonData.weight,
        abilities: pokemonData.abilities,
        stats: pokemonData.stats,
        flavor_text: speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text,
        habitat: speciesData.habitat?.name,
        generation: speciesData.generation?.name,
        egg_groups: speciesData.egg_groups.map(group => group.name),
      };
    } catch (error) {
      console.error('Error fetching pokemon details:', error);
      return null;
    }
  }

  const pokemonValues = {
    ...pokemonState,
    ...categories,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getNumberOfPokemon,
    getRandomPokemon,
    getPokemonQuickInfo,
    searchPokemon,
    getEggGroups,
    getHabitats,
    getPokemonByCategory,
    getPokemonDetails,
    getAllPokemon,
  };

  return (
    <PokemonContext.Provider value={pokemonValues}>
      {children}
    </PokemonContext.Provider>
  );
}

export default function usePokemonApi() {
  return useContext(PokemonContext);
}