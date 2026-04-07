import { useState, useEffect } from "react";

const CACHE_KEY = "goriki_pokedata";
const CACHE_VERSION = "1.1.0"; // bump pour invalider l'ancien cache
const BATCH_SIZE = 50;
const TOTAL_POKEMON = 1025;

const CATEGORY_IDS = {
  starters: [
    1, 4, 7,
    152, 155, 158,
    252, 255, 258,
    387, 390, 393,
    495, 498, 501,
    650, 653, 656,
    722, 725, 728,
    810, 813, 816,
    906, 909, 912,
  ],
  legendaries: [
    // Gen 1
    144, 145, 146, 150,
    // Gen 2
    243, 244, 245, 249, 250,
    // Gen 3
    377, 378, 379, 380, 381, 382, 383, 384,
    // Gen 4
    480, 481, 482, 483, 484, 485, 486, 487, 488,
    // Gen 5
    638, 639, 640, 641, 642, 643, 644, 645, 646,
    // Gen 6
    716, 717, 718,
    // Gen 7
    772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800,
    // Gen 8
    888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905,
    // Gen 9
    1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024,
  ],
  mythicals: [
    // Gen 1
    151,
    // Gen 2
    251,
    // Gen 3
    385, 386,
    // Gen 4
    489, 490, 491, 492, 493,
    // Gen 5
    494, 647, 648, 649,
    // Gen 6
    719, 720, 721,
    // Gen 7
    801, 802, 807, 808, 809,
    // Gen 8
    893,
    // Gen 9
    1025,
  ],
  pseudoLegendaries: [
    149, 248, 373, 376, 445, 635, 706, 784, 887,
    998,
  ],
  babies: [
    172, 173, 174, 175, 236, 238, 239, 240, 298, 360,
    406, 433, 438, 439, 440, 446, 447, 458,
  ],
  fossils: [
    138, 139, 140, 141, 142,
    345, 346, 347, 348, 
    408, 409, 410, 411,
    564, 565, 566, 567,
    696, 687, 698, 699, 
    880, 881, 882, 883,
  ],
  ultraBeasts: [
    793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806,
  ],
  paradoxPokemon: [
    984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1005, 1006, 1007, 1008, 1009, 1010, 1020, 1021, 1022, 1023,
  ],
};

export function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s]/g, "");
}

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

export function usePokeAPI() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
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
        allPokemon.sort((a, b) => a.id - b.id);
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

export function filterPokemon(pokemon, options) {
  const { generations, types, categories } = options;
  return pokemon.filter((p) => {
    if (generations?.length && !generations.includes(p.generation)) return false;
    if (types?.length && !p.types.some((t) => types.includes(t))) return false;
    if (categories?.length && !p.categories.some((c) => categories.includes(c))) return false;
    return true;
  });
}
