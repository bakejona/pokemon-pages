"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import usePokemonApi from '@/hooks/usePokemonApi';
import styles from './pokemonDetail.module.css';

export default function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const { getPokemonQuickInfo } = usePokemonApi();

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, [id]);

  if (!pokemon) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const { name, img, types } = getPokemonQuickInfo(pokemon);

  return (
    <div className={styles.pokemonDetail}>
      <div className={styles.card}>
        <h1>{name.charAt(0).toUpperCase() + name.slice(1)}</h1>
        <img src={img} alt={name} className={styles.pokemonImage} />
        <div className={styles.typeContainer}>
          {types.map((t) => (
            <span key={t.type.name} className={`${styles.typeBadge} ${styles[t.type.name]}`}>
              {t.type.name}
            </span>
          ))}
        </div>
        <div className={styles.info}>
          <p><strong>Height:</strong> {pokemon.height / 10} m</p>
          <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>

          <h2>Abilities</h2>
          <ul>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>

          <h2>Stats</h2>
          <ul className={styles.statsList}>
            {pokemon.stats.map((stat, index) => (
              <li key={index}>
                <span>{stat.stat.name}</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{ width: `${stat.base_stat > 100 ? 100 : stat.base_stat}%` }}
                  >
                    {stat.base_stat}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
