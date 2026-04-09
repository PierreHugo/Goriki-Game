import ProgressBar from "../components/ProgressBar";
import PokemonGrid from "../components/PokemonGrid";
import { useState } from "react";

const MESSAGES = {
  fr: {
    timeUp: "Temps écoulé !",
    victory: "Félicitations !",
    victoryMsg: "Tu les as tous trouvés ! Tu es un maître Pokémon 🏆",
    great: "Excellent ! Tu es un vrai dresseur 🔥",
    good: "Pas mal ! Tu connais bien ta Pokédex 👍",
    okay: "Courage, il y en a encore à apprendre ! 💪",
    bad: "T'as encore du boulot... 😅",
    restart: "Rejouer",
    revealed: "Les Pokémon non devinés sont affichés en gris.",
  },
  en: {
    timeUp: "Time's up!",
    victory: "Congratulations!",
    victoryMsg: "You found them all! You're a Pokémon Master 🏆",
    great: "Excellent! You're a true trainer 🔥",
    good: "Not bad! You know your Pokédex well 👍",
    okay: "Keep it up, there's more to learn! 💪",
    bad: "Still some work to do... 😅",
    restart: "Play again",
    revealed: "Pokémon you missed are shown in gray.",
  },
};

function getMessage(t, percent) {
  if (percent >= 75) return t.great;
  if (percent >= 50) return t.good;
  if (percent >= 25) return t.okay;
  return t.bad;
}

export default function ResultScreen({
  options,
  sortedPokemon,
  guessed,
  pokemonById,
  stats,
  isVictory,
  onRestart,
}) {
  const { language, sortBy } = options;
  const [currentSort, setCurrentSort] = useState(sortBy ?? "id");
  const lang = language === "en" ? "en" : "fr";
  const t = MESSAGES[lang];

  return (
    <div className="result-screen">

      <header className={`result-header ${isVictory ? "result-header--victory" : ""}`}>
        <h1 className="result-title">
          {isVictory ? t.victory : t.timeUp}
        </h1>
        <p className="result-message">
          {isVictory ? t.victoryMsg : getMessage(t, stats.percent)}
        </p>
        {!isVictory && (
          <p className="result-hint">{t.revealed}</p>
        )}
      </header>

      <ProgressBar stats={stats} language={language} />

      <PokemonGrid
        sortedPokemon={sortedPokemon}
        guessed={guessed}
        pokemonById={pokemonById}
        language={language}
        sortBy={currentSort}
        onSortChange={setCurrentSort}
        revealed={true}
      />

      <div className="result-footer">
        <button className="start-btn" onClick={onRestart}>
          {t.restart}
        </button>
      </div>

    </div>
  );
}
