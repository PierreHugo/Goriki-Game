import { usePokeAPI } from "./hooks/usePokeAPI";
import { useGameState } from "./hooks/useGameState";
import { useTimer } from "./hooks/useTimer";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import ResultScreen from "./screens/ResultScreen";

export default function App() {
  const { pokemon, loading, progress, error } = usePokeAPI();

  const {
    options, setOptions,
    phase,
    guessed, revealed,
    activePokemon, sortedPokemon, pokemonById,
    stats,
    startGame, submitGuess, finishGame, resetGame,
  } = useGameState(pokemon);

  const timer = useTimer(options.timerSeconds, options.infinite, finishGame);

  // Chargement initial des données
  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/goriki-logo.png" alt="Goriki Game" className="logo" />
        <p className="loading-label">Chargement des Pokémon...</p>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="loading-percent">{Math.round(progress * 100)}%</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <p className="error-label">
          Impossible de charger les données Pokémon 😞
        </p>
        <p className="error-sub">{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  const handleStart = () => {
    startGame();
    timer.start();
  };

  const handleReset = () => {
    timer.reset();
    resetGame();
  };

  return (
    <>
      {phase === "home" && (
        <HomeScreen
          options={options}
          setOptions={setOptions}
          onStart={handleStart}
          totalCount={activePokemon.length}
        />
      )}

      {phase === "playing" && (
        <GameScreen
          options={options}
          sortedPokemon={sortedPokemon}
          guessed={guessed}
          pokemonById={pokemonById}
          stats={stats}
          timer={timer}
          onSubmitGuess={submitGuess}
          onGiveUp={finishGame}
        />
      )}

      {phase === "finished" && (
        <ResultScreen
          options={options}
          sortedPokemon={sortedPokemon}
          guessed={guessed}
          pokemonById={pokemonById}
          stats={stats}
          onRestart={handleReset}
        />
      )}
    </>
  );
}
