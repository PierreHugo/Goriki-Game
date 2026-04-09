import { useRef } from "react";
import InputGuess from "../components/InputGuess";
import ProgressBar from "../components/ProgressBar";
import PokemonGrid from "../components/PokemonGrid";

export default function GameScreen({
  options,
  setOptions,
  sortedPokemon,
  guessed,
  pokemonById,
  stats,
  timer,
  onSubmitGuess,
  onGiveUp,
}) {
  const { language, infinite } = options;
  const isFr = language !== "en" && language !== "ja";
  const inputRef = useRef(null);

  return (
    <div className="game-screen">

      <header className="game-header">
        <h1 className="game-title">Goriki Game</h1>
        <div className={`game-timer ${timer.isUrgent ? "urgent" : ""}`}>
          {infinite ? (isFr ? "∞ Infini" : "∞ Infinite") : timer.formatted}
        </div>
        <button className="give-up-btn" onClick={onGiveUp}>
          {isFr ? "Abandonner" : "Give up"}
        </button>
      </header>

      <div className="game-input-sticky">
        <InputGuess
          ref={inputRef}
          onSubmit={onSubmitGuess}
          language={language}
        />
        <ProgressBar stats={stats} language={language} />
      </div>

      <PokemonGrid
        sortedPokemon={sortedPokemon}
        guessed={guessed}
        pokemonById={pokemonById}
        language={language}
        revealed={false}
        onSheetClose={() => inputRef.current?.focus()}
      />

    </div>
  );
}
