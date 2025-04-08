"use client";
import Link from "next/link";
import navStyles from "./nav.module.css";
import usePokemonApi from "@/hooks/usePokemonApi";

export default function Nav() {
  const { favorites } = usePokemonApi(); 
  return (
    <nav>
      <ul className={navStyles.mainNav}>
        <span>
          PokéPortal!
        </span>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/search">Pokedex</Link>
        </li>
        <li>
          <Link href="/favorites">Favorites</Link>
        </li>
      </ul>
    </nav>
  );
}