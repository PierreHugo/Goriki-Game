import { useState, useEffect } from "react";

const CACHE_KEY = "goriki_pokedata";
const CACHE_VERSION = "1.2.0";
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
    144, 145, 146, 150,
    243, 244, 245, 249, 250,
    377, 378, 379, 380, 381, 382, 383, 384,
    480, 481, 482, 483, 484, 485, 486, 487, 488,
    638, 639, 640, 641, 642, 643, 644, 645, 646,
    716, 717, 718,
    772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800,
    888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905,
    1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024,
  ],
  mythicals: [
    151, 251, 385, 386,
    489, 490, 491, 492, 493,
    494, 647, 648, 649,
    719, 720, 721,
    801, 802, 807, 808, 809,
    893,
    1025,
  ],
  pseudoLegendaries: [
    149, 248, 373, 376, 445, 635, 706, 784, 887, 998,
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
    696, 697, 698, 699,
    880, 881, 882, 883,
  ],
  ultraBeasts: [
    793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806,
  ],
  paradoxPokemon: [
    984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995,
    1005, 1006, 1007, 1008, 1009, 1010, 1020, 1021, 1022, 1023,
  ],
};

// Formes régionales — slug PokéAPI, baseId (numéro dex national), génération, région
export const REGIONAL_FORMS = [
  // --- Alola (Gen 7) ---
  { slug: "rattata-alola",           baseId: 19,  generation: 7, region: "alola" },
  { slug: "raticate-alola",          baseId: 20,  generation: 7, region: "alola" },
  { slug: "raichu-alola",            baseId: 26,  generation: 7, region: "alola" },
  { slug: "sandshrew-alola",         baseId: 27,  generation: 7, region: "alola" },
  { slug: "sandslash-alola",         baseId: 28,  generation: 7, region: "alola" },
  { slug: "vulpix-alola",            baseId: 37,  generation: 7, region: "alola" },
  { slug: "ninetales-alola",         baseId: 38,  generation: 7, region: "alola" },
  { slug: "diglett-alola",           baseId: 50,  generation: 7, region: "alola" },
  { slug: "dugtrio-alola",           baseId: 51,  generation: 7, region: "alola" },
  { slug: "meowth-alola",            baseId: 52,  generation: 7, region: "alola" },
  { slug: "persian-alola",           baseId: 53,  generation: 7, region: "alola" },
  { slug: "geodude-alola",           baseId: 74,  generation: 7, region: "alola" },
  { slug: "graveler-alola",          baseId: 75,  generation: 7, region: "alola" },
  { slug: "golem-alola",             baseId: 76,  generation: 7, region: "alola" },
  { slug: "grimer-alola",            baseId: 88,  generation: 7, region: "alola" },
  { slug: "muk-alola",               baseId: 89,  generation: 7, region: "alola" },
  { slug: "exeggutor-alola",         baseId: 103, generation: 7, region: "alola" },
  { slug: "marowak-alola",           baseId: 105, generation: 7, region: "alola" },
  // --- Galar (Gen 8) ---
  { slug: "meowth-galar",            baseId: 52,  generation: 8, region: "galar" },
  { slug: "ponyta-galar",            baseId: 77,  generation: 8, region: "galar" },
  { slug: "rapidash-galar",          baseId: 78,  generation: 8, region: "galar" },
  { slug: "slowpoke-galar",          baseId: 79,  generation: 8, region: "galar" },
  { slug: "slowbro-galar",           baseId: 80,  generation: 8, region: "galar" },
  { slug: "farfetchd-galar",         baseId: 83,  generation: 8, region: "galar" },
  { slug: "weezing-galar",           baseId: 110, generation: 8, region: "galar" },
  { slug: "mr-mime-galar",           baseId: 122, generation: 8, region: "galar" },
  { slug: "articuno-galar",          baseId: 144, generation: 8, region: "galar" },
  { slug: "zapdos-galar",            baseId: 145, generation: 8, region: "galar" },
  { slug: "moltres-galar",           baseId: 146, generation: 8, region: "galar" },
  { slug: "zigzagoon-galar",         baseId: 263, generation: 8, region: "galar" },
  { slug: "linoone-galar",           baseId: 264, generation: 8, region: "galar" },
  { slug: "darumaka-galar",          baseId: 554, generation: 8, region: "galar" },
  { slug: "darmanitan-galar",        baseId: 555, generation: 8, region: "galar" },
  { slug: "yamask-galar",            baseId: 562, generation: 8, region: "galar" },
  { slug: "stunfisk-galar",          baseId: 618, generation: 8, region: "galar" },
  { slug: "espurr-galar",            baseId: 677, generation: 8, region: "galar" },
  { slug: "corsola-galar",           baseId: 222, generation: 8, region: "galar" },
  // --- Hisui (Gen 8) ---
  { slug: "growlithe-hisui",         baseId: 58,  generation: 8, region: "hisui" },
  { slug: "arcanine-hisui",          baseId: 59,  generation: 8, region: "hisui" },
  { slug: "voltorb-hisui",           baseId: 100, generation: 8, region: "hisui" },
  { slug: "electrode-hisui",         baseId: 101, generation: 8, region: "hisui" },
  { slug: "typhlosion-hisui",        baseId: 157, generation: 8, region: "hisui" },
  { slug: "qwilfish-hisui",          baseId: 211, generation: 8, region: "hisui" },
  { slug: "sneasel-hisui",           baseId: 215, generation: 8, region: "hisui" },
  { slug: "samurott-hisui",          baseId: 503, generation: 8, region: "hisui" },
  { slug: "lilligant-hisui",         baseId: 549, generation: 8, region: "hisui" },
  { slug: "zorua-hisui",             baseId: 570, generation: 8, region: "hisui" },
  { slug: "zoroark-hisui",           baseId: 571, generation: 8, region: "hisui" },
  { slug: "braviary-hisui",          baseId: 628, generation: 8, region: "hisui" },
  { slug: "sliggoo-hisui",           baseId: 705, generation: 8, region: "hisui" },
  { slug: "goodra-hisui",            baseId: 706, generation: 8, region: "hisui" },
  { slug: "avalugg-hisui",           baseId: 713, generation: 8, region: "hisui" },
  { slug: "decidueye-hisui",         baseId: 724, generation: 8, region: "hisui" },
  // --- Paldea (Gen 9) ---
  { slug: "tauros-paldea-combat",    baseId: 128, generation: 9, region: "paldea" },
  { slug: "tauros-paldea-blaze",     baseId: 128, generation: 9, region: "paldea" },
  { slug: "tauros-paldea-aqua",      baseId: 128, generation: 9, region: "paldea" },
  { slug: "wooper-paldea",           baseId: 194, generation: 9, region: "paldea" },
];

