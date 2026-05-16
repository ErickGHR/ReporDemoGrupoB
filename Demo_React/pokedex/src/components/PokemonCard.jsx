import "./PokemonCard.css";

const typeTheme = {
  normal: { color: "#b8a77d", symbol: "●" },
  fire: { color: "#f08030", symbol: "🔥" },
  water: { color: "#6890f0", symbol: "💧" },
  grass: { color: "#78c850", symbol: "🌿" },
  electric: { color: "#f8d030", symbol: "⚡" },
  ice: { color: "#98d8d8", symbol: "❄" },
  fighting: { color: "#c03028", symbol: "✦" },
  poison: { color: "#a040a0", symbol: "☠" },
  ground: { color: "#e0c068", symbol: "◆" },
  flying: { color: "#a890f0", symbol: "🕊" },
  psychic: { color: "#f85888", symbol: "✺" },
  bug: { color: "#a8b820", symbol: "✿" },
  rock: { color: "#b8a038", symbol: "⬟" },
  ghost: { color: "#705898", symbol: "☾" },
  dragon: { color: "#7038f8", symbol: "🐉" },
  dark: { color: "#705848", symbol: "🖤" },
  steel: { color: "#b8b8d0", symbol: "⬢" },
  fairy: { color: "#ee99ac", symbol: "✧" },
};

const rarityTheme = {
  common: {
    label: "COMMON",
    frame: "linear-gradient(145deg, #d7d7d7, #9c9c9c, #ececec)",
    inner: "linear-gradient(180deg, #f8f8f8 0%, #dfdfdf 100%)",
    glow: "rgba(255,255,255,0.18)",
  },
  uncommon: {
    label: "UNCOMMON",
    frame: "linear-gradient(145deg, #cbe6c7, #6ca36c, #e4f7df)",
    inner: "linear-gradient(180deg, #f4fff2 0%, #d7f0d2 100%)",
    glow: "rgba(119, 217, 119, 0.20)",
  },
  rare: {
    label: "RARE",
    frame: "linear-gradient(145deg, #c3d6ff, #5e84d6, #e8f0ff)",
    inner: "linear-gradient(180deg, #f4f8ff 0%, #d8e4ff 100%)",
    glow: "rgba(91, 143, 255, 0.22)",
  },
  holoRare: {
    label: "HOLO RARE",
    frame:
      "linear-gradient(145deg, #f4d56b, #b98d1e, #fff3bf, #d4a73c, #f9e07c)",
    inner: "linear-gradient(180deg, #fff6da 0%, #f1e2a9 100%)",
    glow: "rgba(255, 225, 97, 0.26)",
  },
  ultraRare: {
    label: "ULTRA RARE",
    frame:
      "linear-gradient(145deg, #ffe0f4, #d07aff, #8ed8ff, #fff0a8, #ffd2ea)",
    inner: "linear-gradient(180deg, #fff7fc 0%, #f2ddff 100%)",
    glow: "rgba(201, 113, 255, 0.26)",
  },
  secretRare: {
    label: "SECRET RARE",
    frame:
      "linear-gradient(145deg, #fff3b0, #f9c80e, #ffffff, #ff7ad9, #8fe3ff, #ffe680)",
    inner: "linear-gradient(180deg, #fffef8 0%, #fff1bd 100%)",
    glow: "rgba(255, 204, 0, 0.30)",
  },
};

function formatText(text) {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatValue(pokemon, statName) {
  return pokemon.stats.find((stat) => stat.stat.name === statName)?.base_stat || 0;
}

function getRarity(pokemon) {
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  const isLegendary = pokemon.speciesData?.is_legendary;
  const isMythical = pokemon.speciesData?.is_mythical;

  if (isMythical) return "secretRare";
  if (isLegendary) return "ultraRare";
  if (totalStats >= 580) return "holoRare";
  if (totalStats >= 500) return "rare";
  if (totalStats >= 360) return "uncommon";
  return "common";
}

function PokemonCard({ pokemon }) {
  if (!pokemon) return null;

  const hp = getStatValue(pokemon, "hp");
  const attack = getStatValue(pokemon, "attack");
  const defense = getStatValue(pokemon, "defense");
  const speed = getStatValue(pokemon, "speed");

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  const rarity = getRarity(pokemon);
  const rarityData = rarityTheme[rarity];

  const mainType = pokemon.types[0]?.type.name || "normal";
  const typeData = typeTheme[mainType] || typeTheme.normal;

  const image =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  const moves = pokemon.moves.slice(0, 2);
  const move1 = moves[0] ? formatText(moves[0].move.name) : "Quick Attack";
  const move2 = moves[1] ? formatText(moves[1].move.name) : "Power Burst";

  const damage1 = Math.max(20, Math.round(attack * 0.4 / 10) * 10);
  const damage2 = Math.max(50, Math.round((attack + speed) * 0.75 / 10) * 10);

  return (
    <article
      className={`tcg-card ${rarity}`}
      style={{
        "--frame-bg": rarityData.frame,
        "--inner-bg": rarityData.inner,
        "--foil-glow": rarityData.glow,
        "--type-color": typeData.color,
      }}
    >
      <div className="card-foil"></div>

      <div className="card-shell">
        <header className="card-header">
          <div className="stage-badge">BASIC</div>

          <div className="name-box">
            <h2>{formatText(pokemon.name)}</h2>
            <span className="rarity-badge">{rarityData.label}</span>
          </div>

          <div className="hp-box">
            <span className="hp-text">HP</span>
            <span className="hp-value">{hp}</span>
            <span className="type-symbol">{typeData.symbol}</span>
          </div>
        </header>

        <section className="art-section">
          <div className="art-bg"></div>
          <img src={image} alt={pokemon.name} className="pokemon-art" />
        </section>

        <section className="meta-row">
          <span>No. {pokemon.id}</span>
          <span>{formatText(mainType)}</span>
          <span>Total {totalStats}</span>
        </section>

        <section className="attack-section">
          <div className="attack-row">
            <div className="energy-group">
              <span className="energy">{typeData.symbol}</span>
            </div>

            <div className="move-info">
              <h3>{move1}</h3>
              <p>Golpe rápido del Pokémon.</p>
            </div>

            <div className="damage">{damage1}</div>
          </div>

          <div className="attack-row">
            <div className="energy-group">
              <span className="energy">{typeData.symbol}</span>
              <span className="energy">{typeData.symbol}</span>
              <span className="energy neutral">✦</span>
            </div>

            <div className="move-info">
              <h3>{move2}</h3>
              <p>Ataque potente inspirado en su velocidad y fuerza.</p>
            </div>

            <div className="damage">{damage2}</div>
          </div>
        </section>

        <section className="bottom-stats">
          <div>
            <span className="label">Weakness</span>
            <strong>x2</strong>
          </div>
          <div>
            <span className="label">Defense</span>
            <strong>{defense}</strong>
          </div>
          <div>
            <span className="label">Retreat</span>
            <strong>{Math.max(1, Math.ceil(speed / 40))}</strong>
          </div>
        </section>

        <footer className="card-footer">
          <div className="rule-box">
            <strong>{rarityData.label}</strong>
            <span>
              Pokémon inspirado en estilo TCG. Altura {pokemon.height} | Peso {pokemon.weight}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default PokemonCard;