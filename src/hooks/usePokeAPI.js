import { useState, useEffect } from "react";

const CACHE_KEY = "goriki_pokedata";
const CACHE_VERSION = "1.0.0";
const BATCH_SIZE = 50;
const TOTAL_POKEMON = 1025;

// IDs des Pokémon par catégorie (formes de base uniquement)
const CATEGORY_IDS = {
  starters: [
    1, 4, 7,       // Gen 1
    152, 155, 158, // Gen 2
    252, 255, 258, // Gen 3
    387, 390, 393, // Gen 4
    495, 498, 501, // Gen 5
    650, 653, 656, // Gen 6
    722, 725, 728, // Gen 7
    810, 813, 816, // Gen 8
    906, 909, 912, // Gen 9
  ],
  legendaries: [
    144, 145, 146, 150, 243, 244, 245, 249, 250,
    377, 378, 379, 380, 381, 382, 383, 384,
    480, 481, 482, 483, 484, 485, 486, 487, 488,
    638, 639, 640, 641, 642, 643, 644, 645, 646,
    716, 717, 718, 785, 786, 787, 788, 789, 790, 791, 792,
    888, 889, 890, 891, 892, 894, 895, 896, 897, 898,
    995, 996, 997, 998, 999, 1000, 1001, 1002, 1003, 1004,
  ],
  mythicals: [
    151, 251, 385, 386, 489, 490, 491, 492, 493,
    494, 647, 648, 649, 719, 720, 721,
    801, 802, 807, 808, 809,
    893, 899,
    1008, 1009, 1010,
  ],
  pseudoLegendaries: [
    149, 248, 373, 376, 445, 635, 706, 784, 887,
    996,
  ],
  babies: [
    172, 173, 174, 175, 236, 238, 239, 240, 298, 360,
    406, 433, 438, 439, 440, 446, 447, 458,
  ],
  fossils: [
    138, 140, 142, 345, 347, 408, 410, 564, 566,
    696, 698, 880, 881, 882, 883,
  ],
};

/**
 * Normalise un nom pour la comparaison (lowercase, sans accents, sans tirets)
 */
export function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s]/g, "");
}

/**
 * Fetch un batch de Pokémon en parallèle
 */
async function fetchBatch(ids) {
  const promises = ids.map(async (id) => {
    const [speciesRes, pokemonRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    ]);

    if (!speciesRes.ok || !pokemonRes.ok) return null;

    const [species, pokemon] = await Promise.all([
      speciesRes.json(),
      pokemonRes.json(),
    ]);

    const getName = (lang) =>
      species.names.find((n) => n.language.name === lang)?.name ?? null;

    return {
      id,
      nameFr: getName("fr"),
      nameEn: getName("en"),
      nameJa: getName("ja"),
      nameEnNormalized: normalizeName(getName("en") ?? ""),
      nameFrNormalized: normalizeName(getName("fr") ?? ""),
      nameJaNormalized: normalizeName(getName("ja") ?? ""),
      types: pokemon.types.map((t) => t.type.name),
      sprite: pokemon.sprites.front_default,
      generation: parseInt(
        species.generation.url.split("/").filter(Boolean).pop()
      ),
      categories: Object.entries(CATEGORY_IDS)
        .filter(([, ids]) => ids.includes(id))
        .map(([cat]) => cat),
    };
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

/**
 * Hook principal — charge et met en cache tous les Pokémon
 */
export function usePokeAPI() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // 0 à 1
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Vérification du cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.version === CACHE_VERSION && Array.isArray(parsed.data)) {
            setPokemon(parsed.data);
            setProgress(1);
            setLoading(false);
            return;
          }
        }

        // Fetch par batches
        const allIds = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
        const batches = [];
        for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
          batches.push(allIds.slice(i, i + BATCH_SIZE));
        }

        const allPokemon = [];
        for (let i = 0; i < batches.length; i++) {
          const batch = await fetchBatch(batches[i]);
          allPokemon.push(...batch);
          setProgress((i + 1) / batches.length);
        }

        // Tri par ID
        allPokemon.sort((a, b) => a.id - b.id);

        // Mise en cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ version: CACHE_VERSION, data: allPokemon })
        );

        setPokemon(allPokemon);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { pokemon, loading, progress, error };
}

/**
 * Utilitaire — filtre la liste selon les options choisies par le joueur
 */
export function filterPokemon(pokemon, options) {
  const { generations, types, categories } = options;

  return pokemon.filter((p) => {
    if (generations?.length && !generations.includes(p.generation)) return false;
    if (types?.length && !p.types.some((t) => types.includes(t))) return false;
    if (categories?.length && !p.categories.some((c) => categories.includes(c)))
      return false;
    return true;
  });
}
