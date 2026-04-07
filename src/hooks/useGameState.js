import { useState, useCallback, useMemo, useEffect } from "react";
import { normalizeName, filterPokemon } from "./usePokeAPI";

export const DEFAULT_OPTIONS = {
  generations: [],
  types: [],
  categories: [],
  timerSeconds: 20 * 60,
  infinite: false,
  language: "fr",
  sortBy: "id",
};

export function useGameState(allPokemon, onVictory) {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [phase, setPhase] = useState("home");
  const [guessed, setGuessed] = useState(new Set());
  const [revealed, setRevealed] = useState(false);

  const activePokemon = useMemo(() => {
    if (!allPokemon.length) return [];
    const { generations, types, categories } = options;
    const hasFilter = generations.length || types.length || categories.length;
    if (!hasFilter) return allPokemon;
    return filterPokemon(allPokemon, { generations, types, categories });
  }, [allPokemon, options]);

  const pokemonById = useMemo(() => {
    return new Map(activePokemon.map((p) => [p.id, p]));
  }, [activePokemon]);

  const nameToId = useMemo(() => {
    const map = new Map();
    activePokemon.forEach((p) => {
      map.set(p.nameFrNormalized, p.id);
      map.set(p.nameEnNormalized, p.id);
      if (p.nameJaNormalized) map.set(p.nameJaNormalized, p.id);
    });
    return map;
  }, [activePokemon]);

  const stats = useMemo(() => {
    const total = activePokemon.length;
    const found = guessed.size;
    const percent = total > 0 ? Math.round((found / total) * 100) : 0;
    return { total, found, percent };
  }, [activePokemon.length, guessed]);

  // Victoire automatique dès que tout est trouvé
  useEffect(() => {
    if (
      phase === "playing" &&
      activePokemon.length > 0 &&
      guessed.size === activePokemon.length
    ) {
      setRevealed(true);
      setPhase("finished");
      onVictory?.();
    }
  }, [guessed, activePokemon.length, phase, onVictory]);

  const startGame = useCallback(() => {
    setGuessed(new Set());
    setRevealed(false);
    setPhase("playing");
  }, []);

  const submitGuess = useCallback(
    (rawInput) => {
      const normalized = normalizeName(rawInput);
      const id = nameToId.get(normalized);
      if (!id) return false;
      if (guessed.has(id)) return false;
      setGuessed((prev) => new Set(prev).add(id));
      return true;
    },
    [nameToId, guessed]
  );

  const finishGame = useCallback(() => {
    setRevealed(true);
    setPhase("finished");
  }, []);

  const resetGame = useCallback(() => {
    setGuessed(new Set());
    setRevealed(false);
    setPhase("home");
  }, []);

  const sortedPokemon = useMemo(() => {
    const lang = options.language;
    const nameKey = lang === "fr" ? "nameFr" : "nameEn";
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

  return {
    options, setOptions,
    phase,
    guessed, revealed,
    activePokemon, sortedPokemon, pokemonById,
    stats,
    startGame, submitGuess, finishGame, resetGame,
  };
}
