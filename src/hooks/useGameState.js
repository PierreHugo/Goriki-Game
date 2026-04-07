import { useState, useCallback, useMemo } from "react";
import { normalizeName, filterPokemon } from "./usePokeAPI";

/**
 * Options par défaut avant le lancement d'une partie
 */
export const DEFAULT_OPTIONS = {
  generations: [],     // [] = toutes
  types: [],           // [] = tous
  categories: [],      // [] = toutes
  timerSeconds: 20 * 60, // 20 minutes par défaut
  infinite: false,
  language: "fr",      // "fr" | "en" | "ja"
  sortBy: "id",        // "id" | "type" | "name"
};

/**
 * Hook principal de gestion de l'état du jeu
 */
export function useGameState(allPokemon) {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [phase, setPhase] = useState("home"); // "home" | "playing" | "finished"
  const [guessed, setGuessed] = useState(new Set()); // Set d'IDs devinés
  const [revealed, setRevealed] = useState(false); // true quand le timer expire

  // Liste active filtrée selon les options
  const activePokemon = useMemo(() => {
    if (!allPokemon.length) return [];
    const { generations, types, categories } = options;

    const hasFilter = generations.length || types.length || categories.length;
    if (!hasFilter) return allPokemon;

    return filterPokemon(allPokemon, { generations, types, categories });
  }, [allPokemon, options]);

  // Map id -> pokemon pour lookup O(1)
  const pokemonById = useMemo(() => {
    return new Map(activePokemon.map((p) => [p.id, p]));
  }, [activePokemon]);

  // Map nom normalisé -> id pour la détection des devins
  const nameToId = useMemo(() => {
    const map = new Map();
    activePokemon.forEach((p) => {
      map.set(p.nameFrNormalized, p.id);
      map.set(p.nameEnNormalized, p.id);
      if (p.nameJaNormalized) map.set(p.nameJaNormalized, p.id);
    });
    return map;
  }, [activePokemon]);

  /**
   * Démarre une partie
   */
  const startGame = useCallback(() => {
    setGuessed(new Set());
    setRevealed(false);
    setPhase("playing");
  }, []);

  /**
   * Appelé par InputGuess à chaque saisie
   * Retourne true si le nom correspond à un Pokémon non encore deviné
   */
  const submitGuess = useCallback(
    (rawInput) => {
      const normalized = normalizeName(rawInput);
      const id = nameToId.get(normalized);

      if (!id) return false;           // pas un Pokémon connu
      if (guessed.has(id)) return false; // déjà deviné

      setGuessed((prev) => new Set(prev).add(id));
      return true;
    },
    [nameToId, guessed]
  );

  /**
   * Appelé quand le timer expire
   */
  const finishGame = useCallback(() => {
    setRevealed(true);
    setPhase("finished");
  }, []);

  /**
   * Retourne au menu principal
   */
  const resetGame = useCallback(() => {
    setGuessed(new Set());
    setRevealed(false);
    setPhase("home");
  }, []);

  /**
   * Liste triée pour l'affichage dans PokemonGrid
   */
  const sortedPokemon = useMemo(() => {
    const lang = options.language;
    const nameKey = lang === "fr" ? "nameFr" : lang === "ja" ? "nameJa" : "nameEn";

    return [...activePokemon].sort((a, b) => {
      switch (options.sortBy) {
        case "name":
          return (a[nameKey] ?? "").localeCompare(b[nameKey] ?? "");
        case "type":
          return a.types[0].localeCompare(b.types[0]) || a.id - b.id;
        case "id":
        default:
          return a.id - b.id;
      }
    });
  }, [activePokemon, options.sortBy, options.language]);

  // Stats de progression
  const stats = useMemo(() => {
    const total = activePokemon.length;
    const found = guessed.size;
    const percent = total > 0 ? Math.round((found / total) * 100) : 0;
    return { total, found, percent };
  }, [activePokemon.length, guessed]);

  return {
    // Config
    options,
    setOptions,

    // État
    phase,
    guessed,
    revealed,

    // Données
    activePokemon,
    sortedPokemon,
    pokemonById,
    stats,

    // Actions
    startGame,
    submitGuess,
    finishGame,
    resetGame,
  };
}
