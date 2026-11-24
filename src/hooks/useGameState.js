import { useState, useCallback, useMemo, useEffect } from "react";
import { normalizeName, filterPokemon } from "./usePokeAPI";

export const DEFAULT_OPTIONS = {
  generations: [],
  types: [],
  categories: [],
  timerSeconds: 20 * 60,
  infinite: false,
  language: "fr",
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

  // Map nom normalisé → liste d'IDs (un nom peut matcher plusieurs formes)
  const nameToIds = useMemo(() => {
    const map = new Map();
    const addToMap = (key, id) => {
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(id);
    };
    activePokemon.forEach((p) => {
      addToMap(p.nameFrNormalized, p.id);
      addToMap(p.nameEnNormalized, p.id);
      if (p.nameJaNormalized) addToMap(p.nameJaNormalized, p.id);
    });
    return map;
  }, [activePokemon]);

  const stats = useMemo(() => {
    const total = activePokemon.length;
    const found = guessed.size;
    const percent = total > 0 ? Math.round((found / total) * 100) : 0;
    return { total, found, percent };
  }, [activePokemon.length, guessed]);

  // Victoire automatique
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

      // Cas spécial Nidoran
      if (normalized === "nidoran") {
        const nidoranIds = [29, 32].filter(
          (id) => activePokemon.some((p) => p.id === id) && !guessed.has(id)
        );
        const nidoranInActive = [29, 32].some((id) =>
          activePokemon.some((p) => p.id === id)
        );
        if (!nidoranInActive) return false;
        if (nidoranIds.length === 0) return "already";
        setGuessed((prev) => {
          const next = new Set(prev);
          nidoranIds.forEach((id) => next.add(id));
          return next;
        });
        return "success";
      }

      const ids = nameToIds.get(normalized);
      if (!ids || ids.length === 0) return false;

      // Filtre les IDs pas encore devinés
      const newIds = ids.filter((id) => !guessed.has(id));
      const allAlreadyGuessed = newIds.length === 0;

      if (allAlreadyGuessed) return "already";

      setGuessed((prev) => {
        const next = new Set(prev);
        newIds.forEach((id) => next.add(id));
        return next;
      });
      return "success";
    },
    [nameToIds, guessed, activePokemon]
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
    return [...activePokemon].sort((a, b) => {
      const aBase = a.isRegional ? a.baseId : a.id;
      const bBase = b.isRegional ? b.baseId : b.id;
      if (aBase !== bBase) return aBase - bBase;
      if (!a.isRegional && b.isRegional) return -1;
      if (a.isRegional && !b.isRegional) return 1;
      return 0;
    });
  }, [activePokemon]);

  return {
    options, setOptions,
    phase,
    guessed, revealed,
    activePokemon, sortedPokemon, pokemonById,
    stats,
    startGame, submitGuess, finishGame, resetGame,
  };
}
