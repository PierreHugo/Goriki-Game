import ProgressBar from "../components/ProgressBar";
import PokemonGrid from "../components/PokemonGrid";
import { useState } from "react";

const MESSAGES = {
  fr: {
    title: "Temps écoulé !",
    perfect: "Incroyable, tu les as tous trouvés ! 🎉",
    great: "Excellent ! Tu es un vrai dresseur 🔥",
    good: "Pas mal ! Tu connais bien ta Pokédex 👍",
    okay: "Courage, il y en a encore à apprendre ! 💪",
    bad: "T'as encore du boulot... 😅",
    restart: "Rejouer",
    revealed: "Les Pokémon non devinés sont affichés en gris.",
  },
  en: {
    title: "Time's up!",
    perfect: "Incredible, you found them all! 🎉",
    great: "Excellent! You're a true trainer 🔥",
    good: "Not bad! You know your Pokédex well 👍",
    okay: "Keep it up, there's more to learn! 💪",
    bad: "Still some work to do... 😅",
    restart: "Play again",
    revealed: "Pokémon you missed are shown in gray.",
  },
  ja: {
    title: "時間切れ！",
    perfect: "すごい！全部見つけた！🎉",
    great: "素晴らしい！本物のトレーナーだ 🔥",
    good: "悪くない！図鑑をよく知ってるね 👍",
    okay: "まだ覚えることがあるよ！💪",
    bad: "もっと頑張ろう... 😅",
    restart: "もう一度",
    revealed: "見つけられなかったポケモンはグレーで表示。",
  },
};

function getMessage(t, percent) {
  if (percent === 100) return t.perfect;
  if (percent >= 75)   return t.great;
  if (percent >= 50)   return t.good;
  if (percent >= 25)   return t.okay;
  return t.bad;
}

export default function ResultScreen({
  options,
  sortedPokemon,
  guessed,
  pokemonById,
  stats,
  onRestart,
}) {
  const { language, sortBy } = options;
  const [currentSort, setCurrentSort] = useState(sortBy ?? "id");
  const t = MESSAGES[language] ?? MESSAGES.fr;

  return (
    <div className="result-screen">

      {/* --- En-tête résultat --- */}
      <header className="result-header">
        <h1 className="result-title">{t.title}</h1>
        <p className="result-message">{getMessage(t, stats.percent)}</p>
        <p className="result-hint">{t.revealed}</p>
      </header>

      {/* --- Score --- */}
      <ProgressBar stats={stats} language={language} />

      {/* --- Grille complète (révélée) --- */}
      <PokemonGrid
        sortedPokemon={sortedPokemon}
        guessed={guessed}
        pokemonById={pokemonById}
        language={language}
        sortBy={currentSort}
        onSortChange={setCurrentSort}
        revealed={true}
      />

      {/* --- Bouton rejouer --- */}
      <div className="result-footer">
        <button className="start-btn" onClick={onRestart}>
          {t.restart}
        </button>
      </div>

    </div>
  );
}
