const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const TYPE_LABELS = {
  normal: "Normal", fire: "Feu", water: "Eau", electric: "Électrik",
  grass: "Plante", ice: "Glace", fighting: "Combat", poison: "Poison",
  ground: "Sol", flying: "Vol", psychic: "Psy", bug: "Insecte",
  rock: "Roche", ghost: "Spectre", dragon: "Dragon", dark: "Ténèbres",
  steel: "Acier", fairy: "Fée",
};

const TYPE_LABELS_EN = {
  normal: "Normal", fire: "Fire", water: "Water", electric: "Electric",
  grass: "Grass", ice: "Ice", fighting: "Fighting", poison: "Poison",
  ground: "Ground", flying: "Flying", psychic: "Psychic", bug: "Bug",
  rock: "Rock", ghost: "Ghost", dragon: "Dragon", dark: "Dark",
  steel: "Steel", fairy: "Fairy",
};

const CATEGORIES = [
  { key: "starters",         labelFr: "Starters",           labelEn: "Starters" },
  { key: "legendaries",      labelFr: "Légendaires",         labelEn: "Legendaries" },
  { key: "mythicals",        labelFr: "Mythiques",           labelEn: "Mythicals" },
  { key: "pseudoLegendaries",labelFr: "Pseudo-légendaires",  labelEn: "Pseudo-legendaries" },
  { key: "babies",           labelFr: "Bébés",               labelEn: "Babies" },
  { key: "fossils",          labelFr: "Fossiles",            labelEn: "Fossils" },
];

function toggle(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FilterPanel({ options, setOptions }) {
  const { generations, types, categories, language } = options;
  const isFr = language !== "en" && language !== "ja";

  const update = (key, value) =>
    setOptions((prev) => ({ ...prev, [key]: value }));

  const allGensSelected = generations.length === 0;
  const allTypesSelected = types.length === 0;
  const allCatsSelected = categories.length === 0;

  return (
    <div className="filter-panel">

      {/* --- Générations --- */}
      <section className="filter-section">
        <div className="filter-header">
          <h2 className="filter-title">
            {isFr ? "Générations" : "Generations"}
          </h2>
          <button
            className="filter-reset"
            onClick={() => update("generations", [])}
            disabled={allGensSelected}
          >
            {isFr ? "Toutes" : "All"}
          </button>
        </div>
        <div className="filter-chips">
          {GENERATIONS.map((gen) => (
            <button
              key={gen}
              className={`chip ${generations.includes(gen) ? "active" : ""}`}
              onClick={() => update("generations", toggle(generations, gen))}
            >
              Gen {gen}
            </button>
          ))}
        </div>
      </section>

      {/* --- Types --- */}
      <section className="filter-section">
        <div className="filter-header">
          <h2 className="filter-title">Types</h2>
          <button
            className="filter-reset"
            onClick={() => update("types", [])}
            disabled={allTypesSelected}
          >
            {isFr ? "Tous" : "All"}
          </button>
        </div>
        <div className="filter-chips">
          {TYPES.map((type) => (
            <button
              key={type}
              className={`chip chip-type chip-${type} ${
                types.includes(type) ? "active" : ""
              }`}
              onClick={() => update("types", toggle(types, type))}
            >
              {isFr ? TYPE_LABELS[type] : TYPE_LABELS_EN[type]}
            </button>
          ))}
        </div>
      </section>

      {/* --- Catégories --- */}
      <section className="filter-section">
        <div className="filter-header">
          <h2 className="filter-title">
            {isFr ? "Catégories" : "Categories"}
          </h2>
          <button
            className="filter-reset"
            onClick={() => update("categories", [])}
            disabled={allCatsSelected}
          >
            {isFr ? "Toutes" : "All"}
          </button>
        </div>
        <div className="filter-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`chip ${categories.includes(cat.key) ? "active" : ""}`}
              onClick={() => update("categories", toggle(categories, cat.key))}
            >
              {isFr ? cat.labelFr : cat.labelEn}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
