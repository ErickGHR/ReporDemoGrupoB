import { useState } from "react";
import PokemonCard from "./PokemonCard";

function PokemonSearch() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setError("Escribe el nombre de un Pokémon");
      setPokemon(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPokemon(null);

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Pokémon no encontrado");
      }

      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Busca un Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <PokemonCard pokemon={pokemon} />
    </div>
  );
}

export default PokemonSearch;