// Noms d'affichage FR/EN par région
const REGION_LABELS = {
  alola:  { fr: "d'Alola",   en: "Alolan" },
  galar:  { fr: "de Galar",  en: "Galarian" },
  hisui:  { fr: "de Hisui",  en: "Hisuian" },
  paldea: { fr: "de Paldea", en: "Paldean" },
};

export function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s''.]/g, "");
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
      isRegional: false,
      baseId: null,
      region: null,
    };
  });
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

async function fetchRegionalForms() {
  const promises = REGIONAL_FORMS.map(async (form) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${form.slug}`);
      if (!res.ok) return null;
      const pokemon = await res.json();

      // Récupère les noms de base depuis species du baseId
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${form.baseId}`
      );
      if (!speciesRes.ok) return null;
      const species = await speciesRes.json();

      const getName = (lang) =>
        species.names.find((n) => n.language.name === lang)?.name ?? null;

      const baseFr = getName("fr") ?? "";
      const baseEn = getName("en") ?? "";
      const baseJa = getName("ja") ?? "";

      const regionFr = REGION_LABELS[form.region]?.fr ?? form.region;
      const regionEn = REGION_LABELS[form.region]?.en ?? form.region;

      // Cas spécial Tauros Paldea — on distingue les 3 formes
      let suffixFr = regionFr;
      let suffixEn = regionEn;
      if (form.slug.includes("combat")) { suffixFr = "de Paldea (Combat)"; suffixEn = "Paldean (Combat)"; }
      if (form.slug.includes("blaze"))  { suffixFr = "de Paldea (Feu)";    suffixEn = "Paldean (Blaze)"; }
      if (form.slug.includes("aqua"))   { suffixFr = "de Paldea (Eau)";    suffixEn = "Paldean (Aqua)"; }

      const nameFr = `${baseFr} ${suffixFr}`;
      const nameEn = `${regionEn} ${baseEn}`;

      return {
        id: `${form.baseId}-${form.region}-${form.slug.split("-").pop()}`,
        baseId: form.baseId,
        nameFr,
        nameEn,
        nameJa: baseJa, // pas de nom JP distinct pour les formes
        nameFrNormalized: normalizeName(nameFr),
        nameEnNormalized: normalizeName(nameEn),
        nameJaNormalized: normalizeName(baseJa),
        types: pokemon.types.map((t) => t.type.name),
        sprite: pokemon.sprites.front_default,
        generation: form.generation,
        categories: ["regionalForms"],
        isRegional: true,
        region: form.region,
      };
    } catch {
      return null;
    }
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

        // Fetch Pokémon de base
        const allIds = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
        const batches = [];
        for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
          batches.push(allIds.slice(i, i + BATCH_SIZE));
        }

        const allPokemon = [];
        for (let i = 0; i < batches.length; i++) {
          const batch = await fetchBatch(batches[i]);
          allPokemon.push(...batch);
          // 90% de la progression pour les Pokémon de base
          setProgress(((i + 1) / batches.length) * 0.9);
        }

        // Fetch formes régionales
        setProgress(0.9);
        const regionalForms = await fetchRegionalForms();
        allPokemon.push(...regionalForms);
        setProgress(1);

        // Tri : d'abord par baseId, puis les formes régionales après leur base
        allPokemon.sort((a, b) => {
          const aBase = a.isRegional ? a.baseId : a.id;
          const bBase = b.isRegional ? b.baseId : b.id;
          if (aBase !== bBase) return aBase - bBase;
          if (!a.isRegional && b.isRegional) return -1;
          if (a.isRegional && !b.isRegional) return 1;
          return 0;
        });

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
    // Les formes régionales sont exclues du filtre par génération
    if (generations?.length) {
      if (p.isRegional) return false;
      if (!generations.includes(p.generation)) return false;
    }
    if (types?.length && !p.types.some((t) => types.includes(t))) return false;
    if (categories?.length && !p.categories.some((c) => categories.includes(c))) return false;
    return true;
  });
}
