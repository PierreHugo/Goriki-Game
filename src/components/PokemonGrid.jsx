import { useState, useMemo } from "react";
import PokemonCard from "./PokemonCard";
import PokemonSheet from "./PokemonSheet";

const SORT_OPTIONS = [
  { value: "id",   labelFr: "Numéro",  labelEn: "Number" },
  { value: "name", labelFr: "Nom",     labelEn: "Name" },
  { value: "type", labelFr: "Type",    labelEn: "Type" },
];

const GEN_LABELS = {
  1: "Génération 1 — Kanto",
  2: "Génération 2 — Johto",
  3: "Génération 3 — Hoenn",
  4: "Génération 4 — Sinnoh",
  5: "Génération 5 — Unys",
  6: "Génération 6 — Kalos",
  7: "Génération 7 — Alola",
  8: "Génération 8 — Galar",
  9: "Génération 9 — Paldea",
};

const GEN_LABELS_EN = {
  1: "Generation 1 — Kanto",
  2: "Generation 2 — Johto",
  3: "Generation 3 — Hoenn",
  4: "Generation 4 — Sinnoh",
  5: "Generation 5 — Unova",
  6: "Generation 6 — Kalos",
  7: "Generation 7 — Alola",
  8: "Generation 8 — Galar",
  9: "Generation 9 — Paldea",
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

/**
 * Regroupe la liste triée en sections avec un label
 */
function buildGroups(sortedPokemon, sortBy, language) {
  const isFr = language !== "en";
  const groups = [];
  let currentKey = null;
  let currentGroup = null;

  for (const p of sortedPokemon) {
    let key, label;

    if (sortBy === "type") {
      key = p.types[0];
      label = isFr
        ? (TYPE_LABELS_FR[key] ?? key)
        : (TYPE_LABELS_EN[key] ?? key);
    } else {
      // "id" ou "name" → on groupe par génération
      key = p.generation;
      label = isFr
        ? (GEN_LABELS[key] ?? `Génération ${key}`)
        : (GEN_LABELS_EN[key] ?? `Generation ${key}`);
    }

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
  sortBy,
  onSortChange,
  revealed,
}) {
  const [selected, setSelected] = useState(null);
  const isFr = language !== "en" && language !== "ja";

  const groups = useMemo(
    () => buildGroups(sortedPokemon, sortBy, language),
    [sortedPokemon, sortBy, language]
  );

  const handleCardClick = (id) => {
    if (!guessed.has(id) && !revealed) return;
    setSelected(id === selected ? null : id);
  };

  return (
    <div className="pokemon-grid-wrapper">

      {/* Groupes avec démarcations */}
      {groups.map((group) => (
        <div key={group.key} className="pokemon-group">
          <div className="pokemon-group-header">
            <span className="pokemon-group-gen">
              {isFr ? `Génération ${group.key}` : `Generation ${group.key}`}
            </span>
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

      {/* Mini fiche */}
      {selected && pokemonById.get(selected) && (
        <PokemonSheet
          pokemon={pokemonById.get(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
