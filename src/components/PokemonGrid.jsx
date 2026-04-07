import { useState } from "react";
import PokemonCard from "./PokemonCard";
import PokemonSheet from "./PokemonSheet";

const SORT_OPTIONS = [
  { value: "id",   labelFr: "Numéro",  labelEn: "Number" },
  { value: "name", labelFr: "Nom",     labelEn: "Name" },
  { value: "type", labelFr: "Type",    labelEn: "Type" },
];

export default function PokemonGrid({
  sortedPokemon,
  guessed,
  pokemonById,
  language,
  sortBy,
  onSortChange,
  revealed,
}) {
  const [selected, setSelected] = useState(null);
  const isFr = language !== "en" && language !== "ja";

  const handleCardClick = (id) => {
    if (!guessed.has(id) && !revealed) return;
    setSelected(id === selected ? null : id);
  };

  return (
    <div className="pokemon-grid-wrapper">

      {/* --- Contrôles de tri --- */}
      <div className="grid-controls">
        <span className="grid-sort-label">
          {isFr ? "Trier par :" : "Sort by:"}
        </span>
        <div className="grid-sort-btns">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`chip ${sortBy === opt.value ? "active" : ""}`}
              onClick={() => onSortChange(opt.value)}
            >
              {isFr ? opt.labelFr : opt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* --- Grille --- */}
      <div className="pokemon-grid">
        {sortedPokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isGuessed={guessed.has(p.id)}
            isRevealed={revealed}
            language={language}
            onClick={() => handleCardClick(p.id)}
          />
        ))}
      </div>

      {/* --- Mini fiche --- */}
      {selected && pokemonById.get(selected) && (
        <PokemonSheet
          pokemon={pokemonById.get(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
