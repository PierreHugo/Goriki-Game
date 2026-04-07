import InputGuess from "../components/InputGuess";
import ProgressBar from "../components/ProgressBar";
import PokemonGrid from "../components/PokemonGrid";

export default function GameScreen({
  options,
  sortedPokemon,
  guessed,
  pokemonById,
  stats,
  timer,
  onSubmitGuess,
  onGiveUp,
}) {
  const { language, infinite, sortBy } = options;
  const isFr = language !== "en" && language !== "ja";

  return (
    <div className="game-screen">

      {/* --- Barre supérieure --- */}
      <header className="game-header">
        <h1 className="game-title">Goriki Game</h1>

        {/* Timer */}
        <div className={`game-timer ${timer.isUrgent ? "urgent" : ""}`}>
          {infinite
            ? (isFr ? "∞ Infini" : "∞ Infinite")
            : timer.formatted}
        </div>

        <button className="give-up-btn" onClick={onGiveUp}>
          {isFr ? "Abandonner" : "Give up"}
        </button>
      </header>

      {/* --- Champ de saisie --- */}
      <div className="game-input-wrapper">
        <InputGuess
          onSubmit={onSubmitGuess}
          language={language}
        />
      </div>

      {/* --- Progression --- */}
      <ProgressBar stats={stats} language={language} />

      {/* --- Tableau des Pokémon --- */}
      <PokemonGrid
        sortedPokemon={sortedPokemon}
        guessed={guessed}
        pokemonById={pokemonById}
        language={language}
        sortBy={sortBy}
        onSortChange={(val) =>
          options && (options.sortBy = val) // géré via setOptions dans App si besoin
        }
        revealed={false}
      />

    </div>
  );
}
