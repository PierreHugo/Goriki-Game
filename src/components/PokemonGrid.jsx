import { useState, useMemo } from "react";
import PokemonCard from "./PokemonCard";
import PokemonSheet from "./PokemonSheet";
import { unitKey } from "../hooks/usePokeAPI";

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

const REGION_ORDER = ["alola", "galar", "hisui", "paldea"];

const REGION_GROUP_LABELS_FR = {
  alola: "Formes d'Alola",
  galar: "Formes de Galar",
  hisui: "Formes de Hisui",
  paldea: "Formes de Paldea",
};

const REGION_GROUP_LABELS_EN = {
  alola: "Alolan forms",
  galar: "Galarian forms",
  hisui: "Hisuian forms",
  paldea: "Paldean forms",
};

function buildGroups(sortedPokemon, language) {
  const isFr = language !== "en";
  const byKey = new Map();

  for (const p of sortedPokemon) {
    let key, label, order;

    if (p.isRegional) {
      key = `region-${p.region}`;
      label = isFr
        ? REGION_GROUP_LABELS_FR[p.region]
        : REGION_GROUP_LABELS_EN[p.region];
      order = 100 + REGION_ORDER.indexOf(p.region);
    } else {
      // Pokémon de base, Méga et Gigamax : groupés par la génération du Pokémon d'origine
      key = `gen-${p.generation}`;
      label = isFr
        ? (GEN_LABELS_FR[p.generation] ?? `Génération ${p.generation}`)
        : (GEN_LABELS_EN[p.generation] ?? `Generation ${p.generation}`);
      order = p.generation;
    }

    if (!byKey.has(key)) byKey.set(key, { key, label, order, items: [] });
    byKey.get(key).items.push(p);
  }

  return [...byKey.values()].sort((a, b) => a.order - b.order);
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

      
      {groups.map((group) => {
        const total = new Set(group.items.map(unitKey)).size;
        const found = new Set(
          group.items.filter((p) => guessed.has(p.id)).map(unitKey)
        ).size;

        return (
          <div key={group.key} className="pokemon-group">
            <div className="pokemon-group-header">
              <span className="pokemon-group-gen">{group.label}</span>
              <div className="pokemon-group-bar-track">
                <div
                  className="pokemon-group-bar-fill"
                  style={{ width: `${total ? Math.round((found / total) * 100) : 0}%` }}
                />
              </div>
              <span className="pokemon-group-count">{found}/{total}</span>
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
        );
      })}

      {selected && pokemonById.get(selected) && (
        <PokemonSheet
          pokemon={pokemonById.get(selected)}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}
