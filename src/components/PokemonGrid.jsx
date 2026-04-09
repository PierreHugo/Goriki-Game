import { useState, useMemo } from "react";
import PokemonCard from "./PokemonCard";
import PokemonSheet from "./PokemonSheet";

const GEN_LABELS_FR = {
  1: "Génération 1", 2: "Génération 2", 3: "Génération 3",
  4: "Génération 4", 5: "Génération 5", 6: "Génération 6",
  7: "Génération 7", 8: "Génération 8", 9: "Génération 9",
};

const GEN_LABELS_EN = {
  1: "Generation 1", 2: "Generation 2", 3: "Generation 3",
  4: "Generation 4", 5: "Generation 5", 6: "Generation 6",
  7: "Generation 7", 8: "Generation 8", 9: "Generation 9",
};

const TYPE_LABELS_FR = {
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

function buildGroups(sortedPokemon, language) {
  const isFr = language !== "en";
  const groups = [];
  let currentKey = null;
  let currentGroup = null;

  for (const p of sortedPokemon) {
    const key = p.generation;
    const label = isFr
      ? (GEN_LABELS_FR[key] ?? `Génération ${key}`)
      : (GEN_LABELS_EN[key] ?? `Generation ${key}`);

    if (key !== currentKey) {
      currentGroup = { key, label, items: [] };
      groups.push(currentGroup);
      currentKey = key;
    }
    currentGroup.items.push(p);
  }

  return groups;
}

export default function PokemonGrid({
  sortedPokemon,
  guessed,
  pokemonById,
  language,
  revealed,
  onSheetClose,
}) {
  const [selected, setSelected] = useState(null);
  const isFr = language !== "en" && language !== "ja";

  const groups = useMemo(
    () => buildGroups(sortedPokemon, language),
    [sortedPokemon, language]
  );

  const handleCardClick = (id) => {
    if (!guessed.has(id) && !revealed) return;
    setSelected(id === selected ? null : id);
  };

  const closeSheet = () => {
    setSelected(null);
    onSheetClose?.();
  };

  return (
    <div className="pokemon-grid-wrapper">

      {groups.map((group) => (
        <div key={group.key} className="pokemon-group">
          <div className="pokemon-group-header">
            <span className="pokemon-group-gen">{group.label}</span>
            <div className="pokemon-group-bar-track">
              <div
                className="pokemon-group-bar-fill"
                style={{
                  width: `${Math.round(
                    (group.items.filter((p) => guessed.has(p.id)).length /
                      group.items.length) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="pokemon-group-count">
              {group.items.filter((p) => guessed.has(p.id)).length}
              /{group.items.length}
            </span>
          </div>

          <div className="pokemon-grid">
            {group.items.map((p) => (
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
        </div>
      ))}

      {selected && pokemonById.get(selected) && (
        <PokemonSheet
          pokemon={pokemonById.get(selected)}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}
