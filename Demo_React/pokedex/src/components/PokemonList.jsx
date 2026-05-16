import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import "./PokemonList.css";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const limit = 20;

  async function fetchSpeciesData(speciesUrl) {
    try {
      const response = await fetch(speciesUrl);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async function fetchPokemonsByPage(currentPage) {
    try {
      setLoading(true);
      setError("");

      const offset = (currentPage - 1) * limit;

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener la lista de pokémon");
      }

      const data = await response.json();
      setTotalPokemons(data.count);

      const details = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);

          if (!detailResponse.ok) {
            throw new Error("Error al obtener el detalle de un pokémon");
          }

          const detailData = await detailResponse.json();
          const speciesData = await fetchSpeciesData(detailData.species.url);

          return {
            ...detailData,
            speciesData,
          };
        })
      );

      setPokemons(details);
    } catch (err) {
      setError(err.message);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isSearching) {
      fetchPokemonsByPage(page);
    }
  }, [page, isSearching]);

  async function handleSearch(event) {
    event.preventDefault();

    const query = search.trim().toLowerCase();

    if (!query) {
      setIsSearching(false);
      setError("");
      setPage(1);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
      );

      if (!response.ok) {
        throw new Error("Pokémon no encontrado");
      }

      const detailData = await response.json();
      const speciesData = await fetchSpeciesData(detailData.species.url);

      setPokemons([
        {
          ...detailData,
          speciesData,
        },
      ]);

      setIsSearching(true);
    } catch (err) {
      setError(err.message);
      setPokemons([]);
      setIsSearching(true);
    } finally {
      setLoading(false);
    }
  }

  function handleClearSearch() {
    setSearch("");
    setError("");
    setIsSearching(false);
    setPage(1);
  }

  const totalPages = Math.ceil(totalPokemons / limit);

  function nextPage() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  function prevPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  return (
    <div className="pokemon-list-container">
      <div className="search-bar-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Busca por nombre o número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
          <button
            type="button"
            className="clear-button"
            onClick={handleClearSearch}
          >
            Limpiar
          </button>
        </form>
      </div>

      {!isSearching && !loading && !error && (
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 1}>
            Anterior
          </button>

          <span>
            Página {page} de {totalPages}
          </span>

          <button onClick={nextPage} disabled={page === totalPages}>
            Siguiente
          </button>
        </div>
      )}

      {isSearching && !loading && (
        <p className="search-mode-text">Mostrando resultado de búsqueda</p>
      )}

      {loading && <p className="status">Cargando pokémon...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PokemonList;