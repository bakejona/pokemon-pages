"use client";
import Link from "next/link";
import navStyles from "./nav.module.css";
import usePokemonApi from "@/hooks/usePokemonApi";

export default function Nav() {
  const { favorites } = usePokemonApi(); 
  return (
    <nav>
      <ul className={navStyles.mainNav}>
        <li>
          <Link href="/">HOME</Link>
        </li>
        <li>
          <Link href="/search">SEARCH</Link>
        </li>
        <li>
          <Link href="/favorites">FAVORITES</Link>
        </li>
      </ul>
    </nav>
  );
}