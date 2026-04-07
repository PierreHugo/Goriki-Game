import FilterPanel from "../components/FilterPanel";
import TimerSetup from "../components/TimerSetup";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function HomeScreen({ options, setOptions, onStart, totalCount }) {
  const update = (key, value) =>
    setOptions((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1 className="home-title">Goriki Game</h1>
        <p className="home-subtitle">
          Combien de Pokémon es-tu capable de nommer de mémoire ?
        </p>

        {/* Sélecteur de langue */}
        <div className="lang-selector">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-btn ${options.language === l.code ? "active" : ""}`}
              onClick={() => update("language", l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <main className="home-main">
        <FilterPanel options={options} setOptions={setOptions} />
        <TimerSetup options={options} setOptions={setOptions} />
      </main>

      <footer className="home-footer">
        <p className="pokemon-count">
          {totalCount} Pokémon sélectionné{totalCount > 1 ? "s" : ""}
        </p>
        <button
          className="start-btn"
          onClick={onStart}
          disabled={totalCount === 0}
        >
          Jouer
        </button>
      </footer>
    </div>
  );
}
