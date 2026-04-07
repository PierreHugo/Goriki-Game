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
  const { language, infinite, sortBy } = options;
  const isFr = language !== "en" && language !== "ja";

  const handleSortChange = (val) =>
    setOptions((prev) => ({ ...prev, sortBy: val }));

  return (
    <div className="game-screen">

      <header className="game-header">
        <h1 className="game-title">Goriki Game</h1>

        <div className={`game-timer ${timer.isUrgent ? "urgent" : ""}`}>
          {infinite
            ? (isFr ? "∞ Infini" : "∞ Infinite")
            : timer.formatted}
        </div>

        <button className="give-up-btn" onClick={onGiveUp}>
          {isFr ? "Abandonner" : "Give up"}
        </button>
      </header>

      <div className="game-input-wrapper">
        <InputGuess onSubmit={onSubmitGuess} language={language} />
      </div>

      <ProgressBar stats={stats} language={language} />

      <PokemonGrid
        sortedPokemon={sortedPokemon}
        guessed={guessed}
        pokemonById={pokemonById}
        language={language}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        revealed={false}
      />

    </div>
  );
}
