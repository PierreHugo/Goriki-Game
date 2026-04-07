const TYPE_COLORS = {
  normal: "#A8A878",   fire: "#F08030",    water: "#6890F0",
  electric: "#F8D030", grass: "#78C850",   ice: "#98D8D8",
  fighting: "#C03028", poison: "#A040A0",  ground: "#E0C068",
  flying: "#A890F0",   psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038",     ghost: "#705898",   dragon: "#7038F8",
  dark: "#705848",     steel: "#B8B8D0",   fairy: "#EE99AC",
};

const TYPE_LABELS = {
  normal: "Normal",     fire: "Feu",       water: "Eau",
  electric: "Électrik", grass: "Plante",   ice: "Glace",
  fighting: "Combat",   poison: "#Poison", ground: "Sol",
  flying: "Vol",        psychic: "Psy",    bug: "Insecte",
  rock: "Roche",        ghost: "Spectre",  dragon: "Dragon",
  dark: "Ténèbres",     steel: "Acier",    fairy: "Fée",
};

export default function PokemonSheet({ pokemon, onClose }) {
  const { id, nameFr, nameEn, nameJa, types, sprite } = pokemon;

  return (
    <>
      {/* Overlay */}
      <div className="sheet-overlay" onClick={onClose} />

      {/* Fiche */}
      <div className="sheet">
        <button className="sheet-close" onClick={onClose}>✕</button>

        {/* Sprite */}
        <div className="sheet-sprite-wrapper">
          {sprite
            ? <img src={sprite} alt={nameFr} className="sheet-sprite" />
            : <div className="sheet-sprite-placeholder">?</div>
          }
        </div>

        {/* Numéro */}
        <p className="sheet-id">#{String(id).padStart(4, "0")}</p>

        {/* Noms */}
        <div className="sheet-names">
          <div className="sheet-name-row">
            <span className="sheet-lang">FR</span>
            <span className="sheet-name">{nameFr ?? "—"}</span>
          </div>
          <div className="sheet-name-row">
            <span className="sheet-lang">EN</span>
            <span className="sheet-name">{nameEn ?? "—"}</span>
          </div>
          <div className="sheet-name-row">
            <span className="sheet-lang">JP</span>
            <span className="sheet-name sheet-name-ja">{nameJa ?? "—"}</span>
          </div>
        </div>

        {/* Types */}
        <div className="sheet-types">
          {types.map((type) => (
            <span
              key={type}
              className="sheet-type-badge"
              style={{
                backgroundColor: TYPE_COLORS[type] ?? "#888",
              }}
            >
              {TYPE_LABELS[type] ?? type}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
